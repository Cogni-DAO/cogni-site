import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, MessageSquare, Network } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import type { ReactNode } from 'react';
import { getBlockConfidencePercentage } from '@/utils/blockUtils';

// Props for the confidence percentage component
interface ConfidenceStatusProps {
    percentage: number;
    label?: string;
}

// Component for displaying confidence percentage
export const ConfidenceStatus: React.FC<ConfidenceStatusProps> = ({
    percentage,
    label = "Confidence"
}) => (
    <div className="flex items-center space-x-1 text-xs">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{percentage}%</span>
    </div>
);

// Props for the related links component
interface RelatedLinksProps {
    links: { title: string; slug: string }[];
}

// Component for displaying related links/nodes
export const RelatedLinks: React.FC<RelatedLinksProps> = ({ links }) => {
    if (links.length === 0) return null;

    return (
        <div className="mt-3">
            <span className="text-sm font-medium">Related Nodes:</span>
            <div className="flex flex-wrap gap-2 mt-1">
                {links.map((link) => (
                    <Link
                        key={link.slug}
                        href={`/blocks/${link.slug}`}
                        className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-knowledge hover:text-white transition-colors duration-200"
                    >
                        {link.title}
                    </Link>
                ))}
            </div>
        </div>
    );
};

// Props for action buttons component
interface ActionButtonsProps {
    onPositiveFeedback: () => void;
    onNegativeFeedback: () => void;
    onViewGraph: () => void;
}

// Component for block action buttons
export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onPositiveFeedback,
    onNegativeFeedback,
    onViewGraph
}) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={onPositiveFeedback}
            >
                <ThumbsUp className="h-3 w-3 mr-1" />
                Helpful
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={onNegativeFeedback}
            >
                <ThumbsDown className="h-3 w-3 mr-1" />
                Needs Work
            </Button>
        </div>

        <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={onViewGraph}
        >
            <Network className="h-3 w-3 mr-1" />
            View Graph
        </Button>
    </div>
);

// Floating comment button props
interface FloatingCommentButtonProps {
    onComment: () => void;
    position: { x: number; y: number } | null;
}

// Floating comment button component
const FloatingCommentButton: React.FC<FloatingCommentButtonProps> = ({
    onComment,
    position
}) => {
    if (!position) return null;

    return (
        <div
            className="fixed z-50 bg-primary text-primary-foreground rounded-full p-2 shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)'
            }}
            onClick={onComment}
        >
            <MessageSquare className="h-4 w-4" />
        </div>
    );
};

// Main BaseBlockRenderer props
interface BaseBlockRendererProps {
    block: MemoryBlock;
    // Slot props for customization
    titleSlot?: ReactNode;
    headerRightSlot?: ReactNode;
    contentSlot?: ReactNode;
    actionsSlot?: ReactNode;
    // Custom renderers and callbacks
    renderContent?: (block: MemoryBlock) => ReactNode;
    renderTitle?: (block: MemoryBlock) => ReactNode;
    renderLinks?: (links: { title: string; slug: string }[]) => ReactNode;
    getConfidencePercentage?: (block: MemoryBlock) => number;
    transformLinks?: (block: MemoryBlock) => { title: string; slug: string }[];
    onPositiveFeedback?: () => void;
    onNegativeFeedback?: () => void;
    onViewGraph?: () => void;
}

