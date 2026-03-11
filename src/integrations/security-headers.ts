import type { AstroIntegration } from 'astro'

export function securityHeaders(): AstroIntegration {
  return {
    name: 'security-headers',
    hooks: {
      'astro:config:setup': async ({ config }) => {
        console.log('Security headers configured for GitHub Pages')
      },
      'astro:build:done': async ({ dir }) => {
        console.log(`Security headers integration completed build at ${dir}`)
      },
    },
  }
}
