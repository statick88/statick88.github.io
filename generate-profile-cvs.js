import { writeFileSync } from 'fs';
import { profileData } from './src/data/cvData.js';

console.log('Successfully imported profileData');

const t = (es, en, lang) => lang === 'es' ? es : en;

function generateProfileMarkdown(profileKey, lang) {
  const profile = profileData[profileKey];
  const label = profile.label[lang] || profile.label.es;
  
  let markdown = `# ${label}\n\n`;
  
  // Summary
  markdown += `## ${t('Resumen Profesional', 'Professional Summary')}\n\n`;
  markdown += `${profile.summary[lang] || profile.summary.es}\n\n`;
  
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
        markdown += `- **${skill.name}**: ${skill.level}\n`;
      });
      markdown += `\n`;
    }
  });
  
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
