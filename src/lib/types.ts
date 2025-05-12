import type { MemoryBlock } from '@/api/models';

/**
 * Props accepted by the main BlockRenderer component and individual block renderers.
 */
export interface BlockRendererProps {
    blockId: string;
    blockType: string;
    blockVersion: string; // Keep for now, even if unused in switch
    data: MemoryBlock; // Use the generated Orval type
    // Add other common props if needed (e.g., isSelected, callbacks)
} 