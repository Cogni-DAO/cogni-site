import type { MemoryBlock } from '@/data/models/memoryBlock';

/**
 * Calculates the confidence percentage for a memory block
 * @param block - The memory block to calculate confidence for
 * @returns The confidence percentage (0-100)
 */
export function getBlockConfidencePercentage(block: MemoryBlock): number {
    // Use only the standard confidence.human field as source of truth
    if (block.confidence?.human !== null && block.confidence?.human !== undefined) {
        // Scale from 0-1 to 0-100 if needed
        return block.confidence.human <= 1
            ? Math.round(block.confidence.human * 100)
            : Math.round(block.confidence.human);
    }

    // If no confidence data is found
    return 0;
} 