import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

// Define the expected structure for an entry in the schema index
interface BlockSchemaInfo {
    type: string;
    version: number; // Or string if versions are like "1.0"
    url?: string; // Optional URL from the schema index itself
    latest_url?: string; // Optional latest URL
    // Potentially add other metadata if needed later
}

// --- Helper function copied from scripts/gen-openapi.ts ---
// Function to fetch data using native http/https
function fetchData(url: string): Promise<string> {
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
// --- End helper function ---

// Define the input schema index file path
const schemaIndexPath = path.resolve(process.cwd(), 'schemas', 'index.json');

// Define the fallback fetch URL (allow override via environment variable)
const schemaIndexFetchUrl = process.env.SCHEMA_INDEX_URL || 'http://localhost:8000/schemas/index.json';

// Define the output directory for renderer components
const renderersDir = path.resolve(process.cwd(), 'components', 'block_renderers');

// Define the template for the generated renderer component
const rendererTemplate = (type: string, version: number | string) => `
import React from 'react';

// TODO: Define the actual props based on the block schema
interface ${type}V${version}Props { 
  data: any; // Replace 'any' with the specific block data type
}

const ${type}V${version}Renderer: React.FC<${type}V${version}Props> = (props) => {
  console.log('Rendering ${type} v${version} with props:', props);
  
  // Basic placeholder renderer - replace with actual implementation
  return (
    <div className="block-renderer placeholder">
      <h3>${type} Block (v${version})</h3>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
      <p><i>(Auto-generated stub - implement me!)</i></p>
    </div>
  );
};

export default ${type}V${version}Renderer;
`;

async function generateRenderers() {
    console.log(`Starting renderer generation...`);

    let schemaIndex: BlockSchemaInfo[];
    let schemaSource: string;

    try {
        // Check if schema index file exists locally
        if (fs.existsSync(schemaIndexPath)) {
            console.log(`Reading schema index from local file: ${schemaIndexPath}`);
            const fileContent = await fs.promises.readFile(schemaIndexPath, 'utf-8');
            const fileData = JSON.parse(fileContent);
            if (fileData && Array.isArray(fileData.schemas)) {
                schemaIndex = fileData.schemas;
            } else {
                console.warn(`⚠️ Local schema file does not contain a 'schemas' array. Assuming no schemas.`);
                schemaIndex = [];
            }
            schemaSource = 'local file';
            console.log(`Successfully read schema index from local file.`);
        } else {
            console.log(`Local schema index not found at ${schemaIndexPath}.`);
            console.log(`Attempting to fetch schema index from: ${schemaIndexFetchUrl}`);
            try {
                // Use the new fetchData helper
                const fetchedContent = await fetchData(schemaIndexFetchUrl);
                const responseData = JSON.parse(fetchedContent);

                if (responseData && Array.isArray(responseData.schemas)) {
                    schemaIndex = responseData.schemas;
                } else {
                    console.warn(`⚠️ Fetched data does not contain a 'schemas' array. Assuming no schemas.`);
                    schemaIndex = [];
                }
                schemaSource = 'fetched URL';
                console.log(`Successfully fetched and parsed schema index from URL.`);

            } catch (fetchError) {
                console.error(`❌ Failed to fetch schema index from ${schemaIndexFetchUrl}:`, fetchError);
                console.warn(`⚠️ Proceeding without schema index. No renderers will be generated.`);
                schemaIndex = []; // Ensure schemaIndex is an empty array if fetch fails
                schemaSource = 'fetch failed';
            }
        }

        // Ensure the output directory exists
        if (!fs.existsSync(renderersDir)) {
            console.log(`Creating renderers directory: ${renderersDir}`);
            await fs.promises.mkdir(renderersDir, { recursive: true });
        } else {
            console.log(`Renderers directory already exists: ${renderersDir}`);
        }

        // Generate renderer stubs
        let generatedCount = 0;
        for (const schemaInfo of schemaIndex) {
            const { type, version } = schemaInfo;
            // Sanitize type name for component/file naming (e.g., remove spaces, special chars)
            // Basic example: Capitalize first letter, ensure alphanumeric
            const componentType = type.charAt(0).toUpperCase() + type.slice(1).replace(/[^a-zA-Z0-9]/g, '');
            const fileName = `${componentType}.v${version}.tsx`;
            const filePath = path.join(renderersDir, fileName);

            // Check if the file already exists
            if (!fs.existsSync(filePath)) {
                console.log(`Generating stub for ${type} v${version} -> ${fileName}`);
                const componentContent = rendererTemplate(componentType, version);
                await fs.promises.writeFile(filePath, componentContent, 'utf-8');
                generatedCount++;
            } else {
                // console.log(`Skipping existing file: ${fileName}`);
            }
        }

        if (generatedCount > 0) {
            console.log(`✅ Successfully generated ${generatedCount} new renderer stubs in ${renderersDir} (source: ${schemaSource})`);
        } else if (schemaIndex.length > 0) {
            console.log(`✅ All renderer stubs already exist for schemas found (source: ${schemaSource}).`);
        } else if (schemaSource !== 'fetch failed') {
            console.log(`✅ No schemas found (source: ${schemaSource}). No renderers generated.`);
        }

    } catch (error) {
        console.error(`❌ Error generating renderers:`, error);
        process.exit(1); // Exit with error code
    }
}

generateRenderers(); 