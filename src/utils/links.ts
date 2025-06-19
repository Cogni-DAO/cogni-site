import type { BlockLink } from '@/data/models/blockLink';
import type { PaginatedLinksResponse } from '@/data/models/paginatedLinksResponse';

// Type for the response from the /links endpoint
export type LinksResponse = PaginatedLinksResponse;

/**
 * Validates a paginated links response against the schema
 * @param data - The data to validate
 * @returns Type predicate indicating if the data matches the PaginatedLinksResponse schema
 */
export function validateLinks(data: unknown): data is PaginatedLinksResponse {
    return Boolean(
        data &&
        typeof data === 'object' &&
        'links' in data &&
        Array.isArray((data as Record<string, unknown>).links) &&
        'page_size' in data &&
        typeof (data as Record<string, unknown>).page_size === 'number'
    );
}

/**
 * Validates a single block link against the schema
 * @param data - The data to validate
 * @returns Type predicate indicating if the data matches the BlockLink schema
 */
export function validateLink(data: unknown): data is BlockLink {
    // Basic check for required properties
    return Boolean(
        data &&
        typeof data === 'object' &&
        'from_id' in data &&
        'to_id' in data &&
        'relation' in data
    );
}

// API URL pointing to local Next.js API routes (which proxy to backend)
const API_URL = '/api/v1';

/**
 * Fetches all block links from the API with validation
 * @param branch - Optional branch name to fetch links from (defaults to 'main')
 * @param namespace - Optional namespace to filter links (defaults to 'legacy')
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for number of results
 * @returns Promise resolving to a validated paginated links response
 */
export async function fetchLinks(
    branch?: string,
    namespace?: string,
    cursor?: string,
    limit?: number
): Promise<LinksResponse> {
    const url = new URL(`${API_URL}/links`, window.location.origin);
    if (branch) {
        url.searchParams.set('branch', branch);
    }
    if (namespace) {
        url.searchParams.set('namespace', namespace);
    }
    if (cursor) {
        url.searchParams.set('cursor', cursor);
    }
    if (limit !== undefined) {
        url.searchParams.set('limit', limit.toString());
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch links: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response data
    if (!validateLinks(data)) {
        throw new Error('Invalid links response from API');
    }

    return data;
}

/**
 * Fetches links from a specific block
 * @param blockId - The ID of the block to fetch links from
 * @param branch - Optional branch name to fetch links from (defaults to 'main')
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for number of results
 * @returns Promise resolving to a validated paginated links response
 */
export async function fetchLinksFrom(
    blockId: string,
    branch?: string,
    cursor?: string,
    limit?: number
): Promise<LinksResponse> {
    const url = new URL(`${API_URL}/links/from/${blockId}`, window.location.origin);
    if (branch) {
        url.searchParams.set('branch', branch);
    }
    if (cursor) {
        url.searchParams.set('cursor', cursor);
    }
    if (limit !== undefined) {
        url.searchParams.set('limit', limit.toString());
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch links from block: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response data
    if (!validateLinks(data)) {
        throw new Error('Invalid links response from API');
    }

    return data;
}

/**
 * Fetches links to a specific block
 * @param blockId - The ID of the block to fetch links to
 * @param branch - Optional branch name to fetch links from (defaults to 'main')
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for number of results
 * @returns Promise resolving to a validated paginated links response
 */
export async function fetchLinksTo(
    blockId: string,
    branch?: string,
    cursor?: string,
    limit?: number
): Promise<LinksResponse> {
    const url = new URL(`${API_URL}/links/to/${blockId}`, window.location.origin);
    if (branch) {
        url.searchParams.set('branch', branch);
    }
    if (cursor) {
        url.searchParams.set('cursor', cursor);
    }
    if (limit !== undefined) {
        url.searchParams.set('limit', limit.toString());
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch links to block: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response data
    if (!validateLinks(data)) {
        throw new Error('Invalid links response from API');
    }

    return data;
} 