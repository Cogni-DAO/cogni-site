import React from 'react';
import type { BlockRendererProps } from '@/lib/types';

// Import actual renderers
import { ProjectRenderer } from './block_renderers/ProjectRenderer';
import { UnknownBlockRenderer } from './block_renderers/UnknownBlockRenderer';

// TODO: Create and import these other renderers as needed
// import { TaskRenderer } from './renderers/TaskRenderer';
// import { ThoughtRenderer } from './renderers/ThoughtRenderer'; // Assuming 'Thought' is a type
// import { LogRenderer } from './renderers/LogRenderer';
// import { DocRenderer } from './renderers/DocRenderer';

// Placeholder for renderers not yet created
const PlaceholderRenderer: React.FC<BlockRendererProps> = ({ blockType, data, blockVersion }) => (
    <div className="block-renderer placeholder-block content-block border border-dashed border-gray-400 bg-gray-50 text-gray-700">
        <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-serif font-semibold">Placeholder: {blockType}</h3>
            <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                v{blockVersion}
            </span>
        </div>
        <p className="text-sm mb-3">
            Renderer for this block type needs to be implemented.
        </p>
        <details className="mt-2 text-xs text-muted-foreground">
            <summary className="cursor-pointer">Raw Data</summary>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto text-gray-600">
                {JSON.stringify(data, null, 2)}
            </pre>
        </details>
    </div>
);

export const BlockRenderer: React.FC<BlockRendererProps> = (props) => {
    const { blockType } = props;

    switch (blockType) {
        case 'project':
            return <ProjectRenderer {...props} />;
        case 'task':
            return <PlaceholderRenderer {...props} />;
        case 'log':
            return <PlaceholderRenderer {...props} />;
        case 'doc':
            return <PlaceholderRenderer {...props} />;
        // Add other cases like 'knowledge' if needed
        default:
            return <UnknownBlockRenderer {...props} />;
    }
}; 