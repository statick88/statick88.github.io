/**
 * src/webmcp/registerTools.ts — WebMCP registration lifecycle
 *
 * The browser is the security mediator: this module only hands tool descriptors
 * to `document.modelContext` and takes them back out again. Because WebMCP is a
 * draft, every host capability is probed at runtime and a missing capability is
 * a silent no-op — the absence of the API is today's normal case, not an error,
 * so nothing here logs or throws.
 */

import { webMcpTools } from './tools'
import type { WebMcpModelContext, WebMcpTool } from './types'

const NOOP = (): void => {}

/** Names already present on the host, so we never double-register under StrictMode. */
function readRegisteredNames(context: WebMcpModelContext): Set<string> {
  const getTools = context.getTools
  if (typeof getTools !== 'function') return new Set()

  let listed: unknown
  try {
    listed = getTools.call(context)
  } catch {
    // A host whose getTools() throws must not block registration.
    return new Set()
  }

  if (!Array.isArray(listed)) return new Set()

  const names = new Set<string>()
  for (const entry of listed) {
    if (entry && typeof entry === 'object' && 'name' in entry) {
      const name = (entry as { readonly name?: unknown }).name
      if (typeof name === 'string') names.add(name)
    }
  }
  return names
}

/**
 * Registers the given tools (default: the six CV tools) and returns a symmetric
 * cleanup that deregisters exactly what this call registered.
 *
 * The cleanup is one-shot and safe to call any number of times, including when
 * the host never existed — required because React 18 StrictMode runs effects as
 * mount → unmount → remount in development.
 */
export function registerWebMcpTools(
  tools: readonly WebMcpTool[] = webMcpTools,
): () => void {
  const context =
    typeof document === 'undefined' ? undefined : document.modelContext
  const registerTool = context?.registerTool

  if (!context || typeof registerTool !== 'function') {
    // Progressive enhancement: no WebMCP host, nothing to do.
    return NOOP
  }

  const alreadyRegistered = readRegisteredNames(context)
  const registered: string[] = []

  for (const tool of tools) {
    if (alreadyRegistered.has(tool.name)) continue
    try {
      registerTool.call(context, tool)
      registered.push(tool.name)
      alreadyRegistered.add(tool.name)
    } catch {
      // One rejected tool must not abort the rest of the batch.
    }
  }

  return () => {
    // Drain first so a repeated cleanup cannot deregister anything twice.
    const names = registered.splice(0, registered.length)
    const unregisterTool = context.unregisterTool
    if (typeof unregisterTool !== 'function') return

    for (const name of names) {
      try {
        unregisterTool.call(context, name)
      } catch {
        // Deregistration is best-effort; never throw from a cleanup.
      }
    }
  }
}