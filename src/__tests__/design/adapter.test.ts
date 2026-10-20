/**
 * src/__tests__/design/adapter.test.ts
 *
 * Unit tests for the data adapter contract that the identity block relies on.
 *
 * The role shown in the header and the long headline shown in the summary are
 * two different fields of the same source value; this pins which one lands
 * where, including the fallback for an unknown profile id.
 */

import { describe, it, expect } from 'vitest'
import { adaptProfile, adaptHeadline } from '@/lib/adapter'

describe('adaptProfile', () => {
  it('uses the short profile label as the professional role', () => {
    const profile = adaptProfile('developer')

    expect(profile.role.es).toBe('Desarrollador Full Stack | Full Stack Engineer')
    expect(profile.role.en).toBe('Full Stack Developer | Full Stack Engineer')
  })

  it('changes the role with the active profile', () => {
    expect(adaptProfile('hacker').role.es).toContain('Hacker Ético')
    expect(adaptProfile('research').role.es).toContain('Investigador')
    expect(adaptProfile('docente-facilitador').role.es).toContain('Docente Facilitador')
  })

  it('falls back to the long headline for an unknown profile id', () => {
    const profile = adaptProfile('does-not-exist')

    expect(profile.role.es).toBe(adaptHeadline().es)
  })

  it('keeps the name independent of the profile', () => {
    expect(adaptProfile('developer').name).toBe(adaptProfile('hacker').name)
  })
})

describe('adaptHeadline', () => {
  it('exposes the long professional headline, not the short role', () => {
    const headline = adaptHeadline()

    expect(headline.es.length).toBeGreaterThan(100)
    expect(headline.es).not.toBe(adaptProfile('developer').role.es)
  })
})
