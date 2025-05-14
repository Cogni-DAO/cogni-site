export type ExecutorStatus =
    | 'backlog' | 'ready' | 'in_progress' | 'review'
    | 'merged' | 'validated' | 'released' | 'done'
    | 'archived' | 'blocked';

export type ExecutionPhase =
    | 'designing' | 'implementing' | 'testing'
    | 'debugging' | 'documenting' | 'awaiting_review';

export type PriorityLiteral = 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

export interface ExecutableMeta {
    /* planning */
    tool_hints?: string[];
    action_items?: unknown[];
    acceptance_criteria: unknown[];
    expected_artifacts?: unknown[];
    blocked_by?: string[]; // UUID strings
    priority?: PriorityLiteral | string;

    /* workflow */
    status: ExecutorStatus;
    execution_phase?: ExecutionPhase;
    priority_score?: number;
    reviewer?: string;

    /* agent */
    execution_timeout_minutes?: number;
    cost_budget_usd?: number;
    role_hint?: string;

    /* completion */
    deliverables?: unknown[];
    validation_report?: unknown;

    /* invariant helper */
    completed?: boolean;
    [key: `x_${string}`]: unknown;
} 