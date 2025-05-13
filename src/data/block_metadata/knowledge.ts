import { z } from 'zod';

/**
 * Metadata schema for MemoryBlocks of type "knowledge".
Structure for knowledge/fact blocks.
 */
export const KnowledgeMetadataSchema = z.object({
  x_timestamp: z.string().datetime().optional(),
  x_agent_id: z.string(),
  x_tool_id: z.union([z.string(), z.null()]).optional(),
  x_parent_block_id: z.union([z.string(), z.null()]).optional(),
  x_session_id: z.union([z.string(), z.null()]).optional(),
  source: z.union([z.string(), z.null()]).optional(),
  validity: z.union([z.string(), z.null()]).optional(),
  domain: z.union([z.string(), z.null()]).optional(),
  last_verified: z.union([z.string(), z.null()]).optional(),
  confidence_level: z.union([z.number(), z.null()]).optional()
});

/**
 * Metadata schema for MemoryBlocks of type "knowledge".
Structure for knowledge/fact blocks.
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface KnowledgeMetadata {
  x_timestamp?: string;
  x_agent_id: string;
  x_tool_id?: string | null;
  x_parent_block_id?: string | null;
  x_session_id?: string | null;
  source?: string | null;
  validity?: string | null;
  domain?: string | null;
  last_verified?: string | null;
  confidence_level?: number | null;
}
