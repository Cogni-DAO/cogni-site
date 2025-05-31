'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    ArrowLeft,
    Network,
    GitBranch,
    AlertCircle,
    Users,
    FileText,
    Bug,
    Target,
    Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlockLinks } from '@/hooks/useBlockLinks';
import type { BlockLink } from '@/data/models/blockLink';
import type { BlockLinkRelation } from '@/data/models/blockLinkRelation';

interface BlockLinksViewProps {
    blockId: string;
    /** Whether to show both inbound and outbound links or just one direction */
    direction?: 'both' | 'from' | 'to';
    /** Specific relation types to filter by */
    relationFilter?: BlockLinkRelation[];
    /** Whether to show a compact view */
    compact?: boolean;
    /** Maximum number of links to show before collapsing */
    maxVisible?: number;
}

interface LinkWithMetadata extends BlockLink {
    direction: 'from' | 'to';
}

// Utility functions for relation type handling
const getRelationIcon = (relation: BlockLinkRelation) => {
    switch (relation) {
        case 'depends_on':
        case 'blocks':
        case 'is_blocked_by':
            return <AlertCircle className="h-4 w-4" />;
        case 'child_of':
        case 'parent_of':
            return <GitBranch className="h-4 w-4" />;
        case 'subtask_of':
            return <Layers className="h-4 w-4" />;
        case 'belongs_to_epic':
        case 'epic_contains':
            return <Target className="h-4 w-4" />;
        case 'bug_affects':
        case 'has_bug':
            return <Bug className="h-4 w-4" />;
        case 'owned_by':
        case 'owns':
            return <Users className="h-4 w-4" />;
        case 'related_to':
        case 'references':
            return <Network className="h-4 w-4" />;
        default:
            return <FileText className="h-4 w-4" />;
    }
};

