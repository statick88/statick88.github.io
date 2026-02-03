import { defineConfig } from 'vitest/config';
import jsdom from 'jsdom';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
});
