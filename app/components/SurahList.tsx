'use client';

import Link from 'next/link';
import { Surah } from '../types';

interface SurahListProps {
  surahs: Surah[];
}

export default function SurahList({ surahs }: SurahListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {surahs.map((surah) => (
        <Link
          key={surah.id}
          href={`/${surah.id}`}
          className="block p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                {surah.id}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {surah.transliteration}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {surah.translation}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                surah.type === 'meccan' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
              }`}>
                {surah.type === 'meccan' ? 'Meccan' : 'Medinan'}
              </span>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {surah.total_verses} verses
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}