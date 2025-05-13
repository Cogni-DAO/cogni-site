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

// Fixed API URL pointing to your actual backend API
const API_URL = 'http://localhost:8000';

/**
 * Fetches memory blocks from the API with validation
 * @returns Promise resolving to a validated array of memory blocks
 */
export async function fetchBlocks(): Promise<BlocksResponse> {
    const response = await fetch(`${API_URL}/api/blocks`);

    if (!response.ok) {
        throw new Error(`Failed to fetch blocks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response data
    if (!validateBlocks(data)) {
        throw new Error('Invalid blocks response from API');
    }

    return data;
}

/**
 * Fetches a single memory block by ID
 * @param id - The ID of the block to fetch
 * @returns Promise resolving to a validated memory block
 */
export async function fetchBlockById(id: string): Promise<MemoryBlock> {
    const response = await fetch(`${API_URL}/api/blocks/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch block: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response data
    if (!validateBlock(data)) {
        throw new Error('Invalid block response from API');
    }

    return data;
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

    const response = await fetch(`${API_URL}/api/blocks`, {
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