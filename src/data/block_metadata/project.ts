import { z } from 'zod';

/**
 * Metadata schema for MemoryBlocks of type "project".
Based on the link-first relationship approach where BlockLink is the source of truth for relationships.

Projects can have the following relationships via BlockLinks:
- child_of: Points to a parent project that this project is part of
- parent_of: Points to a child project that is part of this project
- belongs_to_epic: Points to an epic that this project is part of
- epic_contains: Points to an epic that is related to this project (if project contains epics)
- has_bug: Points to a bug that is related to this project

Projects inherit from ExecutableMetadata and support agent execution with:
- Planning fields (tool_hints, action_items, acceptance_criteria, expected_artifacts)
- Agent framework fields (execution_timeout_minutes, cost_budget_usd, role_hint)
- Completion fields (deliverables, validation_report)
 */
export const ProjectMetadataSchema = z.object({
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
  start_date: z.union([z.string(), z.null()]).optional(),
  target_date: z.union([z.string(), z.null()]).optional(),
  progress_percent: z.union([z.number(), z.null()]).optional(),
  tags: z.array(z.unknown()).optional(),
  confidence_score: z.union([z.unknown(), z.null()]).optional(),
  phase: z.union([z.string(), z.null()]).optional(),
  implementation_flow: z.union([z.unknown(), z.null()]).optional(),
  success_criteria: z.union([z.unknown(), z.null()]).optional(),
  design_decisions: z.union([z.unknown(), z.null()]).optional(),
  references: z.union([z.unknown(), z.null()]).optional()
});

/**
 * Metadata schema for MemoryBlocks of type "project".
Based on the link-first relationship approach where BlockLink is the source of truth for relationships.

Projects can have the following relationships via BlockLinks:
- child_of: Points to a parent project that this project is part of
- parent_of: Points to a child project that is part of this project
- belongs_to_epic: Points to an epic that this project is part of
- epic_contains: Points to an epic that is related to this project (if project contains epics)
- has_bug: Points to a bug that is related to this project

Projects inherit from ExecutableMetadata and support agent execution with:
- Planning fields (tool_hints, action_items, acceptance_criteria, expected_artifacts)
- Agent framework fields (execution_timeout_minutes, cost_budget_usd, role_hint)
- Completion fields (deliverables, validation_report)
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface ProjectMetadata {
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
  start_date?: string | null;
  target_date?: string | null;
  progress_percent?: number | null;
  tags?: unknown[];
  confidence_score?: unknown | null;
  phase?: string | null;
  implementation_flow?: unknown | null;
  success_criteria?: unknown | null;
  design_decisions?: unknown | null;
  references?: unknown | null;
}
