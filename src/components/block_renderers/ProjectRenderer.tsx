import React from 'react';
import type { BlockRendererProps } from '@/lib/types';

export const ProjectRenderer: React.FC<BlockRendererProps> = ({ data, blockId }) => {
    // Ensure projectName is a string for rendering
    const projectTitleFromMetadata = typeof data.metadata?.name === 'string' ? data.metadata.name : undefined;
    const projectName = projectTitleFromMetadata || data.text || `Project ${blockId}`;

    return (
        <div className="block-renderer project-block content-block border p-4 my-2 rounded bg-blue-50">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-serif font-semibold text-blue-800">Project: {projectName}</h3>
                {/* Add type/version span if needed, similar to KnowledgeBlock */}
            </div>
            {/* Maybe add Progress component if applicable? */}
            {data.metadata?.description && (
                <p className="text-sm text-muted-foreground mb-3">{String(data.metadata.description)}</p>
            )}
            <details className="mt-2 text-xs text-gray-500">
                <summary className="cursor-pointer">Details</summary>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto text-gray-600">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </details>
        </div>
    );
}; 