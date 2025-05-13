import React, { lazy, Suspense } from 'react';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { rendererManifest } from './blockRendererRegistry.data';

/**
 * Base props that all block renderers should accept
 */
export interface BaseBlockRendererProps {
    blockId: string;
    blockType: MemoryBlockType;
    blockVersion?: number;
    data: {
        text?: string;
        metadata?: unknown;
        [key: string]: unknown;
    };
}

/**
 * Props that combine BaseBlockRendererProps with any additional props
 */
export type AnyBlockRendererProps = BaseBlockRendererProps;

/**
 * Fallback renderer for unknown block types or versions
 */
export const UnknownBlockRenderer: React.FC<AnyBlockRendererProps> = ({
    blockId,
    blockType,
    blockVersion,
    data
}) => (
    <div className= "block-renderer unknown-block border border-yellow-300 p-4 rounded-lg bg-yellow-50" >
    <div className="flex justify-between items-start mb-2" >
        <h3 className="text-lg font-medium text-yellow-800" >
            Unknown Block: { blockType }
</h3>
    < span className = "text-xs bg-yellow-200 px-2 py-1 rounded-full" >
        { blockType } { blockVersion && `v${blockVersion}` }
</span>
    </div>
    < p className = "text-sm text-yellow-700 mb-3" > { data.text || 'No content' } </p>

        < details className = "mt-2 text-xs text-yellow-600" >
            <summary className="cursor-pointer" > View raw data </summary>
                < pre className = "mt-1 p-2 bg-yellow-100 rounded overflow-auto text-xs" >
                    { JSON.stringify({ blockId, blockType, blockVersion, data }, null, 2) }
                    </pre>
                    </details>
                    </div>
);

/**
 * Get the appropriate renderer component for a given block type and version
 */
export function getRendererComponent(blockType: string, version: number = 1): React.ComponentType<AnyBlockRendererProps> {
    const capitalizedType = blockType.charAt(0).toUpperCase() + blockType.slice(1);
    const key = `${capitalizedType}_v${version}`;

    if (rendererManifest[key]) {
        // Dynamic import of the renderer component
        const DynamicRenderer = lazy(() => import(/* @vite-ignore */ rendererManifest[key]));

        // Wrapper component to handle Suspense loading
        return function RendererWithSuspense(props: AnyBlockRendererProps) {
            return (
                <Suspense fallback= {< div className = "p-4 border rounded-lg animate-pulse" > Loading renderer...</div>
        } >
            <DynamicRenderer { ...props } />
            </Suspense>
            );
    };
}

return UnknownBlockRenderer;
} 