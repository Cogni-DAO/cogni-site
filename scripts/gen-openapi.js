import { writeFileSync } from 'fs';
import https from 'https';
import http from 'http';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const env = process.argv[2] ?? 'dev';
const targets = {
    dev: 'http://localhost:8000/openapi.json',
    preview: 'https://api-preview.cognidao.org/openapi.json',
    prod: 'https://api.cognidao.org/openapi.json'
};

// Function to fetch data using native http/https
function fetchData(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;

        client.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch: ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Generate combined metadata file with both Zod schema and interface
function generateCombinedMetadataFile(schema, typeName) {
    // Generate properties for both Zod schema and TypeScript interface
    const requiredProps = schema.required || [];

    const zodProperties = Object.entries(schema.properties || {}).map(([propName, propSchema]) => {
        const required = requiredProps.includes(propName);
        let zodType = 'z.unknown()';

        // Handle different property types
        if (propSchema.type === 'string') {
            zodType = 'z.string()';
            if (propSchema.format === 'date-time') {
                zodType = 'z.string().datetime()';
            } else if (propSchema.enum) {
                zodType = `z.enum([${propSchema.enum.map(e => `'${e}'`).join(', ')}])`;
            }
        } else if (propSchema.type === 'number') {
            zodType = 'z.number()';
            if (propSchema.minimum !== undefined) {
                zodType = `${zodType}.min(${propSchema.minimum})`;
            }
            if (propSchema.maximum !== undefined) {
                zodType = `${zodType}.max(${propSchema.maximum})`;
            }
        } else if (propSchema.type === 'boolean') {
            zodType = 'z.boolean()';
        } else if (propSchema.type === 'array') {
            zodType = 'z.array(z.unknown())';
        } else if (propSchema.type === 'object') {
            zodType = 'z.record(z.string(), z.unknown())';
        } else if (propSchema.anyOf || propSchema.oneOf) {
            // Handle union types
            const types = (propSchema.anyOf || propSchema.oneOf).map(s => {
                if (s.type === 'null') return 'z.null()';
                if (s.type === 'string') return 'z.string()';
                if (s.type === 'number') return 'z.number()';
                if (s.type === 'boolean') return 'z.boolean()';
                return 'z.unknown()';
            }).join(', ');
            zodType = `z.union([${types}])`;
        }

        return `  ${propName}: ${zodType}${required ? '' : '.optional()'}`;
    });

    const tsProperties = Object.entries(schema.properties || {}).map(([propName, propSchema]) => {
        const required = requiredProps.includes(propName);
        let tsType = 'unknown';

        // Handle different property types
        if (propSchema.type === 'string') {
            tsType = 'string';
            if (propSchema.enum) {
                tsType = propSchema.enum.map(e => `'${e}'`).join(' | ');
            }
        } else if (propSchema.type === 'number') {
            tsType = 'number';
        } else if (propSchema.type === 'boolean') {
            tsType = 'boolean';
        } else if (propSchema.type === 'array') {
            tsType = 'unknown[]';
        } else if (propSchema.type === 'object') {
            tsType = 'Record<string, unknown>';
        } else if (propSchema.anyOf || propSchema.oneOf) {
            // Handle union types
            const types = (propSchema.anyOf || propSchema.oneOf).map(s => {
                if (s.type === 'null') return 'null';
                if (s.type === 'string') return 'string';
                if (s.type === 'number') return 'number';
                if (s.type === 'boolean') return 'boolean';
                return 'unknown';
            }).join(' | ');
            tsType = types;
        }

        return `  ${propName}${required ? '' : '?'}: ${tsType};`;
    });

    return `import { z } from 'zod';

/**
 * ${schema.description || `Metadata schema for ${typeName}`}
 */
export const ${typeName}Schema = z.object({
${zodProperties.join(',\n')}
});

/**
 * ${schema.description || `TypeScript interface for ${typeName}`}
 * Manually defined to match Zod schema exactly (no z.infer<>)
 */
export interface ${typeName} {
${tsProperties.join('\n')}
}
`;
}

// Main function to generate metadata models
async function generateMetadataModels(baseUrl) {
    console.log('🧩 Generating metadata models...');

    try {
        const outputDir = path.resolve(process.cwd(), 'src', 'data', 'block_metadata');

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            console.log(`Creating output directory: ${outputDir}`);
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Fetch schema index
        const schemaIndexUrl = `${baseUrl}/schemas/index.json`;
        console.log(`Fetching schema index from: ${schemaIndexUrl}`);

        const indexContent = await fetchData(schemaIndexUrl);
        const schemaIndex = JSON.parse(indexContent).schemas;

        if (!Array.isArray(schemaIndex)) {
            throw new Error('Schema index does not contain a schemas array');
        }

        console.log(`Found ${schemaIndex.length} schema entries`);

        // Generate type map file
        const typeMapEntries = [];

        // Process each schema in the index
        for (const schemaInfo of schemaIndex) {
            const { type, version, latest_url } = schemaInfo;

            // Skip base schema if it's not a specific block type
            if (type === 'base') continue;

            const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
            const typeName = `${capitalizedType}Metadata`;

            // Construct schema URL
            const schemaUrl = latest_url ?
                (latest_url.startsWith('http') ? latest_url : `${baseUrl}${latest_url}`) :
                `${baseUrl}/schemas/${type}/latest`;

            console.log(`Fetching schema for ${type} from: ${schemaUrl}`);

            try {
                const schemaContent = await fetchData(schemaUrl);
                const schema = JSON.parse(schemaContent);

                // Generate combined file with both Zod schema and TypeScript interface
                const combinedContent = generateCombinedMetadataFile(schema, typeName);
                const filePath = path.join(outputDir, `${type}.ts`);
                fs.writeFileSync(filePath, combinedContent, 'utf-8');
                console.log(`Generated combined schema file: ${filePath}`);

                // Add to type map
                typeMapEntries.push(`  ${type}: ${typeName};`);
            } catch (error) {
                console.error(`Failed to generate schema for ${type}:`, error);
            }
        }

        // Generate the BlockMetadataByType map
        if (typeMapEntries.length > 0) {
            const typeMapContent = `import { MemoryBlockType } from '@/data/models/memoryBlockType';
${schemaIndex
                    .filter(s => s.type !== 'base')
                    .map(s => {
                        const capitalizedType = s.type.charAt(0).toUpperCase() + s.type.slice(1);
                        return `import type { ${capitalizedType}Metadata } from './${s.type}';`;
                    })
                    .join('\n')}

/**
 * Type map to help with narrowing metadata types based on block type
 */
export interface BlockMetadataByType {
${typeMapEntries.join('\n')}
}

/**
 * Helper function to narrow metadata type based on block type
 */
export function narrowMetadata<T extends MemoryBlockType>(
  blockType: T,
  metadata: unknown
): BlockMetadataByType[T] {
  return metadata as BlockMetadataByType[T];
}
`;
            const typeMapPath = path.join(outputDir, 'index.ts');
            fs.writeFileSync(typeMapPath, typeMapContent, 'utf-8');
            console.log(`Generated BlockMetadataByType map: ${typeMapPath}`);
        }

        console.log('✅ Metadata model generation complete!');
    } catch (error) {
        console.error('Error generating metadata models:', error);
        throw error;
    }
}

// Main function to orchestrate the generation
(async () => {
    const url = targets[env];
    if (!url) throw new Error(`Unknown env ${env}`);
    const baseUrl = new URL(url).origin;

    console.log(`📥 Fetching OpenAPI from ${url}`);
    try {
        const spec = await fetchData(url);

        // Create schemas directory if it doesn't exist
        execSync('mkdir -p schemas');

        writeFileSync('schemas/openapi.json', spec);
        console.log('✅ Saved schemas/openapi.json');

        console.log('🛠 Generating TypeScript types & component schemas');
        execSync('mkdir -p src/types');
        execSync('npx openapi-typescript schemas/openapi.json -o src/types/api.d.ts --exportSchemas', {
            stdio: 'inherit'
        });

        console.log('🏗 Running Orval to generate API client');
        execSync('npm run gen:api', {
            stdio: 'inherit'
        });

        // Generate metadata models
        await generateMetadataModels(baseUrl);

        console.log('✨ All generation complete');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})(); 