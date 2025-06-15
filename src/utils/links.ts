import type { BlockLink } from '@/data/models/blockLink';

// Type for the response from the /links endpoint
export type LinksResponse = BlockLink[];

/**
 * Validates an array of block links against the schema
 * @param data - The data to validate
 * @returns Type predicate indicating if the data matches the LinksResponse schema
 */
export function validateLinks(data: unknown): data is LinksResponse {
    // Basic array check, specific item validation will be handled by Zod via Orval
    return Array.isArray(data);
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
 * @returns Promise resolving to a validated array of block links
 */
export async function fetchLinks(branch?: string): Promise<LinksResponse> {
    const url = new URL(`${API_URL}/links`, window.location.origin);
    if (branch) {
        url.searchParams.set('branch', branch);
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
 * @returns Promise resolving to a validated array of block links
 */
export async function fetchLinksFrom(blockId: string, branch?: string): Promise<LinksResponse> {
    const url = new URL(`${API_URL}/links/from/${blockId}`, window.location.origin);
    if (branch) {
        url.searchParams.set('branch', branch);
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
 * @returns Promise resolving to a validated array of block links
 */
export async function fetchLinksTo(blockId: string, branch?: string): Promise<LinksResponse> {
    const url = new URL(`${API_URL}/links/to/${blockId}`, window.location.origin);
    if (branch) {
        url.searchParams.set('branch', branch);
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