import Ajv, { ValidateFunction } from 'ajv';
import openapi from '@/../schemas/openapi.json';          // the single file you fetch+commit
type OpenAPISpec = typeof openapi;                        // JSON typed by TS

// ➊  Build Ajv and register every component schema in the spec
const ajv = new Ajv({
    allErrors: true,
    // Add basic formats natively since we can't use ajv-formats yet
    formats: {
        'date-time': true,
        'uri': true,
        'email': true
    }
});

Object.entries((openapi as OpenAPISpec).components.schemas).forEach(
    ([name, schema]) => ajv.addSchema(schema as object, `#/components/schemas/${name}`)
);

// ➋  A per‑schema validator cache
const compiled: Record<string, ValidateFunction> = {};

export function getValidator<T>(
    ref: `#/components/schemas/${string}`
): (data: unknown) => data is T {
    if (!compiled[ref]) compiled[ref] = ajv.getSchema(ref)!;
    return compiled[ref] as (d: unknown) => d is T;
} 