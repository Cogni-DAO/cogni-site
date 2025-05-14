import React, { useMemo } from 'react';
import { CalendarClock, Clock, UserRound } from 'lucide-react';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { narrowMetadata } from '@/data/block_metadata';
import { TaskMetadata } from '@/data/block_metadata/task';
import WorkItemRenderer from '@/components/blocks/WorkItemRenderer';
import { WorkItemMeta } from '@/types/WorkItemMeta';
import FormatRenderer from '@/utils/formatRenderers';

interface TaskRendererProps {
    block: MemoryBlock;
}

const TaskRenderer: React.FC<TaskRendererProps> = ({ block }) => {
    // Get task metadata using narrowMetadata
    const taskMeta = useMemo(() => {
        if (block.type !== MemoryBlockType.task || !block.metadata) return null;
        return narrowMetadata(MemoryBlockType.task, block.metadata) as TaskMetadata;
    }, [block.type, block.metadata]);

    if (!taskMeta) {
        return <div>Invalid task data</div>;
    }

    // Cast metadata to the combined type
    const meta = taskMeta as WorkItemMeta & TaskMetadata;

    // Task-specific extras to render within the WorkItemRenderer
    const taskExtras = (
        <>
            {/* Task-specific fields like estimates, dates, and assignee */}
            {(taskMeta.estimate_hours || taskMeta.story_points || taskMeta.start_date ||
                taskMeta.due_date || taskMeta.assignee || taskMeta.implementation_details) && (
                    <div className="border rounded-md mb-4 p-3">
                        <h4 className="text-sm font-medium mb-2">Task-specific Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {/* Dates */}
                            {(taskMeta.start_date || taskMeta.due_date) && (
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {taskMeta.start_date && <span>Start: {taskMeta.start_date}</span>}
                                        {taskMeta.start_date && taskMeta.due_date && <span> · </span>}
                                        {taskMeta.due_date && <span>Due: {taskMeta.due_date}</span>}
                                    </span>
                                </div>
                            )}

                            {/* Estimates */}
                            {(taskMeta.estimate_hours || taskMeta.story_points) && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {taskMeta.estimate_hours && <span>{taskMeta.estimate_hours}h</span>}
                                        {taskMeta.estimate_hours && taskMeta.story_points && <span> · </span>}
                                        {taskMeta.story_points && <span>{taskMeta.story_points} points</span>}
                                    </span>
                                </div>
                            )}

                            {/* Assignment */}
                            {taskMeta.assignee && (
                                <div className="flex items-center gap-2">
                                    <UserRound className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Assigned to: {taskMeta.assignee}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Implementation Details */}
                        {taskMeta.implementation_details && (
                            <div className="mt-3">
                                <h5 className="font-medium mb-1">Implementation Details</h5>
                                {typeof taskMeta.implementation_details === 'string' ? (
                                    <FormatRenderer
                                        content={taskMeta.implementation_details}
                                        format="markdown"
                                    />
                                ) : (
                                    <pre className="text-xs p-2 bg-muted rounded-md overflow-auto">
                                        {JSON.stringify(taskMeta.implementation_details, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                )}
        </>
    );

    return (
        <WorkItemRenderer
            block={block}
            meta={meta}
            title={taskMeta.title}
        >
            {taskExtras}
        </WorkItemRenderer>
    );
};

export default TaskRenderer; 