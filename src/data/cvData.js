// Perfiles con habilidades, descripciones y proyectos específicos
export const profileData = {
  developer: {
    label: {
      es: "Desarrollador Full Stack | Full Stack Engineer",
      en: "Full Stack Developer | Full Stack Engineer"
    },
    skills: [
      { name: "HTML", level: "master", category: "frontend-fundamentals" },
      { name: "CSS", level: "master", category: "frontend-fundamentals" },
      { name: "JavaScript", level: "master", category: "frontend-fundamentals" },
      { name: "TypeScript", level: "advanced", category: "frontend-frameworks" },
      { name: "React", level: "advanced", category: "frontend-frameworks" },
      { name: "Next.js", level: "advanced", category: "frontend-frameworks" },
      { name: "Node.js", level: "advanced", category: "backend" },
      { name: "Python", level: "advanced", category: "backend" },
      { name: "Django", level: "advanced", category: "backend" },
      { name: "FastAPI", level: "advanced", category: "backend" },
      { name: "NestJS", level: "advanced", category: "backend" },
      { name: "Flutter", level: "advanced", category: "mobile" },
      { name: "React Native", level: "advanced", category: "mobile" },
      { name: "Expo SDK 53+", level: "advanced", category: "mobile" },
      { name: "Swift (iOS)", level: "intermediate", category: "mobile-native" },
      { name: "Kotlin (Android)", level: "intermediate", category: "mobile-native" },
      { name: "Docker", level: "advanced", category: "devops" },
      { name: "Kubernetes", level: "intermediate", category: "devops" },
      { name: "MySQL", level: "advanced", category: "databases" },
      { name: "MongoDB", level: "advanced", category: "databases" },
      { name: "PostgreSQL", level: "advanced", category: "databases" },
      { name: "AWS", level: "intermediate", category: "devops" },
      { name: "Azure", level: "intermediate", category: "devops" },
      { name: "Vue", level: "intermediate", category: "frontend-frameworks" },
      { name: "Svelte", level: "intermediate", category: "frontend-frameworks" },
      { name: "Angular", level: "intermediate", category: "frontend-frameworks" },
      { name: "Clean Architecture", level: "advanced", category: "architecture" },
      { name: "SOLID", level: "advanced", category: "architecture" },
      { name: "TDD", level: "advanced", category: "architecture" }
    ],
    certifications: [
      { name: "AWS Solutions Architect", issuer: "Amazon", status: "active" },
      { name: "Azure Fundamentals", issuer: "Microsoft", status: "active" },
      { name: "Docker Certified Associate", issuer: "Docker", status: "active" }
    ],
    summary: {
      es: "Desarrollador Full Stack con más de 10 años de experiencia en la construcción de aplicaciones empresariales, móviles e inteligentes. Dominio de múltiples stacks tecnológicos (React, Next.js, Python/Django, Node.js, Flutter). Experiencia en arquitecturas modernas (Clean Architecture, SOLID, TDD) y despliegue en cloud (AWS, Azure, Vercel).",
      en: "Full Stack Developer with 10+ years building enterprise, mobile, and intelligent applications. Mastery of multiple tech stacks (React, Next.js, Python/Django, Node.js, Flutter). Experience in modern architectures (Clean Architecture, SOLID, TDD) and cloud deployment (AWS, Azure, Vercel)."
    },
    pdf: "cv-developer.pdf"
  },
  hacker: {
    label: {
      es: "Ethical Hacker | Pentester & Security Researcher",
      en: "Ethical Hacker | Pentester & Security Researcher"
    },
    skills: [
      { name: "Ethical Hacking", level: "master", category: "security" },
      { name: "Penetration Testing", level: "master", category: "security" },
      { name: "OWASP Top 10", level: "master", category: "security" },
      { name: "Nmap", level: "advanced", category: "security" },
      { name: "Burp Suite", level: "advanced", category: "security" },
      { name: "Metasploit", level: "advanced", category: "security" },
      { name: "Wireshark", level: "advanced", category: "security" },
      { name: "SQL Injection", level: "advanced", category: "security" },
      { name: "XSS/CSRF", level: "advanced", category: "security" },
      { name: "Python", level: "advanced", category: "backend" },
      { name: "Bash Scripting", level: "advanced", category: "security" },
      { name: "Linux", level: "master", category: "security" },
      { name: "Docker", level: "advanced", category: "security" },
      { name: "CTF", level: "advanced", category: "security" },
      { name: "Reverse Engineering", level: "intermediate", category: "security" },
      { name: "Malware Analysis", level: "intermediate", category: "security" },
      { name: "Network Security", level: "advanced", category: "security" },
      { name: "Web Security", level: "advanced", category: "security" },
      { name: "Cloud Security", level: "intermediate", category: "security" },
      { name: "Kali Linux", level: "advanced", category: "security" },
      { name: "Reverse Engineering", level: "advanced", category: "security" },
      { name: "Malware Analysis", level: "advanced", category: "security" },
      { name: "Exploit Development", level: "intermediate", category: "security" },
      { name: "Git", level: "advanced", category: "tools" },
      { name: "GitHub Actions", level: "intermediate", category: "devops" }
    ],
    certifications: [
      { name: "Certified Ethical Hacker (CEH)", issuer: "EC-Council", status: "active" },
      { name: "Security+", issuer: "CompTIA", status: "active" },
      { name: "Network+", issuer: "CompTIA", status: "active" },
      { name: "Linux+", issuer: "CompTIA", status: "active" },
      { name: "OSCP", issuer: "Offensive Security", status: "in-progress" }
    ],
    summary: {
      es: "Ethical Hacker y Security Researcher con experiencia en penetration testing, análisis de vulnerabilidades y seguridad web. Dominio de herramientas profesionales (Burp Suite, Nmap, Metasploit, Wireshark). Experiencia en CTF y labs de ciberseguridad. Comprometido con la seguridad defensiva y ofensiva.",
      en: "Ethical Hacker and Security Researcher with experience in penetration testing, vulnerability analysis, and web security. Mastery of professional tools (Burp Suite, Nmap, Metasploit, Wireshark). Experience in CTF and cybersecurity labs. Committed to defensive and offensive security."
    },
    pdf: "cv-cybersecurity.pdf"
  },
  research: {
    label: {
      es: "Investigador | Research",
      en: "Researcher | Academic"
    },
    skills: [
      { name: "Python", level: "master", category: "backend" },
      { name: "Machine Learning", level: "advanced", category: "ai" },
      { name: "Data Analysis", level: "advanced", category: "ai" },
      { name: "Statistical Analysis", level: "advanced", category: "ai" },
      { name: "LaTeX", level: "master", category: "tools" },
      { name: "Quarto", level: "advanced", category: "tools" },
      { name: "Jupyter", level: "master", category: "tools" },
      { name: "Research Methodology", level: "master", category: "research" },
      { name: "Scientific Writing", level: "master", category: "research" },
      { name: "Academic Publishing", level: "advanced", category: "research" },
      { name: "Ethical Hacking", level: "advanced", category: "security" },
      { name: "Penetration Testing", level: "intermediate", category: "security" },
      { name: "Network Security", level: "advanced", category: "security" },
      { name: "Docker", level: "intermediate", category: "devops" },
      { name: "Git", level: "advanced", category: "tools" },
      { name: "Cybersecurity", level: "advanced", category: "security" },
      { name: "Threat Modeling", level: "advanced", category: "security" },
      { name: "Vulnerability Assessment", level: "advanced", category: "security" },
      { name: "R Language", level: "intermediate", category: "ai" },
      { name: "TensorFlow", level: "intermediate", category: "ai" },
      { name: "Kali Linux", level: "advanced", category: "security" }
    ],
    certifications: [
      { name: "Security+", issuer: "CompTIA", status: "active" },
      { name: "Network+", issuer: "CompTIA", status: "active" }
    ],
    summary: {
      es: "Investigador en ciberseguridad con experiencia en análisis de amenazas, modelado de riesgos y publicación académica. Actualmente cursando MSc en Ciberseguridad en la Universidad Complutense de Madrid. Experiencia en写作 científica, análisis estadístico y herramientas de investigación. Participación en conferencias y publicaciones en revistas Q1/Q2.",
      en: "Cybersecurity researcher with experience in threat analysis, risk modeling, and academic publishing. Currently pursuing MSc in Cybersecurity at Universidad Complutense de Madrid. Experience in scientific writing, statistical analysis, and research tools. Participation in conferences and publications in Q1/Q2 journals."
    },
    pdf: "cv-researcher.pdf"
  }
}

