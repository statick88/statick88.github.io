/**
 * src/types/forensic.ts — Type definitions for the forensic analysis system
 *
 * Shared types used across workers, services, and components.
 */

// ── File Metadata ────────────────────────────────────────────────

export interface FileMetadata {
  id: string
  name: string
  size: number
  type: string
  sha256?: string
}

// ── Analysis Stages ──────────────────────────────────────────────

export type AnalysisStage = 'strings' | 'entropy' | 'signatures' | 'report'

export const ANALYSIS_STAGES: readonly AnalysisStage[] = [
  'strings',
  'entropy',
  'signatures',
  'report',
] as const

// ── Signature Detection ──────────────────────────────────────────

export interface SignatureMatch {
  name: string
  offset: number
  confidence: number
}

// ── Intelligence Result ──────────────────────────────────────────

export interface IntelResult {
  malicious: boolean
  detections: number
  engines: number
  permalink?: string
  cached?: boolean
}

// ── Forensic Report ──────────────────────────────────────────────

export interface ForensicReport {
  id: string
  sessionId: string
  fileId: string
  strings: string[]
  entropy: number
  signatures: SignatureMatch[]
  intel?: IntelResult
  generatedAt: number
}

// ── Session ──────────────────────────────────────────────────────

export type SessionStatus = 'pending' | 'running' | 'paused' | 'completed' | 'error'

export interface ForensicSession {
  id: string
  name: string
  files: FileMetadata[]
  status: SessionStatus
  createdAt: number
  updatedAt: number
  currentStage?: AnalysisStage
  progress?: number
  reports?: ForensicReport[]
}

// ── Worker Messages ──────────────────────────────────────────────

export interface WorkerInMessage {
  type: 'ANALYZE' | 'CANCEL' | 'PING'
  payload: {
    fileId: string
    data?: ArrayBuffer
    fileName?: string
  }
}

export interface WorkerProgressMessage {
  type: 'PROGRESS'
  payload: {
    fileId: string
    stage: AnalysisStage
    progress: number
  }
}

export interface WorkerCompleteMessage {
  type: 'COMPLETE'
  payload: {
    fileId: string
    report: ForensicReport
  }
}

export interface WorkerErrorMessage {
  type: 'ERROR'
  payload: {
    fileId: string
    error: string
  }
}

export interface WorkerPongMessage {
  type: 'PONG'
}

export type WorkerOutMessage =
  | WorkerProgressMessage
  | WorkerCompleteMessage
  | WorkerErrorMessage
  | WorkerPongMessage

// ── Task Queue ───────────────────────────────────────────────────

export interface QueuedJob {
  id: string
  fileId: string
  data: ArrayBuffer
  fileName: string
  status: 'pending' | 'active' | 'completed' | 'error' | 'paused'
  result?: ForensicReport
  error?: string
  createdAt: number
}

export interface QueueStatus {
  pending: number
  active: number
  completed: number
  total: number
}
