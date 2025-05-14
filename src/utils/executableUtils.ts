import { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { ExecutableMeta } from '@/types/executableMeta';
import { narrowMetadata } from '@/data/block_metadata';

/**
 * Determines if a block type is an executable type
 */
export function isExecutableType(type: MemoryBlockType): boolean {
    return [
        MemoryBlockType.task,
        MemoryBlockType.project,
        MemoryBlockType.epic,
        MemoryBlockType.bug
    ].includes(type);
}

/**
 * Extracts ExecutableMeta fields from any block metadata
 */
export function narrowExecutableMeta(block: MemoryBlock): ExecutableMeta | null {
    if (!block.metadata || !isExecutableType(block.type)) {
        return null;
    }

    // First narrow to the specific type
    const typedMetadata = narrowMetadata(block.type, block.metadata);

    // Then cast to ExecutableMeta (safe because all executable types inherit from ExecutableMeta)
    return typedMetadata as unknown as ExecutableMeta;
}

/**
 * Gets the display title for an executable block
 */
export function getExecutableTitle(block: MemoryBlock): string {
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
 * Gets the owner/assignee for an executable block
 */
export function getExecutableOwner(block: MemoryBlock): string | null {
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
 * Gets the description for an executable block
 */
export function getExecutableDescription(block: MemoryBlock): string {
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