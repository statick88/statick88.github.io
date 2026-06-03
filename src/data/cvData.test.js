// cvData.test.js — shape contract tests
// Source of truth: src/data/cvData.js
// Why: prevent silent schema drift across 4 consumers (App.jsx, Metrics.jsx,
//      generate-cv-markdown.js, generate-profile-cvs.js, CI design-gate)

import { describe, it, expect } from 'vitest';
import { profileData, cvData } from './cvData.js';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const URL_PREFIX = 'https://';

const ALLOWED_LEVELS = ['beginner', 'intermediate', 'advanced', 'master'];
const ALLOWED_CATEGORIES = [
  'frontend-fundamentals',
  'frontend-frameworks',
  'backend',
  'mobile',
  'mobile-native',
  'devops',
  'databases',
  'architecture',
  'security',
  'ai',
  'methodology',
  'data',
  'research',
  'teaching',
  'tools',
];
const ALLOWED_STUDY_TYPES = ['Master', 'Bachelor', 'PhD', 'Diploma'];
const EXPECTED_PROFILES = ['developer', 'hacker', 'research', 'curriculista'];
const EXPECTED_METRICS = [
  'abacomCohorte2026',
  'githubRepos',
  'nlmNotebooks',
  'certificationsCount',
];

function isISODate(s) {
  return typeof s === 'string' && ISO_DATE.test(s);
}

function isBilingualString(v, max = 350) {
  return (
    v &&
    typeof v === 'object' &&
    typeof v.es === 'string' &&
    v.es.length > 0 &&
    v.es.length <= max &&
    typeof v.en === 'string' &&
    v.en.length > 0 &&
    v.en.length <= max
  );
}

describe('profileData', () => {
  it('is an object', () => {
    expect(typeof profileData).toBe('object');
    expect(profileData).not.toBeNull();
  });

  it('has exactly 4 expected profiles', () => {
    expect(Object.keys(profileData).sort()).toEqual([...EXPECTED_PROFILES].sort());
  });

  describe.each(EXPECTED_PROFILES)('profile "%s"', (key) => {
    it('exists and is an object', () => {
      expect(profileData[key]).toBeTypeOf('object');
      expect(profileData[key]).not.toBeNull();
    });

    it('has bilingual label (es, en)', () => {
      const { label } = profileData[key];
      expect(typeof label).toBe('object');
      expect(typeof label.es).toBe('string');
      expect(label.es.length).toBeGreaterThan(0);
      expect(typeof label.en).toBe('string');
      expect(label.en.length).toBeGreaterThan(0);
    });

    it('has non-empty skills array with valid level/category', () => {
      const skills = profileData[key].skills;
      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
      for (const s of skills) {
        expect(typeof s.name).toBe('string');
        expect(s.name.length).toBeGreaterThan(0);
        expect(ALLOWED_LEVELS).toContain(s.level);
        expect(ALLOWED_CATEGORIES).toContain(s.category);
      }
    });

    it('has non-empty certifications array with active status', () => {
      const certs = profileData[key].certifications;
      expect(Array.isArray(certs)).toBe(true);
      expect(certs.length).toBeGreaterThan(0);
      for (const c of certs) {
        expect(typeof c.name).toBe('string');
        expect(c.name.length).toBeGreaterThan(0);
        expect(typeof c.issuer).toBe('string');
        expect(c.issuer.length).toBeGreaterThan(0);
        expect(['active', 'expired', 'in-progress']).toContain(c.status);
      }
    });

    it('has bilingual summary ≤ 400 chars (CV display constraint)', () => {
      expect(isBilingualString(profileData[key].summary, 400)).toBe(true);
    });
  });
});

describe('cvData.work', () => {
  it('is an array of exactly 6 entries', () => {
    expect(Array.isArray(cvData.work)).toBe(true);
    expect(cvData.work).toHaveLength(6);
  });

  it.each(cvData.work)('entry "%s" has name, bilingual position, bilingual summary', (entry) => {
    expect(typeof entry.name).toBe('string');
    expect(entry.name.length).toBeGreaterThan(0);
    expect(isBilingualString(entry.position, 200)).toBe(true);
    expect(isBilingualString(entry.summary, 1000)).toBe(true);
  });

  it.each(cvData.work)('entry "%s" has valid startDate', (entry) => {
    expect(isISODate(entry.startDate)).toBe(true);
  });

  it.each(cvData.work.filter((e) => e.endDate !== undefined))(
    'closed entry "%s" has valid endDate',
    (entry) => {
      expect(isISODate(entry.endDate)).toBe(true);
    }
  );

  it.each(cvData.work.filter((e) => e.url !== undefined))(
    'entry "%s" url starts with https://',
    (entry) => {
      expect(typeof entry.url).toBe('string');
      expect(entry.url.startsWith(URL_PREFIX)).toBe(true);
    }
  );
});

describe('cvData.education', () => {
  it('is an array of exactly 3 entries', () => {
    expect(Array.isArray(cvData.education)).toBe(true);
    expect(cvData.education).toHaveLength(3);
  });

  it.each(cvData.education)('entry at %s has institution, bilingual area, valid studyType', (entry) => {
    expect(typeof entry.institution).toBe('string');
    expect(entry.institution.length).toBeGreaterThan(0);
    expect(isBilingualString(entry.area, 200)).toBe(true);
    expect(ALLOWED_STUDY_TYPES).toContain(entry.studyType);
  });

  it.each(cvData.education)('entry at %s has valid dates, https url, and non-empty score', (entry) => {
    expect(isISODate(entry.startDate)).toBe(true);
    expect(isISODate(entry.endDate)).toBe(true);
    expect(typeof entry.url).toBe('string');
    expect(entry.url.startsWith(URL_PREFIX)).toBe(true);
    expect(typeof entry.score).toBe('string');
    expect(entry.score.length).toBeGreaterThan(0);
  });
});

describe('cvData.metrics', () => {
  it('is an object with exactly 4 expected keys', () => {
    expect(typeof cvData.metrics).toBe('object');
    expect(Object.keys(cvData.metrics).sort()).toEqual([...EXPECTED_METRICS].sort());
  });

  describe.each(EXPECTED_METRICS)('metric "%s"', (key) => {
    it('has value, unit, bilingual label, and non-empty source', () => {
      const m = cvData.metrics[key];
      expect(typeof m).toBe('object');
      expect(typeof m.value).toBe('string');
      expect(m.value.length).toBeGreaterThan(0);
      expect(typeof m.unit).toBe('string');
      expect(typeof m.label_es).toBe('string');
      expect(m.label_es.length).toBeGreaterThan(0);
      expect(typeof m.label_en).toBe('string');
      expect(m.label_en.length).toBeGreaterThan(0);
      expect(typeof m.source).toBe('string');
      expect(m.source.length).toBeGreaterThan(0);
    });
  });
});
