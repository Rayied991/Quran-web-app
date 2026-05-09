import Fuse from 'fuse.js';
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

export interface SearchResult {
  surahId: number;
  surahName: string;
  verse: number | null; // null = surah-level match
  text: string;
  translation: string;
  transliteration?: string;
  matchedField: 'arabic' | 'translation' | 'transliteration' | 'surahName';
  score: number; // 0 = perfect, 1 = worst
}

// ── Module-level singletons ──────────────────────────────────────────────────

let cachedQuranData: RawQuranData | null = null;

interface SearchDoc {
  surahId: number;
  surahName: string;
  surahTranslation: string;
  verse: number;
  text: string;
  translation: string;
  transliteration: string;
}

let searchIndex: Fuse<SearchDoc> | null = null;

// ── Data fetching ────────────────────────────────────────────────────────────

export async function getQuranData(): Promise<RawQuranData> {
  if (cachedQuranData) return cachedQuranData;
  const res = await fetch(QURAN_API_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch Quran data');
  cachedQuranData = await res.json();
  return cachedQuranData!;
}

// ── Search index (built once, reused forever) ────────────────────────────────

async function getSearchIndex(): Promise<Fuse<SearchDoc>> {
  if (searchIndex) return searchIndex;

  const data = await getQuranData();
  const docs: SearchDoc[] = [];

  for (const [surahId, surah] of Object.entries(data)) {
    for (const [verseNum, verse] of Object.entries(surah.verses)) {
      docs.push({
        surahId: parseInt(surahId),
        surahName: surah.transliteration,
        surahTranslation: surah.translation,
        verse: parseInt(verseNum),
        text: verse.text,
        translation: verse.translation,
        transliteration: verse.transliteration,
      });
    }
  }

  searchIndex = new Fuse(docs, {
    includeScore: true,
    includeMatches: true,
    threshold: 0.35,       // 0 = exact only, 1 = match anything
    ignoreLocation: true,  // don't penalise matches far from start
    minMatchCharLength: 2,
    keys: [
      { name: 'translation',     weight: 3 },
      { name: 'transliteration', weight: 2 },
      { name: 'surahName',       weight: 2 },
      { name: 'surahTranslation',weight: 1 },
      { name: 'text',            weight: 1 },
    ],
  });

  return searchIndex;
}

// ── Public API ───────────────────────────────────────────────────────────────

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
  if (!surah) throw new Error('Surah not found');

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

/**
 * Fuzzy search across translation, transliteration, Arabic text, and surah names.
 * Returns results ranked by relevance (best first), with matchedField metadata.
 */
export async function searchAyahs(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const fuse = await getSearchIndex();
  const raw = fuse.search(query, { limit: 60 });

  // Deduplicate: keep only the best hit per (surahId, verse) pair
  const seen = new Set<string>();
  const results: SearchResult[] = [];

  for (const hit of raw) {
    const { item, score = 1, matches = [] } = hit;
    const key = `${item.surahId}-${item.verse}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Determine which field drove the match
    const matchedKeys = matches.map((m) => m.key as string);
    const matchedField = resolveMatchedField(matchedKeys);

    results.push({
      surahId: item.surahId,
      surahName: item.surahName,
      verse: item.verse,
      text: item.text,
      translation: item.translation,
      transliteration: item.transliteration,
      matchedField,
      score,
    });

    if (results.length >= 50) break;
  }

  return results;
}

function resolveMatchedField(
  keys: string[]
): SearchResult['matchedField'] {
  if (keys.includes('text'))                                    return 'arabic';
  if (keys.includes('surahName') || keys.includes('surahTranslation')) return 'surahName';
  if (keys.includes('transliteration'))                         return 'transliteration';
  return 'translation';
}