// Category colors para habilidades
export const categoryColors = {
  "frontend-fundamentals": { bg: "bg-blue-500/20", border: "border-blue-500/50", text: "text-blue-400" },
  "frontend-frameworks": { bg: "bg-purple-500/20", border: "border-purple-500/50", text: "text-purple-400" },
  "backend": { bg: "bg-orange-500/20", border: "border-orange-500/50", text: "text-orange-400" },
  "mobile": { bg: "bg-red-500/20", border: "border-red-500/50", text: "text-red-400" },
  "mobile-native": { bg: "bg-rose-500/20", border: "border-rose-500/50", text: "text-rose-400" },
  "devops": { bg: "bg-yellow-500/20", border: "border-yellow-500/50", text: "text-yellow-400" },
  "databases": { bg: "bg-green-500/20", border: "border-green-500/50", text: "text-green-400" },
  "security": { bg: "bg-cyan-500/20", border: "border-cyan-500/50", text: "text-cyan-400" },
  "architecture": { bg: "bg-pink-500/20", border: "border-pink-500/50", text: "text-pink-400" },
  "teaching": { bg: "bg-emerald-500/20", border: "border-emerald-500/50", text: "text-emerald-400" },
  "tools": { bg: "bg-slate-500/20", border: "border-slate-500/50", text: "text-slate-400" },
  "ai": { bg: "bg-indigo-500/20", border: "border-indigo-500/50", text: "text-indigo-400" },
  "research": { bg: "bg-amber-500/20", border: "border-amber-500/50", text: "text-amber-400" }
}

