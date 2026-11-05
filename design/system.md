# Design system

Current cyan-terminal system synchronized from `src/index.css`, `tailwind.config.js`, and legacy `styles.css`. The React application uses `src/index.css`; `styles.css` belongs to the legacy document.

## Colors and metrics

Source: `src/index.css`. First occurrence is light, second is dark. RGB values are space-separated.

| Token | Value |
| --- | --- |
| `ct-base` | `233 242 248` |
| `ct-panel` | `250 253 255` |
| `ct-surface-0` | `237 246 250` |
| `ct-surface-1` | `226 239 247` |
| `ct-surface-2` | `210 229 240` |
| `ct-line` | `202 222 234` |
| `ct-line-strong` | `159 192 210` |
| `ct-text` | `15 35 52` |
| `ct-subtext-1` | `49 74 92` |
| `ct-subtext-0` | `76 103 122` |
| `ct-accent` | `0 102 130` |
| `ct-accent-bright` | `0 105 136` |
| `ct-accent-dim` | `222 243 250` |
| `ct-accent-contrast` | `255 255 255` |
| `ct-navy` | `5 19 37` |
| `ct-navy-soft` | `17 46 67` |
| `ct-ok` | `30 142 90` |
| `ct-warn` | `180 121 27` |
| `ct-danger` | `192 57 43` |
| `ct-info` | `0 102 130` |
| `ct-blue-50` | `236 254 255` |
| `ct-blue-100` | `207 250 254` |
| `ct-blue-200` | `165 243 252` |
| `ct-blue-300` | `103 232 249` |
| `ct-blue-400` | `34 211 238` |
| `ct-blue-500` | `6 182 212` |
| `ct-blue-600` | `8 145 178` |
| `ct-blue-700` | `14 116 144` |
| `ct-blue-800` | `21 94 117` |
| `ct-blue-900` | `22 78 99` |
| `ct-steel-50` | `248 250 252` |
| `ct-steel-100` | `241 245 249` |
| `ct-steel-200` | `226 232 240` |
| `ct-steel-300` | `199 208 220` |
| `ct-steel-400` | `148 161 178` |
| `ct-steel-500` | `110 124 143` |
| `ct-steel-600` | `82 94 110` |
| `ct-steel-700` | `61 71 84` |
| `ct-steel-800` | `43 51 61` |
| `ct-steel-900` | `30 36 43` |
| `ct-jade-50` | `235 248 241` |
| `ct-jade-100` | `209 240 226` |
| `ct-jade-200` | `165 221 196` |
| `ct-jade-300` | `118 196 158` |
| `ct-jade-400` | `62 173 124` |
| `ct-jade-500` | `30 142 90` |
| `ct-jade-600` | `24 113 72` |
| `ct-jade-700` | `19 85 54` |
| `ct-jade-800` | `15 64 41` |
| `ct-jade-900` | `12 48 31` |
| `ct-red-50` | `253 240 239` |
| `ct-red-100` | `250 221 219` |
| `ct-red-200` | `244 186 182` |
| `ct-red-300` | `231 143 137` |
| `ct-red-400` | `216 97 91` |
| `ct-red-500` | `192 57 43` |
| `ct-red-600` | `160 45 34` |
| `ct-red-700` | `128 36 27` |
| `ct-red-800` | `99 30 24` |
| `ct-red-900` | `76 24 20` |
| `ct-slate-50` | `248 250 252` |
| `ct-slate-100` | `241 245 249` |
| `ct-slate-200` | `226 232 240` |
| `ct-slate-300` | `203 211 223` |
| `ct-slate-400` | `148 161 178` |
| `ct-slate-500` | `110 124 143` |
| `ct-slate-600` | `82 94 110` |
| `ct-slate-700` | `61 71 84` |
| `ct-slate-800` | `43 51 61` |
| `ct-slate-900` | `30 36 43` |
| `ct-slate-950` | `20 24 29` |
| `ct-violet-50` | `246 244 252` |
| `ct-violet-100` | `236 232 249` |
| `ct-violet-200` | `216 208 242` |
| `ct-violet-300` | `188 175 231` |
| `ct-violet-400` | `150 132 210` |
| `ct-violet-500` | `112 90 172` |
| `ct-violet-600` | `90 72 138` |
| `ct-violet-700` | `71 57 110` |
| `ct-violet-800` | `56 45 87` |
| `ct-violet-900` | `44 35 68` |
| `ct-amber-50` | `253 247 235` |
| `ct-amber-100` | `249 239 219` |
| `ct-amber-200` | `245 222 180` |
| `ct-amber-300` | `238 197 133` |
| `ct-amber-400` | `221 167 79` |
| `ct-amber-500` | `184 134 42` |
| `ct-amber-600` | `148 106 32` |
| `ct-amber-700` | `115 82 25` |
| `ct-amber-800` | `87 63 21` |
| `ct-amber-900` | `66 48 18` |
| `ct-sand-50` | `253 249 238` |
| `ct-sand-100` | `249 242 224` |
| `ct-sand-200` | `244 230 193` |
| `ct-sand-300` | `233 210 153` |
| `ct-sand-400` | `214 183 105` |
| `ct-sand-500` | `182 149 64` |
| `ct-sand-600` | `145 116 45` |
| `ct-sand-700` | `112 88 33` |
| `ct-sand-800` | `85 67 26` |
| `ct-sand-900` | `65 52 22` |
| `ct-aside-width` | `320px` |
| `ct-topbar-height` | `48px` |
| `ct-radius` | `3px` |
| `ct-radius-sm` | `2px` |
| `ct-radius-card` | `20px` |
| `ct-radius-dialog` | `24px` |
| `ct-base` | `3 10 23` |
| `ct-panel` | `7 18 35` |
| `ct-surface-0` | `10 25 44` |
| `ct-surface-1` | `14 33 54` |
| `ct-surface-2` | `19 44 65` |
| `ct-line` | `23 51 72` |
| `ct-line-strong` | `39 80 103` |
| `ct-text` | `225 242 250` |
| `ct-subtext-1` | `166 196 213` |
| `ct-subtext-0` | `126 161 182` |
| `ct-accent` | `34 211 238` |
| `ct-accent-bright` | `103 232 249` |
| `ct-accent-dim` | `9 46 64` |
| `ct-accent-contrast` | `3 10 23` |
| `ct-navy` | `4 14 29` |
| `ct-navy-soft` | `14 37 57` |
| `ct-ok` | `74 197 134` |
| `ct-warn` | `226 172 82` |
| `ct-danger` | `230 108 96` |
| `ct-info` | `56 189 248` |

