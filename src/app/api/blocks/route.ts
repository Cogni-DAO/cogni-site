import { NextResponse } from 'next/server';
import { memoryBlocks } from '@/data/blocks';

export async function GET() {
    return NextResponse.json(memoryBlocks);
} 