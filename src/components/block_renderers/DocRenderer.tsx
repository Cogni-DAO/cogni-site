import React from 'react';
import BaseBlockRenderer from './BaseBlockRenderer';
import { Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import type { DocMetadata } from '@/data/block_metadata/doc';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import FormatRenderer from '@/utils/formatRenderers';

interface DocRendererProps {
    block: MemoryBlock;
}

const DocRenderer: React.FC<DocRendererProps> = ({ block }) => {
    // Helper function to safely check and access doc metadata
    const getDocMetadata = (metadata: any): DocMetadata | null => {
        if (!metadata || typeof metadata !== 'object') return null;
        if ('format' in metadata && 'title' in metadata) {
            return metadata as unknown as DocMetadata;
        }
        return null;
    };

    // Format date for display if available
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return null;

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Custom title renderer for docs
    const renderDocTitle = (block: MemoryBlock) => {
        let title = '';
        const docMeta = block.metadata ? getDocMetadata(block.metadata) : null;

        if (docMeta) {
            title = docMeta.title || '';
        }

        if (!title) {
            title = block.text?.substring(0, 50) || 'Untitled Document';
        }

        return (
            <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                <h3 className="text-lg font-serif font-semibold">{title}</h3>
            </div>
        );
    };

    // Document metadata display below the title
    const renderDocMetadata = (block: MemoryBlock) => {
        let version = '';
        let lastReviewed = null;
        let audience = null;

        const docMeta = block.metadata ? getDocMetadata(block.metadata) : null;
        if (docMeta) {
            version = docMeta.version || '';
            lastReviewed = formatDate(docMeta.last_reviewed);
            audience = docMeta.audience || null;
        }

        return (
            <div className="flex flex-wrap items-center gap-2 mt-1 mb-3 text-xs">
                {version && (
                    <Badge variant="secondary" className="text-xs">
                        v{version}
                    </Badge>
                )}
                {lastReviewed && (
                    <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{lastReviewed}</span>
                    </div>
                )}
                {audience && (
                    <Badge variant="secondary" className="text-xs">
                        {audience}
                    </Badge>
                )}
            </div>
        );
    };

    // Custom content renderer that formats document text based on format
    const renderDocContent = (block: MemoryBlock) => {
        let format = 'plain';

        const docMeta = block.metadata ? getDocMetadata(block.metadata) : null;
        if (docMeta && docMeta.format) {
            format = docMeta.format;
        }

        return (
            <div className="doc-content">
                <FormatRenderer content={block.text} format={format} />
            </div>
        );
    };

    // Calculate verification percentage from confidence field or metadata
    const getDocVerificationPercentage = (block: MemoryBlock): number => {
        // Check for a verification property in metadata
        const docMeta = block.metadata ? getDocMetadata(block.metadata) : null;
        if (docMeta && 'verification' in docMeta && typeof docMeta.verification === 'number') {
            return docMeta.verification;
        }

        // Try to get from confidence field
        if (block.confidence?.human !== null && block.confidence?.human !== undefined) {
            return Math.round((block.confidence.human || 0) * 100);
        }

        // Default value
        return 70; // Different default for docs
    };

    return (
        <BaseBlockRenderer
            block={block}
            renderTitle={renderDocTitle}
            // Let the base renderer handle verification percentage in the top right
            // Don't provide a headerRightSlot so it uses the default behavior
            contentSlot={
                <>
                    {renderDocMetadata(block)}
                    {renderDocContent(block)}
                </>
            }
            getVerificationPercentage={getDocVerificationPercentage}
        />
    );
};

export default DocRenderer; 