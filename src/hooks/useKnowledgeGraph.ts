
import { useCallback, useState } from 'react';
import { Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';
import { getKnowledgeNodeBySlug, getRelatedKnowledgeNodes } from '@/data/knowledgeNodes';
import { KnowledgeNodeDisplay } from '@/types/knowledge';

export const useKnowledgeGraph = (slug: string | undefined, blockId: string | null) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [centerNode, setCenterNode] = useState<KnowledgeNodeDisplay | null>(null);

  const generateGraph = useCallback(() => {
    if (!slug) return;

    const currentNode = getKnowledgeNodeBySlug(slug);
    if (!currentNode) {
      console.error(`Node with slug "${slug}" not found`);
      return;
    }

    const relatedNodesData = getRelatedKnowledgeNodes(currentNode.relatedNodes);
    
    const displayNode: KnowledgeNodeDisplay = {
      ...currentNode,
      relatedNodes: relatedNodesData.map(node => ({
        id: node.id,
        title: node.title,
        slug: node.slug,
        description: node.description,
        verificationPercentage: node.verificationPercentage
      }))
    };
    
    setCenterNode(displayNode);

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

    const radius = 250;
    const relatedNodesCount = relatedNodesData.length;
    
    relatedNodesData.forEach((relatedNode, index) => {
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

    const flowEdges: Edge[] = relatedNodesData.map(relatedNode => ({
      id: `e-${currentNode.id}-${relatedNode.id}`,
      source: currentNode.id,
      target: relatedNode.id,
      animated: true,
      className: 'knowledge-edge'
    }));

    if (blockId) {
      const block = currentNode.blocks.find(b => b.id === blockId);
      if (block) {
        block.links.forEach(link => {
          const targetNode = relatedNodesData.find(rn => rn.slug === link.slug);
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

  return {
    nodes,
    edges,
    centerNode,
    onNodesChange,
    onEdgesChange,
    generateGraph
  };
};
