# Delta for structured-cv-data

## ADDED Requirements

### Requirement: CV Data Schema Definition (Zod)

The system MUST define a complete Zod schema (`cv-schema.ts`) covering all CV domains: profile, experience, education, projects, certifications, skills, metrics, GitHub stats, and languages.

The schema MUST enforce bilingual (ES/EN) content for all user-facing strings using a `BilingualString` type.

The schema MUST validate at build time via `scripts/generate-cv-data.mjs` and fail the build on any validation error.

#### Scenario: Schema validates complete CV data

- GIVEN a valid `cv-data.yaml` file
- WHEN `scripts/generate-cv-data.mjs` runs
- THEN Zod validation MUST pass without errors
- AND TypeScript types MUST be inferred from Zod schema
- AND all required fields MUST be present

#### Scenario: Schema rejects missing bilingual content

- GIVEN a `cv-data.yaml` with a field missing `en` or `es` key
- WHEN validation runs
- THEN Zod MUST throw a validation error
- AND the error message MUST identify the missing language key and field path

#### Scenario: Schema validates experience metrics structure

- GIVEN an experience entry with `metrics` field
- WHEN validation runs
- THEN each metric MUST have `label`, `value`, and optional `unit` fields
- AND `value` MUST be string or number
- AND `label` MUST be BilingualString

### Requirement: Single Source of Truth YAML File

The system MUST maintain a single `src/data/cv-data.yaml` file as the authoritative source for all CV content.

The YAML MUST use `es`/`en` keys for every user-facing string.

The YAML MUST include all sections: profile, experience[], education[], projects[], certifications[], skills, metrics, githubStats, languages.

#### Scenario: YAML loads and parses correctly

- GIVEN `cv-data.yaml` exists at `src/data/`
- WHEN the build script reads it
- THEN the YAML MUST parse without errors
- AND the resulting object MUST match the Zod schema
- AND all bilingual fields MUST have both `es` and `en` keys

#### Scenario: YAML lint rule enforces bilingual keys

- GIVEN a new field added to YAML without `en` key
- WHEN `pnpm lint:cv-data` runs (custom script)
- THEN the lint MUST fail with descriptive error
- AND the error MUST show the field path and missing language

### Requirement: TypeScript Types Generated from Schema

The system MUST export TypeScript interfaces/types derived from the Zod schema via `z.infer<typeof schema>`.

These types MUST be used by all React components and export scripts for compile-time safety.

#### Scenario: Components consume inferred types

- GIVEN a component imports `Experience` from `cv-schema.ts`
- WHEN TypeScript compiles
- THEN the component props MUST be fully typed
- AND missing fields MUST cause compile error
- AND extra fields MUST cause compile error

## MODIFIED Requirements

None (new capability).

## REMOVED Requirements

None.

## RENAMED Requirements

None.