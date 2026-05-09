import Link from 'next/link';
import IconSidebar from './components/IconSidebar';
import SearchBar from './components/SearchBar';
import SettingsPanelWrapper from './components/SettingsPanelWrapper';
import SurahList from './components/SurahList';
import { getAllSurahs } from './lib/quran';

export default async function Home() {
  const surahs = await getAllSurahs();

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
              <Link href="/" className="flex items-center gap-2 lg:hidden">
                <span className="text-2xl">📖</span>
                <h1 className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  Quran
                </h1>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Surahs
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                114 chapters of the Holy Quran
              </p>
            </div>
          </div>
          <SurahList surahs={surahs} />
        </div>
      </main>

      {/* Settings Toggle Button */}
      <SettingsPanelWrapper />
    </div>
  );
}
