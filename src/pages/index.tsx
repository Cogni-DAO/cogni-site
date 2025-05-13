// Update this page (the content is just a fallback if you fail to update the page)

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import KnowledgeRelatedNodes from '@/components/KnowledgeRelatedNodes'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Star } from 'lucide-react'
import Chat from '@/components/chat'
import { fetchBlocks } from '@/utils/blocks'
import type { MemoryBlock } from '@/data/models/memoryBlock'
import MemoryBlockListItem from '@/components/MemoryBlockListItem'

export default function Home() {
  const [featuredBlocks, setFeaturedBlocks] = useState<MemoryBlock[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedBlocks() {
      try {
        const blocks = await fetchBlocks()
        // Just take the first 6 blocks for the featured section
        setFeaturedBlocks(blocks.slice(0, 6))
      } catch (error) {
        console.error('Failed to fetch featured blocks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedBlocks()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section with Chat */}
      <div className="py-10 md:py-16 text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/TransparentBrainOnly.png"
            alt="CogniDAO Brain Logo"
            width={180}
            height={180}
            priority
          />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 pb-5 bg-gradient-to-r from-[hsl(var(--brain-purple))] via-[hsl(var(--accent))] to-[hsl(var(--brain-cyan))] bg-clip-text text-transparent">
          CogniDAO
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Empowering communities to build fairly
        </p>
        <Chat />
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
      {/* Featured Memory Blocks */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold">Featured Memory Blocks</h2>
          <Link href="/explore" className="text-knowledge flex items-center hover:text-knowledge-dark">
            View all blocks
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="content-block animate-pulse">
                <div className="h-5 bg-muted rounded w-2/3 mb-2"></div>
                <div className="h-2 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
              </div>
            ))}
          </div>
        ) : featuredBlocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlocks.map((block) => (
              <MemoryBlockListItem
                key={block.id || `block-${Math.random()}`}
                block={block}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No memory blocks available.</p>
        )}
      </div>
      {/* CTA Section */}
      <div className="bg-secondary/60 rounded-xl p-8 text-center mb-12">
        <h2 className="text-2xl font-serif font-bold mb-4">Ready to Contribute?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Join our community of knowledge contributors and help refine, expand, and verify the CogniDAO knowledge base.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline">Learn More</Button>
          <Button>Start Contributing</Button>
        </div>
      </div>
    </div>
  )
}
