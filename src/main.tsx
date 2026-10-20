import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

/**
 * Apply the preloaded webfont stylesheet.
 *
 * `index.html` preloads the Google Fonts stylesheet with `rel="preload"`, but
 * the usual `onload="this.rel='stylesheet'"` swap is an inline event handler
 * and the production CSP (`script-src 'self'`, hash-only) blocks it — the site
 * silently fell back to system fonts. Swapping it from the application bundle
 * keeps the async loading AND satisfies the policy, because the bundle is a
 * same-origin script.
 */
function applyPreloadedFonts() {
  const preloaded = document.querySelector<HTMLLinkElement>(
    'link[rel="preload"][as="style"]',
  )
  if (preloaded) {
    preloaded.rel = 'stylesheet'
  }
}

applyPreloadedFonts()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
