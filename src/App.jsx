import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cvData } from './data/cvData'
import Particles from './components/Particles'
import LanguageToggle from './components/LanguageToggle'
import ThemeToggle from './components/ThemeToggle'
import ProfileSelector from './components/ProfileSelector'
import Section from './components/Section'
import Timeline from './components/Timeline'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certifications from './components/Certifications'

function App() {
  const [language, setLanguage] = useState('es')
  const [theme, setTheme] = useState('dark')
  const [activeSection, setActiveSection] = useState('summary')
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeProfile, setActiveProfile] = useState(null) // Perfil seleccionado
  const [showNav, setShowNav] = useState(true) // Controlar visibilidad de nav
  const contentRef = useRef(null)

  const t = (es, en) => language === 'es' ? es : en

  // Resumen según el perfil seleccionado
  const getSummary = () => {
    const summaries = {
      statick: {
        es: "Profesional de TI y Desarrollador Full Stack con más de 10 años de experiencia construyendo aplicaciones web y APIs. Combino ingeniería y docencia: diseño e imparto bootcamps de Desarrollo Web, Data Science y Desarrollo Móvil. He colaborados con ESPE, UIDE, IST Juan Montalvo, Abacom y Codings Academy.",
        en: "IT professional and Full Stack Developer with 10+ years of experience building web applications and APIs. I combine engineering and teaching: I design and deliver bootcamps in Web Development, Data Science, and Mobile Development."
      },
      developer: {
        es: "Desarrollador Full Stack especializado en React, Node.js, TypeScript y arquitecturas modernas. Passionate about clean code, SOLID principles y mejores prácticas de desarrollo. Experiencia en proyectos de alta escala y optimización de rendimiento.",
        en: "Full Stack developer specialized in React, Node.js, TypeScript and modern architectures. Passionate about clean code, SOLID principles and development best practices."
      },
      facilitator: {
        es: "Facilitador y docente con más de 6 años de experiencia en educación tecnológica. He capacitado a más de 500 estudiantes en bootcamps intensivos de Desarrollo Web, Data Science y Móvil. Metodologías ágiles y aprendizaje basado en proyectos.",
        en: "Facilitator and teacher with 6+ years of experience in technology education. I've trained 500+ students in intensive bootcamps. Agile methodologies and project-based learning."
      },
      researcher: {
        es: "Investigador en ciberseguridad y aprendizaje automático. Estudiante de MSc en Ciberseguridad Defensiva y Ofensiva en UCM. Interesse en threat modeling, pentesting y AI security. Participación en conferences y publicaciones académicas.",
        en: "Researcher in cybersecurity and machine learning. MSc student in Defensive and Offensive Cybersecurity at UCM. Interest in threat modeling, pentesting and AI security."
      },
      hacker: {
        es: "Ethical Hacker y security researcher con enfoque en pentesting, vulnerability assessment y secure coding. Conocimientos en OWASP, CVE analysis, penetration testing methodologies y defense strategies.",
        en: "Ethical Hacker and security researcher with focus on pentesting, vulnerability assessment and secure coding. Knowledge in OWASP, CVE analysis and defense strategies."
      },
      student: {
        es: "Estudiante de MSc en Ciberseguridad en la Universidad Complutense de Madrid. Buscando oportunidades para aplicar conocimientos en proyectos reales. backgrounds en desarrollo web y educación tecnológica.",
        en: "MSc Cybersecurity student at Universidad Complutense de Madrid. Seeking opportunities to apply knowledge in real projects. Background in web development and tech education."
      }
    }
    
    if (activeProfile && summaries[activeProfile.id]) {
      return summaries[activeProfile.id]
    }
    return summaries.statick // Default
  }

  // Skills según el perfil seleccionado
  const getSkillsByProfile = () => {
    const allSkills = cvData.skills
    
    const skillsByProfile = {
      statick: allSkills, // Todos los skills
      developer: allSkills.filter(s => 
        ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Docker', 'PostgreSQL', 'MongoDB'].includes(s.name)
      ),
      facilitator: allSkills.filter(s => 
        ['Python', 'JavaScript', 'HTML', 'CSS', 'Flutter', 'Angular'].includes(s.name)
      ),
      researcher: [
        { name: "Python", level: "master" },
        { name: "Machine Learning", level: "master" },
        { name: "Deep Learning", level: "advanced" },
        { name: "TensorFlow", level: "advanced" },
        { name: "PyTorch", level: "advanced" },
        { name: "Keras", level: "advanced" },
        { name: "Scikit-learn", level: "advanced" },
        { name: "Pandas", level: "master" },
        { name: "NumPy", level: "master" },
        { name: "Statistical Analysis", level: "advanced" },
        { name: "Data Visualization", level: "advanced" },
        { name: "NLP", level: "intermediate" },
        { name: "Computer Vision", level: "intermediate" },
        { name: "Cybersecurity", level: "advanced" },
        { name: "Network Security", level: "advanced" }
      ],
      hacker: [
        { name: "Penetration Testing", level: "master" },
        { name: "Burp Suite", level: "master" },
        { name: "Nmap", level: "master" },
        { name: "Metasploit", level: "advanced" },
        { name: "Wireshark", level: "advanced" },
        { name: "SQL Injection", level: "master" },
        { name: "XSS", level: "master" },
        { name: "CSRF", level: "advanced" },
        { name: "SSRF", level: "advanced" },
        { name: "IDOR", level: "advanced" },
        { name: "RCE", level: "advanced" },
        { name: "SSTI", level: "advanced" },
        { name: "CORS", level: "advanced" },
        { name: "OWASP Top 10", level: "master" },
        { name: "Burp Suite Pro", level: "advanced" },
        { name: "Nikto", level: "intermediate" },
        { name: "Gobuster", level: "intermediate" },
        { name: "Python (Security)", level: "master" },
        { name: "Bash Scripting", level: "advanced" },
        { name: "Linux", level: "master" }
      ],
      student: [
        { name: "Python", level: "advanced" },
        { name: "JavaScript", level: "intermediate" },
        { name: "HTML/CSS", level: "intermediate" },
        { name: "Cybersecurity Basics", level: "intermediate" },
        { name: "Network Fundamentals", level: "intermediate" },
        { name: "Linux Basics", level: "intermediate" },
        { name: "Git", level: "intermediate" },
        { name: "Docker", level: "basic" },
        { name: "SQL Basics", level: "intermediate" },
        { name: "Security Tools", level: "basic" }
      ]
    }
    
    if (activeProfile && skillsByProfile[activeProfile.id]) {
      return skillsByProfile[activeProfile.id]
    }
    return allSkills // Default
  }

  // Handle scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
      setMobileMenuOpen(false) // Cerrar menú móvil
      
      // Ocultar navegación después del scroll
      setTimeout(() => {
        setShowNav(false)
      }, 400)
    }
  }

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 150)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Handle scroll spy for navigation
  useEffect(() => {
    const sections = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications']
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [isLoaded])

  const navItems = [
    { id: 'summary', label: t('Resumen', 'Summary'), icon: '📋', aria: t('Ir a Resumen', 'Go to Summary') },
    { id: 'experience', label: t('Experiencia', 'Experience'), icon: '💼', aria: t('Ir a Experiencia', 'Go to Experience') },
    { id: 'education', label: t('Educación', 'Education'), icon: '🎓', aria: t('Ir a Educación', 'Go to Education') },
    { id: 'skills', label: t('Habilidades', 'Skills'), icon: '⚡', aria: t('Ir a Habilidades', 'Go to Skills') },
    { id: 'projects', label: t('Proyectos', 'Projects'), icon: '🚀', aria: t('Ir a Proyectos', 'Go to Projects') },
    { id: 'certifications', label: t('Certificaciones', 'Certifications'), icon: '🏆', aria: t('Ir a Certificaciones', 'Go to Certifications') }
  ]

  // Keyboard navigation handler
  const handleKeyNav = (e, currentIndex, direction) => {
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < navItems.length) {
      scrollToSection(navItems[newIndex].id)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Particles Background */}
      <Particles />

      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 no-print">
        <LanguageToggle language={language} setLanguage={setLanguage} />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      {/* Profile Selector */}
      <ProfileSelector t={t} activeProfile={activeProfile} setActiveProfile={setActiveProfile} />

      {/* Mobile Menu Button - Enhanced Touch Target */}
      <motion.button 
        className="fixed bottom-6 right-6 z-50 lg:hidden w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 border-0 rounded-full text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all no-print flex items-center justify-center"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        onKeyDown={(e) => e.key === 'Enter' && setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? t('Cerrar menú', 'Close menu') : t('Abrir menú', 'Open menu')}
        aria-expanded={mobileMenuOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        tabIndex={0}
      >
        <motion.svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </motion.svg>
      </motion.button>

      {/* Main Content */}
      <main 
        ref={contentRef}
        className={`relative z-10 max-w-4xl mx-auto px-4 py-8 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
          id="hero"
        >
          <div className="relative inline-block mb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/30 neon-border"
            >
              <img 
                src={cvData.basics.image} 
                alt={cvData.basics.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"
            ></motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3 gradient-text"
          >
            {cvData.basics.name}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-400 mb-4"
          >
            {t(cvData.basics.label.es, cvData.basics.label.en)}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 text-gray-500 mb-6"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {cvData.basics.location.city}, {cvData.basics.location.region}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {cvData.basics.email}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.716 3 6a11.04 11.04 0 015.516-5.516L10.283 3.79a1 1 0 01.502-1.21L15.121 2.05a1 1 0 01.949.684H19a2 2 0 012 2v1" />
              </svg>
              {cvData.basics.phone}
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-3"
          >
            {cvData.basics.profiles.map((profile, i) => (
              <motion.a
                key={profile.network}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 text-cyan-400 font-medium"
              >
                {profile.network}
              </motion.a>
            ))}
          </motion.div>
        </motion.section>

        {/* Navigation - Desktop */}
        <AnimatePresence>
          {showNav ? (
            <motion.nav 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:flex flex-wrap justify-center gap-2 mb-8 no-print sticky top-4 z-40 py-2"
              role="navigation"
              aria-label="Navegación principal"
            >
              {navItems.map((item, i) => {
                const isActive = activeSection === item.id
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && scrollToSection(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={item.aria}
                    tabIndex={0}
                    className={`px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2.5 font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-gray-300'
                    }`}
                  >
                    <motion.span
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                      />
                    )}
                  </motion.button>
                )
              })}
            </motion.nav>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNav(true)}
              className="hidden lg:flex mx-auto mb-4 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all no-print items-center gap-2"
              aria-label="Mostrar navegación"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>{t('Mostrar menú', 'Show menu')}</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mobile Navigation - Enhanced */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden bg-black/90 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label={t('Menú de navegación', 'Navigation menu')}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-gray-900 to-black border-r border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="pt-20 pb-6 px-6 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white">{t('Navegación', 'Navigation')}</h2>
                  <p className="text-gray-500 text-sm mt-1">{t('Selecciona una sección', 'Select a section')}</p>
                </div>
                
                {/* Menu Items */}
                <nav className="p-4 space-y-2" role="navigation">
                  {navItems.map((item, index) => {
                    const isActive = activeSection === item.id
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-full text-left px-5 py-4 rounded-xl transition-all flex items-center gap-4 ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'text-gray-300 hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.span 
                            layoutId="mobileActive"
                            className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                  <p className="text-gray-500 text-xs text-center">
                    {t('Navegación rápida', 'Quick navigation')} • CV Diego
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Summary */}
            <div id="summary">
              <Section title={t('Resumen Profesional', 'Professional Summary')}>
                {/* Perfil badge */}
                {activeProfile && (
                  <div className="mb-4 flex items-center gap-2">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: activeProfile.color + '20', color: activeProfile.color }}
                    >
                      {activeProfile.icon} {activeProfile.label}
                    </span>
                  </div>
                )}
                
                <p className="text-gray-300 leading-relaxed text-lg">
                  {t(getSummary().es, getSummary().en)}
                </p>
                
                {/* Soft Skills */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {t('Habilidades Blandas', 'Soft Skills')}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {cvData.softSkills.map((skill, i) => (
                      <motion.span 
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300"
                      >
                        {t(skill.es, skill.en)}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {t('Idiomas', 'Languages')}
                  </h3>
                  <div className="flex flex-wrap gap-6">
                    {cvData.languages.map((lang, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <span className="text-2xl">🌐</span>
                        <div>
                          <p className="text-white font-medium">{lang.language}</p>
                          <p className="text-cyan-400 text-sm">{t(lang.fluency.es, lang.fluency.en)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Section>
            </div>

            {/* Experience */}
            <div id="experience" className="mt-8">
              <Section title={t('Experiencia Laboral', 'Work Experience')}>
                <Timeline items={cvData.work} t={t} type="work" />
              </Section>
            </div>

            {/* Education */}
            <div id="education" className="mt-8">
              <Section title={t('Educación', 'Education')}>
                <Timeline items={cvData.education} t={t} type="education" />
              </Section>
            </div>

            {/* Skills */}
            <div id="skills" className="mt-8">
              <Section title={t('Habilidades Técnicas', 'Technical Skills')}>
                <Skills skills={cvData.skills} />
              </Section>
            </div>

            {/* Projects */}
            <div id="projects" className="mt-8">
              <Section title={t('Proyectos Destacados', 'Featured Projects')}>
                <Projects projects={cvData.projects} t={t} />
              </Section>
            </div>

            {/* Certifications */}
            <div id="certifications" className="mt-8">
              <Section title={t('Certificaciones', 'Certifications')}>
                <Certifications certifications={cvData.certifications} t={t} />
              </Section>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-gray-500 py-8 border-t border-white/10"
        >
          <p className="text-lg text-white mb-2">© {new Date().getFullYear()} {cvData.basics.name}</p>
          <p className="text-sm">{t('Desarrollador Full Stack & Facilitador', 'Full Stack Developer & Facilitator')}</p>
          <p className="text-xs mt-4 text-gray-600">Loja, Ecuador</p>
        </motion.footer>
      </main>
    </div>
  )
}

export default App