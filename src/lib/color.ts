/**
 * src/lib/color.ts — alpha helper for token-backed accent colours.
 *
 * Accent colours used to be stored as hex literals and made translucent by
 * string concatenation (`color + '30'`). That trick cannot survive tokenisation:
 * concatenating onto a `var(--token)` produces `var(--token)30`, which is not a
 * valid colour, and the declaration is dropped silently.
 *
 * `color-mix()` replaces it. It accepts any CSS colour — a token reference or a
 * raw hex — so profiles persisted in localStorage from before this change (which
 * still hold a hex string) keep rendering correctly without a migration.
 */

/**
 * Returns `color` at `percent` opacity.
 *
 * @param color  A CSS colour: a token reference (`var(--color-primary)`) or a hex.
 * @param percent Opacity in the range 0-100.
 */
export function withAlpha(color: string, percent: number): string {
  const clamped = Math.min(100, Math.max(0, percent))
  return `color-mix(in srgb, ${color} ${clamped}%, transparent)`
}
