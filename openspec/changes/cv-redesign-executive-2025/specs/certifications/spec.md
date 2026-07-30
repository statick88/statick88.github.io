# Delta for Certifications

## ADDED Requirements

### Requirement: Certification Verification Links

Every certification entry in `cv-data.yaml` MUST include a `verificationUrl` field (HTTPS URL) that links to the issuer's public verification page.

For certifications without public verification (e.g., internal training), `verificationUrl` MAY be omitted but `verificationMethod` field MUST be present with value: `certificate-id`, `transcript`, `issuer-contact`, or `none`.

The `credentialId` field MUST be present for all certifications with public verification.

#### Scenario: Public certification has verification URL

- GIVEN a certification entry for "CISSP"
- WHEN validated
- THEN `verificationUrl` MUST be present and valid HTTPS URL
- AND `credentialId` MUST be present
- AND URL MUST resolve to issuer verification page (ISC2, (ISC)², etc.)

#### Scenario: Internal certification has verification method

- GIVEN a certification with `issuer: "Internal Security Training"`
- WHEN validated
- THEN `verificationUrl` MAY be omitted
- AND `verificationMethod` MUST be one of allowed enum values

#### Scenario: Expired certifications are flagged

- GIVEN a certification with `expiryDate` in the past
- WHEN validated
- THEN a warning MUST be logged at build time
- AND entry MUST include `status: "expired"` field
- AND entry MUST still appear in CV (experience is permanent)

### Requirement: Certification Expiry Tracking

Each certification entry MUST have optional `expiryDate` (ISO 8601 date) and `renewalDate` (ISO 8601 date) fields.

A build-time script MUST check all certifications and emit warnings for:
- Expired certifications (`expiryDate < today`)
- Expiring within 90 days (`expiryDate < today + 90 days`)
- Missing expiry date for certifications that require renewal

#### Scenario: Expired certification warning

- GIVEN CISSP with `expiryDate: "2023-01-15"`
- WHEN build runs today (2025)
- THEN build log MUST contain: "WARNING: CISSP expired on 2023-01-15"
- AND build MUST NOT fail

#### Scenario: Expiring soon warning

- GIVEN AWS Solutions Architect with `expiryDate: "2025-10-15"` (today: 2025-08-01)
- WHEN build runs
- THEN build log MUST contain: "WARNING: AWS Solutions Architect expires in 75 days"
- AND build MUST NOT fail

#### Scenario: Lifetime certification no expiry

- GIVEN university degree with `expiryDate: null`
- WHEN build runs
- THEN no warning for this entry
- AND validation MUST pass

### Requirement: Certification Categories for Executive Display

Certifications MUST be categorized for grouped display in the executive layout using `category` enum: `security-leadership`, `technical-security`, `cloud-architecture`, `governance-risk`, `software-engineering`, `leadership-management`, `academic`.

The executive layout MUST group and display certifications by category with category headers.

#### Scenario: Certifications grouped by category

- GIVEN certifications with categories `security-leadership`, `cloud-architecture`, `technical-security`
- WHEN rendered in executive layout
- THEN each category MUST render as a section with header
- AND certifications within category MUST be sorted by date (newest first)

## MODIFIED Requirements

None (new capability).

## REMOVED Requirements

None.

## RENAMED Requirements

None.