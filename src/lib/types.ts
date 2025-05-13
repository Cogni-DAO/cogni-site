import type { MemoryBlock } from '@/data/models/memoryBlock';
import type { KnowledgeMetadata } from '@/data/block_metadata/knowledge';
import type { ProjectMetadata } from '@/data/block_metadata/project';
import type { TaskMetadata } from '@/data/block_metadata/task';
import type { DocMetadata } from '@/data/block_metadata/doc';
import type { LogMetadata } from '@/data/block_metadata/log';

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

/**
 * Props specific to the KnowledgeRenderer component
 */
export interface KnowledgeRendererProps {
    id: string;
    title: string;
    content: string;
    links: { title: string; slug: string }[];
    verificationPercentage: number;
}

/**
 * Props specific to the ProjectRenderer component
 */
export interface ProjectRendererProps {
    id: string;
    title: string;
    content: string;
    links: { title: string; slug: string }[];
    status?: string;
    completed?: boolean;
}

/**
 * Props specific to the TaskRenderer component
 */
export interface TaskRendererProps {
    id: string;
    title: string;
    content: string;
    links: { title: string; slug: string }[];
    status?: string;
    projectName?: string;
    priority?: string;
    assignee?: string;
}

/**
 * Props specific to the DocRenderer component
 */
export interface DocRendererProps {
    id: string;
    title: string;
    content: string;
    links: { title: string; slug: string }[];
    version?: string;
    lastReviewed?: string;
}

/**
 * Props specific to the LogRenderer component
 */
export interface LogRendererProps {
    id: string;
    title: string;
    content: string;
    links: { title: string; slug: string }[];
    timestamp?: string;
    model?: string;
} 