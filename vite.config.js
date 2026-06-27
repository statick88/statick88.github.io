import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

// Generar hash SHA256 base64 de un archivo
const sha256 = (content) =>
  'sha256-' + crypto.createHash('sha256').update(content).digest('base64')

// CSP para GitHub Pages (solo <meta>, sin nonces, con hashes)
const getCspDirectives = (scriptHashes) => [
  "default-src 'self'",
  `script-src 'self' ${scriptHashes.join(' ')}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests"
].join('; ')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'csp-hashes-inject',
      apply: 'build',
      async closeBundle() {
        const distDir = path.resolve('dist')
        const indexPath = path.join(distDir, 'index.html')
        const assetsDir = path.join(distDir, 'assets')

        if (!fs.existsSync(indexPath) || !fs.existsSync(assetsDir)) return

        // Leer bundles JS generados para calcular hashes
        const jsFiles = fs.readdirSync(assetsDir)
          .filter(f => f.endsWith('.js'))
          .map(f => fs.readFileSync(path.join(assetsDir, f)))

        if (jsFiles.length === 0) return

        const scriptHashes = jsFiles.map(sha256)
        const csp = getCspDirectives(scriptHashes)

        // Leer y actualizar index.html
        let html = fs.readFileSync(indexPath, 'utf-8')
        html = html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`)
        fs.writeFileSync(indexPath, html)
        console.log('[CSP] Injected with hashes:', scriptHashes)
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion'
          }
        }
      }
    }
  },
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  }
})