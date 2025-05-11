'use client';

import React from 'react';
import '@/index.css'; // Global styles
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import Layout from '@/components/Layout'; // Your existing Layout component

const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <QueryClientProvider client={queryClient}>
                        <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            <Layout> {/* This is your existing Layout component containing Header/Footer */}
                                {children}
                            </Layout>
                        </TooltipProvider>
                    </QueryClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
} 