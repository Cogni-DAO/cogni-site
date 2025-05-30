import React, { useMemo } from 'react';
import {
    CalendarClock, Clock, BarChart4, UserRound, CheckSquare, Layers,
    Tag, AlertCircle, Users, Wallet, Gauge, Wrench, BrainCircuit,
    CheckCircle2, ChevronDown, ChevronUp, Database
} from 'lucide-react';
import BaseBlockRenderer from '../block_renderers/BaseBlockRenderer';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatDistanceToNow } from 'date-fns';
import { WorkItemMeta, PriorityLiteral } from '@/types/workItemMeta';
import FormatRenderer from '@/utils/formatRenderers';
import { getBlockConfidencePercentage } from '@/utils/blockUtils';
import { WorkItemDependencies } from '@/components/work_items/WorkItemDependencies';

interface WorkItemRendererProps {
    block: MemoryBlock;
    meta: WorkItemMeta;
    children?: React.ReactNode;
    title?: string;
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
    blocked: 'bg-red-200 text-red-900',
};

// Priority badge colors supporting PriorityLiteral P0-P5 notation
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
            <CollapsibleTrigger asChild={false}>
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

export const WorkItemRenderer: React.FC<WorkItemRendererProps> = ({
    block,
    meta,
    children,
    title
}) => {
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

    // Compute boolean flags for presence of various metadata
    const metadataFlags = useMemo(() => {
        if (!meta) return {
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
            hasBlockedBy: !!meta.blocked_by?.length,
            hasAcceptanceCriteria: !!meta.acceptance_criteria?.length,
            hasExpectedArtifacts: !!meta.expected_artifacts?.length,
            hasActionItems: !!meta.action_items?.length,
            hasToolHints: !!meta.tool_hints?.length,
            hasDeliverables: !!meta.deliverables?.length,
            hasResources: !!(
                meta.cost_budget_usd ||
                meta.role_hint ||
                meta.execution_timeout_minutes ||
                meta.reviewer
            ),
            hasSystemFields: !!(
                meta['x_agent_id'] ||
                meta['x_tool_id'] ||
                meta['x_parent_block_id'] ||
                meta['x_session_id'] ||
                meta['x_timestamp']
            )
        };
    }, [meta]);

    // Render the title. Prioritize the override prop, then the standardized metadata.title.
    const renderItemTitle = () => {
        const displayTitle =
            title || // 1. Explicit override prop
            ((block.metadata as any)?.title && (block.metadata as any)?.title.trim() !== '' ? (block.metadata as any).title : null) || // 2. Standardized metadata.title (if not empty)
            `Untitled ${block.type || 'Work Item'}`; // 3. Generic fallback
        return <h3 className="text-lg font-serif font-semibold">{displayTitle}</h3>;
    };

    // Render status badge
    const renderStatus = (status?: string | null) => {
        if (!status) return null;

        return (
            <Badge className={cn("font-normal", statusColors[status] || 'bg-gray-300 text-gray-900')}>
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    // Render header metadata
    const renderHeaderRight = () => {
        return (
            <div className="flex flex-wrap items-center gap-2">
                {renderStatus(meta?.status)}
                {meta?.priority && (
                    <Badge className={cn("font-normal", getPriorityColor(meta.priority as string))}>
                        {meta.priority}
                    </Badge>
                )}
            </div>
        );
    };

    // Render key metrics
    const renderMetrics = () => {
        if (!meta) return null;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/50 rounded-md mb-4">
                {/* Status with Execution Phase */}
                {(meta.status || meta.execution_phase) && (
                    <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            {meta.status && <span>Status: {renderStatus(meta.status)}</span>}
                            {meta.status && meta.execution_phase && <span> · </span>}
                            {meta.execution_phase && <span>Phase: {meta.execution_phase}</span>}
                            {!meta.status && !meta.execution_phase && <span className="text-muted-foreground">No status</span>}
                        </span>
                    </div>
                )}

                {/* Completion */}
                <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        {meta.completed ? (
                            <span className="text-green-600">Completed</span>
                        ) : (
                            <span className="text-muted-foreground">Not completed</span>
                        )}
                    </span>
                </div>

                {/* Priority Score */}
                {meta.priority_score !== undefined && meta.priority_score !== null && (
                    <div className="flex items-center gap-2">
                        <BarChart4 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            Priority Score: {meta.priority_score}
                        </span>
                    </div>
                )}

                {/* Assignment */}
                {meta.reviewer && (
                    <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            Reviewer: {meta.reviewer}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    // Render planning section
    const renderPlanningSection = () => {
        const { hasBlockedBy, hasAcceptanceCriteria, hasExpectedArtifacts } = metadataFlags;

        if (!hasBlockedBy && !hasAcceptanceCriteria && !hasExpectedArtifacts && meta.priority_score === undefined) {
            return null;
        }

        return (
            <MetadataSection
                title="Planning Details"
                icon={<BarChart4 className="h-4 w-4" />}
                defaultOpen={true}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {/* Blocked By */}
                    {hasBlockedBy && (
                        <div className="col-span-2">
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <AlertCircle className="h-3.5 w-3.5" /> Blocked By
                            </h5>
                            <ul className="list-disc list-inside">
                                {meta.blocked_by?.map((item, index) => (
                                    <li key={index}>{renderValue(item)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Priority Score */}
                    {meta.priority_score !== undefined && meta.priority_score !== null && (
                        <div>
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <Gauge className="h-3.5 w-3.5" /> Priority Score
                            </h5>
                            <div>{meta.priority_score}</div>
                        </div>
                    )}

                    {/* Acceptance Criteria */}
                    {hasAcceptanceCriteria && (
                        <div className="col-span-2">
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <CheckSquare className="h-3.5 w-3.5" /> Acceptance Criteria
                            </h5>
                            <ul className="list-disc list-inside">
                                {meta.acceptance_criteria?.map((criterion, index) => (
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
                                {meta.expected_artifacts?.map((artifact, index) => (
                                    <li key={index}>{renderValue(artifact)}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </MetadataSection>
        );
    };

    // Render implementation section
    const renderImplementationSection = () => {
        const { hasToolHints, hasActionItems } = metadataFlags;

        if (!hasToolHints && !hasActionItems) {
            return null;
        }

        return (
            <MetadataSection
                title="Implementation Details"
                icon={<Wrench className="h-4 w-4" />}
            >
                <div className="grid grid-cols-1 gap-3 text-sm">
                    {/* Tool Hints */}
                    {hasToolHints && (
                        <div>
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <Wrench className="h-3.5 w-3.5" /> Tool Hints
                            </h5>
                            <ul className="list-disc list-inside">
                                {meta.tool_hints?.map((hint, index) => (
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
                                {meta.action_items?.map((item, index) => (
                                    <li key={index}>{renderValue(item)}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </MetadataSection>
        );
    };

    // Render resources section
    const renderResourcesSection = () => {
        const { hasDeliverables, hasResources } = metadataFlags;

        if (!hasDeliverables && !hasResources && !meta.validation_report) {
            return null;
        }

        return (
            <MetadataSection
                title="Resources & Review"
                icon={<Users className="h-4 w-4" />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {/* Reviewer */}
                    {meta.reviewer && (
                        <div>
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" /> Reviewer
                            </h5>
                            <div>{renderValue(meta.reviewer)}</div>
                        </div>
                    )}

                    {/* Budget */}
                    {meta.cost_budget_usd !== undefined && meta.cost_budget_usd !== null && (
                        <div>
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <Wallet className="h-3.5 w-3.5" /> Budget
                            </h5>
                            <div>${typeof meta.cost_budget_usd === 'number' ? meta.cost_budget_usd.toFixed(2) : renderValue(meta.cost_budget_usd)}</div>
                        </div>
                    )}

                    {/* Role Hint */}
                    {meta.role_hint && (
                        <div>
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <UserRound className="h-3.5 w-3.5" /> Role Hint
                            </h5>
                            <div>{renderValue(meta.role_hint)}</div>
                        </div>
                    )}

                    {/* Execution Timeout */}
                    {meta.execution_timeout_minutes !== undefined && (
                        <div>
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" /> Timeout
                            </h5>
                            <div>{renderValue(meta.execution_timeout_minutes)} minutes</div>
                        </div>
                    )}

                    {/* Deliverables */}
                    {hasDeliverables && (
                        <div className="col-span-2">
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Deliverables
                            </h5>
                            <ul className="list-disc list-inside">
                                {meta.deliverables?.map((item, index) => (
                                    <li key={index}>{renderValue(item)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Validation Report */}
                    {meta.validation_report && (
                        <div className="col-span-2">
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Validation Report
                            </h5>
                            <div>
                                {typeof meta.validation_report === 'string' ? (
                                    <FormatRenderer
                                        content={meta.validation_report}
                                        format="markdown"
                                    />
                                ) : (
                                    renderValue(meta.validation_report)
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </MetadataSection>
        );
    };

    // Render system fields section
    const renderSystemSection = () => {
        const { hasSystemFields } = metadataFlags;

        if (!hasSystemFields) {
            return null;
        }

        const systemFields = Object.entries(meta)
            .filter(([key]) => key.startsWith('x_'))
            .map(([key, value]) => ({ key, value }));

        return (
            <MetadataSection
                title="System Information"
                icon={<Database className="h-4 w-4" />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {systemFields.map(({ key, value }) => (
                        <div key={key}>
                            <h5 className="font-medium mb-1 flex items-center gap-1">
                                <Database className="h-3.5 w-3.5" /> {key.replace('x_', '').replace('_', ' ')}
                            </h5>
                            <div className="font-mono text-xs">{renderValue(value)}</div>
                        </div>
                    ))}
                </div>
            </MetadataSection>
        );
    };

    // Render main content
    const renderContent = () => {
        return (
            <div>
                {renderMetrics()}

                {/* Description from block.text */}
                {block.text && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Description</h4>
                        <div className="text-sm">
                            <FormatRenderer
                                content={block.text}
                                format="markdown"
                            />
                        </div>
                    </div>
                )}

                {/* Dependencies & Relationships */}
                {block.id && (
                    <div className="mb-4">
                        <WorkItemDependencies blockId={block.id} />
                    </div>
                )}

                {/* Renderable sections */}
                {renderPlanningSection()}
                {renderImplementationSection()}
                {renderResourcesSection()}
                {renderSystemSection()}

                {/* Child content */}
                {children}
            </div>
        );
    };

    // Transform related links to add context about relationships
    const transformLinks = useMemo(() => {
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
            titleSlot={renderItemTitle()}
            headerRightSlot={renderHeaderRight()}
            contentSlot={renderContent()}
            getConfidencePercentage={getBlockConfidencePercentage}
            transformLinks={transformLinks}
        />
    );
};

export default WorkItemRenderer; 