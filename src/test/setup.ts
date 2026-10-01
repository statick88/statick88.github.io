/**
 * src/test/setup.ts — Global test setup for Vitest
 *
 * Loaded before every test file via vitest.config.js setupFiles.
 * Configures @testing-library/jest-dom matchers for Vitest.
 */

import '@testing-library/jest-dom/vitest'

/**
 * ── Why this shim exists ────────────────────────────────────────────────
 *
 * Node >= 22 ships an *experimental* `localStorage` global: an own,
 * lazy accessor on globalThis that resolves to
 * `require('internal/webstorage').localStorage`. Without the
 * `--localstorage-file` flag it yields `undefined` (plus an
 * ExperimentalWarning), rather than throwing.
 *
 * Vitest's `jsdom` environment makes `globalThis === jsdom window` and
 * mirrors jsdom's window properties onto globalThis via `populateGlobal`.
 * That mirroring calls `getWindowKeys`, which keeps a key only when it is
 * NOT already present on globalThis — unless the key appears in Vitest's
 * hardcoded `KEYS` list. `localStorage` is absent from that list, so
 * because Node already defined it, jsdom's working `Storage` accessor is
 * never installed and the broken Node accessor wins.
 *
 * The symptom is `localStorage === undefined`, which crashed test suites
 * in their `beforeEach` before a single assertion ran.
 *
 * We rebind the global to the `Storage` owned by the very jsdom window
 * Vitest created. This is preferable to passing `--localstorage-file`
 * because it is Node-version independent (CI pins Node 22, local dev may
 * be newer), keeps the real jsdom `Storage` semantics and origin, and
 * costs nothing at runtime. The guard makes it a no-op on any runtime
 * where the global already resolves to a usable Storage.
 */
interface WebStorageLike {
  clear(): void
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  key(index: number): string | null
  readonly length: number
}

function isUsableStorage(value: unknown): value is WebStorageLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as WebStorageLike).clear === 'function' &&
    typeof (value as WebStorageLike).getItem === 'function'
  )
}

const testGlobal = globalThis as typeof globalThis & {
  jsdom?: { window: Window & typeof globalThis }
}

// Only run under the jsdom environment, where `global.jsdom` is published.
const jsdomWindow = testGlobal.jsdom?.window

if (jsdomWindow && !isUsableStorage(testGlobal.localStorage)) {
  const jsdomStorage = jsdomWindow.localStorage

  if (isUsableStorage(jsdomStorage)) {
    // Defined as an accessor (not a plain value) to mirror how jsdom
    // itself exposes `localStorage`, and `configurable` so Vitest's
    // per-file environment teardown can still remove it.
    Object.defineProperty(testGlobal, 'localStorage', {
      get: () => jsdomStorage,
      configurable: true,
      enumerable: true,
    })
  }
}