// BaseBlockRenderer component - foundation for all block renderers
const BaseBlockRenderer: React.FC<BaseBlockRendererProps> = ({
    block,
    // Slots
    titleSlot,
    headerRightSlot,
    contentSlot,
    actionsSlot,
    // Custom renderers
    renderContent,
    renderTitle,
    renderLinks,
    getConfidencePercentage,
    transformLinks,
    // Event handlers with defaults
    onPositiveFeedback = () => { },
    onNegativeFeedback = () => { },
    onViewGraph = () => { },
}) => {
    const [commentPosition, setCommentPosition] = useState<{ x: number; y: number } | null>(null);
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Use the utility function for confidence percentage calculation
    const defaultTransformLinks = (): { title: string; slug: string }[] => {
        // Links are now fetched separately via API endpoints, not included in block data
        return [];
    };

    const defaultRenderTitle = (block: MemoryBlock): ReactNode => {
        // Try to get title from metadata based on block type
        let title = '';
        if (block.metadata) {
            if (block.type === 'project' && typeof block.metadata.name === 'string') {
                title = block.metadata.name;
            } else if (block.type === 'doc' && typeof block.metadata.title === 'string') {
                title = block.metadata.title;
            } else if (block.type === 'task' && typeof block.metadata.name === 'string') {
                title = block.metadata.name;
            }
        }

        // Fallback to text if no title found
        if (!title) {
            title = block.text?.substring(0, 50) || `Untitled ${block.type}`;
        }

        return <h3 className="text-lg font-serif font-semibold">{title}</h3>;
    };

    const defaultRenderContent = (block: MemoryBlock): ReactNode => (
        <div ref={contentRef}>{block.text}</div>
    );

    // Use provided functions or defaults
    const finalGetConfidencePercentage = getConfidencePercentage || getBlockConfidencePercentage;
    const confidencePercentage = finalGetConfidencePercentage(block);
    const links = transformLinks ? transformLinks(block) : defaultTransformLinks();

    // Handle text selection for comments
    React.useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || !contentRef.current) {
                setCommentPosition(null);
                return;
            }

            // Check if the selection is within our content div
            let node = selection.anchorNode;
            while (node && node !== contentRef.current) {
                node = node.parentNode;
            }
            if (!node) {
                setCommentPosition(null);
                return;
            }

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setCommentPosition({
                x: rect.left + (rect.width / 2),
                y: rect.top - 20
            });
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    // Handle feedback actions
    const handleFeedback = (type: 'positive' | 'negative') => {
        if (type === 'positive') {
            onPositiveFeedback();
        } else {
            onNegativeFeedback();
        }

        toast({
            title: type === 'positive' ? "Thank you for your positive feedback!" : "We appreciate your input",
            description: "Your feedback helps improve the quality of our knowledge base.",
            duration: 3000,
        });
    };

    // Handle comment submission
    const submitComment = () => {
        if (commentText.trim()) {
            toast({
                title: "Comment Submitted",
                description: "Thank you for helping improve this content.",
                duration: 3000,
            });
            setCommentText('');
        }
        setIsCommentDialogOpen(false);
        setCommentPosition(null);
        window.getSelection()?.removeAllRanges();
    };

    return (
        <div id={block.id} className="content-block animate-fade-in">
            {/* Block Header */}
            <div className="flex items-start justify-between mb-2">
                {titleSlot || renderTitle?.(block) || defaultRenderTitle(block)}
                {headerRightSlot || <ConfidenceStatus percentage={confidencePercentage} />}
            </div>

            {/* Progress Bar */}
            <Progress value={confidencePercentage} className="h-1 mb-3" />

            {/* Block Content */}
            <div className="prose prose-sm max-w-none">
                {contentSlot || renderContent?.(block) || defaultRenderContent(block)}

                {/* Related Links */}
                {renderLinks ? renderLinks(links) : <RelatedLinks links={links} />}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 border-t border-border pt-3">
                {actionsSlot ||
                    <ActionButtons
                        onPositiveFeedback={() => handleFeedback('positive')}
                        onNegativeFeedback={() => handleFeedback('negative')}
                        onViewGraph={onViewGraph}
                    />
                }
            </div>

            {/* Commenting UI */}
            <FloatingCommentButton
                position={commentPosition}
                onComment={() => setIsCommentDialogOpen(true)}
            />

            <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Comment</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <Textarea
                            placeholder="Write your comment here..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="flex justify-end mt-4">
                            <Button onClick={submitComment} disabled={!commentText.trim()}>
                                Submit Comment
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BaseBlockRenderer; 