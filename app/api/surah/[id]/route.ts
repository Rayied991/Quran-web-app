/* eslint-disable @typescript-eslint/no-unused-vars */
import { getSurah } from '@/app/lib/quran';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const surah = await getSurah(Number(id));

    return Response.json(surah);
  } catch (error) {
    return Response.json(
      { error: 'Surah not found' },
      { status: 404 }   
    );
  }
}