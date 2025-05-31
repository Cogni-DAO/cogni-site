import { z } from 'zod';

/**
 * Metadata schema for MemoryBlocks of type "task".
Based on the link-first relationship approach where BlockLink is the source of truth for relationships.

Tasks can have the following relationships via BlockLinks:
- subtask_of: Points to a parent task or project that this task is part of
- depends_on: Points to another task that must be completed before this one can start
- belongs_to_epic: Points to an epic that this task is part of
- blocks: Points to another task that cannot proceed until this one is complete
- is_blocked_by: Points to another task that is blocking this one
- has_bug: Points to a bug that is related to this task

Tasks inherit from ExecutableMetadata and support agent execution with:
- Planning fields (tool_hints, action_items, acceptance_criteria, expected_artifacts)
- Agent framework fields (execution_timeout_minutes, cost_budget_usd, role_hint)
- Completion fields (deliverables, validation_report)
 */
export const TaskMetadataSchema = z.object({
  x_timestamp: z.string().datetime().optional(),
  x_agent_id: z.string(),
  x_tool_id: z.union([z.string(), z.null()]).optional(),
  x_parent_block_id: z.union([z.string(), z.null()]).optional(),
  x_session_id: z.union([z.string(), z.null()]).optional(),
  title: z.string(),
  description: z.union([z.string(), z.null()]).optional(),
  owner: z.union([z.string(), z.null()]).optional(),
  status: z.enum(['backlog', 'ready', 'in_progress', 'review', 'merged', 'validated', 'released', 'done', 'archived']).optional(),
  assignee: z.union([z.string(), z.null()]).optional(),
  tool_hints: z.array(z.unknown()).optional(),
  action_items: z.array(z.unknown()).optional(),
  acceptance_criteria: z.array(z.unknown()).optional(),
  expected_artifacts: z.array(z.unknown()).optional(),
  blocked_by: z.array(z.unknown()).optional(),
  priority_score: z.union([z.number(), z.null()]).optional(),
  reviewer: z.union([z.string(), z.null()]).optional(),
  execution_timeout_minutes: z.union([z.unknown(), z.null()]).optional(),
  cost_budget_usd: z.union([z.number(), z.null()]).optional(),
  role_hint: z.union([z.string(), z.null()]).optional(),
  execution_phase: z.union([z.string(), z.null()]).optional(),
  deliverables: z.array(z.unknown()).optional(),
  validation_report: z.union([z.unknown(), z.null()]).optional(),
  priority: z.union([z.string(), z.null()]).optional(),
  story_points: z.union([z.number(), z.null()]).optional(),
  estimate_hours: z.union([z.number(), z.null()]).optional(),
  start_date: z.union([z.string(), z.null()]).optional(),
  due_date: z.union([z.string(), z.null()]).optional(),
  labels: z.array(z.unknown()).optional(),
  confidence_score: z.union([z.unknown(), z.null()]).optional(),
  phase: z.union([z.string(), z.null()]).optional(),
  implementation_details: z.union([z.unknown(), z.null()]).optional(),
  current_status: z.union([z.string(), z.null()]).optional()
});

/**
 * Metadata schema for MemoryBlocks of type "task".
Based on the link-first relationship approach where BlockLink is the source of truth for relationships.

Tasks can have the following relationships via BlockLinks:
- subtask_of: Points to a parent task or project that this task is part of
- depends_on: Points to another task that must be completed before this one can start
- belongs_to_epic: Points to an epic that this task is part of
- blocks: Points to another task that cannot proceed until this one is complete
- is_blocked_by: Points to another task that is blocking this one
- has_bug: Points to a bug that is related to this task

Tasks inherit from ExecutableMetadata and support agent execution with:
- Planning fields (tool_hints, action_items, acceptance_criteria, expected_artifacts)
- Agent framework fields (execution_timeout_minutes, cost_budget_usd, role_hint)
- Completion fields (deliverables, validation_report)
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface TaskMetadata {
  x_timestamp?: string;
  x_agent_id: string;
  x_tool_id?: string | null;
  x_parent_block_id?: string | null;
  x_session_id?: string | null;
  title: string;
  description?: string | null;
  owner?: string | null;
  status?: 'backlog' | 'ready' | 'in_progress' | 'review' | 'merged' | 'validated' | 'released' | 'done' | 'archived';
  assignee?: string | null;
  tool_hints?: unknown[];
  action_items?: unknown[];
  acceptance_criteria?: unknown[];
  expected_artifacts?: unknown[];
  blocked_by?: unknown[];
  priority_score?: number | null;
  reviewer?: string | null;
  execution_timeout_minutes?: unknown | null;
  cost_budget_usd?: number | null;
  role_hint?: string | null;
  execution_phase?: string | null;
  deliverables?: unknown[];
  validation_report?: unknown | null;
  priority?: string | null;
  story_points?: number | null;
  estimate_hours?: number | null;
  start_date?: string | null;
  due_date?: string | null;
  labels?: unknown[];
  confidence_score?: unknown | null;
  phase?: string | null;
  implementation_details?: unknown | null;
  current_status?: string | null;
}
