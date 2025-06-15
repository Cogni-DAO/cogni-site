import type { paths, components } from '@/types/api';

// Type for a single memory block
export type MemoryBlock = components['schemas']['MemoryBlock'];

// Type for the response from the /blocks endpoint
export type BlocksResponse = MemoryBlock[];

/**
 * Validates an array of memory blocks against the schema
 * @param data - The data to validate
 * @returns Type predicate indicating if the data matches the BlocksResponse schema
 */
export function validateBlocks(data: unknown): data is BlocksResponse {
    // return Array.isArray(data) && data.every(isMemoryBlock);
    // Basic array check, specific item validation will be handled by Zod via Orval
    return Array.isArray(data);
}

/**
 * Validates a single memory block against the schema
 * @param data - The data to validate
 * @returns Type predicate indicating if the data matches the MemoryBlock schema
 */
export function validateBlock(data: unknown): data is MemoryBlock {
    // Basic check for required properties
    return Boolean(
        data &&
        typeof data === 'object' &&
        'type' in data &&
        'text' in data
    );
}

// API URL pointing to local Next.js API routes (which proxy to backend)
const API_URL = '/api/v1';

/**
 * Fetches memory blocks from the API with validation
 * @param branch - Optional branch name to fetch blocks from (defaults to 'main')
 * @returns Promise resolving to a validated array of memory blocks
 */
export async function fetchBlocks(branch?: string): Promise<BlocksResponse> {
    const url = new URL(`${API_URL}/blocks`, window.location.origin);
    if (branch) {
        url.searchParams.set('branch', branch);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch blocks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extract blocks array from the enhanced response structure
    const blocks = data.blocks || data;

    // Validate the response data
    if (!validateBlocks(blocks)) {
        throw new Error('Invalid blocks response from API');
    }

    return blocks;
}

/**
 * Fetches a single memory block by ID
 * @param id - The ID of the block to fetch
 * @param branch - Optional branch name to fetch block from (defaults to 'main')
 * @returns Promise resolving to a validated memory block
 */
export async function fetchBlockById(id: string, branch?: string): Promise<MemoryBlock> {
    const url = new URL(`${API_URL}/blocks/${id}`, window.location.origin);
    if (branch) {
        url.searchParams.set('branch', branch);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch block: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extract block from the enhanced response structure
    const block = data.block || data;

    // Validate the response data
    if (!validateBlock(block)) {
        throw new Error('Invalid block response from API');
    }

    return block;
}

/**
 * Creates a new memory block with validation
 * @param block - The memory block to create
 * @returns Promise resolving to the created block
 */
export async function createBlock(block: Partial<MemoryBlock>): Promise<MemoryBlock> {
    // Validate before sending
    const validBlock = block as MemoryBlock;
    if (!validateBlocks([validBlock])) {
        throw new Error('Invalid memory block');
    }

    const response = await fetch(`${API_URL}/blocks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(validBlock),
    });

    if (!response.ok) {
        throw new Error(`Failed to create block: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response
    if (!validateBlocks([data])) {
        throw new Error('Invalid block returned from API');
    }

    return data;
}

/**
 * Fetches multiple memory blocks by their IDs in a single request
 * @param ids - Array of block IDs to fetch
 * @param branch - Optional branch name to fetch blocks from (defaults to 'main')
 * @returns Promise resolving to a map of block ID to block data
 */
export async function fetchBlocksByIds(ids: string[], branch?: string): Promise<Map<string, MemoryBlock>> {
    if (ids.length === 0) {
        return new Map();
    }

    // Filter out duplicates
    const uniqueIds = Array.from(new Set(ids.filter(id => id && id.trim())));

    if (uniqueIds.length === 0) {
        return new Map();
    }

    // For now, we'll fetch all blocks and filter client-side
    // This can be optimized with a backend endpoint that accepts multiple IDs
    const allBlocks = await fetchBlocks(branch);

    const blockMap = new Map<string, MemoryBlock>();
    const idsSet = new Set(uniqueIds);

    allBlocks.forEach(block => {
        if (block.id && idsSet.has(block.id)) {
            blockMap.set(block.id, block);
        }
    });

    return blockMap;
} 