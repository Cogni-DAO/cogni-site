import type { components } from '@/types/api';

export type ChatRequest = components['schemas']['CompleteQueryRequest'];

// // Ajv schema ID is always `#/components/schemas/<Name>`
// const isChatRequest = getValidator<ChatRequest>('#/components/schemas/CompleteQueryRequest');

export function createChatRequest(message: string, opts?: { stream?: boolean }): ChatRequest {
    const payload: Partial<ChatRequest> = {
        message,
        // Required fields from the schema
        model: 'gpt-4o',
        temperature: 0.7,
        system_message: 'You are a helpful AI assistant.'
    };

    // Add optional fields
    if (opts?.stream !== undefined) {
        // If stream is added to schema later, this will work
        (payload as any).stream = opts.stream;
    }

    // Type assertion after we've built a valid object
    const request = payload as ChatRequest;

    // if (!isChatRequest(request)) {
    //     // Access errors from ajv instance
    //     throw new Error('ChatRequest failed validation');
    // }
    return request;
} 