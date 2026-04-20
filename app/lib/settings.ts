// filepath: app/lib/settings.ts

import { DEFAULT_SETTINGS, Settings } from '../types';

const STORAGE_KEY = 'quran-settings';

export function getSettings(): Settings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function resetSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_SETTINGS;
}