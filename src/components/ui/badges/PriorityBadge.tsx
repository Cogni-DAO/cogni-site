import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PriorityLiteral } from '@/types/executableMeta';

// Get priority badge color based on value
export const getPriorityColor = (priority: string | null): string => {
    if (!priority) return 'bg-gray-100 text-gray-800';

    // Handle P0-P5 notation
    if (priority.match(/^P[0-5]$/i)) {
        const level = parseInt(priority.substring(1), 10);
        switch (level) {
            case 0: return 'bg-red-200 text-red-900'; // Highest priority
            case 1: return 'bg-orange-200 text-orange-900';
            case 2: return 'bg-amber-200 text-amber-900';
            case 3: return 'bg-yellow-200 text-yellow-900';
            case 4: return 'bg-blue-200 text-blue-900';
            case 5: return 'bg-slate-200 text-slate-900'; // Lowest priority
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    // Handle text-based priorities
    switch (priority.toLowerCase()) {
        case 'high': return 'bg-red-200 text-red-900';
        case 'medium': return 'bg-orange-200 text-orange-900';
        case 'low': return 'bg-blue-200 text-blue-900';
        default: return 'bg-gray-100 text-gray-800';
    }
};

interface PriorityBadgeProps {
    priority?: PriorityLiteral | string | null;
    className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    if (!priority) {
        return <span className="text-muted-foreground">—</span>;
    }

    return (
        <Badge className={cn("font-normal", getPriorityColor(priority), className)}>
            {priority}
        </Badge>
    );
} 