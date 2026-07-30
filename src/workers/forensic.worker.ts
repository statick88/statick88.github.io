/**
 * src/workers/forensic.worker.ts — Web Worker for forensic analysis
 *
 * Processes files sequentially through four stages:
 *   strings → entropy → signatures → report
 *
 * Posts progress updates and the final report back to the main thread.
 * Runs in its own thread — no DOM access, no imports from React components.
 */

import type {
  WorkerInMessage,
  WorkerOutMessage,
  ForensicReport,
  SignatureMatch,
} from '@/types/forensic'

// ── Magic Signatures ────────────────────────────────────────────

/** Known file signatures: magic bytes → name */
const MAGIC_SIGNATURES: Array<{ bytes: number[]; name: string }> = [
  { bytes: [0x89, 0x50, 0x4e, 0x47], name: 'PNG Image' },
  { bytes: [0xff, 0xd8, 0xff], name: 'JPEG Image' },
  { bytes: [0x47, 0x49, 0x46, 0x38], name: 'GIF Image' },
  { bytes: [0x25, 0x50, 0x44, 0x46], name: 'PDF Document' },
  { bytes: [0x50, 0x4b, 0x03, 0x04], name: 'ZIP Archive' },
  { bytes: [0x52, 0x61, 0x72, 0x21], name: 'RAR Archive' },
  { bytes: [0x1f, 0x8b], name: 'Gzip Archive' },
  { bytes: [0x7f, 0x45, 0x4c, 0x46], name: 'ELF Binary' },
  { bytes: [0x4d, 0x5a], name: 'PE/EXE Binary' },
  { bytes: [0x00, 0x00, 0x01, 0x00], name: 'ICO Image' },
  { bytes: [0x42, 0x4d], name: 'BMP Image' },
  { bytes: [0x49, 0x44, 0x33], name: 'MP3 Audio' },
  { bytes: [0x66, 0x4c, 0x61, 0x43], name: 'FLAC Audio' },
  { bytes: [0x67, 0x69, 0x66], name: 'GIF (alt)' },
  { bytes: [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65], name: 'SQLite Database' },
  { bytes: [0x4f, 0x67, 0x67, 0x53], name: 'Ogg Container' },
  { bytes: [0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70], name: 'MP4 Video' },
  { bytes: [0x1a, 0x45, 0xdf, 0xa3], name: 'Matroska/WebM' },
  { bytes: [0x49, 0x49, 0x2a, 0x00], name: 'TIFF Image (LE)' },
  { bytes: [0x4d, 0x4d, 0x00, 0x2a], name: 'TIFF Image (BE)' },
]

/** Minimum string length for extraction */
const MIN_STRING_LENGTH = 4

// ── Post Helpers ────────────────────────────────────────────────

/**
 * Posts a message to the main thread.
 * @param msg - Message to post
 */
function post(msg: WorkerOutMessage): void {
  self.postMessage(msg)
}

// ── Stage 1: String Extraction ──────────────────────────────────

/**
 * Extracts printable ASCII strings from binary data.
 * Returns strings of at least MIN_STRING_LENGTH characters.
 *
 * @param data - Raw file bytes
 * @returns Array of extracted strings
 */
function extractStrings(data: ArrayBuffer): string[] {
  const bytes = new Uint8Array(data)
  const strings: string[] = []
  let current = ''

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i]!
    // Printable ASCII range (32–126) plus tab (9) and newline (10, 13)
    if (byte >= 32 && byte <= 126) {
      current += String.fromCharCode(byte)
    } else {
      if (current.length >= MIN_STRING_LENGTH) {
        strings.push(current)
      }
      current = ''
    }
  }

  // Don't forget trailing string
  if (current.length >= MIN_STRING_LENGTH) {
    strings.push(current)
  }

  return strings
}

// ── Stage 2: Shannon Entropy ────────────────────────────────────

/**
 * Calculates Shannon entropy of binary data.
 * Returns a value between 0 (uniform) and 8 (maximum randomness for bytes).
 *
 * @param data - Raw file bytes
 * @returns Shannon entropy value
 */
