// filepath: app/lib/quran.ts

import { Ayah, Surah, SurahDetail } from '../types';

const QURAN_API_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json';

interface RawQuranData {
  [key: string]: {
    verses: { [key: string]: { text: string; translation: string; transliteration: string } };
    transliteration: string;
    translation: string;
    type: string;
  };
}

export async function getQuranData(): Promise<RawQuranData> {
  const res = await fetch(QURAN_API_URL, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error('Failed to fetch Quran data');
  }
  return res.json();
}

export async function getAllSurahs(): Promise<Surah[]> {
  const data = await getQuranData();
  
  const surahs: Surah[] = Object.entries(data).map(([key, surah]) => ({
    id: parseInt(key),
    name: surah.transliteration,
    transliteration: surah.transliteration,
    translation: surah.translation,
    type: surah.type as 'meccan' | 'medinan',
    total_verses: Object.keys(surah.verses).length,
  }));

  return surahs.sort((a, b) => a.id - b.id);
}

export async function getSurah(surahId: number): Promise<SurahDetail> {
  const data = await getQuranData();
  const surah = data[surahId.toString()];
  
  if (!surah) {
    throw new Error('Surah not found');
  }

  const verses: Ayah[] = Object.entries(surah.verses).map(([key, verse]) => ({
    verse: parseInt(key),
    text: verse.text,
    translation: verse.translation,
    transliteration: verse.transliteration,
  }));

  return {
    id: surahId,
    name: surah.transliteration,
    transliteration: surah.transliteration,
    translation: surah.translation,
    type: surah.type as 'meccan' | 'medinan',
    verses,
  };
}

export async function searchAyahs(query: string): Promise<{ surahId: number; verse: number; text: string; translation: string }[]> {
  const data = await getQuranData();
  const results: { surahId: number; verse: number; text: string; translation: string }[] = [];
  const lowerQuery = query.toLowerCase();

  for (const [surahId, surah] of Object.entries(data)) {
    for (const [verseNum, verse] of Object.entries(surah.verses)) {
      if (verse.translation.toLowerCase().includes(lowerQuery)) {
        results.push({
          surahId: parseInt(surahId),
          verse: parseInt(verseNum),
          text: verse.text,
          translation: verse.translation,
        });
      }
    }
  }

  return results.slice(0, 50); // Limit results
}