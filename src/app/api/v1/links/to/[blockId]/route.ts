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
                from_id: "37a0ae83-2da2-4b68-9a7f-5d0a71a63562",
                to_id: blockId,
                relation: "depends_on",
                priority: 1,
                created_at: "2025-05-29T18:06:32.314944",
                created_by: "system",
                link_metadata: {
                    reason: "GetWorkItems tool needs CreateBlockLink to manage task relationships"
                }
            },
            {
                from_id: "a72cea7e-e740-43ef-a6fc-71f8920d740f",
                to_id: blockId,
                relation: "depends_on",
                priority: 1,
                created_at: "2025-05-29T18:06:36.852641",
                created_by: "system",
                link_metadata: {
                    reason: "GetBlockLinks tool depends on CreateBlockLink functionality"
                }
            }
        ];

        return NextResponse.json(mockLinks);
    } catch (error) {
        console.error('Error fetching links to block:', error);
        return NextResponse.json(
            { error: 'Failed to fetch links' },
            { status: 500 }
        );
    }
} 