import { writeFileSync } from 'fs';
import { cvData } from './src/data/cvData.js';
import { publications } from './src/data/publications.ts';
import { courses } from './src/data/courses.js';

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

console.log('Successfully imported cvData');

// Now generate markdown for both languages
generateMarkdown(cvData, 'es');
generateMarkdown(cvData, 'en');

/**
 * The organization block ("Mi Práctica").
 *
 * It used to be rendered only by the consultant variant. The CV is one
 * document now, so the block belongs to the general CV as well, with the same
 * order and the same language rules it had in the variant.
 *
 * Everything comes from the data: the services from `cvData.services`, the own
 * tools from the canonical projects, the training figures, the engagements and
 * the references from the `practice` record. No sentence is written here.
 */
function renderPractice(data, lang, t) {
  const practice = data.practice;
  if (!practice) return '';

  let markdown = `## ${t('Mi Práctica', 'My Practice')}\n\n`;
  markdown += `${practice.positioning[lang] || practice.positioning.es}\n\n`;

  const services = (data.services || []).filter((service) =>
    (practice.serviceIds || []).includes(service.id),
  );
  if (services.length) {
    markdown += `### ${t('Servicios', 'Services')}\n\n`;
    for (const service of services) {
      const title = (service.title && (service.title[lang] || service.title.es)) || service.id;
      const description =
        (service.description && (service.description[lang] || service.description.es)) || '';
      const formats = ((service.formats && (service.formats[lang] || service.formats.es)) || []).join(', ');
      markdown += `- **${title}** — ${description} ${t('Modalidades', 'Formats')}: ${formats}. ${t('Tarifa', 'Rate')}: ${service.priceRange}\n`;
    }
    markdown += `\n`;
  }

  // Resolve the declared own tools against the canonical projects: the two
  // mirrors carry the same tools with different display names, so the match is
  // case-insensitive and keeps the first occurrence (no duplicates).
  const wantedTools = (practice.toolNames || []).map((name) => String(name).toLowerCase());
  const seenTools = new Set();
  const tools = (data.projects || []).filter((project) => {
    const key = String(project.name || '').toLowerCase();
    if (!key || !wantedTools.includes(key) || seenTools.has(key)) return false;
    seenTools.add(key);
    return true;
  });
  if (tools.length) {
    markdown += `### ${t('Herramientas Propias', 'Own Tools')}\n\n`;
    for (const tool of tools) {
      const description = (tool.description && (tool.description[lang] || tool.description.es)) || '';
      const link = tool.github ? ` — ${String(tool.github).replace(/^https?:\/\//, '')}` : '';
      markdown += `- **${tool.name}** — ${description}${link}\n`;
    }
    markdown += `\n`;
  }

  const training = practice.training || {};
  markdown += `### ${t('Formación Propia', 'Own Training')}\n\n`;
  markdown += `- ${training.courses} ${t('cursos publicados', 'published courses')}\n`;
  markdown += `- ${training.hours}+ ${t('horas docentes verificadas', 'verified teaching hours')}\n`;
  markdown += `- ${training.students}+ ${t('estudiantes', 'students')} (${t('promedio', 'average')} ${training.averageScore}/100)\n`;
  markdown += `- ${training.institutions} ${t('instituciones donde he enseñado', 'institutions taught at')}\n\n`;

  const engagements = practice.engagements || [];
  if (engagements.length) {
    markdown += `### ${t('Encargos de Seguridad Autorizados', 'Authorized Security Engagements')}\n\n`;
    for (const engagement of engagements) {
      const sector =
        (engagement.sector && (engagement.sector[lang] || engagement.sector.es)) || engagement.sector || '';
      const scope =
        (engagement.scope && (engagement.scope[lang] || engagement.scope.es)) || engagement.scope || '';
      const outcome =
        (engagement.outcome && (engagement.outcome[lang] || engagement.outcome.es)) || engagement.outcome || '';
      markdown += `- **${engagement.period} — ${sector}**: ${scope}. ${outcome}\n`;
    }
    markdown += `\n`;
  }

  const references = practice.referenceNames || [];
  if (references.length) {
    markdown += `### ${t('Referencias', 'References')}\n\n`;
    markdown += references.map((reference) => `- ${reference}`).join('\n') + `\n\n`;
  }

  return markdown;
}

