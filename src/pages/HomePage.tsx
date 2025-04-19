
import React from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedKnowledgeNodes } from '@/data/knowledgeNodes';
import KnowledgeRelatedNodes from '@/components/KnowledgeRelatedNodes';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, BookOpen, Users, Star } from 'lucide-react';

const HomePage = () => {
  const featuredNodes = getFeaturedKnowledgeNodes(6);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="py-10 md:py-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 bg-gradient-to-r from-knowledge-dark via-knowledge to-knowledge-light bg-clip-text text-transparent">
          Fractal Knowledge Nexus
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Explore recursively structured knowledge with human verification and interconnected concepts.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <div className="relative w-full">
            <Input 
              placeholder="Search for a concept..." 
              className="pr-10 w-full"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button className="w-full md:w-auto" size="lg">
            <BookOpen className="mr-2 h-4 w-4" />
            Start Exploring
          </Button>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-border my-12">
        <div className="text-center">
          <div className="bg-secondary h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-6 w-6 text-knowledge" />
          </div>
          <h3 className="text-lg font-medium mb-2">Structured Knowledge</h3>
          <p className="text-muted-foreground">
            Explore complex topics broken down into intuitive, interconnected blocks of information.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-secondary h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-knowledge" />
          </div>
          <h3 className="text-lg font-medium mb-2">Community Verified</h3>
          <p className="text-muted-foreground">
            Content is progressively refined through expert and community verification processes.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-secondary h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6 text-knowledge" />
          </div>
          <h3 className="text-lg font-medium mb-2">Provide Feedback</h3>
          <p className="text-muted-foreground">
            Contribute to knowledge quality by providing feedback on specific content blocks.
          </p>
        </div>
      </div>
      
      {/* Featured Knowledge Nodes */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold">Featured Knowledge Nodes</h2>
          <Link to="/explore" className="text-knowledge flex items-center hover:text-knowledge-dark">
            View all nodes
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <KnowledgeRelatedNodes nodes={featuredNodes} />
      </div>
      
      {/* CTA Section */}
      <div className="bg-secondary/60 rounded-xl p-8 text-center mb-12">
        <h2 className="text-2xl font-serif font-bold mb-4">Ready to Contribute?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Join our community of knowledge contributors and help refine, expand, and verify the fractal knowledge base.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline">Learn More</Button>
          <Button>Start Contributing</Button>
        </div>
      </div>
    </div>
  );
};

// Import Input separately to avoid JSX issues with other components
import { Input } from '@/components/ui/input';

export default HomePage;
