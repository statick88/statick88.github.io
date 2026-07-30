# Delta for Structured Exports

## ADDED Requirements

### Requirement: Multi-Format Export Generation (FR-04)

FR-04: Build MUST generate structured exports from validated `cv-data.yaml`:

1. **JSON** (`dist/cv-data.json`) — Full validated object, camelCase keys
2. **YAML** (`dist/cv-data.yaml`) — Round-trip identical to source (preserves comments/order)
3. **Markdown ES** (`dist/cv-es.md`) — Spanish narrative render
4. **Markdown EN** (`dist/cv-en.md`) — English narrative render
5. **HTML** (`dist/index.html`) — SPA entry point
6. **PDF** (`dist/diego-saavedra-cv.pdf`) — Print-optimized A4

All exports MUST be generated in single build command (`pnpm build`).

#### Scenario: All formats generated in one build

- GIVEN `pnpm build` runs successfully
- WHEN build completes
- THEN all 6 files MUST exist in `dist/`
- AND each MUST be valid (parseable, no errors)

### Requirement: JSON Schema Export

A JSON Schema (`dist/cv-schema.json`) MUST be generated from Zod schemas using `zod-to-json-schema`.

This enables:
- External validation of CV data
- IDE autocomplete for consumers
- ATS parser schema reference

#### Scenario: JSON Schema valid and complete

- GIVEN `dist/cv-schema.json` exists
- WHEN validated against `cv-data.json` using AJV
- THEN validation MUST pass
- AND schema MUST include all Zod refinements (minLength, enums, etc.)

### Requirement: Narrative Markdown Renderer

A renderer (`scripts/render-markdown.ts`) MUST convert structured data to executive-style Markdown:

- Experience entries → "Role at Company (Dates)" headers
- Metrics → Bold quantified bullets with category icons
- Projects → Security impact summary tables
- Certifications → Grouped by category with verification links
- Education → Reverse chronological with honors

Bilingual: Two passes with locale `es` then `en`.

#### Scenario: Spanish Markdown has executive tone

- GIVEN Spanish locale render
- WHEN `cv-es.md` generated
- THEN language MUST be professional Spanish (Spain/Colombia neutral)
- AND metrics MUST use Spanish formatting (1.234,56 not 1,234.56)
- AND dates MUST be "Enero 2024" not "January 2024"

### Requirement: Career-Ops JSON Export

A specialized export (`dist/career-ops.json`) MUST conform to the Career-Ops schema:
```typescript
interface CareerOpsCV {
  basics: { name, label, email, phone, url, location, profiles[] };
  work: Company[]; // with highlights array
  education: Institution[];
  certificates: Certificate[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
}
```
This feeds automated job application pipelines.

#### Scenario: Career-ops JSON passes schema validation

- GIVEN `dist/career-ops.json`
- WHEN validated against Career-Ops JSON Schema
- THEN MUST pass
- AND `work[].highlights` MUST contain ≥2 quantified bullets per role

## MODIFIED Requirements

None (new capability).

## REMOVED Requirements

None.

## RENAMED Requirements

None.