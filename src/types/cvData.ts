// Types for cvData.ts - CV portfolio data structures
// Updated to match actual data in src/data/cvData.ts

// Bilingual text support
export type BilingualText = {
  es: string;
  en: string;
};

// Skill levels - matches actual data values
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'master';

// Skill categories - matches actual data values
export type SkillCategory =
  | 'Programming Languages'
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'Desktop'
  | 'Cloud & DevOps'
  | 'Testing & QA'
  | 'Security'
  | 'Databases'
  | 'UI/UX'
  | 'Architecture'
  | 'Design & Graphics'
  | 'Office & Productivity';

// Skill with metadata
export type Skill = {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
};

// Profile - matches actual data structure
export type Profile = {
  id: string;
  role: BilingualText;
  tagline: BilingualText;
  yearsOfExperience: number;
  skills: Skill[];
  certifications: Certification[];
};

// Work experience - matches actual data structure
export type WorkExperience = {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: BilingualText;
  highlights: string[];
};

// Education - matches actual data structure
export type Education = {
  institution: string;
  area: string;
  url: string;
  startDate: string;
  endDate: string;
  studyType: string;
  score: string;
};

// Soft skills - matches actual data structure
export type SoftSkill = {
  name: BilingualText;
};

// Languages - matches actual data structure
export type Language = {
  name: string;
  level: string;
  code: string;
};

// Certifications - matches actual data structure
export type Certification = {
  name: string;
  issuer: string;
  date: string;
  url: string;
};

// Services - matches actual data structure
export type Service = {
  id: string;
  title: BilingualText;
  description: BilingualText;
  icon: string;
  features: { es: string; en: string }[];
  formats: { es: string[]; en: string[] };
  priceRange?: string;
  color?: string;
};

// Contact - matches actual data structure
export type Contact = {
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  website: string;
  calendar: string;
  cta: BilingualText;
  tagline: BilingualText;
};

// Hero section
export type Hero = {
  name: string;
  role: BilingualText;
  tagline: BilingualText;
  cta: BilingualText;
};

// About section
export type About = {
  title: BilingualText;
  description: BilingualText;
};

// Education details
export type EducationDetails = {
  title: BilingualText;
  items: Education[];
};

// CV Data structure - matches actual exports from cvData.ts
export type CVData = {
  categoryColors: Record<SkillCategory, string>;
  profileData: Profile[];
  workExperience: WorkExperience[];
  education: Education[];
  softSkills: SoftSkill[];
  languages: Language[];
  certifications: Certification[];
  contact: Contact;
  hero: Hero;
  about: About;
  educationDetails: EducationDetails;
  services: Service[];
};

// Type alias for bilingual strings
export type BilingualString = BilingualText;

export {};

// Ensure this is treated as a module
export type { CVData as default };