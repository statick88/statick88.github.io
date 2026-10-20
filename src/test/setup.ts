/**
 * src/test/setup.ts — Global test setup for Vitest
 *
 * Loaded before every test file via vitest.config.js setupFiles.
 * Configures @testing-library/jest-dom matchers for Vitest and guarantees a
 * working Web Storage implementation.
 */

import '@testing-library/jest-dom/vitest'

/**
 * Node >= 22 ships an experimental global `localStorage` that resolves to
 * `undefined` unless the process is started with `--localstorage-file`, and
 * inside Vitest that global shadows the jsdom implementation. Any test that
 * exercises persistence would then crash on `localStorage.clear()`.
 *
 * Installing a minimal in-memory Storage when the platform one is missing
 * keeps the suite deterministic across Node versions.
 */
function installWebStorage(name: 'localStorage' | 'sessionStorage'): void {
  const target = globalThis as unknown as Record<string, unknown>
  if (target[name]) return

  const store = new Map<string, string>()

  const storage: Storage = {
    get length() {
      return store.size
    },
    key(index: number): string | null {
      const keys = Array.from(store.keys())
      return index >= 0 && index < keys.length ? (keys[index] as string) : null
    },
    getItem(key: string): string | null {
      return store.has(key) ? (store.get(key) as string) : null
    },
    setItem(key: string, value: string): void {
      store.set(String(key), String(value))
    },
    removeItem(key: string): void {
      store.delete(key)
    },
    clear(): void {
      store.clear()
    },
  }

  Object.defineProperty(target, name, {
    value: storage,
    configurable: true,
    writable: true,
  })
}

installWebStorage('localStorage')
installWebStorage('sessionStorage')

/**
 * jsdom does not implement IntersectionObserver, which the scroll spy relies on.
 * The stub keeps the observed elements inert: tests that need scroll-spy
 * behaviour drive it explicitly, the rest only need the hook to mount.
 */
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverStub implements IntersectionObserver {
    readonly root: Element | null = null
    readonly rootMargin: string = ''
    readonly thresholds: ReadonlyArray<number> = []

    constructor(
      private readonly callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      this.root = (options?.root as Element | null) ?? null
      this.rootMargin = options?.rootMargin ?? ''
      this.thresholds = Array.isArray(options?.threshold)
        ? options.threshold
        : [options?.threshold ?? 0]
    }

    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }

  Object.defineProperty(globalThis, 'IntersectionObserver', {
    value: IntersectionObserverStub,
    configurable: true,
    writable: true,
  })
}