function calculateEntropy(data: ArrayBuffer): number {
  const bytes = new Uint8Array(data)

  if (bytes.length === 0) return 0

  // Count byte frequency
  const freq = new Float64Array(256)
  for (let i = 0; i < bytes.length; i++) {
    const idx = bytes[i]!
    freq[idx] = (freq[idx] ?? 0) + 1
  }

  // Calculate Shannon entropy
  let entropy = 0
  const len = bytes.length
  for (let i = 0; i < 256; i++) {
    const count = freq[i]!
    if (count === 0) continue
    const p = count / len
    entropy -= p * Math.log2(p)
  }

  return entropy
}

// ── Stage 3: Signature Scan ─────────────────────────────────────

/**
 * Scans binary data for known file signatures (magic bytes).
 *
 * @param data - Raw file bytes
 * @returns Array of signature matches with confidence scores
 */
function scanSignatures(data: ArrayBuffer): SignatureMatch[] {
  const bytes = new Uint8Array(data)
  const matches: SignatureMatch[] = []

  for (const sig of MAGIC_SIGNATURES) {
    if (sig.bytes.length > bytes.length) continue

    // Search the first 1024 bytes for signatures (common practice)
    const searchLimit = Math.min(bytes.length, 1024)
    for (let offset = 0; offset <= searchLimit - sig.bytes.length; offset++) {
      let found = true
      for (let j = 0; j < sig.bytes.length; j++) {
        if (bytes[offset + j] !== sig.bytes[j]) {
          found = false
          break
        }
      }

      if (found) {
        // Confidence decreases slightly with offset from start
        const confidence = Math.max(0.5, 1 - offset / searchLimit)
        matches.push({
          name: sig.name,
          offset,
          confidence,
        })
        break // One match per signature type is enough
      }
    }
  }

  return matches
}

// ── Stage 4: Report Generation ──────────────────────────────────

/**
 * Generates a complete forensic report from analysis results.
 *
 * @param fileId - Identifier of the analyzed file
 * @param sessionId - Identifier of the parent session
 * @param strings - Extracted strings
 * @param entropy - Calculated entropy
 * @param signatures - Detected signatures
 * @returns Complete forensic report
 */
function generateReport(
  fileId: string,
  sessionId: string,
  strings: string[],
  entropy: number,
  signatures: SignatureMatch[],
): ForensicReport {
  return {
    id: `report-${fileId}-${Date.now()}`,
    sessionId,
    fileId,
    strings,
    entropy,
    signatures,
    generatedAt: Date.now(),
  }
}

// ── Message Handler ─────────────────────────────────────────────

self.onmessage = (event: MessageEvent<WorkerInMessage>): void => {
  const { type, payload } = event.data

  if (type !== 'ANALYZE') {
    console.warn(`[forensic.worker] Unknown message type: ${type}`)
    return
  }

  const { fileId, data } = payload

  if (!data) {
    post({ type: 'ERROR', payload: { fileId, error: 'No data provided' } })
    return
  }

  try {
    // Stage 1: Extract Strings (0–25%)
    post({ type: 'PROGRESS', payload: { fileId, stage: 'strings', progress: 0 } })
    const strings = extractStrings(data)
    post({ type: 'PROGRESS', payload: { fileId, stage: 'strings', progress: 25 } })

    // Stage 2: Shannon Entropy (25–50%)
    post({ type: 'PROGRESS', payload: { fileId, stage: 'entropy', progress: 25 } })
    const entropy = calculateEntropy(data)
    post({ type: 'PROGRESS', payload: { fileId, stage: 'entropy', progress: 50 } })

    // Stage 3: Signature Scan (50–75%)
    post({ type: 'PROGRESS', payload: { fileId, stage: 'signatures', progress: 50 } })
    const signatures = scanSignatures(data)
    post({ type: 'PROGRESS', payload: { fileId, stage: 'signatures', progress: 75 } })

    // Stage 4: Report Generation (75–100%)
    post({ type: 'PROGRESS', payload: { fileId, stage: 'report', progress: 75 } })
    const report = generateReport(fileId, '', strings, entropy, signatures)
    post({ type: 'PROGRESS', payload: { fileId, stage: 'report', progress: 100 } })

    // Complete
    post({ type: 'COMPLETE', payload: { fileId, report } })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    post({ type: 'ERROR', payload: { fileId, error: message } })
  }
}
