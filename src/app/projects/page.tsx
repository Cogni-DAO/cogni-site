import React from 'react';
import ProjectsView from '@/components/projects/ProjectsView';

export const metadata = {
    title: 'Projects | Cogni',
    description: 'View and manage all projects',
};

export default function ProjectsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex items-baseline justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground">
                    Manage and track all projects in one place
                </p>
            </div>

            <ProjectsView />
        </div>
    );
} 