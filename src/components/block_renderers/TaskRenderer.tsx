import React, { useMemo } from 'react';
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
import { formatDistanceToNow } from 'date-fns';

interface TaskRendererProps {
    block: MemoryBlock;
    blockId?: string;
}

// Status badge colors with improved contrast
const statusColors: Record<string, string> = {
    backlog: 'bg-slate-300 text-slate-900',
    ready: 'bg-blue-200 text-blue-900',
    in_progress: 'bg-yellow-200 text-yellow-900',
    review: 'bg-purple-200 text-purple-900',
    merged: 'bg-indigo-200 text-indigo-900',
    validated: 'bg-teal-200 text-teal-900',
    released: 'bg-green-200 text-green-900',
    done: 'bg-green-200 text-green-900',
    archived: 'bg-gray-300 text-gray-900',
};

// Priority badge colors supporting both text and P0-P5 notation
const getPriorityColor = (priority: string | null): string => {
    if (!priority) return 'bg-gray-100 text-gray-800';

    // Handle P0-P5 notation
    if (priority.match(/^P[0-5]$/i)) {
        const level = parseInt(priority.substring(1), 10);
        switch (level) {
            case 0: return 'bg-red-200 text-red-900'; // Highest priority
            case 1: return 'bg-orange-200 text-orange-900';
            case 2: return 'bg-amber-200 text-amber-900';
            case 3: return 'bg-yellow-200 text-yellow-900';
            case 4: return 'bg-blue-200 text-blue-900';
            case 5: return 'bg-slate-200 text-slate-900'; // Lowest priority
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    // Handle text-based priorities
    switch (priority.toLowerCase()) {
        case 'high': return 'bg-red-200 text-red-900';
        case 'medium': return 'bg-orange-200 text-orange-900';
        case 'low': return 'bg-blue-200 text-blue-900';
        default: return 'bg-gray-100 text-gray-800';
    }
};

// Helper to safely render any type of content
const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    if (typeof value === 'object') {
        try {
            return (
                <pre className="text-xs p-2 bg-muted rounded-md overflow-auto">
                    {JSON.stringify(value, null, 2)}
                </pre>
            );
        } catch (e) {
            return `[Object: ${Object.prototype.toString.call(value)}]`;
        }
    }

    return String(value);
};

const TaskRenderer: React.FC<TaskRendererProps> = ({ block, blockId }) => {
    // Format a date string to a friendly format with timezone info
    const formatDate = (dateString: string | null | undefined): React.ReactNode => {
        if (!dateString) return null;

        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                console.error(`Invalid date: ${dateString}`);
                return dateString; // Return raw string as fallback
            }

            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            // Add relative time
            const relativeTime = formatDistanceToNow(date, { addSuffix: true });

            return (
                <span title={date.toLocaleString(undefined, { timeZoneName: 'short' })}>
                    {formattedDate} <span className="text-muted-foreground text-xs">({relativeTime})</span>
                </span>
            );
        } catch (e) {
            console.error(`Error formatting date ${dateString}:`, e);
            return dateString; // Return raw string as fallback
        }
    };

    // Get task metadata using narrowMetadata
    const taskMeta = useMemo(() => {
        if (block.type !== MemoryBlockType.task || !block.metadata) return null;
        return narrowMetadata(MemoryBlockType.task, block.metadata);
    }, [block.type, block.metadata]);

    // Compute boolean flags for presence of various metadata
    const metadataFlags = useMemo(() => {
        if (!taskMeta) return {
            hasLabels: false,
            hasBlockedBy: false,
            hasAcceptanceCriteria: false,
            hasExpectedArtifacts: false,
            hasActionItems: false,
            hasToolHints: false,
            hasDeliverables: false,
            hasResources: false,
            hasSystemFields: false
        };

        return {
            hasLabels: !!taskMeta.labels?.length,
            hasBlockedBy: !!taskMeta.blocked_by?.length,
            hasAcceptanceCriteria: !!taskMeta.acceptance_criteria?.length,
            hasExpectedArtifacts: !!taskMeta.expected_artifacts?.length,
            hasActionItems: !!taskMeta.action_items?.length,
            hasToolHints: !!taskMeta.tool_hints?.length,
            hasDeliverables: !!taskMeta.deliverables?.length,
            hasResources: !!(
                taskMeta.cost_budget_usd ||
                taskMeta.role_hint ||
                taskMeta.execution_timeout_minutes ||
                taskMeta.reviewer
            ),
            hasSystemFields: !!(
                taskMeta.x_agent_id ||
                taskMeta.x_tool_id ||
                taskMeta.x_parent_block_id ||
                taskMeta.x_session_id ||
                taskMeta.x_timestamp
            )
        };
    }, [taskMeta]);

    // Render the task title
    const renderTaskTitle = (block: MemoryBlock) => {
        if (block.type !== MemoryBlockType.task) return null;

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
            <Badge className={cn("font-normal", statusColors[status] || 'bg-gray-300 text-gray-900')}>
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    // Render task header metadata
    const renderTaskHeaderRight = (block: MemoryBlock) => {
        if (block.type !== MemoryBlockType.task || !taskMeta) return null;

        return (
            <div className="flex flex-wrap items-center gap-2">
                {renderTaskStatus(taskMeta?.status)}
                {taskMeta?.priority && (
                    <Badge className={cn("font-normal", getPriorityColor(taskMeta.priority))}>
                        {taskMeta.priority}
                    </Badge>
                )}
            </div>
        );
    };

    // Section component for collapsible content with improved accessibility
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
                <CollapsibleTrigger asChild>
                    <button
                        className="flex w-full items-center justify-between p-3 text-sm font-medium text-left hover:bg-muted/50 transition-colors"
                        aria-expanded={isOpen}
                    >
                        <div className="flex items-center gap-2">
                            {icon}
                            {title}
                        </div>
                        <span className="sr-only">{isOpen ? 'Hide' : 'Show'} section</span>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3 pt-0">
                    {children}
                </CollapsibleContent>
            </Collapsible>
        );
    };

    // Render task key metrics (dates, effort, assignments)
    const renderTaskMetrics = () => {
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
                            Phase: {renderValue(taskMeta.phase)}
                        </span>
                    </div>
                )}

                {/* Current Status */}
                {taskMeta.current_status && (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            Status: {renderValue(taskMeta.current_status)}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    // Render task details with collapsible sections
    const renderTaskContent = () => {
        if (!taskMeta) return null;

        const {
            hasLabels, hasBlockedBy, hasAcceptanceCriteria, hasExpectedArtifacts,
            hasActionItems, hasToolHints, hasDeliverables, hasResources, hasSystemFields
        } = metadataFlags;

        return (
            <div>
                {renderTaskMetrics()}

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
                {(hasLabels || hasBlockedBy || taskMeta.priority_score !== undefined || hasAcceptanceCriteria || hasExpectedArtifacts) && (
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
                                                {renderValue(label)}
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
                                            <li key={index}>{renderValue(item)}</li>
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
                                            <li key={index}>{renderValue(criterion)}</li>
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
                                            <li key={index}>{renderValue(artifact)}</li>
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
                                            renderValue(taskMeta.implementation_details)
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
                                            <li key={index}>{renderValue(hint)}</li>
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
                                            <li key={index}>{renderValue(item)}</li>
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
                                    <div>{renderValue(taskMeta.reviewer)}</div>
                                </div>
                            )}

                            {/* Budget */}
                            {taskMeta.cost_budget_usd !== undefined && taskMeta.cost_budget_usd !== null && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Wallet className="h-3.5 w-3.5" /> Budget
                                    </h5>
                                    <div>${typeof taskMeta.cost_budget_usd === 'number' ? taskMeta.cost_budget_usd.toFixed(2) : renderValue(taskMeta.cost_budget_usd)}</div>
                                </div>
                            )}

                            {/* Role Hint */}
                            {taskMeta.role_hint && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <UserRound className="h-3.5 w-3.5" /> Role Hint
                                    </h5>
                                    <div>{renderValue(taskMeta.role_hint)}</div>
                                </div>
                            )}

                            {/* Execution Timeout */}
                            {taskMeta.execution_timeout_minutes !== undefined && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" /> Timeout
                                    </h5>
                                    <div>{renderValue(taskMeta.execution_timeout_minutes)} minutes</div>
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
                                            <li key={index}>{renderValue(item)}</li>
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
                                            renderValue(taskMeta.validation_report)
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
                                    <div className="font-mono text-xs">{renderValue(taskMeta.x_agent_id)}</div>
                                </div>
                            )}

                            {taskMeta.x_tool_id && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Wrench className="h-3.5 w-3.5" /> Tool ID
                                    </h5>
                                    <div className="font-mono text-xs">{renderValue(taskMeta.x_tool_id)}</div>
                                </div>
                            )}

                            {taskMeta.x_parent_block_id && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Database className="h-3.5 w-3.5" /> Parent Block
                                    </h5>
                                    <div className="font-mono text-xs">{renderValue(taskMeta.x_parent_block_id)}</div>
                                </div>
                            )}

                            {taskMeta.x_session_id && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Database className="h-3.5 w-3.5" /> Session ID
                                    </h5>
                                    <div className="font-mono text-xs">{renderValue(taskMeta.x_session_id)}</div>
                                </div>
                            )}

                            {taskMeta.x_timestamp && (
                                <div>
                                    <h5 className="font-medium mb-1 flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" /> Timestamp
                                    </h5>
                                    <div className="font-mono text-xs">{renderValue(taskMeta.x_timestamp)}</div>
                                </div>
                            )}
                        </div>
                    </MetadataSection>
                )}
            </div>
        );
    };

    // Transform related links to add context about relationships
    const transformTaskLinks = useMemo(() => {
        return (block: MemoryBlock) => {
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
    }, []);

    return (
        <BaseBlockRenderer
            block={block}
            titleSlot={renderTaskTitle(block)}
            headerRightSlot={renderTaskHeaderRight(block)}
            contentSlot={renderTaskContent()}
            getConfidencePercentage={getBlockConfidencePercentage}
            transformLinks={transformTaskLinks}
        />
    );
};

export default TaskRenderer; 