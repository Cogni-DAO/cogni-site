import useSWR from 'swr';
import { fetchBlockById, type MemoryBlock } from '@/utils/blocks';

/**
 * Hook for fetching a single MemoryBlock by ID
 * @param id - The ID of the block to fetch
 * @param branch - Optional branch name to fetch block from (defaults to 'main')
 */
export function useBlock(id: string | null, branch?: string) {
    const key = id ? ['block', id, branch] : null;
    const { data, error, isLoading, mutate } = useSWR(
        key,
        () => id ? fetchBlockById(id, branch) : null
    );

    return {
        block: data as MemoryBlock | undefined,
        isLoading,
        isError: error,
        mutate
    };
} 