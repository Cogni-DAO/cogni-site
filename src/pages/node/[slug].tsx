import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getKnowledgeNodeBySlug, getRelatedKnowledgeNodes } from '@/data/knowledgeNodes';
import KnowledgeBlock from '@/components/KnowledgeBlock';
import KnowledgeRelatedNodes from '@/components/KnowledgeRelatedNodes';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NodePage = () => {
  const router = useRouter();
  const slugFromQuery = router.query.slug;
  const slug = Array.isArray(slugFromQuery) ? slugFromQuery[0] : slugFromQuery;

  const node = slug ? getKnowledgeNodeBySlug(slug) : null;
  const relatedNodes = node ? getRelatedKnowledgeNodes(node.relatedNodes) : [];

  useEffect(() => {
    // Scroll to top when node changes
    window.scrollTo(0, 0);

    // If node not found, could redirect to 404 or home
    if (slug && !node) {
      console.error(`Node with slug "${slug}" not found`);
    }
  }, [slug, node]);

  if (!node) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Knowledge Node Not Found</h1>
        <p className="text-muted-foreground mb-6">The node you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Button onClick={() => router.push('/')}>Return to Homepage</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      {/* Node Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">{node.title}</h1>
          <div className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center">
            <span className="text-muted-foreground mr-2">Verification Status:</span>
            <span className="font-medium">{node.verificationPercentage}%</span>
          </div>
        </div>

        <Progress value={node.verificationPercentage} className="h-2 mb-4" />

        <p className="text-lg text-muted-foreground">{node.description}</p>
      </div>

      {/* Knowledge Blocks */}
      <div className="space-y-6 mb-12">
        {node.blocks.map((block) => (
          <KnowledgeBlock
            key={block.id}
            id={block.id}
            title={block.title}
            content={block.content}
            links={block.links}
            verificationPercentage={block.verificationPercentage}
          />
        ))}
      </div>

      {/* Related Nodes */}
      {relatedNodes.length > 0 && (
        <KnowledgeRelatedNodes nodes={relatedNodes} />
      )}
    </div>
  );
};

export default NodePage;
