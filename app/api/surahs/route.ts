import { getAllSurahs } from '../../lib/quran';

export async function GET() {
  try {
    const surahs = await getAllSurahs();
    return Response.json(surahs);
  } catch (error) {
    console.error('Failed to fetch surahs:', error);
    return Response.json({ error: 'Failed to fetch surahs' }, { status: 500 });
  }
}
