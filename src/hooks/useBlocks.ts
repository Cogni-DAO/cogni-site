import useSWR from 'swr';
import { fetchBlocks, fetchBlocksByIds, type BlocksResponse, type MemoryBlock } from '@/utils/blocks';

/**
 * Hook for fetching a list of MemoryBlocks
 * @param branch - Optional branch name to fetch blocks from (defaults to 'main')
 */
export function useBlocks(branch?: string) {
    const key = branch ? ['blocks', branch] : 'blocks';
    const { data, error, isLoading, mutate } = useSWR(key, () => fetchBlocks(branch));

    return {
        blocks: data as BlocksResponse | undefined,
        isLoading,
        isError: error,
        mutate
    };
}

/**
 * Hook for fetching multiple MemoryBlocks by their IDs
 * @param ids - Array of block IDs to fetch
 * @param branch - Optional branch name to fetch blocks from (defaults to 'main')
 */
export function useBlocksByIds(ids: string[], branch?: string) {
    // Create a stable key that only changes when the actual IDs or branch change
    const key = ids.length > 0 ? ['blocks-by-ids', [...ids].sort().join(','), branch] : null;

    const { data, error, isLoading, mutate } = useSWR(
        key,
        () => fetchBlocksByIds(ids, branch)
    );

    return {
        blocksMap: data as Map<string, MemoryBlock> | undefined,
        isLoading,
        isError: error,
        mutate
    };
} 