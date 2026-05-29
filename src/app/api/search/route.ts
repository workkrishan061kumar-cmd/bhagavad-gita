import { NextResponse } from 'next/server';
import { searchVerses } from '@/features/verse';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const limit = Math.min(Number.parseInt(searchParams.get('limit') ?? '10', 10) || 10, 30);

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchVerses(q, limit);
    return NextResponse.json({ results }, { headers: { 'cache-control': 'private, max-age=60' } });
  } catch {
    return NextResponse.json({ results: [], error: 'search_failed' }, { status: 500 });
  }
}
