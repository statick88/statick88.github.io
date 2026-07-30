# Delta for Data Models

## ADDED Requirements

### Requirement: Core Zod Schemas for Bilingual CV Data

The system MUST define the following Zod schemas in `src/lib/schemas/cv-data.ts` as the single source of truth for all data validation, TypeScript types, and export generation.

#### BilingualString

```typescript
const BilingualStringSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});
```

Used for all user-facing text fields.

#### ContactInfo

```typescript
const ContactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  location: BilingualStringSchema,
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  twitter: z.string().url().optional(),
});
```

#### ExecutiveProfile

```typescript
const ExecutiveProfileSchema = z.object({
  name: BilingualStringSchema,
  headline: BilingualStringSchema,
  summary: BilingualStringSchema,
  photoUrl: z.string().url().optional(),
  contact: ContactInfoSchema,
  languages: z.array(LanguageEntrySchema),
  availability: BilingualStringSchema.optional(),
});
```

#### ExperienceEntry

```typescript
const MetricSchema = z.object({
  label: BilingualStringSchema,
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  context: BilingualStringSchema.optional(),
  category: z.enum([
    'revenue',
    'cost-savings',
    'risk-reduction',
    'team-growth',
    'efficiency',
    'compliance',
    'user-impact',
    'technical-debt',
  ]),
});

const ExperienceEntrySchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1),
  role: BilingualStringSchema,
  location: BilingualStringSchema,
  startDate: z.string().date(),
  endDate: z.string().date().nullable(),
  current: z.boolean(),
  description: BilingualStringSchema,
  metrics: z.array(MetricSchema).min(2),
  techStack: z.array(z.string()),
  sensitivity: z.enum(['public', 'restricted', 'classified']).default('public'),
  achievements: z.array(BilingualStringSchema).optional(),
});
```

#### EducationEntry

```typescript
const EducationEntrySchema = z.object({
  id: z.string().uuid(),
  institution: z.string().min(1),
  degree: BilingualStringSchema,
  field: BilingualStringSchema,
  location: BilingualStringSchema,
  startDate: z.string().date(),
  endDate: z.string().date().nullable(),
  current: z.boolean(),
  honors: z.array(BilingualStringSchema).optional(),
  gpa: z.string().optional(),
  verificationUrl: z.string().url().optional(),
});
```

#### ProjectEntry

```typescript
const ImpactScoreSchema = z.object({
  cvss: z.number().min(0).max(10).nullable(),
  businessRisk: BilingualStringSchema,
  riskLevel: z.enum(['critical', 'high', 'medium', 'low', 'informational']),
  remediation: BilingualStringSchema,
  detection: z.enum([
    'code-review',
    'penetration-test',
    'bug-bounty',
    'incident-response',
    'automated-scan',
    'architecture-review',
  ]),
});

const ProjectEntrySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: BilingualStringSchema,
  type: z.enum([
    'vulnerability-research',
    'security-tool',
    'secure-architecture',
    'incident-response',
    'compliance-audit',
    'secure-development',
    'open-source-library',
    'internal-tool',
    'educational-content',
    'consulting-engagement',
  ]),
  role: BilingualStringSchema,
  startDate: z.string().date(),
  endDate: z.string().date().nullable(),
  current: z.boolean(),
  techStack: z.array(z.string()),
  githubRepo: z.string().regex(/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/).optional(),
  githubStats: z.object({
    stars: z.number(),
    forks: z.number(),
    contributors: z.number(),
    lastCommit: z.string().datetime(),
    languages: z.record(z.string(), z.number()),
  }).optional(),
  impact: ImpactScoreSchema,
  visibility: z.enum(['public', 'restricted', 'classified']).default('public'),
  links: z.object({
    demo: z.string().url().optional(),
    docs: z.string().url().optional(),
    article: z.string().url().optional(),
  }).optional(),
});
```

#### CertificationEntry

```typescript
const CertificationEntrySchema = z.object({
  id: z.string().uuid(),
  name: BilingualStringSchema,
  issuer: z.string().min(1),
  credentialId: z.string().optional(),
  verificationUrl: z.string().url().optional(),
  verificationMethod: z.enum([
    'certificate-id',
    'transcript',
    'issuer-contact',
    'none',
  ]).optional(),
  issueDate: z.string().date(),
  expiryDate: z.string().date().nullable(),
  renewalDate: z.string().date().nullable(),
  category: z.enum([
    'security-leadership',
    'technical-security',
    'cloud-architecture',
    'governance-risk',
    'software-engineering',
    'leadership-management',
    'academic',
  ]),
  status: z.enum(['active', 'expired', 'renewing']).default('active'),
});
```

#### SkillEntry

```typescript
const SkillEntrySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: z.enum([
    'security-offensive',
    'security-defensive',
    'security-governance',
    'cloud-infrastructure',
    'software-architecture',
    'programming-languages',
    'frameworks-libraries',
    'tools-platforms',
    'methodologies',
    'leadership',
  ]),
  proficiency: z.enum(['expert', 'advanced', 'intermediate', 'learning']),
  yearsExperience: z.number().min(0).max(50).optional(),
  certifications: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
});
```

#### LanguageEntry

```typescript
const LanguageEntrySchema = z.object({
  code: z.string().length(2), // ISO 639-1
  name: BilingualStringSchema,
  proficiency: z.enum([
    'native',
    'fluent',
    'professional',
    'conversational',
    'basic',
  ]),
  certified: z.boolean().default(false),
  certification: z.string().optional(),
});
```

#### CVData (Root Schema)

```typescript
const CVDataSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  lastUpdated: z.string().date(),
  profile: ExecutiveProfileSchema,
  experience: z.array(ExperienceEntrySchema).min(1),
  education: z.array(EducationEntrySchema).min(1),
  projects: z.array(ProjectEntrySchema),
  certifications: z.array(CertificationEntrySchema),
  skills: z.array(SkillEntrySchema),
  languages: z.array(LanguageEntrySchema).min(1),
  exploitarium: z.array(ExploitariumEntrySchema).optional(),
  metadata: z.object({
    generatedAt: z.string().datetime(),
    generator: z.string(),
    schemaVersion: z.string(),
  }),
});
```

### Requirement: TypeScript Type Exports

The schema file MUST export inferred TypeScript types using `z.infer<typeof Schema>` for all schemas.

Types MUST be re-exported from `src/lib/schemas/index.ts` for consumer convenience.

#### Scenario: Types available for import

- GIVEN consumer imports `import type { CVData, ExperienceEntry } from '@/lib/schemas'`
- WHEN TypeScript compiles
- THEN types MUST be available and match schema definitions

### Requirement: Validation Function

A `validateCVData(data: unknown): CVData` function MUST be exported that:
- Parses input with `CVDataSchema.parse()`
- Returns typed `CVData` on success
- Throws `ZodError` with formatted message on failure

#### Scenario: Invalid data throws helpful error

- GIVEN data missing required `metrics` on experience entry
- WHEN `validateCVData(data)` called
- THEN error MUST include path: `experience[0].metrics`
- AND error message MUST list validation failures

## MODIFIED Requirements

None (new schemas for new data architecture).

## REMOVED Requirements

None.

## RENAMED Requirements

None.