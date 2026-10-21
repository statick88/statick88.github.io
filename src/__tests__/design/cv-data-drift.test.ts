/**
 * src/__tests__/design/cv-data-drift.test.ts
 *
 * The CV lives in three files — the TypeScript source, the legacy JavaScript
 * source and the YAML the ATS exports read. They drifted before (the site said
 * 400 repositories while the export said 379, and the PDFs shipped a language
 * level the data had already changed), so this test pins them together.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { load as loadYaml } from 'js-yaml'
import { work, practice, profileData } from '@/data/cv-data'
import { cvData, profileData as jsProfileData } from '@/data/cvData.js'

const ROOT = resolve(__dirname, '../../..')

interface YamlWorkEntry {
  company: string
  startDate: string
  highlights?: { es?: string[]; en?: string[] }
}

function readYamlWork(): YamlWorkEntry[] {
  const raw = readFileSync(resolve(ROOT, 'src/data/cv-data.yaml'), 'utf8')
  const parsed = loadYaml(raw) as { experience?: YamlWorkEntry[] }
  return parsed.experience ?? []
}


function readYamlPractice(): unknown {
  const raw = readFileSync(resolve(ROOT, 'src/data/cv-data.yaml'), 'utf8')
  const parsed = loadYaml(raw) as { practice?: unknown }
  return parsed.practice ?? {}
}

describe('CV data sources stay in sync', () => {
  const tsEntries = work
  const jsEntries = cvData.work
  const yamlEntries = readYamlWork()

  it('declares the same number of roles everywhere', () => {
    expect(jsEntries.length).toBe(tsEntries.length)
    expect(yamlEntries.length).toBe(tsEntries.length)
  })

  it('declares the same roles in the same order', () => {
    const ts = tsEntries.map((entry) => entry.name)
    const js = jsEntries.map((entry) => entry.name)
    const yml = yamlEntries.map((entry) => entry.company)

    expect(js).toEqual(ts)
    expect(yml).toEqual(ts)
  })

  it('declares the same start dates everywhere', () => {
    const ts = tsEntries.map((entry) => entry.startDate)
    const js = jsEntries.map((entry) => entry.startDate)
    const yml = yamlEntries.map((entry) => entry.startDate)

    expect(js).toEqual(ts)
    expect(yml).toEqual(ts)
  })

  it('carries the same achievements everywhere', () => {
    tsEntries.forEach((entry, index) => {
      const jsHighlights = jsEntries[index]?.highlights?.es ?? []
      const yamlHighlights = yamlEntries[index]?.highlights?.es ?? []

      expect(jsHighlights, `highlights of ${entry.name} in cvData.js`).toEqual(
        entry.highlights?.es ?? [],
      )
      expect(yamlHighlights, `highlights of ${entry.name} in cv-data.yaml`).toEqual(
        entry.highlights?.es ?? [],
      )
      expect(entry.highlights?.es?.length ?? 0).toBeGreaterThan(0)
    })
  })

  it('never advertises a certificate it cannot show', () => {
    const redFlag = /sin certificado|no pdf employment certificate/i

    for (const entry of tsEntries) {
      expect(entry.summary.es, `summary of ${entry.name}`).not.toMatch(redFlag)
      expect(entry.summary.en, `summary of ${entry.name}`).not.toMatch(redFlag)
    }
  })

  it('carries the same practice block everywhere', () => {
    const ts = JSON.parse(JSON.stringify(practice))
    const js = JSON.parse(JSON.stringify((cvData as unknown as { practice?: unknown }).practice))
    const yaml = JSON.parse(JSON.stringify(readYamlPractice()))
    expect(js, 'practice in cvData.js').toEqual(ts)
    expect(yaml, 'practice in cv-data.yaml').toEqual(ts)
  })

  it('carries the same consultant profile record everywhere', () => {
    const ts = JSON.parse(JSON.stringify((profileData as Record<string, { id?: string; pdf?: string; label?: unknown }>).consultor))
    const js = JSON.parse(
      JSON.stringify(
        (jsProfileData as Record<string, { id?: string; pdf?: string; label?: unknown }>).consultor,
      ),
    )
    expect(ts.id, 'consultor id in cv-data.ts').toBe('consultor')
    expect(js.id, 'consultor id in cvData.js').toBe(ts.id)
    expect(js.pdf, 'consultor pdf in cvData.js').toBe(ts.pdf)
    expect(js.label, 'consultor label in cvData.js').toEqual(ts.label)
  })
})
