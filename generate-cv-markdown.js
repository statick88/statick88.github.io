import { writeFileSync } from 'fs';
import { cvData } from './src/data/cvData.js';

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
    markdown += `  - [${profile.network}](${profile.url})\n`;
  });
  markdown += `\n`;

  // Work Experience
  markdown += `## ${t('Experiencia Laboral', 'Work Experience')}\n\n`;
  data.work.forEach(job => {
    markdown += `### ${job.position[lang] || job.position.es} at ${job.name}\n`;
    markdown += `${job.url}\n\n`;
    markdown += `${job.startDate} ${job.endDate ? `- ${job.endDate}` : t('Presente', 'Present')}\n\n`;
    markdown += `${job.summary[lang] || job.summary.es}\n\n`;
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
      markdown += `### ${categoryNames[category]}\n\n`;
      skillsByCategory[category].forEach(skill => {
        markdown += `- **${skill.name}**: ${skill.level}\n`;
      });
      markdown += `\n`;
    }
  });

  // Projects
  markdown += `## ${t('Proyectos Destacados', 'Featured Projects')}\n\n`;
  data.projects.forEach(project => {
    markdown += `### ${project.name}\n`;
    markdown += `${project.description[lang] || project.description.es}\n\n`;
    markdown += `**${t('Tecnologías', 'Technologies')}:** ${(project.highlights[lang] || project.highlights.en).join(', ')}\n\n`;
    if (project.url) {
      markdown += `[${t('Ver Proyecto', 'View Project')}](${project.url})\n\n`;
    }
    if (project.github) {
      markdown += `[${t('Código Fuente', 'Source Code')}](${project.github})\n\n`;
    }
  });

  // Certifications
  markdown += `## ${t('Certificaciones', 'Certifications')}\n\n`;
  data.certifications.forEach(cert => {
    markdown += `- **${cert.name}** - ${cert.issuer} (${cert.status === 'active' ? t('Activo', 'Active') : t('En Progreso', 'In Progress')})\n`;
  });
  markdown += `\n`;

  // Soft Skills and Languages
  markdown += `### ${t('Habilidades Blandas y Idiomas', 'Soft Skills and Languages')}\n\n`;
  markdown += `#### ${t('Habilidades Blandas', 'Soft Skills')}\n`;
  data.softSkills.forEach(skill => {
    markdown += `- ${skill[lang] || skill.es}\n`;
  });
  markdown += `\n`;
  markdown += `#### ${t('Idiomas', 'Languages')}\n`;
  data.languages.forEach(langObj => {
    markdown += `- ${langObj.language}: ${langObj.fluency[lang] || langObj.fluency.es}\n`;
  });

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
