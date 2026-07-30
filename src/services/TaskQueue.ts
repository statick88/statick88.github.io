/**
 * src/services/TaskQueue.ts — Web Worker pool orchestrator
 *
 * Manages a pool of forensic analysis workers, distributes jobs
 * across them, and provides pause/resume/queue-status capabilities.
 * Each submitted job returns a Promise that resolves with the report.
 */

import type {
  WorkerInMessage,
  WorkerOutMessage,
  ForensicReport,
  WorkerCompleteMessage,
  WorkerErrorMessage,
} from '@/types/forensic'

// ── Types ───────────────────────────────────────────────────────

/** Status of a single job in the queue */
export type JobStatus = 'pending' | 'active' | 'completed' | 'error' | 'paused'

/** Represents a single analysis job */
interface Job {
  /** Unique job identifier */
  id: string
  /** File identifier */
  fileId: string
  /** Raw file data */
  data: ArrayBuffer
  /** Current job status */
  status: JobStatus
  /** Promise resolve callback */
  resolve: (report: ForensicReport) => void
  /** Promise reject callback */
  reject: (error: Error) => void
  /** Progress callback */
  onProgress?: ((stage: string, progress: number) => void) | undefined
}

/** Queue status snapshot */
export interface QueueStatus {
  /** Number of jobs waiting to be processed */
  pending: number
  /** Number of jobs currently being processed */
  active: number
  /** Number of completed jobs */
  completed: number
  /** Total jobs in the system */
  total: number
}

/** Configuration for the task queue */
export interface TaskQueueConfig {
  /** Number of workers in the pool (default: hardware concurrency or 4) */
  poolSize?: number
  /** Custom worker factory — overrides the default Vite worker import */
  createWorker?: () => Worker
}

// ── Worker Pool ─────────────────────────────────────────────────

/** Wraps a raw Web Worker with state tracking */
interface PooledWorker {
  /** The underlying Worker instance */
  worker: Worker
  /** Whether this worker is currently processing a job */
  busy: boolean
  /** Index in the pool */
  index: number
}

// ── TaskQueue ───────────────────────────────────────────────────

/**
 * Manages a pool of Web Workers for forensic analysis.
 *
 * @example
 * ```ts
 * const queue = new TaskQueue({ poolSize: 4 })
 * const report = await queue.submit('file-1', arrayBuffer, (stage, pct) => {
 *   console.log(`${stage}: ${pct}%`)
 * })
 * console.log(queue.getStatus())
 * ```
 */
export class TaskQueue {
  private workers: PooledWorker[] = []
  private jobQueue: Job[] = []
  private activeJobs = new Map<string, Job>()
  private completedCount = 0
  private paused = false
  private readonly workerFactory: () => Worker

  constructor(config?: TaskQueueConfig) {
    this.workerFactory = config?.createWorker ?? this.defaultWorkerFactory
    const poolSize = config?.poolSize ?? this.getDefaultPoolSize()
    this.initWorkers(poolSize)
  }

