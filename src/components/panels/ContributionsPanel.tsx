/**
 * src/components/panels/ContributionsPanel.tsx — Upstream contributions panel
 *
 * The "aportes" section: pull requests opened against third-party repositories
 * the author does not own. Each row is one repository; the value carries the
 * representative pull requests and their state.
 *
 * Only professional contributions are listed. Pull requests opened against
 * course-exercise repositories are not contributions and are not counted here;
 * the totals below separate them from the author's own repositories.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import { CONTRIBUTION_STATS, UPSTREAM_TARGETS } from '@/data/contributions'

export function ContributionsPanel() {
  const { t } = useApp()

  return (
    <Panel
      title={t('aportes', 'contributions')}
      subtitle={`${CONTRIBUTION_STATS.contributionPullRequests} PR · ${CONTRIBUTION_STATS.upstreamRepositories} repos`}
    >
      <PanelRow label={t('totales', 'totals')}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip chip-accent">
            {CONTRIBUTION_STATS.contributionPullRequests} {t('PR a repos de terceros', 'PRs to third-party repos')}
          </span>
          <span className="chip chip-ok">
            {CONTRIBUTION_STATS.mergedUpstream} {t('mergeado', 'merged')}
          </span>
          <span className="chip chip-muted">
            {CONTRIBUTION_STATS.ownRepositoryPullRequests} {t('PR en repos propios', 'PRs in own repos')}
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
    </Panel>
  )
}
