import { describe, it, expect } from 'vitest';
import {
  CVDataSchema,
  BilingualStringSchema,
  ContactInfoSchema,
  LanguageEntrySchema,
  ExecutiveProfileSchema,
  ExperienceEntrySchema,
  EducationEntrySchema,
  SkillEntrySchema,
  CertificationEntrySchema,
  ProjectEntrySchema,
  MetricsSummarySchema,
  validateCVData,
  validateCVDataSafe,
  formatValidationErrors,
} from '@/lib/schemas/cv-data';

// ============================================================================
// Bilingual String
// ============================================================================

describe('BilingualStringSchema', () => {
  it('accepts valid bilingual string', () => {
    const result = BilingualStringSchema.safeParse({ es: 'Hola', en: 'Hello' });
    expect(result.success).toBe(true);
  });

  it('rejects empty es', () => {
    const result = BilingualStringSchema.safeParse({ es: '', en: 'Hello' });
    expect(result.success).toBe(false);
  });

  it('rejects empty en', () => {
    const result = BilingualStringSchema.safeParse({ es: 'Hola', en: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing field', () => {
    const result = BilingualStringSchema.safeParse({ es: 'Hola' });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Contact Info
// ============================================================================

describe('ContactInfoSchema', () => {
  it('accepts valid contact with required fields', () => {
    const result = ContactInfoSchema.safeParse({
      email: 'test@example.com',
      location: 'Guayaquil, Ecuador',
    });
    expect(result.success).toBe(true);
  });

  it('accepts contact with optional fields', () => {
    const result = ContactInfoSchema.safeParse({
      email: 'test@example.com',
      location: 'Guayaquil, Ecuador',
      phone: '+593-99-123-4567',
      linkedin: 'https://linkedin.com/in/test',
      github: 'https://github.com/test',
      portfolio: 'https://example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = ContactInfoSchema.safeParse({
      email: 'not-an-email',
      location: 'Guayaquil, Ecuador',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing location', () => {
    const result = ContactInfoSchema.safeParse({
      email: 'test@example.com',
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Language Entry
// ============================================================================

describe('LanguageEntrySchema', () => {
  it('accepts valid language entry', () => {
    const result = LanguageEntrySchema.safeParse({
      language: 'Español',
      level: 'Nativo',
      code: 'es',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid code length', () => {
    const result = LanguageEntrySchema.safeParse({
      language: 'Español',
      level: 'Nativo',
      code: 'esp',
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Executive Profile
// ============================================================================

describe('ExecutiveProfileSchema', () => {
  it('accepts valid profile', () => {
    const result = ExecutiveProfileSchema.safeParse({
      name: 'Diego Medardo Saavedra García',
      role: { es: 'Ingeniero de Software', en: 'Software Engineer' },
      summary: { es: 'Resumen', en: 'Summary' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = ExecutiveProfileSchema.safeParse({
      role: { es: 'Ingeniero', en: 'Engineer' },
      summary: { es: 'Resumen', en: 'Summary' },
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Experience Entry
// ============================================================================

describe('ExperienceEntrySchema', () => {
  const validEntry = {
    company: 'ABACOM',
    position: { es: 'Ingeniero de Software Senior', en: 'Senior Software Engineer' },
    startDate: '2021-06',
    endDate: null,
    isCurrent: true,
    highlights: {
      es: ['Highlight 1'],
      en: ['Highlight 1'],
    },
    technologies: ['React', 'TypeScript'],
  };

  it('accepts valid experience entry', () => {
    const result = ExperienceEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it('accepts entry with metrics', () => {
    const result = ExperienceEntrySchema.safeParse({
      ...validEntry,
      metrics: [
        {
          label: { es: 'Horas', en: 'Hours' },
          value: '200',
          unit: 'hrs',
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('accepts entry with reference', () => {
    const result = ExperienceEntrySchema.safeParse({
      ...validEntry,
      reference: {
        name: 'John Doe',
        role: 'CTO',
        id: 'REF-001',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing company', () => {
    const result = ExperienceEntrySchema.safeParse({
      position: { es: 'Ingeniero', en: 'Engineer' },
      startDate: '2021-06',
      endDate: null,
      isCurrent: true,
      highlights: { es: ['H1'], en: ['H1'] },
      technologies: ['React'],
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Education Entry
// ============================================================================

describe('EducationEntrySchema', () => {
  const validEntry = {
    institution: 'UTPL',
    program: { es: 'Maestría', en: "Master's" },
    degree: 'Maestría en Ingeniería de Software',
    startDate: '2018',
    endDate: '2021',
    isCurrent: false,
  };

  it('accepts valid education entry', () => {
    const result = EducationEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it('accepts entry with GPA', () => {
    const result = EducationEntrySchema.safeParse({
      ...validEntry,
      gpa: '4.0',
    });
    expect(result.success).toBe(true);
  });

  it('accepts entry with status', () => {
    const result = EducationEntrySchema.safeParse({
      ...validEntry,
      status: { es: 'En progreso', en: 'In progress' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing institution', () => {
    const result = EducationEntrySchema.safeParse({
      program: { es: 'Maestría', en: "Master's" },
      degree: 'Maestría',
      startDate: '2018',
      endDate: '2021',
      isCurrent: false,
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Skill Entry
// ============================================================================

describe('SkillEntrySchema', () => {
  it('accepts valid skill', () => {
    const result = SkillEntrySchema.safeParse({
      name: 'React',
      level: 'Experto',
      category: 'frontend-frameworks',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = SkillEntrySchema.safeParse({
      level: 'Experto',
      category: 'frontend-frameworks',
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Certification Entry
// ============================================================================

describe('CertificationEntrySchema', () => {
  it('accepts valid certification', () => {
    const result = CertificationEntrySchema.safeParse({
      name: { es: 'AWS SAA', en: 'AWS SAA' },
      issuer: 'Amazon Web Services',
      date: '2024-09',
      status: 'active',
    });
    expect(result.success).toBe(true);
  });

  it('accepts certification with credential ID', () => {
    const result = CertificationEntrySchema.safeParse({
      name: { es: 'AWS SAA', en: 'AWS SAA' },
      issuer: 'Amazon Web Services',
      date: '2024-09',
      status: 'active',
      credentialId: 'ABC123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing issuer', () => {
    const result = CertificationEntrySchema.safeParse({
      name: { es: 'AWS SAA', en: 'AWS SAA' },
      date: '2024-09',
      status: 'active',
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Project Entry
// ============================================================================

describe('ProjectEntrySchema', () => {
  it('accepts valid project', () => {
    const result = ProjectEntrySchema.safeParse({
      name: 'test-project',
      description: { es: 'Descripción', en: 'Description' },
      technologies: ['TypeScript', 'Vite'],
    });
    expect(result.success).toBe(true);
  });

  it('accepts project with metrics', () => {
    const result = ProjectEntrySchema.safeParse({
      name: 'test-project',
      description: { es: 'Descripción', en: 'Description' },
      technologies: ['TypeScript'],
      metrics: { stars: 10, forks: 3, issues: 2 },
    });
    expect(result.success).toBe(true);
  });

  it('accepts project with security flags', () => {
    const result = ProjectEntrySchema.safeParse({
      name: 'security-tool',
      description: { es: 'Herramienta', en: 'Tool' },
      technologies: ['Python'],
      securityRelevant: true,
      featured: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = ProjectEntrySchema.safeParse({
      description: { es: 'Desc', en: 'Desc' },
      technologies: ['TypeScript'],
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Metrics Summary
// ============================================================================

describe('MetricsSummarySchema', () => {
  it('accepts valid metrics', () => {
    const result = MetricsSummarySchema.safeParse({
      yearsExperience: 10,
      yearsTeaching: 9,
      totalHoursTeaching: 200,
      githubPublicRepos: 5,
      publicReposAudited: 20,
      averageCohortScore: 93.4,
      apcYearsService: 9,
      languagesSpoken: 2,
      totalProjectsAudited: 60,
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-number value', () => {
    const result = MetricsSummarySchema.safeParse({
      yearsExperience: 'ten',
      yearsTeaching: 9,
      totalHoursTeaching: 200,
      githubPublicRepos: 5,
      publicReposAudited: 20,
      averageCohortScore: 93.4,
      apcYearsService: 9,
      languagesSpoken: 2,
      totalProjectsAudited: 60,
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// CVDataSchema (Root)
// ============================================================================

describe('CVDataSchema', () => {
  const validCV = {
    profile: {
      name: 'Diego Medardo Saavedra García',
      role: { es: 'Ingeniero de Software', en: 'Software Engineer' },
      summary: { es: 'Resumen', en: 'Summary' },
    },
    contact: {
      email: 'diego@example.com',
      location: 'Guayaquil, Ecuador',
    },
    experience: [
      {
        company: 'ABACOM',
        position: { es: 'Ingeniero Senior', en: 'Senior Engineer' },
        startDate: '2021-06',
        endDate: null,
        isCurrent: true,
        highlights: { es: ['H1'], en: ['H1'] },
        technologies: ['React'],
      },
    ],
    education: [
      {
        institution: 'UTPL',
        program: { es: 'Maestría', en: "Master's" },
        degree: 'Maestría en Ingeniería',
        startDate: '2018',
        endDate: '2021',
        isCurrent: false,
      },
    ],
    skills: [
      { name: 'React', level: 'Experto', category: 'frontend-frameworks' },
    ],
    languages: [
      { language: 'Español', level: 'Nativo', code: 'es' },
    ],
    certifications: [
      {
        name: { es: 'AWS', en: 'AWS' },
        issuer: 'Amazon',
        date: '2024',
        status: 'active',
      },
    ],
    projects: [
      {
        name: 'test-project',
        description: { es: 'Desc', en: 'Desc' },
        technologies: ['TypeScript'],
      },
    ],
    metrics: {
      yearsExperience: 10,
      yearsTeaching: 9,
      totalHoursTeaching: 200,
      githubPublicRepos: 5,
      publicReposAudited: 20,
      averageCohortScore: 93.4,
      apcYearsService: 9,
      languagesSpoken: 2,
      totalProjectsAudited: 60,
    },
    metadata: {
      schemaVersion: '1.0.0',
      lastVerified: '2026-06-01',
      dataSources: ['cv-data.yaml'],
      auditTrail: ['Created'],
    },
  };

  it('accepts complete valid CV data', () => {
    const result = CVDataSchema.safeParse(validCV);
    expect(result.success).toBe(true);
  });

  it('rejects missing profile', () => {
    const { profile, ...cvWithoutProfile } = validCV;
    const result = CVDataSchema.safeParse(cvWithoutProfile);
    expect(result.success).toBe(false);
  });

  it('rejects empty experience array', () => {
    const result = CVDataSchema.safeParse({ ...validCV, experience: [] });
    expect(result.success).toBe(false);
  });

  it('rejects empty education array', () => {
    const result = CVDataSchema.safeParse({ ...validCV, education: [] });
    expect(result.success).toBe(false);
  });

  it('rejects empty languages array', () => {
    const result = CVDataSchema.safeParse({ ...validCV, languages: [] });
    expect(result.success).toBe(false);
  });

  it('rejects missing metrics', () => {
    const { metrics, ...cvWithoutMetrics } = validCV;
    const result = CVDataSchema.safeParse(cvWithoutMetrics);
    expect(result.success).toBe(false);
  });

  it('rejects missing metadata', () => {
    const { metadata, ...cvWithoutMetadata } = validCV;
    const result = CVDataSchema.safeParse(cvWithoutMetadata);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// validateCVData (parse with throw)
// ============================================================================

describe('validateCVData', () => {
  it('returns parsed data on valid input', () => {
    const data = {
      profile: {
        name: 'Test',
        role: { es: 'R', en: 'R' },
        summary: { es: 'S', en: 'S' },
      },
      contact: { email: 'a@b.com', location: 'City' },
      experience: [
        {
          company: 'Co',
          position: { es: 'P', en: 'P' },
          startDate: '2020',
          endDate: null,
          isCurrent: true,
          highlights: { es: ['H'], en: ['H'] },
          technologies: ['T'],
        },
      ],
      education: [
        {
          institution: 'I',
          program: { es: 'P', en: 'P' },
          degree: 'D',
          startDate: '2020',
          endDate: null,
          isCurrent: false,
        },
      ],
      skills: [{ name: 'S', level: 'L', category: 'C' }],
      languages: [{ language: 'L', level: 'L', code: 'en' }],
      certifications: [],
      projects: [],
      metrics: {
        yearsExperience: 1,
        yearsTeaching: 1,
        totalHoursTeaching: 1,
        githubPublicRepos: 1,
        publicReposAudited: 1,
        averageCohortScore: 1,
        apcYearsService: 1,
        languagesSpoken: 1,
        totalProjectsAudited: 1,
      },
      metadata: {
        schemaVersion: '1.0.0',
        lastVerified: '2026-01-01',
        dataSources: ['test'],
        auditTrail: ['test'],
      },
    };
    const result = validateCVData(data);
    expect(result.profile.name).toBe('Test');
  });

  it('throws on invalid input', () => {
    expect(() => validateCVData({})).toThrow();
  });
});

// ============================================================================
// validateCVDataSafe
// ============================================================================

describe('validateCVDataSafe', () => {
  it('returns success: true on valid input', () => {
    const result = validateCVDataSafe({
      profile: { name: 'T', role: { es: 'R', en: 'R' }, summary: { es: 'S', en: 'S' } },
      contact: { email: 'a@b.com', location: 'C' },
      experience: [{ company: 'Co', position: { es: 'P', en: 'P' }, startDate: '2020', endDate: null, isCurrent: true, highlights: { es: ['H'], en: ['H'] }, technologies: ['T'] }],
      education: [{ institution: 'I', program: { es: 'P', en: 'P' }, degree: 'D', startDate: '2020', endDate: null, isCurrent: false }],
      skills: [{ name: 'S', level: 'L', category: 'C' }],
      languages: [{ language: 'L', level: 'L', code: 'en' }],
      certifications: [],
      projects: [],
      metrics: { yearsExperience: 1, yearsTeaching: 1, totalHoursTeaching: 1, githubPublicRepos: 1, publicReposAudited: 1, averageCohortScore: 1, apcYearsService: 1, languagesSpoken: 1, totalProjectsAudited: 1 },
      metadata: { schemaVersion: '1.0.0', lastVerified: '2026-01-01', dataSources: ['t'], auditTrail: ['t'] },
    });
    expect(result.success).toBe(true);
  });

  it('returns success: false on invalid input', () => {
    const result = validateCVDataSafe({});
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// formatValidationErrors
// ============================================================================

describe('formatValidationErrors', () => {
  it('formats ZodError issues into readable strings', () => {
    const result = CVDataSchema.safeParse({});
    if (!result.success) {
      const formatted = formatValidationErrors(result.error);
      expect(Array.isArray(formatted)).toBe(true);
      expect(formatted.length).toBeGreaterThan(0);
      expect(typeof formatted[0]).toBe('string');
    }
  });
});
