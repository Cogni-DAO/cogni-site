import { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { WorkItemMeta } from '@/types/workItemMeta';
import { narrowMetadata } from '@/data/block_metadata';

/**
 * Determines if a block type is an WorkItem type
 */
export function isWorkItemType(type: MemoryBlockType): boolean {
    return [
        MemoryBlockType.task,
        MemoryBlockType.project,
        MemoryBlockType.epic,
        MemoryBlockType.bug
    ].includes(type);
}

/**
 * Extracts WorkItemMeta fields from any block metadata
 */
export function narrowWorkItemMeta(block: MemoryBlock): WorkItemMeta | null {
    if (!block.metadata || !isWorkItemType(block.type)) {
        return null;
    }

    // First narrow to the specific type
    const typedMetadata = narrowMetadata(block.type, block.metadata);

    // Then cast to WorkItemMeta (safe because all WorkItem types inherit from WorkItemMeta)
    return typedMetadata as unknown as WorkItemMeta;
}

/**
 * Gets the display title for an WorkItem block
 */
export function getWorkItemTitle(block: MemoryBlock): string {
    if (!block.metadata) {
        return block.text?.substring(0, 50) || 'Untitled';
    }

    switch (block.type) {
        case MemoryBlockType.task:
            return narrowMetadata(MemoryBlockType.task, block.metadata).title || 'Untitled Task';
        case MemoryBlockType.project:
            return narrowMetadata(MemoryBlockType.project, block.metadata).name || 'Untitled Project';
        case MemoryBlockType.epic:
            return narrowMetadata(MemoryBlockType.epic, block.metadata).name || 'Untitled Epic';
        case MemoryBlockType.bug:
            return narrowMetadata(MemoryBlockType.bug, block.metadata).title || 'Untitled Bug';
        default:
            return block.text?.substring(0, 50) || 'Untitled';
    }
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
            return narrowMetadata(MemoryBlockType.task, block.metadata).assignee || null;
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