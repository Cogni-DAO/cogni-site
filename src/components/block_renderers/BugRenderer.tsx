import React, { useMemo } from 'react';
import { AlertTriangle, Calendar, Tag, UserRound, Bug } from 'lucide-react';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { narrowMetadata } from '@/data/block_metadata';
import { BugMetadata } from '@/data/block_metadata/bug';
import WorkItemRenderer from '@/components/blocks/WorkItemRenderer';
import { WorkItemMeta } from '@/types/WorkItemMeta';
import { Badge } from '@/components/ui/badge';
import FormatRenderer from '@/utils/formatRenderers';

interface BugRendererProps {
    block: MemoryBlock;
}

const BugRenderer: React.FC<BugRendererProps> = ({ block }) => {
    // Get bug metadata using narrowMetadata
    const bugMeta = useMemo(() => {
        if (block.type !== MemoryBlockType.bug || !block.metadata) return null;
        return narrowMetadata(MemoryBlockType.bug, block.metadata) as BugMetadata;
    }, [block.type, block.metadata]);

    if (!bugMeta) {
        return <div>Invalid bug data</div>;
    }

    // Cast metadata to the combined type
    const meta = bugMeta as WorkItemMeta & BugMetadata;

    // Bug-specific extras to render within the WorkItemRenderer
    const bugExtras = (
        <>
            {/* Bug-specific fields */}
            {(bugMeta.reporter || bugMeta.assignee || bugMeta.severity ||
                bugMeta.version_found || bugMeta.version_fixed || bugMeta.due_date ||
                bugMeta.expected_behavior || bugMeta.actual_behavior || bugMeta.environment ||
                bugMeta.logs_link || bugMeta.steps_to_reproduce) && (
                    <div className="border rounded-md mb-4 p-3">
                        <h4 className="text-sm font-medium mb-2">Bug Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {/* Reporter & Assignee */}
                            <div className="flex items-center gap-2">
                                <UserRound className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    Reporter: {bugMeta.reporter}
                                    {bugMeta.assignee && <span> · Assignee: {bugMeta.assignee}</span>}
                                </span>
                            </div>

                            {/* Severity */}
                            {bugMeta.severity && (
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Severity: <Badge variant="outline">{bugMeta.severity}</Badge>
                                    </span>
                                </div>
                            )}

                            {/* Version & Due Date */}
                            {(bugMeta.version_found || bugMeta.version_fixed || bugMeta.due_date) && (
                                <div className="flex items-center gap-2">
                                    <Bug className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {bugMeta.version_found && <span>Found in: {bugMeta.version_found}</span>}
                                        {bugMeta.version_found && bugMeta.version_fixed && <span> · </span>}
                                        {bugMeta.version_fixed && <span>Fixed in: {bugMeta.version_fixed}</span>}
                                    </span>
                                </div>
                            )}

                            {bugMeta.due_date && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Due: {bugMeta.due_date}</span>
                                </div>
                            )}

                            {/* Environment */}
                            {bugMeta.environment && (
                                <div className="col-span-2">
                                    <h5 className="font-medium mb-1">Environment</h5>
                                    <p>{bugMeta.environment}</p>
                                </div>
                            )}

                            {/* Expected vs Actual Behavior */}
                            {(bugMeta.expected_behavior || bugMeta.actual_behavior) && (
                                <div className="col-span-2 grid grid-cols-1 gap-2">
                                    {bugMeta.expected_behavior && (
                                        <div>
                                            <h5 className="font-medium">Expected Behavior</h5>
                                            <p>{bugMeta.expected_behavior}</p>
                                        </div>
                                    )}
                                    {bugMeta.actual_behavior && (
                                        <div>
                                            <h5 className="font-medium">Actual Behavior</h5>
                                            <p>{bugMeta.actual_behavior}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Steps to Reproduce */}
                            {bugMeta.steps_to_reproduce && (
                                <div className="col-span-2">
                                    <h5 className="font-medium mb-1">Steps to Reproduce</h5>
                                    {typeof bugMeta.steps_to_reproduce === 'string' ? (
                                        <FormatRenderer
                                            content={bugMeta.steps_to_reproduce}
                                            format="markdown"
                                        />
                                    ) : (
                                        <p>{String(bugMeta.steps_to_reproduce)}</p>
                                    )}
                                </div>
                            )}

                            {/* Logs Link */}
                            {bugMeta.logs_link && (
                                <div className="col-span-2">
                                    <h5 className="font-medium mb-1">Logs</h5>
                                    <a
                                        href={bugMeta.logs_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View Logs
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
        </>
    );

    return (
        <WorkItemRenderer
            block={block}
            meta={meta}
            title={bugMeta.title}
        >
            {bugExtras}
        </WorkItemRenderer>
    );
};

export default BugRenderer; 