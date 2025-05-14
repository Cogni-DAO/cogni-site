import React from 'react';
import type { BlockRendererProps } from '@/lib/types';

const UnknownBlockRenderer: React.FC<BlockRendererProps> = ({ blockType, blockVersion, data }) => {
    return (
        <div
            className="block-renderer unknown-block content-block border border-dashed border-red-400 bg-red-50 text-red-700"
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-serif font-semibold">Unknown / Unsupported Block</h3>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                    {blockType} v{blockVersion}
                </span>
            </div>
            <p className="text-sm mb-3">
                This block type or version is not recognized by the current renderer configuration.
            </p>
            <details className="mt-2 text-xs">
                <summary className="cursor-pointer">Raw Data</summary>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto text-gray-600">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </details>
        </div>
    );
};

export default UnknownBlockRenderer; 