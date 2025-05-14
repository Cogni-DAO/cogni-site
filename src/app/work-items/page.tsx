import React from 'react';
import ExecutablesView from '@/components/executables/ExecutablesView';

export const metadata = {
    title: 'Work Items | Cogni',
    description: 'View and manage all work items',
};

export default function WorkItemsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex items-baseline justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Work Items</h1>
                <p className="text-muted-foreground">
                    Manage and track all work items in one place
                </p>
            </div>

            <ExecutablesView />
        </div>
    );
} 