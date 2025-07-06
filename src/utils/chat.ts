import type { CompleteQueryRequest, HistoryMessage } from '@/schemas/generated/completequeryrequest';

// For validation, we can import from the OpenAPI types as a fallback
import type { components } from '@/types/api';

// Re-export the proper type for consistency
export type ChatRequest = CompleteQueryRequest;

// // Ajv schema validation - can be enabled when needed
// import Ajv from 'ajv';
// import completequerySchema from '@/schemas/generated/completequeryrequest.schema.json';
// const ajv = new Ajv();
// const validateCompleteQueryRequest = ajv.compile(completequerySchema);

export function createChatRequest(
    message: string,
    opts?: {
        model?: string;
        temperature?: number;
        system_message?: string | null;
        message_history?: HistoryMessage[] | null;
    }
): ChatRequest {
    // Build the request with proper defaults matching the schema
    const request: ChatRequest = {
        message,
        model: opts?.model || "gpt-3.5-turbo",
        temperature: opts?.temperature !== undefined ? opts.temperature : 0.7,
        system_message: opts?.system_message !== undefined ? opts.system_message : "You are a helpful AI assistant.",
        message_history: opts?.message_history || null,
    };

    // Optional validation
    // if (!validateCompleteQueryRequest(request)) {
    //   throw new Error(`ChatRequest validation failed: ${JSON.stringify(validateCompleteQueryRequest.errors)}`);
    // }

    return request;
} 