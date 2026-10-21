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

function generateMarkdown(data, lang) {
  const t = (es, en) => lang === 'es' ? es : en;

  let markdown = `# ${data.basics.name}\n\n`;

  // Basics
  markdown += `## ${t('Resumen Profesional', 'Professional Summary')}\n\n`;
  markdown += `${t(data.basics.label.es, data.basics.label.en)}\n\n`;

  // Contact info
  markdown += `### ${t('Información de Contacto', 'Contact Information')}\n\n`;
  markdown += `- **${t('Correo', 'Email')}:** ${data.basics.email}\n`;
  markdown += `- **${t('Teléfono', 'Phone')}:** ${data.basics.phone}\n`;
  markdown += `- **${t('Ubicación', 'Location')}:** ${data.basics.location.city}, ${data.basics.location.region}, ${data.basics.location.countryCode}\n`;
  markdown += `- **${t('Perfiles', 'Profiles')}:**\n`;
  data.basics.profiles.forEach(profile => {
    markdown += `  - [${profile.network} — ${profile.url.replace(/^https?:\/\//, '')}](${profile.url})\n`;
  });
  markdown += `\n`;

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
    "devops", "databases", "security", "architecture", "teaching", "tools", "ai", "research"
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
    "research": t('Investigación', 'Research')
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
      markdown += `- **${m.value}${m.unit || ''}** — ${t(m.label_es, m.label_en)} _(${t('Fuente', 'Source')}: ${m.source})_\n`;
    });
  }

  // Write to file
  const filename = `cv-${lang}.md`;
  writeFileSync(filename, markdown);
  console.log(`Generated ${filename}`);
}
