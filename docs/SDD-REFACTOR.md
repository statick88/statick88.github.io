# SDD — Refactor: SPA Monolítica → Arquitectura Limpia, Segura y Testeable

**Proyecto:** `cv-diego` (statick88.github.io)
**Fecha:** 2026-07-11
**Autor:** Comité de Arquitectura — Senior Software Engineer & Cybersecurity
**Estado:** DRAFT v1.0
**Baseline:** Auditoría OWASP 2025 + Clean Architecture + TDD

---

## Índice

1. [Estructura de Directorios](#1-estructura-de-directorios)
2. [Contrato de Datos](#2-contrato-de-datos)
3. [Estrategia de Inyección de Dependencias](#3-estrategia-de-inyección-de-dependencias)
4. [Plan de Seguridad (Hardening)](#4-plan-de-seguridad-hardening)
5. [Estrategia de Testing (TDD)](#5-estrategia-de-testing-tdd)
6. [Plan de Accesibilidad](#6-plan-de-accesibilidad)
7. [Migration Roadmap](#7-migration-roadmap)

---

## 1. Estructura de Directorios

### 1.1 Estructura Actual (Problema)

```
src/
├── App.jsx              ← GOD COMPONENT (571 líneas, 8 responsabilidades)
├── main.jsx
├── index.css
├── components/          ← 14 componentes planos, sin hooks custom
│   ├── Certifications.jsx
│   ├── Courses.jsx
│   ├── ErrorBoundary.jsx
│   ├── HireMe.jsx
│   ├── LanguageToggle.jsx
│   ├── Metrics.jsx
│   ├── Particles.jsx
│   ├── ProfileSelector.jsx
│   ├── Projects.jsx
│   ├── Research.jsx
│   ├── Section.jsx
│   ├── Skills.jsx
│   ├── ThemeToggle.jsx
│   └── Timeline.jsx
├── config/
│   └── urls.ts          ← Solo URLs, no centraliza seguridad
├── data/
│   ├── cvData.js        ← 586 líneas, FUENTE ACTIVA
│   ├── cvData.ts        ← HUÉRFANO, NUNCA importado
│   ├── cvData.test.js
│   └── courses.js
└── types/
    └── cvData.ts        ← Tipos que NO coinciden con cvData.js
```

**Problemas:**
- `App.jsx` concentra estado global, navegación, scroll tracking, render de secciones
- Dos fuentes de datos (`cvData.js` + `cvData.ts`) con estructuras diferentes
- `styles.css` (481 líneas) en raíz — huérfano
- Sin custom hooks, sin contextos, sin separación de concerns

### 1.2 Estructura Objetivo

```
src/
├── main.tsx                          ← Entry point (React 18 StrictMode)
├── App.tsx                           ← Orquestador ligero (~80 líneas)
├── index.css                         ← Solo imports + variables globales
│
├── types/                            ← CONTRATO DE DATOS (single source of truth)
│   ├── cv.ts                         ← Tipos del dominio CV
│   ├── profile.ts                    ← Tipos de perfil
│   ├── index.ts                      ← Barrel export
│   └── global.d.ts                   ← Declaraciones globales
│
├── data/                             ← DATA LAYER (solo datos + validación)
│   ├── cv-data.ts                    ← Fuente de verdad (importa tipos)
│   ├── profile-data.ts               ← Perfiles (developer/hacker/research/docente)
│   ├── courses-data.ts               ← Cursos
│   ├── urls.ts                       ← URLs centralizadas
│   └── __tests__/
│       ├── cv-data.test.ts           ← Tests de forma del contrato
│       └── profile-data.test.ts
│
├── config/                           ← CONFIGURACIÓN DE SEGURIDAD
│   ├── security.ts                   ← CSP directives centralizadas
│   ├── navigation.ts                 ← Nav items, secciones, iconos
│   └── theme.ts                      ← Paleta de colores, breakpoints
│
├── context/                          ← REACT CONTEXT (estado global mínimo)
│   ├── LanguageContext.tsx            ← idioma (es/en)
│   ├── ThemeContext.tsx               ← tema (dark/light)
│   └── ProfileContext.tsx             ← perfil activo
│
├── hooks/                            ← CUSTOM HOOKS (lógica reutilizable)
│   ├── useScrollSpy.ts               ← IntersectionObserver → activeSection
│   ├── useScrollProgress.ts          ← scroll position → progress %
│   ├── useLanguage.ts                ← consume LanguageContext
│   ├── useTheme.ts                   ← consume ThemeContext
│   ├── useProfile.ts                 ← consume ProfileContext
│   ├── useReducedMotion.ts           ← prefers-reduced-motion query
│   ├── useMediaQuery.ts              ← breakpoint responsive genérico
│   └── useClickOutside.ts            ← cerrar dropdowns
│
├── components/                       ← UI COMPONENTS (presentación pura)
│   ├── layout/
│   │   ├── Header.tsx                ← LanguageToggle + ThemeToggle + ProfileSelector
│   │   ├── MobileNav.tsx             ← Drawer de navegación móvil
│   │   ├── ProgressNav.tsx           ← Barra de progreso + dots
│   │   ├── Footer.tsx                ← Footer con WhatsApp CTA
│   │   └── SkipLink.tsx              ← Skip to main content
│   │
│   ├── sections/
│   │   ├── HeroSection.tsx           ← Foto, nombre, badges
│   │   ├── SummarySection.tsx        ← Resumen + SoftSkills + Idiomas
│   │   ├── ExperienceSection.tsx     ← Timeline de trabajo
│   │   ├── EducationSection.tsx      ← Timeline de educación
│   │   ├── SkillsSection.tsx         ← Grid de habilidades
│   │   ├── ProjectsSection.tsx       ← Grid de proyectos
│   │   ├── CertificationsSection.tsx ← Grid de certificaciones
│   │   ├── CoursesSection.tsx        ← Cursos con filtro + modal
│   │   ├── ResearchSection.tsx       ← Publicaciones
│   │   └── HireMeSection.tsx         ← Servicios + Contacto
│   │
│   ├── ui/                           ← ATOMIC DESIGN primitives
│   │   ├── GlassCard.tsx             ← .glass reutilizable
│   │   ├── GradientText.tsx          ← .gradient-text
│   │   ├── NeonBorder.tsx            ← .neon-border
│   │   ├── Badge.tsx                 ← Badges de nivel/estado
│   │   ├── Button.tsx                ← Botón base con focus-visible
│   │   ├── Modal.tsx                 ← Modal accesible ( Courses, Research)
│   │   └── FilterBar.tsx             ← Barra de filtros reutilizable
│   │
│   └── particles/
│       └── Particles.tsx             ← Canvas animation (respeta reduced-motion)
│
├── a11y/                             ← ACCESSIBILITY UTILITIES
│   ├── LiveRegion.tsx                ← aria-live para cambios de estado
│   ├── Announcer.tsx                 ← anuncio programático
│   └── focus-management.ts           ← trapFocus, restoreFocus
│
└── utils/                            ← UTILIDADES PURAS (sin React)
    ├── date.ts                       ← formatDate, isCurrentStudy
    ├── cn.ts                         ← classnames helper
    └── csp-hash.ts                   ← SHA256 hash generation (build time)
```

### 1.3 Principios de la Nueva Estructura

| Principio | Implementación |
|-----------|---------------|
| **SRP** | Cada archivo tiene UNA responsabilidad: `App.tsx` orquesta, hooks manejan lógica, componentes renderizan |
| **OCP** | Agregar una sección = crear archivo en `sections/` + registrar en `navigation.ts` |
| **DIP** | Componentes dependen de interfaces (props tipados), no de implementaciones concretas |
| **DRY** | Lógica compartida en hooks, UI compartida en `ui/` |
| **Security by Default** | CSP centralizado en `config/security.ts`, validación en build |

---

## 2. Contrato de Datos

### 2.1 Problema Actual

```javascript
// cvData.js — 586 líneas, objeto plano sin validación runtime
export const cvData = {
  basics: { name: "...", label: { es: "...", en: "..." }, ... },
  work: [ ... ],
  skills: [ ... ],
  // ...
}

// cvData.ts — 383 líneas, HUÉRFANO, estructura diferente
export const profileData: Profile[] = [ ... ]  // Array vs objeto
```

**Consecuencia:** Los tipos en `types/cvData.ts` no reflejan la realidad runtime. No hay validación. Un cambio en la forma de los datos puede romper la app silenciosamente.

### 2.2 Tipos de Dominio (types/cv.ts)

```typescript
// src/types/cv.ts — Single Source of Truth para el contrato

/** Texto bilingüe — toda cadena visible es bilingual */
export interface BilingualText {
  readonly es: string
  readonly en: string
}

/** Nivel de habilidad */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'master'

/** Categoría de habilidad — alineada con Tailwind config */
export type SkillCategory =
  | 'frontend-fundamentals'
  | 'frontend-frameworks'
  | 'backend'
  | 'mobile'
  | 'mobile-native'
  | 'devops'
  | 'databases'
  | 'architecture'
  | 'security'
  | 'ai'
  | 'research'
  | 'teaching'
  | 'tools'

/** Habilidad técnica */
export interface Skill {
  readonly name: string
  readonly level: SkillLevel
  readonly category: SkillCategory
}

/** Experiencia laboral */
export interface WorkExperience {
  readonly name: string
  readonly position: BilingualText
  readonly url: string
  readonly startDate: string  // ISO 8601: YYYY-MM-DD
  readonly endDate?: string   // Opcional = empleo actual
  readonly summary: BilingualText
}

/** Educación */
export interface Education {
  readonly institution: string
  readonly area: BilingualText
  readonly url: string
  readonly startDate: string
  readonly endDate: string
  readonly studyType: 'Master' | 'Bachelor' | 'PhD' | 'Diploma' | 'Certificate'
  readonly score: string
}

/** Habilidad blanda */
export interface SoftSkill {
  readonly name: BilingualText
}

/** Idioma */
export interface Language {
  readonly language: string
  readonly fluency: BilingualText
}

/** Certificación */
export interface Certification {
  readonly name: string
  readonly issuer: string
  readonly status: 'active' | 'expired' | 'in-progress'
}

/** Proyecto */
export interface Project {
  readonly name: string
  readonly description: BilingualText
  readonly highlights: BilingualText
  readonly github: string
  readonly url?: string
}

/** Servicio (HireMe) */
export interface Service {
  readonly id: string
  readonly icon: 'code' | 'shield' | 'target' | 'book'
  readonly title: BilingualText
  readonly description: BilingualText
  readonly formats: BilingualText
  readonly priceRange: string
  readonly color: string
}

/** Métrica verificada */
export interface Metric {
  readonly value: string
  readonly unit: string
  readonly label_es: string
  readonly label_en: string
  readonly source: string
}

/** Contacto */
export interface Contact {
  readonly email: string
  readonly phone: string
  readonly whatsapp: string
  readonly linkedin: string
  readonly github: string
  readonly tagline: BilingualText
  readonly cta: BilingualText
}

/** Perfil profesional */
export interface Profile {
  readonly id: string
  readonly label: BilingualText
  readonly color: string
  readonly icon: string
  readonly summary: BilingualText
  readonly skills: readonly Skill[]
  readonly certifications: readonly Certification[]
  readonly pdf: string
}
```

### 2.3 Datos Validados (data/cv-data.ts)

```typescript
// src/data/cv-data.ts — Fuente de verdad con validación en build
import type {
  BilingualText,
  WorkExperience,
  Education,
  SoftSkill,
  Language,
  Skill,
  Certification,
  Project,
  Service,
  Metric,
  Contact,
} from '../types/cv'

// ── Validación de integridad (build-time) ────────────────────────
function assertValidDate(dateStr: string, field: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(`[cv-data] Invalid ISO date in ${field}: "${dateStr}"`)
  }
}

function assertBilingual(value: unknown, field: string): asserts value is BilingualText {
  const v = value as BilingualText
  if (!v?.es || !v?.en || typeof v.es !== 'string' || typeof v.en !== 'string') {
    throw new Error(`[cv-data] Missing bilingual text in ${field}`)
  }
}

// ── Datos ────────────────────────────────────────────────────────
export const basics = {
  name: 'Diego Medardo Saavedra García' as const,
  label: {
    es: 'Magíster en Cs. y Tec. de la Computación (UTPL). MSc Ciberseguridad en curso (UCM). 10+ años en desarrollo full-stack y 6+ como docente universitario.',
    en: "Master's in Computer Science (UTPL). MSc Cybersecurity in progress (UCM). 10+ years in full-stack development, 6+ as university instructor.",
  } as const satisfies BilingualText,
  image: '/statick.png' as const,
  email: 'dsaavedra88@gmail.com' as const,
  phone: '+593 980192790' as const,
  location: { city: 'Loja', region: 'Loja', countryCode: 'ECU' } as const,
  profiles: [
    { network: 'LinkedIn', url: 'https://www.linkedin.com/in/diego-saavedra-developer/' },
    { network: 'GitHub', url: 'https://github.com/statick88' },
    { network: 'Portfolio', url: 'https://statick88.github.io' },
  ] as const,
} as const

export const work: readonly WorkExperience[] = [
  {
    name: 'ABACOM',
    position: {
      es: 'Docente, Facilitador y Curriculista',
      en: 'Instructor, Facilitator and Curriculum Designer',
    },
    url: 'https://abacom.edu.ec/',
    startDate: '2021-12-01',
    summary: {
      es: 'Diseño curricular y facilitación de cursos de Python, Flutter, R, Linux, Ethical Hacking.',
      en: 'Curriculum design and facilitation of Python, Flutter, R, Linux, Ethical Hacking courses.',
    },
  },
  // ... resto de work experiences (inmutables)
] as const

// ... education, skills, certifications, projects, services, etc.

export const metrics = {
  abacomCohorte2026: {
    value: '93.4',
    unit: '/100',
    label_es: 'Promedio cohorte Python 2026',
    label_en: 'Python 2026 cohort avg',
    source: 'Docente Cuantitativa Evaluation.pdf',
  } satisfies Metric,
  // ...
} as const

export const contact = {
  email: 'dsaavedra88@gmail.com',
  phone: '+593 980192790',
  whatsapp: 'https://wa.me/593980192790',
  linkedin: 'https://linkedin.com/in/dsaavedra88',
  github: 'https://github.com/statick88',
  tagline: {
    es: '¿Listo para llevar tu proyecto al siguiente nivel? Hablemos.',
    en: "Ready to take your project to the next level? Let's talk.",
  } satisfies BilingualText,
  cta: {
    es: 'Agendar Llamada Gratuita',
    en: 'Schedule Free Call',
  } satisfies BilingualText,
} as const

// ── Validación en import ─────────────────────────────────────────
// Se ejecuta una vez al cargar el módulo (build-time tree-shaking)
work.forEach((w, i) => {
  assertValidDate(w.startDate, `work[${i}].startDate`)
  assertBilingual(w.position, `work[${i}].position`)
  assertBilingual(w.summary, `work[${i}].summary`)
})

education.forEach((e, i) => {
  assertValidDate(e.startDate, `education[${i}].startDate`)
  assertValidDate(e.endDate, `education[${i}].endDate`)
  assertBilingual(e.area, `education[${i}].area`)
})
```

### 2.4 Consumo por Componentes

```typescript
// ANTES (acoplamiento rígido):
import { cvData } from './data/cvData'
const name = cvData.basics.name  // Sin tipos, sin validación

// DESPUÉS (dependencia de abstracción):
import { basics, work, skills } from '@/data/cv-data'
// TypeScript infiere tipos automáticamente
// Los datos son readonly (inmutables)
// La validación se ejecuta una vez en build-time
```

### 2.5 Eliminación de Archivos Huérfanos

| Archivo | Acción | Razón |
|---------|--------|-------|
| `src/data/cvData.js` | **ELIMINAR** | Reemplazado por `cv-data.ts` |
| `src/data/cvData.ts` | **ELIMINAR** | Huérfano, nunca importado |
| `src/data/courses.js` | **RENOMBRAR** → `courses-data.ts` | Consistencia de naming |
| `src/types/cvData.ts` | **ELIMINAR** | Reemplazado por `types/cv.ts` |
| `styles.css` (raíz) | **ELIMINAR** | Huérfano, no importado |

---

## 3. Estrategia de Inyección de Dependencias

### 3.1 Problema Actual

`App.jsx` concentra **7 useState + 4 useEffect**:

```javascript
// App.jsx actual — GOD COMPONENT
const [language, setLanguage] = useState('es')
const [theme, setTheme] = useState('dark')
const [activeSection, setActiveSection] = useState('summary')
const [isLoaded, setIsLoaded] = useState(false)
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
const [activeProfile, setActiveProfile] = useState({ id: 'developer', ... })
const [scrollProgress, setScrollProgress] = useState(0)
// + 4 useEffect para scroll, observer, theme toggle, loaded delay
```

### 3.2 Arquitectura de Dependencias

```
┌─────────────────────────────────────────────────────┐
│                    App.tsx (~80 líneas)              │
│  LanguageProvider → ThemeProvider → ProfileProvider   │
│    └── Layout (Header + Sections + Footer)           │
└──────────────┬──────────────────────────────────────┘
               │
    ┌──────────┼──────────────────┐
    │          │                  │
┌───▼───┐ ┌───▼────┐ ┌──────────▼──────────┐
│Context │ │Context │ │     Context          │
│Language│ │ Theme  │ │     Profile          │
└───┬────┘ └───┬────┘ └──────────┬──────────┘
    │          │                  │
    ▼          ▼                  ▼
┌────────┐ ┌─────────┐ ┌──────────────┐
│useLang │ │useTheme │ │ useProfile   │
│  uage  │ │         │ │              │
└────────┘ └─────────┘ └──────────────┘
    │          │                  │
    ▼          ▼                  ▼
┌──────────────────────────────────────┐
│         UI Components                 │
│  (consumen hooks, no context directo)│
└──────────────────────────────────────┘
```

### 3.3 Context Providers

```typescript
// src/context/LanguageContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type Language = 'es' | 'en'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: <T extends { es: string; en: string }>(bilingual: T) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es')
  }, [])

  // Helper tipado — elimina el patrón t(es, en) scattering
  const t = useCallback(
    <T extends { es: string; en: string }>(bilingual: T): string => {
      return bilingual[language]
    },
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
```

```typescript
// src/context/ThemeContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Persistencia en localStorage
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

```typescript
// src/context/ProfileContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Profile } from '../types/cv'
import { profiles } from '../data/profile-data'

interface ProfileContextValue {
  activeProfile: Profile
  setActiveProfile: (profile: Profile) => void
  allProfiles: readonly Profile[]
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfile] = useState<Profile>(profiles[0])

  return (
    <ProfileContext.Provider value={{ activeProfile, setActiveProfile, allProfiles: profiles }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
```

### 3.4 Custom Hooks (Lógica Reutilizable)

```typescript
// src/hooks/useScrollSpy.ts
import { useState, useEffect } from 'react'

interface UseScrollSpyOptions {
  sectionIds: string[]
  threshold?: number
  rootMargin?: string
}

export function useScrollSpy({
  sectionIds,
  threshold = 0.3,
  rootMargin = '-100px 0px -50% 0px',
}: UseScrollSpyOptions): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold, rootMargin }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sectionIds, threshold, rootMargin])

  return activeSection
}
```

```typescript
// src/hooks/useScrollProgress.ts
import { useState, useEffect } from 'react'

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, p)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}
```

```typescript
// src/hooks/useReducedMotion.ts
import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
```

```typescript
// src/hooks/useClickOutside.ts
import { useEffect, type RefObject } from 'react'

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return
      handler()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
```

### 3.5 App.tsx Refactorizado

```tsx
// src/App.tsx — Orquestador ligero (~80 líneas)
import { LazyMotion, domAnimation } from 'framer-motion'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProfileProvider } from './context/ProfileContext'
import { Header } from './components/layout/Header'
import { SkipLink } from './components/layout/SkipLink'
import { MobileNav } from './components/layout/MobileNav'
import { ProgressNav } from './components/layout/ProgressNav'
import { Footer } from './components/layout/Footer'
import { HeroSection } from './components/sections/HeroSection'
import { SummarySection } from './components/sections/SummarySection'
import { ExperienceSection } from './components/sections/ExperienceSection'
import { EducationSection } from './components/sections/EducationSection'
import { SkillsSection } from './components/sections/SkillsSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { CertificationsSection } from './components/sections/CertificationsSection'
import { CoursesSection } from './components/sections/CoursesSection'
import { ResearchSection } from './components/sections/ResearchSection'
import { HireMeSection } from './components/sections/HireMeSection'
import { LanguageAnnouncer } from './a11y/Announcer'
import { useScrollSpy } from './hooks/useScrollSpy'
import { useScrollProgress } from './hooks/useScrollProgress'
import { SECTION_IDS } from './config/navigation'

export default function App() {
  const activeSection = useScrollSpy({ sectionIds: SECTION_IDS })
  const scrollProgress = useScrollProgress()

  return (
    <LazyMotion features={domAnimation} strict>
      <LanguageProvider>
        <ThemeProvider>
          <ProfileProvider>
            <SkipLink />
            <Header />
            <ProgressNav activeSection={activeSection} progress={scrollProgress} />
            <MobileNav activeSection={activeSection} />

            <main id="main-content" className="relative z-10 max-w-4xl mx-auto px-4 py-8">
              <HeroSection />
              <SummarySection />
              <ExperienceSection />
              <EducationSection />
              <SkillsSection />
              <ProjectsSection />
              <CertificationsSection />
              <CoursesSection />
              <ResearchSection />
              <HireMeSection />
            </main>

            <Footer />
            <LanguageAnnouncer />
          </ProfileProvider>
        </ThemeProvider>
      </LanguageProvider>
    </LazyMotion>
  )
}
```

---

## 4. Plan de Seguridad (Hardening)

### 4.1 Problema Actual: CSP Triple Drift

```
Vite plugin    → sha256 hashes, connect-src 'self'
_headers       → unsafe-inline en scripts, cdn.jsdelivr.net, google-analytics
wrangler.toml  → unsafe-inline en scripts, cdn.jsdelivr.net, google-analytics
```

Tres configuraciones diferentes. El CI verifica headers que GitHub Pages no sirve.

### 4.2 Solución: CSP Unificado en Build Time

```typescript
// src/config/security.ts — Directivas CSP centralizadas
// Este archivo es la ÚNICA fuente de verdad para CSP

export interface CSPDirectives {
  defaultSrc: string[]
  scriptSrc: string[]
  styleSrc: string[]
  fontSrc: string[]
  imgSrc: string[]
  connectSrc: string[]
  frameAncestors: string[]
  baseUri: string[]
  formAction: string[]
  objectSrc: string[]
  upgradeInsecureRequests: boolean
}

/** Directivas CSP para GitHub Pages (meta tag) */
export const CSP_GITHUB_PAGES: CSPDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],  // hashes se inyectan en build
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:"],  // SIN https: (demasiado permisivo)
  connectSrc: ["'self'"],
  frameAncestors: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  objectSrc: ["'none'"],
  upgradeInsecureRequests: true,
}

