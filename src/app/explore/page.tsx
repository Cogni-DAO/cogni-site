'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFilteredBlocks, type SortOption } from '@/hooks/useFilteredBlocks';
import MemoryBlockListItem from '@/components/MemoryBlockListItem';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemoryBlockType } from '@/data/models/memoryBlockType';

// Block type options mapping
const blockTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: MemoryBlockType.knowledge, label: 'Knowledge' },
  { value: MemoryBlockType.doc, label: 'Document' },
  { value: MemoryBlockType.project, label: 'Project' },
  { value: MemoryBlockType.task, label: 'Task' },
  { value: MemoryBlockType.log, label: 'Log' },
];

// Sort options mapping
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'confidenceDesc', label: 'Confidence (High to Low)' },
  { value: 'confidenceAsc', label: 'Confidence (Low to High)' },
  { value: 'createdAtDesc', label: 'Newest First' },
  { value: 'createdAtAsc', label: 'Oldest First' },
  { value: 'typeAsc', label: 'Type (A-Z)' },
  { value: 'typeDesc', label: 'Type (Z-A)' },
];

// Loading skeleton component for memory blocks
function MemoryBlockSkeleton() {
  return (
    <div className="content-block animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="h-6 bg-muted rounded w-2/3"></div>
        <div className="h-4 bg-muted rounded w-1/4"></div>
      </div>
      <div className="h-1 bg-muted rounded mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
      <div className="mt-2 flex justify-end">
        <div className="h-3 bg-muted rounded w-1/5"></div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  // Use our filtered blocks hook with initial search from URL
  const {
    blocks,
    totalBlocks,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    blockType,
    setBlockType
  } = useFilteredBlocks({
    initialSearchQuery: searchFromUrl
  });

  // Update search query when URL param changes
  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchFromUrl, setSearchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">Explore Memory Blocks</h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Input
            placeholder="Search memory blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-sm whitespace-nowrap">Type:</span>
            <Select
              value={blockType || 'all'}
              onValueChange={(value) => setBlockType(value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {blockTypeOptions.map(option => (
                  <SelectItem
                    key={option.label}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-sm whitespace-nowrap">Sort by:</span>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <>
          <div className="flex items-center justify-center my-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <MemoryBlockSkeleton key={i} />
            ))}
          </div>
        </>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2 text-destructive">Failed to load memory blocks</h2>
          <p className="text-muted-foreground mb-4">There was an error loading the data. Please try again.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && blocks.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No blocks found</h2>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : `No memory blocks available${blockType ? ` with type "${blockType}"` : ''}`
            }
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setBlockType(null);
          }}>Clear Filters</Button>
        </div>
      )}

      {/* Results */}
      {!isLoading && !isError && blocks.length > 0 && (
        <>
          <p className="mb-6 text-muted-foreground">
            Showing {blocks.length} of {totalBlocks} memory blocks
            {searchQuery && ` for search "${searchQuery}"`}
            {blockType && ` of type "${blockType}"`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block) => (
              <MemoryBlockListItem
                key={block.id || `block-${Math.random()}`}
                block={block}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
