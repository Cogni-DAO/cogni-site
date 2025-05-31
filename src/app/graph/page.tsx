'use client';

import React, { useEffect, useState } from 'react';
import { useBlocks } from '@/hooks/useBlocks';
import { fetchLinks } from '@/utils/links';
import GraphVisualization from '@/components/graph/GraphVisualization';
import type { BlockLink } from '@/data/models/blockLink';

const GraphPage = () => {
  const { blocks, isLoading: blocksLoading, isError: blocksError } = useBlocks();
  const [links, setLinks] = useState<BlockLink[]>([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksError, setLinksError] = useState<string | null>(null);

  // Fetch all links using the utility function
  useEffect(() => {
    const loadLinks = async () => {
      try {
        const linksData = await fetchLinks();
        setLinks(linksData);
      } catch (error) {
        setLinksError(String(error));
      } finally {
        setLinksLoading(false);
      }
    };

    loadLinks();
  }, []);

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
        Knowledge Graph ({blocks?.length || 0} blocks, {links.length} links)
      </h1>

      <GraphVisualization
        blocks={blocks || []}
        links={links}
      />
    </div>
  );
};

export default GraphPage;
