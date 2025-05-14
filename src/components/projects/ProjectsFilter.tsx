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

interface ProjectsFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: string | null;
    onStatusChange: (status: string | null) => void;
    ownerFilter: string | null;
    onOwnerChange: (owner: string | null) => void;
    statuses: string[];
    owners: string[];
    sortBy?: string;
    onSortChange?: (sortOption: string) => void;
}

export function ProjectsFilter({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    ownerFilter,
    onOwnerChange,
    statuses,
    owners,
    sortBy = 'none',
    onSortChange = () => { },
}: ProjectsFilterProps) {
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

    // Check if any filters are applied
    const hasFilters = searchQuery || statusFilter || ownerFilter || sortBy !== 'none';

    return (
        <div className="bg-card rounded-md border p-4">
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
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

            {hasFilters && (
                <div className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium">
                        Filters:
                    </span>{' '}
                    {searchQuery && (
                        <span className="mr-3">
                            Search: "{searchQuery}"
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