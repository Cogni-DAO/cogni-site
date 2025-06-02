'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useBlockLinks } from '@/hooks/useBlockLinks';
import { useBlocksByIds } from '@/hooks/useBlocks';
import { LinkedWorkItem, LinkedWorkItemOptimized } from './LinkedWorkItem';

interface WorkItemSubtasksProps {
    blockId: string;
}

export function WorkItemSubtasks({ blockId }: WorkItemSubtasksProps) {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [showParentTasks, setShowParentTasks] = useState(false);

    const { linksFrom, linksTo, isLoading: linksLoading, isError } = useBlockLinks(blockId, {
        from: { relation: 'subtask_of' },
        to: { relation: 'subtask_of' }
    });

    // Extract all block IDs that we need to fetch
    const blockIds = useMemo(() => {
        const ids: string[] = [];

        // Parent task IDs (what this is a subtask of)
        linksFrom?.forEach(link => {
            if (link.to_id) ids.push(link.to_id);
        });

        // Subtask IDs (what has this as a parent)
        linksTo?.forEach(link => {
            if (link.from_id) ids.push(link.from_id);
        });

        return ids;
    }, [linksFrom, linksTo]);

    // Bulk fetch all related blocks
    const { blocksMap, isLoading: blocksLoading } = useBlocksByIds(blockIds);

    const isLoading = linksLoading || blocksLoading;

    if (isLoading) {
        return (
            <div className="text-sm text-muted-foreground">
                Loading subtasks...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-sm text-red-600">
                Failed to load subtasks
            </div>
        );
    }

    const parentTasks = linksFrom || [];
    const subtasks = linksTo || [];

    if (parentTasks.length === 0 && subtasks.length === 0) {
        return (
            <div className="text-sm text-muted-foreground">
                No subtasks
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* Parent Tasks (what this is a subtask of) */}
            {parentTasks.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowParentTasks(!showParentTasks)}
                        className="flex items-center gap-2 text-sm hover:text-foreground transition-colors"
                    >
                        {showParentTasks ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                        <span className="text-muted-foreground">
                            Subtask of ({parentTasks.length})
                        </span>
                    </button>

                    {showParentTasks && (
                        <div className="ml-5 mt-1 space-y-1">
                            {parentTasks.map((link, index) => {
                                const blockId = link.to_id || '';
                                const block = blocksMap?.get(blockId);

                                return block ? (
                                    <LinkedWorkItemOptimized
                                        key={`parent-${index}`}
                                        block={block}
                                    />
                                ) : (
                                    <LinkedWorkItem
                                        key={`parent-${index}`}
                                        blockId={blockId}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Subtasks (what has this as a parent task) */}
            {subtasks.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowSubtasks(!showSubtasks)}
                        className="flex items-center gap-2 text-sm hover:text-foreground transition-colors"
                    >
                        {showSubtasks ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                        <span className="text-muted-foreground">
                            Subtasks ({subtasks.length})
                        </span>
                    </button>

                    {showSubtasks && (
                        <div className="ml-5 mt-1 space-y-1">
                            {subtasks.map((link, index) => {
                                const blockId = link.from_id || '';
                                const block = blocksMap?.get(blockId);

                                return block ? (
                                    <LinkedWorkItemOptimized
                                        key={`subtask-${index}`}
                                        block={block}
                                    />
                                ) : (
                                    <LinkedWorkItem
                                        key={`subtask-${index}`}
                                        blockId={blockId}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 