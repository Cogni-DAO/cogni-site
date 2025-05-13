'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import '@xyflow/react/dist/style.css';
import GraphHeader from '@/components/graph/GraphHeader';
import GraphVisualization from '@/components/graph/GraphVisualization';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';

// Loading fallback component
const GraphLoading = () => (
  <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center">
    <div className="text-lg">Loading graph...</div>
  </div>
);

// Wrapped in its own component to use hooks
const GraphContent = () => {
  const searchParams = useSearchParams();
  const slugFromQuery = searchParams.get('slug');
  const blockIdFromQuery = searchParams.get('blockId');

  // No need to handle arrays since searchParams.get always returns a string or null
  const slug = slugFromQuery || undefined;
  const blockId = blockIdFromQuery || undefined;

  const {
    nodes,
    edges,
    centerNode,
    onNodesChange,
    onEdgesChange,
    generateGraph
  } = useKnowledgeGraph(slug, blockId);

  useEffect(() => {
    generateGraph();
  }, [generateGraph]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <GraphHeader slug={slug} centerNode={centerNode} />
      <div className="flex-1 w-full">
        <GraphVisualization
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          centerId={centerNode?.id}
        />
      </div>
    </div>
  );
};

const GraphPage = () => {
  return (
    <Suspense fallback={<GraphLoading />}>
      <GraphContent />
    </Suspense>
  );
};

export default GraphPage;
