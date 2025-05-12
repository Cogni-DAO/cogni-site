'use client';

import { useState, useEffect } from 'react';
import { fetchBlocks, type BlocksResponse } from '@/utils/blocks';

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
                            <div key={block.id} className="content-block animate-fade-in border rounded-lg p-4 shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-serif font-semibold">{block.id || 'Untitled'}</h3>
                                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                        {block.type}
                                    </span>
                                </div>

                                <div className="prose prose-sm max-w-none">
                                    <div>{block.text}</div>
                                </div>

                                {block.tags && block.tags.length > 0 && (
                                    <div className="mt-3">
                                        <span className="text-sm font-medium">Tags:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {block.tags.map((tag, index) => (
                                                <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-knowledge hover:text-white transition-colors duration-200">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {block.created_at && (
                                    <div className="mt-4 text-sm text-muted-foreground">
                                        {new Date(block.created_at).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
} 