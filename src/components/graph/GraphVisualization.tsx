import React from 'react';
import { ReactFlow, Controls, Background, BackgroundVariant, Node, Edge, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  centerId?: string;
}

const GraphVisualization = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  centerId
}: GraphVisualizationProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (node.id !== centerId && node.data.slug) {
      event.preventDefault();
      router.push(`/node/${node.data.slug}`);
    }
  };

  const nodeTypes = {
    centerNode: ({ data }: { data: { label: string } }) => (
      <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold">
        {data.label}
      </div>
    )
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      fitView
      attributionPosition="bottom-right"
      className="bg-background"
    >
      <Background
        variant={BackgroundVariant.Dots}
        color={theme === 'dark' ? '#2a2a2a' : '#f0f0f0'}
        gap={20}
        size={1}
      />
      <Controls position="bottom-right" />
    </ReactFlow>
  );
};

export default GraphVisualization;
