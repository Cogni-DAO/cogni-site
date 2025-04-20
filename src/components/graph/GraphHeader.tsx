
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KnowledgeNodeDisplay } from '@/types/knowledge';

interface GraphHeaderProps {
  slug?: string;
  centerNode: KnowledgeNodeDisplay | null;
}

const GraphHeader = ({ slug, centerNode }: GraphHeaderProps) => {
  return (
    <div className="flex items-center p-4 border-b">
      <Link to={`/node/${slug}`}>
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft size={16} />
          Back to {centerNode?.title || 'Knowledge Node'}
        </Button>
      </Link>
      <h1 className="ml-4 text-xl font-serif font-bold">
        Knowledge Graph: {centerNode?.title || 'Loading...'}
      </h1>
    </div>
  );
};

export default GraphHeader;
