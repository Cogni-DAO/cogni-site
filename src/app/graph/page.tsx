'use client';

import React from 'react';
import { useBlocks } from '@/hooks/useBlocks';
import { useLinks } from '@/hooks/useBlockLinks';
import GraphVisualization from '@/components/graph/GraphVisualization';

const GraphPage = () => {
  const { blocks, isLoading: blocksLoading, isError: blocksError } = useBlocks();
  const { links, isLoading: linksLoading, isError: linksError } = useLinks();

  if (blocksLoading || linksLoading) {
    return <div className="p-4">Loading blocks and links...</div>;
  }

  if (blocksError || linksError) {
    return (
      <div className="p-4 text-red-500">
        Error: {String(blocksError || linksError)}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Knowledge Graph ({blocks?.length || 0} blocks, {links?.length || 0} links)
      </h1>

      <GraphVisualization
        blocks={blocks || []}
        links={links || []}
      />
    </div>
  );
};

export default GraphPage;
