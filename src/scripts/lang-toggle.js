document.addEventListener('DOMContentLoaded', () => {
  const initLangToggle = () => {
    const btn = document.getElementById('lang-toggle')
    if (!btn) return
    
    const langText = btn.querySelector('.lang-text')
    const currentLang = document.documentElement.getAttribute('lang') || 'es'
    
    const oppositeLang = currentLang === 'es' ? 'EN' : 'ES'
    if (langText) {
      langText.textContent = oppositeLang
    }
    
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('lang') || 'es'
      const newLang = current === 'es' ? 'en' : 'es'
      
      document.documentElement.setAttribute('lang', newLang)
      localStorage.setItem('lang', newLang)
      
      const newOpposite = newLang === 'es' ? 'EN' : 'ES'
      if (langText) {
        langText.textContent = newOpposite
      }
      
      window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: newLang } }))
    })
  }

  initLangToggle()
})
