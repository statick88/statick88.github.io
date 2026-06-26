import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Generate CSP nonce for inline scripts
const cspNonce = () => {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64')
}

// CSP directives for production
const getCspDirectives = (nonce) => [
  "default-src 'self'",
  "script-src 'self' 'nonce-{NONCE}' 'strict-dynamic'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests"
].map(d => d.replace('{NONCE}', nonce)).join('; ')

export default defineConfig({
  plugins: [
    react(),
    // Plugin to inject CSP nonce into index.html
    {
      name: 'csp-nonce-inject',
      transformIndexHtml(html) {
        if (process.env.NODE_ENV === 'production') {
          const nonce = cspNonce()
          const csp = getCspDirectives(nonce)
          return html
            .replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`)
            .replace('<script type="module" src="/src/main.jsx"></script>', `<script type="module" nonce="${nonce}" src="/src/main.jsx"></script>`)
        }
        return html
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion']
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
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': getCspDirectives('preview-nonce-placeholder')
    }
  }
})