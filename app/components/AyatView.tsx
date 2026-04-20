'use client';

import { useSettings } from '../lib/settings-context';
import { SurahDetail } from '../types';

interface AyatViewProps {
  surah: SurahDetail;
}

export default function AyatView({ surah }: AyatViewProps) {
  const { settings } = useSettings();

  const fontFamily = settings.arabicFont.replace(' ', '').toLowerCase();

  return (
    <div className="space-y-6">
      {/* Surah Header */}
      <div className="text-center p-8 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-900 rounded-2xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {surah.transliteration}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{surah.translation}</p>
        <span className={`inline-block text-sm px-3 py-1 rounded-full ${
          surah.type === 'meccan' 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
        }`}>
          {surah.type === 'meccan' ? 'Meccan' : 'Medinan'} • {surah.verses.length} verses
        </span>
      </div>

      {/* Verses */}
      <div className="space-y-4">
        {surah.verses.map((ayah) => (
          <div 
            key={ayah.verse} 
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            {/* Verse Number */}
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                {ayah.verse}
              </span>
            </div>

            {/* Arabic Text */}
            <div 
              className="text-right mb-4 leading-loose"
              style={{ 
                fontSize: `${settings.arabicFontSize}px`,
                fontFamily: `'${settings.arabicFont}', serif`,
                lineHeight: '2'
              }}
            >
              {ayah.text}
            </div>

            {/* Transliteration (if available) */}
            {ayah.transliteration && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                {ayah.transliteration}
              </p>
            )}

            {/* Translation */}
            <p 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              style={{ fontSize: `${settings.translationFontSize}px` }}
            >
              {ayah.translation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}