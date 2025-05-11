import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import '@xyflow/react/dist/style.css';
import GraphHeader from '@/components/graph/GraphHeader';
import GraphVisualization from '@/components/graph/GraphVisualization';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';

const GraphPage = () => {
  const router = useRouter();
  const slugFromQuery = router.query.slug;
  const blockIdFromQuery = router.query.blockId;

  // Ensure slug and blockId are strings or undefined, not string[]
  const slug = Array.isArray(slugFromQuery) ? slugFromQuery[0] : slugFromQuery;
  const blockId = Array.isArray(blockIdFromQuery) ? blockIdFromQuery[0] : blockIdFromQuery;

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

export default GraphPage;
