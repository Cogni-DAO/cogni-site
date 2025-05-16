import { z } from 'zod';

/**
 * Metadata schema for MemoryBlocks of type "doc".
Basic structure for documentation blocks.
 */
export const DocMetadataSchema = z.object({
  x_timestamp: z.string().datetime().optional(),
  x_agent_id: z.string(),
  x_tool_id: z.union([z.string(), z.null()]).optional(),
  x_parent_block_id: z.union([z.string(), z.null()]).optional(),
  x_session_id: z.union([z.string(), z.null()]).optional(),
  title: z.string(),
  description: z.union([z.string(), z.null()]).optional(),
  owner: z.union([z.string(), z.null()]).optional(),
  audience: z.union([z.string(), z.null()]).optional(),
  section: z.union([z.string(), z.null()]).optional(),
  version: z.union([z.string(), z.null()]).optional(),
  last_reviewed: z.union([z.string(), z.null()]).optional(),
  format: z.union([z.string(), z.null()]).optional(),
  completed: z.boolean().optional()
});

/**
 * Metadata schema for MemoryBlocks of type "doc".
Basic structure for documentation blocks.
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface DocMetadata {
  x_timestamp?: string;
  x_agent_id: string;
  x_tool_id?: string | null;
  x_parent_block_id?: string | null;
  x_session_id?: string | null;
  title: string;
  description?: string | null;
  owner?: string | null;
  audience?: string | null;
  section?: string | null;
  version?: string | null;
  last_reviewed?: string | null;
  format?: string | null;
  completed?: boolean;
}
