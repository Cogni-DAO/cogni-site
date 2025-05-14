'use client';

import React from 'react';
import Link from 'next/link';
import {
    Calendar,
    Check,
    Clock,
    ExternalLink,
    MoreHorizontal,
    User
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { narrowMetadata } from '@/data/block_metadata';
import { MemoryBlockType } from '@/data/models/memoryBlockType';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import type { ProjectMetadata } from '@/data/block_metadata/project';

interface ProjectsTableProps {
    projects: MemoryBlock[];
}

// Status badge colors with improved contrast
const statusColors: Record<string, string> = {
    backlog: 'bg-slate-300 text-slate-900',
    ready: 'bg-blue-200 text-blue-900',
    in_progress: 'bg-yellow-200 text-yellow-900',
    review: 'bg-purple-200 text-purple-900',
    merged: 'bg-indigo-200 text-indigo-900',
    validated: 'bg-teal-200 text-teal-900',
    released: 'bg-green-200 text-green-900',
    done: 'bg-green-200 text-green-900',
    archived: 'bg-gray-300 text-gray-900',
};

// Get appropriate status color class
const getStatusClass = (status: string | undefined) => {
    if (!status) return 'bg-gray-300 text-gray-900';
    return statusColors[status] || 'bg-gray-300 text-gray-900';
};

// Format date for display
const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch (e) {
        return '—';
    }
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
    React.useEffect(() => {
        console.log('ProjectsTable received projects:', projects);
    }, [projects]);

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Project</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No projects found
                            </TableCell>
                        </TableRow>
                    ) : (
                        projects.map((project) => {
                            const meta = narrowMetadata(MemoryBlockType.project, project.metadata) as ProjectMetadata | null;
                            console.log(`Project ${project.id} metadata:`, meta);

                            if (!meta) {
                                console.warn(`Project ${project.id} is missing metadata`);
                                return (
                                    <TableRow key={project.id}>
                                        <TableCell colSpan={7} className="text-amber-600">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{project.id} (Missing metadata)</span>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {project.text?.substring(0, 100) || 'No description available'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            }

                            return (
                                <TableRow key={project.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <Link
                                                href={`/blocks/${project.id}`}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                {meta.name || 'Untitled Project'}
                                            </Link>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {meta.description?.substring(0, 100) || 'No description available'}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {meta.priority ? (
                                            <Badge variant={meta.priority === 'high' ? 'destructive' :
                                                meta.priority === 'medium' ? 'default' : 'outline'}>
                                                {meta.priority}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {meta.status ? (
                                            <Badge className={getStatusClass(meta.status)}>
                                                {meta.status.replace('_', ' ')}
                                            </Badge>
                                        ) : meta.completed ? (
                                            <Badge className="bg-green-200 text-green-900">Completed</Badge>
                                        ) : (
                                            <Badge className="bg-gray-200 text-gray-900">No Status</Badge>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{meta.owner || '—'}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2 w-24">
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${meta.progress_percent || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-xs">{meta.progress_percent || 0}%</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                <span>{formatDate(meta.start_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span>{formatDate(meta.target_date)}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                            >
                                                <Link href={`/blocks/${project.id}`}>
                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                    View
                                                </Link>
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Check className="h-4 w-4 mr-2" /> Mark as completed
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
} 