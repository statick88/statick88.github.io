# Delta for Bilingual Content

## ADDED Requirements

### Requirement: Spanish Primary / English Secondary Content

The system MUST store all CV content in a bilingual structure with Spanish (`es`) as primary language and English (`en`) as secondary.

All user-facing strings MUST exist in both languages in the source data (`src/data/cv.es.yaml` and `src/data/cv.en.yaml` or unified `src/data/cv.yaml` with `es`/`en` keys).

The system MUST default to Spanish when no language preference is detected.

#### Scenario: Spanish renders by default

- GIVEN user visits CV with no language preference
- WHEN page loads
- THEN all content MUST render in Spanish
- AND language toggle MUST show "EN" as active target

#### Scenario: English renders when selected

- GIVEN user clicks language toggle to English
- WHEN page re-renders
- THEN all content MUST render in English
- AND language toggle MUST show "ES" as active target
- AND preference MUST persist in `localStorage`

#### Scenario: Language preference persists across sessions

- GIVEN user previously selected English
- WHEN user returns to CV in new session
- THEN page MUST render in English
- AND toggle MUST reflect English selection

### Requirement: Language Toggle Component

The system MUST provide a language toggle component in the top-right of the left sidebar (or header on mobile).

The toggle MUST be a button with `aria-label` in current language: "Cambiar a inglés" / "Switch to Spanish".

The toggle MUST announce language change to screen readers via `aria-live="polite"`.

#### Scenario: Toggle switches language and announces

- GIVEN Spanish content visible
- WHEN user clicks toggle
- THEN content MUST switch to English
- AND screen reader MUST announce "English selected"
- AND toggle label MUST update to "Switch to Spanish"

### Requirement: Bilingual Date and Number Formatting

Dates MUST format according to locale: Spanish → `DD/MM/YYYY`, English → `MM/DD/YYYY` (or `Month YYYY` for readability).

Numbers MUST use locale-appropriate separators: Spanish → `1.234,56`, English → `1,234.56`.

The system MUST use `Intl.DateTimeFormat` and `Intl.NumberFormat` with `es-ES` and `en-US` locales.

#### Scenario: Dates format correctly per locale

- GIVEN experience entry with date `2023-06-15`
- WHEN rendering in Spanish
- THEN date MUST display as `15/06/2023` or `Junio 2023`
- WHEN rendering in English
- THEN date MUST display as `06/15/2023` or `June 2023`

#### Scenario: Metric numbers format correctly per locale

- GIVEN metric value `1250000`
- WHEN rendering in Spanish
- THEN MUST display as `1.250.000`
- WHEN rendering in English
- THEN MUST display as `1,250,000`

### Requirement: RTL-Ready Structure (Future-Proof)

The layout and component structure MUST support RTL languages without CSS changes (use logical properties: `margin-inline-start`, `padding-inline-end`, `border-inline-start`).

Flexbox/Grid MUST use `inline-start`/`inline-end` not `left`/`right`.

#### Scenario: Logical properties used throughout CSS

- GIVEN any CSS rule setting horizontal spacing
- WHEN inspected
- THEN it MUST use logical properties (`margin-inline`, `padding-inline`, `border-inline`)
- AND MUST NOT use `margin-left`, `margin-right`, `padding-left`, `padding-right`, `border-left`, `border-right`

## MODIFIED Requirements

None (new capability).

## REMOVED Requirements

None.

## RENAMED Requirements

None.