import React from 'react';
import BaseBlockRenderer from './BaseBlockRenderer';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { narrowMetadata } from '@/data/block_metadata';
import { getBlockConfidencePercentage } from '@/utils/blockUtils';

interface KnowledgeRendererProps {
  block: MemoryBlock;
}

const KnowledgeRenderer: React.FC<KnowledgeRendererProps> = ({ block }) => {
  // Render the knowledge title
  const renderKnowledgeTitle = (block: MemoryBlock) => {
    if (block.type !== MemoryBlockType.knowledge) return null;

    const knowledgeMeta = narrowMetadata(MemoryBlockType.knowledge, block.metadata);
    return (
      <h3 className="text-lg font-serif font-semibold">
        {knowledgeMeta?.domain || knowledgeMeta?.validity || block.text?.substring(0, 50) || 'Untitled Knowledge'}
      </h3>
    );
  };

  return (
    <BaseBlockRenderer
      block={block}
      renderTitle={renderKnowledgeTitle}
      getConfidencePercentage={getBlockConfidencePercentage}
    />
  );
};

export default KnowledgeRenderer; 