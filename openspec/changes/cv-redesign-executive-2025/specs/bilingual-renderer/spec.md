# Delta for Bilingual CV Renderer

## ADDED Requirements

### Requirement: Bilingual Content Store (FR-03)

FR-03: All user-facing content MUST be stored in `cv-data.yaml` under `es`/`en` keys using the `BilingualString` type. No hardcoded strings in components.

A React Context (`LanguageContext`) MUST provide:
- `locale: 'es' | 'en'`
- `toggleLocale(): void`
- `t(key: string): string` — resolves dot-notation key from current locale

Default locale MUST be Spanish (`es`).

#### Scenario: Language toggle switches content

- GIVEN app loads with default `es` locale
- WHEN user clicks language toggle
- THEN `locale` context changes to `en`
- AND all `BilingualString` fields render English text
- AND URL updates to `?lang=en` (or persists in localStorage)

#### Scenario: Default is Spanish

- GIVEN fresh session (no localStorage, no query param)
- WHEN app mounts
- THEN `locale` MUST be `'es'`
- AND `<html lang="es">` attribute set

#### Scenario: Language persists across sessions

- GIVEN user selects English and closes tab
- WHEN user returns next day
- THEN locale MUST be `'en'`
- AND content MUST render in English immediately (no flash)

### Requirement: i18n Namespace Organization

All translation keys MUST be organized under namespaces matching CV sections:
- `profile`, `experience`, `education`, `projects`, `certifications`, `skills`, `languages`, `ui`, `metrics`, `impact`

Component translation calls MUST use `t('namespace.key')`.

#### Scenario: Namespace prevents key collisions

- GIVEN `experience.metrics.leadership` and `skills.leadership`
- WHEN both rendered
- THEN correct translation resolved from each context used

### Requirement: RTL/LTR Support Ready

Though ES/EN are LTR, the i18n infrastructure MUST support adding RTL languages (e.g., Arabic) by:
- Using logical CSS properties (`margin-inline-start` not `margin-left`)
- `dir` attribute on `<html>` derived from locale config
- No hardcoded `left`/`right` in layout components

## MODIFIED Requirements

### Requirement: Component Consumes Bilingual Data

Components previously receiving pre-resolved strings MUST now receive `BilingualString` objects and resolve via `t()` or direct `.es`/`.en` access.

(Previously: Components received resolved strings from Markdown processing)

#### Scenario: ExperienceCard renders bilingual metrics

- GIVEN `ExperienceCard` receives `entry: ExperienceEntry`
- WHEN rendering `entry.metrics[0].label`
- THEN it MUST call `t(entry.metrics[0].label)` or access `entry.metrics[0].label[locale]`
- AND display correct language

## REMOVED Requirements

### Requirement: Markdown-Based Content

(Reason: Replaced by structured bilingual YAML + React components)
(Migration: `cv-es.md` / `cv-en.md` content migrated to `cv-data.yaml`; legacy generators produce Markdown from structured data)

## RENAMED Requirements

None.