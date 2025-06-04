import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Construct backend URL using environment variable
        const baseUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
        const backendUrl = new URL(`${baseUrl}/api/v1/blocks`);

        // Forward query parameters
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
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error proxying blocks request:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blocks' },
            { status: 500 }
        );
    }
} 