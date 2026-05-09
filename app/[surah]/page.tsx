import { Metadata } from 'next';
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
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { surah } = await params;
  const surahId = parseInt(surah);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return { title: 'Surah Not Found | Quran App' };
  }

  const surahData = await getSurah(surahId);

  return {
    title: `Surah ${surahData.transliteration} (${surahData.name}) | Quran App`,
    description: `Read Surah ${surahData.transliteration} — "${surahData.translation}". ${surahData.verses.length} verses. ${surahData.type === 'meccan' ? 'Revealed in Makkah' : 'Revealed in Madinah'}.`,
    openGraph: {
      title: `Surah ${surahData.transliteration} | Quran App`,
      description: surahData.translation,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `Surah ${surahData.transliteration} | Quran App`,
      description: surahData.translation,
    },
  };
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