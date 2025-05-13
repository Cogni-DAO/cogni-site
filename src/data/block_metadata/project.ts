import { z } from 'zod';

/**
 * Metadata schema for MemoryBlocks of type "project".
Based on the structure of project files in experiments/docs/roadmap/project-*.json.
 */
export const ProjectMetadataSchema = z.object({
  x_timestamp: z.string().datetime().optional(),
  x_agent_id: z.string(),
  x_tool_id: z.union([z.string(), z.null()]).optional(),
  x_parent_block_id: z.union([z.string(), z.null()]).optional(),
  x_session_id: z.union([z.string(), z.null()]).optional(),
  status: z.enum(['planning', 'in-progress', 'completed', 'archived']).optional(),
  epic: z.union([z.string(), z.null()]).optional(),
  name: z.string(),
  description: z.string(),
  phase: z.union([z.string(), z.null()]).optional(),
  implementation_flow: z.union([z.unknown(), z.null()]).optional(),
  success_criteria: z.union([z.unknown(), z.null()]).optional(),
  completed: z.boolean().optional(),
  deadline: z.union([z.string(), z.null()]).optional(),
  design_decisions: z.union([z.unknown(), z.null()]).optional(),
  references: z.union([z.unknown(), z.null()]).optional()
});

/**
 * Metadata schema for MemoryBlocks of type "project".
Based on the structure of project files in experiments/docs/roadmap/project-*.json.
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface ProjectMetadata {
  x_timestamp?: string;
  x_agent_id: string;
  x_tool_id?: string | null;
  x_parent_block_id?: string | null;
  x_session_id?: string | null;
  status?: 'planning' | 'in-progress' | 'completed' | 'archived';
  epic?: string | null;
  name: string;
  description: string;
  phase?: string | null;
  implementation_flow?: unknown | null;
  success_criteria?: unknown | null;
  completed?: boolean;
  deadline?: string | null;
  design_decisions?: unknown | null;
  references?: unknown | null;
}
