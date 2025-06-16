import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Construct backend URL using environment variable
        const baseUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
        const backendUrl = new URL(`${baseUrl}/api/v1/namespaces`);

        // Proxy request to backend
        const response = await fetch(backendUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }

        const data = await response.json();

        // Return with caching headers - namespaces can be cached briefly
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60',
            },
        });
    } catch (error) {
        console.error('Error proxying namespaces request:', error);
        return NextResponse.json(
            { error: 'Failed to fetch namespaces' },
            { status: 500 }
        );
    }
} 