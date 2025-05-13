import { defineConfig } from 'orval';

export default defineConfig({
    // Config for generating Fetch client + TS types
    apiClient: {
        output: {
            mode: 'tags',                        // hooks per tag (Chat, Blocks)
            target: 'src/data',                  // Fetch client functions
            schemas: 'src/data/models',          // Output TS types/interfaces here
            client: 'fetch',
        },
        input: './schemas/openapi.json',  // Corrected path
    },
    // // Separate config specifically for generating Zod schemas (REMOVED FOR SIMPLICITY)
    // apiSchemas: {
    //     output: {
    //         target: 'src/data/schemas',    // Target for Zod client processing
    //         schemas: 'src/data/schemas',   // Actual Zod schema output path
    //         client: 'zod',
    //         fileExtension: '.zod.ts',   // Ensure Zod files are distinct
    //         override: {
    //             zod: {
    //                 exportConst: true,      // Export Zod schemas as consts
    //             },
    //         },
    //     },
    //     input: './schemas/openapi.json',
    // },
}); 