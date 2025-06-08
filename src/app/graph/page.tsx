'use client';

import React, { useState } from 'react';
import { useBlocks } from '@/hooks/useBlocks';
import { useLinks } from '@/hooks/useBlockLinks';
import GraphVisualization from '@/components/graph/GraphVisualization';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const GraphPage = () => {
  const { blocks, isLoading: blocksLoading, isError: blocksError } = useBlocks();
  const { links, isLoading: linksLoading, isError: linksError } = useLinks();
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
        // Refresh the page data by reloading
        window.location.reload();
      } else {
        console.error('Refresh failed:', result.message);
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Knowledge Graph ({blocks?.length || 0} blocks, {links?.length || 0} links)
        </h1>
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

      <GraphVisualization
        blocks={blocks || []}
        links={links || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={String(blocksError || linksError || '')}
      />
    </div>
  );
};

export default GraphPage;
