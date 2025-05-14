import React from 'react';
import {
    CalendarClock, Clock, BarChart4, UserRound, CheckSquare, Layers, ArrowUpRight,
    Tag, AlertCircle, Users, Wallet, Gauge, Wrench, BrainCircuit, CheckCircle2,
    ChevronDown, ChevronUp, Database
} from 'lucide-react';
import BaseBlockRenderer from './BaseBlockRenderer';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import FormatRenderer from '@/utils/formatRenderers';
import { getBlockConfidencePercentage } from '@/utils/blockUtils';
import { narrowMetadata } from '@/data/block_metadata';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TaskRendererProps {
    block: MemoryBlock;
    blockId?: string;
}

// Status badge colors
const statusColors: Record<string, string> = {
    backlog: 'bg-slate-200 text-slate-800',
    ready: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    review: 'bg-purple-100 text-purple-800',
    merged: 'bg-indigo-100 text-indigo-800',
    validated: 'bg-teal-100 text-teal-800',
    released: 'bg-green-100 text-green-800',
    done: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
};

// Priority badge colors
const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-blue-100 text-blue-800',
};

const TaskRenderer: React.FC<TaskRendererProps> = ({ block, blockId }) => {
    // Format a date string to a friendly format
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Render the task title
    const renderTaskTitle = (block: MemoryBlock) => {
        if (block.type !== MemoryBlockType.task) return null;

        const taskMeta = narrowMetadata(MemoryBlockType.task, block.metadata);
        return (
            <h3 className="text-lg font-serif font-semibold">
                {taskMeta?.title || block.text?.substring(0, 50) || 'Untitled Task'}
            </h3>
        );
    };

    // Render task status badge
    const renderTaskStatus = (status?: string | null) => {
        if (!status) return null;

        return (
            <Badge className={cn("font-normal", statusColors[status] || 'bg-gray-100 text-gray-800')}>
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    // Render task header metadata
    const renderTaskHeaderRight = (block: MemoryBlock) => {
        if (block.type !== MemoryBlockType.task) return null;

        const taskMeta = narrowMetadata(MemoryBlockType.task, block.metadata);
        return (
            <div className="flex flex-wrap items-center gap-2">
                {renderTaskStatus(taskMeta?.status)}
                {taskMeta?.priority && (
                    <Badge className={cn("font-normal", priorityColors[taskMeta.priority] || 'bg-gray-100')}>
                        {taskMeta.priority}
                    </Badge>
                )}
            </div>
        );
    };

    // Section component for collapsible content
    const MetadataSection = ({
        title,
        icon,
        children,
        defaultOpen = false
    }: {
        title: string;
        icon: React.ReactNode;
        children: React.ReactNode;
        defaultOpen?: boolean;
    }) => {
        const [isOpen, setIsOpen] = React.useState(defaultOpen);

        return (
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="border rounded-md mb-4"
            >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        {icon}
                        {title}
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3 pt-0">
                    {children}
                </CollapsibleContent>
            </Collapsible>
        );
    };

    // Render task key metrics (dates, effort, assignments)
    const renderTaskMetrics = (block: MemoryBlock) => {
        if (block.type !== MemoryBlockType.task) return null;

        const taskMeta = narrowMetadata(MemoryBlockType.task, block.metadata);

        if (!taskMeta) return null;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/50 rounded-md mb-4">
                {/* Dates */}
                <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        {taskMeta.start_date && <span>Start: {formatDate(taskMeta.start_date)}</span>}
                        {taskMeta.start_date && taskMeta.due_date && <span> · </span>}
                        {taskMeta.due_date && <span>Due: {formatDate(taskMeta.due_date)}</span>}
                        {!taskMeta.start_date && !taskMeta.due_date && <span className="text-muted-foreground">No dates set</span>}
                    </span>
                </div>

                {/* Estimates */}
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        {taskMeta.estimate_hours && <span>{taskMeta.estimate_hours}h</span>}
                        {taskMeta.estimate_hours && taskMeta.story_points && <span> · </span>}
                        {taskMeta.story_points && <span>{taskMeta.story_points} points</span>}
                        {!taskMeta.estimate_hours && !taskMeta.story_points && <span className="text-muted-foreground">No estimate</span>}
                    </span>
                </div>

                {/* Assignment */}
                <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        {taskMeta.assignee ? (
                            <span>Assigned to: {taskMeta.assignee}</span>
                        ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                        )}
                    </span>
                </div>

                {/* Completion */}
                <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        {taskMeta.completed ? (
                            <span className="text-green-600">Completed</span>
                        ) : (
                            <span className="text-muted-foreground">Not completed</span>
                        )}
                    </span>
                </div>

                {/* Phase */}
                {taskMeta.phase && (
                    <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            Phase: {taskMeta.phase}
                        </span>
                    </div>
                )}

                {/* Current Status */}
                {taskMeta.current_status && (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            Status: {taskMeta.current_status}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    // Render task details with collapsible sections
    const renderTaskContent = (block: MemoryBlock) => {
        if (block.type !== MemoryBlockType.task) return null;

        const taskMeta = narrowMetadata(MemoryBlockType.task, block.metadata);
        if (!taskMeta) return null;

        const hasLabels = taskMeta.labels && taskMeta.labels.length > 0;
        const hasBlockedBy = taskMeta.blocked_by && taskMeta.blocked_by.length > 0;
        const hasAcceptanceCriteria = taskMeta.acceptance_criteria && taskMeta.acceptance_criteria.length > 0;
        const hasExpectedArtifacts = taskMeta.expected_artifacts && taskMeta.expected_artifacts.length > 0;
        const hasActionItems = taskMeta.action_items && taskMeta.action_items.length > 0;
        const hasToolHints = taskMeta.tool_hints && taskMeta.tool_hints.length > 0;
        const hasDeliverables = taskMeta.deliverables && taskMeta.deliverables.length > 0;

        const hasResources =
            taskMeta.cost_budget_usd ||
            taskMeta.role_hint ||
            taskMeta.execution_timeout_minutes ||
            taskMeta.reviewer;

        const hasSystemFields =
            taskMeta.x_agent_id ||
            taskMeta.x_tool_id ||
            taskMeta.x_parent_block_id ||
            taskMeta.x_session_id ||
            taskMeta.x_timestamp;

        return (
            <div>
                {renderTaskMetrics(block)}

                {/* Description */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4" /> Description
                    </h4>
                    <div className="text-sm">
                        <FormatRenderer
                            content={taskMeta?.description || block.text || ''}
                            format="markdown"
                        />
                    </div>
                </div>

                {/* Planning Details Section */}
                {(hasLabels || hasBlockedBy || taskMeta.priority_score || hasAcceptanceCriteria || hasExpectedArtifacts) && (
                    <MetadataSection
                        title="Planning Details"
                        icon={<BarChart4 className="h-4 w-4" />}
                        defaultOpen={true}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {/* Labels/Tags */}
                            {hasLabels && (
                                <div className="col-span-2">
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Tag className="h-3.5 w-3.5" /> Labels
                                    </h5>
                                    <div className="flex flex-wrap gap-1">
                                        {taskMeta.labels?.map((label, index) => (
                                            <Badge key={index} variant="secondary">
                                                {label?.toString()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Blocked By */}
                            {hasBlockedBy && (
                                <div className="col-span-2">
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <AlertCircle className="h-3.5 w-3.5" /> Blocked By
                                    </h5>
                                    <ul className="list-disc list-inside">
                                        {taskMeta.blocked_by?.map((item, index) => (
                                            <li key={index}>{item?.toString()}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Priority Score */}
                            {taskMeta.priority_score !== undefined && taskMeta.priority_score !== null && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Gauge className="h-3.5 w-3.5" /> Priority Score
                                    </h5>
                                    <div>{taskMeta.priority_score}</div>
                                </div>
                            )}

                            {/* Acceptance Criteria */}
                            {hasAcceptanceCriteria && (
                                <div className="col-span-2">
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <CheckSquare className="h-3.5 w-3.5" /> Acceptance Criteria
                                    </h5>
                                    <ul className="list-disc list-inside">
                                        {taskMeta.acceptance_criteria?.map((criterion, index) => (
                                            <li key={index}>{criterion?.toString() || ''}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Expected Artifacts */}
                            {hasExpectedArtifacts && (
                                <div className="col-span-2">
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Layers className="h-3.5 w-3.5" /> Expected Artifacts
                                    </h5>
                                    <ul className="list-disc list-inside">
                                        {taskMeta.expected_artifacts?.map((artifact, index) => (
                                            <li key={index}>{artifact?.toString() || ''}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </MetadataSection>
                )}

                {/* Implementation Details Section */}
                {(taskMeta.implementation_details || hasToolHints || hasActionItems) && (
                    <MetadataSection
                        title="Implementation Details"
                        icon={<Wrench className="h-4 w-4" />}
                    >
                        <div className="grid grid-cols-1 gap-3 text-sm">
                            {/* Implementation Details */}
                            {taskMeta.implementation_details && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Wrench className="h-3.5 w-3.5" /> Implementation Approach
                                    </h5>
                                    <div>
                                        {typeof taskMeta.implementation_details === 'string' ? (
                                            <FormatRenderer
                                                content={taskMeta.implementation_details}
                                                format="markdown"
                                            />
                                        ) : (
                                            <pre className="text-xs p-2 bg-muted rounded-md">
                                                {JSON.stringify(taskMeta.implementation_details, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tool Hints */}
                            {hasToolHints && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Wrench className="h-3.5 w-3.5" /> Tool Hints
                                    </h5>
                                    <ul className="list-disc list-inside">
                                        {taskMeta.tool_hints?.map((hint, index) => (
                                            <li key={index}>{hint?.toString() || ''}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Action Items */}
                            {hasActionItems && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <BarChart4 className="h-3.5 w-3.5" /> Action Items
                                    </h5>
                                    <ul className="list-disc list-inside">
                                        {taskMeta.action_items?.map((item, index) => (
                                            <li key={index}>{item?.toString() || ''}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </MetadataSection>
                )}

                {/* Resources & Review Section */}
                {(hasResources || hasDeliverables || taskMeta.validation_report) && (
                    <MetadataSection
                        title="Resources & Review"
                        icon={<Users className="h-4 w-4" />}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {/* Reviewer */}
                            {taskMeta.reviewer && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" /> Reviewer
                                    </h5>
                                    <div>{taskMeta.reviewer}</div>
                                </div>
                            )}

                            {/* Budget */}
                            {taskMeta.cost_budget_usd && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Wallet className="h-3.5 w-3.5" /> Budget
                                    </h5>
                                    <div>${taskMeta.cost_budget_usd.toFixed(2)}</div>
                                </div>
                            )}

                            {/* Role Hint */}
                            {taskMeta.role_hint && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <UserRound className="h-3.5 w-3.5" /> Role Hint
                                    </h5>
                                    <div>{taskMeta.role_hint}</div>
                                </div>
                            )}

                            {/* Execution Timeout */}
                            {taskMeta.execution_timeout_minutes && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" /> Timeout
                                    </h5>
                                    <div>{taskMeta.execution_timeout_minutes} minutes</div>
                                </div>
                            )}

                            {/* Deliverables */}
                            {hasDeliverables && (
                                <div className="col-span-2">
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Deliverables
                                    </h5>
                                    <ul className="list-disc list-inside">
                                        {taskMeta.deliverables?.map((item, index) => (
                                            <li key={index}>{item?.toString() || ''}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Validation Report */}
                            {taskMeta.validation_report && (
                                <div className="col-span-2">
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Validation Report
                                    </h5>
                                    <div>
                                        {typeof taskMeta.validation_report === 'string' ? (
                                            <FormatRenderer
                                                content={taskMeta.validation_report}
                                                format="markdown"
                                            />
                                        ) : (
                                            <pre className="text-xs p-2 bg-muted rounded-md">
                                                {JSON.stringify(taskMeta.validation_report, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </MetadataSection>
                )}

                {/* System Fields Section */}
                {hasSystemFields && (
                    <MetadataSection
                        title="System Information"
                        icon={<Database className="h-4 w-4" />}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {taskMeta.x_agent_id && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <BrainCircuit className="h-3.5 w-3.5" /> Agent ID
                                    </h5>
                                    <div className="font-mono text-xs">{taskMeta.x_agent_id}</div>
                                </div>
                            )}

                            {taskMeta.x_tool_id && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Wrench className="h-3.5 w-3.5" /> Tool ID
                                    </h5>
                                    <div className="font-mono text-xs">{taskMeta.x_tool_id}</div>
                                </div>
                            )}

                            {taskMeta.x_parent_block_id && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Database className="h-3.5 w-3.5" /> Parent Block
                                    </h5>
                                    <div className="font-mono text-xs">{taskMeta.x_parent_block_id}</div>
                                </div>
                            )}

                            {taskMeta.x_session_id && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Database className="h-3.5 w-3.5" /> Session ID
                                    </h5>
                                    <div className="font-mono text-xs">{taskMeta.x_session_id}</div>
                                </div>
                            )}

                            {taskMeta.x_timestamp && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" /> Timestamp
                                    </h5>
                                    <div className="font-mono text-xs">{taskMeta.x_timestamp}</div>
                                </div>
                            )}
                        </div>
                    </MetadataSection>
                )}
            </div>
        );
    };

    // Transform related links to add context about relationships
    const transformTaskLinks = (block: MemoryBlock) => {
        if (!block.links || block.links.length === 0) {
            return [];
        }

        // Create more descriptive link titles based on the relation type
        return block.links.map(link => {
            // Get relation type and format it for display
            const relation = link.relation?.replace('_', ' ') || 'related to';

            return {
                title: `${relation}: ${link.to_id}`,
                slug: link.to_id
            };
        });
    };

    return (
        <BaseBlockRenderer
            block={block}
            titleSlot={renderTaskTitle(block)}
            headerRightSlot={renderTaskHeaderRight(block)}
            contentSlot={renderTaskContent(block)}
            getConfidencePercentage={getBlockConfidencePercentage}
            transformLinks={transformTaskLinks}
        />
    );
};

export default TaskRenderer; 