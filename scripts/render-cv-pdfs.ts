/**
 * scripts/render-cv-pdfs.ts — Render the CV PDFs from their markdown
 *
 * The PDFs recruiters download used to be hand-rendered artifacts that nobody
 * regenerated, so they drifted away from the data (an outdated language level
 * shipped for months). This script renders them from the generated markdown
 * with the browser engine already in the toolchain, which makes the pipeline
 * reproducible: change the data, run `pnpm generate:cvs`, the PDFs follow.
 *
 * The layout is deliberately ATS-friendly: A4, one column, real headings, real
 * lists, no images and no page furniture.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'
import { markdownToHtml, toHtmlDocument } from '../src/lib/cv-markdown'

const ROOT = resolve(process.cwd())

interface Target {
  /** Markdown source, relative to the repository root. */
  md: string
  /** PDF output, relative to the repository root. */
  pdf: string
}

const PROFILES = ['developer', 'hacker', 'research', 'docente-facilitador', 'consultor'] as const
const LANGUAGES = ['es', 'en'] as const

const TARGETS: Target[] = [
  ...PROFILES.flatMap((profile) =>
    LANGUAGES.map((lang) => ({ md: `cv-${profile}-${lang}.md`, pdf: `cv-${profile}-${lang}.pdf` })),
  ),
  { md: 'cv-es.md', pdf: 'public/cv-es.pdf' },
  { md: 'cv-en.md', pdf: 'public/cv-en.pdf' },
]

async function main(): Promise<void> {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    for (const target of TARGETS) {
      const markdown = readFileSync(resolve(ROOT, target.md), 'utf8')
      const html = toHtmlDocument(markdownToHtml(markdown), target.md)

      await page.setContent(html, { waitUntil: 'load' })
      await page.pdf({
        path: resolve(ROOT, target.pdf),
        format: 'A4',
        printBackground: true,
        margin: { top: '16mm', bottom: '16mm', left: '15mm', right: '15mm' },
      })

      console.log(`[render] ${target.md} → ${target.pdf}`)
    }
  } finally {
    await browser.close()
  }
}

main().catch((error: unknown) => {
  console.error('[render] Failed to render the CV PDFs:', error)
  process.exit(1)
})
