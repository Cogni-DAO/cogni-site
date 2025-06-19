import useSWR from 'swr';
import { fetchBlocks, fetchBlocksByIds, type BlocksResponse, type MemoryBlock } from '@/utils/blocks';

/**
 * Hook for fetching a list of MemoryBlocks
 * @param branch - Optional branch name to fetch blocks from (defaults to 'main')
 * @param namespace - Optional namespace to filter blocks (defaults to 'legacy')
 */
export function useBlocks(branch?: string, namespace?: string) {
    const key = [
        'blocks',
        ...(branch ? [branch] : []),
        ...(namespace ? [namespace] : [])
    ];
    const { data, error, isLoading, mutate } = useSWR(key, () => fetchBlocks(branch, namespace));

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
 * @param namespace - Optional namespace to filter blocks (defaults to 'legacy')
 */
export function useBlocksByIds(ids: string[], branch?: string, namespace?: string) {
    // Create a stable key that only changes when the actual IDs, branch, or namespace change
    const key = ids.length > 0 ? ['blocks-by-ids', [...ids].sort().join(','), branch, namespace] : null;

    const { data, error, isLoading, mutate } = useSWR(
        key,
        () => fetchBlocksByIds(ids, branch, namespace)
    );

    return {
        blocksMap: data as Map<string, MemoryBlock> | undefined,
        isLoading,
        isError: error,
        mutate
    };
} 