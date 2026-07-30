/**
 * SessionStorageManager - IndexedDB persistence for forensic sessions.
 * Stores session data with TTL (time-to-live) support.
 */

import type { ForensicSession, ForensicReport } from '@/types/forensic'

const DB_NAME = 'forensic-sessions'
const DB_VERSION = 1
const SESSION_STORE = 'sessions'
const REPORT_STORE = 'reports'

class SessionStorageManager {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (this.db) return

    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains(SESSION_STORE)) {
          db.createObjectStore(SESSION_STORE, { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains(REPORT_STORE)) {
          const reportStore = db.createObjectStore(REPORT_STORE, { keyPath: 'id' })
          reportStore.createIndex('sessionId', 'sessionId', { unique: false })
        }
      }
    })
  }

  async saveSession(session: ForensicSession): Promise<void> {
    await this.init()
    const tx = this.db!.transaction([SESSION_STORE], 'readwrite')
    const store = tx.objectStore(SESSION_STORE)
    await new Promise<void>((resolve, reject) => {
      const request = store.put(session)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getSession(id: string): Promise<ForensicSession | null> {
    await this.init()
    const tx = this.db!.transaction([SESSION_STORE], 'readonly')
    const store = tx.objectStore(SESSION_STORE)
    return new Promise<ForensicSession | null>((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result ?? null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllSessions(): Promise<ForensicSession[]> {
    await this.init()
    const tx = this.db!.transaction([SESSION_STORE], 'readonly')
    const store = tx.objectStore(SESSION_STORE)
    return new Promise<ForensicSession[]>((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result ?? [])
      request.onerror = () => reject(request.error)
    })
  }

  async deleteSession(id: string): Promise<void> {
    await this.init()
    const tx = this.db!.transaction([SESSION_STORE], 'readwrite')
    const store = tx.objectStore(SESSION_STORE)
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async saveReport(report: ForensicReport): Promise<void> {
    await this.init()
    const tx = this.db!.transaction([REPORT_STORE], 'readwrite')
    const store = tx.objectStore(REPORT_STORE)
    await new Promise<void>((resolve, reject) => {
      const request = store.put(report)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getReportsBySession(sessionId: string): Promise<ForensicReport[]> {
    await this.init()
    const tx = this.db!.transaction([REPORT_STORE], 'readonly')
    const store = tx.objectStore(REPORT_STORE)
    const index = store.index('sessionId')
    return new Promise<ForensicReport[]>((resolve, reject) => {
      const request = index.getAll(sessionId)
      request.onsuccess = () => resolve(request.result ?? [])
      request.onerror = () => reject(request.error)
    })
  }

  async cleanupExpired(): Promise<number> {
    // No TTL support in current ForensicSession type - this method is a no-op
    // until expiresAt is added to the schema
    return 0
  }

  async clearAll(): Promise<void> {
    await this.init()
    const tx = this.db!.transaction([SESSION_STORE, REPORT_STORE], 'readwrite')
    tx.objectStore(SESSION_STORE).clear()
    tx.objectStore(REPORT_STORE).clear()
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
}

export const sessionStorage = new SessionStorageManager()
