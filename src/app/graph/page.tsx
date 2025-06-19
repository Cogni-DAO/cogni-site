'use client';

import React, { useState } from 'react';
import { useBlocks } from '@/hooks/useBlocks';
import { useLinks } from '@/hooks/useBlockLinks';
import { useBranches } from '@/hooks/useBranches';
import GraphVisualization from '@/components/graph/GraphVisualization';
import { BranchSelector } from '@/components/graph/BranchSelector';
import { NamespaceSelector } from '@/components/graph/NamespaceSelector';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const GraphPage = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>();
  const [selectedNamespace, setSelectedNamespace] = useState<string>('ai-education');
  const { blocks, isLoading: blocksLoading, isError: blocksError, mutate: mutateBlocks } = useBlocks(selectedBranch, selectedNamespace);
  const { links, isLoading: linksLoading, isError: linksError, mutate: mutateLinks } = useLinks(selectedBranch, selectedNamespace, undefined, 1000);
  const { mutate: mutateBranches } = useBranches();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isLoading = blocksLoading || linksLoading;
  const isError = blocksError || linksError;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/v1/refresh', {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        // Refresh the SWR cache to get fresh data
        await Promise.all([mutateBlocks(), mutateLinks(), mutateBranches()]);
      } else {
        console.error('Refresh failed:', result.message);
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
  };

  const handleNamespaceChange = (namespace: string) => {
    setSelectedNamespace(namespace);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Knowledge Graph ({blocks?.length || 0} blocks, {links?.length || 0} links)
        </h1>
        <div className="flex items-center gap-4">
          <BranchSelector
            selectedBranch={selectedBranch}
            onBranchChange={handleBranchChange}
          />
          <NamespaceSelector
            selectedNamespace={selectedNamespace}
            onNamespaceChange={handleNamespaceChange}
          />
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      <GraphVisualization
        blocks={blocks || []}
        links={links || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={String(blocksError || linksError || '')}
        branch={selectedBranch}
      />
    </div>
  );
};

export default GraphPage;