const getRelationColor = (relation: BlockLinkRelation) => {
    switch (relation) {
        case 'depends_on':
        case 'blocks':
        case 'is_blocked_by':
            return 'bg-red-100 text-red-800 hover:bg-red-200';
        case 'child_of':
        case 'parent_of':
            return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        case 'subtask_of':
            return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
        case 'belongs_to_epic':
        case 'epic_contains':
            return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'bug_affects':
        case 'has_bug':
            return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
        case 'owned_by':
        case 'owns':
            return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
};

const formatRelationLabel = (relation: BlockLinkRelation, direction: 'from' | 'to') => {
    // Format relations with proper directionality
    const relationMap: Record<BlockLinkRelation, { from: string; to: string }> = {
        'depends_on': { from: 'Depends on', to: 'Required by' },
        'blocks': { from: 'Blocks', to: 'Blocked by' },
        'is_blocked_by': { from: 'Blocked by', to: 'Blocks' },
        'child_of': { from: 'Child of', to: 'Parent of' },
        'parent_of': { from: 'Parent of', to: 'Child of' },
        'subtask_of': { from: 'Subtask of', to: 'Has subtask' },
        'belongs_to_epic': { from: 'Belongs to epic', to: 'Contains task' },
        'epic_contains': { from: 'Contains', to: 'Part of epic' },
        'bug_affects': { from: 'Bug affects', to: 'Affected by bug' },
        'has_bug': { from: 'Has bug', to: 'Bug in' },
        'owned_by': { from: 'Owned by', to: 'Owns' },
        'owns': { from: 'Owns', to: 'Owned by' },
        'related_to': { from: 'Related to', to: 'Related to' },
        'mentions': { from: 'Mentions', to: 'Mentioned in' },
        'references': { from: 'References', to: 'Referenced by' },
        'duplicate_of': { from: 'Duplicate of', to: 'Has duplicate' },
        'part_of': { from: 'Part of', to: 'Contains part' },
        'contains': { from: 'Contains', to: 'Part of' },
        'requires': { from: 'Requires', to: 'Required by' },
        'provides': { from: 'Provides', to: 'Provided by' },
        'derived_from': { from: 'Derived from', to: 'Source of' },
        'supersedes': { from: 'Supersedes', to: 'Superseded by' },
        'source_of': { from: 'Source of', to: 'Derived from' },
        'cited_by': { from: 'Cited by', to: 'Cites' },
    };

    return relationMap[relation]?.[direction] || relation.replace(/_/g, ' ');
};

export function BlockLinksView({
    blockId,
    direction = 'both',
    relationFilter,
    compact = false,
    maxVisible = 10
}: BlockLinksViewProps) {
    const { linksFrom, linksTo, isLoading, isError } = useBlockLinks(blockId, {
        from: relationFilter ? { relation: relationFilter[0] } : undefined,
        to: relationFilter ? { relation: relationFilter[0] } : undefined,
    });

    // Combine and process links
    const processedLinks = useMemo(() => {
        const allLinks: LinkWithMetadata[] = [];

        if (direction === 'both' || direction === 'from') {
            if (linksFrom) {
                allLinks.push(...linksFrom.map(link => ({ ...link, direction: 'from' as const })));
            }
        }

        if (direction === 'both' || direction === 'to') {
            if (linksTo) {
                allLinks.push(...linksTo.map(link => ({ ...link, direction: 'to' as const })));
            }
        }

        // Filter by relation types if specified
        const filteredLinks = relationFilter && relationFilter.length > 0
            ? allLinks.filter(link => relationFilter.includes(link.relation))
            : allLinks;

        // Group by relation type for better organization
        const groupedLinks = filteredLinks.reduce((acc, link) => {
            const key = `${link.relation}-${link.direction}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(link);
            return acc;
        }, {} as Record<string, LinkWithMetadata[]>);

        return { allLinks: filteredLinks, groupedLinks };
    }, [linksFrom, linksTo, direction, relationFilter]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 text-center text-sm text-muted-foreground">
                Error loading block links
            </div>
        );
    }

    if (processedLinks.allLinks.length === 0) {
        return (
            <div className="p-4 text-center text-sm text-muted-foreground">
                No links found
            </div>
        );
    }

    if (compact) {
        return (
            <div className="space-y-2">
                {processedLinks.allLinks.slice(0, maxVisible).map((link, index) => (
                    <div key={`${link.to_id}-${link.direction}-${index}`} className="flex items-center gap-2">
                        {link.direction === 'from' ? (
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        ) : (
                            <ArrowLeft className="h-3 w-3 text-muted-foreground" />
                        )}
                        <Badge
                            variant="secondary"
                            className={`text-xs ${getRelationColor(link.relation)}`}
                        >
                            {formatRelationLabel(link.relation, link.direction)}
                        </Badge>
                        <Link
                            href={`/blocks/${link.to_id}`}
                            className="text-sm hover:underline truncate"
                        >
                            {link.to_id}
                        </Link>
                    </div>
                ))}
                {processedLinks.allLinks.length > maxVisible && (
                    <div className="text-xs text-muted-foreground">
                        +{processedLinks.allLinks.length - maxVisible} more links
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Object.entries(processedLinks.groupedLinks).map(([groupKey, links]) => {
                const firstLink = links[0];
                const relationLabel = formatRelationLabel(firstLink.relation, firstLink.direction);

                return (
                    <Card key={groupKey}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                {getRelationIcon(firstLink.relation)}
                                {relationLabel}
                                <Badge variant="outline" className="ml-auto">
                                    {links.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-2">
                                {links.map((link, index) => (
                                    <div key={`${link.to_id}-${index}`} className="flex items-center justify-between">
                                        <Link
                                            href={`/blocks/${link.to_id}`}
                                            className="text-sm hover:underline flex-1 truncate"
                                        >
                                            {link.to_id}
                                        </Link>
                                        <div className="flex items-center gap-2 ml-2">
                                            {link.priority && link.priority > 0 && (
                                                <Badge variant="outline" className="text-xs">
                                                    P{link.priority}
                                                </Badge>
                                            )}
                                            {link.direction === 'from' ? (
                                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                            ) : (
                                                <ArrowLeft className="h-3 w-3 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
} 