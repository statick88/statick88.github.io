/**
 * src/data/contributions.ts — Upstream contributions and published plugins
 *
 * The evidence for the "aportes" section: pull requests opened against
 * third-party repositories (not the author's own) and the plugins published
 * for the Omarchy shell.
 *
 * Counts were verified against the GitHub search API for `author:statick88`
 * (133 unique pull requests, deduplicated by URL, of which 56 target a
 * repository the author does not own).
 */

export interface Contribution {
  /** Repository the pull request was opened against. */
  repo: string
  /** Pull request number. */
  number: number
  /** Pull request title. */
  title: string
  /** Pull request URL. */
  url: string
  /** Whether the pull request was merged. */
  merged: boolean
  /** Still open upstream. */
  open: boolean
  /** Date the pull request was opened (YYYY-MM-DD). */
  date: string
}

export interface UpstreamTarget {
  /** `owner/repository`. */
  repo: string
  /** Project URL. */
  url: string
  /** What this target is, in one line. */
  kind: { es: string; en: string }
  /** Pull requests opened against this repository. */
  count: number
  /** Representative pull requests. */
  contributions: Contribution[]
}

export interface PublishedPlugin {
  /** Plugin name. */
  name: string
  /** Repository. */
  repo: string
  /** Repository URL. */
  url: string
  /** What the plugin does. */
  description: { es: string; en: string }
}

