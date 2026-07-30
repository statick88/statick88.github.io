# Delta for Quantified Metrics

## ADDED Requirements

### Requirement: Minimum Two Quantified Bullets per Experience Role

Every experience entry in `cv-data.yaml` MUST contain at least two `metrics` objects in its `metrics` array.

Each metric MUST have: `label` (BilingualString), `value` (string|number), `unit` (optional string), `context` (optional BilingualString).

The `label` MUST describe a business outcome (revenue, users, team size, budget, risk reduction, efficiency gain).

The `value` MUST be a specific number or range, not qualitative text.

#### Scenario: Role has two quantified metrics

- GIVEN an experience entry
- WHEN data validation runs
- THEN `metrics` array MUST have length ≥ 2
- AND each metric MUST have `label`, `value` fields
- AND `label.es` and `label.en` MUST both exist

#### Scenario: Metrics use business outcome language

- GIVEN a metric with `label: { es: "Ingresos protegidos", en: "Revenue protected" }`
- WHEN validated
- THEN label MUST NOT be task-oriented (e.g., "Implemented X")
- AND label MUST be outcome-oriented (e.g., "Revenue protected", "Risk reduced", "Team scaled")

#### Scenario: Values are specific and verifiable

- GIVEN a metric with `value: "$2.4M"` or `value: "47%"`
- WHEN validated
- THEN value MUST contain a number
- AND unit MUST be clear from value or `unit` field
- AND vague values like "significant", "major", "large" MUST fail validation

### Requirement: Metric Categories Enforced

Metrics MUST be categorized using a `category` field with allowed values: `revenue`, `cost-savings`, `risk-reduction`, `team-growth`, `efficiency`, `compliance`, `user-impact`, `technical-debt`.

At least one metric per role SHOULD be `risk-reduction` or `revenue` for executive positioning.

#### Scenario: Metric has valid category

- GIVEN a metric with `category: "risk-reduction"`
- WHEN validated
- THEN category MUST be in allowed enum
- AND validation MUST pass

#### Scenario: Invalid category rejected

- GIVEN a metric with `category: "awesome"`
- WHEN validated
- THEN Zod validation MUST fail
- AND error MUST list allowed categories

### Requirement: Project-Level Security Impact Scoring

Each project in the `projects` array MUST include an `impactScore` object with: `cvss` (number 0-10 or null), `businessRisk` (BilingualString), `remediationStatus` (enum: `resolved`, `mitigated`, `accepted`, `in-progress`), `detectionMethod` (enum: `manual`, `automated`, `bug-bounty`, `incident-response`).

For exploitarium/research projects, `cvss` MUST be present.

For internal tooling, `cvss` MAY be null but `businessRisk` MUST be present.

#### Scenario: Security project has CVSS score

- GIVEN a project with `type: "security-research"`
- WHEN validated
- THEN `impactScore.cvss` MUST be number 0-10
- AND `impactScore.businessRisk` MUST be BilingualString

#### Scenario: Internal tool has business risk but no CVSS

- GIVEN a project with `type: "internal-tool"`
- WHEN validated
- THEN `impactScore.cvss` MAY be null
- AND `impactScore.businessRisk` MUST be present

## MODIFIED Requirements

None (new capability).

## REMOVED Requirements

None.

## RENAMED Requirements

None.