import type { components } from '@/types/api';

// Type for a single namespace
export type NamespaceInfo = components['schemas']['NamespaceInfo'];

// Type for the response from the /namespaces endpoint
export type NamespacesResponse = components['schemas']['NamespacesResponse'];

/**
 * Validates namespaces response against the schema
 * @param data - The data to validate
 * @returns Type predicate indicating if the data matches the NamespacesResponse schema
 */
export function validateNamespaces(data: unknown): data is NamespacesResponse {
    return Boolean(
        data &&
        typeof data === 'object' &&
        'namespaces' in data &&
        Array.isArray((data as NamespacesResponse).namespaces)
    );
}

// API URL pointing to local Next.js API routes (which proxy to backend)
const API_URL = '/api/v1';

/**
 * Fetches namespaces from the API with validation
 * @returns Promise resolving to a validated namespaces response
 */
export async function fetchNamespaces(): Promise<NamespacesResponse> {
    const url = new URL(`${API_URL}/namespaces`, window.location.origin);

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch namespaces: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response data
    if (!validateNamespaces(data)) {
        throw new Error('Invalid namespaces response from API');
    }

    return data;
} 