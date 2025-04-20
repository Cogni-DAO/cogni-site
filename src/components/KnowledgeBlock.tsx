
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, Network } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBlockProps {
  id: string;
  title: string;
  content: string;
  links: { title: string; slug: string }[];
  verificationPercentage: number;
}

interface FloatingCommentButtonProps {
  onComment: () => void;
  position: { x: number; y: number } | null;
}

const FloatingCommentButton: React.FC<FloatingCommentButtonProps> = ({ onComment, position }) => {
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

const KnowledgeBlock: React.FC<KnowledgeBlockProps> = ({
  id,
  title,
  content,
  links,
  verificationPercentage
}) => {
  const [commentPosition, setCommentPosition] = useState<{ x: number; y: number } | null>(null);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleFeedback = (type: 'positive' | 'negative') => {
    toast({
      title: type === 'positive' ? "Thank you for your positive feedback!" : "We appreciate your input",
      description: "Your feedback helps improve the quality of our knowledge base.",
      duration: 3000,
    });
  };

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

  const viewGraphView = () => {
    navigate(`/graph/${window.location.pathname.split('/').pop()}?blockId=${id}`);
  };

  return (
    <div id={id} className="content-block animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-serif font-semibold">{title}</h3>
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-muted-foreground">Human Verified:</span>
          <span className="font-medium">{verificationPercentage}%</span>
        </div>
      </div>
      
      <Progress value={verificationPercentage} className="h-1 mb-3" />
      
      <div className="prose prose-sm max-w-none">
        <div ref={contentRef}>{content}</div>
        
        {links.length > 0 && (
          <div className="mt-3">
            <span className="text-sm font-medium">Related Nodes:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {links.map((link) => (
                <Link 
                  key={link.slug}
                  to={`/node/${link.slug}`}
                  className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-knowledge hover:text-white transition-colors duration-200"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => handleFeedback('positive')}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Helpful
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => handleFeedback('negative')}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              Needs Work
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={viewGraphView}
          >
            <Network className="h-3 w-3 mr-1" />
            View Graph
          </Button>
        </div>
      </div>

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

export default KnowledgeBlock;
