# Delta for Projects with Security Scoring

## ADDED Requirements

### Requirement: Project Security Impact Scoring

Every project entry in `cv-data.yaml` MUST include an `impact` object with security-relevant scoring fields.

The `impact` object MUST contain: `cvss` (number 0-10 or null), `businessRisk` (BilingualString), `riskLevel` (enum: `critical`, `high`, `medium`, `low`, `informational`), `remediation` (BilingualString), `detection` (enum: `code-review`, `penetration-test`, `bug-bounty`, `incident-response`, `automated-scan`, `architecture-review`).

For non-security projects (e.g., internal tools, open-source libraries), `cvss` MAY be null but `businessRisk` and `riskLevel` MUST still be present.

#### Scenario: Vulnerability research project has full scoring

- GIVEN a project with `type: "vulnerability-research"`
- WHEN validated
- THEN `impact.cvss` MUST be number 0-10
- AND `impact.riskLevel` MUST match CVSS bands (critical≥9, high≥7, medium≥4, low≥0.1)
- AND `impact.remediation` MUST describe the fix/mitigation
- AND `impact.detection` MUST be one of allowed enum

#### Scenario: Open source library has risk level but no CVSS

- GIVEN a project with `type: "open-source-library"`
- WHEN validated
- THEN `impact.cvss` MAY be null
- AND `impact.riskLevel` MUST be present (typically `low` or `informational`)
- AND `impact.businessRisk` MUST explain supply chain risk if any

#### Scenario: Risk level matches CVSS bands

- GIVEN a project with `impact.cvss: 9.8`
- WHEN validated
- THEN `impact.riskLevel` MUST be `critical`
- AND mismatch MUST cause validation error

### Requirement: Project Type Classification

Each project MUST have a `type` field with enum: `vulnerability-research`, `security-tool`, `secure-architecture`, `incident-response`, `compliance-audit`, `secure-development`, `open-source-library`, `internal-tool`, `educational-content`, `consulting-engagement`.

The executive layout MUST filter and group projects by type for the "Security Impact" section.

#### Scenario: Projects grouped by type in layout

- GIVEN projects of types `vulnerability-research`, `security-tool`, `secure-architecture`
- WHEN rendered
- THEN each type MUST render as a subsection
- AND subsection header MUST use human-readable label from i18n

### Requirement: GitHub Repository Linkage

Projects with public GitHub repositories MUST include `githubRepo` field with owner/repo format (e.g., `statick88/exploitarium`).

Build-time GitHub enrichment (`github-collab-viz`) MUST fetch: stars, forks, contributors, last commit date, language breakdown.

This data MUST be merged into project entry at build time and available in all exports.

#### Scenario: GitHub data enriches project entry

- GIVEN project with `githubRepo: "statick88/exploitarium"`
- WHEN build-time enrichment runs
- THEN project entry in `dist/` MUST include `githubStats` object with stars, forks, contributors
- AND `githubStats.lastCommit` MUST be ISO date string

#### Scenario: Private repo handled gracefully

- GIVEN project with `githubRepo: "private-org/internal-tool"` (private)
- WHEN enrichment runs
- THEN enrichment MUST NOT fail build
- AND `githubStats` MUST be `{ error: "private-repo", public: false }`
- AND project MUST still render without GitHub stats

### Requirement: Technology Stack Tags

Each project MUST have `techStack` array of strings (e.g., `["Rust", "Tauri", "React", "PostgreSQL"]`).

The executive layout MUST render tech stack as pills/badges.

A build-time script MUST normalize tech stack names against a canonical list (e.g., "React.js" → "React", "TS" → "TypeScript").

#### Scenario: Tech stack normalized

- GIVEN project with `techStack: ["React.js", "TS", "Node"]`
- WHEN normalization runs
- THEN output MUST be `["React", "TypeScript", "Node.js"]`
- AND canonical list MUST be maintained in `scripts/tech-stack-canonical.json`

## MODIFIED Requirements

None (new capability).

## REMOVED Requirements

None.

## RENAMED Requirements

None.