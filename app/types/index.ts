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
}

export const DEFAULT_SETTINGS: Settings = {
  arabicFont: 'Amiri',
  arabicFontSize: 28,
  translationFontSize: 16,
};

export const ARABIC_FONTS = [
  { name: 'Amiri', value: 'Amiri' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Scheherazade', value: 'Scheherazade' },
  { name: 'Amiri Quran', value: 'Amiri Quran' },
];