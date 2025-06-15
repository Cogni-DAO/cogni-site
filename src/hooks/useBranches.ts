import useSWR from 'swr';
import type { BranchesResponse } from '@/data/models/branchesResponse';

/**
 * Fetches branches from the API
 */
async function fetchBranches(): Promise<BranchesResponse> {
    const response = await fetch('/api/v1/branches');

    if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Hook for fetching all available Dolt branches
 */
export function useBranches() {
    const { data, error, isLoading, mutate } = useSWR('branches', fetchBranches);

    return {
        branches: data,
        isLoading,
        isError: error,
        mutate
    };
} 