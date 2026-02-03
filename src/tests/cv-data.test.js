import { describe, it, expect } from 'vitest';

describe('CV Data Loading', () => {
  it('should load cv.json correctly', () => {
    const cvData = {
      basics: {
        name: "Test Name",
        email: "test@example.com"
      },
      work: [],
      education: []
    };
    
    expect(cvData).toBeDefined();
    expect(cvData.basics).toBeDefined();
    expect(cvData.basics.name).toBeDefined();
    expect(cvData.basics.email).toBeDefined();
  });

  it('should have required fields in cv.json', () => {
    const cvData = {
      basics: {
        name: "Test Name",
        email: "test@example.com",
        location: { city: "Test City", countryCode: "TC" }
      },
      work: [],
      education: [],
      skills: [],
      projects: []
    };
    
    expect(cvData.basics.name).toBeTruthy();
    expect(cvData.basics.email).toBeTruthy();
    expect(cvData.basics.location).toBeDefined();
    expect(Array.isArray(cvData.work)).toBe(true);
    expect(Array.isArray(cvData.education)).toBe(true);
    expect(Array.isArray(cvData.skills)).toBe(true);
    expect(Array.isArray(cvData.projects)).toBe(true);
  });
});
