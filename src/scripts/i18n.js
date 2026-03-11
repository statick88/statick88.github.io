const translations = {
  es: {
    education: {
      inProgress: "En proceso"
    },
    section: {
      about: "Sobre mí",
      experience: "Experiencia laboral",
      education: "Educación",
      portfolio: "Portafolio",
      trainingsProvided: "Capacitaciones que brindo",
      certifications: "Certificaciones",
      courses: "Cursos",
      conferences: "Conferencias",
      publications: "Publicaciones Científicas",
      skills: "Habilidades"
    },
    about: {
      summary: "Profesional de TI y Desarrollador Full Stack con más de 10 años de experiencia construyendo aplicaciones web y APIs."
    },
    portfolio: {
      active: "Activo"
    },
    hero: {
      name: "Diego Medardo Saavedra García",
      label: "Desarrollador Full Stack con más de 10 años de experiencia. Facilitador de bootcamps y cursos en Desarrollo Web, Data Science y Desarrollo Móvil.",
      location: "Loja - Loja, Ecuador",
      printInfo: "dsaavedra88@gmail.com • +593 980192790 • https://www.linkedin.com/in/diego-saavedra-developer/"
    },
    hotkeypad: {
      footer: 'Pulsa <kbd>Cmd</kbd> + <kbd>K</kbd> para abrir la paleta de comandos.',
      placeholder: "Buscar comando"
    },
    academy: {
      text: "Academia"
    },
    lab: {
      text: "Lab"
    },
    ebook: {
      text: "Ebooks"
    },
    coffee: {
      text: "Café"
    }
  },
  en: {
    education: {
      inProgress: "In progress"
    },
    section: {
      about: "About Me",
      experience: "Work Experience",
      education: "Education",
      portfolio: "Portfolio",
      trainingsProvided: "Trainings I Deliver",
      certifications: "Certifications",
      courses: "Courses",
      conferences: "Conferences",
      publications: "Scientific Publications",
      skills: "Skills"
    },
    about: {
      summary: "IT professional and Full Stack Developer with 10+ years of experience building web applications and APIs."
    },
    portfolio: {
      active: "Active"
    },
    hero: {
      name: "Diego Medardo Saavedra García",
      label: "Full Stack Developer with 10+ years of experience. Bootcamp and course facilitator in Web Development, Data Science, and Mobile Development.",
      location: "Loja - Loja, Ecuador",
      printInfo: "dsaavedra88@gmail.com • +593 980192790 • https://www.linkedin.com/in/diego-saavedra-developer/"
    },
    hotkeypad: {
      footer: 'Press <kbd>Cmd</kbd> + <kbd>K</kbd> to open the command palette.',
      placeholder: "Search command"
    },
    academy: {
      text: "Academy"
    },
    lab: {
      text: "Lab"
    },
    ebook: {
      text: "Ebooks"
    },
    coffee: {
      text: "Coffee"
    }
  }
};

function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return current[key];
    }
    return undefined;
  }, obj);
}

function getTranslation(value, lang) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map(item => getTranslation(item, lang));
    }
    if ('es' in value || 'en' in value) {
      return value[lang] || value.es || value.en || JSON.stringify(value);
    }
    return JSON.stringify(value);
  }
  return value;
}

function updateContent(lang) {
  const t = translations[lang];
  const cvData = window.cvData || {};
  
  if (!t) return;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    
    let value;
    
    if (key.startsWith('cv.')) {
      const cvPath = key.substring(3);
      const cvValue = getNestedValue(cvData, cvPath);
      value = getTranslation(cvValue, lang);
    } else {
      value = getNestedValue(t, key);
    }
    
    if (value !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    }
  });
  
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    if (!key) return;
    
    let value;
    
    if (key.startsWith('cv.')) {
      const cvPath = key.substring(3);
      const cvValue = getNestedValue(cvData, cvPath);
      value = getTranslation(cvValue, lang);
    } else {
      value = getNestedValue(t, key);
    }
    
    if (value !== undefined && typeof value !== 'object') {
      el.textContent = value;
    }
  });
}

function initI18n() {
  const lang = document.documentElement.getAttribute('lang') || 'es';
  
  function doUpdate() {
    try {
      updateContent(lang);
    } catch (e) {
      console.error('i18n updateContent error:', e.message, e.stack);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doUpdate, { once: true });
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(doUpdate);
    });
  }

  window.addEventListener('langchange', (event) => {
    try {
      updateContent(event.detail.lang);
    } catch (e) {
      console.error('i18n langchange error:', e.message, e.stack);
    }
  });
}

initI18n();