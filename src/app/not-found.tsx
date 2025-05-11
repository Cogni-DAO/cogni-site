'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    useEffect(() => {
        console.error(
            "404 Error: Custom 'not-found.tsx' (App Router) rendered. User attempted to access a non-existent route."
        );
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <div className="text-center animate-fade-in p-8 rounded-lg border border-border">
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--brain-purple))] via-[hsl(var(--accent))] to-[hsl(var(--brain-cyan))] bg-clip-text text-transparent">
                    404
                </h1>
                <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
                <Button asChild variant="ghost">
                    <Link href="/">
                        Return to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
} 