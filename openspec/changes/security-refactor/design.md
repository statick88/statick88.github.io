# Security Refactor Technical Design

## Architecture Overview

The security refactor for the Astro-based portfolio website will implement three main security improvements:
1. Comprehensive security headers via a custom Astro integration
2. Secure CORS configuration
3. Removal of inline scripts to eliminate XSS vulnerabilities

## Security Headers Implementation

### Custom Astro Integration

Create a custom Astro integration in `src/integrations/security-headers.ts` to add security headers to all responses. This integration will:

```typescript
import type { AstroIntegration } from 'astro'

export function securityHeaders(): AstroIntegration {
  return {
    name: 'security-headers',
    hooks: {
      'astro:config:setup': ({ addMiddleware }) => {
        addMiddleware({
          entrypoint: './src/middleware/security-headers.ts',
        })
      },
    },
  }
}
```

### Security Headers Middleware

Implement the middleware in `src/middleware/security-headers.ts`:

```typescript
import type { MiddlewareHandler } from 'astro'

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next()
  
  // Security Headers
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'sha256-...'",
    "style-src 'self' https://fonts.googleapis.com 'sha256-...'",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://*.githubusercontent.com",
    "frame-src 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ].join('; '))
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), clipboard-read=(), clipboard-write=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), interest-cohort=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()')
  
  return response
}
```

### Astro Configuration

Update `astro.config.mjs` to include the custom integration:

```javascript
import { defineConfig } from 'astro/config'
import { securityHeaders } from './src/integrations/security-headers'

export default defineConfig({
  site: 'https://statick88.github.io',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    securityHeaders(),
  ],
  // Existing config...
})
```

## CORS Configuration

Since the site is a static site deployed on GitHub Pages, CORS configuration is typically handled by the server. However, to ensure secure CORS behavior:

1. Remove any existing CORS headers that may be set
2. Configure appropriate CSP directives to restrict cross-origin requests
3. For any API calls, ensure they are to trusted domains

## Inline Scripts Mitigation

### Script File Structure

Create external script files in `src/scripts/`:

1. `src/scripts/theme.js` - Handles theme detection and application
2. `src/scripts/lang.js` - Handles language detection and application
3. `src/scripts/cv-data.js` - Injects CV data into the window object
4. `src/scripts/i18n.js` - Handles internationalization

### Theme Script (`src/scripts/theme.js`)

```javascript
const theme = (() => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme')
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
})()

if (theme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
```

### Language Script (`src/scripts/lang.js`)

```javascript
const lang = (() => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) {
    return localStorage.getItem('lang')
  }
  return 'es'
})()

document.documentElement.setAttribute('lang', lang)
```

### CV Data Script (`src/scripts/cv-data.js`)

```javascript
export function injectCvData(data) {
  window.cvData = data
}
```

### i18n Script (`src/scripts/i18n.js`)

```javascript
const translations = {
  // ...existing translations...
}

function getNestedValue(obj, path) {
  if (!obj || !path) return undefined
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return current[key]
    }
    return undefined
  }, obj)
}

function getTranslation(value, lang) {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map(item => getTranslation(item, lang))
    }
    if ('es' in value || 'en' in value) {
      return value[lang] || value.es || value.en || JSON.stringify(value)
    }
    return JSON.stringify(value)
  }
  return value
}

function updateContent(lang) {
  const t = translations[lang]
  const cvData = window.cvData || {}
  
  if (!t) return
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (!key) return
    
    let value
    
    if (key.startsWith('cv.')) {
      const cvPath = key.substring(3)
      const cvValue = getNestedValue(cvData, cvPath)
      value = getTranslation(cvValue, lang)
    } else {
      value = getNestedValue(t, key)
    }
    
    if (value !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value
      } else {
        el.textContent = value
      }
    }
  })
  
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key')
    if (!key) return
    
    let value
    
    if (key.startsWith('cv.')) {
      const cvPath = key.substring(3)
      const cvValue = getNestedValue(cvData, cvPath)
      value = getTranslation(cvValue, lang)
    } else {
      value = getNestedValue(t, key)
    }
    
    if (value !== undefined && typeof value !== 'object') {
      el.textContent = value
    }
  })
}

function initI18n() {
  const lang = document.documentElement.getAttribute('lang') || 'es'
  
  function doUpdate() {
    try {
      updateContent(lang)
    } catch (e) {
      console.error('i18n updateContent error:', e.message, e.stack)
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doUpdate, { once: true })
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(doUpdate)
    })
  }

  window.addEventListener('langchange', (event) => {
    try {
      updateContent(event.detail.lang)
    } catch (e) {
      console.error('i18n langchange error:', e.message, e.stack)
    }
  })
}

initI18n()
```

