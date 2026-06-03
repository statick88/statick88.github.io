# Design: CV Portfolio — Profile Consolidation

**Change ID:** `2026-06-02-profile-consolidation`
**Status:** Draft
**Parent:** [spec.md](./spec.md)

## Architecture

The portfolio is a **single-page React 18 + Vite SPA** with a data-driven design. The current architecture is sound; this change refactors the data layer and adds one new component. No new dependencies.

```
┌──────────────────────────────────────────────────────────────────────┐
│                       cv-diego (React SPA)                          │
├──────────────────────────────────────────────────────────────────────┤
│  index.html                                                         │
│    └─ <div id="root">                                                │
│         └─ <App />                                                   │
│              ├─ <Particles />        (background animation)         │
│              ├─ <ProfileSelector />  (4 profiles)                    │
│              ├─ <LanguageToggle />   (ES / EN)                       │
│              ├─ <ThemeToggle />      (Dark / Light)                 │
│              ├─ <Hero>  ── basics.name, label, image, contact       │
│              ├─ <Metrics /> [NEW]   ── 4 hard numbers                │
│              ├─ <Section id="summary">                               │
│              │     └─ <Summary>  ── getSummary() per profile         │
│              ├─ <Section id="experience">                            │
│              │     └─ <Timeline items={cvData.work} />               │
│              ├─ <Section id="education">                             │
│              │     └─ <Timeline items={cvData.education} />          │
│              ├─ <Section id="skills">                                │
│              │     └─ <Skills items={cvData.skills} />               │
│              ├─ <Section id="projects">                              │
│              │     └─ <Projects items={cvData.projects} />           │
│              └─ <Section id="certifications">                        │
│                    └─ <Certifications items={cvData.certifications} />│
├──────────────────────────────────────────────────────────────────────┤
│  src/data/cvData.js [REWRITTEN]                                     │
│    ├─ profileData   ── 4 profiles (developer, hacker, research,      │
│    │                     curriculista)                              │
│    │     ├─ label     (es/en)                                        │
│    │     ├─ skills    (grouped by category)                          │
│    │     ├─ summary   (es/en)                                        │
│    │     ├─ certifications                                            │
│    │     └─ pdf       (path to generated PDF)                        │
│    └─ cvData         ── single consolidated view                      │
│          ├─ basics    (name, label, image, contact, profiles)        │
│          ├─ work      (6 verified entries)                           │
│          ├─ education (3 verified entries)                           │
│          ├─ skills    (full list with categories)                    │
│          ├─ projects  (6 verified entries)                           │
│          ├─ certifications                                            │
│          ├─ softSkills                                               │
│          ├─ languages                                                │
│          └─ metrics [NEW]  ── 4 hard numbers                          │
├──────────────────────────────────────────────────────────────────────┤
│  generate-cv-markdown.js   ── cv-{es,en}.md (main CV)                │
│  generate-profile-cvs.js   ── cv-{profile}-{es,en}.md (8 variants)   │
│  .github/workflows/ci.yml  ── QA + Security + Design + Deploy        │
│  vite.config.js            ── SPA build with security headers       │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Layer Refactor

### `cvData.basics` (updated)

```javascript
basics: {
  name: "Diego Medardo Saavedra García",
  label: {
    es: "Magíster en Cs. y Tec. de la Computación (UTPL). MSc Ciberseguridad en curso (UCM). 10+ años en desarrollo full-stack y 6+ como docente universitario. Especializado en React, Node.js, Python, pentesting, ingeniería inversa y diseño curricular ABP.",
    en: "MSc in Computer Science (UTPL). MSc Cybersecurity in progress (UCM). 10+ years in full-stack development, 6+ as university instructor. Specialized in React, Node.js, Python, pentesting, reverse engineering, and PBL curriculum design."
  },
  image: "/me.webp",
  email: "dsaavedra88@gmail.com",
  phone: "+593 980192790",
  location: { city: "Loja", region: "Loja", countryCode: "ECU" },
  profiles: [
    { network: "LinkedIn", url: "https://www.linkedin.com/in/diego-saavedra-developer/" },
    { network: "GitHub", url: "https://github.com/statick88" },
    { network: "Portfolio", url: "https://statick88.github.io" }
  ]
}
```

### `cvData.work` (6 verified entries)

```javascript
work: [
  {
    name: "ABACOM",
    position: {
      es: "Docente, Facilitador y Curriculista",
      en: "Instructor, Facilitator and Curriculum Designer"
    },
    url: "https://abacom.edu.ec/",
    startDate: "2021-12-01",
    summary: {
      es: "Diseño curricular y facilitación de cursos de Python, Flutter, R, Linux, Ethical Hacking, Fundamentos de Ciberseguridad e IA. 200h docentes verificadas con cohorte 2026 promedio 93.4/100. Ref: Ing. Kelbi Ramírez Macas.",
      en: "Curriculum design and facilitation of Python, Flutter, R, Linux, Ethical Hacking, Cybersecurity Fundamentals, and AI courses. 200+ verified teaching hours with 2026 cohort averaging 93.4/100. Ref: Kelbi Ramírez Macas, Eng."
    }
  },
  {
    name: "ESPE - Universidad de las Fuerzas Armadas",
    position: {
      es: "Docente Ocasional Tiempo Completo - DCC",
      en: "Full-time Professor - Computer Science Dept."
    },
    url: "https://www.espe.edu.ec",
    startDate: "2023-04-01",
    endDate: "2024-10-31",
    summary: {
      es: "Docente del Departamento de Ciencias de la Computación. Asignaturas: Programación, Bases de Datos, Ingeniería de Software. (Sin certificado laboral PDF disponible).",
      en: "Professor in the Computer Science Department. Courses: Programming, Databases, Software Engineering. (No PDF employment certificate available)."
    }
  },
  {
    name: "APC - Antonio Peña Celi",
    position: {
      es: "Profesor de Computación",
      en: "Computer Science Teacher"
    },
    url: "https://apc.edu.ec/",
    startDate: "2013-09-01",
    summary: {
      es: "Profesor de Computación. Más de 12 años formando estudiantes en programación, ofimática avanzada y soporte técnico. Ref: Ing. Rolando Marcelo Rojas Merchán.",
      en: "Computer Science Teacher. 12+ years training students in programming, advanced office tools, and technical support. Ref: Rolando Marcelo Rojas Merchán, Eng."
    }
  },
  {
    name: "Codings Academy",
    position: {
      es: "Facilitador de Bootcamps (Django + React)",
      en: "Bootcamp Facilitator (Django + React)"
    },
    url: "https://codingsacademy.com",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    summary: {
      es: "Facilitador de Bootcamps de Desarrollo Web Full Stack con Django y React. Ref: Ing. Jyron Isai Cedeño Chavez, MSc.",
      en: "Facilitator of Full-stack Web Development Bootcamps with Django and React. Ref: Jyron Isai Cedeño Chavez, MSc Eng."
    }
  },
  {
    name: "Instituto Superior Tecnológico Juan Montalvo",
    position: {
      es: "Docente Titular Auxiliar - Carrera de Ensamblaje y Mantenimiento de Equipos de Cómputo",
      en: "Associate Professor - Computer Assembly & Maintenance Career"
    },
    url: "https://istjm.edu.ec/",
    startDate: "2020-10-01",
    endDate: "2022-03-31",
    summary: {
      es: "Docente Titular en la carrera técnica de Ensamblaje y Mantenimiento. Asignaturas: Hardware, Redes, Sistemas Operativos. Puente directo con skill de Hardware Hacking (OpenWrt, firmware). Ref: Ing. Ana Gabriela Montalván Salcedo, Mba (Coord. Talento Humano, CI 1103882955).",
      en: "Associate Professor in the Computer Assembly & Maintenance technical career. Courses: Hardware, Networking, Operating Systems. Direct bridge to Hardware Hacking skill (OpenWrt, firmware). Ref: Ana Gabriela Montalván Salcedo, Mba Eng. (HR Coordinator, ID 1103882955)."
    }
  },
  {
    name: "UIDE - Universidad Internacional del Ecuador (Ext. Loja)",
    position: {
      es: "Docente Ocasional - TTI",
      en: "Adjunct Professor - IT Career"
    },
    url: "https://www.uide.edu.ec/",
    startDate: "2022-10-01",
    endDate: "2022-12-31",
    summary: {
      es: "Docente de la carrera de Tecnologías de la Información. (Sin certificado laboral PDF disponible).",
      en: "Professor of Information Technologies career. (No PDF employment certificate available)."
    }
  }
]
```

### `cvData.education` (3 verified entries)

```javascript
education: [
  {
    institution: "Universidad Complutense de Madrid",
    area: {
      es: "Máster en Ciberseguridad Defensiva y Ofensiva",
      en: "Master's in Defensive and Offensive Cybersecurity"
    },
    url: "https://www.ucm.es/",
    startDate: "2026-02-01",
    endDate: "2027-12-31",
    studyType: "Master",
    score: "En curso"
  },
  {
    institution: "Universidad Técnica Particular de Loja",
    area: {
      es: "Maestría en Ciencias y Tecnologías de la Computación",
      en: "Master's in Computer Science and Technologies"
    },
    url: "https://www.utpl.edu.ec/",
    startDate: "2018-09-01",
    endDate: "2021-02-28",
    studyType: "Master",
    score: "4.0"
  },
  {
    institution: "Universidad Nacional de Loja",
    area: {
      es: "Licenciatura en Informática Educativa",
      en: "Bachelor's in Educational Computing"
    },
    url: "https://unl.edu.ec/",
    startDate: "2007-09-01",
    endDate: "2011-02-28",
    studyType: "Bachelor",
    score: "4.0"
  }
]
```

### `cvData.skills` (full verified set, deduplicated)

```javascript
skills: [
  // Frontend
  { name: "HTML", level: "master", category: "frontend-fundamentals" },
  { name: "CSS", level: "master", category: "frontend-fundamentals" },
  { name: "JavaScript", level: "master", category: "frontend-fundamentals" },
  { name: "TypeScript", level: "advanced", category: "frontend-frameworks" },
  { name: "React", level: "advanced", category: "frontend-frameworks" },
  { name: "Next.js", level: "advanced", category: "frontend-frameworks" },
  { name: "Vue", level: "intermediate", category: "frontend-frameworks" },
  { name: "Svelte", level: "intermediate", category: "frontend-frameworks" },
  { name: "Angular", level: "intermediate", category: "frontend-frameworks" },
  // Backend
  { name: "Node.js", level: "advanced", category: "backend" },
  { name: "Python", level: "advanced", category: "backend" },
  { name: "Django", level: "advanced", category: "backend" },
  { name: "FastAPI", level: "advanced", category: "backend" },
  { name: "NestJS", level: "advanced", category: "backend" },
  { name: "SRI / XAdES", level: "advanced", category: "backend" },
  // Mobile
  { name: "Flutter", level: "advanced", category: "mobile" },
  { name: "React Native", level: "advanced", category: "mobile" },
  { name: "Expo SDK 53+", level: "advanced", category: "mobile" },
  { name: "Swift (iOS)", level: "intermediate", category: "mobile-native" },
  { name: "Kotlin (Android)", level: "intermediate", category: "mobile-native" },
  // DevOps
  { name: "Docker", level: "advanced", category: "devops" },
  { name: "Kubernetes", level: "intermediate", category: "devops" },
  { name: "AWS", level: "intermediate", category: "devops" },
  { name: "Azure", level: "intermediate", category: "devops" },
  { name: "GitHub Actions", level: "intermediate", category: "devops" },
  // Databases
  { name: "MySQL", level: "advanced", category: "databases" },
  { name: "MongoDB", level: "advanced", category: "databases" },
  { name: "PostgreSQL", level: "advanced", category: "databases" },
  // Architecture
  { name: "Clean Architecture", level: "advanced", category: "architecture" },
  { name: "SOLID", level: "advanced", category: "architecture" },
  { name: "TDD", level: "advanced", category: "architecture" },
  // Security [NEW + verified]
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
  // AI
  { name: "Machine Learning", level: "intermediate", category: "ai" },
  { name: "TensorFlow", level: "intermediate", category: "ai" },
  { name: "R Language", level: "intermediate", category: "ai" },
  // Tools [NEW + verified]
  { name: "Git", level: "advanced", category: "tools" },
  { name: "NotebookLM Power-User", level: "master", category: "tools" },
  { name: "OpenCode + MCP", level: "advanced", category: "tools" },
  { name: "Quarto", level: "advanced", category: "tools" },
  { name: "Jupyter", level: "advanced", category: "tools" },
  { name: "LaTeX", level: "advanced", category: "tools" },
  // Teaching [NEW + verified]
  { name: "Diseño Curricular (ABP / ADDIE)", level: "master", category: "teaching" }
]
```

### `cvData.projects` (6 verified)

```javascript
projects: [
  {
    name: "open-api-facturacion-sri",
    description: {
      es: "API REST para facturación electrónica SRI Ecuador con firma XAdES-BES, validacion contra esquemas XSD del SRI y emision de comprobantes electronicos.",
      en: "REST API for SRI Ecuador electronic invoicing with XAdES-BES signing, XSD schema validation, and electronic receipt emission."
    },
    highlights: {
      es: ["Node.js", "TypeScript", "XAdES-BES", "SRI Ecuador"],
      en: ["Node.js", "TypeScript", "XAdES-BES", "SRI Ecuador"]
    },
    github: "https://github.com/statick88/open-api-facturacion-sri"
  },
  {
    name: "multi-agent-system",
    description: {
      es: "Sistema multi-agente para SDD (Spec-Driven Development) con orquestacion de agentes via OpenCode + MCP. Usado en produccion para CV portfolio, MiroFish y proyectos de ciberseguridad.",
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
      es: "Material educativo abierto para la UNL usando Quarto + metodologia ABP (Aprendizaje Basado en Proyectos). Cubre Informatica Educativa, programacion y didactica.",
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
      es: "Auditoria de seguridad del campus virtual Moodle de la UCM. 5 hallazgos: 1 CRITICO (CVSS 9.1 IDOR), 2 MEDIOS (CVSS 5.3-6.8), 2 BAJOS. Metodologia OWASP WSTG + IDOR enumeration con Playwright + curl.",
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
      es: "Tutorial de hardware hacking con OpenWrt para router ramips-mt76x8. Cubre compilacion con imagebuilder, flasheo de firmware y recuperacion TFTP. Originado en proyecto docente ISTJM.",
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
      es: "Demo de ingenieria inversa y explotacion con Metasploit Framework: ms08_067 (Windows XP/2003) y ms17_010 (EternalBlue). Virtual lab con Win2K8. Documentacion paso a paso.",
      en: "Reverse engineering and exploitation demo with Metasploit Framework: ms08_067 (Windows XP/2003) and ms17_010 (EternalBlue). Win2K8 virtual lab. Step-by-step documentation."
    },
    highlights: {
      es: ["Metasploit", "ms08_067", "ms17_010", "RE", "Windows"],
      en: ["Metasploit", "ms08_067", "ms17_010", "RE", "Windows"]
    },
    github: "https://github.com/statick88/ms08-067-metasploit-demo"
  }
]
```

### `cvData.certifications` (verified, deduplicated)

```javascript
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
  { name: "MSc Ciberseguridad (en curso, 2026-2027)", issuer: "Universidad Complutense de Madrid", status: "in-progress" }
]
```

> **Removed** (unverified or duplicated):
> - "Certified Ethical Hacker (CEH)" — no evidence Diego has this certification.
> - "Security+", "Network+", "Linux+" (CompTIA) — no evidence.
> - "Azure Fundamentals" (Microsoft) — replaced with verified MS ABACOM certificates.
> - "OSCP" (Offensive Security) — never enrolled, removed.
> - "Título de Maestría en Ciberseguridad" (UCM) — that's the in-progress MSc, lives in `education`.
> - "Certificate as Reviewer" (VIIT-CIT-2024) — verify or remove.
> - "Estrategias de atención educativa inclusiva" (CES Ecuador) — verify.
> - "Fundamentos de Marketing Digital" (Google Activate) — verify.

> **Note**: the full list of 134+ categorized certifications lives in `~/Documents/Certificados/`. The portfolio site shows the top 12 (verified + active). For job applications, the full list is included in `~/Documents/job_applications/core/cv-consolidado.md`.

### `cvData.metrics` (NEW)

```javascript
metrics: {
  abacomCohorte2026: { value: "93.4", unit: "/100", label_es: "Promedio cohorte Python 2026", label_en: "Python 2026 cohort avg", source: "Docente Cuantitativa Evaluation.pdf" },
  githubRepos: { value: "100+", unit: "", label_es: "Repositorios públicos en GitHub", label_en: "Public GitHub repos", source: "github.com/statick88" },
  nlmNotebooks: { value: "55 / 898", unit: "", label_es: "Notebooks / sources en NotebookLM", label_en: "Notebooks / sources in NotebookLM", source: "nlm --version (v0.6.8)" },
  certifications: { value: "134+", unit: "", label_es: "Certificaciones categorizadas", label_en: "Categorized certifications", source: "~/Documents/Certificados/" }
}
```

## Component Design

### NEW: `src/components/Metrics.jsx`

```jsx
import { motion } from 'framer-motion'

const metricVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' }
  })
}

export default function Metrics({ metrics, t }) {
  const items = [
    metrics.abacomCohorte2026,
    metrics.githubRepos,
    metrics.nlmNotebooks,
    metrics.certifications
  ]

  return (
    <section
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      aria-label={t('Métricas verificadas', 'Verified metrics')}
    >
      {items.map((m, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={metricVariants}
          whileHover={{ scale: 1.03, y: -2 }}
          className="glass rounded-xl p-4 text-center hover-glow cursor-default"
          title={`Source: ${m.source}`}
        >
          <div className="text-2xl md:text-3xl font-bold gradient-text">
            {m.value}<span className="text-base opacity-60">{m.unit}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {t(m.label_es, m.label_en)}
          </div>
        </motion.div>
      ))}
    </section>
  )
}
```

### UPDATED: `src/components/ProfileSelector.jsx`

Add 4th profile `curriculista`:

```jsx
const profiles = [
  { id: 'developer',    icon: '💻', label: 'Full Stack',   color: '#3b82f6', desc: 'React/Node.js/Python' },
  { id: 'hacker',       icon: '🎯', label: 'Hacker Ético', color: '#ef4444', desc: 'Pentest & RE' },
  { id: 'research',     icon: '🔬', label: 'Investigador', color: '#f59e0b', desc: 'MSc Ciberseguridad UCM' },
  { id: 'curriculista', icon: '📚', label: 'Curriculista', color: '#10b981', desc: 'Docente + Diseño ABP' }
]
```

### UPDATED: `src/App.jsx`

- Default `activeProfile` → `{ id: 'curriculista', ... }` (reflects 6+ años docente).
- `getSummary()` returns 4 summaries (one per profile).
- Add `<Metrics metrics={cvData.metrics} t={t} />` between Hero and Summary.
- Update PDF download links: `/cv-{id}-{lang}.pdf`.

## CI Gate Hardening

### UPDATED: `.github/workflows/ci.yml`

```yaml
jobs:
  qa-gate:
    # ...
    - name: Lint
      run: pnpm run lint          # NO || true
    - name: TypeScript Check
      run: pnpm run typecheck     # NO || true
    - name: Build
      run: pnpm build

  security-gate:
    # ...
    - name: Dependency Audit
      run: pnpm audit --audit-level=moderate   # NO || true
    - name: Secret scan
      run: |
        ! grep -rE "(api[_-]?key|secret|token|password)\s*[:=]\s*['\"]" src/ || (echo "Secrets found" && exit 1)

  design-gate:
    # ...
    - name: Build Verification
      run: pnpm build
    - name: Generate CVs (8 variants)
      run: |
        node generate-cv-markdown.js
        node generate-profile-cvs.js
    - name: Verify CV PDFs exist
      run: |
        for p in developer hacker research curriculista; do
          for l in es en; do
            test -f cv-$p-$l.pdf || (echo "Missing cv-$p-$l.pdf" && exit 1)
          done
        done
    - name: Verify bundle size
      run: |
        SIZE=$(stat -c%s dist/assets/index-*.js)
        test $SIZE -lt 250000 || (echo "Bundle too large: $SIZE" && exit 1)
