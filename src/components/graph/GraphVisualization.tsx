import React, { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import type { MemoryBlock } from '@/utils/blocks';
import type { BlockLink } from '@/data/models/blockLink';

interface GraphVisualizationProps {
  blocks: MemoryBlock[];
  links: BlockLink[];
  centerId?: string;
}

const GraphVisualization = ({
  blocks,
  links,
  centerId
}: GraphVisualizationProps) => {
  const cyRef = useRef<any>(null);

  // Convert blocks to Cytoscape nodes
  const nodes = blocks.map(block => ({
    data: {
      id: block.id,
      label: block.metadata?.title || block.text?.substring(0, 30) || block.type,
      type: block.type
    }
  }));

  // Convert links to Cytoscape edges
  const edges = links.map((link, index) => ({
    data: {
      id: `edge-${index}`,
      source: link.from_id,
      target: link.to_id,
      relation: link.relation
    }
  }));

  const elements = [...nodes, ...edges];

  // Basic styling
  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'color': '#fff',
        'font-size': '12px',
        'width': '60px',
        'height': '60px'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ];

  const layout = {
    name: 'cose',
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  };

  return (
    <div className="w-full h-[600px]">
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        stylesheet={stylesheet}
        layout={layout}
        cy={(cy) => {
          cyRef.current = cy;
        }}
      />
    </div>
  );
};

export default GraphVisualization;
