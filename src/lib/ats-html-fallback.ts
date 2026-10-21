/**
 * src/lib/ats-html-fallback.ts — el HTML que ve un ATS.
 *
 * El sitio es una SPA: sin JavaScript, el HTML servido no dice quién es Diego.
 * Un ATS (o cualquier lector sin JS) lee un documento vacío. Este módulo
 * construye un bloque `<noscript>` con el CV legible — nombre, contacto
 * literal, resumen, experiencia, servicios, referencias, habilidades,
 * certificaciones y los enlaces a los PDF — **desde los datos**, de modo que
 * el bloque no puede afirmar nada que los datos no digan.
 *
 * Va dentro de `<noscript>`: con JavaScript activo, un humano no lo ve nunca;
 * sin JavaScript, es la hoja completa.
 */

export interface AtsFallbackData {
  profile?: {
    name?: string
    role?: { es?: string; en?: string } | string
    summary?: { es?: string; en?: string } | string
  }
  contact?: {
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
  experience?: Array<{
    company?: string
    position?: { es?: string; en?: string } | string
    startDate?: string
    endDate?: string | null
    isCurrent?: boolean
  }>
  services?: Array<{
    id?: string
    title?: { es?: string; en?: string } | string
    description?: { es?: string; en?: string } | string
    formats?: { es?: string[]; en?: string[] } | string
    priceRange?: string
  }>
  skills?: Array<{ name?: string }>
  certifications?: Array<{
    name?: { es?: string; en?: string } | string
    issuer?: string
  }>
  practice?: { referenceNames?: string[] }
}

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const text = (bilingual: unknown, lang: 'es' | 'en'): string => {
  if (!bilingual) return ''
  if (typeof bilingual === 'string') return bilingual
  const record = bilingual as Record<string, string | undefined>
  return record[lang] ?? record.es ?? ''
}

/** The readable fallback, built from the data. */
export function buildFallbackHtml(data: AtsFallbackData, lang: 'es' | 'en' = 'es'): string {
  const profile = data.profile ?? {}
  const contact = data.contact ?? {}
  const lines: string[] = []

  lines.push(`<h1>${escapeHtml(profile.name)}</h1>`)
  lines.push(`<p><strong>${escapeHtml(text(profile.role, lang))}</strong></p>`)
  if (text(profile.summary, lang)) lines.push(`<p>${escapeHtml(text(profile.summary, lang))}</p>`)

  if (contact.email || contact.phone) {
    lines.push('<ul>')
    if (contact.email) {
      lines.push(
        `<li>Email: <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></li>`,
      )
    }
    if (contact.phone) {
      const tel = String(contact.phone).replace(/\s+/g, '')
      lines.push(`<li>Tel&eacute;fono: <a href="tel:${escapeHtml(tel)}">${escapeHtml(contact.phone)}</a></li>`)
    }
    if (contact.location) lines.push(`<li>Ubicaci&oacute;n: ${escapeHtml(contact.location)}</li>`)
    if (contact.linkedin) lines.push(`<li>LinkedIn: ${escapeHtml(contact.linkedin)}</li>`)
    if (contact.github) lines.push(`<li>GitHub: ${escapeHtml(contact.github)}</li>`)
    if (contact.portfolio) lines.push(`<li>Portfolio: ${escapeHtml(contact.portfolio)}</li>`)
    lines.push('</ul>')
  }

  const experience = data.experience ?? []
  if (experience.length) {
    lines.push('<h2>Experiencia</h2>')
    lines.push('<ul>')
    for (const job of experience) {
      const until = job.endDate ?? (job.isCurrent ? 'Presente' : '')
      const period = [job.startDate, until].filter(Boolean).join(' - ')
      lines.push(
        `<li><strong>${escapeHtml(text(job.position, lang))}</strong> — ${escapeHtml(job.company)} (${escapeHtml(period)})</li>`,
      )
    }
    lines.push('</ul>')
  }

  const services = data.services ?? []
  if (services.length) {
    lines.push('<h2>Servicios</h2>')
    lines.push('<ul>')
    for (const service of services) {
      const formats = text(service.formats, lang)
      const formatList = Array.isArray(formats) ? formats.join(' · ') : formats
      lines.push(
        `<li><strong>${escapeHtml(text(service.title, lang))}</strong> — ${escapeHtml(text(service.description, lang))}` +
          `${formatList ? ` (${escapeHtml(formatList)})` : ''}${service.priceRange ? ` — ${escapeHtml(service.priceRange)}` : ''}</li>`,
      )
    }
    lines.push('</ul>')
  }

  const references = data.practice?.referenceNames ?? []
  if (references.length) {
    lines.push('<h2>Referencias</h2>')
    lines.push('<ul>')
    for (const name of references) lines.push(`<li>${escapeHtml(name)}</li>`)
    lines.push('</ul>')
  }

  const skills = data.skills ?? []
  if (skills.length) {
    lines.push('<h2>Habilidades t&eacute;cnicas</h2>')
    lines.push(`<p>${escapeHtml(skills.map((skill) => skill.name).join(' · '))}</p>`)
  }

  const certifications = data.certifications ?? []
  if (certifications.length) {
    lines.push(`<h2>Certificaciones (${certifications.length})</h2>`)
    lines.push('<ul>')
    for (const cert of certifications.slice(0, 40)) {
      lines.push(`<li>${escapeHtml(text(cert.name, lang))} — ${escapeHtml(cert.issuer ?? '')}</li>`)
    }
    lines.push('</ul>')
  }

  lines.push(
    '<p><a href="/cv-es.pdf" download>Descargar CV (ES, PDF)</a> · <a href="/cv-en.pdf" download>Download CV (EN, PDF)</a></p>',
  )

  return [
    '<noscript>',
    '<div class="cv-fallback" style="max-width:72ch;margin:0 auto;padding:2rem 1rem;font:16px/1.6 system-ui,sans-serif">',
    ...lines,
    '</div>',
    '</noscript>',
  ].join('\n')
}

/** Puts the fallback inside the document, right before </body>. */
export function injectFallback(html: string, fallback: string): string {
  if (html.includes('class="cv-fallback"')) return html
  return html.replace('</body>', `${fallback}\n</body>`)
}
