/**
 * src/__tests__/components/LanguageToggle.test.tsx — LanguageToggle tests
 */

import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LanguageToggle from '@/components/LanguageToggle'

describe('LanguageToggle', () => {
  const mockSetLanguage = vi.fn()

  afterEach(() => {
    cleanup()
    mockSetLanguage.mockClear()
  })

  function getButton(ariaLabel: string) {
    return screen.getByRole('button', { name: ariaLabel })
  }

  it('renders EN when current language is es', () => {
    render(<LanguageToggle language="es" setLanguage={mockSetLanguage} />)
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('renders ES when current language is en', () => {
    render(<LanguageToggle language="en" setLanguage={mockSetLanguage} />)
    expect(screen.getByText('ES')).toBeInTheDocument()
  })

  it('calls setLanguage with en when clicking while es is active', () => {
    render(<LanguageToggle language="es" setLanguage={mockSetLanguage} />)
    fireEvent.click(getButton('Cambiar a inglés'))
    expect(mockSetLanguage).toHaveBeenCalledWith('en')
  })

  it('calls setLanguage with es when clicking while en is active', () => {
    render(<LanguageToggle language="en" setLanguage={mockSetLanguage} />)
    fireEvent.click(getButton('Switch to Spanish'))
    expect(mockSetLanguage).toHaveBeenCalledWith('es')
  })

  it('has correct aria-label for es', () => {
    render(<LanguageToggle language="es" setLanguage={mockSetLanguage} />)
    expect(getButton('Cambiar a inglés')).toHaveAttribute(
      'aria-label',
      'Cambiar a inglés'
    )
  })

  it('has correct aria-label for en', () => {
    render(<LanguageToggle language="en" setLanguage={mockSetLanguage} />)
    expect(getButton('Switch to Spanish')).toHaveAttribute(
      'aria-label',
      'Switch to Spanish'
    )
  })

  it('triggers toggle on Enter key', () => {
    render(<LanguageToggle language="es" setLanguage={mockSetLanguage} />)
    fireEvent.keyDown(getButton('Cambiar a inglés'), { key: 'Enter' })
    expect(mockSetLanguage).toHaveBeenCalledWith('en')
  })

  it('triggers toggle on Space key', () => {
    render(<LanguageToggle language="es" setLanguage={mockSetLanguage} />)
    fireEvent.keyDown(getButton('Cambiar a inglés'), { key: ' ' })
    expect(mockSetLanguage).toHaveBeenCalledWith('en')
  })
})
