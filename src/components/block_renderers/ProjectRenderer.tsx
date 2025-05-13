import React from 'react';
import BaseBlockRenderer from './BaseBlockRenderer';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { narrowMetadata } from '@/data/block_metadata';
import { getBlockConfidencePercentage } from '@/utils/blockUtils';

interface ProjectRendererProps {
    block: MemoryBlock;
    blockId?: string;
}

export const ProjectRenderer: React.FC<ProjectRendererProps> = ({ block, blockId }) => {
    // Render project title with prefix
    const renderProjectTitle = (block: MemoryBlock) => {
        const projectMeta = block.type === MemoryBlockType.project
            ? narrowMetadata(MemoryBlockType.project, block.metadata)
            : null;

        const projectName = projectMeta?.name || block.text || `Project ${blockId || block.id}`;

        return (
            <h3 className="text-lg font-serif font-semibold">
                Project: {projectName}
            </h3>
        );
    };

    // Render project content with description
    const renderProjectContent = (block: MemoryBlock) => {
        const projectMeta = block.type === MemoryBlockType.project
            ? narrowMetadata(MemoryBlockType.project, block.metadata)
            : null;

        return (
            <div>
                {projectMeta?.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                        {String(projectMeta.description)}
                    </p>
                )}
                <div>
                    {block.text}
                </div>
            </div>
        );
    };

    return (
        <BaseBlockRenderer
            block={block}
            renderTitle={renderProjectTitle}
            renderContent={renderProjectContent}
            getConfidencePercentage={getBlockConfidencePercentage}
        />
    );
}; 