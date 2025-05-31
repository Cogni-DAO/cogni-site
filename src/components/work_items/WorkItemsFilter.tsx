'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MemoryBlockType } from '@/data/models/memoryBlockType';

interface WorkItemsFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: string | null;
    onStatusChange: (status: string | null) => void;
    ownerFilter: string | null;
    onOwnerChange: (owner: string | null) => void;
    typeFilters: MemoryBlockType[];
    onTypeFilterChange: (type: MemoryBlockType, isActive: boolean) => void;
    statuses: string[];
    owners: string[];
    sortBy?: string;
    onSortChange?: (sortOption: string) => void;
}

export function WorkItemsFilter({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    ownerFilter,
    onOwnerChange,
    typeFilters,
    onTypeFilterChange,
    statuses,
    owners,
    sortBy = 'none',
    onSortChange = () => { },
}: WorkItemsFilterProps) {
    // Clear all filters
    const clearFilters = () => {
        onSearchChange('');
        onStatusChange(null);
        onOwnerChange(null);
        onSortChange('none');
    };

    // Format status for display (convert snake_case to Title Case)
    const formatStatus = (status: string) => {
        return status
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Format block type for display
    const formatType = (type: string) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    // Check if type is selected
    const isTypeSelected = (type: MemoryBlockType) => {
        return typeFilters.includes(type);
    };

    // Toggle type filter
    const toggleTypeFilter = (type: MemoryBlockType) => {
        onTypeFilterChange(type, !isTypeSelected(type));
    };

    // Get type badge color
    const getTypeBadgeColor = (type: MemoryBlockType, isSelected: boolean) => {
        if (!isSelected) return 'bg-muted hover:bg-muted/80 cursor-pointer';

        switch (type) {
            case MemoryBlockType.task:
                return 'bg-blue-200 text-blue-900 hover:bg-blue-300 cursor-pointer';
            case MemoryBlockType.project:
                return 'bg-green-200 text-green-900 hover:bg-green-300 cursor-pointer';
            case MemoryBlockType.epic:
                return 'bg-purple-200 text-purple-900 hover:bg-purple-300 cursor-pointer';
            case MemoryBlockType.bug:
                return 'bg-red-200 text-red-900 hover:bg-red-300 cursor-pointer';
            default:
                return 'bg-muted hover:bg-muted/80 cursor-pointer';
        }
    };

    // Check if any filters are applied
    const hasFilters = searchQuery || statusFilter || ownerFilter || sortBy !== 'none' || typeFilters.length > 0;

    return (
        <div className="bg-card rounded-md border p-4">
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search work items..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <Select
                    value={statusFilter || 'all-statuses'}
                    onValueChange={(value) => onStatusChange(value === 'all-statuses' ? null : value)}
                >
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-statuses">All Statuses</SelectItem>
                        {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                                {formatStatus(status)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={ownerFilter || 'all-owners'}
                    onValueChange={(value) => onOwnerChange(value === 'all-owners' ? null : value)}
                >
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Owner" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-owners">All Owners</SelectItem>
                        {owners.map((owner) => (
                            <SelectItem key={owner} value={owner}>
                                {owner}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={sortBy}
                    onValueChange={onSortChange}
                >
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No Sorting</SelectItem>
                        <SelectItem value="priority_high">Priority (High → Low)</SelectItem>
                        <SelectItem value="priority_low">Priority (Low → High)</SelectItem>
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={clearFilters}
                        className="md:self-auto self-end"
                        title="Clear filters"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Type filter badges */}
            <div className="flex flex-wrap gap-2 mt-3">
                {[MemoryBlockType.task, MemoryBlockType.project, MemoryBlockType.epic, MemoryBlockType.bug].map((type) => (
                    <Badge
                        key={type}
                        className={cn("transition-colors", getTypeBadgeColor(type, isTypeSelected(type)))}
                        onClick={() => toggleTypeFilter(type)}
                    >
                        {formatType(type)}
                    </Badge>
                ))}
            </div>

            {hasFilters && (
                <div className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium">
                        Filters:
                    </span>{' '}
                    {searchQuery && (
                        <span className="mr-3">
                            Search: &quot;{searchQuery}&quot;
                        </span>
                    )}
                    {statusFilter && (
                        <span className="mr-3">
                            Status: {formatStatus(statusFilter)}
                        </span>
                    )}
                    {ownerFilter && (
                        <span className="mr-3">
                            Owner: {ownerFilter}
                        </span>
                    )}
                    {typeFilters.length > 0 && (
                        <span className="mr-3">
                            Types: {typeFilters.map(formatType).join(', ')}
                        </span>
                    )}
                    {sortBy !== 'none' && (
                        <span>
                            Sort: {sortBy === 'priority_high' ? 'Priority (High to Low)' : 'Priority (Low to High)'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
} 