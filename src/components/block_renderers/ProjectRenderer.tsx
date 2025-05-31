import React, { useMemo } from 'react';
import { BarChart4, CalendarClock, UserRound } from 'lucide-react';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { narrowMetadata } from '@/data/block_metadata';
import { ProjectMetadata } from '@/data/block_metadata/project';
import { WorkItemRenderer } from '@/components/blocks/WorkItemRenderer';
import { WorkItemMeta } from '@/types/workItemMeta';
import { Progress } from '@/components/ui/progress';

interface ProjectRendererProps {
    block: MemoryBlock;
}

const ProjectRenderer: React.FC<ProjectRendererProps> = ({ block }) => {
    // Get project metadata using narrowMetadata
    const projectMeta = useMemo(() => {
        if (block.type !== MemoryBlockType.project || !block.metadata) return null;
        return narrowMetadata(MemoryBlockType.project, block.metadata) as ProjectMetadata;
    }, [block.type, block.metadata]);

    if (!projectMeta) {
        return <div>Invalid project data</div>;
    }

    // Cast metadata to the combined type
    const meta = projectMeta as WorkItemMeta & ProjectMetadata;

    // Project-specific extras to render within the WorkItemRenderer
    const projectExtras = (
        <>
            {/* Project-specific fields */}
            {(projectMeta.owner || projectMeta.start_date || projectMeta.target_date ||
                projectMeta.progress_percent !== undefined || projectMeta.tags) && (
                    <div className="border rounded-md mb-4 p-3">
                        <h4 className="text-sm font-medium mb-2">Project-specific Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {/* Owner */}
                            {projectMeta.owner && (
                                <div className="flex items-center gap-2">
                                    <UserRound className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Owner: {projectMeta.owner}
                                    </span>
                                </div>
                            )}

                            {/* Dates */}
                            {(projectMeta.start_date || projectMeta.target_date) && (
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {projectMeta.start_date && <span>Start: {projectMeta.start_date}</span>}
                                        {projectMeta.start_date && projectMeta.target_date && <span> · </span>}
                                        {projectMeta.target_date && <span>Target: {projectMeta.target_date}</span>}
                                    </span>
                                </div>
                            )}

                            {/* Progress */}
                            {projectMeta.progress_percent !== undefined && projectMeta.progress_percent !== null && (
                                <div className="col-span-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BarChart4 className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Progress: {projectMeta.progress_percent}%</span>
                                    </div>
                                    <Progress value={projectMeta.progress_percent} className="h-2 w-full" />
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
            title={projectMeta.title}
        >
            {projectExtras}
        </WorkItemRenderer>
    );
};

export default ProjectRenderer; 