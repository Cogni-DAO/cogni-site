'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useBlock } from '@/hooks/useBlock';
import { getWorkItemTitle, narrowWorkItemMeta } from '@/utils/workItemUtils';
import type { MemoryBlock } from '@/utils/blocks';

interface LinkedWorkItemProps {
    blockId: string;
    /** Additional CSS classes */
    className?: string;
}

// Simple status utilities
function getStatusColor(status: string): string {
    switch (status) {
        case 'not_started': return 'text-gray-600';
        case 'in_progress': return 'text-blue-600';
        case 'done': return 'text-green-600';
        case 'blocked': return 'text-red-600';
        case 'cancelled': return 'text-gray-400';
        default: return 'text-gray-500';
    }
}

function getStatusDisplay(status: string): string {
    switch (status) {
        case 'not_started': return 'Not Started';
        case 'in_progress': return 'In Progress';
        case 'done': return 'Done';
        case 'blocked': return 'Blocked';
        case 'cancelled': return 'Cancelled';
        default: return 'Draft';
    }
}

export function LinkedWorkItem({ blockId, className = '' }: LinkedWorkItemProps) {
    const { block, isLoading, isError } = useBlock(blockId);

    if (isLoading) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="animate-pulse bg-muted rounded h-4 w-32"></div>
                <div className="animate-pulse bg-muted rounded h-3 w-16"></div>
            </div>
        );
    }

    if (isError || !block) {
        return (
            <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
                <span className="font-mono text-xs">
                    {blockId.slice(0, 8)}...
                </span>
                <span className="text-xs">(not found)</span>
            </div>
        );
    }

    const workItemMeta = narrowWorkItemMeta(block);
    const status = workItemMeta?.status || 'draft';
    const statusColor = getStatusColor(status);
    const statusDisplay = getStatusDisplay(status);
    const title = getWorkItemTitle(block);

    return (
        <Link
            href={`/blocks/${blockId}`}
            className={`flex items-center gap-2 hover:underline ${className}`}
        >
            <span className="text-sm font-medium text-foreground truncate">
                {title}
            </span>
            <Badge
                variant="outline"
                className={`text-xs ${statusColor} border-current`}
            >
                {statusDisplay}
            </Badge>
        </Link>
    );
}

/**
 * Optimized version that accepts block data directly to avoid individual API calls
 */
interface LinkedWorkItemOptimizedProps {
    block: MemoryBlock;
    /** Additional CSS classes */
    className?: string;
}

export function LinkedWorkItemOptimized({ block, className = '' }: LinkedWorkItemOptimizedProps) {
    const workItemMeta = narrowWorkItemMeta(block);
    const status = workItemMeta?.status || 'draft';
    const statusColor = getStatusColor(status);
    const statusDisplay = getStatusDisplay(status);
    const title = getWorkItemTitle(block);

    return (
        <Link
            href={`/blocks/${block.id}`}
            className={`flex items-center gap-2 hover:underline ${className}`}
        >
            <span className="text-sm font-medium text-foreground truncate">
                {title}
            </span>
            <Badge
                variant="outline"
                className={`text-xs ${statusColor} border-current`}
            >
                {statusDisplay}
            </Badge>
        </Link>
    );
} 