function generateMarkdown(data, lang) {
  const t = (es, en) => lang === 'es' ? es : en;

  let markdown = `# ${data.basics.name}\n\n`;

  // Basics
  markdown += `## ${t('Contacto', 'Contact')}\n\n`;
  markdown += `## ${t('Resumen Profesional', 'Professional Summary')}\n\n`;
  markdown += `${t(data.basics.label.es, data.basics.label.en)}\n\n`;

  // Contact info
  markdown += `- **${t('Correo', 'Email')}:** ${data.basics.email}\n`;
  markdown += `- **${t('Teléfono', 'Phone')}:** ${data.basics.phone}\n`;
  markdown += `- **${t('Ubicación', 'Location')}:** ${data.basics.location.city}, ${data.basics.location.region}, ${data.basics.location.countryCode}\n`;
  markdown += `- **${t('Perfiles', 'Profiles')}:**\n`;
  data.basics.profiles.forEach(profile => {
    markdown += `  - [${profile.network} — ${profile.url.replace(/^https?:\/\//, '')}](${profile.url})\n`;
  });
  markdown += `\n`;

  // The organization block: the practice, its services, its own tools, its
  // training, its authorized engagements and its references.
  markdown += renderPractice(data, lang, t);

  // Work Experience
  markdown += `## ${t('Experiencia Laboral', 'Work Experience')}\n\n`;
  data.work.forEach(job => {
    markdown += `### ${job.position[lang] || job.position.es} at ${job.name}\n`;
    if (job.url) markdown += `${job.url}\n\n`;
    markdown += `${job.startDate} ${job.endDate ? `- ${job.endDate}` : t('Presente', 'Present')}\n\n`;
    const highlights = job.highlights?.[lang] || job.highlights?.es || [];
    // Con logros en formato XYZ, el resumen es redundante.
    if (highlights.length === 0) {
      markdown += `${job.summary[lang] || job.summary.es}\n\n`;
    }
    if (highlights.length > 0) {
      highlights.forEach(h => {
        markdown += `- ${h}\n`;
      });
      markdown += `\n`;
    }
    if (job.technologies && job.technologies.length > 0) {
      markdown += `**${t('Stack', 'Stack')}:** ${job.technologies.slice(0, 8).join(', ')}\n\n`;
    }
  });

  // Education
  markdown += `## ${t('Educación', 'Education')}\n\n`;
  data.education.forEach(edu => {
    markdown += `### ${edu.area[lang] || edu.area.es} - ${edu.institution}\n`;
    markdown += `${edu.studyType}\n`;
    markdown += `${edu.startDate} ${edu.endDate ? `- ${edu.endDate}` : t('Presente', 'Present')}\n`;
    if (edu.score) {
      markdown += `**${t('Puntuación', 'Score')}:** ${edu.score}\n`;
    }
    markdown += `\n`;
  });

  // Skills
  markdown += `## ${t('Habilidades Técnicas', 'Technical Skills')}\n\n`;
  // Group skills by category
  const skillsByCategory = {};
  data.skills.forEach(skill => {
    const cat = skill.category || 'other';
    if (!skillsByCategory[cat]) {
      skillsByCategory[cat] = [];
    }
    skillsByCategory[cat].push(skill);
  });

  const categoryOrder = [
    "frontend-fundamentals", "frontend-frameworks", "backend", "mobile", "mobile-native",
    "devops", "databases", "security", "architecture", "teaching", "tools", "ai", "research",
    "project-management"
  ];

  const categoryNames = {
    "frontend-fundamentals": t('Fundamentos de Frontend', 'Frontend Fundamentals'),
    "frontend-frameworks": t('Frameworks de Frontend', 'Frontend Frameworks'),
    "backend": t('Backend', 'Backend'),
    "mobile": t('Móvil', 'Mobile'),
    "mobile-native": t('Móvil Nativo', 'Native Mobile'),
    "devops": t('DevOps', 'DevOps'),
    "databases": t('Bases de Datos', 'Databases'),
    "security": t('Seguridad', 'Security'),
    "architecture": t('Arquitectura', 'Architecture'),
    "teaching": t('Enseñanza', 'Teaching'),
    "tools": t('Herramientas', 'Tools'),
    "ai": t('Inteligencia Artificial', 'AI'),
    "research": t('Investigación', 'Research'),
    "project-management": t('Gestión de proyectos', 'Project management')
  };

  categoryOrder.forEach(category => {
    if (skillsByCategory[category]) {
      markdown += `**${categoryNames[category]}:** `;
      markdown += skillsByCategory[category].map(skill => `${skill.name} (${levelLabel(skill.level, lang)})`).join(', ');
      markdown += `\n\n`;
    }
  });

  // Projects
  markdown += `## ${t('Proyectos Destacados', 'Featured Projects')}\n\n`;
  data.projects.forEach(project => {
    markdown += `- **${project.name}** — ${project.description[lang] || project.description.es} `;
    markdown += `_${(project.highlights[lang] || project.highlights.en).join(', ')}_`;
    if (project.github) markdown += ` [${t('Código', 'Code')}](${project.github})`;
    if (project.url) markdown += ` [${t('Ver', 'View')}](${project.url})`;
    markdown += `\n`;
  });
  markdown += `\n`;

  // Certifications
  markdown += `## ${t('Certificaciones', 'Certifications')}\n\n`;
  data.certifications.forEach(cert => {
    markdown += `- **${cert.name}** - ${cert.issuer} (${cert.status === 'active' ? t('Activo', 'Active') : t('En Progreso', 'In Progress')})\n`;
  });
  markdown += `\n`;

  // Soft Skills and Languages
  markdown += `### ${t('Habilidades Blandas y Idiomas', 'Soft Skills and Languages')}\n\n`;
  markdown += `#### ${t('Habilidades Blandas', 'Soft Skills')}\n`;
  markdown += data.softSkills.map(skill => skill[lang] || skill.es).join(' · ') + `\n\n`;
  markdown += `#### ${t('Idiomas', 'Languages')}\n`;
  data.languages.forEach(langObj => {
    markdown += `- ${langObj.language}: ${langObj.fluency[lang] || langObj.fluency.es}\n`;
  });

  // Publicaciones: el diferencial para docencia e investigación.
  markdown += `## ${t('Publicaciones e Investigación', 'Publications and Research')}\n\n`;
  publications.forEach((pub) => {
    markdown += `- **${pub.title}** — ${pub.journal} (${pub.year})`;
    if (pub.citations > 0) markdown += ` _${pub.citations} ${t('cita', 'citation')}_`;
    markdown += `\n`;
  });
  markdown += `\n`;

  // Cursos publicados: material abierto, prueba de capacidad docente.
  markdown += `## ${t('Cursos Publicados', 'Published Courses')} (${courses.length})\n\n`;
  markdown += `- ${t(
    'Libros y cursos completos publicados en GitHub Pages',
    'Complete books and courses published on GitHub Pages',
  )}: ${courses.map((c) => c.title).join('; ')}\n\n`;

  // Metrics
  if (data.metrics) {
    markdown += `\n## ${t('Métricas Verificadas', 'Verified Metrics')}\n\n`;
    Object.values(data.metrics).forEach(m => {
      const unit = m.unit ? (/^[^\w\s]/.test(m.unit) ? m.unit : ` ${m.unit}`) : '';
      markdown += `- **${m.value}${unit}** — ${t(m.label_es, m.label_en)} _(${t('Fuente', 'Source')}: ${m.source})_\n`;
    });
  }

  // Write to file
  const filename = `cv-${lang}.md`;
  writeFileSync(filename, markdown);
  console.log(`Generated ${filename}`);
}
