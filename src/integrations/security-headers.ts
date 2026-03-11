import type { AstroIntegration } from 'astro'

export function securityHeaders(): AstroIntegration {
  return {
    name: 'security-headers',
    hooks: {
      'astro:config:setup': async ({ addMiddleware, config }) => {
        addMiddleware('security-headers', './middleware/security-headers.ts')
        console.log('Security headers middleware configured')
      },
      'astro:build:done': async ({ dir }) => {
        console.log(`Security headers integration completed build at ${dir}`)
      },
    },
  }
}
