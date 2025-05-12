import { getValidator } from '@/lib/ajv';
import type { paths, components } from '@/types/api';

// Type for a single memory block
export type MemoryBlock = components['schemas']['MemoryBlock'];

// Type for GET /api/blocks response (array of memory blocks)
export type BlocksResponse = paths['/api/blocks']['get']['responses']['200']['content']['application/json'];

// Validator for a single memory block
const isMemoryBlock = getValidator<MemoryBlock>('#/components/schemas/MemoryBlock');

/**
 * Validates an array of memory blocks against the schema
 * @param data - The data to validate
 * @returns Type predicate indicating if the data matches the BlocksResponse schema
 */
export function validateBlocks(data: unknown): data is BlocksResponse {
    return Array.isArray(data) && data.every(isMemoryBlock);
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
 * Creates a new memory block with validation
 * @param block - The memory block to create
 * @returns Promise resolving to the created block
 */
export async function createBlock(block: Partial<MemoryBlock>): Promise<MemoryBlock> {
    // Validate before sending
    const validBlock = block as MemoryBlock;
    if (!isMemoryBlock(validBlock)) {
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
    if (!isMemoryBlock(data)) {
        throw new Error('Invalid block returned from API');
    }

    return data;
} 