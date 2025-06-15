import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { searchParams } = new URL(request.url);

        // Construct backend URL using environment variable
        const baseUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
        const backendUrl = new URL(`${baseUrl}/api/v1/blocks/${id}`);

        // Forward query parameters (including branch parameter)
        searchParams.forEach((value, key) => {
            backendUrl.searchParams.append(key, value);
        });

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

        // Return with caching headers - individual blocks can be cached longer
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error proxying block request:', error);
        return NextResponse.json(
            { error: 'Failed to fetch block' },
            { status: 500 }
        );
    }
} 