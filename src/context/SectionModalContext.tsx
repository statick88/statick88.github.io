import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'
import type { SectionId } from '@/config/navigation'

type ModalContextValue = {
  activeSectionId: SectionId | null
  openSection: (id: SectionId, trigger?: HTMLElement) => void
  closeSection: () => void
  printing: MutableRefObject<boolean>
}

const SectionModalContext = createContext<ModalContextValue | null>(null)

/** One active section, with a stable opener for native close/escape restoration. */
export function SectionModalProvider({ children }: { children: ReactNode }) {
  const [activeSectionId, setActiveSectionId] = useState<SectionId | null>(null)
  const opener = useRef<HTMLElement | null>(null)
  const printing = useRef(false)
  const openSection = useCallback((id: SectionId, trigger?: HTMLElement) => {
    opener.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    setActiveSectionId(id)
  }, [])
  const closeSection = useCallback(() => setActiveSectionId(null), [])
  useEffect(() => {
    if (activeSectionId === null && opener.current?.isConnected) opener.current.focus()
  }, [activeSectionId])
  const value = useMemo(() => ({ activeSectionId, openSection, closeSection, printing }), [activeSectionId, openSection, closeSection])
  return <SectionModalContext.Provider value={value}>{children}</SectionModalContext.Provider>
}

export function useSectionModal() {
  const context = useContext(SectionModalContext)
  if (!context) throw new Error('useSectionModal must be used within SectionModalProvider')
  return context
}
