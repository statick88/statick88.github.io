# Delta for Print Export

## ADDED Requirements

### Requirement: A4 Print Stylesheet

The system MUST provide a dedicated `@media print` stylesheet that produces a professional A4 PDF when using browser print (Chrome/Edge/Firefox/Safari).

Page size MUST be A4 (210mm × 297mm) with 15mm margins on all sides.

The stylesheet MUST use `@page` rules for margins, page numbering, and header/footer content.

#### Scenario: Chrome print produces clean A4 PDF

- GIVEN user presses Cmd+P in Chrome
- WHEN print preview opens
- THEN page size MUST be A4
- AND margins MUST be 15mm
- AND content MUST fit without horizontal overflow
- AND no content MUST be clipped at page boundaries

#### Scenario: Page breaks avoid splitting cards

- GIVEN an experience card spans near page boundary
- WHEN printed
- THEN `break-inside: avoid` MUST keep card together
- AND card MUST move to next page if it would split

#### Scenario: Page numbers appear in footer

- GIVEN multi-page print output
- WHEN printed
- THEN each page MUST show page number in bottom center
- AND format MUST be "Page X of Y"

### Requirement: Glassmorphism Removal for Print

All glassmorphism effects (backdrop-filter, semi-transparent backgrounds, blur) MUST be disabled in print.

Backgrounds MUST be solid colors from the print color palette.

Box shadows MUST be removed or reduced to hairline borders.

#### Scenario: Glassmorphism effects disabled in print

- GIVEN element has `backdrop-filter: blur(20px)` in screen CSS
- WHEN `@media print` applies
- THEN `backdrop-filter` MUST be `none`
- AND `background` MUST be solid `var(--color-surface-print)`

#### Scenario: Gradients replaced with solids

- GIVEN element has gradient background
- WHEN printed
- THEN gradient MUST be replaced with solid brand color
- AND text contrast MUST remain ≥4.5:1

### Requirement: Interactive Elements Hidden in Print

Language toggle, hover-reveal cards, animated elements, and navigation MUST be hidden in print output.

Only static content MUST appear.

#### Scenario: Language toggle hidden in print

- GIVEN language toggle button exists in DOM
- WHEN `@media print` applies
- THEN toggle MUST have `display: none`
- AND no gap MUST remain in layout

#### Scenario: Hover cards show full content in print

- GIVEN a card reveals details on hover (screen)
- WHEN printed
- THEN full card content MUST be visible by default
- AND no hover interaction MUST be required

### Requirement: Print Color Palette

A dedicated print color palette MUST be defined using CSS custom properties:

- `--color-text-print: #1a1a1a` (near-black)
- `--color-text-muted-print: #4a4a4a`
- `--color-border-print: #d0d0d0`
- `--color-surface-print: #ffffff`
- `--color-accent-print: #0066cc` (accessible blue)
- `--color-accent-hover-print: #0052a3`

These MUST be applied via `@media print` overrides.

#### Scenario: Print palette applies correctly

- GIVEN print media query active
- WHEN styles computed
- THEN all text MUST use `--color-text-print` or `--color-text-muted-print`
- AND borders MUST use `--color-border-print`
- AND links/accents MUST use `--color-accent-print`

## MODIFIED Requirements

None (new capability).

## REMOVED Requirements

None.

## RENAMED Requirements

None.