import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://statick88.github.io',
  output: 'static',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
    cssMinify: true,
  },
  vite: {
    server: {
      compress: true,
    },
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
  prefetch: {
    prefetchAll: import.meta.env.PROD,
    defaultStrategy: import.meta.env.PROD ? 'viewport' : false,
  },
})
