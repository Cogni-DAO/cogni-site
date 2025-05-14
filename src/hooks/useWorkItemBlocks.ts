import { useBlocks } from './useBlocks';
import { isWorkItemType } from '@/utils/workItemUtils';
import type { MemoryBlock } from '@/data/models/memoryBlock';

/**
 * Hook for fetching only work item block types (task, project, epic, bug)
 */
export function useWorkItemBlocks() {
    const { blocks, isLoading, isError, mutate } = useBlocks();

    // Filter blocks to only work item types
    const workItemBlocks = blocks ? blocks.filter(block => isWorkItemType(block.type)) : [];

    return {
        blocks: workItemBlocks as MemoryBlock[],
        isLoading,
        isError,
        mutate
    };
} 