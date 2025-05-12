import React from 'react';
import type { BlockRendererProps } from '@/lib/types';

export const UnknownBlockRenderer: React.FC<BlockRendererProps> = ({ blockType, blockVersion, data }) => {
    return (
        <div
            className="block-renderer unknown-block border border-dashed border-red-400 p-4 my-2 rounded bg-red-50 text-red-700"
        >
            <strong className="font-semibold">Unknown / Unsupported Block</strong>
            <p className="text-sm">
                Type: {blockType}, Version: {blockVersion}
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