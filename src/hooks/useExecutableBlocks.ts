import { useBlocks } from './useBlocks';
import { isExecutableType } from '@/utils/executableUtils';
import type { MemoryBlock } from '@/data/models/memoryBlock';

/**
 * Hook for fetching only executable block types (task, project, epic, bug)
 */
export function useExecutableBlocks() {
    const { blocks, isLoading, isError, mutate } = useBlocks();

    // Filter blocks to only executable types
    const executableBlocks = blocks ? blocks.filter(block => isExecutableType(block.type)) : [];

    return {
        blocks: executableBlocks as MemoryBlock[],
        isLoading,
        isError,
        mutate
    };
} 