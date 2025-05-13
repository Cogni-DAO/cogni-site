import useSWR from 'swr';
import { fetchBlockById, type MemoryBlock } from '@/utils/blocks';

/**
 * Hook for fetching a single MemoryBlock by ID
 * @param id - The ID of the block to fetch
 */
export function useBlock(id: string | null) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? ['block', id] : null,
        () => id ? fetchBlockById(id) : null
    );

    return {
        block: data as MemoryBlock | undefined,
        isLoading,
        isError: error,
        mutate
    };
} 