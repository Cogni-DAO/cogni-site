export default {
    output: {
        mode: 'tags',                        // hooks per tag (Chat, Blocks)
        target: 'src/api',                  // generated code goes here
        schemas: 'src/api/schemas',         // zod schemas emitted here
        client: 'fetch-zod'                 // zod runtime validation!
    },
    input: './schemas/api/openapi.json',  // path committed by backend script
    hooks: {
        afterAllFilesWrite: ['npm run gen:renderers']
    }
}; 