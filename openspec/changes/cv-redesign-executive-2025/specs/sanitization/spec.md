# Delta for Sanitization

## ADDED Requirements

### Requirement: Exploitarium Content Sanitization Pipeline

The system MUST implement a build-time sanitization pass that processes the `exploitarium` (exploit development exercises) section to remove all proof-of-concept code, payloads, exploitation steps, and sensitive technical details.

The sanitizer MUST retain only: category/classification, impact severity (CVSS), business risk summary, and mitigation strategy.

The sanitizer MUST be implemented as a transform function in `scripts/sanitize-exploitarium.mjs` that runs after data validation but before export generation.

#### Scenario: PoC code is removed from exploit entries

- GIVEN an exploit entry contains `pocCode`, `payload`, `exploitSteps` fields
- WHEN sanitizer runs
- THEN these fields MUST be stripped from output
- AND a `sanitized: true` flag MUST be added to the entry

#### Scenario: CVSS and impact are preserved

- GIVEN an exploit entry with `cvss: 9.8`, `impact: "RCE"`, `businessRisk: "Full server compromise"`
- WHEN sanitizer runs
- THEN `cvss`, `impact`, `businessRisk` MUST be preserved
- AND `mitigation` field MUST be preserved

#### Scenario: Category classification is preserved

- GIVEN exploit entry with `category: "buffer-overflow"`, `cwe: "CWE-120"`
- WHEN sanitizer runs
- THEN category and CWE MUST be preserved
- AND these MUST be used for the "Security Research" portfolio section

#### Scenario: Sanitization is deterministic and idempotent

- GIVEN same input run through sanitizer twice
- WHEN second run executes
- THEN output MUST be identical to first run
- AND no data loss beyond intended fields

### Requirement: Sensitive Data Redaction for Public CV

The system MUST redact or omit the following from public-facing exports: internal project codenames, non-public CVE IDs, client names under NDA, proprietary tool names, internal IP ranges.

A `sensitivity: "public" | "restricted" | "classified"` field MUST exist on each experience/project/cert entry.

Only `sensitivity: "public"` entries MUST appear in public exports (JSON, YAML, Markdown, HTML, PDF).

#### Scenario: Restricted entries excluded from public exports

- GIVEN a project entry with `sensitivity: "restricted"`
- WHEN public exports are generated
- THEN this entry MUST NOT appear in any public output
- AND a build log MUST note "Excluded 1 restricted entry"

#### Scenario: Classified entries never leave build environment

- GIVEN an experience entry with `sensitivity: "classified"`
- WHEN any export runs
- THEN entry MUST be omitted
- AND entry MUST NOT be written to any file in `dist/`
- AND build MUST NOT fail (silent exclusion with warning log)

## MODIFIED Requirements

None (new capability).

## REMOVED Requirements

None.

## RENAMED Requirements

None.