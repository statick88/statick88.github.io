#!/bin/bash
# generate-cvs.sh — Genera CVs PDF con imagen para todos los perfiles
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
IMG="$PROJECT_DIR/me.webp"
OUT_DIR="$PROJECT_DIR/public"
CSS="$PROJECT_DIR/cv-style.css"

mkdir -p "$OUT_DIR"

# Convert me.webp to base64 for embedding
IMG_B64=$(base64 < "$IMG")

cat > "$CSS" << 'CSSEOF'
@page { size: A4; margin: 1.5cm; }
body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.4; }
h1 { font-size: 18pt; margin: 0 0 2pt 0; color: #0e7490; }
h2 { font-size: 11pt; border-bottom: 1.5px solid #0e7490; padding-bottom: 3pt; margin: 10pt 0 5pt 0; color: #0e7490; }
h3 { font-size: 10pt; margin: 6pt 0 2pt 0; }
.header { display: flex; align-items: center; gap: 12pt; margin-bottom: 8pt; }
.header img { width: 60pt; height: 60pt; border-radius: 50%; object-fit: cover; border: 2px solid #0e7490; }
.header-text { flex: 1; }
.header-text p { margin: 1pt 0; font-size: 9pt; color: #555; }
.summary { background: #f0fdfa; padding: 8pt; border-radius: 4pt; border-left: 3px solid #0e7490; margin: 6pt 0; }
.tech-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4pt 12pt; }
.tech-item { font-size: 9pt; }
.tech-item strong { color: #374151; }
ul { margin: 2pt 0; padding-left: 14pt; }
li { margin: 1pt 0; font-size: 9.5pt; }
.exp-header { display: flex; justify-content: space-between; align-items: baseline; }
.exp-header .date { color: #6b7280; font-size: 8.5pt; font-style: italic; }
.lang-toggle { display: flex; gap: 8pt; margin-bottom: 6pt; }
.lang-toggle span { padding: 2pt 6pt; border-radius: 3pt; font-size: 8pt; }
.lang-active { background: #0e7490; color: white; }
CSSEOF

generate_cv() {
  local PROFILE=$1
  local LANG=$2
  local TITLE_ES=$3
  local TITLE_EN=$4

  cat > /tmp/cv-$PROFILE-$LANG.html << HTMLEOF
<!DOCTYPE html>
<html lang="$LANG">
<head>
<meta charset="UTF-8">
<style>$(cat "$CSS")</style>
</head>
<body>
<div class="header">
  <img src="data:image/webp;base64,$IMG_B64" alt="Diego Saavedra">
  <div class="header-text">
    <h1>Diego Medardo Saavedra García</h1>
    <p>$([ "$LANG" = "es" ] && echo "$TITLE_ES" || echo "$TITLE_EN")</p>
    <p>dsaavedra88@gmail.com | +593 980192790 | Loja, Ecuador</p>
    <p>linkedin.com/in/diego-saavedra-developer | github.com/statick88</p>
  </div>
</div>
HTMLEOF

  # Append profile-specific content based on language
  if [ "$PROFILE" = "developer" ]; then
    if [ "$LANG" = "es" ]; then
      cat >> /tmp/cv-$PROFILE-$LANG.html << 'CONTENT'
<div class="summary">
<strong>Resumen:</strong> Desarrollador Full Stack con +10 años de experiencia. Dominio de múltiples stacks (React, Next.js, Python/Django, Node.js, Flutter). Arquitecturas modernas (Clean Architecture, SOLID, TDD) y cloud (AWS, Azure, Vercel).
</div>
<h2>Habilidades Técnicas</h2>
<div class="tech-grid">
<div class="tech-item"><strong>Frontend:</strong> HTML, CSS, JavaScript, TypeScript, React, Next.js, Flutter</div>
<div class="tech-item"><strong>Backend:</strong> Python, Django, Node.js, FastAPI, Express</div>
<div class="tech-item"><strong>Cloud:</strong> AWS, Azure, Vercel, Docker, CI/CD</div>
<div class="tech-item"><strong>Tools:</strong> Git, PostgreSQL, MongoDB, Redis, Selenium</div>
</div>
<h2>Experiencia</h2>
<h3>Docente ABACOM — Cursos de Ciberseguridad y Desarrollo</h3>
<div class="exp-header"><span>12/2021 – Presente</span></div>
<ul><li>Dictado de cursos: Ethical Hacking, Python, Flutter, MicroPython, Servidores Linux</li><li>Evaluación promedio: 93.4/100 (92+ estudiantes)</li><li>Creación de material Quarto: 8 cursos publicados en GitHub Pages</li></ul>
<h3>Codings Academy — Docente de Desarrollo</h3>
<div class="exp-header"><span>02/2024 – 12/2024</span></div>
<ul><li>Cursos de Flutter y desarrollo móvil</li></ul>
<h3>APC — Docente de Programación y Redes</h3>
<div class="exp-header"><span>09/2013 – 12/2022</span></div>
<ul><li>Programación, redes, hardware. +400 alumnos, 9 años.</li></ul>
<h3>ESPE — Docente de Programación</h3>
<div class="exp-header"><span>04/2023 – 10/2024</span></div>
<ul><li>Docente de tiempo parcial. Programación y desarrollo de software.</li></ul>
<h3>ISTJM — Docente de Tecnología</h3>
<div class="exp-header"><span>10/2020 – 03/2022</span></div>
<ul><li>Hardware hacking, OpenWrt, redes.</li></ul>
<h2>Educación</h2>
<ul>
<li><strong>MSc Ciberseguridad</strong> — UCM (2024–2027, en curso)</li>
<li><strong>Magíster Cs. y Tec. Computación</strong> — UTPL (2018–2021)</li>
<li><strong>Lic. Informática Educativa</strong> — UNL (2007–2011)</li>
</ul>
<h2>Certificaciones</h2>
<ul><li>AWS Solutions Architect (Active) | Azure Fundamentals (Active) | Docker Certified (Active)</li></ul>
CONTENT
    else
      cat >> /tmp/cv-$PROFILE-$LANG.html << 'CONTENT'
<div class="summary">
<strong>Summary:</strong> Full Stack Developer with 10+ years of experience. Multiple stacks (React, Next.js, Python/Django, Node.js, Flutter). Modern architectures (Clean Architecture, SOLID, TDD) and cloud (AWS, Azure, Vercel).
</div>
<h2>Technical Skills</h2>
<div class="tech-grid">
<div class="tech-item"><strong>Frontend:</strong> HTML, CSS, JavaScript, TypeScript, React, Next.js, Flutter</div>
<div class="tech-item"><strong>Backend:</strong> Python, Django, Node.js, FastAPI, Express</div>
<div class="tech-item"><strong>Cloud:</strong> AWS, Azure, Vercel, Docker, CI/CD</div>
<div class="tech-item"><strong>Tools:</strong> Git, PostgreSQL, MongoDB, Redis, Selenium</div>
</div>
<h2>Experience</h2>
<h3>ABACOM — Cybersecurity & Development Instructor</h3>
<div class="exp-header"><span>Dec 2021 – Present</span></div>
<ul><li>Courses: Ethical Hacking, Python, Flutter, MicroPython, Linux Servers</li><li>Average evaluation: 93.4/100 (92+ students)</li><li>Quarto material: 8 courses published on GitHub Pages</li></ul>
<h3>Codings Academy — Development Instructor</h3>
<div class="exp-header"><span>Feb 2024 – Dec 2024</span></div>
<ul><li>Flutter and mobile development courses</li></ul>
<h3>APC — Programming & Networks Instructor</h3>
<div class="exp-header"><span>Sep 2013 – Dec 2022</span></div>
<ul><li>Programming, networks, hardware. 400+ students, 9 years.</li></ul>
<h3>ESPE — Programming Instructor</h3>
<div class="exp-header"><span>Apr 2023 – Oct 2024</span></div>
<ul><li>Part-time. Software development and programming.</li></ul>
<h3>ISTJM — Technology Instructor</h3>
<div class="exp-header"><span>Oct 2020 – Mar 2022</span></div>
<ul><li>Hardware hacking, OpenWrt, networks.</li></ul>
<h2>Education</h2>
<ul>
<li><strong>MSc Cybersecurity</strong> — UCM (2024–2027, in progress)</li>
<li><strong>MSc Computer Science</strong> — UTPL (2018–2021)</li>
<li><strong>BSc Educational Informatics</strong> — UNL (2007–2011)</li>
</ul>
<h2>Certifications</h2>
<ul><li>AWS Solutions Architect (Active) | Azure Fundamentals (Active) | Docker Certified (Active)</li></ul>
CONTENT
    fi
  elif [ "$PROFILE" = "hacker" ]; then
    if [ "$LANG" = "es" ]; then
      cat >> /tmp/cv-$PROFILE-$LANG.html << 'CONTENT'
<div class="summary">
<strong>Resumen:</strong> Investigador de seguridad informática con +10 años de experiencia en pentesting, Bug Bounty y ciberseguridad ofensiva. Especializado en análisis de vulnerabilidades, redes oscuros y seguridad ofensiva.
</div>
<h2>Habilidades Técnicas</h2>
<div class="tech-grid">
<div class="tech-item"><strong>Offensive:</strong> Pentesting, Bug Bounty, Metasploit, Burp Suite</div>
<div class="tech-item"><strong>Networks:</strong> Nmap, Wireshark, Aircrack-ng, Kali Linux</div>
<div class="tech-item"><strong>Web:</strong> SQL Injection, XSS, SSRF, OWASP Top 10</div>
<div class="tech-item"><strong>Tools:</strong> Frida, Ghidra, IDA Pro, Reverse Engineering</div>
</div>
<h2>Experiencia</h2>
<h3>Investigador de Seguridad — Bug Bounty</h3>
<div class="exp-header"><span>2020 – Presente</span></div>
<ul><li>Programas: HackerOne, Bugcrowd</li><li>Especialización: Web Application Security, API Testing</li></ul>
<h3>Docente ABACOM — Cursos de Ethical Hacking</h3>
<div class="exp-header"><span>12/2021 – Presente</span></div>
<ul><li>Ethical Hacking 2026: pentesting, ciberseguridad ofensiva</li><li>Desarrollo de Software Seguro: secure coding, OWASP</li></ul>
<h2>Educación</h2>
<ul>
<li><strong>MSc Ciberseguridad</strong> — UCM (2024–2027, en curso)</li>
<li><strong>Magíster Cs. y Tec. Computación</strong> — UTPL (2018–2021)</li>
</ul>
CONTENT
    else
      cat >> /tmp/cv-$PROFILE-$LANG.html << 'CONTENT'
<div class="summary">
<strong>Summary:</strong> Security researcher with 10+ years in pentesting, Bug Bounty, and offensive cybersecurity. Specialized in vulnerability analysis, dark networks, and offensive security.
</div>
<h2>Technical Skills</h2>
<div class="tech-grid">
<div class="tech-item"><strong>Offensive:</strong> Pentesting, Bug Bounty, Metasploit, Burp Suite</div>
<div class="tech-item"><strong>Networks:</strong> Nmap, Wireshark, Aircrack-ng, Kali Linux</div>
<div class="tech-item"><strong>Web:</strong> SQL Injection, XSS, SSRF, OWASP Top 10</div>
<div class="tech-item"><strong>Tools:</strong> Frida, Ghidra, IDA Pro, Reverse Engineering</div>
</div>
<h2>Experience</h2>
<h3>Security Researcher — Bug Bounty</h3>
<div class="exp-header"><span>2020 – Present</span></div>
<ul><li>Programs: HackerOne, Bugcrowd</li><li>Focus: Web Application Security, API Testing</li></ul>
<h3>ABACOM Instructor — Ethical Hacking Courses</h3>
<div class="exp-header"><span>Dec 2021 – Present</span></div>
<ul><li>Ethical Hacking 2026: pentesting, offensive security</li><li>Secure Software Development: secure coding, OWASP</li></ul>
<h2>Education</h2>
<ul>
<li><strong>MSc Cybersecurity</strong> — UCM (2024–2027, in progress)</li>
<li><strong>MSc Computer Science</strong> — UTPL (2018–2021)</li>
</ul>
CONTENT
    fi
  elif [ "$PROFILE" = "research" ]; then
    if [ "$LANG" = "es" ]; then
      cat >> /tmp/cv-$PROFILE-$LANG.html << 'CONTENT'
<div class="summary">
<strong>Resumen:</strong> Investigador en ciberseguridad e inteligencia artificial aplicada a educación. Publicaciones en revistas científicas. Líneas de investigación: Deep Learning, monitoreo de atención, detección de TDAH.
</div>
<h2>Investigación</h2>
<h3>Publicaciones</h3>
<ul>
<li><strong>Evaluación de Deep Learning para detectar TDAH y síndrome de Asperger</strong> — Rev. Investigación Multidisiplinaria Iberoamericana, 2024 (1 cita)</li>
<li><strong>Modelo para detectar atención basado en RNC</strong> — Tesis Maestría UTPL, 2021</li>
</ul>
<h2>Habilidades</h2>
<div class="tech-grid">
<div class="tech-item"><strong>ML/DL:</strong> PyTorch, TensorFlow, CNN, YOLO</div>
<div class="tech-item"><strong>Data:</strong> Python, Jupyter, Pandas, OpenCV</div>
<div class="tech-item"><strong>Research:</strong> IEEE, Scopus, PRISMA, Systematic Mapping</div>
<div class="tech-item"><strong>Education:</strong> ABACOM, Codings, UTPL, ESPE</div>
</div>
<h2>Experiencia Docente</h2>
<ul><li>ABACOM: 200+ horas, 93.4/100 evaluación</li><li>ESPE, UTPL, ISTJM, UIDE, Codings Academy</li></ul>
<h2>Educación</h2>
<ul>
<li><strong>MSc Ciberseguridad</strong> — UCM (2024–2027)</li>
<li><strong>Magíster Cs. y Tec. Computación</strong> — UTPL (2018–2021)</li>
</ul>
CONTENT
    else
      cat >> /tmp/cv-$PROFILE-$LANG.html << 'CONTENT'
<div class="summary">
<strong>Summary:</strong> Researcher in cybersecurity and AI applied to education. Scientific publications. Research lines: Deep Learning, attention monitoring, ADHD detection.
</div>
<h2>Research</h2>
<h3>Publications</h3>
<ul>
<li><strong>Deep Learning Evaluation for ADHD and Asperger Detection</strong> — Multidisciplinary Iberoamerican Research Journal, 2024 (1 citation)</li>
<li><strong>CNN-based Student Attention Detection Model</strong> — MSc Thesis UTPL, 2021</li>
</ul>
<h2>Skills</h2>
<div class="tech-grid">
<div class="tech-item"><strong>ML/DL:</strong> PyTorch, TensorFlow, CNN, YOLO</div>
<div class="tech-item"><strong>Data:</strong> Python, Jupyter, Pandas, OpenCV</div>
<div class="tech-item"><strong>Research:</strong> IEEE, Scopus, PRISMA, Systematic Mapping</div>
<div class="tech-item"><strong>Education:</strong> ABACOM, Codings, UTPL, ESPE</div>
</div>
<h2>Teaching Experience</h2>
<ul><li>ABACOM: 200+ hours, 93.4/100 evaluation</li><li>ESPE, UTPL, ISTJM, UIDE, Codings Academy</li></ul>
<h2>Education</h2>
<ul>
<li><strong>MSc Cybersecurity</strong> — UCM (2024–2027)</li>
<li><strong>MSc Computer Science</strong> — UTPL (2018–2021)</li>
</ul>
CONTENT
    fi
  elif [ "$PROFILE" = "docente-facilitador" ]; then
    if [ "$LANG" = "es" ]; then
      cat >> /tmp/cv-$PROFILE-$LANG.html << 'CONTENT'
<div class="summary">
<strong>Resumen:</strong> Docente Facilitador con +10 años de experiencia en educación superior. Especialista en creación de cursos, diseño curricular y metodologías activas. 200+ horas dictadas, 93.4/100 evaluación promedio.
</div>
<h2>Habilidades Docentes</h2>
<div class="tech-grid">
<div class="tech-item"><strong>Metodologías:</strong> ABP, Aprendizaje Activo, Flipped Classroom</div>
<div class="tech-item"><strong>Herramientas:</strong> Quarto, GitHub Pages, Docker, LMS</div>
<div class="tech-item"><strong>Cursos:</strong> 13 cursos creados (8 Quarto, 3 HTML, 2 Labs)</div>
<div class="tech-item"><strong>Evaluación:</strong> 93.4/100 promedio (92+ estudiantes)</div>
</div>
<h2>Experiencia Docente</h2>
<h3>ABACOM — Cursos de Ciberseguridad y Desarrollo</h3>
<div class="exp-header"><span>12/2021 – Presente</span></div>
<ul><li>Ethical Hacking, Python, Flutter, MicroPython, Servidores Linux</li><li>Creación de material: 8 cursos Quarto publicados</li></ul>
<h3>Codings Academy — Docente de Desarrollo</h3>
<div class="exp-header"><span>02/2024 – 12/2024</span></div>
<ul><li>Flutter y desarrollo móvil</li></ul>
<h3>APC — Docente de Programación y Redes</h3>
<div class="exp-header"><span>09/2013 – 12/2022</span></div>
<ul><li>9 años, +400 alumnos, programación y redes</li></ul>
<h3>ESPE, ISTJM, UIDE</h3>
<div class="exp-header"><span>2020 – 2024</span></div>
<ul><li>Docente de tiempo parcial en diversas instituciones</li></ul>
<h2>Educación</h2>
<ul>
<li><strong>MSc Ciberseguridad</strong> — UCM (2024–2027)</li>
<li><strong>Magíster Cs. y Tec. Computación</strong> — UTPL (2018–2021)</li>
<li><strong>Lic. Informática Educativa</strong> — UNL (2007–2011)</li>
</ul>
<h2>Certificaciones</h2>
<ul><li>AWS Solutions Architect | Azure Fundamentals | Docker Certified</li></ul>
CONTENT
    else
      cat >> /tmp/cv-$PROFILE-$LANG.html << 'CONTENT'
<div class="summary">
<strong>Summary:</strong> Teaching Facilitator with 10+ years in higher education. Specialist in course creation, curriculum design, and active methodologies. 200+ hours taught, 93.4/100 average evaluation.
</div>
<h2>Teaching Skills</h2>
<div class="tech-grid">
<div class="tech-item"><strong>Methods:</strong> PBL, Active Learning, Flipped Classroom</div>
<div class="tech-item"><strong>Tools:</strong> Quarto, GitHub Pages, Docker, LMS</div>
<div class="tech-item"><strong>Courses:</strong> 13 courses created (8 Quarto, 3 HTML, 2 Labs)</div>
<div class="tech-item"><strong>Evaluation:</strong> 93.4/100 average (92+ students)</div>
</div>
<h2>Teaching Experience</h2>
<h3>ABACOM — Cybersecurity & Development Courses</h3>
<div class="exp-header"><span>Dec 2021 – Present</span></div>
<ul><li>Ethical Hacking, Python, Flutter, MicroPython, Linux Servers</li><li>Course creation: 8 Quarto courses published</li></ul>
<h3>Codings Academy — Development Instructor</h3>
<div class="exp-header"><span>Feb 2024 – Dec 2024</span></div>
<ul><li>Flutter and mobile development</li></ul>
<h3>APC — Programming & Networks Instructor</h3>
<div class="exp-header"><span>Sep 2013 – Dec 2022</span></div>
<ul><li>9 years, 400+ students, programming and networks</li></ul>
<h3>ESPE, ISTJM, UIDE</h3>
<div class="exp-header"><span>2020 – 2024</span></div>
<ul><li>Part-time instructor at various institutions</li></ul>
<h2>Education</h2>
<ul>
<li><strong>MSc Cybersecurity</strong> — UCM (2024–2027)</li>
<li><strong>MSc Computer Science</strong> — UTPL (2018–2021)</li>
<li><strong>BSc Educational Informatics</strong> — UNL (2007–2011)</li>
</ul>
<h2>Certifications</h2>
<ul><li>AWS Solutions Architect | Azure Fundamentals | Docker Certified</li></ul>
CONTENT
    fi
  fi

  echo "</body></html>" >> /tmp/cv-$PROFILE-$LANG.html

  # Generate PDF with weasyprint
  weasyprint /tmp/cv-$PROFILE-$LANG.html "$OUT_DIR/cv-$PROFILE-$LANG.pdf"
  echo "✅ cv-$PROFILE-$LANG.pdf"
}

# Generate all profiles
generate_cv "developer" "es" "Desarrollador Full Stack | Full Stack Engineer" "Full Stack Engineer"
generate_cv "developer" "en" "Desarrollador Full Stack | Full Stack Engineer" "Full Stack Engineer"
generate_cv "hacker" "es" "Investigador de Seguridad | Security Researcher" "Security Researcher"
generate_cv "hacker" "en" "Investigador de Seguridad | Security Researcher" "Security Researcher"
generate_cv "research" "es" "Investigador Científico | Researcher" "Researcher"
generate_cv "research" "en" "Investigador Científico | Researcher" "Researcher"
generate_cv "docente-facilitador" "es" "Docente Facilitador | Teaching Facilitator" "Teaching Facilitator"
generate_cv "docente-facilitador" "en" "Docente Facilitador | Teaching Facilitator" "Teaching Facilitator"

echo ""
echo "📁 PDFs generados en: $OUT_DIR"
ls -lh "$OUT_DIR"/cv-*.pdf
