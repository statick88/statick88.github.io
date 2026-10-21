#!/usr/bin/env node
/**
 * scripts/verify-cv-ats.mjs — ATS proof of the PUBLISHED CV artifact.
 *
 * The CV is one document per language: `cv-es.md` / `cv-en.md` are generated
 * from the data, and `public/cv-es.pdf` / `public/cv-en.pdf` are what a
 * recruiter downloads and what an applicant tracking system parses. Claiming
 * the CV is "ATS friendly" is worthless unless something checks it, so this
 * script checks the artifact that ships, not the intent:
 *
 *   1. real text layer      pdftotext extracts a document, not a scan
 *   2. literal contact      email + phone a recruiter can copy
 *   3. standard ATS headers Contacto / Experiencia / Educación / Habilidades / Certificaciones
 *   4. linear reading order one column, sections in the order an ATS expects
 *   5. machine-readable dates ASCII hyphen, ISO-like tokens, no ambiguity
 *   6. no corrupt glyphs    no U+FFFD, no (cid:…) leftovers
 *   7. embedded fonts       pdffonts: every font emb=yes
 *   8. reasonable geometry  1..6 pages and under 2 MB
 *   9. no duplicate tools   the own-tools section lists every tool once
 *  10. keywords present     the skills the data declares are in the text
 *
 * Poppler is a SYSTEM tool, not a dependency of this repo. When it is missing
 * the PDF criteria are SKIPped with an explicit reason (never a silent pass)
 * and the script only exits 0 when nothing that could be checked failed.
 *
 * Usage: node scripts/verify-cv-ats.mjs
 */

import { spawnSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** The published artifact: one PDF per language, no profile variants. */
const TARGETS = [
  { lang: 'es', pdf: 'public/cv-es.pdf' },
  { lang: 'en', pdf: 'public/cv-en.pdf' },
]

/** Minimum number of words the text layer must expose. */
const MIN_WORDS = 250
/** Minimum number of declared skills that must appear in the PDF text. */
const MIN_SKILLS = 20
/** Geometry bounds. */
const MIN_PAGES = 1
const MAX_PAGES = 6
const MAX_BYTES = 2 * 1024 * 1024

/**
 * The ATS sections, per language, with the spellings the generator emits.
 * The first pattern is the canonical one; the rest are the accepted
 * synonyms. Matching is case- and accent-insensitive because the PDF
 * stylesheet uppercases the h2 headings.
 */
const SECTIONS = {
  es: {
    contact: ['informacion de contacto', 'contacto'],
    summary: ['resumen profesional', 'resumen'],
    practice: ['mi practica', 'practica'],
    experience: ['experiencia laboral', 'experiencia'],
    education: ['educacion'],
    skills: ['habilidades tecnicas'],
    certifications: ['certificaciones'],
  },
  en: {
    contact: ['contact information', 'contact'],
    summary: ['professional summary', 'summary'],
    practice: ['my practice', 'practice'],
    experience: ['work experience', 'experience'],
    education: ['education'],
    skills: ['technical skills'],
    certifications: ['certifications'],
  },
}

/** Human labels for the report. */
const SECTION_LABELS = {
  es: {
    contact: 'Contacto',
    summary: 'Resumen',
    practice: 'Práctica',
    experience: 'Experiencia',
    education: 'Educación',
    skills: 'Habilidades',
    certifications: 'Certificaciones',
  },
  en: {
    contact: 'Contact',
    summary: 'Summary',
    practice: 'Practice',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    certifications: 'Certifications',
  },
}

/** The headers an ATS looks for. The summary/practice block is checked by the order criterion. */
const REQUIRED_SECTIONS = ['contact', 'experience', 'education', 'skills', 'certifications']

/** Typographic dashes an ATS cannot parse as a range separator. */
const TYPOGRAPHIC_DASHES = ['–', '—', '−']

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
  'septiembre', 'setiembre', 'octubre', 'noviembre', 'diciembre',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
  'september', 'october', 'november', 'december',
]

// ── Helpers ─────────────────────────────────────────────────────

/** Lowercase, strip diacritics and collapse whitespace. */
function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** True when the binary exists on this machine. */
function commandExists(binary) {
  const result = spawnSync(binary, ['-v'], { stdio: 'ignore' })
  return !result.error
}

