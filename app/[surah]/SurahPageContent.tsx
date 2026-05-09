'use client';

import { ArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AyatView from '../components/AyatView';
import IconSidebar from '../components/IconSidebar';
import SearchBar from '../components/SearchBar';
import SettingsPanel from '../components/SettingsPanel';
import { SurahDetail } from '../types';

export default function SurahPageContent({ surah }: { surah: SurahDetail }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Icon and Surah Sidebar */}
      <IconSidebar />

      {/* Main Content - Adjusted for sidebar */}
      <main className="flex-1 lg:ml-96">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="flex-1 max-w-xl hidden sm:block">
                <SearchBar />
              </div>
            </div>
            {/* Mobile Search */}
            <div className="sm:hidden mt-4">
              <SearchBar />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <AyatView surah={surah} />
        </div>
      </main>

      {/* Settings Toggle Button */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-30"
      >
        <Settings className="w-6 h-6" />
      </button>
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}