'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/TransparentBrainOnly.png"
            alt="Cogni Brain Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-[hsl(var(--brain-purple))] via-[hsl(var(--accent))] to-[hsl(var(--brain-cyan))] bg-clip-text text-transparent">Cogni</h1>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-md w-full relative">
          <Input
            placeholder="Search memory blocks..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>

        <nav className="flex items-center space-x-4">
          <Link href="/explore" className="text-sm font-medium hover:text-knowledge">Explore</Link>
          <Link href="/work-items" className="text-sm font-medium hover:text-knowledge">Work Items</Link>
          <Link href="/graph" className="text-sm font-medium hover:text-knowledge">Graph</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
