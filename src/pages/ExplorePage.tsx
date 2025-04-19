
import React, { useState } from 'react';
import { getKnowledgeNodes } from '@/data/knowledgeNodes';
import KnowledgeRelatedNodes from '@/components/KnowledgeRelatedNodes';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('verificationDesc');
  
  const allNodes = getKnowledgeNodes();
  
  // Filter nodes based on search query
  const filteredNodes = allNodes.filter(node => 
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort nodes based on selected option
  const sortedNodes = [...filteredNodes].sort((a, b) => {
    switch (sortBy) {
      case 'verificationDesc':
        return b.verificationPercentage - a.verificationPercentage;
      case 'verificationAsc':
        return a.verificationPercentage - b.verificationPercentage;
      case 'titleAsc':
        return a.title.localeCompare(b.title);
      case 'titleDesc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">Explore Knowledge Nodes</h1>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Input
            placeholder="Search knowledge nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verificationDesc">Verification (High to Low)</SelectItem>
              <SelectItem value="verificationAsc">Verification (Low to High)</SelectItem>
              <SelectItem value="titleAsc">Title (A-Z)</SelectItem>
              <SelectItem value="titleDesc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Results */}
      {sortedNodes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No nodes found</h2>
          <p className="text-muted-foreground mb-4">Try adjusting your search query</p>
          <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
        </div>
      ) : (
        <>
          <p className="mb-6 text-muted-foreground">
            Showing {sortedNodes.length} knowledge {sortedNodes.length === 1 ? 'node' : 'nodes'}
            {searchQuery && ` for search "${searchQuery}"`}
          </p>
          
          <KnowledgeRelatedNodes nodes={sortedNodes} />
        </>
      )}
    </div>
  );
};

export default ExplorePage;
