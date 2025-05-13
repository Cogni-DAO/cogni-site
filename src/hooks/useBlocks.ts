import useSWR from 'swr';
import { fetchBlocks, type BlocksResponse } from '@/utils/blocks';

/**
 * Hook for fetching a list of MemoryBlocks
 */
export function useBlocks() {
    const { data, error, isLoading, mutate } = useSWR('blocks', fetchBlocks);

    return {
        blocks: data as BlocksResponse | undefined,
        isLoading,
        isError: error,
        mutate
    };
} 