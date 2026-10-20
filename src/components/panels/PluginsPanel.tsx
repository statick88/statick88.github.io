/**
 * src/components/panels/PluginsPanel.tsx — Published plugins panel
 *
 * The plugins the author publishes for the Omarchy shell. One row per plugin:
 * the name on the left, what it does and where it lives on the right.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import { PUBLISHED_PLUGINS } from '@/data/contributions'

export function PluginsPanel() {
  const { t } = useApp()

  return (
    <Panel title={t('plugins', 'plugins')} subtitle={`${PUBLISHED_PLUGINS.length}`}>
      {PUBLISHED_PLUGINS.map((plugin) => (
        <PanelRow key={plugin.repo} label={plugin.name}>
          <div className="space-y-2">
            <p className="text-ct-subtext-1 text-xs">
              {t(plugin.description.es, plugin.description.en)}
            </p>
            <a
              href={plugin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="chip chip-accent hover:border-ct-accent"
            >
              {plugin.repo} ↗
            </a>
          </div>
        </PanelRow>
      ))}
    </Panel>
  )
}
