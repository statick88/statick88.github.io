# Delta for Impact Metrics Engine

## ADDED Requirements

### Requirement: Quantified Bullet Enforcement (FR-02)

FR-02: Every `ExperienceEntry` MUST have `metrics` array with **minimum 2 entries**. Each metric MUST conform to `MetricSchema`:
- `label`: BilingualString (what was achieved)
- `value`: string | number (quantified result)
- `unit`: optional string (%, $, M, team members, CVSS points, etc.)
- `context`: optional BilingualString (timeframe, baseline, scope)
- `category`: required enum (revenue, cost-savings, risk-reduction, team-growth, efficiency, compliance, user-impact, technical-debt)

#### Scenario: Experience entry rejected without 2 metrics

- GIVEN `cv-data.yaml` has experience entry with 1 metric
- WHEN `validateCVData()` runs
- THEN validation MUST fail with error at `experience[i].metrics`
- AND error message MUST state "minimum 2 metrics required"

#### Scenario: Metric categories enforced

- GIVEN metric with `category: "innovation"` (not in enum)
- WHEN validation runs
- THEN error MUST list valid categories

### Requirement: Metric Categories for Executive Framing

Categories MUST map to executive/board-relevant outcomes:

| Category | Executive Lens | Example |
|----------|---------------|---------|
| revenue | Revenue protected/generated | "$2.4M ARR protected" |
| cost-savings | Cost reduction | "$180K/yr infrastructure savings" |
| risk-reduction | Risk posture improvement | "CVSS 9.8 → 0.0 (100% risk eliminated)" |
| team-growth | People/organizational | "Team 3→12 (4x in 18mo)" |
| efficiency | Operational excellence | "Deploy time 45min → 3min (93% reduction)" |
| compliance | Regulatory/standard | "SOC 2 Type II achieved in 6mo" |
| user-impact | Customer/stakeholder value | "99.99% uptime for 50K users" |
| technical-debt | Sustainability | "Legacy debt 40% → 8% in 2 quarters" |

#### Scenario: Metric renders with category badge

- GIVEN metric `{ category: "risk-reduction", label: "RCE mitigated", value: "9.8→0.0", unit: "CVSS" }`
- WHEN rendered in ExperienceCard
- THEN badge "Risk Reduction" shown with category color
- AND value prominently displayed

### Requirement: Metric Normalization

A build-time script (`scripts/normalize-metrics.ts`) MUST:
- Parse all metrics across experience entries
- Detect common patterns and suggest standardized phrasing
- Flag metrics without units or context
- Output `metrics-normalization-report.json` with warnings

#### Scenario: Missing unit flagged

- GIVEN metric `{ label: "Improved performance", value: "50" }` (no unit)
- WHEN normalization runs
- THEN warning: "experience[2].metrics[0]: missing unit — is this %, ms, x speedup?"

### Requirement: Impact Score Calculation for Projects

Each `ProjectEntry.impact` MUST include `cvss` (nullable) and `businessRisk` (BilingualString).

A computed `impactScore` (0-100) MUST be derived at build time:
```
impactScore = (cvssWeight * cvss/10) + (businessRiskWeight * riskLevelNumeric) + (remediationWeight * remediationQuality)
```
Where weights are configurable in `config/impact-scoring.json`.

This score drives project sorting in the "Security Impact" section (highest first).

#### Scenario: Projects sorted by impact score

- GIVEN 3 projects with scores 87, 45, 92
- WHEN SecurityImpactSection renders
- THEN order MUST be: 92, 87, 45

## MODIFIED Requirements

### Requirement: Experience Content Structure

Experience entries previously used narrative bullet points. Now MUST use structured `metrics` array plus optional `achievements` for qualitative highlights.

(Previously: Free-form markdown bullets in `cv-es.md`)

#### Scenario: Narrative bullets converted to metrics

- GIVEN old bullet: "Led team of 12 engineers delivering platform serving 50M users"
- WHEN migrated
- THEN becomes metrics:
  - `{ label: "Team size", value: "3→12", unit: "engineers", category: "team-growth" }`
  - `{ label: "User base", value: "50M", unit: "users", category: "user-impact" }`

## REMOVED Requirements

None.

## RENAMED Requirements

None.