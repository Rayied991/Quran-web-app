import { searchAyahs } from '@/app/lib/quran';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return Response.json([]);
    }

    const results = await searchAyahs(query);

    return Response.json(results);
  } catch (error) {
    return Response.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}