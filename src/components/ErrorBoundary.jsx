import { Component } from 'react'

/**
 * src/components/ErrorBoundary.jsx — Global error boundary
 *
 * Catches render errors and displays a degraded UI instead of a white screen.
 * Since this wraps <AppProvider>, it cannot use useApp() for translations.
 * Detects language from localStorage directly for bilingual fallback.
 */

function getLanguage() {
  try {
    const stored = localStorage.getItem('cv-language')
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    // SSR or localStorage unavailable
  }
  return 'es'
}

const COPY = {
  es: {
    title: 'Algo salió mal',
    description: 'Ha ocurrido un error inesperado. Por favor, recarga la página.',
    reload: 'Recargar Página',
  },
  en: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please reload the page.',
    reload: 'Reload Page',
  },
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const lang = getLanguage()
      const copy = COPY[lang]

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4" role="img" aria-hidden="true">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {copy.title}
            </h1>
            <p className="text-gray-400 mb-6">
              {copy.description}
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              🔄 {copy.reload}
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
