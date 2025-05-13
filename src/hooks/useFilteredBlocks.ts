import { useMemo, useState } from 'react';
import { useBlocks } from './useBlocks';
import { getBlockConfidencePercentage } from '@/utils/blockUtils';

// Define sort options
export type SortOption =
    | 'confidenceDesc'
    | 'confidenceAsc'
    | 'createdAtDesc'
    | 'createdAtAsc'
    | 'typeAsc'
    | 'typeDesc';

interface UseFilteredBlocksOptions {
    initialSearchQuery?: string;
    initialSortBy?: SortOption;
    initialBlockType?: string | null;
}

/**
 * Hook for fetching, filtering, and sorting memory blocks 
 */
export function useFilteredBlocks(options: UseFilteredBlocksOptions = {}) {
    // Get blocks from the API
    const { blocks, isLoading, isError, mutate } = useBlocks();

    // State for filters
    const [searchQuery, setSearchQuery] = useState(options.initialSearchQuery || '');
    const [sortBy, setSortBy] = useState<SortOption>(options.initialSortBy || 'confidenceDesc');
    const [blockType, setBlockType] = useState<string | null>(options.initialBlockType || null);

    // Apply filters and sort
    const filteredAndSortedBlocks = useMemo(() => {
        if (!blocks) return [];

        // First, filter blocks by search query
        const filtered = blocks.filter(block => {
            const lowerQuery = searchQuery.toLowerCase();

            // Skip filtering if search is empty
            if (!searchQuery) return true;

            // Filter by text content
            if (block.text?.toLowerCase().includes(lowerQuery)) return true;

            // Filter by metadata (depends on block type)
            if (block.metadata) {
                // For project blocks, also check name and description
                if (block.type === 'project' && typeof block.metadata.name === 'string') {
                    if (block.metadata.name.toLowerCase().includes(lowerQuery)) return true;
                }

                // For doc blocks, also check title
                if (block.type === 'doc' && typeof block.metadata.title === 'string') {
                    if (block.metadata.title.toLowerCase().includes(lowerQuery)) return true;
                }
            }

            return false;
        });

        // Then, filter by block type if specified
        const typeFiltered = blockType
            ? filtered.filter(block => block.type === blockType)
            : filtered;

        // Finally, sort the blocks
        return [...typeFiltered].sort((a, b) => {
            switch (sortBy) {
                case 'confidenceDesc':
                    return getBlockConfidencePercentage(b) - getBlockConfidencePercentage(a);
                case 'confidenceAsc':
                    return getBlockConfidencePercentage(a) - getBlockConfidencePercentage(b);
                case 'createdAtDesc':
                    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                case 'createdAtAsc':
                    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                case 'typeAsc':
                    return a.type.localeCompare(b.type);
                case 'typeDesc':
                    return b.type.localeCompare(a.type);
                default:
                    return 0;
            }
        });
    }, [blocks, searchQuery, sortBy, blockType]);

    return {
        blocks: filteredAndSortedBlocks,
        totalBlocks: blocks?.length || 0,
        filteredCount: filteredAndSortedBlocks.length,
        isLoading,
        isError,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        blockType,
        setBlockType,
        refresh: mutate
    };
} 