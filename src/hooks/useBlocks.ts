import useSWR from 'swr';
import { fetchBlocks, fetchBlocksByIds, type BlocksResponse, type MemoryBlock } from '@/utils/blocks';

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

/**
 * Hook for fetching multiple MemoryBlocks by their IDs
 * @param ids - Array of block IDs to fetch
 */
export function useBlocksByIds(ids: string[]) {
    // Create a stable key that only changes when the actual IDs change
    const key = ids.length > 0 ? ['blocks-by-ids', [...ids].sort().join(',')] : null;

    const { data, error, isLoading, mutate } = useSWR(
        key,
        () => fetchBlocksByIds(ids)
    );

    return {
        blocksMap: data as Map<string, MemoryBlock> | undefined,
        isLoading,
        isError: error,
        mutate
    };
} 