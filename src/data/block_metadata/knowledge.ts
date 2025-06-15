import { z } from 'zod';

/**
 * Metadata for knowledge-type memory blocks.
 */
export const KnowledgeMetadataSchema = z.object({
  x_timestamp: z.string().datetime().optional(),
  x_agent_id: z.string(),
  x_tool_id: z.union([z.string(), z.null()]).optional(),
  x_parent_block_id: z.union([z.string(), z.null()]).optional(),
  x_session_id: z.union([z.string(), z.null()]).optional(),
  title: z.string(),
  description: z.union([z.string(), z.null()]).optional(),
  owner: z.union([z.string(), z.null()]).optional(),
  subject: z.union([z.string(), z.null()]).optional(),
  keywords: z.union([z.unknown(), z.null()]).optional(),
  source: z.union([z.string(), z.null()]).optional(),
  confidence: z.union([z.number(), z.null()]).optional()
});

/**
 * Metadata for knowledge-type memory blocks.
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface KnowledgeMetadata {
  x_timestamp?: string;
  x_agent_id: string;
  x_tool_id?: string | null;
  x_parent_block_id?: string | null;
  x_session_id?: string | null;
  title: string;
  description?: string | null;
  owner?: string | null;
  subject?: string | null;
  keywords?: unknown | null;
  source?: string | null;
  confidence?: number | null;
}
