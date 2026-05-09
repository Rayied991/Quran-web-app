// filepath: app/types/index.ts

export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
}

export interface Ayah {
  verse: number;
  text: string;
  translation: string;
  transliteration?: string;
}

export interface SurahDetail {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  verses: Ayah[];
}

export interface Settings {
  arabicFont: string;
  arabicFontSize: number;
  translationFontSize: number;
   theme: 'light' | 'dark';
}

export const DEFAULT_SETTINGS: Settings = {
  arabicFont: 'Amiri Quran',
  arabicFontSize: 28,
  translationFontSize: 16,
  theme: 'light',
};

export const ARABIC_FONTS = [
  { name: 'Amiri Quran', value: 'Amiri Quran' },
  { name: 'Scheherazade New', value: 'Scheherazade New' },
  { name: 'Noto Naskh Arabic', value: 'Noto Naskh Arabic' },
  { name: 'Noto Nastaliq Urdu', value: 'Noto Nastaliq Urdu' },
  { name: 'Amiri', value: 'Amiri' },
];