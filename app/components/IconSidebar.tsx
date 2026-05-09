'use client';

import { BookOpen, Home, Menu, Search as SearchIcon, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SurahSidebar from './SurahSidebar';

export default function IconSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Icon Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-24 bg-linear-to-b from-emerald-900 to-emerald-950 dark:from-gray-900 dark:to-gray-950 flex-col items-center py-6 gap-8 border-r border-emerald-800 dark:border-gray-800 z-40">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-bold text-lg"
        >
          📖
        </Link>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-6">
          <Link
            href="/"
            title="Home"
            className={`p-3 rounded-lg transition-all ${
              isHome
                ? 'bg-emerald-500 text-white'
                : 'text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Home className="w-6 h-6" />
          </Link>

          <button
            title="Search"
            className="p-3 rounded-lg text-emerald-200 hover:bg-emerald-800/50 transition-all"
          >
            <SearchIcon className="w-6 h-6" />
          </button>

          <button
            title="Settings"
            className="p-3 rounded-lg text-emerald-200 hover:bg-emerald-800/50 transition-all"
          >
            <Settings className="w-6 h-6" />
          </button>
        </nav>

        {/* Surahs Icon */}
        <div className="mt-auto">
          <button
            title="Surahs"
            className="p-3 rounded-lg text-emerald-200 hover:bg-emerald-800/50 transition-all"
          >
            <BookOpen className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Surah Sidebar - Desktop */}
      <div className="hidden lg:block fixed left-24 top-0 h-screen w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30">
        <SurahSidebar />
      </div>

      {/* Mobile/Tablet Drawer */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform lg:hidden overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-12 mb-4">Surahs</h2>
              <SurahSidebar />
            </div>
          </div>
        </>
      )}
    </>
  );
}
