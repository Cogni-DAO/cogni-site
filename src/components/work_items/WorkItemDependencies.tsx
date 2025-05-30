'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useBlockLinks } from '@/hooks/useBlockLinks';
import { LinkedWorkItem } from './LinkedWorkItem';

interface WorkItemDependenciesProps {
    blockId: string;
}

export function WorkItemDependencies({ blockId }: WorkItemDependenciesProps) {
    const [showDependencies, setShowDependencies] = useState(false);
    const [showDependents, setShowDependents] = useState(false);

    const { linksFrom, linksTo, isLoading, isError } = useBlockLinks(blockId, {
        from: { relation: 'depends_on' },
        to: { relation: 'depends_on' }
    });

    if (isLoading) {
        return (
            <div className="text-sm text-muted-foreground">
                Loading dependencies...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-sm text-red-600">
                Failed to load dependencies
            </div>
        );
    }

    const dependencies = linksFrom || [];
    const dependents = linksTo || [];

    if (dependencies.length === 0 && dependents.length === 0) {
        return (
            <div className="text-sm text-muted-foreground">
                No dependencies
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* Dependencies (what this depends on) */}
            {dependencies.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowDependencies(!showDependencies)}
                        className="flex items-center gap-2 text-sm hover:text-foreground transition-colors"
                    >
                        {showDependencies ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                        <span className="text-muted-foreground">
                            Depends on ({dependencies.length})
                        </span>
                    </button>

                    {showDependencies && (
                        <div className="ml-5 mt-1 space-y-1">
                            {dependencies.map((link, index) => (
                                <LinkedWorkItem
                                    key={`dep-${index}`}
                                    blockId={link.to_id || ''}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Dependents (what depends on this) */}
            {dependents.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowDependents(!showDependents)}
                        className="flex items-center gap-2 text-sm hover:text-foreground transition-colors"
                    >
                        {showDependents ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                        <span className="text-muted-foreground">
                            Required by ({dependents.length})
                        </span>
                    </button>

                    {showDependents && (
                        <div className="ml-5 mt-1 space-y-1">
                            {dependents.map((link, index) => (
                                <LinkedWorkItem
                                    key={`req-${index}`}
                                    blockId={link.to_id || ''}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 