'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';
import SettingsPanel from './SettingsPanel';

export default function SettingsPanelWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-30"
      >
        <Settings className="w-6 h-6" />
      </button>
      <SettingsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}