/** Directivas CSP para Cloudflare/Vercel (HTTP header) */
export const CSP_CLOUDFLARE: CSPDirectives = {
  ...CSP_GITHUB_PAGES,
  // Cloudflare soporta report-to
  scriptSrc: ["'self'", "'strict-dynamic'"],
}

/** Serializa directivas a string CSP */
export function serializeCSP(directives: CSPDirectives, scriptHashes: string[] = []): string {
  const parts: string[] = []

  parts.push(`default-src ${directives.defaultSrc.join(' ')}`)
  parts.push(`script-src ${[...directives.scriptSrc, ...scriptHashes].join(' ')}`)
  parts.push(`style-src ${directives.styleSrc.join(' ')}`)
  parts.push(`font-src ${directives.fontSrc.join(' ')}`)
  parts.push(`img-src ${directives.imgSrc.join(' ')}`)
  parts.push(`connect-src ${directives.connectSrc.join(' ')}`)
  parts.push(`frame-ancestors ${directives.frameAncestors.join(' ')}`)
  parts.push(`base-uri ${directives.baseUri.join(' ')}`)
  parts.push(`form-action ${directives.formAction.join(' ')}`)
  parts.push(`object-src ${directives.objectSrc.join(' ')}`)
  if (directives.upgradeInsecureRequests) {
    parts.push('upgrade-insecure-requests')
  }

  return parts.join('; ')
}

