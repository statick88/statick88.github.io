/**
 * src/__tests__/design/cv-markdown.test.ts
 *
 * Unit tests for the CV markdown → HTML converter.
 *
 * The generated CVs are the artifacts recruiters download and that ATS parsers
 * read, so the conversion has to be predictable: real headings, real lists,
 * real links and no HTML injection.
 */

import { describe, it, expect } from 'vitest'
import { markdownToHtml } from '@/lib/cv-markdown'

describe('markdownToHtml', () => {
  it('renders headings as real heading elements', () => {
    const html = markdownToHtml('# Nombre\n\n## Experiencia\n\n### Empresa')

    expect(html).toContain('<h1>Nombre</h1>')
    expect(html).toContain('<h2>Experiencia</h2>')
    expect(html).toContain('<h3>Empresa</h3>')
  })

  it('renders unordered lists', () => {
    const html = markdownToHtml('- React\n- Python\n- Docker')

    expect(html).toContain('<ul>')
    expect(html).toContain('<li>React</li>')
    expect(html).toContain('<li>Docker</li>')
  })

  it('renders nested lists', () => {
    const html = markdownToHtml('- Perfiles:\n  - GitHub\n  - LinkedIn')

    expect(html).toContain('<ul>')
    expect(html).toMatch(/<li>Perfiles:\s*<ul>/)
  })

  it('renders bold, italic and inline code', () => {
    const html = markdownToHtml('**React**: *avanzado* y `Docker`')

    expect(html).toContain('<strong>React</strong>')
    expect(html).toContain('<em>avanzado</em>')
    expect(html).toContain('<code>Docker</code>')
  })

  it('renders links with the text and the target', () => {
    const html = markdownToHtml('- [Ver proyecto](https://github.com/statick88)')

    expect(html).toContain('href="https://github.com/statick88"')
    expect(html).toContain('>Ver proyecto</a>')
  })

  it('escapes HTML in the source so the document cannot inject markup', () => {
    const html = markdownToHtml('<script>alert(1)</script>')

    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('keeps paragraphs separated by blank lines', () => {
    const html = markdownToHtml('Primer parrafo.\n\nSegundo parrafo.')

    expect(html).toContain('<p>Primer parrafo.</p>')
    expect(html).toContain('<p>Segundo parrafo.</p>')
  })

  it('never emits a table, an image or a column layout', () => {
    const html = markdownToHtml('# Titulo\n\n- Uno\n- Dos\n\n![foto](x.png)')

    expect(html).not.toContain('<table')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('column-count')
  })
})
