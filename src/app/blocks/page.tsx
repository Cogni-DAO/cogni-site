'use client';

import { useBlocks } from '@/hooks/useBlocks';
import MemoryBlockListItem from '@/components/MemoryBlockListItem';

export default function BlocksPage() {
    const { blocks, isLoading, isError } = useBlocks();

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Memory Blocks</h1>

            {isLoading && (
                <div className="flex justify-center my-12">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            )}

            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p><strong>Error:</strong> {isError.message || 'Failed to load blocks'}</p>
                </div>
            )}

            {blocks && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blocks.length === 0 ? (
                        <p className="col-span-full text-center text-muted-foreground">No memory blocks found.</p>
                    ) : (
                        blocks.map((block) => (
                            <MemoryBlockListItem
                                key={block.id || `block-${Math.random()}`}
                                block={block}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
} 