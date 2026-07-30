# Delta for executive-cv-layout

## ADDED Requirements

### Requirement: Executive Two-Column Layout

The system MUST render a responsive two-column executive CV layout with a 30/70 split (left sidebar / right content) at desktop breakpoints (≥1024px).

The system MUST collapse to a single-column layout at tablet (768px–1023px) and mobile (≤767px) breakpoints with sidebar content stacked above main content.

#### Scenario: Desktop executive layout

- GIVEN the viewport width is 1440px
- WHEN the CV renders
- THEN the left column MUST occupy 30% width and right column 70% width
- AND left column MUST contain: photo, contact, links, top skills radar, languages, certifications summary
- AND right column MUST contain: executive summary, experience timeline, education, projects, full certifications

#### Scenario: Tablet responsive collapse

- GIVEN the viewport width is 768px
- WHEN the CV renders
- THEN the layout MUST switch to single column
- AND left column content MUST stack above right column content
- AND visual hierarchy MUST remain executive-appropriate

#### Scenario: Mobile responsive collapse

- GIVEN the viewport width is 375px
- WHEN the CV renders
- THEN the layout MUST be single column with full-width sections
- AND touch targets MUST meet 44×44pt minimum

### Requirement: Print Stylesheet for PDF Export

The system MUST provide a dedicated `@media print` stylesheet that produces a clean A4 PDF when using browser "Print → Save as PDF".

The system MUST suppress glassmorphism effects, animations, and interactive elements in print output.

The system MUST use flat color fallbacks for print with WCAG AA contrast.

#### Scenario: Print to PDF from Chrome

- GIVEN the user opens Chrome print dialog (Cmd+P)
- WHEN the print preview renders
- THEN the output MUST fit A4 page(s) with 15mm margins
- AND glassmorphism backgrounds MUST be replaced with solid colors
- AND Framer Motion animations MUST be disabled
- AND interactive elements (language toggle, hover cards) MUST be hidden
- AND page breaks MUST NOT split experience cards across pages

#### Scenario: Print to PDF from Firefox

- GIVEN the user opens Firefox print dialog
- WHEN the print preview renders
- THEN the output MUST match Chrome output within 2mm tolerance
- AND @page margins MUST be respected

#### Scenario: Print to PDF from Safari

- GIVEN the user opens Safari print dialog
- WHEN the print preview renders
- THEN the output MUST match Chrome output within 2mm tolerance

### Requirement: Executive Typography System

The system MUST implement an executive typography system using SF Pro Display/Text font stack with system fallbacks.

The system MUST enforce an 8pt baseline grid for all vertical spacing.

The system MUST meet WCAG 2.1 AA contrast ratios (4.5:1 normal, 3:1 large text).

#### Scenario: Typography renders with correct scale

- GIVEN the CV renders at desktop breakpoint
- WHEN typography is measured
- THEN headings MUST follow modular scale: H1 32px, H2 24px, H3 20px, H4 18px
- AND body text MUST be 16px with 1.5 line height (24px baseline)
- AND caption/small text MUST be 13px with 1.4 line height
- AND all vertical spacing MUST be multiples of 8px

#### Scenario: Contrast ratios meet WCAG AA

- GIVEN the executive color palette
- WHEN contrast is measured
- THEN text on primary backgrounds MUST achieve ≥4.5:1
- AND large text (≥18px) MUST achieve ≥3:1
- AND UI components (borders, focus rings) MUST achieve ≥3:1

## MODIFIED Requirements

### Requirement: cv-portfolio-app → Executive Layout Integration

The system MUST replace the existing single-column narrative Markdown rendering with the two-column executive layout component.

(Previously: Single-page narrative Markdown profiles rendered via remark/rehype)

#### Scenario: Layout component replaces Markdown renderer

- GIVEN the app loads
- WHEN the CV data is available
- THEN ExecutiveLayout component MUST render instead of MarkdownContent
- AND all sections MUST consume structured cv-data.yaml
- AND language toggle MUST switch ES/EN content without remount

## REMOVED Requirements

### Requirement: Narrative Markdown Profile Rendering

(Reason: Replaced by structured data → executive layout pipeline)
(Migration: Content migrated to cv-data.yaml with es/en keys; generate-cv-markdown.js produces legacy output for compatibility)

## RENAMED Requirements

None.