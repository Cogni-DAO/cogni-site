import React, { useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import type { MemoryBlock } from '@/utils/blocks';
import type { BlockLink } from '@/data/models/blockLink';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { WorkItemSidePanel } from '@/components/work_items/WorkItemSidePanel';

interface GraphVisualizationProps {
  blocks: MemoryBlock[];
  links: BlockLink[];
  centerId?: string;
}

// Layout presets for user selection
const LAYOUT_PRESETS = {
  concentric: {
    name: 'concentric',
    displayName: 'Hierarchical (Concentric)',
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 50,
    concentric: function (node: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const typeOrder: { [key: string]: number } = {
        'project': 5,
        'epic': 4,
        'task': 3,
        'bug': 2
      };
      return typeOrder[node.data('type')] || 1;
    },
    levelWidth: function () { // eslint-disable-line @typescript-eslint/no-explicit-any
      return 3;
    },
    minNodeSpacing: 80,
    avoidOverlap: true
  },
  cose: {
    name: 'cose',
    displayName: 'Force-Directed (Interactive)',
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 50,
    nodeRepulsion: 400000,
    nodeOverlap: 10,
    idealEdgeLength: 100,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    randomize: false
  },
  grid: {
    name: 'grid',
    displayName: 'Grid (Organized)',
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 50,
    rows: undefined,
    cols: undefined,
    spacingFactor: 1.2,
    avoidOverlap: true
  },
  circle: {
    name: 'circle',
    displayName: 'Circle (Simple)',
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 50,
    radius: undefined,
    spacingFactor: 1.5,
    avoidOverlap: true
  }
};

const GraphVisualization = ({
  blocks,
  links,
  centerId
}: GraphVisualizationProps) => {
  const cyRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const selectedNodeRef = useRef<string | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<keyof typeof LAYOUT_PRESETS>('concentric');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Keep ref in sync with state
  React.useEffect(() => {
    selectedNodeRef.current = selectedNodeId;
  }, [selectedNodeId]);

  // Helper function to create concise node labels (1-2 words)
  const createNodeLabel = (block: MemoryBlock): string => {
    // First try to use title if it exists and is short
    if (block.metadata?.title && typeof block.metadata.title === 'string') {
      const words = block.metadata.title.trim().split(/\s+/);
      if (words.length <= 2) return block.metadata.title;
      // Take first 2 words if title is longer
      return words.slice(0, 2).join(' ');
    }

    // Fall back to first 1-2 words from text content
    if (block.text && typeof block.text === 'string') {
      const words = block.text.trim().split(/\s+/);
      return words.slice(0, 2).join(' ');
    }

    // Final fallback to block type
    return block.type.charAt(0).toUpperCase() + block.type.slice(1);
  };

  // Convert blocks to Cytoscape nodes
  const nodes = blocks
    .filter(block => block.id && typeof block.id === 'string') // Filter out blocks without valid IDs
    .map(block => ({
      data: {
        id: block.id,
        label: createNodeLabel(block),
        type: block.type,
        // Add additional data for styling
        originalType: block.type,
        priority: block.metadata?.priority || 0,
        state: block.state
      }
    }));

  // Get valid node IDs for edge validation
  const validNodeIds = new Set(nodes.map(node => node.data.id));

  // Convert links to Cytoscape edges
  const edges = links
    .filter(link =>
      link.from_id &&
      link.to_id &&
      typeof link.from_id === 'string' &&
      typeof link.to_id === 'string' &&
      validNodeIds.has(link.from_id) &&
      validNodeIds.has(link.to_id) // Only include edges between existing nodes
    )
    .map((link, index) => ({
      data: {
        id: `edge-${index}`,
        source: link.from_id,
        target: link.to_id,
        relation: link.relation,
        priority: link.priority || 0,
        label: link.relation
      }
    }));

  const elements = [...nodes, ...edges];

  // If no elements, show a message instead of rendering Cytoscape
  if (elements.length === 0) {
    return (
      <div style={{ width: '100%', height: '900px', border: '1px solid #ccc' }}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No blocks or links to display
        </div>
      </div>
    );
  }

  // Enhanced stylesheet with node type-based styling
  const stylesheet = [
    // Node styles
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'color': '#000',
        'font-size': '32px',
        'font-weight': 'bold',
        'text-outline-width': 2,
        'text-outline-color': '#fff',
        'width': 240,
        'height': 240,
        'border-width': 3,
        'border-color': '#333',
        'transition-property': 'background-color, border-color, width, height',
        'transition-duration': '0.3s'
      }
    },
    // Task nodes - blue roundrectangle
    {
      selector: 'node[type = "task"]',
      style: {
        'background-color': '#3498db',
        'shape': 'round-rectangle',
        'border-color': '#2980b9'
      }
    },
    // Project nodes - green hexagon
    {
      selector: 'node[type = "project"]',
      style: {
        'background-color': '#2ecc71',
        'shape': 'hexagon',
        'border-color': '#27ae60'
      }
    },
    // Bug nodes - red triangle
    {
      selector: 'node[type = "bug"]',
      style: {
        'background-color': '#e74c3c',
        'shape': 'triangle',
        'border-color': '#c0392b'
      }
    },
    // Epic nodes - purple diamond
    {
      selector: 'node[type = "epic"]',
      style: {
        'background-color': '#9b59b6',
        'shape': 'diamond',
        'border-color': '#8e44ad'
      }
    },
    // Knowledge nodes - orange ellipse
    {
      selector: 'node[type = "knowledge"]',
      style: {
        'background-color': '#f39c12',
        'shape': 'ellipse',
        'border-color': '#e67e22'
      }
    },
    // Doc nodes - gray rectangle
    {
      selector: 'node[type = "doc"]',
      style: {
        'background-color': '#95a5a6',
        'shape': 'rectangle',
        'border-color': '#7f8c8d'
      }
    },
    // Interaction nodes - teal round-tag
    {
      selector: 'node[type = "interaction"]',
      style: {
        'background-color': '#1abc9c',
        'shape': 'round-tag',
        'border-color': '#16a085'
      }
    },
    // Edge styles
    {
      selector: 'edge',
      style: {
        'width': 8,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 1.2,
        'label': 'data(relation)',
        'font-size': '20px',
        'text-rotation': 'autorotate',
        'text-margin-y': -10,
        'color': '#666',
        'text-background-color': '#fff',
        'text-background-opacity': 0.8,
        'text-background-padding': '2px',
        'transition-property': 'line-color, target-arrow-color, width',
        'transition-duration': '0.3s'
      }
    },
    // Different edge styles based on relation
    {
      selector: 'edge[relation = "depends_on"]',
      style: {
        'line-color': '#e74c3c',
        'target-arrow-color': '#e74c3c',
        'line-style': 'solid'
      }
    },
    {
      selector: 'edge[relation = "child_of"]',
      style: {
        'line-color': '#3498db',
        'target-arrow-color': '#3498db',
        'line-style': 'dashed'
      }
    },
    {
      selector: 'edge[relation = "subtask_of"]',
      style: {
        'line-color': '#2ecc71',
        'target-arrow-color': '#2ecc71',
        'line-style': 'dotted'
      }
    },
    {
      selector: 'edge[relation = "is_blocked_by"]',
      style: {
        'line-color': '#f39c12',
        'target-arrow-color': '#f39c12',
        'line-style': 'solid',
        'width': 3
      }
    },
    // Highlighted neighborhood
    {
      selector: '.highlighted',
      style: {
        'opacity': 1,
        'z-index': 5
      }
    },
    // Faded non-selected elements
    {
      selector: '.faded',
      style: {
        'opacity': 0.3
      }
    }
  ];

  // Force-directed layout with good defaults (using built-in cose instead of fcose)
  const layout = LAYOUT_PRESETS[selectedLayout];

  // Handle Cytoscape instance ready
  const handleCy = (cy: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      cyRef.current = cy;

      // Log debug info
      console.log('Cytoscape initialized with:', {
        nodes: nodes.length,
        edges: edges.length,
        elements: elements.length
      });

      // Add interactivity
      cy.on('tap', 'node', (evt: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const node = evt.target;
        const nodeId = node.data('id');

        // Only update sidepanel if selecting a different node
        if (nodeId !== selectedNodeRef.current) {
          setSelectedNodeId(nodeId);
        }

        // Always highlight the clicked node's neighborhood
        highlightNeighborhood(node);
      });

      // Clear highlight on background tap only if no sidepanel is open
      cy.on('tap', (evt: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (evt.target === cy && !selectedNodeRef.current) {
          clearHighlight();
        }
      });

      // Add tooltips on hover
      cy.on('mouseover', 'node', (evt: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const node = evt.target;
        const nodeData = node.data();

        // Simple hover feedback - could be enhanced later with proper tooltips
        console.log(`Hovering over: ${nodeData.label} (${nodeData.type})`);
      });

      // Center on specific node if provided
      if (centerId) {
        const targetNode = cy.getElementById(centerId);
        if (targetNode.length > 0) {
          cy.animate({
            center: {
              eles: targetNode
            },
            zoom: 2
          }, {
            duration: 1000
          });
        }
      }
    } catch (error) {
      console.error('Error initializing Cytoscape:', error);
    }
  };

  // Highlight neighborhood function
  const highlightNeighborhood = (node: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const cy = cyRef.current;
    if (!cy) return;

    const neighborhood = node.neighborhood().add(node);

    cy.elements().removeClass('highlighted faded');
    cy.elements().not(neighborhood).addClass('faded');
    neighborhood.addClass('highlighted');
  };

  // Clear highlight function
  const clearHighlight = () => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass('highlighted faded');
  };

  // Handle layout change
  const handleLayoutChange = (newLayout: keyof typeof LAYOUT_PRESETS) => {
    setSelectedLayout(newLayout);
    if (cyRef.current) {
      const layoutOptions = LAYOUT_PRESETS[newLayout];
      const layout = cyRef.current.layout(layoutOptions);
      layout.run();
    }
  };

  // Handle closing the sidepanel
  const handleCloseSidePanel = () => {
    setSelectedNodeId(null);
    clearHighlight();
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Layout Selector */}
      <div className="flex items-center gap-3 mb-4">
        <Label>
          Layout:
        </Label>
        <Select
          value={selectedLayout}
          onValueChange={(value) => handleLayoutChange(value as keyof typeof LAYOUT_PRESETS)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LAYOUT_PRESETS).map(([key, preset]) => (
              <SelectItem key={key} value={key}>
                {preset.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Graph Container */}
      <div style={{ width: '100%', height: '900px', border: '1px solid #ccc', position: 'relative' }}>
        <CytoscapeComponent
          elements={elements}
          style={{ width: '100%', height: '100%' }}
          stylesheet={stylesheet}
          layout={layout}
          cy={handleCy}
        />

        {/* Legend */}
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-2 text-xs shadow-sm">
          <div className="font-semibold mb-1">Block Types</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: '#3498db' }}></div>
              <span>Task</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2ecc71', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <span>Project</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: '#9b59b6', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
              <span>Epic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: '#e74c3c', clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
              <span>Bug</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 rounded-full" style={{ backgroundColor: '#f39c12' }}></div>
              <span>Knowledge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2" style={{ backgroundColor: '#95a5a6' }}></div>
              <span>Doc</span>
            </div>
          </div>
        </div>
      </div>

      {/* Work Item Side Panel */}
      <WorkItemSidePanel
        blockId={selectedNodeId}
        onClose={handleCloseSidePanel}
      />
    </div>
  );
};

export default GraphVisualization;