/** Run a poppler tool and return its stdout. Throws with the real reason. */
function runTool(binary, args) {
  const result = spawnSync(binary, args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${binary} exited with ${result.status}: ${(result.stderr || '').trim()}`)
  }
  return result.stdout
}

/** Digits only, so "+593 980192790" and "593980192790" compare equal. */
function digitsOnly(value) {
  return value.replace(/\D+/g, '')
}

/** Word count of the extracted text: tokens that carry at least one letter or digit. */
function countWords(text) {
  return text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length
}

// ── Data source ────────────────────────────────────────────────

/**
 * The contract is not invented here: the contact and the skills come from the
 * single source of truth, `src/data/cv-data.ts`. Node >= 22.18 strips the
 * types natively, so the module can be imported directly; the YAML mirror is
 * the fallback for runtimes without type stripping.
 */
async function loadCvData() {
  const failures = []

  try {
    const module = await import(pathToFileURL(resolve(ROOT, 'src/data/cv-data.ts')).href)
    if (module.basics?.email && Array.isArray(module.skills)) {
      return {
        source: 'src/data/cv-data.ts',
        email: module.basics.email,
        phone: module.basics.phone,
        skills: module.skills.map((skill) => skill.name),
      }
    }
    failures.push('src/data/cv-data.ts loaded but has no basics/skills')
  } catch (error) {
    failures.push(`src/data/cv-data.ts: ${error.message.split('\n')[0]}`)
  }

  try {
    // js-yaml v5 exposes named exports only (`load`, `dump`, ...).
    const yaml = await import('js-yaml')
    const parsed = yaml.load(readFileSync(resolve(ROOT, 'src/data/cv-data.yaml'), 'utf8'))
    if (parsed?.contact?.email && Array.isArray(parsed?.skills)) {
      return {
        source: 'src/data/cv-data.yaml',
        email: parsed.contact.email,
        phone: parsed.contact.phone,
        skills: parsed.skills.map((skill) => skill.name),
      }
    }
    failures.push('src/data/cv-data.yaml loaded but has no contact/skills')
  } catch (error) {
    failures.push(`src/data/cv-data.yaml: ${error.message.split('\n')[0]}`)
  }

  throw new Error(`the CV data source could not be read:\n  - ${failures.join('\n  - ')}`)
}

// ── PDF analysis ───────────────────────────────────────────────

/** Extract the text layer, the page count, the size and the font table. */
function readPdf(pdfPath) {
  const text = runTool('pdftotext', ['-q', pdfPath, '-'])
  const info = runTool('pdfinfo', [pdfPath])
  const fonts = commandExists('pdffonts') ? runTool('pdffonts', [pdfPath]) : null

  const pages = Number(/^Pages:\s+(\d+)/m.exec(info)?.[1] ?? NaN)
  const size = statSync(pdfPath).size

  return { text, pages, size, fonts }
}

/** Locate every ATS section heading, line by line. */
function findSections(lines, lang) {
  const found = {}
  for (const [key, patterns] of Object.entries(SECTIONS[lang])) {
    for (let index = 0; index < lines.length; index += 1) {
      const line = normalize(lines[index] ?? '')
      // Headings are short lines on their own; body text never qualifies.
      if (!line || line.length > 60) continue
      // Exact match on the whole line: a heading is a line of its own, while
      // body text may start with the same words ("certificaciones activas...").
      if (patterns.includes(line)) {
        found[key] = index
        break
      }
    }
  }
  return found
}

/**
 * The reading order an ATS must see:
 *
 *   Contacto → Resumen/Práctica → Experiencia → Educación → Habilidades → Certificaciones
 *
 * "Resumen/Práctica" is one slot with two possible blocks: whichever of them
 * sits between the contact block and the experience block anchors the chain.
 * An inverted order (a section that appears before the one that precedes it)
 * breaks the chain and fails.
 */
function checkReadingOrder(sections, lang) {
  const missing = REQUIRED_SECTIONS.filter((key) => sections[key] === undefined)
  if (missing.length > 0) {
    return { ok: false, reason: `missing sections: ${missing.join(', ')}` }
  }

  const { contact, summary, practice, experience, education, skills, certifications } = sections
  const intro = [summary, practice].filter((index) => index !== undefined)
  const anchors = intro.filter((index) => index > contact && index < experience)

  if (anchors.length === 0) {
    return {
      ok: false,
      reason: 'no Resumen/Práctica block between Contacto and Experiencia',
    }
  }

  const chain = [
    { key: 'contact', index: contact },
    ...anchors.map((index) => ({
      key: summary !== undefined && index === summary ? 'summary' : 'practice',
      index,
    })),
    { key: 'experience', index: experience },
    { key: 'education', index: education },
    { key: 'skills', index: skills },
    { key: 'certifications', index: certifications },
  ]

  for (let i = 1; i < chain.length; i += 1) {
    const previous = chain[i - 1]
    const current = chain[i]
    if (previous.index >= current.index) {
      const labels = SECTION_LABELS[lang]
      return {
        ok: false,
        reason: `${labels[current.key]} appears before ${labels[previous.key]}`,
      }
    }
  }

  return { ok: true, chain }
}

/** The own-tools section: from its heading to the next heading. */
function extractOwnTools(lines, lang) {
  const headings = SECTIONS[lang]
  const ownToolsPatterns = lang === 'es' ? ['herramientas propias'] : ['own tools']
  const nextPatterns = lang === 'es' ? ['formacion propia'] : ['own training']

  let start = -1
  for (let index = 0; index < lines.length; index += 1) {
    const line = normalize(lines[index] ?? '')
    if (line.length > 60) continue
    if (ownToolsPatterns.includes(line)) {
      start = index
      break
    }
  }
  if (start === -1) return null

  const block = []
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = normalize(lines[index] ?? '')
    if (line.length > 0 && line.length <= 60) {
      const isNextHeading =
        nextPatterns.includes(line) ||
        Object.values(headings).some((patterns) => patterns.includes(line))
      if (isNextHeading) break
    }
    block.push(lines[index] ?? '')
  }

  // Every entry starts with "name — description"; the continuation lines of a
  // wrapped entry never do.
  const names = []
  for (const line of block) {
    const match = /^([A-Za-z0-9][A-Za-z0-9._+-]*)\s+—\s/.exec(line.trim())
    if (match?.[1]) names.push(match[1])
  }
  return names
}

/** Date ranges and other date shapes an ATS cannot read. */
function checkDates(flatText) {
  const problems = []

  // Ranges: <date> <separator> <date|Presente>. The separator must be ASCII.
  const rangeRe = /(\d{4}(?:-\d{2}){0,2})(\s*)([–—−-])(\s*)(\d{4}(?:-\d{2}){0,2}|Presente|Present)\b/g
  let match = rangeRe.exec(flatText)
  while (match) {
    const [, start, , separator, , end] = match
    if (separator !== '-') {
      problems.push(`range "${start} ${separator} ${end}" uses a non-ASCII dash`)
    }
    match = rangeRe.exec(flatText)
  }

  // Spelled out months in a range: "Diciembre 2021 - Enero 2022".
  const spelledRe = new RegExp(
    `(?:${MONTHS.join('|')})\\s+\\d{4}\\s*[–—−-]\\s*(?:(?:${MONTHS.join('|')})\\s+)?\\d{4}`,
    'i',
  )
  const spelled = flatText.match(spelledRe)
  if (spelled) problems.push(`spelled out month range "${spelled[0].trim()}"`)

  // Ambiguous numeric dates: 01/02/2024 is DD/MM in Ecuador and MM/DD in the US.
  const ambiguous = flatText.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g)
  if (ambiguous) problems.push(`ambiguous date "${ambiguous[0]}"`)

  const ranges = flatText.match(/\d{4}(?:-\d{2}){0,2}\s*[–—−-]\s*(?:\d{4}(?:-\d{2}){0,2}|Presente|Present)\b/g) ?? []
  return { problems, ranges: ranges.length }
}

/** Fonts embedded in the PDF, read from the pdffonts table. */
function checkEmbeddedFonts(fontsOutput) {
  const lines = fontsOutput.split('\n').filter((line) => line.trim().length > 0)
  const headerIndex = lines.findIndex((line) => /\bemb\b/.test(line) && /\bsub\b/.test(line))
  if (headerIndex === -1) {
    return { ok: false, reason: 'the pdffonts table could not be read' }
  }

  const embColumn = lines[headerIndex].indexOf('emb')
  const notEmbedded = []
  let total = 0

  for (const line of lines.slice(headerIndex + 1)) {
    // The rule under the header is a separator, not a font.
    if (/^[-\s]+$/.test(line)) continue
    const emb = embColumn >= 0 ? line.slice(embColumn, embColumn + 3).trim() : ''
    total += 1
    if (emb !== 'yes') {
      const name = line.trim().split(/\s+/)[0] ?? 'unknown'
      notEmbedded.push(`${name} (emb=${emb || 'empty'})`)
    }
  }

  if (total === 0) return { ok: false, reason: 'the PDF declares no fonts at all' }
  return { ok: notEmbedded.length === 0, total, notEmbedded }
}

// ── Report ─────────────────────────────────────────────────────

/** One verdict per criterion, one line each. */
const results = []

function record(id, name, perLanguage) {
  const values = Object.values(perLanguage)
  const status = values.some((value) => value.status === 'FAIL')
    ? 'FAIL'
    : values.some((value) => value.status === 'SKIP')
      ? 'SKIP'
      : 'PASS'
  results.push({ id, name, status, perLanguage })
}

function verdict(status, detail) {
  return { status, detail }
}

// ── Main ───────────────────────────────────────────────────────

async function main() {
  const data = await loadCvData()
  const poppler = {
    pdftotext: commandExists('pdftotext'),
    pdfinfo: commandExists('pdfinfo'),
    pdffonts: commandExists('pdffonts'),
  }
  const hasPoppler = poppler.pdftotext && poppler.pdfinfo

  console.log('ATS proof — published CV artifact')
  console.log(`  data source : ${data.source} (${data.skills.length} skills)`)
  console.log(`  artifacts   : ${TARGETS.map((target) => target.pdf).join(', ')}`)
  if (!hasPoppler) {
    console.log('')
    console.log('  ⚠ WARNING: poppler is not available on this machine (pdftotext/pdfinfo missing).')
    console.log('    The PDF criteria are SKIPped, not passed. Install poppler-utils to run them.')
  }
  if (!poppler.pdffonts) {
    console.log('  ⚠ WARNING: pdffonts is not available — the embedded fonts criterion is SKIPped.')
  }
  console.log('')

  const analysis = new Map()

  if (hasPoppler) {
    for (const target of TARGETS) {
      const pdfPath = resolve(ROOT, target.pdf)
      try {
        analysis.set(target.lang, { ...readPdf(pdfPath), ok: true })
      } catch (error) {
        analysis.set(target.lang, { ok: false, error: error.message })
      }
    }
  }

  const skip = (reason) => verdict('SKIP', reason)
  const forEach = (fn) => {
    const perLanguage = {}
    for (const target of TARGETS) {
      const pdf = analysis.get(target.lang)
      perLanguage[target.lang] = !hasPoppler
        ? skip('poppler not available')
        : !pdf?.ok
          ? verdict('FAIL', `the PDF could not be read: ${pdf?.error ?? 'unknown error'}`)
          : fn(target.lang, pdf)
    }
    return perLanguage
  }

  // 1 — real text layer.
  record(1, 'Real text layer', forEach((lang, pdf) => {
    const words = countWords(pdf.text)
    return words >= MIN_WORDS
      ? verdict('PASS', `${words} words`)
      : verdict('FAIL', `${words} words (< ${MIN_WORDS})`)
  }))

  // 2 — literal contact.
  record(2, 'Literal contact', forEach((lang, pdf) => {
    const email = pdf.text.includes(data.email)
    const phone = digitsOnly(pdf.text).includes(digitsOnly(data.phone))
    return email && phone
      ? verdict('PASS', 'email + phone')
      : verdict('FAIL', `email ${email ? 'ok' : 'missing'}, phone ${phone ? 'ok' : 'missing'}`)
  }))

  // 3 — standard ATS headers.
  record(3, 'Standard ATS headers', forEach((lang, pdf) => {
    const sections = findSections(pdf.text.split('\n'), lang)
    const missing = REQUIRED_SECTIONS.filter((key) => sections[key] === undefined)
    return missing.length === 0
      ? verdict('PASS', `${REQUIRED_SECTIONS.length}/${REQUIRED_SECTIONS.length} headers`)
      : verdict('FAIL', `missing: ${missing.join(', ')}`)
  }))

  // 4 — linear reading order.
  record(4, 'Linear reading order', forEach((lang, pdf) => {
    const sections = findSections(pdf.text.split('\n'), lang)
    const order = checkReadingOrder(sections, lang)
    if (!order.ok) return verdict('FAIL', order.reason)
    const labels = SECTION_LABELS[lang]
    const chain = order.chain.map((item) => `${labels[item.key]}(${item.index})`).join(' → ')
    const summary = sections.summary
    const note =
      summary !== undefined && summary < sections.contact
        ? ` — the ${labels.summary} precedes the ${labels.contact}`
        : ''
    return verdict('PASS', `${chain}${note}`)
  }))

  // 5 — machine readable dates.
  record(5, 'Machine-readable dates', forEach((lang, pdf) => {
    const flat = pdf.text.replace(/\s+/g, ' ')
    const { problems, ranges } = checkDates(flat)
    return problems.length === 0
      ? verdict('PASS', `${ranges} date range(s), ASCII hyphen`)
      : verdict('FAIL', problems.slice(0, 3).join('; '))
  }))

  // 6 — no corrupt glyphs.
  record(6, 'No corrupt glyphs', forEach((lang, pdf) => {
    const replacement = pdf.text.match(/�/g) ?? []
    const cid = pdf.text.match(/\(cid:\d+\)/g) ?? []
    const total = replacement.length + cid.length
    return total === 0
      ? verdict('PASS', 'no U+FFFD, no (cid:…)')
      : verdict('FAIL', `${replacement.length} U+FFFD, ${cid.length} (cid:…)`)
  }))

  // 7 — embedded fonts.
  record(7, 'Embedded fonts', forEach((lang, pdf) => {
    if (!poppler.pdffonts) return skip('pdffonts not available')
    const fonts = checkEmbeddedFonts(pdf.fonts ?? '')
    return fonts.ok
      ? verdict('PASS', `${fonts.total}/${fonts.total} embedded`)
      : verdict('FAIL', `not embedded: ${fonts.notEmbedded.join(', ')}`)
  }))

  // 8 — reasonable geometry.
  record(8, 'Reasonable geometry', forEach((lang, pdf) => {
    const pagesOk = Number.isFinite(pdf.pages) && pdf.pages >= MIN_PAGES && pdf.pages <= MAX_PAGES
    const sizeOk = pdf.size < MAX_BYTES
    if (!pagesOk) return verdict('FAIL', `${pdf.pages} pages (expected ${MIN_PAGES}..${MAX_PAGES})`)
    if (!sizeOk) return verdict('FAIL', `${Math.round(pdf.size / 1024)} KB (expected < 2 MB)`)
    return verdict('PASS', `${pdf.pages} pages, ${Math.round(pdf.size / 1024)} KB`)
  }))

  // 9 — no duplicated own tools.
  record(9, 'No duplicate own tools', forEach((lang, pdf) => {
    const names = extractOwnTools(pdf.text.split('\n'), lang)
    if (!names) return verdict('FAIL', 'the own tools section was not found')
    const seen = new Map()
    const duplicates = []
    for (const name of names) {
      const key = name.toLowerCase()
      seen.set(key, (seen.get(key) ?? 0) + 1)
      if (seen.get(key) === 2) duplicates.push(name)
    }
    return duplicates.length === 0
      ? verdict('PASS', `${names.length} unique tool(s)`)
      : verdict('FAIL', `duplicated: ${duplicates.join(', ')}`)
  }))

  // 10 — keywords present.
  record(10, 'Keywords present', forEach((lang, pdf) => {
    const haystack = pdf.text.toLowerCase()
    const present = data.skills.filter((skill) => haystack.includes(skill.toLowerCase()))
    return present.length >= MIN_SKILLS
      ? verdict('PASS', `${present.length}/${data.skills.length} skills`)
      : verdict('FAIL', `${present.length}/${data.skills.length} skills (< ${MIN_SKILLS})`)
  }))

  const width = Math.max(...results.map((result) => result.name.length))
  for (const result of results) {
    const details = TARGETS.map((target) => `${target.lang}: ${result.perLanguage[target.lang].detail}`).join(' | ')
    const status = result.status.padEnd(4)
    console.log(`[${String(result.id).padStart(2)}/${results.length}] ${status}  ${result.name.padEnd(width)}  ${details}`)
  }

  const failures = results.filter((result) => result.status === 'FAIL')
  const skipped = results.filter((result) => result.status === 'SKIP')
  console.log('')
  if (failures.length > 0) {
    console.log(`ATS proof: FAIL — ${failures.length} criterion/criteria failed: ${failures.map((f) => f.id).join(', ')}`)
    process.exit(1)
  }
  if (skipped.length === results.length) {
    console.log(`ATS proof: NOT VERIFIED — every criterion was skipped (${skipped[0]?.perLanguage.es.detail ?? 'poppler not available'}); nothing failed, but nothing was checked either.`)
    process.exit(0)
  }
  if (skipped.length > 0) {
    console.log(`ATS proof: PASS with SKIP — ${skipped.length} criterion/criteria skipped: ${skipped.map((s) => s.id).join(', ')}`)
    process.exit(0)
  }
  console.log(`ATS proof: PASS — ${results.length}/${results.length} criteria`)
  process.exit(0)
}

main().catch((error) => {
  console.error(`ATS proof: ERROR — ${error.message}`)
  process.exit(2)
})
