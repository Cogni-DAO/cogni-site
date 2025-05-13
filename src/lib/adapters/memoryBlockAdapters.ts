import type { MemoryBlock } from '@/data/models/memoryBlock';
import type { BlockLink } from '@/data/models/blockLink';
import type {
    KnowledgeRendererProps,
    ProjectRendererProps,
    TaskRendererProps,
    DocRendererProps,
    LogRendererProps
} from '@/lib/types';
import { narrowMetadata } from '@/data/block_metadata';
import type { KnowledgeMetadata } from '@/data/block_metadata/knowledge';
import type { ProjectMetadata } from '@/data/block_metadata/project';
import type { TaskMetadata } from '@/data/block_metadata/task';
import type { DocMetadata } from '@/data/block_metadata/doc';
import type { LogMetadata } from '@/data/block_metadata/log';
import { MemoryBlockType } from '@/data/models/memoryBlockType';

/**
 * Maximum length for title generated from text
 */
const MAX_TITLE_LENGTH = 50;

/**
 * Convert a BlockLink array to the format expected by renderers
 */
function transformLinks(links?: BlockLink[]): { title: string; slug: string }[] {
    if (!links || links.length === 0) {
        return [];
    }

    return links.map(link => ({
        title: `${link.relation}: ${link.to_id}`,
        slug: link.to_id
    }));
}

/**
 * Extract a title from a block's metadata or text
 */
function extractTitle(block: MemoryBlock): string {
    // Try to get title from metadata based on block type
    if (block.metadata) {
        switch (block.type) {
            case MemoryBlockType.knowledge:
                // Knowledge blocks may have domain or validity as potential title fields
                const knowledgeMeta = narrowMetadata(MemoryBlockType.knowledge, block.metadata);
                return knowledgeMeta.domain || knowledgeMeta.validity || '';

            case MemoryBlockType.project:
                const projectMeta = narrowMetadata(MemoryBlockType.project, block.metadata);
                return projectMeta.name || '';

            case MemoryBlockType.task:
                const taskMeta = narrowMetadata(MemoryBlockType.task, block.metadata);
                return taskMeta.name || '';

            case MemoryBlockType.doc:
                const docMeta = narrowMetadata(MemoryBlockType.doc, block.metadata);
                return docMeta.title || '';
        }
    }

    // Fallback to using truncated text
    return block.text?.substring(0, MAX_TITLE_LENGTH) || `Untitled ${block.type}`;
}

/**
 * Calculate verification percentage from confidence scores
 * @returns a percentage between 0-100
 */
function calculateVerificationPercentage(block: MemoryBlock): number {
    // Try to get from knowledge metadata
    if (block.metadata && block.type === MemoryBlockType.knowledge) {
        const knowledgeMeta = narrowMetadata(MemoryBlockType.knowledge, block.metadata);
        if (knowledgeMeta.confidence_level !== null && knowledgeMeta.confidence_level !== undefined) {
            // Convert from 0-1 to 0-100 scale if needed
            return knowledgeMeta.confidence_level <= 1
                ? Math.round(knowledgeMeta.confidence_level * 100)
                : Math.round(knowledgeMeta.confidence_level);
        }
    }

    // Try to get from confidence field
    if (block.confidence?.human !== null && block.confidence?.human !== undefined) {
        // Convert from 0-1 to 0-100 scale
        return Math.round((block.confidence.human || 0) * 100);
    }

    // Default value
    return 50;
}

/**
 * Adapt a MemoryBlock to KnowledgeRendererProps
 */
export function adaptMemoryBlockToKnowledgeProps(block: MemoryBlock): KnowledgeRendererProps {
    return {
        id: block.id || 'unknown',
        title: extractTitle(block),
        content: block.text,
        links: transformLinks(block.links),
        verificationPercentage: calculateVerificationPercentage(block)
    };
}

/**
 * Adapt a MemoryBlock to ProjectRendererProps
 */
export function adaptMemoryBlockToProjectProps(block: MemoryBlock): ProjectRendererProps {
    let status: string | undefined;
    let completed: boolean | undefined;

    if (block.metadata && block.type === MemoryBlockType.project) {
        const projectMeta = narrowMetadata(MemoryBlockType.project, block.metadata);
        status = projectMeta.status;
        completed = projectMeta.completed;
    }

    return {
        id: block.id || 'unknown',
        title: extractTitle(block),
        content: block.text,
        links: transformLinks(block.links),
        status,
        completed
    };
}

/**
 * Adapt a MemoryBlock to TaskRendererProps
 */
export function adaptMemoryBlockToTaskProps(block: MemoryBlock): TaskRendererProps {
    let status: string | undefined;
    let projectName: string | undefined;
    let priority: string | undefined;
    let assignee: string | undefined;

    if (block.metadata && block.type === MemoryBlockType.task) {
        const taskMeta = narrowMetadata(MemoryBlockType.task, block.metadata);
        status = taskMeta.status;
        projectName = taskMeta.project;
        priority = taskMeta.priority ? String(taskMeta.priority) : undefined;
        assignee = taskMeta.assignee || undefined;
    }

    return {
        id: block.id || 'unknown',
        title: extractTitle(block),
        content: block.text,
        links: transformLinks(block.links),
        status,
        projectName,
        priority,
        assignee
    };
}

/**
 * Adapt a MemoryBlock to DocRendererProps
 */
export function adaptMemoryBlockToDocProps(block: MemoryBlock): DocRendererProps {
    let version: string | undefined;
    let lastReviewed: string | undefined;

    if (block.metadata && block.type === MemoryBlockType.doc) {
        const docMeta = narrowMetadata(MemoryBlockType.doc, block.metadata);
        version = docMeta.version || undefined;
        lastReviewed = docMeta.last_reviewed || undefined;
    }

    return {
        id: block.id || 'unknown',
        title: extractTitle(block),
        content: block.text,
        links: transformLinks(block.links),
        version,
        lastReviewed
    };
}

/**
 * Adapt a MemoryBlock to LogRendererProps
 */
export function adaptMemoryBlockToLogProps(block: MemoryBlock): LogRendererProps {
    let timestamp: string | undefined;
    let model: string | undefined;

    if (block.metadata && block.type === MemoryBlockType.log) {
        const logMeta = narrowMetadata(MemoryBlockType.log, block.metadata);
        timestamp = logMeta.x_timestamp;
        model = logMeta.model || undefined;
    } else {
        // Fallback to block created_at
        timestamp = block.created_at;
    }

    return {
        id: block.id || 'unknown',
        title: extractTitle(block),
        content: block.text,
        links: transformLinks(block.links),
        timestamp,
        model
    };
} 