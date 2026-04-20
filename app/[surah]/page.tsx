import { notFound } from 'next/navigation';
import { getAllSurahs, getSurah } from '../lib/quran';
import SurahPageContent from './SurahPageContent';

interface PageProps {
  params: Promise<{ surah: string }>;
}

export async function generateStaticParams() {
  const surahs = await getAllSurahs();
  return surahs.map((surah) => ({
    surah: surah.id.toString(),
  }));
}

export default async function SurahPage({ params }: PageProps) {
  const { surah } = await params;
  const surahId = parseInt(surah);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound();
  }

  const surahData = await getSurah(surahId);

  return <SurahPageContent surah={surahData} />;
}