export const cvData = {
  basics: {
    name: "Diego Medardo Saavedra García",
    label: {
      es: "Desarrollador Full Stack con más de 10 años de experiencia. Facilitador de bootcamps y cursos en Desarrollo Web, Data Science y Desarrollo Móvil.",
      en: "Full Stack Developer with 10+ years of experience. Bootcamp and course facilitator in Web Development, Data Science, and Mobile Development."
    },
    image: "/me.webp",
    email: "dsaavedra88@gmail.com",
    phone: "+593 980192790",
    location: {
      city: "Loja",
      region: "Loja",
      countryCode: "ECU"
    },
    profiles: [
      { network: "LinkedIn", url: "https://www.linkedin.com/in/diego-saavedra-developer/" },
      { network: "GitHub", url: "https://github.com/statick88" },
      { network: "X", url: "https://x.com/statick_ds" }
    ]
  },
  work: [
    {
      name: "Abacom",
      position: { es: "Facilitador", en: "Facilitator" },
      url: "https://abacom.edu.ec/",
      startDate: "2022-10-31",
      summary: { es: "Facilitador de cursos de Desarrollo Web Full Stack.", en: "Facilitator of Full-stack Web Development courses." }
    },
    {
      name: "Codings Academy",
      position: { es: "Facilitador de Bootcamps", en: "Bootcamp Facilitator" },
      url: "http://codingsacademy.com",
      startDate: "2024-09-01",
      endDate: "2024-12-31",
      summary: { es: "Facilitador de Bootcamps de Desarrollo Web Full Stack, Data Science y Móvil.", en: "Facilitator of Full-stack Web Development, Data Science, and Mobile Bootcamps." }
    },
    {
      name: "Universidad de Zulia",
      position: { es: "Profesor - Diplomado en IA", en: "Professor - AI Diploma" },
      url: "https://www.luz.edu.ve/",
      startDate: "2024-10-19",
      endDate: "2024-12-15",
      summary: { es: "Diplomado en Inteligencia Artificial aplicada a la Educación.", en: "Diploma in Artificial Intelligence applied to Education." }
    },
    {
      name: "Universidad ESPE",
      position: { es: "Docente Ocasional Tiempo Completo", en: "Full-time Professor" },
      url: "https://www.espe.edu.ec",
      startDate: "2023-04-26",
      endDate: "2024-10-31",
      summary: { es: "Docente del Departamento de Ciencias de la Computación.", en: "Professor in the Computer Science Department." }
    },
    {
      name: "Universidad UIDEM",
      position: { es: "Docente Ocasional Tiempo Completo", en: "Full-time Professor" },
      url: "https://www.uide.edu.ec/",
      startDate: "2022-10-31",
      endDate: "2022-12-31",
      summary: { es: "Docente de la carrera de Tecnologías de la Información.", en: "Professor of Information Technology career." }
    },
    {
      name: "Instituto Juan Montalvo",
      position: { es: "Docente Ocasional Tiempo Completo", en: "Full-time Professor" },
      url: "https://istjm.edu.ec/",
      startDate: "2019-10-31",
      endDate: "2022-10-31",
      summary: { es: "Docente de Tecnología en Mantenimiento de Computadoras.", en: "Professor of Computer Maintenance Technology." }
    }
  ],
  education: [
    {
      institution: "Universidad Complutense de Madrid",
      area: { es: "Máster en Ciberseguridad Defensiva y Ofensiva", en: "Master's in Cybersecurity" },
      startDate: "2026-02-01",
      endDate: "2027-12-31",
      studyType: "Master"
    },
    {
      institution: "Universidad Técnica Particular de Loja",
      area: { es: "Maestría en Ciencias y Tecnologías de la Computación", en: "Master's in Computer Science" },
      startDate: "2018-09-01",
      endDate: "2021-02-28",
      studyType: "Master",
      score: "4.0"
    },
    {
      institution: "Universidad Nacional de Loja",
      area: { es: "Licenciatura en Informática Educativa", en: "Bachelor's in Educational Computing" },
      startDate: "2007-09-01",
      endDate: "2011-02-28",
      studyType: "Bachelor",
      score: "4.0"
    }
  ],
  skills: [
    { name: "HTML", level: "master" },
    { name: "CSS", level: "master" },
    { name: "JavaScript", level: "master" },
    { name: "TypeScript", level: "advanced" },
    { name: "React", level: "advanced" },
    { name: "Next.js", level: "advanced" },
    { name: "Node.js", level: "advanced" },
    { name: "Python", level: "advanced" },
    { name: "Django", level: "advanced" },
    { name: "FastAPI", level: "advanced" },
    { name: "Flutter", level: "advanced" },
    { name: "Angular", level: "advanced" },
    { name: "Docker", level: "advanced" },
    { name: "Kubernetes", level: "advanced" },
    { name: "MySQL", level: "advanced" },
    { name: "MongoDB", level: "advanced" },
    { name: "NestJS", level: "advanced" },
    { name: "Vue", level: "intermediate" },
    { name: "Svelte", level: "intermediate" },
    { name: "AWS", level: "intermediate" },
    { name: "Azure", level: "intermediate" },
    { name: "PostgreSQL", level: "intermediate" }
  ],
  softSkills: [
    { es: "Resolución de Problemas", en: "Problem Solving" },
    { es: "Trabajo en Equipo", en: "Teamwork" },
    { es: "Comunicación", en: "Communication" },
    { es: "Adaptabilidad", en: "Adaptability" },
    { es: "Gestión del Tiempo", en: "Time Management" },
    { es: "Liderazgo", en: "Leadership" }
  ],
  languages: [
    { language: "Español", fluency: { es: "Nativo", en: "Native" } },
    { language: "Inglés", fluency: { es: "Avanzado", en: "Advanced" } },
    { language: "Italiano", fluency: { es: "Básico", en: "Basic" } },
    { language: "Portugués", fluency: { es: "Básico", en: "Basic" } }
  ],
  projects: [
    {
      name: "Saavedra Construction",
      description: {
        es: "Sitio web empresarial para empresa de construcción.",
        en: "Business website for construction company."
      },
      highlights: {
        es: ["Clean Architecture", "Next.js 15", "React 19", "Tailwind CSS 4"],
        en: ["Clean Architecture", "Next.js 15", "React 19", "Tailwind CSS 4"]
      },
      url: "https://saavedra-construction.com",
      github: "https://github.com/statick88/saavedra-construction"
    },
    {
      name: "Sistema de Predicción de Precios Inmobiliarios",
      description: {
        es: "ML para predicción de precios inmobiliarios.",
        en: "ML for real estate price prediction."
      },
      highlights: {
        es: ["Python", "Scikit-learn", "FastAPI", "92% accuracy"],
        en: ["Python", "Scikit-learn", "FastAPI", "92% accuracy"]
      },
      github: "https://github.com/statick88/real-estate-prediction"
    },
    {
      name: "App de Gestión Financiera",
      description: {
        es: "App móvil híbrida para finanzas personales.",
        en: "Hybrid mobile app for personal finance."
      },
      highlights: {
        es: ["Flutter", "Firebase", "10,000+ downloads"],
        en: ["Flutter", "Firebase", "10,000+ downloads"]
      },
      github: "https://github.com/statick88/finance-app-flutter"
    },
    {
      name: "E-Commerce Marketplace",
      description: {
        es: "Plataforma multi-vendedor con Django y React.",
        en: "Multi-vendor e-commerce platform."
      },
      highlights: {
        es: ["Django", "React", "Stripe", "PostgreSQL"],
        en: ["Django", "React", "Stripe", "PostgreSQL"]
      },
      github: "https://github.com/statick88/marketplace-django"
    },
    {
      name: "Scanner de Vulnerabilidades Web",
      description: {
        es: "Herramienta de ciberseguridad para OWASP Top 10.",
        en: "Cybersecurity tool for OWASP Top 10."
      },
      highlights: {
        es: ["Python", "OWASP", "CI/CD", "PDF Reports"],
        en: ["Python", "OWASP", "CI/CD", "PDF Reports"]
      },
      github: "https://github.com/statick88/vulnerability-scanner"
    },
    {
      name: "Sistema de Gestión Académica",
      description: {
        es: "Sistema web para gestión universitaria.",
        en: "University management web system."
      },
      highlights: {
        es: ["Angular", "NestJS", "MySQL", "5,000+ students"],
        en: ["Angular", "NestJS", "MySQL", "5,000+ students"]
      },
      github: "https://github.com/statick88/academic-management"
    }
  ],
  certifications: [
    { name: "Certified Ethical Hacker", issuer: "EC-Council", status: "active" },
    { name: "Security+", issuer: "CompTIA", status: "active" },
    { name: "Network+", issuer: "CompTIA", status: "active" },
    { name: "Linux+", issuer: "CompTIA", status: "active" },
    { name: "Azure Fundamentals", issuer: "Microsoft", status: "active" },
    { name: "OSCP", issuer: "Offensive Security", status: "in-progress" }
  ]
}