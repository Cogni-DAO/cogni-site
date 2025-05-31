import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExecutorStatus } from '@/types/workItemMeta';

// Status badge colors with improved contrast
const statusColors: Record<string, string> = {
    backlog: 'bg-slate-300 text-slate-900',
    ready: 'bg-blue-200 text-blue-900',
    in_progress: 'bg-yellow-200 text-yellow-900',
    review: 'bg-purple-200 text-purple-900',
    merged: 'bg-indigo-200 text-indigo-900',
    validated: 'bg-teal-200 text-teal-900',
    released: 'bg-green-200 text-green-900',
    done: 'bg-green-200 text-green-900',
    archived: 'bg-gray-300 text-gray-900',
    blocked: 'bg-red-200 text-red-900',
};

interface StatusBadgeProps {
    status?: ExecutorStatus | string | null;
    completed?: boolean;
    className?: string;
}

export function StatusBadge({ status, completed, className }: StatusBadgeProps) {
    // Handle empty status
    if (!status) {
        if (completed) {
            return <Badge className={cn("bg-green-200 text-green-900", className)}>Completed</Badge>;
        }
        return <Badge className={cn("bg-gray-200 text-gray-900", className)}>No Status</Badge>;
    }

    // Format status text (convert snake_case to Title Case)
    const formattedStatus = status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Get appropriate color class
    const colorClass = statusColors[status] || 'bg-gray-300 text-gray-900';

    return (
        <Badge className={cn(colorClass, className)}>
            {formattedStatus}
        </Badge>
    );
} 