```

### NEW: `vite.config.js` (security headers)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  }
})
```

> GitHub Pages doesn't honor `_headers` for SPA fallback, so dev-server headers are the practical layer. Production deploys can use a `<meta http-equiv>` for `X-Frame-Options` if needed (added to `index.html`).

## Generators Refactor

### UPDATED: `generate-profile-cvs.js`

- Loop over `Object.keys(profileData)` (4 profiles now, not 3).
- Output: `cv-{developer,hacker,research,curriculista}-{es,en}.md`.
- Each variant includes: header, summary, skills (grouped by category), top-3 projects, top-5 certs, contact.
- Remove the duplicate "Reverse Engineering" / "Malware Analysis" entries.

### UPDATED: `generate-cv-markdown.js`

- Output: `cv-es.md` and `cv-en.md` (consolidated main CV).
- Includes all skills, all projects, all certs, full work history, full education.
- Includes the 4 hard metrics from `cvData.metrics`.

## Risk Mitigation in Design

- **R3 (CI breaks main)**: Since the change itself fixes lint/TS errors first and then removes `|| true`, the main branch will be in a "lint-clean" state when the gate-tightening lands.
- **R2 (4th profile complexity)**: The dropdown is already scrollable (4 fits in the 56px height). Each profile has a distinct color and icon for differentiation.

