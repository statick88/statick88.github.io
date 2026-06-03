import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    globals: false,
    environment: 'node',
  },
});
