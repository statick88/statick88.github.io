/**
 * src/webmcp/index.ts — Public surface of the WebMCP CV tools module
 */

export { webMcpTools } from './tools'
export { registerWebMcpTools } from './registerTools'
export type {
  WebMcpJsonSchema,
  WebMcpJsonSchemaProperty,
  WebMcpLang,
  WebMcpModelContext,
  WebMcpRegisteredToolInfo,
  WebMcpTool,
  WebMcpToolAnnotations,
  WebMcpToolExecuteInput,
} from './types'