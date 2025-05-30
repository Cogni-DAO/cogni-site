'use client';

import React, { useState } from 'react';
import { useWorkItemBlocks } from '@/hooks';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { narrowWorkItemMeta } from '@/utils/workItemUtils';
import { isWorkItemType } from '@/utils/workItemUtils';
import { WorkItemsFilter } from './WorkItemsFilter';
import { WorkItemsTable } from './WorkItemsTable';
import { WorkItemSidePanel } from './WorkItemSidePanel';

// Sort options
type SortOption = 'none' | 'priority_high' | 'priority_low';

export default function WorkItemsView() {
    // Fetch all WorkItem blocks
    const { blocks, isLoading, isError } = useWorkItemBlocks();
    const [selectedWorkItemId, setSelectedWorkItemId] = useState<string | null>(null);

    // Debug: Log blocks data when it changes
    React.useEffect(() => {
        console.log('WorkItemsView received blocks:', blocks);
    }, [blocks]);

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
    const [typeFilters, setTypeFilters] = useState<MemoryBlockType[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('none');

    // Handle side panel open/close
    const handleOpenInSidePanel = (blockId: string) => {
        setSelectedWorkItemId(blockId);
    };

    const handleCloseSidePanel = () => {
        setSelectedWorkItemId(null);
    };

    // Handle type filter changes
    const handleTypeFilterChange = (type: MemoryBlockType, isActive: boolean) => {
        if (isActive) {
            setTypeFilters(prev => [...prev, type]);
        } else {
            setTypeFilters(prev => prev.filter(t => t !== type));
        }
    };

    // Filter blocks
    const filteredBlocks = React.useMemo(() => {
        if (!blocks) return [];

        // Filter to specified WorkItem types or all WorkItem types if none selected
        const typeFilteredBlocks = blocks.filter(block => {
            if (typeFilters.length === 0) {
                return isWorkItemType(block.type);
            }
            return typeFilters.includes(block.type);
        });

        return typeFilteredBlocks.filter(block => {
            const execMeta = narrowWorkItemMeta(block);
            if (!execMeta) {
                return false;
            }

            // Get owner based on block type
            let owner = null;
            switch (block.type) {
                case MemoryBlockType.task:
                    owner = narrowWorkItemMeta(block)?.reviewer || null;
                    break;
                case MemoryBlockType.project:
                case MemoryBlockType.epic:
                    const typedMeta = narrowWorkItemMeta(block);
                    owner = typedMeta?.reviewer || null;
                    break;
                case MemoryBlockType.bug:
                    owner = narrowWorkItemMeta(block)?.reviewer || null;
                    break;
            }

            // Apply search query filter
            if (searchQuery) {
                const lowerSearch = searchQuery.toLowerCase();
                let title = '';
                let description = '';

                switch (block.type) {
                    case MemoryBlockType.task:
                        title = (block.metadata?.title as string) || '';
                        description = (block.metadata?.description as string) || '';
                        break;
                    case MemoryBlockType.project:
                    case MemoryBlockType.epic:
                        title = (block.metadata?.title as string) || '';
                        description = (block.metadata?.description as string) || '';
                        break;
                    case MemoryBlockType.bug:
                        title = (block.metadata?.title as string) || '';
                        description = (block.metadata?.description as string) || '';
                        break;
                    default:
                        title = block.text || '';
                }

                const titleMatch = title.toLowerCase().includes(lowerSearch);
                const descMatch = description.toLowerCase().includes(lowerSearch);

                if (!titleMatch && !descMatch) {
                    return false;
                }
            }

            // Apply status filter
            if (statusFilter && execMeta.status !== statusFilter) {
                return false;
            }

            // Apply owner filter
            if (ownerFilter && owner !== ownerFilter) {
                return false;
            }

            return true;
        });
    }, [blocks, searchQuery, statusFilter, ownerFilter, typeFilters]);

    // Apply sorting
    const sortedBlocks = React.useMemo(() => {
        if (sortBy === 'none') return filteredBlocks;

        return [...filteredBlocks].sort((a, b) => {
            const metaA = narrowWorkItemMeta(a);
            const metaB = narrowWorkItemMeta(b);

            if (!metaA || !metaB) return 0;

            // Convert priority to numeric value for sorting
            const getPriorityValue = (priority?: string | null) => {
                if (!priority) return 0;

                // Handle P0-P5 format
                if (priority.match(/^P[0-5]$/i)) {
                    const level = parseInt(priority.substring(1), 10);
                    return 5 - level; // P0 is highest, P5 is lowest
                }

                // Handle text format
                if (priority === 'high') return 3;
                if (priority === 'medium') return 2;
                if (priority === 'low') return 1;
                return 0;
            };

            const priorityA = getPriorityValue(metaA.priority);
            const priorityB = getPriorityValue(metaB.priority);

            return sortBy === 'priority_high'
                ? priorityB - priorityA // High to low
                : priorityA - priorityB; // Low to high
        });
    }, [filteredBlocks, sortBy]);

    // Get unique owners for filter dropdown
    const uniqueOwners = React.useMemo(() => {
        if (!blocks) return [];

        const owners = new Set<string>();
        blocks.forEach(block => {
            const execMeta = narrowWorkItemMeta(block);
            if (execMeta?.reviewer) owners.add(execMeta.reviewer);
        });

        return Array.from(owners);
    }, [blocks]);

    // Get unique statuses for filter dropdown
    const uniqueStatuses = React.useMemo(() => {
        if (!blocks) return [];

        const statuses = new Set<string>();
        blocks.forEach(block => {
            const execMeta = narrowWorkItemMeta(block);
            if (execMeta?.status) statuses.add(execMeta.status);
        });

        return Array.from(statuses);
    }, [blocks]);

    return (
        <div className="space-y-4">
            <WorkItemsFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                ownerFilter={ownerFilter}
                onOwnerChange={setOwnerFilter}
                typeFilters={typeFilters}
                onTypeFilterChange={handleTypeFilterChange}
                statuses={uniqueStatuses}
                owners={uniqueOwners}
                sortBy={sortBy}
                onSortChange={(value) => setSortBy(value as SortOption)}
            />

            {isLoading ? (
                <div className="flex justify-center my-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : isError ? (
                <div className="bg-destructive/10 p-4 rounded-md text-destructive text-center my-8">
                    Error loading work items. Please try again later.
                </div>
            ) : filteredBlocks?.length === 0 ? (
                <div className="text-center p-8 bg-muted rounded-md my-8">
                    <h3 className="text-lg font-medium">No work items found</h3>
                    <p className="text-muted-foreground mt-1">
                        {searchQuery || statusFilter || ownerFilter || typeFilters.length > 0
                            ? "Try adjusting your filters"
                            : "Create a work item to get started"}
                    </p>
                </div>
            ) : (
                <WorkItemsTable
                    blocks={sortedBlocks}
                    onOpenInSidePanel={handleOpenInSidePanel}
                />
            )}

            {/* Side panel for displaying work item details */}
            <WorkItemSidePanel
                blockId={selectedWorkItemId}
                onClose={handleCloseSidePanel}
            />
        </div>
    );
} 