'use client';

import { useSearchParams } from 'next/navigation';

/**
 * Hook to get the current namespace from URL search params
 * @returns The current namespace or 'legacy' as default
 */
export function useNamespace(): string {
    const searchParams = useSearchParams();
    return searchParams.get('namespace') || 'legacy';
} 