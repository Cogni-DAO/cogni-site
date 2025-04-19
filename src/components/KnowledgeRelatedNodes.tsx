
import React from 'react';
import { Link } from 'react-router-dom';
import { Progress } from './ui/progress';
import { ArrowRight } from 'lucide-react';

interface RelatedNode {
  id: string;
  title: string;
  slug: string;
  description: string;
  verificationPercentage: number;
}

interface KnowledgeRelatedNodesProps {
  nodes: RelatedNode[];
}

const KnowledgeRelatedNodes: React.FC<KnowledgeRelatedNodesProps> = ({ nodes }) => {
  if (nodes.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-serif font-bold mb-4">Related Knowledge Nodes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <Link 
            key={node.id} 
            to={`/node/${node.slug}`}
            className="content-block hover:border-knowledge group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-medium group-hover:text-knowledge transition-colors duration-200">
                {node.title}
              </h3>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-muted-foreground">Verified:</span>
                <span className="font-medium">{node.verificationPercentage}%</span>
              </div>
            </div>
            
            <Progress value={node.verificationPercentage} className="h-1 mb-3" />
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {node.description}
            </p>
            
            <div className="mt-2 flex justify-end">
              <span className="text-xs text-knowledge flex items-center">
                Explore 
                <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeRelatedNodes;
