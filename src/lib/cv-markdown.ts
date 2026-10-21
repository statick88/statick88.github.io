/**
 * src/lib/cv-markdown.ts — CV markdown → HTML
 *
 * The generated CVs are what recruiters download and what applicant tracking
 * systems parse, so the conversion is deliberately narrow and predictable:
 *
 *   - real headings (h1/h2/h3), never styled paragraphs
 *   - real lists, never tables
 *   - real links with their target
 *   - one column, no images, no embedded markup
 *
 * It handles the subset the CV generators emit: headings, unordered lists
 * (one nesting level), paragraphs, bold, italic, inline code, links and
 * horizontal rules. Anything else is escaped and rendered as text.
 */

/** Escape the five characters that matter in HTML text and attributes. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Apply the inline marks of a text run: code, bold, italic, links. */
function renderInline(text: string): string {
  let html = escapeHtml(text)

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2">$1</a>',
  )

  return html
}

/** Convert a CV markdown document into an ATS-friendly HTML body. */
export function markdownToHtml(markdown: string): string {
  const lines = markdown.split(/\r?\n/)
  const out: string[] = []
  let list: 'ul' | null = null
  let listDepth = -1
  let paragraph: string[] = []

  const closeParagraph = () => {
    if (paragraph.length > 0) {
      out.push(`<p>${renderInline(paragraph.join(' '))}</p>`)
      paragraph = []
    }
  }

  const closeList = () => {
    if (!list) return
    // Close every list still open.
    while (listDepth > 0) {
      out.push('</ul>')
      out.push('</li>')
      listDepth -= 1
    }
    out.push(`</${list}>`)
    list = null
    listDepth = -1
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '')

    if (line.trim() === '') {
      closeParagraph()
      closeList()
      continue
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    if (heading?.[1] && heading[2] !== undefined) {
      closeParagraph()
      closeList()
      const level = heading[1].length
      out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`)
      continue
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      closeParagraph()
      closeList()
      out.push('<hr />')
      continue
    }

    // A list item, possibly nested (two leading spaces).
    const item = /^(\s*)-\s+(.*)$/.exec(line)
    if (item?.[1] !== undefined && item[2] !== undefined) {
      closeParagraph()
      const depth = Math.min(1, Math.floor(item[1].length / 2))

      if (listDepth === -1) {
        list = 'ul'
        out.push('<ul>')
        listDepth = 0
      } else if (depth > listDepth) {
        // A nested list opens inside the previous item.
        const last = out.length - 1
        if (last >= 0 && out[last] !== undefined) {
          out[last] = out[last].replace(/<\/li>$/, '<ul>')
        }
        listDepth = depth
      } else if (depth < listDepth) {
        out.push('</ul>')
        out.push('</li>')
        listDepth = depth
      }

      out.push(`<li>${renderInline(item[2])}</li>`)
      continue
    }

    paragraph.push(line.trim())
  }

  closeParagraph()
  closeList()

  return out.join('\n')
}

/**
 * The print stylesheet of the generated PDF.
 *
 * A4, one column, 10.5pt, generous margins and no page furniture: this is
 * the layout an applicant tracking system expects and a recruiter can scan.
 */
export const CV_PDF_STYLES = `
  @page { size: A4; margin: 13mm 13mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 9.8pt;
    line-height: 1.34;
    color: #1a1a1a;
  }
  h1 { font-size: 18pt; margin: 0 0 1.5mm; letter-spacing: -0.01em; }
  h2 {
    font-size: 11pt;
    margin: 4mm 0 1.5mm;
    padding-bottom: 0.8mm;
    border-bottom: 1px solid #999;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  h3 { font-size: 10pt; margin: 2.4mm 0 0.8mm; }
  p { margin: 0 0 1.6mm; }
  ul { margin: 0 0 1.6mm; padding-left: 4.5mm; }
  li { margin: 0 0 0.6mm; }
  li ul { margin: 1mm 0 0; }
  a { color: #1a1a1a; text-decoration: underline; }
  code {
    font-family: 'DejaVu Sans Mono', ui-monospace, Menlo, monospace;
    font-size: 9.5pt;
    background: #f2f2f2;
    padding: 0 1mm;
  }
  hr { border: none; border-top: 1px solid #ccc; margin: 4mm 0; }
  h2, h3 { break-after: avoid; page-break-after: avoid; }
  li { break-inside: avoid; page-break-inside: avoid; }
`

/** Wrap a converted body into a complete, printable HTML document. */
export function toHtmlDocument(bodyHtml: string, title: string): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>${CV_PDF_STYLES}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`
}
