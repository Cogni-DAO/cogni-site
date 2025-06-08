import React from 'react';
import BaseBlockRenderer from './BaseBlockRenderer';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import { narrowMetadata } from '@/data/block_metadata';
import { getBlockConfidencePercentage } from '@/utils/blockUtils';
import FormatRenderer from '@/utils/formatRenderers';

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

  // Render the knowledge content with markdown formatting
  const renderKnowledgeContent = (block: MemoryBlock) => {
    if (block.type !== MemoryBlockType.knowledge) return null;

    return (
      <FormatRenderer
        content={block.text || ''}
        format="markdown"
      />
    );
  };

  return (
    <BaseBlockRenderer
      block={block}
      renderTitle={renderKnowledgeTitle}
      renderContent={renderKnowledgeContent}
      getConfidencePercentage={getBlockConfidencePercentage}
    />
  );
};

export default KnowledgeRenderer; 