export const UPSTREAM_TARGETS: UpstreamTarget[] = [
  {
    repo: 'Gentleman-Programming/gentle-ai',
    url: 'https://github.com/Gentleman-Programming/gentle-ai',
    kind: {
      es: 'Framework de agentes con memoria, SDD y revisión por recibos',
      en: 'Agent framework with memory, SDD and receipt-driven review',
    },
    count: 11,
    contributions: [
      {
        repo: 'Gentleman-Programming/gentle-ai',
        number: 5472,
        title: 'fix(opencode): skip legacy community plugins on V2',
        url: 'https://github.com/Gentleman-Programming/gentle-ai/pull/5472',
        merged: false,
        open: true,
        date: '2026-10-12',
      },
      {
        repo: 'Gentleman-Programming/gentle-ai',
        number: 4117,
        title: 'fix(update): accept Homebrew-managed symlinks that point outside the prefix',
        url: 'https://github.com/Gentleman-Programming/gentle-ai/pull/4117',
        merged: false,
        open: true,
        date: '2026-09-03',
      },
      {
        repo: 'Gentleman-Programming/gentle-ai',
        number: 4025,
        title: "feat: add 'gentle-ai doctor' command for environment diagnostics",
        url: 'https://github.com/Gentleman-Programming/gentle-ai/pull/4025',
        merged: false,
        open: true,
        date: '2026-09-01',
      },
      {
        repo: 'Gentleman-Programming/gentle-ai',
        number: 3979,
        title: 'fix: use __PROMPT_FILE__ placeholders for all SDD phase prompts',
        url: 'https://github.com/Gentleman-Programming/gentle-ai/pull/3979',
        merged: false,
        open: false,
        date: '2026-08-31',
      },
      {
        repo: 'Gentleman-Programming/gentle-ai',
        number: 2899,
        title: 'fix: skip CodeGraph install on Android/Termux platforms',
        url: 'https://github.com/Gentleman-Programming/gentle-ai/pull/2899',
        merged: false,
        open: true,
        date: '2026-08-10',
      },
      {
        repo: 'Gentleman-Programming/gentle-ai',
        number: 2821,
        title: 'fix(install): add preflight check for agent runtimes',
        url: 'https://github.com/Gentleman-Programming/gentle-ai/pull/2821',
        merged: false,
        open: false,
        date: '2026-08-08',
      },
    ],
  },
  {
    repo: 'omacom/omarchy-mac',
    url: 'https://github.com/omacom/omarchy-mac',
    kind: {
      es: 'Setup opinionado de Arch/Hyprland para Mac Apple Silicon',
      en: 'Opinionated Arch/Hyprland setup for Apple Silicon Macs',
    },
    count: 25,
    contributions: [
      {
        repo: 'omacom/omarchy-mac',
        number: 288,
        title: 'fix(install): force package db refresh and fail fast on sync errors',
        url: 'https://github.com/omacom/omarchy-mac/pull/288',
        merged: false,
        open: false,
        date: '2026-08-27',
      },
      {
        repo: 'omacom/omarchy-mac',
        number: 287,
        title: 'fix(wifi): reload brcmfmac on resume when BCM4387/4378 wedges',
        url: 'https://github.com/omacom/omarchy-mac/pull/287',
        merged: false,
        open: false,
        date: '2026-08-27',
      },
      {
        repo: 'omacom/omarchy-mac',
        number: 286,
        title: 'fix(codex): use never for ask-for-approval and improve diagnostics',
        url: 'https://github.com/omacom/omarchy-mac/pull/286',
        merged: false,
        open: false,
        date: '2026-08-27',
      },
      {
        repo: 'omacom/omarchy-mac',
        number: 285,
        title: 'feat(keyboard-backlight): add Setup prompt gated on kbd_backlight LED',
        url: 'https://github.com/omacom/omarchy-mac/pull/285',
        merged: false,
        open: false,
        date: '2026-08-27',
      },
      {
        repo: 'omacom/omarchy-mac',
        number: 283,
        title: 'feat(keyboard-backlight): add get/set percentage commands to CLI',
        url: 'https://github.com/omacom/omarchy-mac/pull/283',
        merged: false,
        open: false,
        date: '2026-08-27',
      },
      {
        repo: 'omacom/omarchy-mac',
        number: 274,
        title: 'fix(hw): detect Apple laptops before ACPI lid checks',
        url: 'https://github.com/omacom/omarchy-mac/pull/274',
        merged: false,
        open: false,
        date: '2026-08-27',
      },
      {
        repo: 'omacom/omarchy-mac',
        number: 270,
        title: 'fix(aarch64): use grep -a for binary device-tree compatible strings',
        url: 'https://github.com/omacom/omarchy-mac/pull/270',
        merged: false,
        open: false,
        date: '2026-08-27',
      },
    ],
  },
  {
    repo: 'AsahiLinux/linux',
    url: 'https://github.com/AsahiLinux/linux',
    kind: {
      es: 'Kernel de Linux para Apple Silicon',
      en: 'Linux kernel for Apple Silicon',
    },
    count: 2,
    contributions: [
      {
        repo: 'AsahiLinux/linux',
        number: 550,
        title: 'arm64: dts: apple: Replace UART clocking TODO with proper documentation',
        url: 'https://github.com/AsahiLinux/linux/pull/550',
        merged: false,
        open: false,
        date: '2026-07-22',
      },
      {
        repo: 'AsahiLinux/linux',
        number: 549,
        title: 'arm64: dts: apple: Replace UART clocking TODO with proper documentation',
        url: 'https://github.com/AsahiLinux/linux/pull/549',
        merged: false,
        open: false,
        date: '2026-07-22',
      },
    ],
  },
  {
    repo: 'python/python-docs-es',
    url: 'https://github.com/python/python-docs-es',
    kind: {
      es: 'Traducción oficial de la documentación de Python al español',
      en: 'Official Spanish translation of the Python documentation',
    },
    count: 1,
    contributions: [
      {
        repo: 'python/python-docs-es',
        number: 2685,
        title: 'update distributing/index.po translate to spanish',
        url: 'https://github.com/python/python-docs-es/pull/2685',
        merged: true,
        open: false,
        date: '2024-01-05',
      },
    ],
  },
  {
    repo: 'DjangoGirls/tutorial',
    url: 'https://github.com/DjangoGirls/tutorial',
    kind: {
      es: 'Tutorial de Django para workshops',
      en: 'Django tutorial used in workshops',
    },
    count: 1,
    contributions: [
      {
        repo: 'DjangoGirls/tutorial',
        number: 1838,
        title: 'update language es',
        url: 'https://github.com/DjangoGirls/tutorial/pull/1838',
        merged: false,
        open: true,
        date: '2024-01-05',
      },
    ],
  },
  {
    repo: 'Ibnu-Afdel/pomogo-rs',
    url: 'https://github.com/Ibnu-Afdel/pomogo-rs',
    kind: {
      es: 'Temporizador Pomodoro en Rust para la barra de Omarchy',
      en: 'Rust Pomodoro timer for the Omarchy bar',
    },
    count: 1,
    contributions: [
      {
        repo: 'Ibnu-Afdel/pomogo-rs',
        number: 2,
        title: 'fix(omarchy-plugin): report a missing `pomogo` command in the bar',
        url: 'https://github.com/Ibnu-Afdel/pomogo-rs/pull/2',
        merged: false,
        open: true,
        date: '2026-10-20',
      },
    ],
  },
  {
    repo: 'davidcasascompetenciadigital-prog/HTTP-Security-Scanner',
    url: 'https://github.com/davidcasascompetenciadigital-prog/HTTP-Security-Scanner',
    kind: {
      es: 'Escáner de seguridad HTTP con integración de la API de NVD',
      en: 'HTTP security scanner with NVD API integration',
    },
    count: 1,
    contributions: [
      {
        repo: 'davidcasascompetenciadigital-prog/HTTP-Security-Scanner',
        number: 1,
        title: 'feat: integrate real NVD CVE API and CLI non-interactive mode',
        url: 'https://github.com/davidcasascompetenciadigital-prog/HTTP-Security-Scanner/pull/1',
        merged: false,
        open: true,
        date: '2026-08-09',
      },
    ],
  },
  {
    repo: 'AngeloBarzolaVillamar/open-api-facturacion-sri',
    url: 'https://github.com/AngeloBarzolaVillamar/open-api-facturacion-sri',
    kind: {
      es: 'API de facturación electrónica (SRI, Ecuador)',
      en: 'Electronic invoicing API (SRI, Ecuador)',
    },
    count: 1,
    contributions: [
      {
        repo: 'AngeloBarzolaVillamar/open-api-facturacion-sri',
        number: 2,
        title: 'fix(security): Red Team audit — 16 vulnerability fixes with PoC',
        url: 'https://github.com/AngeloBarzolaVillamar/open-api-facturacion-sri/pull/2',
        merged: false,
        open: false,
        date: '2026-06-27',
      },
    ],
  },
]

