'use client';

import { useState, useEffect } from 'react';
import { fetchBlocks, type BlocksResponse } from '@/utils/blocks';
import MemoryBlockRenderer from '@/components/MemoryBlockRenderer';
import type { MemoryBlock } from '@/data/models';

export default function BlocksPage() {
    const [blocks, setBlocks] = useState<BlocksResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadBlocks() {
            try {
                setIsLoading(true);
                const data = await fetchBlocks();
                setBlocks(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch blocks:', err);
                setError(err instanceof Error ? err.message : 'Failed to load blocks');
            } finally {
                setIsLoading(false);
            }
        }

        loadBlocks();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Memory Blocks</h1>

            {isLoading && (
                <div className="flex justify-center my-12">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}

            {blocks && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blocks.length === 0 ? (
                        <p className="col-span-full text-center text-muted-foreground">No memory blocks found.</p>
                    ) : (
                        blocks.map((block) => (
                            <MemoryBlockRenderer
                                key={block.id || `block-${Math.random()}`}
                                blockId={block.id || 'unknown'}
                                blockType={block.type}
                                blockVersion={String(block.block_version ?? block.schema_version ?? 'unknown')}
                                data={block as MemoryBlock}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
} 