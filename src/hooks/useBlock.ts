import useSWR from 'swr';
import { fetchBlockById, type MemoryBlock } from '@/utils/blocks';

/**
 * Hook for fetching a single MemoryBlock by ID
 * @param id - The ID of the block to fetch
 * @param branch - Optional branch name to fetch block from (defaults to 'main')
 * @param namespace - Optional namespace to filter blocks (defaults to 'legacy')
 */
export function useBlock(id: string | null, branch?: string, namespace?: string) {
    const key = id ? ['block', id, branch, namespace] : null;
    const { data, error, isLoading, mutate } = useSWR(
        key,
        () => id ? fetchBlockById(id, branch, namespace) : null
    );

    return {
        block: data as MemoryBlock | undefined,
        isLoading,
        isError: error,
        mutate
    };
} 