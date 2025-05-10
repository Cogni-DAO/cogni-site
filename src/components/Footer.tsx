import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-border mt-12 py-8 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif font-bold mb-4">Fractal Knowledge</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              A recursively structured knowledge portal focused on creating connections between
              ideas with human-verified content quality.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-knowledge">Home</Link></li>
              <li><Link href="/explore" className="hover:text-knowledge">Explore</Link></li>
              <li><Link href="/recent" className="hover:text-knowledge">Recent Changes</Link></li>
              <li><Link href="/contribute" className="hover:text-knowledge">Contribute</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-knowledge">Our Mission</Link></li>
              <li><Link href="/guidelines" className="hover:text-knowledge">Content Guidelines</Link></li>
              <li><Link href="/verification" className="hover:text-knowledge">Verification Process</Link></li>
              <li><Link href="/contact" className="hover:text-knowledge">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-4 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Fractal Knowledge. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/terms" className="hover:text-knowledge">Terms</Link>
            <Link href="/privacy" className="hover:text-knowledge">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
