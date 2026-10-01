/**
 * DragonJAR colour language on a dark ground.
 *
 * The component tree uses ~389 standard Tailwind colour classes (`text-cyan-400`,
 * `bg-green-500`, `border-cyan-500`, `text-gray-400`, ...). Rather than rewriting
 * component class names, the palette is re-skinned from underneath: every colour
 * family below is expressed in `rgb(var(--token) / <alpha-value>)` form and the
 * matching custom properties live in `src/index.css`.
 *
 * Because the channel values are space-separated triples, existing alpha modifiers
 * (`bg-cyan-500/20`, `border-green-500/30`, `shadow-cyan-500/30`) keep working
 * untouched — Tailwind substitutes `<alpha-value>` into the third channel.
 *
 * Semantic mapping (verified against real usages under `src/components`):
 *   cyan   -> DragonJAR brand orange  (#ff6900). The dominant accent slot:
 *             project/hover titles, scroll-spy bar, CTAs, focus rings, borders.
 *   green  -> calmer jade. Success/verified: cert status dots, native-language
 *             badges, skill "Master", "Diplomado", availability dot. Kept green so
 *             checkmarks still read as checkmarks.
 *   blue   -> muted steel. Secondary/informational: contact links, Bachelor tier,
 *             C1 language, "Projects Audited" stat.
 *   red    -> DragonJAR alert red (#cf2e2e, brightened for dark ground):
 *             "Doctorado" tier, ErrorBoundary, destructive states.
 *   gray   -> warm neutral type/surface scale (DragonJAR runs warm greys, not cool
 *             blue-greys). Lightness ordering preserved so contrast assumptions hold.
 *   purple -> muted plum. Decorative tier accent (B2, Master/Intermediate, Repos).
 *   orange -> bronze. Decorative tier accent (A2 language) — deliberately NOT the
 *             brand orange, so it cannot be confused with the cyan/brand slot.
 *   amber  -> warm sand. Decorative tier accent ("Certificado").
 */
const token = (name) => `rgb(var(--dj-${name}) / <alpha-value>)`

/** Build a Tailwind colour family (50..950) from CSS custom properties. */
const scale = (family, steps) =>
  Object.fromEntries(steps.map((step) => [String(step), token(`${family}-${step}`)]))

const ORANGE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
const GRAY_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand family, rooted at DragonJAR's signature orange #ff6900.
        // Replaces the old neon-cyan accent slot.
        cyan: scale('orange', ORANGE_STEPS),

        // Success / verified. Jade rather than neon #00cc33.
        green: scale('green', ORANGE_STEPS),

        // Secondary / informational. Desaturated steel.
        blue: scale('blue', ORANGE_STEPS),

        // Danger / error / destructive. DragonJAR #cf2e2e, brightened for dark.
        red: scale('red', ORANGE_STEPS),

        // Neutral type + surface scale, warm-shifted.
        gray: scale('gray', GRAY_STEPS),

        // Decorative tier accents.
        purple: scale('purple', ORANGE_STEPS),
        orange: scale('bronze', ORANGE_STEPS),
        amber: scale('amber', ORANGE_STEPS),

        // Replaces the dead neon `cyber` palette (zero class usages; it was the
        // exact kind of stale token that lets a palette regress later).
        dragonjar: {
          brand: '#ff6900',
          brandDark: '#d95c00',
          brandDeep: '#a84a00',
          alert: '#cf2e2e',
          ink: '#181818',
          surface: '#fafafa',
          hairline: '#eaeaea',
          white: '#ffffff',
        },
      },
      fontFamily: {
        // Kept open-source: Univia Pro is proprietary and cannot be licensed.
        // JetBrains Mono was never actually fetched (index.html only preloads
        // Inter + Fira Code), so a real system-mono fallback is appended to
        // close the gap rather than leaving a phantom family in the stack.
        mono: ['Fira Code', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // Was hardcoding #00ffff, which survives any palette override because it
        // is a literal, not a Tailwind colour token. Re-pointed at the new accent.
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(var(--dj-orange-500) / 0.35), 0 0 10px rgb(var(--dj-orange-500) / 0.2)' },
          '100%': { boxShadow: '0 0 20px rgb(var(--dj-orange-500) / 0.45), 0 0 30px rgb(var(--dj-orange-500) / 0.25)' },
        },
      },
    },
  },
  plugins: [],
}

export default config