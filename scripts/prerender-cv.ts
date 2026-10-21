/**
 * scripts/prerender-cv.ts — inyecta el fallback legible en el HTML construido.
 *
 * Corre después de `vite build`: lee los datos (la misma fuente que usa el
 * export ATS) y escribe `dist/index.html` con un bloque `<noscript>` que
 * contiene el CV completo. Con JavaScript activo no cambia nada de lo que ve
 * un humano; sin JavaScript, el documento deja de estar vacío.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'
import { buildFallbackHtml, injectFallback, type AtsFallbackData } from '../src/lib/ats-html-fallback'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const YAML_PATH = resolve(ROOT, 'src/data/cv-data.yaml')
const DIST_HTML = resolve(ROOT, 'dist/index.html')

function main(): void {
  if (!existsSync(DIST_HTML)) {
    console.error('[prerender] no existe dist/index.html: ejecuta el build antes')
    process.exit(1)
  }
  const data = load(readFileSync(YAML_PATH, 'utf8')) as AtsFallbackData
  const html = readFileSync(DIST_HTML, 'utf8')
  const fallback = buildFallbackHtml(data, 'es')
  writeFileSync(DIST_HTML, injectFallback(html, fallback))
  console.log(`[prerender] fallback inyectado en dist/index.html (${fallback.length} bytes)`)
}

main()
