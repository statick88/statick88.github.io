/**
 * Bilingual String Utilities
 * Type-safe helpers for working with { es, en } content
 */

import type { BilingualString } from '@/lib/schemas/cv-data';

/**
 * Extract text for a specific locale from a bilingual string
 * @param bilingual - The bilingual string object
 * @param locale - Target locale ('es' | 'en')
 * @returns The text for the requested locale
 */
export function getText(bilingual: BilingualString, locale: 'es' | 'en'): string {
  return bilingual[locale];
}

/**
 * Create a bilingual string from Spanish and English texts
 * @param es - Spanish text
 * @param en - English text
 * @returns BilingualString object
 */
export function createBilingual(es: string, en: string): BilingualString {
  return { es, en };
}

/**
 * Merge a partial bilingual string with a fallback
 * Useful when some content might be missing one language
 * @param partial - Partial bilingual object (may have only es or en)
 * @param fallback - Complete bilingual string to use for missing keys
 * @returns Complete BilingualString
 */
export function mergeBilingual(
  partial: Partial<BilingualString>,
  fallback: BilingualString
): BilingualString {
  return {
    es: partial.es ?? fallback.es,
    en: partial.en ?? fallback.en,
  };
}

/**
 * Check if a bilingual string has both languages populated
 * @param bilingual - BilingualString to check
 * @returns true if both es and en are non-empty
 */
export function isComplete(bilingual: BilingualString): boolean {
  return bilingual.es.length > 0 && bilingual.en.length > 0;
}

/**
 * Get all keys from a bilingual string (always ['es', 'en'])
 */
export const BILINGUAL_KEYS: readonly ['es', 'en'] = ['es', 'en'] as const;

/**
 * Map a function over both languages of a bilingual string
 * @param bilingual - Source bilingual string
 * @param fn - Function to apply to each language text
 * @returns New bilingual string with transformed values
 */
export function mapBilingual<T>(
  bilingual: BilingualString,
  fn: (text: string, locale: 'es' | 'en') => T
): { es: T; en: T } {
  return {
    es: fn(bilingual.es, 'es'),
    en: fn(bilingual.en, 'en'),
  };
}

/**
 * Default locale for the application
 */
export const DEFAULT_LOCALE: 'es' | 'en' = 'es';

/**
 * Supported locales
 */
export const SUPPORTED_LOCALES: readonly ['es', 'en'] = ['es', 'en'] as const;

/**
 * Type guard for locale
 */
export function isSupportedLocale(locale: string): locale is 'es' | 'en' {
  return SUPPORTED_LOCALES.includes(locale as 'es' | 'en');
}