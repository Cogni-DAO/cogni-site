
import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-knowledge to-knowledge-dark flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
          <h1 className="text-xl font-serif font-bold">Fractal Knowledge</h1>
        </Link>
        
        <div className="hidden md:flex items-center max-w-md w-full relative">
          <Input 
            placeholder="Search knowledge nodes..." 
            className="w-full pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <nav className="flex items-center space-x-4">
          <Link to="/explore" className="text-sm font-medium hover:text-knowledge">Explore</Link>
          <Link to="/recent" className="text-sm font-medium hover:text-knowledge">Recent</Link>
          <Link to="/contribute" className="text-sm font-medium hover:text-knowledge">Contribute</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
