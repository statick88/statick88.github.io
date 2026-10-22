/**
 * src/__tests__/design/ats-html-fallback.test.ts
 *
 * El sitio es una SPA: sin JavaScript, el HTML servido no dice quién es
 * Diego, y un ATS lee un documento vacío. Este test fija el contenido del
 * bloque `<noscript>` que se inyecta en el HTML construido.
 *
 * Lee los mismos datos que usa el script (`src/data/cv-data.yaml`), así que
 * el fallback no puede afirmar nada que los datos no digan.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'
import { buildFallbackHtml, injectFallback, type AtsFallbackData } from '@/lib/ats-html-fallback'

const ROOT = resolve(__dirname, '../../..')
const data = load(readFileSync(resolve(ROOT, 'src/data/cv-data.yaml'), 'utf8')) as AtsFallbackData

describe('el HTML que ve un ATS', () => {
  it('lleva el nombre, el contacto literal y los enlaces al CV', () => {
    const html = buildFallbackHtml(data, 'es')
    expect(html).toContain('Diego Medardo Saavedra García')
    expect(html).toContain('mailto:dsaavedra88@gmail.com')
    expect(html).toContain('dsaavedra88@gmail.com')
    expect(html).toContain('+593 980192790')
    expect(html).toContain('/cv-es.pdf')
    expect(html).toContain('/cv-en.pdf')
  })

  it('lleva la experiencia, los servicios y las referencias', () => {
    const html = buildFallbackHtml(data, 'es')
    expect(html).toContain('Experiencia')
    expect(html).toContain('Servicios')
    expect(html).toContain('Referencias')
    for (const name of data.practice?.referenceNames ?? []) {
      expect(html).toContain(name)
    }
  })

  it('lleva los eventos, para que la sección no exista solo en la SPA', () => {
    const html = buildFallbackHtml(data, 'es')
    expect(html).toContain('Eventos')
    for (const event of data.events ?? []) {
      expect(html).toContain(event.name)
      expect(html).toContain(event.period)
      expect(html).toContain(event.url)
    }
  })

  it('lleva los eventos en inglés cuando el documento se pide en inglés', () => {
    const html = buildFallbackHtml(data, 'en')
    for (const event of data.events ?? []) {
      const result = typeof event.result === 'string' ? event.result : (event.result?.en ?? '')
      expect(html).toContain(result)
    }
  })

  it('va dentro de noscript y antes de </body>', () => {
    const doc = injectFallback(
      '<html><body><div id="root"></div></body></html>',
      buildFallbackHtml(data, 'es'),
    )
    expect(doc).toContain('<noscript>')
    expect(doc.indexOf('<noscript>')).toBeLessThan(doc.indexOf('</body>'))
  })

  it('no se inyecta dos veces', () => {
    const once = injectFallback(
      '<html><body></body></html>',
      buildFallbackHtml(data, 'es'),
    )
    const twice = injectFallback(once, buildFallbackHtml(data, 'es'))
    expect(twice).toBe(once)
  })
})
