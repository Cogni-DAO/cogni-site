'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useBlock } from '@/hooks/useBlock';
import { BlockRenderer } from '@/components/BlockRenderer';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function BlockDetailPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const searchParams = useSearchParams();
    const branch = searchParams.get('branch') || undefined;
    const { block, isLoading, isError } = useBlock(id, branch);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={() => router.back()}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
            </Button>

            {isLoading && (
                <div className="flex justify-center my-12">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            )}

            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p><strong>Error:</strong> {isError.message || 'Failed to load block'}</p>
                </div>
            )}

            {block && (
                <BlockRenderer
                    blockId={block.id || id}
                    blockType={block.type}
                    blockVersion={block.block_version?.toString() || block.schema_version?.toString() || '1.0'}
                    data={block}
                />
            )}
        </div>
    );
} 