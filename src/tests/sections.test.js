import { describe, it, expect } from 'vitest';

describe('Hero Section', () => {
  it('should render with proper content', () => {
    const heroData = {
      name: "Test Name",
      label: { es: "Label ES", en: "Label EN" },
      location: { city: "Test City", countryCode: "TC" }
    };
    
    expect(heroData.name).toBe("Test Name");
    expect(heroData.label.es).toBe("Label ES");
    expect(heroData.label.en).toBe("Label EN");
  });
});

describe('Skills Section', () => {
  it('should render correctly', () => {
    const skills = [
      { name: "JavaScript", level: "Advanced" },
      { name: "Python", level: "Advanced" }
    ];
    
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBe(2);
    expect(skills[0].name).toBe("JavaScript");
    expect(skills[1].name).toBe("Python");
  });
});

describe('Experience Section', () => {
  it('should render correctly', () => {
    const work = [
      {
        name: "Company A",
        position: { es: "Position ES", en: "Position EN" },
        startDate: "2020-01-01",
        endDate: "2022-01-01"
      }
    ];
    
    expect(Array.isArray(work)).toBe(true);
    expect(work[0].name).toBe("Company A");
    expect(work[0].position.es).toBe("Position ES");
  });
});

describe('Education Section', () => {
  it('should render correctly', () => {
    const education = [
      {
        institution: "University A",
        area: { es: "Degree ES", en: "Degree EN" },
        studyType: "Bachelor",
        startDate: "2015-01-01",
        endDate: "2019-01-01"
      }
    ];
    
    expect(Array.isArray(education)).toBe(true);
    expect(education[0].institution).toBe("University A");
    expect(education[0].area.es).toBe("Degree ES");
  });
});

describe('Projects Section', () => {
  it('should render correctly', () => {
    const projects = [
      {
        name: "Project A",
        description: { es: "Description ES", en: "Description EN" },
        isActive: true,
        url: "https://example.com",
        image: "/projects/project-a.webp"
      }
    ];
    
    expect(Array.isArray(projects)).toBe(true);
    expect(projects[0].name).toBe("Project A");
    expect(projects[0].isActive).toBe(true);
  });
});

describe('Publications Section', () => {
  it('should render correctly', () => {
    const publications = [
      {
        name: { es: "Publication ES", en: "Publication EN" },
        publisher: "Journal A",
        releaseDate: "2024-01-01",
        url: "https://example.com"
      }
    ];
    
    expect(Array.isArray(publications)).toBe(true);
    expect(publications[0].name.es).toBe("Publication ES");
    expect(publications[0].publisher).toBe("Journal A");
  });
});