## Files Changed

| File | Change Type | LOC Delta |
|------|-------------|-----------|
| `src/data/cvData.js` | Major rewrite | +200 / -100 |
| `src/App.jsx` | Add Metrics, default profile, summaries | +50 / -20 |
| `src/components/ProfileSelector.jsx` | Add 4th profile | +1 / 0 |
| `src/components/Metrics.jsx` | NEW | +30 |
| `generate-cv-markdown.js` | Include metrics, fix paths | +20 / -10 |
| `generate-profile-cvs.js` | 4 profiles, dedup skills | +10 / -5 |
| `.github/workflows/ci.yml` | Remove `\|\| true`, add gates | +20 / -10 |
| `vite.config.js` | Security headers | +10 / 0 |
| `index.html` | Add `http-equiv` for X-Frame-Options | +1 / 0 |

## Acceptance Walkthrough

After all tasks complete:

```bash
cd ~/dev/cv-diego

# 1. QA Gate
pnpm install
pnpm lint             # → exit 0
pnpm typecheck        # → exit 0
pnpm build            # → dist/ created, < 250KB gzipped

# 2. Security Gate
pnpm audit --audit-level=moderate   # → 0 vulnerabilities
grep -rE "api[_-]?key.*=.*['\"]" src/   # → no output

# 3. Design Gate
node generate-cv-markdown.js
node generate-profile-cvs.js
# 8 .md + 8 .pdf files in working tree
ls cv-*.pdf | wc -l   # → 8

# 4. Visual check
pnpm preview   # → localhost:4173, ProfileSelector shows 4 options
# - Default is Curriculista
# - Metrics section visible
# - 6 projects, 12 certifications
# - Toggle ES/EN, dark/light works
# - Mobile responsive
```
