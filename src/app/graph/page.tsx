'use client';

import React, { useEffect, useState } from 'react';
import { useBlocks } from '@/hooks/useBlocks';
import { fetchLinks } from '@/utils/links';
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
        Blocks ({blocks?.length || 0}) and Links ({links.length})
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Blocks Column */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Blocks</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {blocks?.map((block) => (
              <div key={block.id} className="border p-3 rounded text-sm">
                <div className="font-semibold">{block.type}</div>
                <div className="text-gray-600 text-xs">{block.id}</div>
                <div>{block.text?.substring(0, 80) || 'No text'}</div>
                {block.metadata?.title && (
                  <div className="font-medium">{String(block.metadata.title)}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Links</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {links.map((link, index) => (
              <div key={index} className="border p-3 rounded text-sm">
                <div className="font-semibold text-blue-600">{link.relation}</div>
                <div className="text-xs text-gray-600">
                  {link.from_id.substring(0, 8)}... → {link.to_id.substring(0, 8)}...
                </div>
                <div className="text-xs">Priority: {link.priority}</div>
                {link.created_at && (
                  <div className="text-xs text-gray-500">
                    {new Date(link.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
