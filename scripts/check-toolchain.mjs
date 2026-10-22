#!/usr/bin/env node
/**
 * scripts/check-toolchain.mjs — el runtime local debe ser el runtime del proyecto.
 *
 * La regla de AGENTS.md ("el Node ambiental no es el runtime del proyecto") no
 * es una convención: se verifica. Este script compara la versión de Node con
 * la que fija `.node-version` (el mismo archivo que lee fnm y que el CI lee con
 * `node-version-file`) y sale con código 1 si no coinciden.
 *
 * No se apoya en `engines.node` de package.json: pnpm no aplica el `engines`
 * del proyecto raíz (solo npm lo hace), así que esa declaración es
 * documentary, no un guard. Aquí el guard es real.
 *
 * Uso: `node scripts/check-toolchain.mjs` (o `pnpm run check:toolchain`).
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const expected = readFileSync(resolve(ROOT, '.node-version'), 'utf8').trim()
const current = process.versions.node
const currentMajor = current.split('.')[0]
const expectedMajor = expected.split('.')[0]

if (currentMajor !== expectedMajor) {
  console.error(`✗ Toolchain incorrecto: Node ${current} y el proyecto fija Node ${expected} (.node-version).`)
  console.error('  Usa: fnm use   (o: fnm exec --using=' + expectedMajor + ' <comando>)')
  process.exit(1)
}

console.log(`✓ Toolchain correcto: Node ${current} (proyecto: ${expected})`)
