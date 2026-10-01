/**
 * src/hooks/useWebMcpTools.ts — Mounts the WebMCP tool surface
 *
 * Stateless by design: the hook owns nothing but the effect, and the capability
 * probe happens inside the effect (never at module scope, so importing this file
 * has no side effects).
 */

import { useEffect } from 'react'
import { registerWebMcpTools } from '@/webmcp'

export function useWebMcpTools(): void {
  useEffect(() => registerWebMcpTools(), [])
}