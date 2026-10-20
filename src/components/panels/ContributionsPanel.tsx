/**
 * src/components/panels/ContributionsPanel.tsx — Upstream contributions panel
 *
 * The "portes" section: pull requests opened against repositories the author
 * does not own. Each row is one upstream target; the value carries the
 * representative pull requests and their state.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import {
  CONTRIBUTION_STATS,
  TRAINING_REPOS,
  UPSTREAM_TARGETS,
} from '@/data/contributions'

export function ContributionsPanel() {
  const { t } = useApp()

  return (
    <Panel
      title={t('portes', 'ports')}
      subtitle={`${CONTRIBUTION_STATS.upstreamPullRequests} PR · ${CONTRIBUTION_STATS.upstreamRepositories} repos`}
    >
      <PanelRow label={t('total', 'total')}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip chip-accent">
            {CONTRIBUTION_STATS.totalPullRequests} {t('pull requests', 'pull requests')}
          </span>
          <span className="chip">
            {CONTRIBUTION_STATS.upstreamPullRequests} {t('a repos de terceros', 'to third-party repos')}
          </span>
          <span className="chip chip-ok">
            {CONTRIBUTION_STATS.mergedUpstream} {t('mergeados', 'merged')}
          </span>
        </div>
      </PanelRow>

      {UPSTREAM_TARGETS.map((target) => (
        <PanelRow key={target.repo} label={target.repo}>
          <div className="space-y-2">
            <p className="text-ct-subtext-1 text-xs">{t(target.kind.es, target.kind.en)}</p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={target.url}
                target="_blank"
                rel="noopener noreferrer"
                className="chip chip-accent hover:border-ct-accent"
              >
                {target.repo} ↗
              </a>
              <span className="chip chip-muted">
                {target.count} {t('PR', 'PR')}
              </span>
            </div>
            <ul className="space-y-1">
              {target.contributions.map((contribution) => (
                <li key={`${contribution.repo}-${contribution.number}`} className="text-xs">
                  <a
                    href={contribution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ct-accent-bright hover:text-ct-accent"
                  >
                    #{contribution.number} {contribution.title}
                  </a>
                  <span className="text-ct-subtext-0">
                    {' · '}
                    {contribution.merged
                      ? t('mergeado', 'merged')
                      : contribution.open
                        ? t('abierto', 'open')
                        : t('cerrado', 'closed')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </PanelRow>
      ))}

      <PanelRow label={t('formación', 'training')}>
        <div className="space-y-2">
          <p className="text-ct-subtext-1 text-xs">
            {t(
              'Pull requests a repos de formación y ejercicios de cursos (Django, pygame, React, Focus iOS).',
              'Pull requests to training and course-exercise repositories (Django, pygame, React, Focus iOS).',
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-muted">
              {TRAINING_REPOS.count} {t('PR', 'PR')}
            </span>
            <span className="chip chip-ok">
              {TRAINING_REPOS.merged} {t('mergeados', 'merged')}
            </span>
          </div>
        </div>
      </PanelRow>
    </Panel>
  )
}
