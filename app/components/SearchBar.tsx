'use client';

import { Loader2, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchResult } from '../lib/quran';

// ── Helpers ──────────────────────────────────────────────────────────────────

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  // Reset lastIndex after split
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-500/40 text-gray-900 dark:text-yellow-200 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const FIELD_BADGE: Record<SearchResult['matchedField'], { label: string; className: string }> = {
  arabic:          { label: 'Arabic',          className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  translation:     { label: 'Translation',     className: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
  transliteration: { label: 'Transliteration', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  surahName:       { label: 'Surah',           className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = 'search-results-listbox';

  // Debounced search
  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        setActiveIndex(-1);
        return;
      }
      setIsLoading(true);
      try {

        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data: SearchResult[] = await res.json();
        setResults(data);
        setActiveIndex(-1);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Scroll active result into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      listRef.current
        .querySelector(`[data-index="${activeIndex}"]`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || results.length === 0) {
        if (e.key === 'Escape') clearSearch();
        return;
      }
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((p) => (p < results.length - 1 ? p + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((p) => (p > 0 ? p - 1 : results.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && results[activeIndex]) {
            const r = results[activeIndex];
            window.location.href = `/${r.surahId}${r.verse ? `#verse-${r.verse}` : ''}`;
            clearSearch();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
          break;
      }
    },
    [isOpen, results, activeIndex]
  );

  const showDropdown = isOpen && query.length >= 2;

  return (
    <div className="relative" ref={containerRef}>
      {/* Input */}
      <div className="relative">
        {isLoading ? (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search surahs, translation, transliteration, or Arabic…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
          className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
        {query && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Keyboard hint */}
      {showDropdown && results.length > 0 && (
        <p className="absolute -bottom-5 left-1 text-[10px] text-gray-400 dark:text-gray-600 select-none">
          ↑↓ navigate · Enter to open · Esc to close
        </p>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div
          id={listboxId}
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50"
        >
          {isLoading ? (
            <div className="p-6 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Searching…</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {results.map((result, index) => {
                const badge = FIELD_BADGE[result.matchedField];
                const href = `/${result.surahId}${result.verse ? `#verse-${result.verse}` : ''}`;

                return (
                  <Link
                    key={`${result.surahId}-${result.verse}-${index}`}
                    href={href}
                    onClick={clearSearch}
                    id={`result-${index}`}
                    data-index={index}
                    role="option"
                    aria-selected={activeIndex === index}
                    className={`block p-4 transition-colors ${
                      activeIndex === index
                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Verse badge */}
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                        {result.verse ?? '—'}
                      </span>

                      <div className="flex-1 min-w-0">
                        {/* Row: surah · verse + match category badge */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {result.surahName}
                            {result.verse ? `, Verse ${result.verse}` : ''}
                          </p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>

                        {/* Arabic preview (only for non-surah matches) */}
                        {result.verse && (
                          <p
                            className="text-right text-base mb-1 text-gray-800 dark:text-gray-200 line-clamp-1"
                            dir="rtl"
                          >
                            {result.matchedField === 'arabic'
                              ? highlightMatch(result.text, query)
                              : result.text}
                          </p>
                        )}

                        {/* Translation with highlight */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {result.matchedField === 'translation'
                            ? highlightMatch(result.translation, query)
                            : result.translation}
                        </p>

                        {/* Transliteration (only when that's what matched) */}
                        {result.matchedField === 'transliteration' && result.transliteration && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-0.5 line-clamp-1">
                            {highlightMatch(result.transliteration, query)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}