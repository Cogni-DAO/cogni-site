import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { blockId: string } }
) {
    try {
        const { blockId } = params;
        const { searchParams } = new URL(request.url);

        // Construct backend URL
        const backendUrl = new URL(`http://localhost:8000/api/v1/links/to/${blockId}`);

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
        console.error('Error proxying links to block:', error);
        return NextResponse.json(
            { error: 'Failed to fetch links' },
            { status: 500 }
        );
    }
} 