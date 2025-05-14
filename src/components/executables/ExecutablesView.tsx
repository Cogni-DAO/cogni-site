'use client';

import React, { useState, useEffect } from 'react';
import { ExecutablesTable } from './ExecutablesTable';
import { ExecutablesFilter } from './ExecutablesFilter';
import { useExecutableBlocks } from '@/hooks/useExecutableBlocks';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { narrowExecutableMeta } from '@/utils/executableUtils';
import { isExecutableType } from '@/utils/executableUtils';

// Sort options
type SortOption = 'none' | 'priority_high' | 'priority_low';

export default function ExecutablesView() {
    // Fetch all executable blocks
    const { blocks, isLoading, isError } = useExecutableBlocks();

    // Debug: Log blocks data when it changes
    useEffect(() => {
        console.log('All executable blocks:', blocks);

        // Log block types present
        if (blocks) {
            console.log('Block types present:', [...new Set(blocks.map(block => block.type))]);
        }
    }, [blocks]);

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
    const [typeFilters, setTypeFilters] = useState<MemoryBlockType[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('none');

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

        // Filter to specified executable types or all executable types if none selected
        const typeFilteredBlocks = blocks.filter(block => {
            if (typeFilters.length === 0) {
                return isExecutableType(block.type);
            }
            return typeFilters.includes(block.type);
        });

        return typeFilteredBlocks.filter(block => {
            const execMeta = narrowExecutableMeta(block);
            if (!execMeta) {
                return false;
            }

            // Get owner based on block type
            let owner = null;
            switch (block.type) {
                case MemoryBlockType.task:
                    owner = narrowExecutableMeta(block)?.reviewer || null;
                    break;
                case MemoryBlockType.project:
                case MemoryBlockType.epic:
                    const typedMeta = narrowExecutableMeta(block);
                    owner = typedMeta?.reviewer || null;
                    break;
                case MemoryBlockType.bug:
                    owner = narrowExecutableMeta(block)?.reviewer || null;
                    break;
            }

            // Apply search query filter
            if (searchQuery) {
                const lowerSearch = searchQuery.toLowerCase();
                let title = '';
                let description = '';

                switch (block.type) {
                    case MemoryBlockType.task:
                        title = block.metadata?.title || '';
                        description = block.metadata?.description || '';
                        break;
                    case MemoryBlockType.project:
                    case MemoryBlockType.epic:
                        title = block.metadata?.name || '';
                        description = block.metadata?.description || '';
                        break;
                    case MemoryBlockType.bug:
                        title = block.metadata?.title || '';
                        description = block.metadata?.description || '';
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
            const metaA = narrowExecutableMeta(a);
            const metaB = narrowExecutableMeta(b);

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
            const execMeta = narrowExecutableMeta(block);
            if (execMeta?.reviewer) owners.add(execMeta.reviewer);
        });

        return Array.from(owners);
    }, [blocks]);

    // Get unique statuses for filter dropdown
    const uniqueStatuses = React.useMemo(() => {
        if (!blocks) return [];

        const statuses = new Set<string>();
        blocks.forEach(block => {
            const execMeta = narrowExecutableMeta(block);
            if (execMeta?.status) statuses.add(execMeta.status);
        });

        return Array.from(statuses);
    }, [blocks]);

    return (
        <div className="space-y-4">
            <ExecutablesFilter
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
            ) : sortedBlocks.length === 0 ? (
                <div className="text-center p-8 bg-muted rounded-md my-8">
                    <h3 className="text-lg font-medium">No work items found</h3>
                    <p className="text-muted-foreground mt-1">
                        {searchQuery || statusFilter || ownerFilter || typeFilters.length > 0
                            ? "Try adjusting your filters"
                            : "Create a work item to get started"}
                    </p>
                </div>
            ) : (
                <ExecutablesTable blocks={sortedBlocks} />
            )}
        </div>
    );
} 