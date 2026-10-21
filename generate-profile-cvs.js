import { writeFileSync } from 'fs';
import { cvData, profileData } from './src/data/cvData.js';

console.log('Successfully imported profileData');

// BUG FIX 2026-10-21: `lang` nunca se pasaba, asi que t() devolvia siempre el
// texto en ingles y los CV en espanol salian con encabezados en ingles.
let currentLang = 'es';
const t = (es, en, lang) => (lang || currentLang) === 'es' ? es : en;

// Skill levels live in the data in English; the CV must speak its own language.
const LEVEL_LABELS = {
  master: ['Experto', 'Master'],
  advanced: ['Avanzado', 'Advanced'],
  intermediate: ['Intermedio', 'Intermediate'],
};
const levelLabel = (level, lang) => {
  const found = LEVEL_LABELS[String(level).toLowerCase()];
  return found ? found[lang === 'es' ? 0 : 1] : level;
};

// Which experience belongs to which profile (company name → entries).
const PROFILE_EXPERIENCE = {
  developer: ['Meeting Planner AI System', 'Codings Academy', 'ABACOM'],
  hacker: ['Meeting Planner AI System', 'ABACOM', 'Instituto Superior Tecnológico Juan Montalvo'],
  research: ['Meeting Planner AI System', 'ABACOM', 'Codings Academy'],
  'consultor': ['Meeting Planner AI System', 'Codings Academy', 'ABACOM', 'Instituto Superior Tecnológico Juan Montalvo'],
  'docente-facilitador': [
    'ABACOM',
    'Codings Academy',
    'ESPE - Universidad de las Fuerzas Armadas',
    'UIDE - Universidad Internacional del Ecuador (Ext. Loja)',
    'Instituto Superior Tecnológico Juan Montalvo',
    'APC - Antonio Peña Celi',
  ],
};