/** Genera meta tag CSP completo */
export function generateCSPMetaTag(scriptHashes: string[]): string {
  const csp = serializeCSP(CSP_GITHUB_PAGES, scriptHashes)
  return `<meta http-equiv="Content-Security-Policy" content="${csp}" />`
}

/** Genera archivo _headers para Cloudflare/Netlify */
export function generateHeadersFile(scriptHashes: string[]): string {
  const csp = serializeCSP(CSP_CLOUDFLARE, scriptHashes)

  return `/*
  Content-Security-Policy: ${csp}
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

/index.html
  Cache-Control: no-cache, no-store, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.pdf
  Cache-Control: public, max-age=31536000, immutable
`
}
```

### 4.3 Vite Plugin Refactorizado

```typescript
// vite.config.ts — Plugin CSP unificado
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { generateCSPMetaTag, generateHeadersFile } from './src/config/security'

const sha256 = (content: Buffer): string =>
  'sha256-' + crypto.createHash('sha256').update(content).digest('base64')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'csp-unified',
      apply: 'build',
      async writeBundle() {
        const distDir = path.resolve('dist')
        const indexPath = path.join(distDir, 'index.html')
        const assetsDir = path.join(distDir, 'assets')

        // 1. Calcular hashes de todos los bundles JS
        const jsFiles = fs.readdirSync(assetsDir)
          .filter(f => f.endsWith('.js'))
          .map(f => fs.readFileSync(path.join(assetsDir, f)))

        if (jsFiles.length === 0) {
          throw new Error('[CSP] No JS files found to hash')
        }

        const scriptHashes = jsFiles.map(sha256)

        // 2. Generar e inyectar meta tag CSP en index.html
        let html = fs.readFileSync(indexPath, 'utf-8')
        if (!html.includes('http-equiv="Content-Security-Policy"')) {
          const cspMeta = generateCSPMetaTag(scriptHashes)
          html = html.replace('<head>', `<head>\n    ${cspMeta}`)
          fs.writeFileSync(indexPath, html)
          console.log('[CSP] Injected meta tag with', scriptHashes.length, 'hashes')
        }

        // 3. Generar _headers para Cloudflare/Netlify
        const headers = generateHeadersFile(scriptHashes)
        fs.writeFileSync(path.join(distDir, '_headers'), headers)
        console.log('[CSP] Generated _headers for Cloudflare/Netlify')
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'framer-motion'
        },
      },
    },
  },
})
```

### 4.4 CI Pipeline Refactorizado

```yaml
# .github/workflows/ci.yml — Seccción verify-csp corregida
verify-csp:
  needs: deploy
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - name: Wait for CDN propagation
      run: sleep 45

    - name: Verify CSP meta tag in production HTML
      run: |
        HTML=$(curl -s "https://statick88.github.io/?t=$(date +%s)")
        
        # 1. CSP meta tag existe
        echo "$HTML" | grep -q 'http-equiv="Content-Security-Policy"' \
          || { echo "::error::CSP meta tag missing"; exit 1; }
        
        # 2. SHA256 hashes presentes (no unsafe-inline en scripts)
        echo "$HTML" | grep -q "sha256-" \
          || { echo "::error::sha256 hashes missing in CSP"; exit 1; }
        
        # 3. NO debe tener unsafe-inline en script-src
        echo "$HTML" | grep -oP "script-src[^;]+'" | grep -q "unsafe-inline" \
          && { echo "::error::unsafe-inline found in script-src CSP"; exit 1; } \
          || echo "✅ No unsafe-inline in script-src"
        
        # 4. NOTA: frame-ancestors en meta es ignorado por browsers
        #    La protección real viene del X-Frame-Options header
        echo "ℹ️  frame-ancestors in meta tag is ignored by browsers (expected)"
        echo "✅ CSP meta tag validation passed"

    # NOTA: NO verificar headers HTTP que GitHub Pages no sirve
    # Si se migra a Cloudflare, agregar verificación de headers ahí
