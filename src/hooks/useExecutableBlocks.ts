import { useBlocks } from './useBlocks';
import { isWorkItemType } from '@/utils/workItemUtils';
import type { MemoryBlock } from '@/data/models/memoryBlock';

/**
 * Hook for fetching only WorkItem block types (task, project, epic, bug)
 */
export function useWorkItemBlocks() {
    const { blocks, isLoading, isError, mutate } = useBlocks();

    // Filter blocks to only WorkItem types
    const WorkItemBlocks = blocks ? blocks.filter(block => isWorkItemType(block.type)) : [];

    return {
        blocks: WorkItemBlocks as MemoryBlock[],
        isLoading,
        isError,
        mutate
    };
} 