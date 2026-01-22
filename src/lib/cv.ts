import cvEs from '../../cv.json'
import cvEn from '../../cv-en.json'
import type { CV } from '../cv.d.ts'

let currentLang = 'es'

export function getCV(): CV {
  return currentLang === 'en' ? cvEn as unknown as CV : cvEs as unknown as CV
}

export function setLanguage(lang: string): void {
  currentLang = lang
}

export function getLanguage(): string {
  return currentLang
}

export function toggleLanguage(): string {
  currentLang = currentLang === 'es' ? 'en' : 'es'
  return currentLang
}

if (typeof window !== 'undefined') {
  const storedLang = localStorage.getItem('lang')
  if (storedLang) {
    currentLang = storedLang
  }
  
  window.addEventListener('langchange', ((event: CustomEvent<{ lang: string }>) => {
    currentLang = event.detail.lang
  }) as EventListener)
}
