/**
 * src/__tests__/stress.test.ts — Stress tests for the forensic TaskQueue
 *
 * Verifies that the TaskQueue can handle multiple concurrent 1MB file analyses
 * without errors and within reasonable memory bounds.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import type { ForensicReport, WorkerOutMessage, AnalysisStage } from '@/types/forensic'
import { TaskQueue } from '@/services/TaskQueue'

// ── Mock Worker ─────────────────────────────────────────────────

let workerCounter = 0

/**
 * Mock Web Worker that synchronously responds to ANALYZE messages.
 * Safe because TaskQueue.dispatch calls addEventListener BEFORE postMessage,
 * so the listener is registered when the mock fires.
 */
class MockWorker {
  private listeners = new Map<string, EventListener[]>()
  public id: number

  constructor() {
    this.id = workerCounter++
  }

  postMessage(data: unknown): void {
    const msg = data as { type: string; payload: { fileId: string; data: ArrayBuffer } }

    if (msg.type !== 'ANALYZE') return

    const { fileId } = msg.payload

    const stages: AnalysisStage[] = ['strings', 'entropy', 'signatures', 'report']
    for (const stage of stages) {
      this.emit('message', {
        type: 'PROGRESS',
        payload: { fileId, stage, progress: 0 },
      } satisfies WorkerOutMessage)
    }

    const report: ForensicReport = {
      id: `report-${fileId}-${Date.now()}`,
      sessionId: 'stress-test',
      fileId,
      strings: ['mock-string-1', 'mock-string-2'],
      entropy: 5.5,
      signatures: [{ name: 'PNG Image', offset: 0, confidence: 1 }],
      generatedAt: Date.now(),
    }

    this.emit('message', { type: 'COMPLETE', payload: { fileId, report } } satisfies WorkerOutMessage)
  }

  private emit(type: string, data: unknown): void {
    const handlers = this.listeners.get(type) ?? []
    for (const handler of handlers) {
      handler(new MessageEvent('message', { data }))
    }
  }

  terminate(): void {
    this.listeners.clear()
  }

  addEventListener(type: string, handler: EventListener): void {
    const list = this.listeners.get(type) ?? []
    list.push(handler)
    this.listeners.set(type, list)
  }

  removeEventListener(type: string, handler: EventListener): void {
    const list = this.listeners.get(type) ?? []
    this.listeners.set(
      type,
      list.filter((h) => h !== handler),
    )
  }
}

/** Factory that creates MockWorker instances for the TaskQueue */
function createMockWorker(): Worker {
  return new MockWorker() as unknown as Worker
}

// ── Helpers ─────────────────────────────────────────────────────

/** Creates a mock 1MB ArrayBuffer filled with pseudo-random data */
function createMockFile(id: number): ArrayBuffer {
  const size = 1024 * 1024 // 1 MB
  const buffer = new ArrayBuffer(size)
  const view = new Uint8Array(buffer)

  let seed = id * 2654435761
  for (let i = 0; i < size; i++) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff
    view[i] = (seed >>> 24) & 0xff
  }

  return buffer
}

// ── Tests ───────────────────────────────────────────────────────

