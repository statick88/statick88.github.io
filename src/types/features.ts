/**
 * src/types/features.ts — TypeScript types for Feature Flags
 *
 * Auto-generated from features.json.
 * Do NOT edit manually — update features.json and regenerate.
 */

/** All available feature flag keys */
export type FeatureFlagKey =
  | 'hero'
  | 'metrics'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'courses'
  | 'research'
  | 'hire'
  | 'particles'
  | 'darkMode'
  | 'languageToggle'
  | 'profileSelector'

/** Feature flag definition */
export interface FeatureFlag {
  /** Whether the feature is enabled */
  enabled: boolean
  /** Human-readable description */
  description: string
  /** Optional: percentage rollout (0-100) — overrides enabled if set */
  rollout?: number
  /** Optional: allowed user IDs for targeted rollout */
  allowedUsers?: string[]
  /** Optional: date when flag should auto-disable */
  expiresAt?: string
}

/** Feature flags configuration */
export interface FeatureFlagsConfig {
  /** Schema version */
  $schema?: string
  /** Config version */
  version: string
  /** Last updated timestamp */
  lastUpdated: string
  /** All feature flags */
  flags: Record<FeatureFlagKey, FeatureFlag>
}

/** Runtime feature flags state */
export interface FeatureFlagsState {
  /** Check if a feature is enabled */
  isEnabled: (flag: FeatureFlagKey) => boolean
  /** Get all enabled flags */
  getEnabledFlags: () => FeatureFlagKey[]
  /** Get flag definition */
  getFlag: (flag: FeatureFlagKey) => FeatureFlag | undefined
  /** Force-enable a flag (for debugging) */
  enable: (flag: FeatureFlagKey) => void
  /** Force-disable a flag (for debugging) */
  disable: (flag: FeatureFlagKey) => void
  /** Reset all overrides */
  reset: () => void
}
