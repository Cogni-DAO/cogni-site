'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import type { MemoryBlock } from '@/data/models/memoryBlock';
import { ExecutablesRow } from './ExecutablesRow';

interface ExecutablesTableProps {
    blocks: MemoryBlock[];
}

export function ExecutablesTable({ blocks }: ExecutablesTableProps) {
    React.useEffect(() => {
        console.log('ExecutablesTable received blocks:', blocks);
    }, [blocks]);

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {blocks.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                No work items found
                            </TableCell>
                        </TableRow>
                    ) : (
                        blocks.map((block) => (
                            <ExecutablesRow key={block.id} block={block} />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
} 