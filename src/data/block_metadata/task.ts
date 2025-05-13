import { z } from 'zod';

/**
 * Metadata schema for MemoryBlocks of type "task".
Based on the structure of task files in experiments/docs/roadmap/tasks/task-*.json.
 */
export const TaskMetadataSchema = z.object({
  x_timestamp: z.string().datetime().optional(),
  x_agent_id: z.string(),
  x_tool_id: z.union([z.string(), z.null()]).optional(),
  x_parent_block_id: z.union([z.string(), z.null()]).optional(),
  x_session_id: z.union([z.string(), z.null()]).optional(),
  status: z.enum(['todo', 'in-progress', 'completed', 'blocked']).optional(),
  project: z.string(),
  name: z.string(),
  description: z.string(),
  phase: z.union([z.string(), z.null()]).optional(),
  implementation_details: z.union([z.unknown(), z.null()]).optional(),
  action_items: z.union([z.unknown(), z.null()]).optional(),
  test_criteria: z.union([z.unknown(), z.null()]).optional(),
  success_criteria: z.union([z.unknown(), z.null()]).optional(),
  completed: z.boolean().optional(),
  priority: z.union([z.unknown(), z.null()]).optional(),
  assignee: z.union([z.string(), z.null()]).optional(),
  current_status: z.union([z.string(), z.null()]).optional()
});

/**
 * Metadata schema for MemoryBlocks of type "task".
Based on the structure of task files in experiments/docs/roadmap/tasks/task-*.json.
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface TaskMetadata {
  x_timestamp?: string;
  x_agent_id: string;
  x_tool_id?: string | null;
  x_parent_block_id?: string | null;
  x_session_id?: string | null;
  status?: 'todo' | 'in-progress' | 'completed' | 'blocked';
  project: string;
  name: string;
  description: string;
  phase?: string | null;
  implementation_details?: unknown | null;
  action_items?: unknown | null;
  test_criteria?: unknown | null;
  success_criteria?: unknown | null;
  completed?: boolean;
  priority?: unknown | null;
  assignee?: string | null;
  current_status?: string | null;
}
