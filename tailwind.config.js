/**
 * CONSOLE palette — "system settings" aesthetic with a dark-blue primary.
 *
 * Two colour surfaces live here:
 *
 * 1. `ct` — the semantic scale. Every token is a CSS custom property defined in
 *    `src/index.css`, exposed as `rgb(var(--ct-*) / <alpha-value>)` so alpha
 *    modifiers keep working. New code should prefer these names: they say what
 *    a colour *means* instead of which hue it happens to be.
 *
 * 2. The classic Tailwind families (cyan/green/blue/red/gray/purple/orange/amber)
 *    are re-mapped onto the console ramps so the existing component tree keeps
 *    resolving without rewriting every class name:
 *
 *      cyan   -> primary blue ramp   (accent, focus, active states)
 *      green  -> jade                (verified / success)
 *      blue   -> steel               (informational / secondary)
 *      red    -> danger              (errors, destructive states)
 *      gray   -> cool slate neutral  (text hierarchy, surfaces)
 *      purple -> violet              (decorative tier accent)
 *      orange -> amber               (decorative tier accent)
 *      amber  -> sand                (decorative tier accent)
 */

const token = (name) => `rgb(var(--ct-${name}) / <alpha-value>)`

/** Build a Tailwind colour family (50..900) from CSS custom properties. */
const scale = (family, steps) =>
  Object.fromEntries(steps.map((step) => [String(step), token(`${family}-${step}`)]))

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
const GRAY_STEPS = [...STEPS, 950]

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic scale — prefer these in new code.
        ct: {
          base: token('base'),
          panel: token('panel'),
          surface: {
            0: token('surface-0'),
            1: token('surface-1'),
            2: token('surface-2'),
          },
          line: {
            DEFAULT: token('line'),
            strong: token('line-strong'),
          },
          text: token('text'),
          subtext: {
            0: token('subtext-0'),
            1: token('subtext-1'),
          },
          accent: {
            DEFAULT: token('accent'),
            bright: token('accent-bright'),
            dim: token('accent-dim'),
            contrast: token('accent-contrast'),
          },
          ok: token('ok'),
          warn: token('warn'),
          danger: token('danger'),
          info: token('info'),
        },

        // Legacy families re-mapped onto the console ramps.
        cyan: scale('blue', STEPS),
        green: scale('jade', STEPS),
        blue: scale('steel', STEPS),
        red: scale('red', STEPS),
        gray: scale('slate', GRAY_STEPS),
        purple: scale('violet', STEPS),
        orange: scale('amber', STEPS),
        amber: scale('sand', STEPS),
      },
      fontFamily: {
        // Mono-first console: labels, values, navigation and titles.
        mono: ['Fira Code', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        // Reserved for long-form prose (summaries, project descriptions).
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        console: 'var(--ct-radius)',
      },
      maxWidth: {
        scene: '1080px',
      },
      animation: {
        'fade-in': 'fadeIn 0.18s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
    },
  },
  plugins: [],
}

export default config
