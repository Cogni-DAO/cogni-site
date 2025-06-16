import React from 'react';
import { useNamespaces } from '@/hooks/useNamespaces';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FolderOpen } from 'lucide-react';
import type { NamespaceInfo } from '@/utils/namespaces';

interface NamespaceSelectorProps {
    selectedNamespace?: string;
    onNamespaceChange: (namespace: string) => void;
}

export function NamespaceSelector({ selectedNamespace, onNamespaceChange }: NamespaceSelectorProps) {
    const { namespaces, isLoading, isError } = useNamespaces();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Loading namespaces...</span>
            </div>
        );
    }

    if (isError || !namespaces) {
        return (
            <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Failed to load namespaces</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            <Label htmlFor="namespace-select" className="text-sm font-medium">
                Namespace:
            </Label>
            <Select
                value={selectedNamespace || 'legacy'}
                onValueChange={onNamespaceChange}
            >
                <SelectTrigger id="namespace-select" className="w-48">
                    <SelectValue placeholder="Select namespace" />
                </SelectTrigger>
                <SelectContent>
                    {namespaces.map((namespace: NamespaceInfo) => (
                        <SelectItem key={namespace.id} value={namespace.id}>
                            <div className="flex items-center gap-2">
                                <span>{namespace.name}</span>
                                {!namespace.is_active && (
                                    <span className="text-xs text-muted-foreground">(inactive)</span>
                                )}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 