import useSWR from 'swr';
import { fetchNamespaces, type NamespacesResponse } from '@/utils/namespaces';

/**
 * Hook for fetching available namespaces
 */
export function useNamespaces() {
    const { data, error, isLoading, mutate } = useSWR('namespaces', fetchNamespaces);

    return {
        namespacesResponse: data as NamespacesResponse | undefined,
        namespaces: data?.namespaces || [],
        isLoading,
        isError: error,
        mutate
    };
} 