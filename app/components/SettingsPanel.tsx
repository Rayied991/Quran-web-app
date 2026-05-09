'use client';

import { X } from 'lucide-react';
import { useSettings } from '../lib/settings-context';
import { ARABIC_FONTS } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Settings Content */}
          <div className="space-y-8">
            {/* Arabic Font Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Arabic Font
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Choose your preferred Quranic font style
              </p>
              <select
                value={settings.arabicFont}
                onChange={(e) => updateSettings({ arabicFont: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
              >
                {ARABIC_FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p 
                  className="text-center"
                  style={{ 
                    fontFamily: `'${settings.arabicFont}', serif`,
                    fontSize: '20px'
                  }}
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            </div>

            {/* Arabic Font Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Arabic Font Size
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="16"
                  max="48"
                  value={settings.arabicFontSize}
                  onChange={(e) => updateSettings({ arabicFontSize: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="w-12 text-center">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {settings.arabicFontSize}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">px</span>
                </div>
              </div>
              <p 
                className="text-center mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                style={{ 
                  fontSize: `${settings.arabicFontSize}px`,
                  fontFamily: `'${settings.arabicFont}', serif`
                }}
              >
                فَٱلَّذِينَ آمَنُوا۟
              </p>
            </div>

            {/* Translation Font Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Translation Font Size
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="12"
                  max="28"
                  value={settings.translationFontSize}
                  onChange={(e) => updateSettings({ translationFontSize: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="w-12 text-center">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {settings.translationFontSize}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">px</span>
                </div>
              </div>
              <p 
                className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-700 dark:text-gray-300"
                style={{ fontSize: `${settings.translationFontSize}px` }}
              >
                So those who believe and do righteous deeds
              </p>
            </div>

            {/* Theme Toggle */}
<div>
  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
    Theme
  </label>
  <div className="flex gap-2">
    {(['light', 'dark'] as const).map((t) => (
      <button
        key={t}
        onClick={() => updateSettings({ theme: t })}
        className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all border ${
          settings.theme === t
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-400'
        }`}
      >
        {t === 'light' ? '☀️ Light' : '🌙 Dark'}
      </button>
    ))}
  </div>
</div>

            {/* Reset Button */}
            <button
              onClick={() => {
                resetSettings();
                onClose();
              }}
              className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium border border-red-200 dark:border-red-900/50"
            >
              Reset to Default Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}