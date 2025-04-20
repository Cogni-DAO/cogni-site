
import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import '@xyflow/react/dist/style.css';
import GraphHeader from '@/components/graph/GraphHeader';
import GraphVisualization from '@/components/graph/GraphVisualization';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';

const GraphView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const blockId = searchParams.get('blockId');

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

export default GraphView;
