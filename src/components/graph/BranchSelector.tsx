import React from 'react';
import { useBranches } from '@/hooks/useBranches';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GitBranch } from 'lucide-react';

interface BranchSelectorProps {
    selectedBranch?: string;
    onBranchChange: (branch: string) => void;
}

interface BranchItem {
    name: string;
    [key: string]: unknown;
}

export function BranchSelector({ selectedBranch, onBranchChange }: BranchSelectorProps) {
    const { branches, isLoading, isError } = useBranches();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Loading branches...</span>
            </div>
        );
    }

    if (isError || !branches) {
        return (
            <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Failed to load branches</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <Label htmlFor="branch-select" className="text-sm font-medium">
                Branch:
            </Label>
            <Select
                value={selectedBranch || branches.active_branch}
                onValueChange={onBranchChange}
            >
                <SelectTrigger id="branch-select" className="w-48">
                    <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                    {branches.branches.map((branch: BranchItem) => (
                        <SelectItem key={branch.name} value={branch.name}>
                            <div className="flex items-center gap-2">
                                <span>{branch.name}</span>
                                {branch.name === branches.active_branch && (
                                    <span className="text-xs text-muted-foreground">(active)</span>
                                )}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 