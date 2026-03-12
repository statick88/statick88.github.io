document.addEventListener('DOMContentLoaded', () => {
  const initCvDownload = () => {
    const btn = document.getElementById('cv-download')
    if (!btn) return

    const updateLabel = () => {
      const lang = document.documentElement.getAttribute('lang') || 'es'
      const isEn = lang === 'en'
      btn.setAttribute('aria-label', isEn ? 'Download CV (PDF)' : 'Descargar CV (PDF)')
      btn.setAttribute('title', isEn ? 'Download CV (PDF)' : 'Descargar CV (PDF)')
    }

    updateLabel()

    btn.addEventListener('click', async () => {
      try {
        const lang = (document.documentElement.getAttribute('lang') || 'es') === 'en' ? 'en' : 'es'
        const href = lang === 'en' ? '/cv-en.pdf' : '/cv-es.pdf'
        const filename = lang === 'en' ? 'Diego-Saavedra-CV-EN.pdf' : 'Diego-Saavedra-CV-ES.pdf'
        const a = document.createElement('a')
        a.href = href
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
      } catch (e) {
        console.error('CV PDF download error:', e)
      }
    })

    window.addEventListener('langchange', (_event) => {
      updateLabel()
    })
  }

  initCvDownload()
})
