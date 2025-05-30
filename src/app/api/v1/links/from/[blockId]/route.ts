import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { blockId: string } }
) {
    try {
        const { blockId } = params;

        // For now, return mock data to test the frontend
        // TODO: Replace with actual Cogni memory system integration
        const mockLinks = [
            {
                from_id: blockId,
                to_id: "1dad8719-1e5b-41b4-a83a-205eca2a614b",
                relation: "depends_on",
                priority: 1,
                created_at: "2025-05-29T18:06:27.569822",
                created_by: "system",
                link_metadata: {
                    reason: "CreateBlockLink tool requires LinkManager integration to be completed first"
                }
            }
        ];

        return NextResponse.json(mockLinks);
    } catch (error) {
        console.error('Error fetching links from block:', error);
        return NextResponse.json(
            { error: 'Failed to fetch links' },
            { status: 500 }
        );
    }
} 