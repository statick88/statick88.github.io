document.addEventListener('DOMContentLoaded', () => {
  const handleToggleClick = () => {
    const element = document.documentElement
    element.classList.toggle('dark')

    const isDark = element.classList.contains('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const themeToggle = document.getElementById('theme-toggle')
  if (themeToggle) {
    themeToggle.addEventListener('click', handleToggleClick)
  }
})
