import { defineConfig } from 'orval';

export default defineConfig({
    // Config for generating Fetch client + TS types
    apiClient: {
        output: {
            mode: 'tags',                        // hooks per tag (Chat, Blocks)
            target: 'src/api',                  // Fetch client functions
            schemas: 'src/api/models',            // Output TS types/interfaces here
            client: 'fetch',
        },
        input: './schemas/openapi.json',  // Corrected path
        hooks: {
            afterAllFilesWrite: ['npm run gen:renderers']
        }
    },
    // // Separate config specifically for generating Zod schemas (REMOVED FOR SIMPLICITY)
    // apiSchemas: {
    //     output: {
    //         target: 'src/api/schemas',    // Target for Zod client processing
    //         schemas: 'src/api/schemas',   // Actual Zod schema output path
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