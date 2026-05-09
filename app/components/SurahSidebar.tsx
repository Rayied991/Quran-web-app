'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Surah } from '../types';

export default function SurahSidebar() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const params = useParams();
  const currentSurahId = params?.surah ? parseInt(params.surah as string) : null;

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('/api/surahs');
        const data = await response.json();
        setSurahs(data);
      } catch (error) {
        console.error('Failed to fetch surahs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.id.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Loading surahs...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <input
          type="text"
          placeholder="Search surahs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Surahs List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSurahs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No surahs found</p>
          </div>
        ) : (
          <nav className="space-y-1 p-2">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.id}
                href={`/${surah.id}`}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  currentSurahId === surah.id
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 border-l-4 border-emerald-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    {surah.id}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {surah.transliteration}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {surah.translation}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {surah.total_verses} verses
                  </p>
                </div>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