export const PUBLISHED_PLUGINS: PublishedPlugin[] = [
  {
    name: 'omarchy-lang-toggle',
    repo: 'statick88/omarchy-lang-toggle',
    url: 'https://github.com/statick88/omarchy-lang-toggle',
    description: {
      es: 'Toggle de layout de teclado ES/EN en la barra de Omarchy, con TDD y revisión por recibos.',
      en: 'ES/EN keyboard layout toggle in the Omarchy bar, built with TDD and receipt-driven review.',
    },
  },
  {
    name: 'omarchy-pomogo',
    repo: 'statick88/omarchy-pomogo',
    url: 'https://github.com/statick88/omarchy-pomogo',
    description: {
      es: 'Widget de temporizador Pomodoro para la barra, con diagnóstico de dependencia faltante.',
      en: 'Pomodoro timer widget for the bar, with a missing-dependency diagnostic.',
    },
  },
  {
    name: 'plugin_omarchy_gentle.dot',
    repo: 'statick88/plugin_omarchy_gentle.dot',
    url: 'https://github.com/statick88/plugin_omarchy_gentle.dot',
    description: {
      es: 'Integración independiente con el panel nativo Gentle Dot en la barra de Omarchy.',
      en: 'Independent integration with the native Gentle Dot panel in the Omarchy bar.',
    },
  },
  {
    name: 'omarchy-radio-plugin',
    repo: 'statick88/omarchy-radio-plugin',
    url: 'https://github.com/statick88/omarchy-radio-plugin',
    description: {
      es: 'Plugin de radio para Omarchy: barrido de estaciones, CRUD y control de volumen.',
      en: 'Radio plugin for Omarchy: station sweep, CRUD and volume control.',
    },
  },
  {
    name: 'omarchy-pkgs',
    repo: 'statick88/omarchy-pkgs',
    url: 'https://github.com/statick88/omarchy-pkgs',
    description: {
      es: 'Recetas de paquetes propias para el setup de Omarchy.',
      en: 'Own package recipes for the Omarchy setup.',
    },
  },
]

/** Totals behind the panel header. */
export const CONTRIBUTION_STATS = {
  /** Unique pull requests authored (deduplicated by URL). */
  totalPullRequests: 133,
  /** Pull requests opened against repositories the author does not own. */
  upstreamPullRequests: 56,
  /** Third-party repositories with professional contributions. */
  upstreamRepositories: 8,
  /** Pull requests opened against those repositories. */
  contributionPullRequests: 43,
  /** Of those, the ones that were merged. */
  mergedUpstream: 1,
  /** Pull requests opened against the author's own repositories. */
  ownRepositoryPullRequests: 77,
}
