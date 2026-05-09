/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../lib/settings';
import { DEFAULT_SETTINGS, Settings } from '../types';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  const saved = getSettings();
  setSettings(saved);
  document.documentElement.classList.toggle('dark', saved.theme === 'dark');
  setMounted(true);
}, []);

const updateSettings = (newSettings: Partial<Settings>) => {
  const updated = { ...settings, ...newSettings };
  setSettings(updated);
  saveSettings(updated);
  if (newSettings.theme) {
    document.documentElement.classList.toggle('dark', newSettings.theme === 'dark');
  }
};

const resetSettings = () => {
  setSettings(DEFAULT_SETTINGS);
  localStorage.removeItem('quran-settings');
  document.documentElement.classList.remove('dark');
};

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  // Return default settings during SSR to prevent build errors
  if (!context) {
    return {
      settings: DEFAULT_SETTINGS,
      updateSettings: () => {},
      resetSettings: () => {},
    };
  }
  return context;
}