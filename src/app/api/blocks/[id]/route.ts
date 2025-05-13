import { NextResponse } from 'next/server';
import { memoryBlocks } from '@/data/blocks';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const block = memoryBlocks.find(block => block.id === id);

    if (!block) {
        return NextResponse.json(
            { error: 'Block not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(block);
}
