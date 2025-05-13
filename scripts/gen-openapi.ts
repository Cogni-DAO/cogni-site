import { writeFileSync } from 'fs';
import https from 'https';
import http from 'http';
import { execSync } from 'child_process';

const env = process.argv[2] ?? 'dev';
const targets: Record<string, string> = {
    dev: 'http://localhost:8000/openapi.json',
    preview: 'https://api-preview.cognidao.org/openapi.json',
    prod: 'https://api.cognidao.org/openapi.json'
};

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

(async () => {
    const url = targets[env];
    if (!url) throw new Error(`Unknown env ${env}`);

    console.log(`📥  Fetching OpenAPI from ${url}`);
    try {
        const spec = await fetchData(url);

        // Create schemas directory if it doesn't exist
        execSync('mkdir -p schemas');

        writeFileSync('schemas/openapi.json', spec);
        console.log('✅  Saved schemas/openapi.json');

        console.log('🛠  Generating TypeScript types & component schemas');
        execSync('mkdir -p src/types');
        execSync('npx openapi-typescript schemas/openapi.json -o src/types/api.d.ts --exportSchemas', {
            stdio: 'inherit'
        });
        console.log('✨  Done');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})(); 