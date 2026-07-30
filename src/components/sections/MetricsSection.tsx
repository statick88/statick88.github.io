/**
 * src/components/sections/MetricsSection.tsx — Key metrics display
 */

import { useApp } from '@/context/AppContext'
import { useCVData } from '@/hooks/useCVData'
import Metrics from '@/components/Metrics'

export function MetricsSection() {
  const { t } = useApp()
  const metrics = useCVData((d) => d.metrics)

  return <Metrics metrics={metrics} t={t} />
}
