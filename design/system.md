# STATICK editorial design system

Synchronized from `src/index.css` and `tailwind.config.js`. The React portfolio uses this system; legacy `styles.css` is not its runtime stylesheet. Troko is visual inspiration, not the site's brand or an affiliation.

## Colors
Source: `src/index.css :root / html.dark`. RGB triples preserve existing Tailwind semantic contracts.

| Token | Light | Dark |
| --- | --- | --- |
| `ct-base` | 245 241 233 | 15 15 15 |
| `ct-panel` | 252 250 245 | 25 27 23 |
| `ct-surface-0` | 236 231 220 | 33 36 29 |
| `ct-surface-1` | 228 223 211 | 42 46 36 |
| `ct-surface-2` | 216 212 202 | 54 60 46 |
| `ct-line` | 204 199 187 | 63 69 54 |
| `ct-line-strong` | 148 144 131 | 106 115 91 |
| `ct-text` | 15 15 15 | 245 241 233 |
| `ct-subtext-1` | 63 65 57 | 212 211 198 |
| `ct-subtext-0` | 89 91 80 | 176 180 160 |
| `ct-accent` | 63 79 42 | 163 255 106 |
| `ct-accent-bright` | 54 70 35 | 187 255 146 |
| `ct-accent-dim` | 229 239 215 | 41 57 31 |
| `ct-accent-contrast` | 245 241 233 | 15 15 15 |
| `ct-navy` | 15 15 15 | 15 15 15 |
| `ct-navy-soft` | 40 46 32 | 40 46 32 |
| `ct-ok` | 48 104 40 | 163 255 106 |
| `ct-warn` | 125 83 17 | 238 197 133 |
| `ct-danger` | 161 47 43 | 244 143 137 |
| `ct-info` | 63 79 42 | 188 175 231 |

The unchanged compatibility color ramps remain in `src/index.css`; new components use semantic roles only. Olive provides readable light-theme actions; lime is reserved for dark-theme actions. Status remains textual, not color-only.

## Typography
Sources: `src/index.css`, `tailwind.config.js`. Body: Inter/system sans, 14px/1.6. Hero: Arial Black/Inter/system sans, clamp(44px, 6.5vw, 92px), 900 weight, 1.02 line-height. Section headings: Inter/system sans, 800 weight. Labels: Fira Code/ui-monospace; no new remote fonts. Artboards use system-only sans/monospace fallbacks.

## Spacing, radius and shadows
Source: `src/index.css`. 8px rhythm; hero 80px/64px vertical padding (48px top on mobile); cards 28px padding, 20px gap and radius; dialogs 24px radius. Actions have 999px radius and minimum 48px height. Focus outline: 2px accent with 2px offset. Hero portrait: clamp(160px, 18vw, 224px) square with the existing circular crop; summary/print dimensions unchanged. Portrait shadow: 12px 12px accent-dim. Cards have no shadows.

## Components and layout
Sources: `src/index.css`, `src/components/CompactSection.tsx`, `src/components/layout/AppLayout.tsx`.
- Full-width editorial hero, existing portrait, real name, role, contact, CV downloads and stack.
- Three project cards and 15 modal-backed sections retain IDs, content and shared native dialog state. Six named reading groups contain their own three/two/one-column grids at 1200px/760px. Primary anchors and 15 legacy modal shortcuts occupy two scrollable rows in the 88px top bar. Explicit 44px up/down controls focus neighboring group headings without global keyboard handlers. Source: `src/config/system-navigation.ts`, `src/components/SectionPager.tsx`, `src/index.css`.
- Charcoal/cream surfaces, strong headings and quiet numeric/mono labels; olive/lime distinguishes actions.
- Preserve language/theme controls, native dialog focus/escape behavior and all PDF/ATS paths.
- Screen-only styling never hides records from printing. Honor reduced motion; no page-flip animation is required to read content.

## Learning manual
Source: `src/components/LearningManual.css` and `src/components/LearningManual.tsx`. The reader locally reuses the light palette in both surrounding themes, with a 20px frame radius, 24px inset, 48px index/actions and a contents leaf plus a record leaf on desktop; mobile prioritizes the record and a labeled index selector. Explicit previous/next controls, keyboard interaction inside the manual only, list mode and full-document printing preserve access to long catalogs.

Sources: `src/components/BookPageTurn.tsx` and `BookPageTurn.css`. Certifications and courses opt into equal paper leaves with a central bound-spine gradient and layered page-edge shadows using the existing panel/line/text tokens. A two-sided sheet rotates around its left edge over 650ms, with reversed rotation for Previous and separate front/back faces. Its inert, aria-hidden, non-printing snapshot never replaces the actual current record or duplicate its accessible links. A 750ms fallback removes canceled sheets. Generic manual consumers remain static by default; reduced motion bypasses the sheet and complete-list/print modes remain unanimated.
