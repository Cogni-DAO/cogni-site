import { z } from 'zod';

/**
 * Bug metadata schema.

A Bug represents an issue, defect, or unexpected behavior in software
that needs to be addressed.

Bugs inherit from ExecutableMetadata and support agent execution with:
- Planning fields (tool_hints, action_items, acceptance_criteria, expected_artifacts)
- Agent framework fields (execution_timeout_minutes, cost_budget_usd, role_hint)
- Completion fields (deliverables, validation_report)

Bugs can have relationships via BlockLinks:
- bug_affects: Points to a component, project, or system affected by this bug
- is_blocked_by: Points to another task or bug that is blocking this one
- blocks: Points to another task or bug that is blocked by this one
 */
export const BugMetadataSchema = z.object({
  x_timestamp: z.string().datetime().optional(),
  x_agent_id: z.string(),
  x_tool_id: z.union([z.string(), z.null()]).optional(),
  x_parent_block_id: z.union([z.string(), z.null()]).optional(),
  x_session_id: z.union([z.string(), z.null()]).optional(),
  status: z.enum(['backlog', 'ready', 'in_progress', 'review', 'merged', 'validated', 'released', 'done', 'archived']).optional(),
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
  reporter: z.string(),
  title: z.string(),
  description: z.string(),
  assignee: z.union([z.string(), z.null()]).optional(),
  priority: z.union([z.string(), z.null()]).optional(),
  severity: z.union([z.string(), z.null()]).optional(),
  version_found: z.union([z.string(), z.null()]).optional(),
  version_fixed: z.union([z.string(), z.null()]).optional(),
  steps_to_reproduce: z.union([z.string(), z.null()]).optional(),
  due_date: z.union([z.string(), z.null()]).optional(),
  labels: z.union([z.unknown(), z.null()]).optional(),
  confidence_score: z.union([z.unknown(), z.null()]).optional(),
  expected_behavior: z.union([z.string(), z.null()]).optional(),
  actual_behavior: z.union([z.string(), z.null()]).optional(),
  environment: z.union([z.string(), z.null()]).optional(),
  logs_link: z.union([z.string(), z.null()]).optional(),
  repro_steps: z.union([z.unknown(), z.null()]).optional()
});

/**
 * Bug metadata schema.

A Bug represents an issue, defect, or unexpected behavior in software
that needs to be addressed.

Bugs inherit from ExecutableMetadata and support agent execution with:
- Planning fields (tool_hints, action_items, acceptance_criteria, expected_artifacts)
- Agent framework fields (execution_timeout_minutes, cost_budget_usd, role_hint)
- Completion fields (deliverables, validation_report)

Bugs can have relationships via BlockLinks:
- bug_affects: Points to a component, project, or system affected by this bug
- is_blocked_by: Points to another task or bug that is blocking this one
- blocks: Points to another task or bug that is blocked by this one
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface BugMetadata {
  x_timestamp?: string;
  x_agent_id: string;
  x_tool_id?: string | null;
  x_parent_block_id?: string | null;
  x_session_id?: string | null;
  status?: 'backlog' | 'ready' | 'in_progress' | 'review' | 'merged' | 'validated' | 'released' | 'done' | 'archived';
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
  reporter: string;
  title: string;
  description: string;
  assignee?: string | null;
  priority?: string | null;
  severity?: string | null;
  version_found?: string | null;
  version_fixed?: string | null;
  steps_to_reproduce?: string | null;
  due_date?: string | null;
  labels?: unknown | null;
  confidence_score?: unknown | null;
  expected_behavior?: string | null;
  actual_behavior?: string | null;
  environment?: string | null;
  logs_link?: string | null;
  repro_steps?: unknown | null;
}
