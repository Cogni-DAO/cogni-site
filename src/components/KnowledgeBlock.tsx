
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface KnowledgeBlockProps {
  id: string;
  title: string;
  content: string;
  links: { title: string; slug: string }[];
  verificationPercentage: number;
}

const KnowledgeBlock: React.FC<KnowledgeBlockProps> = ({
  id,
  title,
  content,
  links,
  verificationPercentage
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const { toast } = useToast();

  const handleFeedback = (type: 'positive' | 'negative') => {
    setShowFeedback(true);
    toast({
      title: type === 'positive' ? 'Thank you for your positive feedback!' : 'We appreciate your input',
      description: 'Your feedback helps improve the quality of our knowledge base.',
      duration: 3000,
    });
  };

  const submitTextFeedback = () => {
    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for helping improve this content.',
      duration: 3000,
    });
    setShowFeedback(false);
    setFeedbackText('');
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
        <p>{content}</p>
        
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
            onClick={() => setShowFeedback(!showFeedback)}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Add Comment
          </Button>
        </div>
        
        {showFeedback && (
          <div className="mt-3 animate-fade-in">
            <textarea
              className="w-full p-2 text-sm border rounded-md h-24"
              placeholder="Please provide specific feedback to help improve this content..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button 
                size="sm" 
                onClick={submitTextFeedback}
                disabled={!feedbackText.trim()}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBlock;