## Typography

Source: `tailwind.config.js` and `src/index.css`. Inter/system sans for prose; Fira Code/JetBrains Mono/ui-monospace for labels and data. Body: 14px, line-height 1.6. Modern hero name: clamp(44px, 7vw, 84px), line-height .98; role: 13px; introduction: clamp(18px, 2vw, 22px). Catalog heading: clamp(28px, 4vw, 46px). Dialog heading: 30px. Modern section card heading: 22px.

## Components and layout

Sources: `src/index.css`, `src/components/layout/AppLayout.tsx`, `src/App.tsx`. The modern app has no permanent sidebar and retains full viewport width with clamp(20px, 5vw, 72px) readable gutters. The default standalone layout still accepts an identity aside and collapses at 900px. Modern cards use the 20px radius, dialogs 24px; existing inner document panels retain 3px/2px. IdentityColumn is rendered once inside the summary dialog and remains part of complete printing. Modal identity uses semantic ct-text, ct-subtext-1 and ct-accent-bright instead of legacy dark-sidebar whites; printing forces identity/contact/role to black. Timeline dots, separators and status chips remain. Focus: 2px accent outline, 2px offset. Reduced motion and dedicated print overrides retained.

## Compact section cards

Sources: `src/components/CompactSection.tsx`, `src/App.tsx`, `src/components/layout/AppLayout.tsx`, `src/hooks/useNavItems.ts`, `src/index.css`.

- Preserve all 15 section IDs and reading order. Each displays a number, title, short factual preview and + More trigger opening one native modal, never an inline expansion.
- Modern cards use surface-0 at 78%, a line border, 20px radius, 28px padding and 20px gaps. At 1200px and above they form three columns; below 1200px two, below 760px one. The three project previews form one balanced desktop row. Mobile retains 44px controls.
- Modern section titles: 22px. Triggers show + Más / + More; below 640px only + remains visible with a descriptive accessible label. The modal's 44px circular − control, Escape or backdrop closes it; visible Tab/Shift+Tab boundaries wrap inside and focus returns to the opener.
- Complete content stays mounted. Navigation and hero/catalog actions share AppLayout's single modal state. No independent active-dialog stores or modal framework.
- Print temporarily closes the top-layer dialog, exposes every full section and nested disclosure without preview/modal chrome, then restores prior state. `public/print.css` gives `.cv-sheet-modern` one full-width document column with no card padding; default standalone sheets retain the legacy two-column print layout. ATS exports and PDF download paths are unchanged.
- The editorial hero shows existing identity, target role, contact, download and curated core stack. Three public project previews use existing adapter data; no credentials, skills or project impacts are invented.

## Modern modal direction

Source: `src/index.css` introduces `--ct-radius-card: 20px` and `--ct-radius-dialog: 24px` for the authorized modern direction. Existing cyan/navy colors and Inter/system sans stay unchanged; mono is reserved for small labels. Large headline, visual section tiles, soft outlines and generous spacing replace the permanent printed-CV sidebar onscreen. Native dialogs will host complete section content; full print and ATS data remain unchanged.

## Visual direction

Inspired by https://www.aprendejavascript.dev/: near-black surfaces, luminous accent and restrained outlines, adapted to cyan and midnight blue without copying branding. Preserve all CV sections and their order. Dark accent: #22d3ee; bright: #67e8f9; base: #030a17; panel: #071223. Light mode uses deep cyan for contrast. No scanlines or flicker.
