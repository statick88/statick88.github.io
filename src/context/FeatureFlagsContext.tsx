/**
 * src/context/FeatureFlagsContext.tsx — Feature Flags provider
 *
 * Provides a typed context for feature flags with runtime overrides.
 * Flags are loaded from features.json and can be overridden via localStorage.
 *
 * Usage:
 *   <FeatureFlagsProvider>
 *     <App />
 *   </FeatureFlagsProvider>
 *
 *   const { isEnabled } = useFeatureFlags()
 *   if (isEnabled('hero')) { ... }
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import featureFlagsConfig from '@/config/features.json'
import type { FeatureFlagKey, FeatureFlag, FeatureFlagsState } from '@/types/features'

// ── Constants ────────────────────────────────────────────────────

const OVERRIDES_KEY = 'cv-feature-overrides'

// Cast JSON import to typed config
const config = featureFlagsConfig as unknown as import('@/types/features').FeatureFlagsConfig

// ── Helpers ──────────────────────────────────────────────────────

function loadOverrides(): Partial<Record<FeatureFlagKey, boolean>> {
  try {
    const stored = localStorage.getItem(OVERRIDES_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return {}
}

function saveOverrides(overrides: Partial<Record<FeatureFlagKey, boolean>>): void {
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))
  } catch {
    // Ignore quota errors
  }
}

// ── Context ──────────────────────────────────────────────────────

const FeatureFlagsContext = createContext<FeatureFlagsState | null>(null)

// ── Provider ─────────────────────────────────────────────────────

interface FeatureFlagsProviderProps {
  children: ReactNode
}

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const [overrides, setOverrides] = useState(loadOverrides)

  const isEnabled = useCallback(
    (flag: FeatureFlagKey): boolean => {
      // Check for runtime override first
      if (flag in overrides) {
        return overrides[flag]!
      }

      // Fall back to config
      const flagDef = config.flags[flag]
      if (!flagDef) {
        return false
      }

      // Check expiry
      if ('expiresAt' in flagDef && flagDef.expiresAt) {
        const expiry = new Date(flagDef.expiresAt as string)
        if (Date.now() > expiry.getTime()) {
          return false
        }
      }

      // Check rollout percentage
      if ('rollout' in flagDef && flagDef.rollout !== undefined) {
        // Use a stable hash based on flag name for consistent rollout
        const hash = flag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return (hash % 100) < (flagDef.rollout as number)
      }

      return flagDef.enabled
    },
    [overrides],
  )

  const getEnabledFlags = useCallback((): FeatureFlagKey[] => {
    return (Object.keys(config.flags) as FeatureFlagKey[]).filter(isEnabled)
  }, [isEnabled])

  const getFlag = useCallback(
    (flag: FeatureFlagKey): FeatureFlag | undefined => {
      return config.flags[flag] as FeatureFlag
    },
    [],
  )

  const enable = useCallback((flag: FeatureFlagKey) => {
    setOverrides((prev) => {
      const next = { ...prev, [flag]: true }
      saveOverrides(next)
      return next
    })
  }, [])

  const disable = useCallback((flag: FeatureFlagKey) => {
    setOverrides((prev) => {
      const next = { ...prev, [flag]: false }
      saveOverrides(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setOverrides({})
    localStorage.removeItem(OVERRIDES_KEY)
  }, [])

  const value = useMemo<FeatureFlagsState>(
    () => ({
      isEnabled,
      getEnabledFlags,
      getFlag,
      enable,
      disable,
      reset,
    }),
    [isEnabled, getEnabledFlags, getFlag, enable, disable, reset],
  )

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────

/**
 * useFeatureFlags — Access feature flags state
 *
 * @throws Error if used outside FeatureFlagsProvider
 */
export function useFeatureFlags(): FeatureFlagsState {
  const context = useContext(FeatureFlagsContext)
  if (!context) {
    throw new Error('useFeatureFlags must be used within <FeatureFlagsProvider>')
  }
  return context
}

/**
 * useFeatureFlag — Check a single feature flag
 *
 * @param flag - The feature flag key to check
 * @returns Whether the feature is enabled
 */
export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  const { isEnabled } = useFeatureFlags()
  return isEnabled(flag)
}
