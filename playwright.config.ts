import { defineConfig, devices } from '@playwright/test'

/** Preview server the suite runs against (loopback only). */
const PREVIEW_HOST = '127.0.0.1'
const PREVIEW_PORT = 4173
const PREVIEW_URL = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`

/**
 * E2E configuration.
 *
 * The suite runs against a production build served by `vite preview`, not the
 * dev server: the console redesign ships as static assets, and the checks
 * below must hold for what users actually download.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: PREVIEW_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Pinned so the default-theme assertion cannot depend on the machine.
    colorScheme: 'dark',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: `pnpm build:quick && pnpm exec vite preview --port ${PREVIEW_PORT} --host ${PREVIEW_HOST}`,
    url: PREVIEW_URL,
    // Always build and serve the artifact under test: reusing whatever already
    // answers on the port can validate a server that never served this build.
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
