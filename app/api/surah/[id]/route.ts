import { getSurah } from '@/app/lib/quran';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const surah = await getSurah(Number(params.id));

    return Response.json(surah);
  } catch (error) {
    return Response.json(
      { error: 'Surah not found' },
      { status: 404 }
    );
  }
}