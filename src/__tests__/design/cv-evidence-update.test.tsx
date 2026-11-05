import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { load } from 'js-yaml'
import { education, certifications, work, practice, languages } from '@/data/cv-data'
import { cvData } from '@/data/cvData.js'
import { adaptEducation, adaptCertifications } from '@/lib/adapter'
import { AppProvider } from '@/context/AppContext'
import EducationCard from '@/components/right-column/EducationCard'
import { toATS, toCareerOps, toAIJobSearch, toMarkdown, type RawCVData } from '../../../scripts/export-structured'
import { buildFallbackHtml } from '@/lib/ats-html-fallback'

const raw = load(readFileSync('src/data/cv-data.yaml', 'utf8')) as RawCVData
const institution = 'Universidad Regional Autónoma de los Andes (UNIANDES)'
const additions = [
  ['Formación del Profesor Tutor en Educación en Línea', '2020-07-19'],
  ['Databases in the Cloud with AWS RDS', '2023-10-04'],
  ['Visión por Computador', '2024-05-09'],
  ['Docker – Level 1', '2026-02-18'],
  ['Fundamentos de Ingeniería de Software', '2023-01-17'],
  ['Introducción a los Patrones de Diseño de Software', '2023-03-16'],
  ['Fundamentos de Ingeniería de Datos', '2023-12-08'],
  ['Introducción al Technical Writing y Documentación de Código', '2023-03-24'],
] as const

afterEach(cleanup)

describe('evidence-based CV update', () => {
  it('keeps UNIANDES current, with a real start month and no invented graduation day, in all mirrors', () => {
    for (const list of [education, cvData.education]) {
      const entry = list.find((item) => item.institution === institution)
      expect(entry).toMatchObject({ startDate: '2026-10-01', endDate: '', isCurrent: true })
    }
    expect(raw.education.find((entry) => entry.institution === institution)).toMatchObject({
      startDate: '2026-10-01', endDate: null,
      status: { es: expect.stringContaining('2028'), en: expect.stringContaining('expected') },
    })
  })

  it.each(['es', 'en'] as const)('shows study status and academic work, not an awarded degree or GPA (%s)', (language) => {
    render(<AppProvider initialLanguage={language}><EducationCard education={adaptEducation()} /></AppProvider>)
    expect(screen.getByText(institution)).toBeVisible()
    expect(screen.getByText(language === 'es' ? /graduación estimada en 2028/ : /expected graduation in 2028/)).toBeVisible()
    expect(screen.getByText(language === 'es' ? /3 semestres más tesis/ : /3 semesters plus a thesis/)).toBeVisible()
    expect(screen.getByText(language === 'es' ? /Taller 1.1.*enviado/ : /Workshop 1.1.*submitted/)).toBeVisible()
    expect(adaptEducation().find((entry) => entry.institution === institution)?.gpa).toBeNull()
    expect(adaptEducation().find((entry) => entry.institution.includes('Complutense'))?.isCurrent).toBe(true)
    expect(adaptEducation().find((entry) => entry.institution.includes('Particular'))?.isCurrent).toBe(false)
  })

  it('preserves in-progress wording in every structured export and the no-JS HTML', () => {
    const ats = toATS(raw)
    for (const artifact of [ats, toCareerOps(ats), toAIJobSearch(ats), toMarkdown(ats), buildFallbackHtml(raw)]) {
      const serialized = typeof artifact === 'string' ? artifact : JSON.stringify(artifact)
      expect(serialized).toContain('UNIANDES')
      expect(serialized).toContain('2028')
      expect(serialized).toMatch(/expected|estimada/)
    }
  })

  it('adds only the curated verified courses with their supported dates', () => {
    for (const [name, date] of additions) {
      expect(certifications.find((entry) => entry.name === name)).toBeDefined()
      expect(cvData.certifications.find((entry) => entry.name === name)).toBeDefined()
      expect(raw.certifications.find((entry) => entry.name.es === name)?.date).toBe(date)
      expect(adaptCertifications().find((entry) => entry.name.es === name)?.date).toBe(date)
    }
    expect(JSON.stringify(practice)).not.toContain('134+')
  })

  it('retains the existing B1+ English record consistently instead of promoting a course to advanced proficiency', () => {
    for (const entries of [languages, cvData.languages]) {
      expect(entries.find((entry) => entry.language === 'Inglés')?.fluency).toEqual({ es: 'Intermedio (B1+)', en: 'Intermediate (B1+)' })
    }
    expect(raw.languages.find((entry) => entry.code === 'en')?.level).toBe('Intermediate (B1+)')
  })

  it('reflects the employment letter without fabricating achievements or retaining the ESPE placeholder', () => {
    for (const entries of [work, cvData.work]) {
      expect(entries.find((entry) => entry.name === 'Uteam')).toMatchObject({ startDate: '2026-08-01', endDate: '2026-09-30' })
      expect(entries.find((entry) => entry.name.startsWith('ESPE'))?.startDate).toBe('2023-04-26')
    }
    expect(raw.experience.find((entry) => entry.company === 'Uteam')?.technologies).toContain('DevSecOps')
    expect(raw.experience.find((entry) => entry.company.startsWith('ESPE'))?.startDate).toBe('2023-04-26')
  })
})
