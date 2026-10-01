import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    globals: false,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    css: true,
    coverage: {
      // Vitest's default reporters are text, html, clover and json — none of
      // them is lcov. Without it SonarQube reports 0% coverage while every
      // test passes, which is a metric that lies rather than one that fails.
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
})
