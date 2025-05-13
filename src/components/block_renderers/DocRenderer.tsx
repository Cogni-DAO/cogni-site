import React from 'react';
import BaseBlockRenderer from './BaseBlockRenderer';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import FormatRenderer from '@/utils/formatRenderers';
import { getBlockConfidencePercentage } from '@/utils/blockUtils';
import { narrowMetadata } from '@/data/block_metadata';

interface DocRendererProps {
    block: MemoryBlock;
}

const DocRenderer: React.FC<DocRendererProps> = ({ block }) => {
    // Render the document title
    const renderDocTitle = (block: MemoryBlock) => {
        if (block.type !== MemoryBlockType.doc) return null;

        const docMeta = narrowMetadata(MemoryBlockType.doc, block.metadata);
        return (
            <h3 className="text-lg font-serif font-semibold">
                {docMeta?.title || block.text?.substring(0, 50) || 'Untitled Document'}
            </h3>
        );
    };

    // Render document metadata (version, audience) below the title, not in the header
    const renderDocMetadataContent = (block: MemoryBlock) => {
        if (block.type !== MemoryBlockType.doc) return null;

        const docMeta = narrowMetadata(MemoryBlockType.doc, block.metadata);

        if (!docMeta?.version && !docMeta?.last_reviewed && !docMeta?.audience) {
            return null;
        }

        return (
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs mb-4 text-muted-foreground">
                {docMeta?.version && (
                    <div className="flex items-center space-x-1">
                        <span>Version:</span>
                        <span className="font-medium">{docMeta.version}</span>
                    </div>
                )}

                {docMeta?.last_reviewed && (
                    <div className="flex items-center space-x-1">
                        <span>Reviewed:</span>
                        <span className="font-medium">{new Date(docMeta.last_reviewed).toLocaleDateString()}</span>
                    </div>
                )}

                {docMeta?.audience && (
                    <div className="flex items-center space-x-1">
                        <span>Audience:</span>
                        <span className="font-medium">{docMeta.audience}</span>
                    </div>
                )}
            </div>
        );
    };

    // Render the document content with metadata and formatted text
    const renderDocContent = (block: MemoryBlock) => {
        if (block.type !== MemoryBlockType.doc) return null;

        const docMeta = narrowMetadata(MemoryBlockType.doc, block.metadata);
        const format = docMeta?.format || 'markdown';

        return (
            <div>
                {renderDocMetadataContent(block)}

                <FormatRenderer
                    content={block.text || ''}
                    format={format}
                />

                {docMeta?.format && docMeta.format !== 'markdown' && (
                    <div className="mt-2 text-xs text-muted-foreground">
                        Format: {docMeta.format}
                    </div>
                )}
            </div>
        );
    };

    return (
        <BaseBlockRenderer
            block={block}
            renderTitle={renderDocTitle}
            renderContent={renderDocContent}
            getConfidencePercentage={getBlockConfidencePercentage}
        />
    );
};

export default DocRenderer; 