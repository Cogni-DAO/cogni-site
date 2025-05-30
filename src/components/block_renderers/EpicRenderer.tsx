import React, { useMemo } from 'react';
import { BarChart4, CalendarClock, UserRound, Target } from 'lucide-react';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { narrowMetadata } from '@/data/block_metadata';
import { EpicMetadata } from '@/data/block_metadata/epic';
import WorkItemRenderer from '@/components/blocks/WorkItemRenderer';
import { WorkItemMeta } from '@/types/workItemMeta';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface EpicRendererProps {
    block: MemoryBlock;
}

const EpicRenderer: React.FC<EpicRendererProps> = ({ block }) => {
    // Get epic metadata using narrowMetadata
    const epicMeta = useMemo(() => {
        if (block.type !== MemoryBlockType.epic || !block.metadata) return null;
        return narrowMetadata(MemoryBlockType.epic, block.metadata) as EpicMetadata;
    }, [block.type, block.metadata]);

    if (!epicMeta) {
        return <div>Invalid epic data</div>;
    }

    // Cast metadata to the combined type
    const meta = epicMeta as WorkItemMeta & EpicMetadata;

    // Epic-specific extras to render within the WorkItemRenderer
    const epicExtras = (
        <>
            {/* Epic-specific fields */}
            {(epicMeta.owner || epicMeta.start_date || epicMeta.target_date ||
                epicMeta.progress_percent !== undefined || epicMeta.tags) && (
                    <div className="border rounded-md mb-4 p-3">
                        <h4 className="text-sm font-medium mb-2">Epic Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {/* Owner */}
                            {epicMeta.owner && (
                                <div className="flex items-center gap-2">
                                    <UserRound className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Owner: {epicMeta.owner}
                                    </span>
                                </div>
                            )}

                            {/* Dates */}
                            {(epicMeta.start_date || epicMeta.target_date) && (
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {epicMeta.start_date && <span>Start: {epicMeta.start_date}</span>}
                                        {epicMeta.start_date && epicMeta.target_date && <span> · </span>}
                                        {epicMeta.target_date && <span>Target: {epicMeta.target_date}</span>}
                                    </span>
                                </div>
                            )}

                            {/* Tags */}
                            {epicMeta.tags && Array.isArray(epicMeta.tags) && epicMeta.tags.length > 0 && (
                                <div className="col-span-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {epicMeta.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary">
                                                {String(tag)}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Progress */}
                            {epicMeta.progress_percent !== undefined && epicMeta.progress_percent !== null && (
                                <div className="col-span-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BarChart4 className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Progress: {epicMeta.progress_percent}%</span>
                                    </div>
                                    <Progress value={epicMeta.progress_percent} className="h-2 w-full" />
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
            title={epicMeta.title}
        >
            {epicExtras}
        </WorkItemRenderer>
    );
};

export default EpicRenderer; 