  /**
   * Returns the default pool size based on hardware concurrency.
   * Falls back to 4 if navigator is not available (e.g. in tests).
   */
  private getDefaultPoolSize(): number {
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
      return navigator.hardwareConcurrency
    }
    return 4
  }

  /**
   * Creates and initializes the worker pool.
   * Each worker gets a message handler that routes responses.
   *
   * @param size - Number of workers to create
   */
  private initWorkers(size: number): void {
    for (let i = 0; i < size; i++) {
      const worker = this.workerFactory()
      this.workers.push({ worker, busy: false, index: i })
    }
  }

  /**
   * Default worker factory using Vite's `new URL` import pattern.
   */
  private readonly defaultWorkerFactory = (): Worker => {
    return new Worker(
      new URL('@/workers/forensic.worker.ts', import.meta.url),
      { type: 'module' },
    )
  }

  /**
   * Dispatches a message to a specific worker.
   *
   * @param pooledWorker - The worker to send the message to
   * @param message - The message payload
   */
  private dispatch(pooledWorker: PooledWorker, message: WorkerInMessage): void {
    pooledWorker.busy = true

    const handler = (event: MessageEvent<WorkerOutMessage>): void => {
      const msg = event.data

      if (msg.type === 'PROGRESS') {
        const job = this.activeJobs.get(msg.payload.fileId)
        job?.onProgress?.(msg.payload.stage, msg.payload.progress)
        return
      }

      if (msg.type === 'COMPLETE') {
        this.handleComplete(pooledWorker, msg)
        pooledWorker.worker.removeEventListener('message', handler)
        return
      }

      if (msg.type === 'ERROR') {
        this.handleError(pooledWorker, msg)
        pooledWorker.worker.removeEventListener('message', handler)
        return
      }
    }

    pooledWorker.worker.addEventListener('message', handler)
    pooledWorker.worker.postMessage(message)
  }

  /**
   * Handles a successful completion message from a worker.
   *
   * @param pooledWorker - The worker that completed
   * @param msg - The completion message
   */
  private handleComplete(pooledWorker: PooledWorker, msg: WorkerCompleteMessage): void {
    const job = this.activeJobs.get(msg.payload.fileId)
    if (job) {
      job.status = 'completed'
      this.completedCount++
      this.activeJobs.delete(msg.payload.fileId)
      job.resolve(msg.payload.report)
    }
    pooledWorker.busy = false
    this.processNext(pooledWorker)
  }

  /**
   * Handles an error message from a worker.
   *
   * @param pooledWorker - The worker that errored
   * @param msg - The error message
   */
  private handleError(pooledWorker: PooledWorker, msg: WorkerErrorMessage): void {
    const job = this.activeJobs.get(msg.payload.fileId)
    if (job) {
      job.status = 'error'
      this.activeJobs.delete(msg.payload.fileId)
      job.reject(new Error(msg.payload.error))
    }
    pooledWorker.busy = false
    this.processNext(pooledWorker)
  }

  /**
   * Assigns the next pending job to a free worker.
   *
   * @param pooledWorker - The worker to assign work to
   */
  private processNext(pooledWorker: PooledWorker): void {
    if (this.paused) return

    const nextJob = this.jobQueue.find((j) => j.status === 'pending')
    if (!nextJob) return

    nextJob.status = 'active'
    this.activeJobs.set(nextJob.fileId, nextJob)

    this.dispatch(pooledWorker, {
      type: 'ANALYZE',
      payload: { fileId: nextJob.fileId, data: nextJob.data },
    })
  }

  /**
   * Submits a file for forensic analysis.
   *
   * @param fileId - Unique identifier for the file
   * @param data - Raw file data as ArrayBuffer
   * @param onProgress - Optional progress callback
   * @returns Promise that resolves with the forensic report
   */
  submit(
    fileId: string,
    data: ArrayBuffer,
    onProgress?: (stage: string, progress: number) => void,
  ): Promise<ForensicReport> {
    return new Promise<ForensicReport>((resolve, reject) => {
      const job: Job = {
        id: `job-${fileId}-${Date.now()}`,
        fileId,
        data,
        status: 'pending',
        resolve,
        reject,
        onProgress,
      }

      this.jobQueue.push(job)

      // Try to assign immediately to a free worker
      const freeWorker = this.workers.find((w) => !w.busy)
      if (freeWorker && !this.paused) {
        job.status = 'active'
        this.activeJobs.set(fileId, job)
        this.dispatch(freeWorker, {
          type: 'ANALYZE',
          payload: { fileId, data },
        })
      }
    })
  }

  /**
   * Pauses all job processing. Active jobs continue to completion,
   * but no new jobs are dispatched.
   */
  pause(): void {
    this.paused = true
  }

  /**
   * Resumes job processing. Dispatches pending jobs to free workers.
   */
  resume(): void {
    this.paused = false
    for (const worker of this.workers) {
      if (!worker.busy) {
        this.processNext(worker)
      }
    }
  }

  /**
   * Returns a snapshot of the current queue status.
   */
  getStatus(): QueueStatus {
    const pending = this.jobQueue.filter((j) => j.status === 'pending').length
    const active = this.activeJobs.size
    return {
      pending,
      active,
      completed: this.completedCount,
      total: this.jobQueue.length + this.completedCount,
    }
  }

  /**
   * Terminates all workers in the pool and clears the queue.
   * All pending and active jobs are rejected.
   */
  destroy(): void {
    for (const worker of this.workers) {
      worker.worker.terminate()
    }
    this.workers = []

    const error = new Error('TaskQueue destroyed')

    // Reject all pending jobs
    for (const job of this.jobQueue) {
      if (job.status === 'pending') {
        job.reject(error)
      }
    }
    this.jobQueue = []

    // Reject all active jobs
    for (const [fileId, job] of this.activeJobs) {
      job.reject(error)
      this.activeJobs.delete(fileId)
    }
  }
}
