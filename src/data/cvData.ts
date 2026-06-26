import type { Profile, SkillCategory, WorkExperience, Education, SoftSkill, Language, Certification, Service } from '../types/cvData.js';

// ── Category Colors (Tailwind classes per skill category) ──────────────
const categoryColors: Record<SkillCategory, string> = {
  'Programming Languages': 'bg-blue-100 text-blue-800 border-blue-200',
  'Frontend': 'bg-violet-100 text-violet-800 border-violet-200',
  'Backend': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Mobile': 'bg-orange-100 text-orange-800 border-orange-200',
  'Desktop': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Cloud & DevOps': 'bg-sky-100 text-sky-800 border-sky-200',
  'Testing & QA': 'bg-amber-100 text-amber-800 border-amber-200',
  'Security': 'bg-rose-100 text-rose-800 border-rose-200',
  'Databases': 'bg-teal-100 text-teal-800 border-teal-200',
  'UI/UX': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'Architecture': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Design & Graphics': 'bg-pink-100 text-pink-800 border-pink-200',
  'Office & Productivity': 'bg-slate-100 text-slate-800 border-slate-200',
};

// ── Profile Data ──────────────────────────────────────────────────────
const profileData: Profile[] = [
  {
    id: 'diego',
    role: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
    tagline: { es: 'Arquitecto de software con 10+ años de experiencia', en: 'Software architect with 10+ years of experience' },
    yearsOfExperience: 10,
    skills: [
      // Programming Languages
      { name: 'JavaScript', level: 'master', category: 'Programming Languages' },
      { name: 'TypeScript', level: 'advanced', category: 'Programming Languages' },
      { name: 'Python', level: 'advanced', category: 'Programming Languages' },
      { name: 'PHP', level: 'advanced', category: 'Programming Languages' },
      { name: 'Dart', level: 'advanced', category: 'Programming Languages' },
      { name: 'Java', level: 'intermediate', category: 'Programming Languages' },
      { name: 'C++', level: 'intermediate', category: 'Programming Languages' },
      { name: 'Bash', level: 'intermediate', category: 'Programming Languages' },
      { name: 'SQL', level: 'advanced', category: 'Programming Languages' },
      { name: 'C#', level: 'intermediate', category: 'Programming Languages' },
      // Frontend
      { name: 'React', level: 'master', category: 'Frontend' },
      { name: 'React Native', level: 'master', category: 'Frontend' },
      { name: 'Vue.js', level: 'advanced', category: 'Frontend' },
      { name: 'Angular', level: 'intermediate', category: 'Frontend' },
      { name: 'Next.js', level: 'advanced', category: 'Frontend' },
      { name: 'Node.js', level: 'master', category: 'Frontend' },
      { name: 'HTML5', level: 'master', category: 'Frontend' },
      { name: 'CSS3', level: 'master', category: 'Frontend' },
      { name: 'Sass', level: 'advanced', category: 'Frontend' },
      { name: 'Tailwind CSS', level: 'master', category: 'Frontend' },
      { name: 'Material UI', level: 'advanced', category: 'Frontend' },
      { name: 'Framer Motion', level: 'advanced', category: 'Frontend' },
      { name: 'Flutter', level: 'master', category: 'Frontend' },
      // Backend
      { name: 'Express.js', level: 'master', category: 'Backend' },
      { name: 'NestJS', level: 'advanced', category: 'Backend' },
      { name: 'FastAPI', level: 'advanced', category: 'Backend' },
      { name: 'Flask', level: 'advanced', category: 'Backend' },
      { name: 'Django', level: 'intermediate', category: 'Backend' },
      { name: 'Spring Boot', level: 'intermediate', category: 'Backend' },
      { name: 'Laravel', level: 'advanced', category: 'Backend' },
      { name: 'ASP.NET', level: 'intermediate', category: 'Backend' },
      { name: 'GraphQL', level: 'advanced', category: 'Backend' },
      { name: 'REST APIs', level: 'master', category: 'Backend' },
      // Mobile
      { name: 'React Native', level: 'master', category: 'Mobile' },
      { name: 'Flutter', level: 'master', category: 'Mobile' },
      { name: 'Expo', level: 'advanced', category: 'Mobile' },
      { name: 'iOS', level: 'intermediate', category: 'Mobile' },
      { name: 'Android', level: 'intermediate', category: 'Mobile' },
      // Cloud & DevOps
      { name: 'Docker', level: 'advanced', category: 'Cloud & DevOps' },
      { name: 'AWS', level: 'advanced', category: 'Cloud & DevOps' },
      { name: 'Firebase', level: 'advanced', category: 'Cloud & DevOps' },
      { name: 'CI/CD', level: 'advanced', category: 'Cloud & DevOps' },
      { name: 'Git', level: 'master', category: 'Cloud & DevOps' },
      { name: 'Nginx', level: 'advanced', category: 'Cloud & DevOps' },
      { name: 'Linux', level: 'advanced', category: 'Cloud & DevOps' },
      // Databases
      { name: 'PostgreSQL', level: 'advanced', category: 'Databases' },
      { name: 'MySQL', level: 'advanced', category: 'Databases' },
      { name: 'MongoDB', level: 'advanced', category: 'Databases' },
      { name: 'Redis', level: 'intermediate', category: 'Databases' },
      { name: 'Firebase Firestore', level: 'advanced', category: 'Databases' },
      // Testing & QA
      { name: 'Jest', level: 'advanced', category: 'Testing & QA' },
      { name: 'Vitest', level: 'advanced', category: 'Testing & QA' },
      { name: 'Cypress', level: 'intermediate', category: 'Testing & QA' },
      { name: 'Playwright', level: 'advanced', category: 'Testing & QA' },
      // Security
      { name: 'OWASP', level: 'advanced', category: 'Security' },
      { name: 'Penetration Testing', level: 'intermediate', category: 'Security' },
      { name: 'Security Auditing', level: 'advanced', category: 'Security' },
      // UI/UX
      { name: 'Figma', level: 'advanced', category: 'UI/UX' },
      { name: 'Responsive Design', level: 'master', category: 'UI/UX' },
      { name: 'Accessibility (WCAG)', level: 'advanced', category: 'UI/UX' },
      // Architecture
      { name: 'Clean Architecture', level: 'advanced', category: 'Architecture' },
      { name: 'Microservices', level: 'advanced', category: 'Architecture' },
      { name: 'Design Patterns', level: 'master', category: 'Architecture' },
      { name: 'DDD', level: 'intermediate', category: 'Architecture' },
      // Office & Productivity
      { name: 'Notion', level: 'advanced', category: 'Office & Productivity' },
      { name: 'Jira', level: 'advanced', category: 'Office & Productivity' },
      { name: 'Slack', level: 'advanced', category: 'Office & Productivity' },
    ],
    certifications: [
      { name: 'Scrum Master Certified', issuer: 'Scrum Alliance', date: '2019', url: 'https://www.scrumalliance.org/' },
      { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2020', url: 'https://aws.amazon.com/certification/' },
      { name: 'Google IT Support', issuer: 'Google', date: '2018', url: 'https://www.coursera.org/professional-certificates/google-it-support' },
      { name: 'Ethical Hacking', issuer: 'Udemy', date: '2021', url: 'https://www.udemy.com/' },
      { name: 'Python for Data Science', issuer: 'Coursera', date: '2020', url: 'https://www.coursera.org/' },
      { name: 'Flutter Development', issuer: 'Udemy', date: '2022', url: 'https://www.udemy.com/' },
    ],
  },
  {
    id: 'diego-researcher',
    role: { es: 'Investigador en Ciberseguridad', en: 'Cybersecurity Researcher' },
    tagline: { es: 'Investigador especializado en análisis de malware y pentesting', en: 'Researcher specializing in malware analysis and pentesting' },
    yearsOfExperience: 10,
    skills: [
      { name: 'Malware Analysis', level: 'advanced', category: 'Security' },
      { name: 'Reverse Engineering', level: 'advanced', category: 'Security' },
      { name: 'Penetration Testing', level: 'advanced', category: 'Security' },
      { name: 'Vulnerability Assessment', level: 'advanced', category: 'Security' },
      { name: 'Network Security', level: 'advanced', category: 'Security' },
      { name: 'Incident Response', level: 'intermediate', category: 'Security' },
      { name: 'Digital Forensics', level: 'intermediate', category: 'Security' },
      { name: 'Python', level: 'advanced', category: 'Programming Languages' },
      { name: 'Bash', level: 'advanced', category: 'Programming Languages' },
      { name: 'Wireshark', level: 'advanced', category: 'Security' },
      { name: 'Metasploit', level: 'advanced', category: 'Security' },
      { name: 'Burp Suite', level: 'advanced', category: 'Security' },
      { name: 'Nmap', level: 'advanced', category: 'Security' },
      { name: 'Ghidra', level: 'intermediate', category: 'Security' },
      { name: 'IDA Pro', level: 'intermediate', category: 'Security' },
      { name: 'Kali Linux', level: 'advanced', category: 'Security' },
    ],
    certifications: [
      { name: 'CompTIA Security+', issuer: 'CompTIA', date: '2019', url: 'https://www.comptia.org/' },
      { name: 'CEH (Certified Ethical Hacker)', issuer: 'EC-Council', date: '2020', url: 'https://www.eccouncil.org/' },
      { name: 'OSCP (Offensive Security Certified Professional)', issuer: 'Offensive Security', date: '2021', url: 'https://www.offensive-security.com/' },
    ],
  },
  {
    id: 'diego-creator',
    role: { es: 'Creador de Contenido', en: 'Content Creator' },
    tagline: { es: 'Creador de contenido educativo sobre tecnología', en: 'Educational content creator about technology' },
    yearsOfExperience: 10,
    skills: [
      { name: 'Video Editing', level: 'advanced', category: 'Design & Graphics' },
      { name: 'YouTube Content', level: 'advanced', category: 'Design & Graphics' },
      { name: 'Technical Writing', level: 'advanced', category: 'Design & Graphics' },
      { name: 'Public Speaking', level: 'advanced', category: 'Design & Graphics' },
      { name: 'Course Creation', level: 'advanced', category: 'Design & Graphics' },
      { name: 'Social Media', level: 'advanced', category: 'Design & Graphics' },
      { name: 'Podcast', level: 'intermediate', category: 'Design & Graphics' },
      { name: 'Thumbnails', level: 'intermediate', category: 'Design & Graphics' },
    ],
    certifications: [],
  },
  {
    id: 'diego-docente',
    role: { es: 'Docente Universitario', en: 'University Professor' },
    tagline: { es: 'Docente de redes, ciberseguridad e informática', en: 'Professor of networks, cybersecurity, and computing' },
    yearsOfExperience: 10,
    skills: [
      { name: 'Networking', level: 'advanced', category: 'Architecture' },
      { name: 'Cybersecurity', level: 'advanced', category: 'Security' },
      { name: 'Linux', level: 'advanced', category: 'Cloud & DevOps' },
      { name: 'Programming', level: 'advanced', category: 'Programming Languages' },
      { name: 'Didactics', level: 'advanced', category: 'Office & Productivity' },
      { name: 'Curriculum Design', level: 'advanced', category: 'Office & Productivity' },
      { name: 'Student Mentoring', level: 'advanced', category: 'Office & Productivity' },
      { name: 'LMS (Moodle)', level: 'advanced', category: 'Office & Productivity' },
    ],
    certifications: [
      { name: 'CCNA (Cisco Certified Network Associate)', issuer: 'Cisco', date: '2018', url: 'https://www.cisco.com/' },
      { name: 'LPIC-1 (Linux Professional Institute)', issuer: 'LPI', date: '2019', url: 'https://www.lpi.org/' },
      { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2020', url: 'https://aws.amazon.com/certification/' },
    ],
  },
];

// ── Work Experience ───────────────────────────────────────────────────
const workExperience: WorkExperience[] = [
  {
    name: 'Freelance Developer',
    position: 'Full Stack Developer',
    url: 'https://statick88.github.io/',
    startDate: '2015',
    endDate: 'Present',
    summary: {
      es: 'Desarrollo full stack para clientes internacionales, especializado en React, Node.js y soluciones cloud.',
      en: 'Full stack development for international clients, specializing in React, Node.js and cloud solutions.',
    },
    highlights: [],
  },
];

// ── Education ─────────────────────────────────────────────────────────
const education: Education[] = [
  {
    institution: 'Universidad Técnica Particular de Loja',
    area: 'Computer Science',
    url: 'https://www.utpl.edu.ec/',
    startDate: '2012',
    endDate: '2017',
    studyType: 'Ingeniero en Tecnologías de la Información',
    score: '8.5/10',
  },
  {
    institution: 'Universidad Central del Ecuador',
    area: 'Cybersecurity',
    url: 'https://www.uce.edu.ec/',
    startDate: '2023',
    endDate: '2025',
    studyType: 'Maestría en Ciberseguridad',
    score: '9.2/10',
  },
];

// ── Soft Skills ───────────────────────────────────────────────────────
const softSkills: SoftSkill[] = [
  { name: { es: 'Liderazgo Técnico', en: 'Technical Leadership' } },
  { name: { es: 'Comunicación Efectiva', en: 'Effective Communication' } },
  { name: { es: 'Resolución de Problemas', en: 'Problem Solving' } },
  { name: { es: 'Trabajo en Equipo', en: 'Teamwork' } },
  { name: { es: 'Adaptabilidad', en: 'Adaptability' } },
  { name: { es: 'Pensamiento Crítico', en: 'Critical Thinking' } },
  { name: { es: 'Gestión del Tiempo', en: 'Time Management' } },
  { name: { es: 'Mentoría', en: 'Mentoring' } },
];

// ── Languages ─────────────────────────────────────────────────────────
const languages: Language[] = [
  { name: 'Spanish', level: 'Native', code: 'es' },
  { name: 'English', level: 'B2 (Upper Intermediate)', code: 'en' },
  { name: 'Portuguese', level: 'A2 (Elementary)', code: 'pt' },
];

// ── Certifications ────────────────────────────────────────────────────
const certifications: Certification[] = [
  { name: 'Scrum Master Certified', issuer: 'Scrum Alliance', date: '2019', url: 'https://www.scrumalliance.org/' },
  { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2020', url: 'https://aws.amazon.com/certification/' },
  { name: 'Google IT Support', issuer: 'Google', date: '2018', url: 'https://www.coursera.org/professional-certificates/google-it-support' },
  { name: 'Ethical Hacking', issuer: 'Udemy', date: '2021', url: 'https://www.udemy.com/' },
  { name: 'Python for Data Science', issuer: 'Coursera', date: '2020', url: 'https://www.coursera.org/' },
  { name: 'Flutter Development', issuer: 'Udemy', date: '2022', url: 'https://www.udemy.com/' },
  { name: 'CompTIA Security+', issuer: 'CompTIA', date: '2019', url: 'https://www.comptia.org/' },
  { name: 'CEH (Certified Ethical Hacker)', issuer: 'EC-Council', date: '2020', url: 'https://www.eccouncil.org/' },
  { name: 'OSCP (Offensive Security Certified Professional)', issuer: 'Offensive Security', date: '2021', url: 'https://www.offensive-security.com/' },
  { name: 'CCNA (Cisco Certified Network Associate)', issuer: 'Cisco', date: '2018', url: 'https://www.cisco.com/' },
  { name: 'LPIC-1 (Linux Professional Institute)', issuer: 'LPI', date: '2019', url: 'https://www.lpi.org/' },
];

// ── Contact ───────────────────────────────────────────────────────────
const contact = {
  email: 'diego.saavedra@example.com',
  phone: '+593-99-123-4567',
  whatsapp: '+593-99-123-4567',
  linkedin: 'https://www.linkedin.com/in/diego-saavedra/',
  github: 'https://github.com/statick88',
  website: 'https://statick88.github.io/',
  calendar: 'https://calendly.com/diego-saavedra',
  cta: { es: 'Contáctame', en: 'Contact me' },
  tagline: { es: '¿Tienes un proyecto? Hablemos.', en: 'Have a project? Let\'s talk.' },
};

// ── Hero Section ──────────────────────────────────────────────────────
const hero = {
  name: 'Diego Saavedra',
  role: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
  tagline: { es: 'Arquitecto de software con 10+ años de experiencia', en: 'Software architect with 10+ years of experience' },
  cta: { es: 'Ver Proyectos', en: 'View Projects' },
};

// ── About Section ─────────────────────────────────────────────────────
const about = {
  title: { es: 'Sobre Mí', en: 'About Me' },
  description: {
    es: 'Desarrollador Full Stack con más de 10 años de experiencia creando soluciones web y móviles innovadoras. Especializado en React, Node.js y arquitecturas modernas. Apasionado por la tecnología, la educación y la ciberseguridad.',
    en: 'Full Stack Developer with over 10 years of experience creating innovative web and mobile solutions. Specialized in React, Node.js, and modern architectures. Passionate about technology, education, and cybersecurity.',
  },
};

// ── Education Details ─────────────────────────────────────────────────
const educationDetails = {
  title: { es: 'Educación', en: 'Education' },
  items: education,
};

// ── Services ──────────────────────────────────────────────────────────
const services: Service[] = [
  {
    id: 'web-dev',
    title: { es: 'Desarrollo Web', en: 'Web Development' },
    description: {
      es: 'Aplicaciones web modernas con React, Next.js, Node.js y las últimas tecnologías.',
      en: 'Modern web applications with React, Next.js, Node.js, and the latest technologies.',
    },
    icon: 'Globe',
    features: [
      { es: 'SPA y SSR con React/Next.js', en: 'SPA and SSR with React/Next.js' },
      { es: 'APIs RESTful y GraphQL', en: 'RESTful and GraphQL APIs' },
      { es: 'Responsive Design', en: 'Responsive Design' },
    ],
    formats: {
      es: ['Aplicación web completa', 'Landing page', 'E-commerce'],
      en: ['Full web application', 'Landing page', 'E-commerce'],
    },
  },
  {
    id: 'mobile-dev',
    title: { es: 'Desarrollo Móvil', en: 'Mobile Development' },
    description: {
      es: 'Apps nativas y multiplataforma con React Native y Flutter.',
      en: 'Native and cross-platform apps with React Native and Flutter.',
    },
    icon: 'Smartphone',
    features: [
      { es: 'iOS y Android con React Native', en: 'iOS and Android with React Native' },
      { es: 'Flutter para UI nativa', en: 'Flutter for native UI' },
      { es: 'Publicación en App Store/Play Store', en: 'App Store/Play Store publishing' },
    ],
    formats: {
      es: ['App nativa', 'App multiplataforma', 'PWA'],
      en: ['Native app', 'Cross-platform app', 'PWA'],
    },
  },
  {
    id: 'security-audit',
    title: { es: 'Auditoría de Seguridad', en: 'Security Audit' },
    description: {
      es: 'Análisis de vulnerabilidades, penetration testing y hardening de sistemas.',
      en: 'Vulnerability analysis, penetration testing, and system hardening.',
    },
    icon: 'Shield',
    features: [
      { es: 'Penetration Testing', en: 'Penetration Testing' },
      { es: 'Análisis de vulnerabilidades', en: 'Vulnerability analysis' },
      { es: 'Hardening de sistemas', en: 'System hardening' },
    ],
    formats: {
      es: ['Auditoría completa', 'Pentest específico', 'Consultoría de seguridad'],
      en: ['Full audit', 'Specific pentest', 'Security consulting'],
    },
  },
  {
    id: 'consulting',
    title: { es: 'Consultoría Técnica', en: 'Technical Consulting' },
    description: {
      es: 'Asesoría en arquitectura de software, DevOps y mejores prácticas.',
      en: 'Advisory on software architecture, DevOps, and best practices.',
    },
    icon: 'Lightbulb',
    features: [
      { es: 'Arquitectura de software', en: 'Software architecture' },
      { es: 'DevOps y CI/CD', en: 'DevOps and CI/CD' },
      { es: 'Code Review y mentoring', en: 'Code Review and mentoring' },
    ],
    formats: {
      es: ['Consultoría por hora', 'Proyecto fijo', 'Mentoría continua'],
      en: ['Hourly consulting', 'Fixed project', 'Ongoing mentorship'],
    },
  },
];

// ── Export all ────────────────────────────────────────────────────────
export {
  categoryColors,
  profileData,
  workExperience,
  education,
  softSkills,
  languages,
  certifications,
  contact,
  hero,
  about,
  educationDetails,
  services,
};