describe('TaskQueue stress tests', () => {
  let queue: TaskQueue

  beforeEach(() => {
    workerCounter = 0
  })

  afterEach(() => {
    queue?.destroy()
  })

  it('processes 5 concurrent 1MB files without errors', async () => {
    queue = new TaskQueue({ poolSize: 4, createWorker: createMockWorker })

    const files = Array.from({ length: 5 }, (_, i) => ({
      id: `file-${i}`,
      data: createMockFile(i),
    }))

    // Mock workers fire synchronously — all promises resolve in the microtask after submit
    const promises = files.map((file) => queue.submit(file.id, file.data))
    const results = await Promise.all(promises)

    expect(results).toHaveLength(5)

    for (const report of results) {
      expect(report).toBeDefined()
      expect(report.id).toMatch(/^report-/)
      expect(report.fileId).toMatch(/^file-/)
      expect(report.strings).toBeInstanceOf(Array)
      expect(typeof report.entropy).toBe('number')
      expect(report.signatures).toBeInstanceOf(Array)
      expect(report.generatedAt).toBeGreaterThan(0)
    }
  })

  it('reports correct queue status across lifecycle', async () => {
    queue = new TaskQueue({ poolSize: 4, createWorker: createMockWorker })

    const file1Data = createMockFile(0)
    const file2Data = createMockFile(1)

    expect(queue.getStatus()).toEqual({
      pending: 0,
      active: 0,
      completed: 0,
      total: 0,
    })

    const p1 = queue.submit('file-1', file1Data)
    const p2 = queue.submit('file-2', file2Data)

    const statusAfterSubmit = queue.getStatus()
    expect(statusAfterSubmit.total).toBeGreaterThanOrEqual(2)

    await Promise.all([p1, p2])

    const statusAfterComplete = queue.getStatus()
    expect(statusAfterComplete.completed).toBe(2)
    expect(statusAfterComplete.pending).toBe(0)
    expect(statusAfterComplete.active).toBe(0)
  })

  it('calls progress callbacks during analysis', async () => {
    queue = new TaskQueue({ poolSize: 4, createWorker: createMockWorker })

    const progressCalls: Array<{ stage: string; progress: number }> = []
    const data = createMockFile(99)

    const p = queue.submit(
      'file-progress',
      data,
      (stage, progress) => {
        progressCalls.push({ stage, progress })
      },
    )

    await p

    expect(progressCalls.length).toBeGreaterThan(0)
    const stages = progressCalls.map((c) => c.stage)
    expect(stages).toContain('strings')
    expect(stages).toContain('entropy')
    expect(stages).toContain('signatures')
    expect(stages).toContain('report')
  })

  it('does not exceed reasonable memory limits', async () => {
    queue = new TaskQueue({ poolSize: 4, createWorker: createMockWorker })

    const perf = performance as unknown as { memory?: { usedJSHeapSize: number } }
    const memBefore = perf.memory?.usedJSHeapSize ?? 0

    const files = Array.from({ length: 5 }, (_, i) => ({
      id: `mem-file-${i}`,
      data: createMockFile(i),
    }))

    const promises = files.map((file) => queue.submit(file.id, file.data))
    await Promise.all(promises)

    if (typeof globalThis.gc === 'function') {
      globalThis.gc()
    }

    const memAfter = perf.memory?.usedJSHeapSize ?? 0

    if (memBefore > 0 && memAfter > 0) {
      const memIncreaseMB = (memAfter - memBefore) / (1024 * 1024)
      expect(memIncreaseMB).toBeLessThan(100)
    }
  })

  it('handles pause and resume correctly', async () => {
    queue = new TaskQueue({ poolSize: 4, createWorker: createMockWorker })

    queue.pause()

    const data = createMockFile(0)
    const p1 = queue.submit('file-paused', data)

    const statusWhilePaused = queue.getStatus()
    expect(statusWhilePaused.pending).toBe(1)

    queue.resume()

    const report = await p1
    expect(report).toBeDefined()
    expect(report.fileId).toBe('file-paused')
  })

  it('terminates cleanly with destroy()', async () => {
    // Use a controllable mock that holds responses until we tell it to respond
    const pendingResponses: Array<() => void> = []
    const holdableMock = {
      createWorker: (): Worker => {
        const worker = new MockWorker() as unknown as MockWorker & Worker
        const origPostMessage = worker.postMessage.bind(worker)
        worker.postMessage = (data: unknown) => {
          const msg = data as { type: string }
          if (msg.type === 'ANALYZE') {
            // Don't respond — queue the response
            pendingResponses.push(() => origPostMessage(data))
          }
        }
        return worker as unknown as Worker
      },
    }

    queue = new TaskQueue({ poolSize: 1, createWorker: holdableMock.createWorker })

    const data = createMockFile(0)
    const p1 = queue.submit('file-destroy', data)

    // Job is dispatched but hasn't responded yet
    expect(queue.getStatus().active).toBe(1)

    queue.destroy()

    await expect(p1).rejects.toThrow('TaskQueue destroyed')

    expect(queue.getStatus()).toEqual({
      pending: 0,
      active: 0,
      completed: 0,
      total: 0,
    })

    // Clean up — don't let responses fire after destroy
    pendingResponses.length = 0
  })
})
