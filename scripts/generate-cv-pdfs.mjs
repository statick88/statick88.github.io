import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFArray, PDFDocument, PDFName, PDFNumber, PDFString, rgb, StandardFonts } from 'pdf-lib'
import * as QRCode from 'qrcode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

function safeText(value) {
  if (value == null) return ''
  return String(value)
}

function displayUrl(url) {
  const u = safeText(url).trim()
  if (!u) return ''
  return u.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function i18nText(value, lang) {
  if (value == null) return ''
  if (typeof value === 'object') {
    const v = value
    return safeText(v?.[lang] ?? v?.es ?? v?.en)
  }
  return safeText(value)
}

function yearRange(startDate, endDate) {
  const startYear = safeText(startDate).slice(0, 4)
  const endYear = endDate ? safeText(endDate).slice(0, 4) : ''
  if (!startYear && !endYear) return ''
  if (!endYear) return `${startYear} - ${startYear}`
  return `${startYear} - ${endYear}`
}

function isInProgressRange(startDate, endDate) {
  const today = new Date().toISOString().slice(0, 10)
  const start = safeText(startDate).slice(0, 10)
  const end = safeText(endDate).slice(0, 10)

  if (!start) return false
  if (start > today) return false
  if (!end) return true
  return today <= end
}

function translateCommonLanguageTerms(value, lang) {
  const v = safeText(value).trim()
  if (!v) return ''

  const esMap = {
    Spanish: 'Español',
    English: 'Inglés',
    'Native speaker': 'Nativo',
    Native: 'Nativo',
    Advanced: 'Avanzado'
  }

  const enMap = {
    Español: 'Spanish',
    Inglés: 'English',
    Nativo: 'Native speaker',
    Avanzado: 'Advanced'
  }

  if (lang === 'es') return esMap[v] ?? v
  if (lang === 'en') return enMap[v] ?? v
  return v
}

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function clampArray(arr) {
  return Array.isArray(arr) ? arr : []
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

async function embedFont(pdfDoc, fontPath) {
  try {
    const fontBytes = await fs.readFile(fontPath)
    return await pdfDoc.embedFont(fontBytes)
  } catch {
    return null
  }
}

async function embedImage(pdfDoc, imgPath) {
  try {
    const imgBytes = await fs.readFile(imgPath)
    const ext = path.extname(imgPath).toLowerCase()
    let embedded = null

    if (ext === '.png') embedded = await pdfDoc.embedPng(imgBytes)
    if (ext === '.jpg' || ext === '.jpeg') embedded = await pdfDoc.embedJpg(imgBytes)
    if (ext === '.webp') {
      try {
        const { default: sharp } = await import('sharp')
        const png = await sharp(imgBytes).resize(256).png().toBuffer()
        embedded = await pdfDoc.embedPng(png)
      } catch {
        embedded = null
      }
    }
    return embedded
  } catch {
    return null
  }
}

async function generateCvPdfBytes(cv, lang) {
  const pdfDoc = await PDFDocument.create()
  const pageSize = [595.28, 841.89] // A4 points

  // Load Fira Code font
  const fontPaths = [
    '/Users/statick/Library/Fonts/FiraCodeNerdFont-Regular.ttf',
    '/Users/statick/Library/Fonts/FiraCodeNerdFontPropo-Regular.ttf'
  ]
  let font = null
  let fontBold = null
  for (const fp of fontPaths) {
    font = await embedFont(pdfDoc, fp)
    if (font) break
  }
  if (!font) {
    font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  }
  for (const fp of fontPaths) {
    const boldPath = fp.replace('-Regular', '-Bold')
    fontBold = await embedFont(pdfDoc, boldPath)
    if (fontBold) break
  }
  if (!fontBold) {
    for (const fp of fontPaths) {
      const boldPath = fp.replace('-Regular', '-SemiBold')
      fontBold = await embedFont(pdfDoc, boldPath)
      if (fontBold) break
    }
  }
  if (!fontBold) fontBold = font

  const margin = 48
  const sidebarMargin = 24  // Reduced margin for sidebar content
  const pageWidth = pageSize[0]
  const pageHeight = pageSize[1]
  const contentWidth = pageWidth - margin * 2
  const pageBottom = margin

  // Layout constants
  const sidebarWidth = 175
  const mainX = margin + sidebarWidth + 16
  const mainWidth = contentWidth - sidebarWidth - 16

  // Colors
  const sidebarColor = rgb(0.12, 0.12, 0.18)
  const whiteColor = rgb(1, 1, 1)
  const textLightColor = rgb(0.82, 0.82, 0.82)
  const textDarkColor = rgb(0.1, 0.1, 0.1)
  const mutedColor = rgb(0.42, 0.42, 0.42)
  const accentColor = rgb(0.3, 0.5, 0.8)

  let page = pdfDoc.addPage(pageSize)
  let y = pageHeight - margin

  const drawSidebarBg = () => {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: sidebarWidth,
      height: pageHeight,
      color: sidebarColor
    })
  }
  drawSidebarBg()

  const widthOf = (text, size) => font.widthOfTextAtSize(safeText(text), size)

  const wrapText = (text, maxWidth, size = 10) => {
    const t = safeText(text).trim()
    if (!t) return []
    const tokens = t.split(/\s+/).filter(Boolean)
    const lines = []
    let line = ''
    for (const w of tokens) {
      const test = line ? `${line} ${w}` : w
      if (widthOf(test, size) > maxWidth && line) {
        lines.push(line)
        line = w
      } else {
        line = test
      }
    }
    if (line) lines.push(line)
    return lines
  }

  const justifyLine = (line, maxWidth, size, f) => {
    const words = line.split(/\s+/)
    if (words.length <= 1) return line
    const totalWordWidth = words.reduce((sum, w) => sum + widthOf(w, size), 0)
    const spaceWidth = (maxWidth - totalWordWidth) / (words.length - 1)
    let result = words[0]
    for (let i = 1; i < words.length; i++) {
      const spaces = Math.round(spaceWidth / widthOf(' ', size))
      result += ' '.repeat(Math.max(1, spaces)) + words[i]
    }
    return result
  }

  const newPage = () => {
    page = pdfDoc.addPage(pageSize)
    y = pageHeight - margin
    drawSidebarBg()
    return y
  }

  const ensureSpace = (minSpace, isSidebar = false) => {
    const bottom = isSidebar ? 20 : pageBottom
    if (y - minSpace < bottom) {
      newPage()
    }
  }

  const drawSidebarText = (text, { size = 10, bold = false, color = textLightColor } = {}) => {
    const t = safeText(text)
    if (!t) return
    ensureSpace(size * 1.4, true)
    const usedFont = bold ? fontBold : font
    page.drawText(t, { x: sidebarMargin, y, size, font: usedFont, color })
    y -= size * 1.4
  }

  const drawSidebarWrapped = (text, { maxWidth = sidebarWidth - sidebarMargin - 8, size = 9, color = textLightColor, lineHeight = 13, justify = false } = {}) => {
    const lines = wrapText(text, maxWidth, size)
    if (!lines.length) return
    for (let i = 0; i < lines.length; i++) {
      const line = justify && i < lines.length - 1 ? justifyLine(lines[i], maxWidth, size, font) : lines[i]
      ensureSpace(lineHeight, true)
      page.drawText(line, { x: sidebarMargin, y, size, font, color })
      y -= lineHeight
    }
  }

  const drawSidebarBullet = (text, { maxWidth = sidebarWidth - sidebarMargin - 20, size = 9, color = textLightColor } = {}) => {
    const bullet = '• '
    const bulletWidth = font.widthOfTextAtSize(bullet, size)
    const bodyMax = Math.max(30, maxWidth - bulletWidth)
    const lines = wrapText(text, bodyMax, size)
    if (!lines.length) return
    ensureSpace(13, true)
    page.drawText(bullet + lines[0], { x: sidebarMargin, y, size, font, color })
    y -= 13
    for (const line of lines.slice(1)) {
      ensureSpace(13, true)
      page.drawText(line, { x: sidebarMargin + bulletWidth, y, size, font, color })
      y -= 13
    }
  }

  const drawSectionDivider = (x1, x2, yPos) => {
    page.drawLine({
      start: { x: x1, y: yPos },
      end: { x: x2, y: yPos },
      thickness: 2,
      color: accentColor
    })
  }

  const addUrlLinkAnnotation = (targetPage, { x, y, width, height, url }) => {
    const u = safeText(url).trim()
    if (!u) return

    // PDF link annotations use bottom-left origin coordinates.
    const rect = pdfDoc.context.obj([
      PDFNumber.of(x),
      PDFNumber.of(y),
      PDFNumber.of(x + width),
      PDFNumber.of(y + height)
    ])

    const action = pdfDoc.context.obj({
      S: PDFName.of('URI'),
      URI: PDFString.of(u)
    })

    const annot = pdfDoc.context.obj({
      Type: PDFName.of('Annot'),
      Subtype: PDFName.of('Link'),
      Rect: rect,
      Border: pdfDoc.context.obj([PDFNumber.of(0), PDFNumber.of(0), PDFNumber.of(0)]),
      A: action
    })

    const annotRef = pdfDoc.context.register(annot)
    const annotsKey = PDFName.of('Annots')
    let annots = null
    try {
      annots = targetPage.node.lookupMaybe(annotsKey, PDFArray)
    } catch {
      annots = null
    }
    if (!annots) {
      annots = pdfDoc.context.obj([])
      targetPage.node.set(annotsKey, annots)
    }
    annots.push(annotRef)
  }

  const drawSectionHeader = (title, { size = 14 } = {}) => {
    const titleToDivider = 1
    const dividerToContent = 14
    const dividerThickness = 2

    // pdf-lib draws text anchored at the baseline (y). Place the divider slightly
    // below the baseline so it visually hugs the title (and stays away from content).
    const dividerUnderBaseline = size * 0.35

    const needed = dividerUnderBaseline + titleToDivider + dividerThickness + dividerToContent
    ensureSpace(needed, false)

    const titleY = y
    page.drawText(safeText(title), { x: mainX, y: titleY, size, font: fontBold, color: textDarkColor })

    const dividerY = titleY - dividerUnderBaseline - titleToDivider
    drawSectionDivider(mainX, mainX + mainWidth, dividerY)

    y = dividerY - dividerToContent
  }

  function getUsername(url) {
    const u = safeText(url).trim()
    if (!u) return ''
    try {
      const urlObj = new URL(u.startsWith('http') ? u : `https://${u}`)
      const parts = urlObj.pathname.split('/').filter(Boolean)
      return parts[parts.length - 1] || ''
    } catch {
      return u.replace(/^https?:\/\//, '').replace(/\/$/, '')
    }
  }
  const basics = cv?.basics ?? {}
  const siteUrl = safeText(basics.url) || 'https://statick88.github.io'

  // === LEFT SIDEBAR ===
  const avatarSize = 85
  try {
    const imgRel = safeText(basics.image)
    if (imgRel) {
      const imgPath = path.join(repoRoot, 'public', imgRel.replace(/^\//, ''))
      const avatar = await embedImage(pdfDoc, imgPath)
      if (avatar) {
        const avatarX = (sidebarWidth - avatarSize) / 2
        ensureSpace(avatarSize + 25, true)
        page.drawImage(avatar, {
          x: avatarX,
          y: y - avatarSize,
          width: avatarSize,
          height: avatarSize
        })
        y -= avatarSize + 18
      }
    }
  } catch {}

  // About section
  const summaryTitle = lang === 'en' ? 'About' : 'Sobre mí'
  drawSidebarText(summaryTitle, { size: 12, bold: true, color: whiteColor })
  y -= 5

  const fullSummary = i18nText(basics.summary, lang)
  if (fullSummary) {
    const size = 8.5
    const maxWidth = sidebarWidth - sidebarMargin - 8
    const lineHeight = 12
    const maxLines = 12

    const lines = wrapText(fullSummary, maxWidth, size)
    const needsEllipsis = lines.length > maxLines
    const shown = lines.slice(0, maxLines)

    if (needsEllipsis && shown.length) {
      const ellipsis = '...'
      let last = shown[shown.length - 1]
      while (last && widthOf(last + ellipsis, size) > maxWidth) {
        last = last.slice(0, -1).trimEnd()
      }
      shown[shown.length - 1] = (last || '').trimEnd() + ellipsis
    }

    for (const rawLine of shown) {
      const line = safeText(rawLine)
      const w = widthOf(line, size)
      const x = sidebarMargin + Math.max(0, (maxWidth - w) / 2)
      ensureSpace(lineHeight, true)
      page.drawText(line, { x, y, size, font, color: textLightColor })
      y -= lineHeight
    }
  }
  y -= 8

  // Roles section
  const rolesTitle = lang === 'en' ? 'Roles' : 'Roles'
  drawSidebarText(rolesTitle, { size: 12, bold: true, color: whiteColor })
  y -= 5
  for (const w of clampArray(cv?.work).slice(0, 3)) {
    const role = i18nText(w?.position, lang)
    const company = safeText(w?.name)
    if (role) {
      const fullText = role + (company ? ` ${company}` : '')
      drawSidebarBullet(fullText, { size: 9, color: textLightColor })
    }
  }
  y -= 8

  // QR Code section
  const qrTitle = lang === 'en' ? 'Portfolio' : 'Portafolio'
  drawSidebarText(qrTitle, { size: 12, bold: true, color: whiteColor })
  y -= 5
  try {
    const qrDataUrl = await QRCode.toDataURL(siteUrl, { errorCorrectionLevel: 'M', margin: 1, width: 130 })
    const base64 = qrDataUrl.replace(/^data:image\/png;base64,/, '')
    const pngBytes = Buffer.from(base64, 'base64')
    const qrImage = await pdfDoc.embedPng(pngBytes)
    const qrSize = 80
    const qrX = (sidebarWidth - qrSize) / 2
    ensureSpace(qrSize + 35, true)
    page.drawImage(qrImage, { x: qrX, y: y - qrSize, width: qrSize, height: qrSize })
    y -= qrSize + 10
  } catch {}
  y -= 8

  // Contact section
  const contactTitle = lang === 'en' ? 'Contact' : 'Contacto'
  drawSidebarText(contactTitle, { size: 12, bold: true, color: whiteColor })
  y -= 5
  if (basics.email) {
    const emailLines = wrapText(safeText(basics.email), sidebarWidth - sidebarMargin - 20, 9)
    for (const line of emailLines) {
      ensureSpace(13, true)
      page.drawText('• ' + line, { x: sidebarMargin, y, size: 9, font, color: textLightColor })
      y -= 13
    }
  }
  if (basics.phone) {
    ensureSpace(13, true)
    page.drawText('• ' + safeText(basics.phone), { x: sidebarMargin, y, size: 9, font, color: textLightColor })
    y -= 13
  }
  const profiles = clampArray(basics.profiles)
  for (const p of profiles) {
    const network = safeText(p?.network)
    const username = getUsername(p?.url)
    if (network && username) {
      const fullText = `${network}: ${username}`
      drawSidebarBullet(fullText, { size: 9, color: textLightColor })
    }
  }

  // === RIGHT MAIN COLUMN ===
  y = pageHeight - margin

  const drawMainText = (text, { size = 10, bold = false, color = textDarkColor } = {}) => {
    const t = safeText(text)
    if (!t) return
    ensureSpace(size * 1.4, false)
    const usedFont = bold ? fontBold : font
    page.drawText(t, { x: mainX, y, size, font: usedFont, color })
    y -= size * 1.4
  }

  const drawMainWrapped = (text, { maxWidth = mainWidth, size = 9, color = textDarkColor, lineHeight = 13, justify = false, bold = false } = {}) => {
    const lines = wrapText(text, maxWidth, size)
    if (!lines.length) return
    const usedFont = bold ? fontBold : font
    for (let i = 0; i < lines.length; i++) {
      const line = justify && i < lines.length - 1 ? justifyLine(lines[i], maxWidth, size, font) : lines[i]
      ensureSpace(lineHeight, false)
      page.drawText(line, { x: mainX, y, size, font: usedFont, color })
      y -= lineHeight
    }
  }

  const drawMainWrappedCentered = (text, { maxWidth = mainWidth, size = 9, color = textDarkColor, lineHeight = 13, bold = false } = {}) => {
    const lines = wrapText(text, maxWidth, size)
    if (!lines.length) return
    const usedFont = bold ? fontBold : font
    for (const line of lines) {
      ensureSpace(lineHeight, false)
      const w = usedFont.widthOfTextAtSize(line, size)
      const x = mainX + Math.max(0, (maxWidth - w) / 2)
      page.drawText(line, { x, y, size, font: usedFont, color })
      y -= lineHeight
    }
  }

  const drawMainBullet = (text, { size = 10, color = textDarkColor, lineHeight = 13, maxWidth = mainWidth } = {}) => {
    const t = safeText(text).trim()
    if (!t) return

    const bullet = '• '
    const bulletWidth = font.widthOfTextAtSize(bullet, size)
    const bodyMax = Math.max(40, maxWidth - bulletWidth)
    const lines = wrapText(t, bodyMax, size)
    if (!lines.length) return

    ensureSpace(lineHeight, false)
    page.drawText(bullet + lines[0], { x: mainX, y, size, font, color })
    y -= lineHeight

    for (const line of lines.slice(1)) {
      ensureSpace(lineHeight, false)
      page.drawText(line, { x: mainX + bulletWidth, y, size, font, color })
      y -= lineHeight
    }
  }

  const drawMainWrappedLink = (text, url, { maxWidth = mainWidth, size = 9, color = textDarkColor, lineHeight = 13, bold = false } = {}) => {
    const lines = wrapText(text, maxWidth, size)
    if (!lines.length) return
    const usedFont = bold ? fontBold : font
    for (const line of lines) {
      ensureSpace(lineHeight, false)
      const lineY = y
      page.drawText(line, { x: mainX, y: lineY, size, font: usedFont, color })

      // A tight-ish clickable box around the visible text.
      const w = usedFont.widthOfTextAtSize(line, size)
      addUrlLinkAnnotation(page, {
        x: mainX,
        y: lineY - 2,
        width: w,
        height: size + 4,
        url
      })
      y -= lineHeight
    }
  }

  const drawLabeledUrl = (label, url, { size = 9, lineHeight = 12 } = {}) => {
    const u = safeText(url).trim()
    if (!u) return

    const labelText = `${safeText(label).trim()} `
    const labelWidth = font.widthOfTextAtSize(labelText, size)
    const urlText = displayUrl(u)
    const available = Math.max(40, mainWidth - labelWidth)
    const urlLines = wrapText(urlText, available, size)
    if (!urlLines.length) return

    for (let i = 0; i < urlLines.length; i++) {
      ensureSpace(lineHeight, false)
      const lineY = y
      const x0 = mainX
      const x1 = mainX + labelWidth

      if (i === 0) {
        page.drawText(labelText, { x: x0, y: lineY, size, font, color: mutedColor })
      }

      page.drawText(urlLines[i], { x: x1, y: lineY, size, font, color: accentColor })
      const w = font.widthOfTextAtSize(urlLines[i], size)
      addUrlLinkAnnotation(page, { x: x1, y: lineY - 2, width: w, height: size + 4, url: u })

      y -= lineHeight
    }
  }

  // Name
  drawMainText(safeText(basics.name), { size: 22, bold: true, color: textDarkColor })
  y -= 4

  const label = i18nText(basics.label, lang)
  drawMainWrappedCentered(label, { size: 11, color: accentColor })
  y -= 8

  // Work Experience
  const expTitle = lang === 'en' ? 'Work Experience' : 'Experiencia Laboral'
  drawSectionHeader(expTitle)

  for (const w of clampArray(cv?.work)) {
    const company = safeText(w?.name)
    const position = i18nText(w?.position, lang)
    const years = yearRange(w?.startDate, w?.endDate)

    const header = [company, years].filter(Boolean).join(' | ')
    ensureSpace(30)
    page.drawText(header, { x: mainX, y, size: 11, font: fontBold, color: textDarkColor })
    y -= 14
    ensureSpace(14)
    page.drawText(position, { x: mainX, y, size: 9, font, color: mutedColor })
    y -= 12

    const summaryW = i18nText(w?.summary, lang)
    if (summaryW) {
      drawMainWrapped(summaryW, { size: 8.6, lineHeight: 12, justify: true })
    }
    y -= 10
  }
  y -= 6

  // Education
  const eduTitle = lang === 'en' ? 'Education' : 'Formación Académica'
  drawSectionHeader(eduTitle)

  for (const e of clampArray(cv?.education)) {
    const inst = safeText(e?.institution)
    const area = i18nText(e?.area, lang)
    const years = yearRange(e?.startDate, e?.endDate)
    const inProgress = isInProgressRange(e?.startDate, e?.endDate)
    const inProgressLabel = inProgress ? (lang === 'en' ? 'In progress' : 'En proceso') : ''

    const headerParts = [inst]
    if (inProgress) {
      headerParts.push(inProgressLabel)
    } else {
      headerParts.push(years)
    }
    const header = headerParts.filter(Boolean).join(' | ')
    ensureSpace(34)
    drawMainWrapped(header, { size: 11, bold: true, lineHeight: 14 })
    y -= 2
    if (area) {
      drawMainWrapped(area, { size: 9, color: mutedColor, lineHeight: 12 })
    }
    y -= 8
  }
  y -= 6

  // Training / Courses
  const trainTitle = lang === 'en' ? 'Training & Courses' : 'Capacitaciones'
  if (clampArray(cv?.projects).length > 0) {
    drawSectionHeader(trainTitle)

    for (const p of clampArray(cv?.projects).slice(0, 4)) {
      const title = safeText(p?.name)
      const desc = i18nText(p?.description, lang)
      const projectUrl = safeText(p?.url)
      const projectGithub = safeText(p?.github)
      if (title) {
        ensureSpace(30)
        page.drawText(title, { x: mainX, y, size: 11, font: fontBold, color: textDarkColor })
        y -= 14
        if (desc) {
          drawMainWrapped(desc, { size: 8.6, lineHeight: 12, justify: true })
        }

        if (projectUrl) {
          drawLabeledUrl('Deploy', projectUrl)
        }
        if (projectGithub && projectGithub !== projectUrl) {
          drawLabeledUrl('Codigo', projectGithub)
        }

        y -= 10
      }
    }
    y -= 6
  }

  // Hard Skills
  const hardSkillsTitle = lang === 'en' ? 'Hard Skills' : 'Hard Skills'
  drawSectionHeader(hardSkillsTitle)

  const skills = clampArray(cv?.skills)
  if (skills.length) {
    const skillNames = skills.map((s) => safeText(s?.name)).filter(Boolean)
    const skillText = skillNames.join(', ')
    drawMainWrapped(skillText, { size: 10, lineHeight: 13 })
  }
  y -= 6

  // Soft Skills
  const softSkillsTitle = lang === 'en' ? 'Soft Skills' : 'Soft Skills'
  const softSkills = clampArray(cv?.softSkills)
  drawSectionHeader(softSkillsTitle)
  for (const s of softSkills) {
    drawMainBullet(s, { size: 10, lineHeight: 13 })
  }
  y -= 6

  // Languages
  const langsTitle = lang === 'en' ? 'Languages' : 'Idiomas'
  drawSectionHeader(langsTitle)

  for (const l of clampArray(cv?.languages)) {
    const language = translateCommonLanguageTerms(safeText(l?.language), lang)
    const fluency = translateCommonLanguageTerms(safeText(l?.fluency), lang)
    if (language) {
      ensureSpace(11)
      page.drawText(`${language} - ${fluency}`, { x: mainX, y, size: 10, font, color: textDarkColor })
      y -= 11
    }
  }
  y -= 12

  // Publications
  const publications = clampArray(cv?.publications)
  if (publications.length && y > pageBottom + 80) {
    const pubTitle = lang === 'en' ? 'Publications' : 'Publicaciones'
    drawSectionHeader(pubTitle)

    for (const pub of publications) {
      const title = i18nText(pub?.name, lang)
      const publisher = safeText(pub?.publisher)
      const date = safeText(pub?.releaseDate)?.slice(0, 7) || ''
      const pubUrl = safeText(pub?.url)

      ensureSpace(26)
      drawMainWrappedLink([title, date].filter(Boolean).join(' | '), pubUrl, { size: 11, bold: true, lineHeight: 14 })
      y -= 6
      if (publisher) {
        ensureSpace(12)
        drawMainWrappedLink(publisher, pubUrl, { size: 9, color: accentColor, lineHeight: 12 })
        y -= 6
      }
      y -= 6
    }
  }

  return await pdfDoc.save()
}

async function main() {
  const cvEsPath = path.join(repoRoot, 'cv.json')
  const cvEnPath = path.join(repoRoot, 'cv-en.json')

  const [cvEs, cvEn] = await Promise.all([readJson(cvEsPath), readJson(cvEnPath)])

  const [bytesEs, bytesEn] = await Promise.all([
    generateCvPdfBytes(cvEs, 'es'),
    generateCvPdfBytes(cvEn, 'en')
  ])

  const publicDir = path.join(repoRoot, 'public')
  await fs.mkdir(publicDir, { recursive: true })

  await Promise.all([
    fs.writeFile(path.join(publicDir, 'cv-es.pdf'), bytesEs),
    fs.writeFile(path.join(publicDir, 'cv-en.pdf'), bytesEn)
  ])

  console.log('Generated public/cv-es.pdf and public/cv-en.pdf')
}

await main()
