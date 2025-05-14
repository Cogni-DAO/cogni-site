'use client';

import React from 'react';
import { ProjectsTable } from './ProjectsTable';
import { ProjectsFilter } from './ProjectsFilter';
import { useBlocks } from '@/hooks/useBlocks';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { useState, useEffect } from 'react';
import { narrowMetadata } from '@/data/block_metadata';
import type { MemoryBlock } from '@/data/models/memoryBlock';

// Sort options
type SortOption = 'none' | 'priority_high' | 'priority_low';

export default function ProjectsView() {
    // Fetch all blocks
    const { blocks, isLoading, isError } = useBlocks();

    // Debug: Log blocks data when it changes
    useEffect(() => {
        console.log('All blocks:', blocks);

        // Get the array of blocks from the correct property
        const blocksArray = blocks || [];

        console.log('Blocks array to use:', blocksArray);
        console.log('Project type enum value:', MemoryBlockType.project);
        console.log('Projects in blocks:', blocksArray.filter(block => block.type === MemoryBlockType.project));
        console.log('Block types present:', [...new Set(blocksArray.map(block => block.type))]);
    }, [blocks]);

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('none');

    // Filter projects from blocks
    const projects = React.useMemo(() => {
        if (!blocks) return [];

        // Get the array of blocks from the correct property
        const blocksArray = blocks;

        // Filter to only project blocks
        const projectBlocks = blocksArray
            .filter(block => {
                const isProject = block.type === MemoryBlockType.project;
                if (isProject) {
                    console.log('Found project block:', block.id, block);
                }
                return isProject;
            })
            .filter(block => {
                const projectMeta = narrowMetadata(MemoryBlockType.project, block.metadata);
                if (!projectMeta) {
                    console.log('Project missing metadata:', block.id);
                    return false;
                }

                // Apply search query filter
                if (searchQuery) {
                    const lowerSearch = searchQuery.toLowerCase();
                    const nameMatch = projectMeta.name && projectMeta.name.toLowerCase().includes(lowerSearch);
                    const descMatch = projectMeta.description && projectMeta.description.toLowerCase().includes(lowerSearch);

                    if (!nameMatch && !descMatch) {
                        return false;
                    }
                }

                // Apply status filter
                if (statusFilter && projectMeta.status !== statusFilter) {
                    return false;
                }

                // Apply owner filter
                if (ownerFilter && projectMeta.owner !== ownerFilter) {
                    return false;
                }

                return true;
            });

        // Apply sorting if needed
        if (sortBy !== 'none') {
            projectBlocks.sort((a, b) => {
                const metaA = narrowMetadata(MemoryBlockType.project, a.metadata);
                const metaB = narrowMetadata(MemoryBlockType.project, b.metadata);

                // Convert priority to numeric value for sorting
                const getPriorityValue = (priority: string | null | undefined) => {
                    if (!priority) return 0;
                    if (priority === 'high') return 3;
                    if (priority === 'medium') return 2;
                    if (priority === 'low') return 1;
                    return 0;
                };

                const priorityA = getPriorityValue(metaA?.priority);
                const priorityB = getPriorityValue(metaB?.priority);

                return sortBy === 'priority_high'
                    ? priorityB - priorityA // High to low
                    : priorityA - priorityB; // Low to high
            });
        }

        console.log('Final filtered projects:', projectBlocks);
        return projectBlocks;
    }, [blocks, searchQuery, statusFilter, ownerFilter, sortBy]);

    // Get unique owners for filter dropdown
    const uniqueOwners = React.useMemo(() => {
        if (!projects) return [];

        const owners = new Set<string>();
        projects.forEach(project => {
            const meta = narrowMetadata(MemoryBlockType.project, project.metadata);
            if (meta?.owner) owners.add(meta.owner);
        });

        return Array.from(owners);
    }, [projects]);

    // Get unique statuses for filter dropdown
    const uniqueStatuses = React.useMemo(() => {
        if (!projects) return [];

        const statuses = new Set<string>();
        projects.forEach(project => {
            const meta = narrowMetadata(MemoryBlockType.project, project.metadata);
            if (meta?.status) statuses.add(meta.status);
        });

        return Array.from(statuses);
    }, [projects]);

    return (
        <div className="space-y-4">
            <ProjectsFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                ownerFilter={ownerFilter}
                onOwnerChange={setOwnerFilter}
                statuses={uniqueStatuses}
                owners={uniqueOwners}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            {isLoading ? (
                <div className="flex justify-center my-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : isError ? (
                <div className="bg-destructive/10 p-4 rounded-md text-destructive text-center my-8">
                    Error loading projects. Please try again later.
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center p-8 bg-muted rounded-md my-8">
                    <h3 className="text-lg font-medium">No projects found</h3>
                    <p className="text-muted-foreground mt-1">
                        {searchQuery || statusFilter || ownerFilter
                            ? "Try adjusting your filters"
                            : "Create a project to get started"}
                    </p>
                </div>
            ) : (
                <ProjectsTable projects={projects} />
            )}
        </div>
    );
} 