
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { knowledgeNodes } from '@/data/knowledgeNodes';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

// Define our node types
interface KnowledgeNode {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  links: { id: string; title: string; slug: string }[];
  blocks: {
    id: string;
    title: string;
    content: string;
    links: { title: string; slug: string }[];
  }[];
  verificationPercentage: number;
  relatedNodes: {
    id: string;
    title: string;
    slug: string;
    description: string;
    verificationPercentage: number;
  }[];
}

const GraphView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const blockId = searchParams.get('blockId');
  const { theme } = useTheme();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [centerNode, setCenterNode] = useState<KnowledgeNode | null>(null);

  // Generate graph nodes and edges based on the current knowledge node
  const generateGraph = useCallback(() => {
    if (!slug) return;

    // Find the current node
    const currentNode = knowledgeNodes.find(node => node.slug === slug);
    if (!currentNode) {
      console.error(`Node with slug "${slug}" not found`);
      return;
    }

    setCenterNode(currentNode);

    // Create nodes array - center node and related nodes
    const flowNodes: Node[] = [
      {
        id: currentNode.id,
        position: { x: 0, y: 0 },
        data: { 
          label: currentNode.title,
          verificationPercentage: currentNode.verificationPercentage
        },
        type: 'centerNode',
        className: 'center-node'
      }
    ];

    // Add related nodes in a circle around the center
    const radius = 250;
    const relatedNodesCount = currentNode.relatedNodes.length;
    
    currentNode.relatedNodes.forEach((relatedNode, index) => {
      // Calculate position in a circle
      const angle = (index / relatedNodesCount) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      flowNodes.push({
        id: relatedNode.id,
        position: { x, y },
        data: { 
          label: relatedNode.title,
          slug: relatedNode.slug,
          verificationPercentage: relatedNode.verificationPercentage
        },
        className: 'related-node'
      });
    });

    // Create edges from center to all related nodes
    const flowEdges: Edge[] = currentNode.relatedNodes.map(relatedNode => ({
      id: `e-${currentNode.id}-${relatedNode.id}`,
      source: currentNode.id,
      target: relatedNode.id,
      animated: true,
      className: 'knowledge-edge'
    }));

    // If a specific block is specified, highlight its connections
    if (blockId) {
      const block = currentNode.blocks.find(b => b.id === blockId);
      if (block) {
        // For each link in the block, add a special edge if the target exists
        block.links.forEach(link => {
          const targetNode = currentNode.relatedNodes.find(rn => rn.slug === link.slug);
          if (targetNode) {
            flowEdges.push({
              id: `e-block-${blockId}-${targetNode.id}`,
              source: currentNode.id,
              target: targetNode.id,
              animated: true,
              style: { strokeWidth: 3 },
              className: 'block-specific-edge'
            });
          }
        });
      }
    }

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [slug, blockId, setNodes, setEdges]);

  useEffect(() => {
    generateGraph();
  }, [generateGraph]);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    // Only handle clicks on related nodes, not the center node
    if (node.id !== centerNode?.id && node.data.slug) {
      window.location.href = `/node/${node.data.slug}`;
    }
  };

  // Custom Node components
  const nodeTypes = {
    centerNode: ({ data }: { data: any }) => (
      <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold">
        {data.label}
      </div>
    )
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center p-4 border-b">
        <Link to={`/node/${slug}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={16} />
            Back to {centerNode?.title || 'Knowledge Node'}
          </Button>
        </Link>
        <h1 className="ml-4 text-xl font-serif font-bold">
          Knowledge Graph: {centerNode?.title || 'Loading...'}
        </h1>
      </div>
      
      <div className="flex-1 w-full">
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
      </div>
    </div>
  );
};

export default GraphView;