```

### 4.5 Seguridad de Datos

```typescript
// src/config/security.ts — Politicas de datos
export const DATA_POLICIES = {
  /** Datos que NUNCA deben aparecer en el bundle */
  sensitiveFields: ['password', 'token', 'secret', 'apiKey'] as const,

  /** Patrones de secretos para scan en CI */
  secretPatterns: [
    /api[_-]?key\s*[:=]\s*['"][A-Za-z0-9_\-]{8,}/,
    /secret\s*[:=]\s*['"][A-Za-z0-9_\-]{8,}/,
    /token\s*[:=]\s*['"][A-Za-z0-9_\-]{8,}/,
    /password\s*[:=]\s*['"][A-Za-z0-9_\-]{8,}/,
  ] as const,

  /** Headers de seguridad para cada plataforma */
  headers: {
    githubPages: {
      // GitHub Pages NO soporta custom headers
      // Usar meta tag CSP como fallback
      note: 'GitHub Pages ignores _headers file. CSP via <meta> only.',
    },
    cloudflare: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  },
} as const
```

---

## 5. Estrategia de Testing (TDD)

### 5.1 Test Pyramid

```
        ╱╲
       ╱  ╲         E2E (Playwright)
      ╱ 3  ╲        3-5 flujos críticos
     ╱──────╲       ~10% de esfuerzo
    ╱        ╲
   ╱ Component ╲    Component Tests (Vitest + RTL)
  ╱   15-20     ╲   Render, interacción, a11y
 ╱──────────────╲   ~40% de esfuerzo
╱                ╲
╱   Unit Tests    ╲ Unit Tests (Vitest)
╱    30-40         ╲ Funciones puras, hooks, datos
╱──────────────────╲ ~50% de esfuerzo
```

### 5.2 Herramientas

| Capa | Herramienta | Propósito |
|------|------------|-----------|
| Unit | Vitest | Funciones puras, hooks, validación de datos |
| Component | Vitest + @testing-library/react | Render, interacción, a11y queries |
| A11y | @testing-library/jest-dom + jest-axe | Matcher de accesibilidad |
| E2E | Playwright | Flujos críticos (lang switch, profile switch, nav) |
| Coverage | @vitest/coverage-v8 | Mínimo 70% statements |

### 5.3 Configuración

```typescript
// vitest.config.ts — Corregido
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globals: true,
    environment: 'jsdom',  // CORREGIDO: era 'node'
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/**/*.d.ts', 'src/types/**'],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpieza automática entre tests
afterEach(() => {
  cleanup()
})

// Mock de window.matchMedia (necesario para useReducedMotion)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Mock de IntersectionObserver (necesario para useScrollSpy)
class MockIntersectionObserver {
  observe = () => {}
  unobserve = () => {}
  disconnect = () => {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})
```

### 5.4 Ejemplos de Tests

```typescript
// src/data/__tests__/cv-data.test.ts — Tests del contrato
import { describe, it, expect } from 'vitest'
import { basics, work, education, skills, metrics, contact } from '../cv-data'

describe('cv-data contract', () => {
  describe('basics', () => {
    it('has valid name', () => {
      expect(basics.name).toBeTypeOf('string')
      expect(basics.name.length).toBeGreaterThan(0)
    })

    it('has bilingual label', () => {
      expect(basics.label.es).toBeTypeOf('string')
      expect(basics.label.en).toBeTypeOf('string')
    })

    it('has valid email', () => {
      expect(basics.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })
  })

  describe('work', () => {
    it('has valid ISO dates', () => {
      const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
      for (const entry of work) {
        expect(entry.startDate).toMatch(ISO_DATE)
      }
    })

    it('has bilingual position and summary', () => {
      for (const entry of work) {
        expect(entry.position.es).toBeTypeOf('string')
        expect(entry.position.en).toBeTypeOf('string')
        expect(entry.summary.es).toBeTypeOf('string')
        expect(entry.summary.en).toBeTypeOf('string')
      }
    })

    it('all URLs start with https://', () => {
      for (const entry of work) {
        expect(entry.url).toMatch(/^https:\/\//)
      }
    })
  })

  describe('skills', () => {
    const VALID_LEVELS = ['beginner', 'intermediate', 'advanced', 'master']

    it('all skills have valid level', () => {
      for (const skill of skills) {
        expect(VALID_LEVELS).toContain(skill.level)
      }
    })
  })
})
```

```typescript
// src/hooks/__tests__/useScrollSpy.test.ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrollSpy } from '../useScrollSpy'

describe('useScrollSpy', () => {
  it('returns first section as default active', () => {
    // Mock IntersectionObserver para que llame onIntersect
    const mockObserver = vi.fn()
    window.IntersectionObserver = vi.fn((callback) => {
      mockObserver(callback)
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
    }) as any

    const { result } = renderHook(() =>
      useScrollSpy({ sectionIds: ['summary', 'experience', 'skills'] })
    )

    expect(result.current).toBe('summary')
  })
})
```

```typescript
// src/components/sections/__tests__/HeroSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '../HeroSection'
import { LanguageProvider } from '../../../context/LanguageContext'

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  )
}

describe('HeroSection', () => {
  it('renders the name', () => {
    renderWithProviders(<HeroSection />)
    expect(screen.getByText(/Diego Medardo Saavedra García/)).toBeInTheDocument()
  })

  it('renders profile links', () => {
    renderWithProviders(<HeroSection />)
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })

  it('has accessible image', () => {
    renderWithProviders(<HeroSection />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt')
  })
})
```

```typescript
// src/components/ui/__tests__/Modal.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../Modal'

describe('Modal', () => {
  it('renders children when open', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose}>
        <p>Content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('traps focus inside modal', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <button>First</button>
        <button>Second</button>
      </Modal>
    )
    const firstBtn = screen.getByText('First')
    expect(firstBtn).toHaveFocus()
  })
})
```

### 5.5 E2E Tests (Playwright)

```typescript
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173')
  })

  test('scroll to section on nav click', async ({ page }) => {
    await page.click('[aria-label="Ir a Experiencia"]')
    await expect(page.locator('#experience')).toBeVisible()
  })

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.click('[aria-label="Abrir menú"]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.click('[aria-label="Cerrar menú"]')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('skip link focuses main content', async ({ page }) => {
    await page.keyboard.press('Tab')
    const skipLink = page.locator('.skip-link')
    await expect(skipLink).toBeFocused()
    await skipLink.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })

  test('language toggle announces change', async ({ page }) => {
    await page.click('[aria-label="Cambiar a inglés"]')
    const announcer = page.locator('[aria-live="polite"]')
    await expect(announcer).toContainText(/english/i)
  })
})
```

---

## 6. Plan de Accesibilidad

### 6.1 Design System de Focus States

```css
/* src/styles/focus.css — Design system de foco */

/* ── Base: ocultar outline del navegador ────────────── */
:focus:not(:focus-visible) {
  outline: none;
}

/* ── Keyboard focus: ring visible ───────────────────── */
:focus-visible {
  outline: 2px solid var(--color-focus, rgba(0, 255, 255, 0.8));
  outline-offset: 2px;
  border-radius: 4px;
  transition: outline-offset 0.1s ease;
}

/* ── Focus ring para diferentes contextos ───────────── */
.focus-ring-default:focus-visible {
  outline: 2px solid rgba(0, 255, 255, 0.8);
  outline-offset: 2px;
}

.focus-ring-danger:focus-visible {
  outline: 2px solid rgba(239, 68, 68, 0.8);
  outline-offset: 2px;
}

.focus-ring-success:focus-visible {
  outline: 2px solid rgba(34, 197, 94, 0.8);
  outline-offset: 2px;
}

/* ── Focus within para cards clickeables ────────────── */
.card-interactive:focus-within {
  outline: 2px solid rgba(0, 255, 255, 0.6);
  outline-offset: -2px;
  border-radius: 12px;
}

/* ── Skip link ──────────────────────────────────────── */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-accent);
  color: var(--color-bg);
  padding: 12px 24px;
  border-radius: 0 0 8px 8px;
  font-weight: 700;
  z-index: 9999;
  transition: top 0.2s ease;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 6.2 Live Regions para Cambios de Estado

```tsx
// src/a11y/Announcer.tsx
import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

/**
 * Componente invisible que anuncia cambios de idioma/perfil
 * a lectores de pantalla via aria-live.
 *
 * WCAG 4.1.3 (Status Messages)
 */
export function LanguageAnnouncer() {
  const { language } = useLanguage()
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const msg = language === 'es'
      ? 'Idioma cambiado a español'
      : 'Language changed to English'
    setAnnouncement(msg)
  }, [language])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}
```

```tsx
// src/components/ui/ProfileAnnouncer.tsx
import { useEffect, useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import { useLanguage } from '../../context/LanguageContext'

export function ProfileAnnouncer() {
  const { activeProfile } = useProfile()
  const { t } = useLanguage()
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const msg = t({
      es: `Perfil cambiado a ${activeProfile.label.es}`,
      en: `Profile changed to ${activeProfile.label.en}`,
    })
    setAnnouncement(msg)
  }, [activeProfile, t])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}
```

### 6.3 Gestión de Lang Attribute

```tsx
// src/App.tsx — Sync lang con state
import { useEffect } from 'react'
import { useLanguage } from './context/LanguageContext'

function LangSync() {
  const { language } = useLanguage()

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return null // Renderiza nada, solo sincroniza
}
```

### 6.4 Focus Trap para Modals

```typescript
// src/a11y/focus-management.ts
import type { RefObject } from 'react'

/**
 * Trap focus dentro de un container (modals, drawers).
 * WCAG 2.1.2 (No Keyboard Trap) — debe permitir Escape.
 */
export function trapFocus(container: RefObject<HTMLElement | null>): () => void {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !container.current) return

    const focusableElements = container.current.querySelectorAll(focusableSelectors)
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  // Focus primer elemento focusable
  const firstFocusable = container.current?.querySelector(focusableSelectors) as HTMLElement
  firstFocusable?.focus()

  return () => {
    document.removeEventListener('keydown', handleKeyDown)
  }
}
```

### 6.5 Checklist de Accesibilidad

| WCAG SC | Requisito | Implementación |
|---------|-----------|---------------|
| 1.1.1 | Non-text Content | `alt` en imgs, `aria-hidden` en decorativos |
| 1.3.1 | Info and Relationships | Semantic HTML: `<main>`, `<nav>`, `<section>`, `<h1>`-`<h6>` |
| 1.4.3 | Contrast (Minimum) | gray-400 (#9ca3af) on #0a0a0f = 4.6:1 (AA) |
| 1.4.11 | Non-text Contrast | Focus ring 2px cyan on dark = 7.2:1 (AAA) |
| 2.1.1 | Keyboard | Todos los interactivos son focusable y operables |
| 2.1.2 | No Keyboard Trap | Escape cierra modals, focus trap con cleanup |
| 2.4.1 | Bypass Blocks | SkipLink → #main-content |
| 2.4.3 | Focus Order | Tab order = visual order |
| 2.4.7 | Focus Visible | `:focus-visible` ring en todos los interactivos |
| 2.4.11 | Focus Not Obscured | Focus ring never clipped by position:fixed |
| 3.1.1 | Language of Page | `document.documentElement.lang` sync con state |
| 3.1.2 | Language of Parts | `lang` attribute en spans bilingües (opcional) |
| 4.1.3 | Status Messages | `aria-live="polite"` para cambios de lang/perfil |

---

## 7. Migration Roadmap

### Fase 0: Preparación (Sin Romper Nada)

**Objetivo:** Preparar el terreno sin modificar código existente.

| Paso | Acción | Archivos | Validación |
|------|--------|----------|------------|
| 0.1 | Agregar `vitest.config.ts` corregido (`jsdom`) | `vitest.config.ts` | `pnpm test` pasa |
| 0.2 | Agregar `src/test/setup.ts` con mocks | `src/test/setup.ts` | Tests existentes pasan |
| 0.3 | Renombrar `cvData.js` → `cv-data-legacy.js` (temporal) | `src/data/` | App sigue funcionando con alias |
| 0.4 | Crear `src/types/cv.ts` con tipos | `src/types/cv.ts` | TypeScript no tiene errores |
| 0.5 | Eliminar `styles.css` (raíz) — verificar que nada lo importa | `styles.css` | Build pasa |
| 0.6 | Eliminar `src/data/cvData.ts` y `src/types/cvData.ts` (huérfanos) | 2 archivos | Build pasa |

**Checkpoint:** `pnpm build && pnpm test && pnpm lint` — todo verde.

---

### Fase 1: Data Layer (Contrato de Datos)

**Objetivo:** Crear la nueva fuente de verdad con tipos.

| Paso | Acción | Archivos | Validación |
|------|--------|----------|------------|
| 1.1 | Crear `src/data/cv-data.ts` con tipos importados | `cv-data.ts` | TypeScript infiere tipos |
| 1.2 | Crear `src/data/profile-data.ts` (4 perfiles) | `profile-data.ts` | Tipado correcto |
| 1.3 | Crear `src/data/courses-data.ts` (renombrar desde courses.js) | `courses-data.ts` | Import funciona |
| 1.4 | Migrar `urls.ts` → `src/data/urls.ts` (mantener compat) | `urls.ts` | Imports no rompen |
| 1.5 | Crear tests de contrato | `__tests__/cv-data.test.ts` | Tests pasan |
| 1.6 | Actualizar imports en App.jsx para usar nuevos archivos | `App.jsx` | App funciona igual |

**Checkpoint:** App funciona con `cv-data.ts`. Tests de contrato pasan.

---

### Fase 2: Context Layer (Estado Global)

**Objetivo:** Extraer estado global de App.jsx a Contexts.

| Paso | Acción | Archivos | Validación |
|------|--------|----------|------------|
| 2.1 | Crear `LanguageContext.tsx` + `useLanguage` | `context/`, `hooks/` | Toggle funciona |
| 2.2 | Crear `ThemeContext.tsx` + `useTheme` | `context/`, `hooks/` | Theme toggle funciona |
| 2.3 | Crear `ProfileContext.tsx` + `useProfile` | `context/`, `hooks/` | Profile selector funciona |
| 2.4 | Crear `useScrollSpy` custom hook | `hooks/useScrollSpy.ts` | Scroll spy funciona |
| 2.5 | Crear `useScrollProgress` custom hook | `hooks/useScrollProgress.ts` | Progress bar funciona |
| 2.6 | Crear `useReducedMotion` custom hook | `hooks/useReducedMotion.ts` | Particles respeta motion |
| 2.7 | Crear `useClickOutside` custom hook | `hooks/useClickOutside.ts` | Dropdowns cierran outside |

**Checkpoint:** App.jsx usa contexts + hooks. Mismo comportamiento visual.

---

### Fase 3: Component Decomposition (UI Layer)

**Objetivo:** Dividir App.jsx en componentes modulares.

| Paso | Acción | Archivos | Validación |
|------|--------|----------|------------|
| 3.1 | Crear `components/layout/SkipLink.tsx` | SkipLink | Skip funciona |
| 3.2 | Crear `components/layout/Header.tsx` ( LanguageToggle + ThemeToggle + ProfileSelector) | Header | Controles funcionan |
| 3.3 | Crear `components/layout/ProgressNav.tsx` (dots + progress bar) | ProgressNav | Navegación funciona |
| 3.4 | Crear `components/layout/MobileNav.tsx` (drawer) | MobileNav | Menú móvil funciona |
| 3.5 | Crear `components/layout/Footer.tsx` | Footer | Footer funciona |
| 3.6 | Crear `components/ui/GlassCard.tsx` | GlassCard | Glass effect funciona |
| 3.7 | Crear `components/ui/Modal.tsx` (con focus trap) | Modal | Modal accesible |
| 3.8 | Crear `components/ui/Badge.tsx` | Badge | Badges funcionan |
| 3.9 | Crear `components/ui/FilterBar.tsx` | FilterBar | Filtros funcionan |
| 3.10 | Crear `components/ui/Button.tsx` (con focus-visible) | Button | Focus ring funciona |
| 3.11 | Crear `components/sections/*.tsx` (10 secciones) | 10 archivos | Cada sección renderiza |
| 3.12 | Refactorizar App.tsx → orquestador (~80 líneas) | App.tsx | App funciona igual |

**Checkpoint:** App.tsx < 100 líneas. Cada componente es testeable aislado.

---

### Fase 4: Security Hardening

**Objetivo:** CSP unificado, CI corregido.

| Paso | Acción | Archivos | Validación |
|------|--------|----------|------------|
| 4.1 | Crear `config/security.ts` con directivas | security.ts | Tipado correcto |
| 4.2 | Refactorizar `vite.config.ts` para usar `security.ts` | vite.config.ts | Build genera CSP correcto |
| 4.3 | Verificar `dist/index.html` tiene CSP meta tag | dist/ | `grep sha256 dist/index.html` |
| 4.4 | Verificar `dist/_headers` generado para Cloudflare | dist/ | Headers correctos |
| 4.5 | Corregir CI: eliminar fake header checks | ci.yml | CI pasa sin warnings falsos |
| 4.6 | Agregar `config/navigation.ts` | navigation.ts | Nav items centralizados |

**Checkpoint:** Un solo CSP, CI reporta真相, build genera ambos formatos.

---

### Fase 5: Accessibility + A11y

**Objetivo:** WCAG AA/AAA compliance.

| Paso | Acción | Archivos | Validación |
|------|--------|----------|------------|
| 5.1 | Corregir `:focus { outline: none }` → `:focus:not(:focus-visible)` | index.css | Focus visible funciona |
| 5.2 | Crear `a11y/LiveRegion.tsx` + `Announcer.tsx` | a11y/ | Lang change announced |
| 5.3 | Agregar `LangSync` en App.tsx | App.tsx | `html.lang` cambia |
| 5.4 | Agregar focus trap en Modal/Courses | Modal.tsx | Focus no escapa |
| 5.5 | Verificar ARIA labels en todos los interactivos | components/ | axe-core 0 violaciones |
| 5.6 | Agregar tests de accesibilidad | __tests__/ | jest-axe pasa |

**Checkpoint:** axe-core 0 violaciones. Focus visible siempre.

---

### Fase 6: Testing (TDD)

**Objetivo:** Coverage ≥ 70%, E2E para flujos críticos.

| Paso | Acción | Archivos | Validación |
|------|--------|----------|------------|
| 6.1 | Tests unitarios de hooks (useScrollSpy, etc.) | __tests__/ | Todos pasan |
| 6.2 | Tests de componentes (Hero, Skills, etc.) | __tests__/ | Render + a11y |
| 6.3 | Tests de Context (Language, Theme, Profile) | __tests__/ | State management |
| 6.4 | Tests de Modal (focus trap, Escape) | __tests__/ | A11y tests |
| 6.5 | Configurar Playwright | playwright.config | `pnpm test:e2e` |
| 6.6 | E2E: Navigation flow | e2e/ | Scroll to section |
| 6.7 | E2E: Language switch | e2e/ | Content changes |
| 6.8 | E2E: Mobile menu | e2e/ | Open/close |
| 6.9 | Verificar coverage ≥ 70% | coverage/ | Report OK |

**Checkpoint:** Test pyramid completa. 70%+ coverage.

---

### Fase 7: Cleanup + Deploy

**Objetivo:** Eliminar dead code, deploy final.

| Paso | Acción | Archivos | Validación |
|------|--------|----------|------------|
| 7.1 | Eliminar `cv-data-legacy.js` | data/ | Build pasa |
| 7.2 | Eliminar código muerto de App.jsx original | App.jsx | Build pasa |
| 7.3 | Verificar bundle size ≤ 500KB | dist/ | `stat dist/assets/*.js` |
| 7.4 | Verificar Lighthouse ≥ 90 en todas las métricas | - | Lighthouse report |
| 7.5 | Deploy a staging (rama develop) | GitHub | Site funciona |
| 7.6 | Deploy a producción (main merge) | GitHub | Site funciona |
| 7.7 | Verificar CSP en producción | curl | Meta tag presente |
| 7.8 | Verificar headers en Cloudflare (si aplica) | curl | Headers correctos |

**Checkpoint:** Producción limpia, segura, testeada.

---

### Resumen de Fases

```
Fase 0: Preparación ────────► 2-3 horas (sin cambios visibles)
Fase 1: Data Layer ─────────► 3-4 horas (contrato de datos)
Fase 2: Context Layer ──────► 3-4 horas (estado global)
Fase 3: Component Decomp ───► 6-8 horas (mayor esfuerzo)
Fase 4: Security Hardening ─► 2-3 horas (CSP unificado)
Fase 5: Accessibility ──────► 2-3 horas (WCAG compliance)
Fase 6: Testing ────────────► 4-6 horas (test pyramid)
Fase 7: Cleanup + Deploy ───► 1-2 horas (finalización)
                             ─────────
                    TOTAL:   ~23-33 horas (~4-5 días de trabajo)
```

### Reglas de Migración

1. **Nunca romper la funcionalidad visible** — cada fase debe resultar en una app funcionando
2. **Test before refactor** — antes de mover código, escribir test que valide comportamiento actual
3. **Commit por paso** — cada paso del roadmap es un commit atómico con mensaje descriptivo
4. **Feature flags** — usar ramas develop/main para despliegue gradual
5. **Rollback plan** — cada fase tiene un `git revert` limpio si algo falla
6. **No big bang** — Fase 3 es la más grande; dividirla en sub-batches de 2-3 componentes

---

*Documento generado como parte del proceso SDD para cv-diego.*
*Baseline: Auditoría OWASP 2025 + Clean Architecture + TDD.*
