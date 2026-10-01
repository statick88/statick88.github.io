/**
 * src/webmcp/types.ts — WebMCP tool descriptor types
 *
 * WebMCP is a W3C CG-DRAFT, not a standard. The surface it exposes has already
 * churned once (`navigator.modelContext` → `document.modelContext`,
 * `provideContext()` → `registerTool()`). Every shape declared here is therefore
 * intentionally permissive: the host object is described with *optional*
 * members so that a browser exposing a partial or renamed implementation still
 * type-checks against our defensive runtime probes.
 */

// ── Input ────────────────────────────────────────────────────────

/** Language selector accepted by every bilingual tool. */
export type WebMcpLang = 'es' | 'en'

/**
 * Arguments as handed over by the agent. Kept as an opaque record: each tool
 * validates the fields it cares about, because the spec gives no runtime
 * guarantee about what a caller passes.
 */
export type WebMcpToolExecuteInput = Readonly<Record<string, unknown>>

// ── JSON Schema (the subset we emit) ─────────────────────────────

export interface WebMcpJsonSchemaProperty {
  readonly type: string
  readonly description: string
  /** Present on closed enumerations (category, level, status). */
  readonly enum?: readonly string[]
  /** Documented default so an agent can omit the argument safely. */
  readonly default?: string | number
}

export interface WebMcpJsonSchema {
  readonly type: 'object'
  readonly properties: Readonly<Record<string, WebMcpJsonSchemaProperty>>
  readonly required?: readonly string[]
  readonly additionalProperties?: boolean
}

// ── Tool ─────────────────────────────────────────────────────────

export interface WebMcpToolAnnotations {
  /** All CV tools are read-only projections of the SSOT. */
  readonly readOnlyHint?: boolean
  readonly title?: string
}

export interface WebMcpTool {
  readonly name: string
  /** Agent-facing: what the tool returns and when to prefer it. */
  readonly description: string
  readonly inputSchema: WebMcpJsonSchema
  readonly annotations?: WebMcpToolAnnotations
  /**
   * The draft resolves tool output as a stringified DOMString, so every tool
   * returns `JSON.stringify(payload)`. Sync is allowed by the draft; async is
   * permitted for hosts that await the result.
   */
  execute(input?: WebMcpToolExecuteInput): Promise<string> | string
}

// ── Host surface (document.modelContext) ─────────────────────────

/** What `getTools()` may hand back — reduced to the only field we rely on. */
export interface WebMcpRegisteredToolInfo {
  readonly name?: string
}

export interface WebMcpModelContext {
  // All optional: see the module comment. The draft renamed the registration
  // entry point, so a host may expose a subset (or a future rename) of these.
  readonly registerTool?: (tool: WebMcpTool) => void
  readonly unregisterTool?: (name: string) => void
  readonly getTools?: () => readonly WebMcpRegisteredToolInfo[] | undefined
}

declare global {
  interface Document {
    // Optional + readonly: absent on every shipping browser today, and the
    // property may disappear again if the draft is renamed.
    readonly modelContext?: WebMcpModelContext
  }
}