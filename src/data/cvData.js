// cvData.js — Diego Medardo Saavedra García
// Source of truth: ~/Documents/job_applications/core/cv-consolidado.md
// Last verified: 2026-06-01 (130+ PDF audit, NLM, GitHub, 3 directory audits)

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
      { name: "SRI / XAdES", level: "advanced", category: "backend" },
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
      { name: "Magíster en Cs. y Tec. de la Computación", issuer: "UTPL", status: "active" },
      { name: "Python for Data Science", issuer: "ABACOM", status: "active" },
      { name: "Flutter Mobile Development", issuer: "ABACOM", status: "active" },
      { name: "Linux Server Administration", issuer: "ABACOM", status: "active" }
    ],
    summary: {
      es: "Desarrollador Full Stack con 10+ años de experiencia en aplicaciones web, móviles y APIs. Dominio de React, Next.js, Python/Django, Node.js, Flutter. más de 400 repos públicos en GitHub, código en producción. Apasionado por Clean Architecture, SOLID y TDD.",
      en: "Full Stack Developer with 10+ years building web, mobile, and API applications. Mastery of React, Next.js, Python/Django, Node.js, Flutter. more than 400 public repos on GitHub, production-grade code. Passionate about Clean Architecture, SOLID, and TDD."
    },
    pdf: "cv-developer.pdf"
  },

  hacker: {
    label: {
      es: "Hacker Ético | Pentester & Security Researcher",
      en: "Ethical Hacker | Pentester & Security Researcher"
    },
    skills: [
      { name: "Ethical Hacking", level: "advanced", category: "security" },
      { name: "Penetration Testing", level: "advanced", category: "security" },
      { name: "OWASP Top 10", level: "advanced", category: "security" },
      { name: "Auditoría de Pentesting", level: "advanced", category: "security" },
      { name: "Ingeniería Inversa y Explotación", level: "advanced", category: "security" },
      { name: "Hardware Hacking (OpenWrt)", level: "advanced", category: "security" },
      { name: "Nmap", level: "advanced", category: "security" },
      { name: "Metasploit", level: "intermediate", category: "security" },
      { name: "Burp Suite", level: "intermediate", category: "security" },
      { name: "Wireshark", level: "intermediate", category: "security" },
      { name: "SQL Injection", level: "advanced", category: "security" },
      { name: "XSS/CSRF", level: "advanced", category: "security" },
      { name: "Bash Scripting", level: "advanced", category: "security" },
      { name: "Linux", level: "master", category: "security" },
      { name: "Kali Linux", level: "advanced", category: "security" },
      { name: "CTF", level: "intermediate", category: "security" },
      { name: "Network Security", level: "advanced", category: "security" },
      { name: "Web Security", level: "advanced", category: "security" },
      { name: "Cloud Security", level: "intermediate", category: "security" },
      { name: "Python", level: "advanced", category: "backend" },
      { name: "Docker", level: "advanced", category: "devops" },
      { name: "Git", level: "advanced", category: "tools" },
      { name: "OpenCode + MCP", level: "advanced", category: "tools" }
    ],
    certifications: [
      { name: "Reverse Engineering & Exploit Development", issuer: "UCM", status: "active" },
      { name: "Ethical Hacking & Penetration Testing", issuer: "ABACOM", status: "active" },
      { name: "Fundamentos de Ciberseguridad", issuer: "ABACOM", status: "active" },
      { name: "MSc Ciberseguridad (en curso)", issuer: "Universidad Complutense de Madrid", status: "in-progress" }
    ],
    summary: {
      es: "Hacker Ético y Security Researcher. Pentesting, IDOR/CVSS, RE/Explotación (ms08_067, ms17_010), Hardware Hacking (OpenWrt ramips-mt76x8). Auditoría Moodle UCM: 5 hallazgos (1 CRIT CVSS 9.1, 2 MED, 2 LOW). MSc Ciberseguridad UCM en curso.",
      en: "Ethical Hacker and Security Researcher. Pentesting, IDOR/CVSS, RE/Exploitation (ms08_067, ms17_010), Hardware Hacking (OpenWrt ramips-mt76x8). UCM Moodle audit: 5 findings (1 CRIT CVSS 9.1, 2 MED, 2 LOW). MSc Cybersecurity UCM in progress."
    },
    pdf: "cv-hacker.pdf"
  },

  research: {
    label: {
      es: "Investigador | MSc Ciberseguridad UCM",
      en: "Researcher | MSc Cybersecurity UCM"
    },
    skills: [
      { name: "Machine Learning", level: "intermediate", category: "ai" },
      { name: "Statistical Analysis", level: "intermediate", category: "ai" },
      { name: "LaTeX", level: "advanced", category: "tools" },
      { name: "Quarto", level: "advanced", category: "tools" },
      { name: "Jupyter", level: "advanced", category: "tools" },
      { name: "NotebookLM Power-User", level: "master", category: "tools" },
      { name: "Research Methodology", level: "advanced", category: "research" },
      { name: "Scientific Writing", level: "advanced", category: "research" },
      { name: "Academic Publishing", level: "intermediate", category: "research" },
      { name: "Ethical Hacking", level: "advanced", category: "security" },
      { name: "Penetration Testing", level: "advanced", category: "security" },
      { name: "Network Security", level: "advanced", category: "security" },
      { name: "Threat Modeling", level: "advanced", category: "security" },
      { name: "Vulnerability Assessment", level: "advanced", category: "security" },
      { name: "Python", level: "advanced", category: "backend" },
      { name: "R Language", level: "intermediate", category: "ai" },
      { name: "TensorFlow", level: "intermediate", category: "ai" },
      { name: "Git", level: "advanced", category: "tools" }
    ],
    certifications: [
      { name: "Magíster en Cs. y Tec. de la Computación", issuer: "UTPL", status: "active" },
      { name: "MSc Ciberseguridad (en curso)", issuer: "Universidad Complutense de Madrid", status: "in-progress" }
    ],
    summary: {
      es: "Investigador en ciberseguridad y machine learning. MSc en Ciberseguridad UCM (en curso, 2026-2027). Magíster en Cs. y Tec. de la Computación (UTPL 2021). 55 notebooks y 898 sources en NotebookLM. más de 400 repos en GitHub. Interesado en threat modeling, pentesting y AI security.",
      en: "Researcher in cybersecurity and machine learning. MSc in Cybersecurity UCM (in progress, 2026-2027). Master's in Computer Science (UTPL 2021). 55 notebooks and 898 sources in NotebookLM. more than 400 repos on GitHub. Interested in threat modeling, pentesting, and AI security."
    },
    pdf: "cv-research.pdf"
  },

  "docente-facilitador": {
    label: {
      es: "Docente Facilitador | Generador de Currículos ABP",
      en: "Teaching Facilitator | ABP Curriculum Generator"
    },
    skills: [
      { name: "Diseño Curricular (ABP / ADDIE)", level: "master", category: "teaching" },
      { name: "Python", level: "advanced", category: "backend" },
      { name: "R Language", level: "intermediate", category: "ai" },
      { name: "Flutter", level: "advanced", category: "mobile" },
      { name: "Linux", level: "master", category: "security" },
      { name: "Ethical Hacking", level: "advanced", category: "security" },
      { name: "Quarto", level: "advanced", category: "tools" },
      { name: "LaTeX", level: "advanced", category: "tools" },
      { name: "NotebookLM Power-User", level: "master", category: "tools" },
      { name: "Jupyter", level: "advanced", category: "tools" },
      { name: "OpenCode + MCP", level: "advanced", category: "tools" },
      { name: "Hardware Hacking (OpenWrt)", level: "advanced", category: "security" }
    ],
    certifications: [
      { name: "Magíster en Cs. y Tec. de la Computación", issuer: "UTPL", status: "active" },
      { name: "Licenciado en Informática Educativa", issuer: "UNL", status: "active" },
      { name: "Estrategia de Transformación Digital en Marketing Educativo (Fases I, II, III)", issuer: "ABACOM", status: "active" },
      { name: "Imagen de Marca (Branding)", issuer: "ABACOM", status: "active" },
      { name: "Ethical Hacking & Penetration Testing", issuer: "ABACOM", status: "active" },
      { name: "Fundamentos de Ciberseguridad", issuer: "ABACOM", status: "active" },
      { name: "Python for Data Science", issuer: "ABACOM", status: "active" },
      { name: "R para Análisis Estadístico", issuer: "ABACOM", status: "active" },
      { name: "Flutter Mobile Development (3 niveles)", issuer: "ABACOM", status: "active" },
      { name: "Linux Server Administration", issuer: "ABACOM", status: "active" }
    ],
    summary: {
      es: "Docente Facilitador que genera currículos ABP/ADDIE para cursos de Python, Flutter, R, Linux, Ethical Hacking e IA. 6+ años de experiencia continua en educación superior (9 años como Profesor de Computación en APC). 200+ horas docentes en ABACOM, cohorte Python 2026 promedio 93.4/100. Refs verificadas: ABACOM (Ing. Kelbi Ramírez Macas), APC (Ing. Rolando Marcelo Rojas Merchán), ISTJM (Ing. Ana Gabriela Montalván Salcedo, Mba).",
      en: "Teaching Facilitator generating ABP/ADDIE curricula for Python, Flutter, R, Linux, Ethical Hacking, and AI courses. 6+ years continuous experience in higher education (9 years as Computer Science Teacher at APC). 200+ teaching hours at ABACOM, Python 2026 cohort averaging 93.4/100. Verified refs: ABACOM (Kelbi Ramírez Macas, Eng.), APC (Rolando Marcelo Rojas Merchán, Eng.), ISTJM (Ana Gabriela Montalván Salcedo, Mba Eng.)."
    },
    pdf: "cv-docente-facilitador.pdf"
  }
}

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
      es: "Magíster en Cs. y Tec. de la Computación (UTPL). MSc Ciberseguridad en curso (UCM). 10+ años en desarrollo full-stack y 6+ como docente universitario. Especializado en React, Node.js, Python, pentesting, ingeniería inversa y diseño curricular ABP.",
      en: "Master's in Computer Science (UTPL). MSc Cybersecurity in progress (UCM). 10+ years in full-stack development, 6+ as university instructor. Specialized in React, Node.js, Python, pentesting, reverse engineering, and PBL curriculum design."
    },
    image: "/statick.png",
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
      { network: "Portfolio", url: "https://statick88.github.io" }
    ]
  },

  work: [
    {
      name: "Meeting Planner AI System",
      position: { es: "Diseñador y arquitecto de software (proyecto propio)", en: "Software Designer and Architect (own project)" },
      startDate: "2026-01-01",
      summary: {
        es: "Sistema propio de transcripción y análisis de contenido audiovisual con IA generativa. Arquitectura limpia, SDD y despliegue reproducible con Docker Compose.",
        en: "Own transcription and AI-assisted audiovisual content analysis system. Clean architecture, SDD and reproducible Docker Compose deployments.",
      },
      highlights: {
        es: [
          "Arquitecté un sistema modular de transcripción y análisis con arquitectura limpia, integrando Whisper/MLX para speech-to-text, LLMs (Groq/xAI) para análisis y resumen, y Docker Compose para entornos reproducibles.",
          "Reduje 80% el tiempo dedicado a la transcripción manual, procesando horas de contenido audiovisual cada semana sin intervención humana.",
          "Mejoré la accesibilidad educativa con transcripciones precisas y buscables, con un diseño extensible que permitió sumar servicios de análisis sin reestructurar el núcleo.",
        ],
        en: [
          "Architected a modular transcription and analysis system with clean architecture, integrating Whisper/MLX for speech-to-text, LLMs (Groq/xAI) for contextual analysis and summarisation, and Docker Compose for reproducible environments.",
          "Cut 80% of the time spent on manual transcription, processing hours of audiovisual content every week without human intervention.",
          "Improved educational accessibility with precise, searchable transcripts, on an extensible design that added analysis services without restructuring the core.",
        ],
      },
      technologies: ["Python", "FastAPI", "React 19", "Zustand", "Whisper/MLX", "LLM (Groq, xAI)", "Docker Compose", "SDD", "Clean Architecture"],
    },
    {
      name: "ABACOM",
      position: { es: "Docente, Facilitador y Curriculista", en: "Instructor, Facilitator and Curriculum Designer" },
      url: "https://abacom.edu.ec/",
      startDate: "2021-12-01",
      summary: {
        es: "Diseño curricular y facilitación de cursos de Python, Flutter, R, Linux, Ethical Hacking, Fundamentos de Ciberseguridad e IA. 200+ horas docentes verificadas con la cohorte de Python 2026 (promedio 93.4/100). Ref: Ing. Kelbi Ramírez Macas.",
        en: "Curriculum design and facilitation of Python, Flutter, R, Linux, Ethical Hacking, Cybersecurity Fundamentals, and AI courses. 200+ verified teaching hours with the 2026 Python cohort averaging 93.4/100. Ref: Kelbi Ramírez Macas, Eng.",
      },
      highlights: {
        es: [
          "Diseñé y dicté 8 cursos de Ethical Hacking, Python, Flutter, MicroPython, servidores Linux y software seguro, con 200+ horas docentes verificadas y 92+ estudiantes.",
          "Logré un promedio de evaluación de 93.4/100 en la cohorte de Python 2026, publicando el material como 8 libros Quarto abiertos en GitHub Pages.",
          "Construí el pack docente de cada curso (guía del instructor, manual del estudiante, rúbricas de evaluación y plan de acreditación) con metodología ABP.",
        ],
        en: [
          "Designed and taught 8 courses on Ethical Hacking, Python, Flutter, MicroPython, Linux servers and secure software, covering 200+ verified teaching hours and 92+ students.",
          "Achieved a 93.4/100 average evaluation with the 2026 Python cohort, publishing the material as 8 open Quarto books on GitHub Pages.",
          "Built the instructor pack for every course (teaching guide, student manual, assessment rubrics and accreditation plan) with ABP methodology.",
        ],
      },
      technologies: ["Ethical Hacking", "Python", "Flutter", "R", "Linux", "Quarto", "ABP", "OWASP", "Docker"],
    },
    {
      name: "Codings Academy",
      position: { es: "Facilitador de Bootcamps (Django + React)", en: "Bootcamp Facilitator (Django + React)" },
      url: "https://codingsacademy.com",
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      summary: {
        es: "Facilitación de bootcamps de desarrollo web full stack con Django y React, con evaluación por rúbricas y seguimiento individual del avance de cada estudiante.",
        en: "Facilitated full-stack web development bootcamps with Django and React, using rubric-based assessment and individual progress tracking for every student.",
      },
      highlights: {
        es: [
          "Facilité bootcamps de desarrollo web full stack con Django y React, con evaluación por rúbricas y seguimiento individual del avance de cada estudiante.",
          "Acompañé a los grupos en el ciclo completo de desarrollo (diseño, implementación, testing y despliegue) de sus proyectos finales.",
        ],
        en: [
          "Facilitated full-stack web development bootcamps with Django and React, using rubric-based assessment and individual progress tracking for every student.",
          "Guided teams through the full development cycle (design, implementation, testing and deployment) of their final projects.",
        ],
      },
      technologies: ["Django", "React", "Python", "JavaScript", "Full Stack"],
    },
    {
      name: "ESPE - Universidad de las Fuerzas Armadas",
      position: { es: "Docente Ocasional Tiempo Completo - DCC", en: "Full-time Professor - Computer Science Dept." },
      url: "https://www.espe.edu.ec",
      startDate: "2023-04-01",
      endDate: "2024-10-31",
      summary: {
        es: "Docente del Departamento de Ciencias de la Computación. Asignaturas: Programación, Bases de Datos, Ingeniería de Software. Certificación laboral disponible bajo solicitud.",
        en: "Professor in the Computer Science Department. Courses: Programming, Databases, Software Engineering. Employment certificate available on request.",
      },
      highlights: {
        es: [
          "Dicté las asignaturas de Programación, Bases de Datos e Ingeniería de Software dentro del Departamento de Ciencias de la Computación.",
          "Trabajo con foco en arquitectura de software, modelado de datos relacionales y prácticas de ingeniería aplicadas a casos reales.",
        ],
        en: [
          "Taught Programming, Databases and Software Engineering within the Computer Science Department.",
          "Worked on software architecture, relational data modelling and engineering practices applied to real cases.",
        ],
      },
      technologies: ["Programación", "Bases de Datos", "Ingeniería de Software", "SQL", "Python"],
    },
    {
      name: "UIDE - Universidad Internacional del Ecuador (Ext. Loja)",
      position: { es: "Docente Ocasional - TTI", en: "Adjunct Professor - IT Career" },
      url: "https://www.uide.edu.ec/",
      startDate: "2022-10-01",
      endDate: "2022-12-31",
      summary: {
        es: "Docente de la carrera de Tecnologías de la Información en la extensión de Loja. Certificación laboral disponible bajo solicitud.",
        en: "Professor for the Information Technologies career at the Loja campus. Employment certificate available on request.",
      },
      highlights: {
        es: [
          "Docente de la carrera de Tecnologías de la Información en la extensión de Loja durante el período académico 2022.",
          "Planifiqué las sesiones y los materiales de la asignatura en coordinación con el resto del claustro de la carrera.",
        ],
        en: [
          "Professor for the Information Technologies career at the Loja campus during the 2022 academic term.",
          "Planned sessions and course materials in coordination with the rest of the career's teaching staff.",
        ],
      },
      technologies: ["Tecnologías de la Información", "Redes", "Hardware"],
    },
    {
      name: "Instituto Superior Tecnológico Juan Montalvo",
      position: { es: "Docente Titular Auxiliar - Carrera de Ensamblaje y Mantenimiento de Equipos de Cómputo", en: "Associate Professor - Computer Assembly & Maintenance Career" },
      url: "https://istjm.edu.ec/",
      startDate: "2020-10-01",
      endDate: "2022-03-31",
      summary: {
        es: "Docente Titular en la carrera técnica de Ensamblaje y Mantenimiento. Asignaturas: Hardware, Redes, Sistemas Operativos. Puente directo con la habilidad de Hardware Hacking (OpenWrt, firmware). Ref: Ing. Ana Gabriela Montalván Salcedo, MBA (Coord. Talento Humano, CI 1103882955).",
        en: "Associate Professor in the Computer Assembly & Maintenance technical career. Courses: Hardware, Networking, Operating Systems. Direct bridge to the Hardware Hacking skill (OpenWrt, firmware). Ref: Ana Gabriela Montalván Salcedo, MBA Eng. (HR Coordinator, ID 1103882955).",
      },
      highlights: {
        es: [
          "Dicté Hardware, Redes y Sistemas Operativos en la carrera técnica de Ensamblaje y Mantenimiento, conectando la cátedra con hardware hacking sobre OpenWrt y firmware.",
          "Monté laboratorios prácticos de redes, instalación de sistemas y configuración de dispositivos embebidos con OpenWrt.",
        ],
        en: [
          "Taught Hardware, Networking and Operating Systems in the Computer Assembly & Maintenance technical career, connecting the course to hardware hacking on OpenWrt and firmware.",
          "Set up practical labs in networking, OS installation and embedded device configuration with OpenWrt.",
        ],
      },
      technologies: ["Hardware", "Redes", "Sistemas Operativos", "OpenWrt", "Firmware", "Kali"],
    },
    {
      name: "APC - Antonio Peña Celi",
      position: { es: "Profesor de Computación", en: "Computer Science Teacher" },
      url: "https://apc.edu.ec/",
      startDate: "2013-09-01",
      endDate: "2022-12-31",
      summary: {
        es: "Profesor de Computación durante 9 años (2013-2022). Formación en programación, ofimática avanzada y soporte técnico. Ref: Ing. Rolando Marcelo Rojas Merchán.",
        en: "Computer Science Teacher for 9 years (2013-2022). Training in programming, advanced office tools, and technical support. Ref: Rolando Marcelo Rojas Merchán, Eng.",
      },
      highlights: {
        es: [
          "Impartí programación, ofimática avanzada y soporte técnico a más de 400 alumnos durante 9 años consecutivos (2013-2022).",
          "Acompañé a los estudiantes en la transición de la ofimática a la programación estructurada y al soporte de hardware en el aula.",
        ],
        en: [
          "Taught programming, advanced office tooling and technical support to more than 400 students over 9 consecutive years (2013-2022).",
          "Guided students through the shift from office tooling to structured programming and classroom hardware support.",
        ],
      },
      technologies: ["Programación", "Ofimática avanzada", "Soporte técnico", "Hardware", "Redes"],
    },
  ],

  education: [
    {
      institution: "Universidad Complutense de Madrid",
      area: { es: "Máster en Ciberseguridad Defensiva y Ofensiva", en: "Master's in Defensive and Offensive Cybersecurity" },
      url: "https://www.ucm.es/",
      startDate: "2026-02-01",
      endDate: "2027-12-31",
      studyType: "Master",
      score: "En curso"
    },
    {
      institution: "Universidad Técnica Particular de Loja",
      area: { es: "Maestría en Ciencias y Tecnologías de la Computación", en: "Master's in Computer Science and Technologies" },
      url: "https://www.utpl.edu.ec/",
      startDate: "2018-09-01",
      endDate: "2021-02-28",
      studyType: "Master",
      score: "4.0"
    },
    {
      institution: "Universidad Nacional de Loja",
      area: { es: "Licenciatura en Informática Educativa", en: "Bachelor's in Educational Computing" },
      url: "https://unl.edu.ec/",
      startDate: "2007-09-01",
      endDate: "2011-02-28",
      studyType: "Bachelor",
      score: "4.0"
    }
  ],

  skills: [
    { name: "HTML", level: "master", category: "frontend-fundamentals" },
    { name: "CSS", level: "master", category: "frontend-fundamentals" },
    { name: "JavaScript", level: "master", category: "frontend-fundamentals" },
    { name: "TypeScript", level: "advanced", category: "frontend-frameworks" },
    { name: "React", level: "advanced", category: "frontend-frameworks" },
    { name: "Next.js", level: "advanced", category: "frontend-frameworks" },
    { name: "Vue", level: "intermediate", category: "frontend-frameworks" },
    { name: "Svelte", level: "intermediate", category: "frontend-frameworks" },
    { name: "Angular", level: "intermediate", category: "frontend-frameworks" },
    { name: "Node.js", level: "advanced", category: "backend" },
    { name: "Python", level: "advanced", category: "backend" },
    { name: "Django", level: "advanced", category: "backend" },
    { name: "FastAPI", level: "advanced", category: "backend" },
    { name: "NestJS", level: "advanced", category: "backend" },
    { name: "SRI / XAdES", level: "advanced", category: "backend" },
    { name: "Flutter", level: "advanced", category: "mobile" },
    { name: "React Native", level: "advanced", category: "mobile" },
    { name: "Expo SDK 53+", level: "advanced", category: "mobile" },
    { name: "Swift (iOS)", level: "intermediate", category: "mobile-native" },
    { name: "Kotlin (Android)", level: "intermediate", category: "mobile-native" },
    { name: "Docker", level: "advanced", category: "devops" },
    { name: "Kubernetes", level: "intermediate", category: "devops" },
    { name: "AWS", level: "intermediate", category: "devops" },
    { name: "Azure", level: "intermediate", category: "devops" },
    { name: "GitHub Actions", level: "intermediate", category: "devops" },
    { name: "MySQL", level: "advanced", category: "databases" },
    { name: "MongoDB", level: "advanced", category: "databases" },
    { name: "PostgreSQL", level: "advanced", category: "databases" },
    { name: "Clean Architecture", level: "advanced", category: "architecture" },
    { name: "SOLID", level: "advanced", category: "architecture" },
    { name: "TDD", level: "advanced", category: "architecture" },
    { name: "Ethical Hacking", level: "advanced", category: "security" },
    { name: "Penetration Testing", level: "advanced", category: "security" },
    { name: "OWASP Top 10", level: "advanced", category: "security" },
    { name: "Auditoría de Pentesting", level: "advanced", category: "security" },
    { name: "Ingeniería Inversa y Explotación", level: "advanced", category: "security" },
    { name: "Hardware Hacking (OpenWrt)", level: "advanced", category: "security" },
    { name: "Bash Scripting", level: "advanced", category: "security" },
    { name: "Linux", level: "master", category: "security" },
    { name: "Kali Linux", level: "advanced", category: "security" },
    { name: "Metasploit", level: "intermediate", category: "security" },
    { name: "Burp Suite", level: "intermediate", category: "security" },
    { name: "Nmap", level: "advanced", category: "security" },
    { name: "Wireshark", level: "intermediate", category: "security" },
    { name: "Machine Learning", level: "intermediate", category: "ai" },
    { name: "TensorFlow", level: "intermediate", category: "ai" },
    { name: "R Language", level: "intermediate", category: "ai" },
    { name: "Git", level: "advanced", category: "tools" },
    { name: "NotebookLM Power-User", level: "master", category: "tools" },
    { name: "OpenCode + MCP", level: "advanced", category: "tools" },
    { name: "Quarto", level: "advanced", category: "tools" },
    { name: "Jupyter", level: "advanced", category: "tools" },
    { name: "LaTeX", level: "advanced", category: "tools" },
    { name: "Diseño Curricular (ABP / ADDIE)", level: "master", category: "teaching" }
  ],

  softSkills: [
    { es: "Resolución de Problemas", en: "Problem Solving" },
    { es: "Trabajo en Equipo", en: "Teamwork" },
    { es: "Comunicación", en: "Communication" },
    { es: "Adaptabilidad", en: "Adaptability" },
    { es: "Gestión del Tiempo", en: "Time Management" },
    { es: "Liderazgo", en: "Leadership" },
    { es: "Mentoría", en: "Mentoring" }
  ],

  languages: [
    { language: "Español", fluency: { es: "Nativo", en: "Native" } },
    { language: "Inglés", fluency: { es: "Avanzado", en: "Advanced" } },
    { language: "Italiano", fluency: { es: "Básico", en: "Basic" } },
    { language: "Portugués", fluency: { es: "Básico", en: "Basic" } }
  ],

  projects: [
    {
      name: "open-api-facturacion-sri",
      description: {
        es: "API REST para facturación electrónica SRI Ecuador con firma XAdES-BES, validación contra esquemas XSD del SRI y emisión de comprobantes electrónicos.",
        en: "REST API for SRI Ecuador electronic invoicing with XAdES-BES signing, XSD schema validation, and electronic receipt emission."
      },
      highlights: {
        es: ["Node.js", "TypeScript", "XAdES-BES", "SRI Ecuador"],
        en: ["Node.js", "TypeScript", "XAdES-BES", "SRI Ecuador"]
      },
      github: "https://github.com/statick88/open-api-facturacion-sri"
    },
    {
      name: "MindLedger",
      description: {
        es: "Sistema de gestión clínica y contable multi-tenant con encriptación de grado médico. Tauri v2 (Rust) + React + SQLCipher. Clean Architecture, patrón Repository, migraciones SQLCipher, datos de prueba interactivos, tema oscuro.",
        en: "Multi-tenant clinic and accounting management system with medical-grade encryption. Tauri v2 (Rust) + React + SQLCipher. Clean Architecture, Repository pattern, SQLCipher migrations, interactive sample data, dark theme."
      },
      highlights: {
        es: ["Tauri v2", "Rust", "React", "SQLCipher", "Clean Architecture", "Multi-Tenant"],
        en: ["Tauri v2", "Rust", "React", "SQLCipher", "Clean Architecture", "Multi-Tenant"]
      },
      github: "https://github.com/statick88/MindLedger"
    },
    {
      name: "CyberGuardians",
      description: {
        es: "Plataforma de educación en ciberseguridad para jóvenes latinoamericanos (14-22). Enseña a través de gamificación, no de lectures. Next.js 15, TypeScript, Tailwind CSS, diseño glasspunk colorido con paneles de cristal y neón. Sistema de XP, logros y módulos interactivos.",
        en: "Cybersecurity education platform for Latin American youth (14-22). Teaches through gameplay, not lectures. Next.js 15, TypeScript, Tailwind CSS, colorful glasspunk design with glass panels and neon. XP system, achievements, and interactive modules."
      },
      highlights: {
        es: ["Next.js 15", "TypeScript", "Tailwind CSS", "Gamificación", "Glassmorphism", "Educación"],
        en: ["Next.js 15", "TypeScript", "Tailwind CSS", "Gamification", "Glassmorphism", "Education"]
      },
      github: "https://github.com/statick88/cyber-guardians"
    },
    {
      name: "multi-agent-system",
      description: {
        es: "Sistema multi-agente para SDD (Spec-Driven Development) con orquestación de agentes via OpenCode + MCP. Usado en producción para CV portfolio, MiroFish y proyectos de ciberseguridad.",
        en: "Multi-agent system for SDD (Spec-Driven Development) with OpenCode + MCP agent orchestration. Used in production for CV portfolio, MiroFish, and cybersecurity projects."
      },
      highlights: {
        es: ["Python", "FastAPI", "OpenCode", "MCP", "SDD"],
        en: ["Python", "FastAPI", "OpenCode", "MCP", "SDD"]
      },
      github: "https://github.com/statick88/multi-agent-system"
    },
    {
      name: "material-educativo-unl",
      description: {
        es: "Material educativo abierto para la UNL usando Quarto + metodología ABP (Aprendizaje Basado en Proyectos). Cubre Informática Educativa, programación y didáctica.",
        en: "Open educational material for UNL using Quarto + PBL (Project-Based Learning) methodology. Covers Educational Computing, programming, and didactics."
      },
      highlights: {
        es: ["Quarto", "ABP", "Open Educational Resources", "UNL"],
        en: ["Quarto", "PBL", "Open Educational Resources", "UNL"]
      },
      github: "https://github.com/statick88/material-educativo-unl"
    },
    {
      name: "UCM-Moodle-Pentest",
      description: {
        es: "Auditoría de seguridad del campus virtual Moodle de la UCM. 5 hallazgos: 1 CRÍTICO (CVSS 9.1 IDOR), 2 MEDIOS (CVSS 5.3-6.8), 2 BAJOS. Metodología OWASP WSTG + IDOR enumeration con Playwright + curl.",
        en: "Security audit of UCM Moodle campus. 5 findings: 1 CRITICAL (CVSS 9.1 IDOR), 2 MEDIUM (CVSS 5.3-6.8), 2 LOW. OWASP WSTG + IDOR enumeration with Playwright + curl."
      },
      highlights: {
        es: ["Pentest", "OWASP WSTG", "CVSS 3.1", "IDOR", "Moodle"],
        en: ["Pentest", "OWASP WSTG", "CVSS 3.1", "IDOR", "Moodle"]
      },
      github: "https://github.com/statick88/ucm-moodle-pentest"
    },
    {
      name: "OpenWrt-Hardware-Hacking",
      description: {
        es: "Tutorial de hardware hacking con OpenWrt para router ramips-mt76x8. Cubre compilación con imagebuilder, flasheo de firmware y recuperación TFTP. Originado en proyecto docente ISTJM.",
        en: "Hardware hacking tutorial with OpenWrt for ramips-mt76x8 router. Covers imagebuilder compilation, firmware flashing, and TFTP recovery. Originated in ISTJM teaching project."
      },
      highlights: {
        es: ["OpenWrt", "ramips-mt76x8", "imagebuilder", "TFTP", "firmware"],
        en: ["OpenWrt", "ramips-mt76x8", "imagebuilder", "TFTP", "firmware"]
      },
      github: "https://github.com/statick88/openwrt-hardware-hacking"
    },
    {
      name: "ms08-067-metasploit-demo",
      description: {
        es: "Demo de ingeniería inversa y explotación con Metasploit Framework: ms08_067 (Windows XP/2003) y ms17_010 (EternalBlue). Virtual lab con Win2K8. Documentación paso a paso.",
        en: "Reverse engineering and exploitation demo with Metasploit Framework: ms08_067 (Windows XP/2003) and ms17_010 (EternalBlue). Win2K8 virtual lab. Step-by-step documentation."
      },
      highlights: {
        es: ["Metasploit", "ms08_067", "ms17_010", "RE", "Windows"],
        en: ["Metasploit", "ms08_067", "ms17_010", "RE", "Windows"]
      },
      github: "https://github.com/statick88/ms08-067-metasploit-demo"
    }
  ],

  certifications: [
    { name: "Magíster en Cs. y Tec. de la Computación", issuer: "UTPL", status: "active" },
    { name: "Licenciado en Informática Educativa", issuer: "UNL", status: "active" },
    { name: "Reverse Engineering & Exploit Development", issuer: "UCM", status: "active" },
    { name: "Ethical Hacking & Penetration Testing", issuer: "ABACOM", status: "active" },
    { name: "Linux Server Administration", issuer: "ABACOM", status: "active" },
    { name: "Python for Data Science", issuer: "ABACOM", status: "active" },
    { name: "R para Análisis Estadístico", issuer: "ABACOM", status: "active" },
    { name: "Flutter Mobile Development (3 niveles)", issuer: "ABACOM", status: "active" },
    { name: "Fundamentos de Ciberseguridad", issuer: "ABACOM", status: "active" },
    { name: "Imagen de Marca (Branding)", issuer: "ABACOM", status: "active" },
    { name: "Estrategia de Transformación Digital en Marketing Educativo (Fases I, II, III)", issuer: "ABACOM", status: "active" },
    { name: "MSc Ciberseguridad (en curso, 2026-2027)", issuer: "Universidad Complutense de Madrid", status: "in-progress" },
    { name: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", status: "active" },
    { name: "Introduction to IoT", issuer: "Cisco Networking Academy", status: "active" },
    { name: "Hack The Box Certificate", issuer: "Hack The Box", status: "active" },
    { name: "Course of Cybersecurity (NIST CSF 2.0)", issuer: "Self-published", status: "active" },
    { name: "Ethical Hacking 2026 (Ebook + Labs)", issuer: "Self-published", status: "active" },
    { name: "Dark Web Course", issuer: "Self-published", status: "active" },
    { name: "Docker Fundamentals + Docker Course", issuer: "Platzi", status: "active" },
    { name: "Flutter Course + Flutter Avanzado", issuer: "Platzi", status: "active" },
    { name: "Python Course + Python Practico + Python CS", issuer: "Platzi", status: "active" },
    { name: "Django Course", issuer: "Platzi", status: "active" },
    { name: "AWS Fundamentals", issuer: "Platzi", status: "active" },
    { name: "AI for Developers + AI Course", issuer: "Platzi", status: "active" },
    { name: "Git & GitHub Course", issuer: "Platzi", status: "active" },
    { name: "Linux Fundamentals + Linux Course", issuer: "Platzi", status: "active" },
    { name: "Backend con Node.js", issuer: "Platzi", status: "active" },
    { name: "React Native Course", issuer: "Codigo Facilito", status: "active" },
    { name: "Curso Profesional de Python", issuer: "Codigo Facilito", status: "active" },
    { name: "Curso de Machine Learning", issuer: "Codigo Facilito", status: "active" },
    { name: "Curso de CSS", issuer: "Codigo Facilito", status: "active" },
    { name: "Taller de Next.js", issuer: "Codigo Facilito", status: "active" }
  ],

  metrics: {
    abacomCohorte2026: {
      value: "93.4",
      unit: "/100",
      label_es: "Promedio cohorte Python 2026",
      label_en: "Python 2026 cohort avg",
      source: "Docente Cuantitativa Evaluation.pdf"
    },
    githubRepos: {
      value: "400+",
      unit: "",
      label_es: "Repositorios públicos en GitHub",
      label_en: "Public GitHub repos",
      source: "github.com/statick88"
    },
    nlmNotebooks: {
      value: "55 / 898",
      unit: "",
      label_es: "Notebooks / sources en NotebookLM",
      label_en: "Notebooks / sources in NotebookLM",
      source: "nlm --version (v0.6.8)"
    },
    certificationsCount: {
      value: "134+",
      unit: "",
      label_es: "Certificaciones categorizadas",
      label_en: "Categorized certifications",
      source: "~/Documents/Certificados/"
    }
  },

  // Services data — for HireMe / Contact section
  services: [
    {
      id: 'fullstack',
      icon: 'code',
      title: { es: 'Desarrollo FullStack', en: 'FullStack Development' },
      description: {
        es: 'Aplicaciones web y móviles de producción con arquitectura sólida, pruebas y documentación. React, Next.js, Flutter, Node.js, Python, PostgreSQL.',
        en: 'Production-grade web and mobile applications with solid architecture, tests, and documentation. React, Next.js, Flutter, Node.js, Python, PostgreSQL.'
      },
      formats: {
        es: ['Por proyecto', 'Por horas', 'Medio tiempo'],
        en: ['Per project', 'Hourly', 'Part-time']
      },
      priceRange: '$25-50/hora',
      color: '#3b82f6'
    },
    {
      id: 'security',
      icon: 'shield',
      title: { es: 'Auditoría de Seguridad', en: 'Security Audit' },
      description: {
        es: 'Pentesting de aplicaciones web y móviles. Identificación de vulnerabilidades OWASP Top 10, reportes con CVSS scoring y recomendaciones de remediación.',
        en: 'Web and mobile application pentesting. OWASP Top 10 vulnerability identification, CVSS-scored reports, and remediation recommendations.'
      },
      formats: {
        es: ['Por proyecto', 'Retainer mensual'],
        en: ['Per project', 'Monthly retainer']
      },
      priceRange: '$500-3000/proyecto',
      color: '#ef4444'
    },
    {
      id: 'consulting',
      icon: 'target',
      title: { es: 'Consultoría Técnica', en: 'Technical Consulting' },
      description: {
        es: 'CTO Fractional: arquitectura de software, revisión de código, mentoría de equipos y toma de decisiones técnicas estratégicas.',
        en: 'Fractional CTO: software architecture, code review, team mentoring, and strategic technical decision-making.'
      },
      formats: {
        es: ['Medio tiempo', 'Por horas', 'Retainer'],
        en: ['Part-time', 'Hourly', 'Retainer']
      },
      priceRange: '$20-40/hora',
      color: '#8b5cf6'
    },
    {
      id: 'training',
      icon: 'book',
      title: { es: 'Capacitación & Cursos', en: 'Training & Courses' },
      description: {
        es: 'Cursos personalizados de Python, Hacking Ético, Ciberseguridad y desarrollo de software. 500+ estudiantes formados en ESPE, UIDE, ABACOM.',
        en: 'Custom courses in Python, Ethical Hacking, Cybersecurity, and software development. 500+ students trained at ESPE, UIDE, ABACOM.'
      },
      formats: {
        es: ['Por hora', 'Por curso', 'Workshop'],
        en: ['Hourly', 'Per course', 'Workshop']
      },
      priceRange: '$30-60/hora',
      color: '#10b981'
    }
  ],

  // Contact CTAs
  contact: {
    email: 'dsaavedra88@gmail.com',
    phone: '+593 98 019 2790',
    whatsapp: 'https://wa.me/593980192790',
    linkedin: 'https://linkedin.com/in/dsaavedra88',
    github: 'https://github.com/statick88',
    calendar: '', // Add Calendly or similar if available
    tagline: {
      es: '¿Listo para llevar tu proyecto al siguiente nivel? Hablemos.',
      en: 'Ready to take your project to the next level? Let\'s talk.'
    },
    cta: {
      es: 'Agendar Llamada Gratuita',
      en: 'Schedule Free Call'
    }
  }
}
