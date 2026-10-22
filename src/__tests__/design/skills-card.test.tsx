/**
 * src/__tests__/design/skills-card.test.tsx
 *
 * The skills are grouped by category and every group carries a human label.
 * A category without a label would publish its raw key to the reader
 * ("project-management" instead of "Gestión de proyectos"), so this test pins
 * the label of the project-management group the Platzi Scrum certificate
 * opened, and the labels the other groups already had.
 *
 * The test reads the same data the card reads, so a skill added to
 * `cv-data.ts` is covered automatically.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import { AppProvider } from '@/context/AppContext'
import SkillsCard from '@/components/left-column/SkillsCard'
import { skills } from '@/data/cv-data'

/** The category the Platzi Scrum certificate opened. */
const PROJECT_MANAGEMENT = 'project-management'

/** The skills that category carries. */
const PROJECT_MANAGEMENT_SKILLS = ['Scrum', 'Metodologías ágiles (Agile Methodologies)']

describe('SkillsCard', () => {
  afterEach(() => cleanup())

  it('labels the project-management group in Spanish', () => {
    render(
      <AppProvider initialLanguage="es">
        <SkillsCard skills={[...skills]} />
      </AppProvider>,
    )
    expect(screen.getByText('Gestión de proyectos')).toBeTruthy()
    expect(screen.queryByText(PROJECT_MANAGEMENT)).toBeNull()
  })

  it('labels the project-management group in English', () => {
    render(
      <AppProvider initialLanguage="en">
        <SkillsCard skills={[...skills]} />
      </AppProvider>,
    )
    expect(screen.getByText('Project management')).toBeTruthy()
    expect(screen.queryByText(PROJECT_MANAGEMENT)).toBeNull()
  })

  it('renders the certified skills inside that group', () => {
    render(
      <AppProvider initialLanguage="es">
        <SkillsCard skills={[...skills]} />
      </AppProvider>,
    )
    const group = screen
      .getAllByRole('group')
      .find((candidate) => within(candidate).queryByText('Gestión de proyectos'))

    expect(group, 'the card must open a project-management group').toBeDefined()
    for (const name of PROJECT_MANAGEMENT_SKILLS) {
      expect(
        within(group as HTMLElement).getByText(name),
        `the project-management group must render "${name}"`,
      ).toBeTruthy()
    }
  })

  it('keeps the labels the other groups already had', () => {
    render(
      <AppProvider initialLanguage="es">
        <SkillsCard skills={[...skills]} />
      </AppProvider>,
    )
    for (const label of ['Docencia', 'Seguridad', 'Arquitectura', 'Herramientas']) {
      expect(screen.getByText(label), `the card must label a group "${label}"`).toBeTruthy()
    }
  })
})
