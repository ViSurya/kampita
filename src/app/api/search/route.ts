import { NextResponse } from 'next/server';
import { searchSongs } from '@/lib/fetch';  // Ensure the correct path to your fetch function
import { decodeHtmlEntitiesInJson } from '@/lib/utils'; // Ensure the correct path to your utils function

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const limit = searchParams.get('limit');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const res = await searchSongs({ query, limit: limit ? parseInt(limit) : 10 });
    const decodedRes = decodeHtmlEntitiesInJson(res);
    return NextResponse.json(decodedRes);
  } catch (error) {
    console.error('Error searching songs:', error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}
