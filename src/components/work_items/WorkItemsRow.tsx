'use client';

import React from 'react';
import Link from 'next/link';
import {
    Calendar,
    Check,
    Clock,
    ExternalLink,
    MoreHorizontal,
    User,
    Sidebar
} from 'lucide-react';
import {
    TableCell,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MemoryBlock } from '@/data/models/memoryBlock';
import { formatBlockType } from './columns';
import { narrowWorkItemMeta } from '@/utils/workItemUtils';
import { getWorkItemDescription, getWorkItemOwner, getWorkItemTitle } from '@/utils/workItemUtils';
import { StatusBadge } from '../ui/badges/StatusBadge';
import { PriorityBadge } from '../ui/badges/PriorityBadge';

interface WorkItemsRowProps {
    block: MemoryBlock;
    onOpenInSidePanel?: (blockId: string) => void;
}

export function WorkItemsRow({ block, onOpenInSidePanel }: WorkItemsRowProps) {
    const meta = narrowWorkItemMeta(block);

    if (!meta) {
        console.warn(`Block ${block.id} is missing metadata or is not WorkItem`);
        return (
            <TableRow key={block.id}>
                <TableCell colSpan={8} className="text-amber-600">
                    <div className="flex flex-col">
                        <span className="font-medium">{block.id} (Missing metadata)</span>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                            {block.text?.substring(0, 100) || 'No description available'}
                        </p>
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    // Extract content from appropriate metadata fields based on block type
    const title = getWorkItemTitle(block);
    const description = getWorkItemDescription(block);
    const owner = getWorkItemOwner(block);

    // Format dates
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '—';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
            return '—';
        }
    };

    // Get dates based on block type
    const getStartDate = () => {
        switch (block.type) {
            case 'task':
                return meta.start_date;
            case 'project':
            case 'epic':
                return meta.start_date;
            default:
                return null;
        }
    };

    const getEndDate = () => {
        switch (block.type) {
            case 'task':
                return meta.due_date;
            case 'project':
            case 'epic':
                return meta.target_date;
            case 'bug':
                return meta.due_date;
            default:
                return null;
        }
    };

    // Handle opening in side panel
    const handleOpenInSidePanel = () => {
        if (onOpenInSidePanel) {
            onOpenInSidePanel(block.id);
        }
    };

    return (
        <TableRow key={block.id}>
            <TableCell>
                <div className="flex flex-col">
                    {onOpenInSidePanel ? (
                        <button
                            onClick={handleOpenInSidePanel}
                            className="text-left font-medium text-blue-600 hover:underline cursor-pointer"
                        >
                            {title || 'Untitled'}
                        </button>
                    ) : (
                        <Link
                            href={`/blocks/${block.id}`}
                            className="font-medium text-blue-600 hover:underline"
                        >
                            {title || 'Untitled'}
                        </Link>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {description?.substring(0, 100) || 'No description available'}
                    </p>
                </div>
            </TableCell>

            <TableCell>
                <Badge className="bg-muted text-foreground">
                    {formatBlockType(block.type)}
                </Badge>
            </TableCell>

            <TableCell>
                <PriorityBadge priority={meta.priority} />
            </TableCell>

            <TableCell>
                <StatusBadge status={meta.status} completed={meta.completed} />
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{owner || '—'}</span>
                </div>
            </TableCell>

            <TableCell>
                {meta.progress_percent !== undefined && meta.progress_percent !== null ? (
                    <div className="flex items-center gap-2 w-24">
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${meta.progress_percent || 0}%` }}
                            />
                        </div>
                        <span className="text-xs">{meta.progress_percent || 0}%</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </TableCell>

            <TableCell>
                <div className="flex flex-col text-sm">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(getStartDate())}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(getEndDate())}</span>
                    </div>
                </div>
            </TableCell>

            <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                    {onOpenInSidePanel ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleOpenInSidePanel}
                        >
                            <Sidebar className="h-4 w-4 mr-1" />
                            Details
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            asChild
                        >
                            <Link href={`/blocks/${block.id}`}>
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                            </Link>
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Check className="h-4 w-4 mr-2" /> Mark as completed
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
} 