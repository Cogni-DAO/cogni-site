import useSWR from 'swr';
import type { BranchesResponse } from '@/data/models/branchesResponse';

/**
 * Fetches branches from the API
 * @param bustCache - Whether to bypass cache (for refresh operations)
 */
async function fetchBranches(bustCache = false): Promise<BranchesResponse> {
    const url = bustCache
        ? `/api/v1/branches?_t=${Date.now()}`
        : '/api/v1/branches';

    const headers = bustCache
        ? { 'Cache-Control': 'no-cache' }
        : {};

    const response = await fetch(url, { headers });

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

    // Custom mutate function that bypasses cache
    const refreshBranches = () => mutate(() => fetchBranches(true));

    return {
        branches: data,
        isLoading,
        isError: error,
        mutate: refreshBranches
    };
} 