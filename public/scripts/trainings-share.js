document.addEventListener('DOMContentLoaded', () => {
  const shareButtons = document.querySelectorAll('.btn-share')
  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-share')
      const shareUrl = btn.dataset.url
      const shareTitle = btn.dataset.name
      
      if (navigator.share) {
        navigator.share({
          title: shareTitle,
          url: shareUrl
        }).catch(err => console.log('Error sharing:', err))
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          const originalHTML = btn.innerHTML
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Copiado!</span>
          `
          setTimeout(() => {
            btn.innerHTML = originalHTML
          }, 2000)
        }).catch(err => console.log('Error copying:', err))
      }
    })
  })
})
