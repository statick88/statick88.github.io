/**
 * Tailwind configuration.
 *
 * This file declares NO independent palette. Every colour resolves to a CSS
 * custom property owned by src/index.css, so the palette has exactly one
 * source of truth.
 *
 * Colours are expressed as `rgb(var(--token-rgb) / <alpha-value>)` because
 * 135 utilities in src/ use Tailwind opacity modifiers (`bg-cyan-500/20`,
 * `border-cyan-500/30`, ...). The `<alpha-value>` placeholder is what lets
 * Tailwind inject an alpha channel; a bare `var(--token)` would silently drop
 * every `/NN` modifier.
 */

/** Build a Tailwind colour scale from space-separated RGB channel tokens. */
const scale = (steps) =>
  Object.fromEntries(
    steps.map(([shade, token]) => [
      shade,
      `rgb(var(--color-${token}-rgb) / <alpha-value>)`,
    ]),
  )

/** Single-colour semantic scale: every shade resolves to the one token. */
const flat = (token, shades) => scale(shades.map((shade) => [shade, token]))

/**
 * Accent ramp. Three tones only, ordered light → dark:
 *   hover (#60a5fa) → primary (#3b82f6) → dim (#1e40af)
 *
 * `--color-primary-dim` measures 2.26:1 on --color-bg, so it backs fills,
 * borders and pressed states only — never text, never a focus ring.
 */
const ACCENT = [
  ['100', 'primary-hover'],
  ['200', 'primary-hover'],
  ['300', 'primary-hover'],
  ['400', 'primary'],
  ['500', 'primary'],
  ['600', 'primary-dim'],
  ['700', 'primary-dim'],
  ['800', 'primary-dim'],
  ['900', 'primary-dim'],
]

const SHADES_50_900 = [
  '50', '100', '200', '300', '400', '500', '600', '700', '800', '900',
]

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Class strategy, not Tailwind's default `prefers-color-scheme`.
  //
  // AppContext drives the theme by toggling a `dark` class on <html>
  // (src/context/AppContext.tsx) and the app is dark-only by design. Under the
  // default media strategy those ~60 `dark:` utilities ignored that class and
  // followed the OS instead, so on a light-mode OS the `text-gray-900`
  // headings rendered at #111827 on a #12121a card — a 1.09:1 contrast ratio,
  // far below AA — and the theme toggle did nothing.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // The cyan utilities were the old neon identity; they now resolve to
        // the same deep blue as `blue`, so no component edit is needed.
        cyan: scale(ACCENT),
        blue: scale(ACCENT),

        green: flat('success', SHADES_50_900),
        emerald: flat('success', SHADES_50_900),

        yellow: flat('warning', SHADES_50_900),
        amber: flat('warning', SHADES_50_900),
        orange: flat('warning', SHADES_50_900),

        red: flat('danger', SHADES_50_900),

        // The reference site's rose/mauve is explicitly not ours; purple
        // utilities fold into the secondary accent.
        purple: flat('secondary', SHADES_50_900),

        // Neutral ramp, kept full-range: components ship light/dark pairs and
        // print overrides against these utilities.
        gray: scale(SHADES_50_900.map((shade) => [shade, `neutral-${shade}`])),
        slate: scale(SHADES_50_900.map((shade) => [shade, `neutral-${shade}`])),

        primary: {
          DEFAULT: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover-rgb) / <alpha-value>)',
          dim: 'rgb(var(--color-primary-dim-rgb) / <alpha-value>)',
        },
        secondary: 'rgb(var(--color-secondary-rgb) / <alpha-value>)',
        success: 'rgb(var(--color-success-rgb) / <alpha-value>)',
        warning: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
        danger: 'rgb(var(--color-danger-rgb) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-bg-rgb) / <alpha-value>)',
          alt: 'rgb(var(--color-bg-alt-rgb) / <alpha-value>)',
          deep: 'rgb(var(--color-bg-deep-rgb) / <alpha-value>)',
        },
        content: {
          DEFAULT: 'rgb(var(--color-text-rgb) / <alpha-value>)',
          light: 'rgb(var(--color-text-light-rgb) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted-rgb) / <alpha-value>)',
        },
      },

      // Shape scale: 8 / 12 / 16 + pill, from the CSS tokens.
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-sm)',
        md: 'var(--radius-sm)',
        lg: 'var(--radius-sm)',
        xl: 'var(--radius-md)',
        '2xl': 'var(--radius-lg)',
        '3xl': 'var(--radius-lg)',
        full: 'var(--radius-pill)',
      },

      // Fluid type. `hero` and `section` are the clamp() scale; the
      // intermediate steps keep card-level headings on a fixed rhythm.
      fontSize: {
        hero: ['var(--text-hero)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        section: ['var(--text-section)', { lineHeight: '1.2' }],
      },

      maxWidth: {
        content: 'var(--container-max)',
      },

      spacing: {
        section: 'var(--section-pad)',
      },

      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
