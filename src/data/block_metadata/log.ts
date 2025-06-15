import { z } from 'zod';

/**
 * Metadata schema for log type MemoryBlocks.
Inherits system fields (x_timestamp, x_agent_id, x_tool_id, x_parent_block_id, x_session_id) from BaseMetadata.
Does not include user fields (title, description, owner) since logs are typically system-generated.
 */
export const LogMetadataSchema = z.object({
  x_timestamp: z.string().datetime().optional(),
  x_agent_id: z.string(),
  x_tool_id: z.union([z.string(), z.null()]).optional(),
  x_parent_block_id: z.union([z.string(), z.null()]).optional(),
  x_session_id: z.union([z.string(), z.null()]).optional(),
  input_text: z.union([z.string(), z.null()]).optional(),
  output_text: z.union([z.string(), z.null()]).optional(),
  model: z.union([z.string(), z.null()]).optional(),
  token_count: z.union([z.unknown(), z.null()]).optional(),
  latency_ms: z.union([z.number(), z.null()]).optional(),
  log_level: z.union([z.string(), z.null()]).optional(),
  component: z.union([z.string(), z.null()]).optional(),
  event_timestamp: z.union([z.string(), z.null()]).optional()
});

/**
 * Metadata schema for log type MemoryBlocks.
Inherits system fields (x_timestamp, x_agent_id, x_tool_id, x_parent_block_id, x_session_id) from BaseMetadata.
Does not include user fields (title, description, owner) since logs are typically system-generated.
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface LogMetadata {
  x_timestamp?: string;
  x_agent_id: string;
  x_tool_id?: string | null;
  x_parent_block_id?: string | null;
  x_session_id?: string | null;
  input_text?: string | null;
  output_text?: string | null;
  model?: string | null;
  token_count?: unknown | null;
  latency_ms?: number | null;
  log_level?: string | null;
  component?: string | null;
  event_timestamp?: string | null;
}