function generateProfileMarkdown(profileKey, lang) {
  currentLang = lang;
  const profile = profileData[profileKey];
  const label = profile.label[lang] || profile.label.es;
  
  let markdown = `# ${label}\n\n`;
  
  // Summary
  markdown += `## ${t('Resumen Profesional', 'Professional Summary')}\n\n`;
  markdown += `${profile.summary[lang] || profile.summary.es}\n\n`;
  
  // ── Practice / organization block ───────────────────────────────────────
  // Only for variants flagged `practice`. The data comes from cvData (the
  // single source), so the block can never state anything the CV data does not.
  const practice = cvData.practice;
  if (profile.practice && practice) {
    markdown += `## ${t('Mi Práctica', 'My Practice')}\n\n`;
    markdown += `${practice.positioning[lang] || practice.positioning.es}\n\n`;

    const svc = (cvData.services || []).filter((s) => (practice.serviceIds || []).includes(s.id));
    if (svc.length) {
      markdown += `### ${t('Servicios', 'Services')}\n\n`;
      for (const s of svc) {
        const title = (s.title && (s.title[lang] || s.title.es)) || s.id;
        const desc = (s.description && (s.description[lang] || s.description.es)) || '';
        const formats = ((s.formats && (s.formats[lang] || s.formats.es)) || []).join(', ');
        markdown += `- **${title}** — ${desc} ${t('Modalidades', 'Formats')}: ${formats}. ${t('Tarifa', 'Rate')}: ${s.priceRange}\n`;
      }
      markdown += `\n`;
    }

    const tools = (cvData.projects || []).filter((p) => (practice.toolNames || []).includes(p.name));
    if (tools.length) {
      markdown += `### ${t('Herramientas Propias', 'Own Tools')}\n\n`;
      for (const tool of tools) {
        const desc = (tool.description && (tool.description[lang] || tool.description.es)) || '';
        const link = tool.github ? ` — ${String(tool.github).replace(/^https?:\/\//, '')}` : '';
        markdown += `- **${tool.name}** — ${desc}${link}\n`;
      }
      markdown += `\n`;
    }

    const tr = practice.training || {};
    markdown += `### ${t('Formación Propia', 'Own Training')}\n\n`;
    markdown += `- ${tr.courses} ${t('cursos publicados', 'published courses')}\n`;
    markdown += `- ${tr.hours}+ ${t('horas docentes verificadas', 'verified teaching hours')}\n`;
    markdown += `- ${tr.students}+ ${t('estudiantes', 'students')} (${t('promedio', 'average')} ${tr.averageScore}/100)\n`;
    markdown += `- ${tr.institutions} ${t('instituciones donde he enseñado', 'institutions taught at')}\n\n`;

    const eng = practice.engagements || [];
    if (eng.length) {
      markdown += `### ${t('Encargos de Seguridad Autorizados', 'Authorized Security Engagements')}\n\n`;
      for (const e of eng) {
        markdown += `- **${e.period} — ${e.sector}**: ${e.scope}. ${e.outcome}\n`;
      }
      markdown += `\n`;
    }

    const refs = practice.referenceNames || [];
    if (refs.length) {
      markdown += `### ${t('Referencias', 'References')}\n\n`;
      markdown += refs.map((r) => `- ${r}`).join('\n') + `\n\n`;
    }
  }

  // Skills grouped by category
  markdown += `## ${t('Habilidades Técnicas', 'Technical Skills')}\n\n`;
  
  // Group skills by category
  const skillsByCategory = {};
  profile.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });
  
  // Categories in order of preference
  const categoryOrder = [
    "frontend-fundamentals",
    "frontend-frameworks", 
    "backend",
    "mobile",
    "mobile-native",
    "devops",
    "databases",
    "security",
    "architecture",
    "teaching",
    "tools",
    "ai",
    "research"
  ];
  
  categoryOrder.forEach(category => {
    if (skillsByCategory[category]) {
      // Get category name in language
      let categoryName = category;
      switch(category) {
        case "frontend-fundamentals": categoryName = t('Fundamentos de Frontend', 'Frontend Fundamentals'); break;
        case "frontend-frameworks": categoryName = t('Frameworks de Frontend', 'Frontend Frameworks'); break;
        case "backend": categoryName = t('Backend', 'Backend'); break;
        case "mobile": categoryName = t('Móvil', 'Mobile'); break;
        case "mobile-native": categoryName = t('Móvil Nativo', 'Native Mobile'); break;
        case "devops": categoryName = t('DevOps', 'DevOps'); break;
        case "databases": categoryName = t('Bases de Datos', 'Databases'); break;
        case "security": categoryName = t('Seguridad', 'Security'); break;
        case "architecture": categoryName = t('Arquitectura', 'Architecture'); break;
        case "teaching": categoryName = t('Enseñanza', 'Teaching'); break;
        case "tools": categoryName = t('Herramientas', 'Tools'); break;
        case "ai": categoryName = t('Inteligencia Artificial', 'AI'); break;
        case "research": categoryName = t('Investigación', 'Research'); break;
        default: categoryName = category;
      }
      
      markdown += `### ${categoryName}\n\n`;
      skillsByCategory[category].forEach(skill => {
        markdown += `- **${skill.name}**: ${levelLabel(skill.level, lang)}\n`;
      });
      markdown += `\n`;
    }
  });
  
  // Experience: the entries that match this profile, in XYZ form.
  const experience = (cvData.work || []).filter((job) =>
    (PROFILE_EXPERIENCE[profileKey] || []).includes(job.name),
  );
  if (experience.length > 0) {
    markdown += `## ${t('Experiencia', 'Experience')}\n\n`;
    experience.forEach((job) => {
      markdown += `### ${job.position[lang] || job.position.es} — ${job.name}\n`;
      markdown += `${job.startDate} ${job.endDate ? `- ${job.endDate}` : t('Presente', 'Present')}\n\n`;
      const highlights = (job.highlights && (job.highlights[lang] || job.highlights.es)) || [];
      highlights.slice(0, 3).forEach((h) => {
        markdown += `- ${h}\n`;
      });
      if (job.technologies && job.technologies.length > 0) {
        markdown += `\n**${t('Stack', 'Stack')}:** ${job.technologies.slice(0, 8).join(', ')}\n`;
      }
      markdown += `\n`;
    });
  }

  // Certifications
  markdown += `## ${t('Certificaciones', 'Certifications')}\n\n`;
  if (profile.certifications && profile.certifications.length > 0) {
    profile.certifications.forEach(cert => {
      markdown += `- **${cert.name}** - ${cert.issuer} (${cert.status === 'active' ? t('Activo', 'Active') : t('En Progreso', 'In Progress')})\n`;
    });
  } else {
    markdown += `*No hay certificaciones listadas para este perfil*\n\n`;
  }
  
  // Write to file
  const filename = `cv-${profileKey}-${lang}.md`;
  writeFileSync(filename, markdown);
  console.log(`Generated ${filename}`);
}

// Generate all profiles in both languages
Object.keys(profileData).forEach(profileKey => {
  generateProfileMarkdown(profileKey, 'es');
  generateProfileMarkdown(profileKey, 'en');
});
