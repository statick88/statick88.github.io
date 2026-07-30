# Delta for Executive Layout

## ADDED Requirements

### Requirement: Two-Column Executive Layout (30/70 Split)

The system MUST render a single-page SPA with a fixed two-column layout: left sidebar (30% viewport width) and right content area (70% viewport width).

The left sidebar MUST contain: executive summary, contact info, skills cloud, languages, certifications summary.

The right content area MUST contain: experience timeline, projects, education, publications.

The layout MUST use CSS Grid with `grid-template-columns: 30% 70%` and MUST be responsive below 1024px (stack to single column).

#### Scenario: Desktop layout renders correctly

- GIVEN viewport width ≥ 1024px
- WHEN the CV page loads
- THEN the left sidebar MUST occupy exactly 30% of viewport width
- AND the right content area MUST occupy exactly 70% of viewport width
- AND both columns MUST have equal height (stretch to content)

#### Scenario: Tablet layout stacks to single column

- GIVEN viewport width < 1024px and ≥ 640px
- WHEN the CV page loads
- THEN the layout MUST stack to single column
- AND left sidebar content MUST appear before right content
- AND sidebar MUST be full width

#### Scenario: Mobile layout stacks with preserved order

- GIVEN viewport width < 640px
- WHEN the CV page loads
- THEN the layout MUST be single column
- AND content order MUST be: summary → contact → skills → experience → projects → education → certs
- AND horizontal scrolling MUST NOT occur

### Requirement: 8pt Baseline Grid System

All spacing, typography, and layout measurements MUST align to an 8pt baseline grid.

Font sizes MUST use the scale: 12, 14, 16, 18, 20, 24, 30, 36, 48 (all multiples of 2, aligned to 8pt rhythm).

Spacing tokens MUST be: 4, 8, 16, 24, 32, 40, 48, 56, 64 (multiples of 8).

Line heights MUST be multiples of 8: 16, 24, 32, 40, 48.

#### Scenario: Spacing tokens align to 8pt grid

- GIVEN any component uses spacing tokens
- WHEN rendered
- THEN all margins, padding, gaps MUST be multiples of 8px
- AND no arbitrary pixel values allowed

#### Scenario: Typography follows 8pt rhythm

- GIVEN any text element
- WHEN rendered
- THEN line-height MUST be multiple of 8px
- AND vertical rhythm MUST be maintained across components

### Requirement: Executive Typography (SF Pro / System Font Stack)

The system MUST use SF Pro Display/Text as primary font with system font stack fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.

Headings MUST use SF Pro Display (semibold/bold), body MUST use SF Pro Text (regular/medium).

Font feature settings MUST enable: `cv02`, `cv03`, `cv04`, `cv11` for typographic refinements.

#### Scenario: Font stack loads correctly on macOS/iOS

- GIVEN user on macOS/iOS
- WHEN page loads
- THEN SF Pro MUST be used
- AND font-feature-settings MUST be applied

#### Scenario: Font stack falls back gracefully on Windows/Linux

- GIVEN user on Windows/Linux
- WHEN page loads
- THEN Segoe UI / system font MUST be used
- AND layout MUST not break

### Requirement: WCAG 2.1 AA Color Contrast

All text and interactive elements MUST meet WCAG 2.1 AA contrast ratios: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold), 3:1 for UI components and graphical objects.

Color palette MUST define semantic tokens: `text-primary`, `text-secondary`, `text-muted`, `border-subtle`, `accent-primary`, `accent-hover`, `surface`, `surface-elevated`.

Dark mode MUST be supported via `prefers-color-scheme` with equivalent contrast ratios.

#### Scenario: Light mode contrast passes AA

- GIVEN light color scheme
- WHEN page renders
- THEN all text MUST have ≥4.5:1 contrast
- AND UI borders MUST have ≥3:1 contrast

#### Scenario: Dark mode contrast passes AA

- GIVEN dark color scheme (prefers-color-scheme: dark)
- WHEN page renders
- THEN all text MUST have ≥4.5:1 contrast
- AND UI borders MUST have ≥3:1 contrast

## MODIFIED Requirements

None (new capability).

## REMOVED Requirements

None.

## RENAMED Requirements

None.