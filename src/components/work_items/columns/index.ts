import { formatDistanceToNow } from 'date-fns';
import { MemoryBlock } from '@/data/models/memoryBlock';
import { getWorkItemDescription, getWorkItemOwner, getWorkItemTitle } from '@/utils/workItemUtils';

/**
 * Format date for display with both absolute and relative time
 */
export function formatDate(dateString?: string | null): string {
    if (!dateString) return '—';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '—';
        }

        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        // Add relative time
        const relativeTime = formatDistanceToNow(date, { addSuffix: true });

        return `${formattedDate} (${relativeTime})`;
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return '—';
    }
}

/**
 * Get formatted title for any WorkItem block
 */
export function renderTitle(block: MemoryBlock): string {
    return getWorkItemTitle(block);
}

/**
 * Get formatted description for any WorkItem block
 */
export function renderDescription(block: MemoryBlock): string {
    return getWorkItemDescription(block);
}

/**
 * Get owner/assignee for any WorkItem block
 */
export function renderOwner(block: MemoryBlock): string | null {
    return getWorkItemOwner(block);
}

/**
 * Format a block type for display (e.g., "task" -> "Task")
 */
export function formatBlockType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
} 