### Updating Layout.astro

Update `src/layouts/Layout.astro` to remove inline scripts and include external files:

```astro
---
import cvData from "../../cv.json"
import ThemeToggle from "@/components/ThemeToggle.astro"
import LanguageToggle from "@/components/LanguageToggle.astro"
import CyberButton from "@/components/CyberButton.astro"
import EbookButton from "@/components/EbookButton.astro"
import CoffeeButton from "@/components/CoffeeButton.astro"
import CvDownloadButton from "@/components/CvDownloadButton.astro"

interface Props {
  title: string
  preconnects?: { href: string; crossorigin?: boolean }[]
}

const { title, preconnects = [] } = Astro.props

const { image, summary, url } = cvData.basics
const summaryText = typeof summary === 'object' ? summary.es : summary
const { basics, work, education, publications, projects } = cvData
---

<!doctype html>
<html lang="es">
  <head>
    <!-- Existing head content... -->
    
    <!-- External Scripts -->
    <script src="/scripts/theme.js" is:inline></script>
    <script src="/scripts/lang.js" is:inline></script>
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-ERTFC8RLNR"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-ERTFC8RLNR');
    </script>
  </head>
  <body>
    <slot />
    <LanguageToggle />
    <ThemeToggle />
    <CoffeeButton />
    <CvDownloadButton />
    <CyberButton />
    <EbookButton />

    <script type="module">
      import { injectCvData } from '/scripts/cv-data.js'
      injectCvData({
        basics: { ...basics },
        work: [ ...work ],
        education: [ ...education ],
        publications: [ ...publications ],
        projects: [ ...projects ],
      })
    </script>
    <script src="/scripts/i18n.js" type="module"></script>
  </body>
</html>

<!-- Existing style content... -->
```

## Build Configuration

Update `astro.config.mjs` to ensure scripts are properly bundled and minified:

```javascript
import { defineConfig } from 'astro/config'
import { securityHeaders } from './src/integrations/security-headers'

export default defineConfig({
  site: 'https://statick88.github.io',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    securityHeaders(),
  ],
  build: {
    inlineStylesheets: 'auto',
    cssMinify: true,
    sourcemap: false,
  },
  vite: {
    build: {
      minify: 'esbuild',
      sourcemap: false,
    },
  },
})
```

## Verification and Testing

### 1. Local Development Testing

- Run `npm run dev` to test the changes locally
- Use browser dev tools to verify security headers are present
- Check for CSP violations in the browser console
- Test all site functionality (theme toggle, language switch, etc.)

### 2. Production Deployment Testing

- Deploy to GitHub Pages
- Use tools like SecurityHeaders.com to scan the production site
- Verify all security headers are correctly configured
- Test site functionality in production

### 3. Automated Testing

- Use Astro's built-in testing capabilities
- Write tests to verify security headers are present
- Write tests to verify site functionality

## Rollback Plan

1. Revert `astro.config.mjs` to original state
2. Remove custom integration and middleware
3. Put inline scripts back into Layout.astro
4. Remove external script files
5. Redeploy the site

## Success Criteria

- [ ] All security headers are correctly configured and returned in responses
- [ ] No inline scripts are present in the rendered HTML
- [ ] CORS configuration is secure (no wildcard origin)
- [ ] Site functionality remains intact (theme toggle, language switch, analytics)
- [ ] Deployment to GitHub Pages is successful
