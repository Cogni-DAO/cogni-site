import { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { WorkItemMeta } from '@/types/workItemMeta';
import { narrowMetadata } from '@/data/block_metadata';

/**
 * Determines if a block type is an WorkItem type
 */
export function isWorkItemType(type: MemoryBlockType): boolean {
    const workItemTypes: MemoryBlockType[] = [
        MemoryBlockType.task,
        MemoryBlockType.project,
        MemoryBlockType.epic,
        MemoryBlockType.bug
    ];
    return workItemTypes.includes(type);
}

/**
 * Extracts WorkItemMeta fields from any block metadata
 */
export function narrowWorkItemMeta(block: MemoryBlock): WorkItemMeta | null {
    if (!block.metadata || !isWorkItemType(block.type)) {
        return null;
    }

    // Type guard to ensure block.type is a valid key for BlockMetadataByType
    if (block.type !== MemoryBlockType.task &&
        block.type !== MemoryBlockType.project &&
        block.type !== MemoryBlockType.epic &&
        block.type !== MemoryBlockType.bug) {
        return null;
    }

    // First narrow to the specific type
    const typedMetadata = narrowMetadata(block.type, block.metadata);

    // Then cast to WorkItemMeta (safe because all WorkItem types inherit from WorkItemMeta)
    return typedMetadata as unknown as WorkItemMeta;
}

/**
 * Gets the display title for an WorkItem block.
 * Assumes `block.metadata.title` is the standardized and reliable source.
 */
export function getWorkItemTitle(block: MemoryBlock): string {
    // Prefer the standardized metadata.title
    if (block.metadata && typeof (block.metadata.title) === 'string' && (block.metadata.title as string).trim() !== '') {
        return (block.metadata.title as string);
    }
    // If metadata.title is missing, empty, or not a string, provide a generic fallback.
    // This case should ideally not happen if backend ensures title is always populated.
    return `Untitled ${block.type || 'Work Item'}`;
}

/**
 * Gets the owner/assignee for an WorkItem block
 */
export function getWorkItemOwner(block: MemoryBlock): string | null {
    if (!block.metadata) {
        return null;
    }

    switch (block.type) {
        case MemoryBlockType.task:
            return narrowMetadata(MemoryBlockType.task, block.metadata).owner || null;
        case MemoryBlockType.project:
        case MemoryBlockType.epic:
            return narrowMetadata(block.type, block.metadata).owner || null;
        case MemoryBlockType.bug:
            return narrowMetadata(MemoryBlockType.bug, block.metadata).assignee || null;
        default:
            return null;
    }
}

/**
 * Gets the description for an WorkItem block
 */
export function getWorkItemDescription(block: MemoryBlock): string {
    if (!block.metadata) {
        return block.text?.substring(0, 100) || 'No description available';
    }

    switch (block.type) {
        case MemoryBlockType.task:
        case MemoryBlockType.bug:
            return narrowMetadata(block.type, block.metadata).description || 'No description available';
        case MemoryBlockType.project:
        case MemoryBlockType.epic:
            return narrowMetadata(block.type, block.metadata).description || 'No description available';
        default:
            return block.text?.substring(0, 100) || 'No description available';
    }
} 