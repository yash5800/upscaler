import React, { useState, useRef, useEffect } from 'react';
import type { ViewTab, ThemeMode, Backend } from '../types';
import Icon from './Icon';

interface NavbarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  theme: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  backend: Backend | null;
  historyCount: number;
  onOpenShortcuts: () => void;
}

export default function Navbar({
  activeTab,
  onTabChange,
  theme,
  onThemeChange,
  backend,
  historyCount,
  onOpenShortcuts,
}: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full bg-[#050507]/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-all duration-300 select-none py-3.5 mb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 relative">
        
        {/* LOGO (LEFT SIDE: Prominent logo.png with enlarged size) */}
        <div
          onClick={() => onTabChange('home')}
          className="cursor-pointer group shrink-0 flex items-center"
        >
          <img
            src="/logo.png"
            alt="Pixelify"
            className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* CENTERED FLOATING PILL NAV BAR */}
        <div className="absolute left-1/2 -translate-x-1/2 bg-white/10 border border-white/15 rounded-full p-1 flex items-center gap-1 backdrop-blur-2xl shadow-xl">
          <button
            onClick={() => onTabChange('home')}
            className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === 'home'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-300 hover:text-white font-medium'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onTabChange('upscaler')}
            className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === 'upscaler'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-300 hover:text-white font-medium'
            }`}
          >
            AI Upscaler
          </button>

          <button
            onClick={() => onTabChange('bg_remove')}
            className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === 'bg_remove'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-300 hover:text-white font-medium'
            }`}
          >
            BG Remover
          </button>
        </div>

        {/* SETTINGS GEAR ICON BUTTON (RIGHT SIDE) */}
        <div className="relative ml-auto" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Settings & Preferences"
          >
            <Icon name="settings" size={20} />
          </button>

          {/* SETTINGS DROPDOWN MENU */}
          {isSettingsOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#121218] border border-white/15 p-3.5 shadow-2xl z-50 animate-fade-in flex flex-col gap-3">
              <div className="px-1 py-0.5 border-b border-white/10 flex items-center justify-between text-xs font-bold text-white pb-2">
                <span>Settings & Preferences</span>
                <span className="text-[10px] font-mono text-[#00FF85] bg-[#00FF85]/10 px-1.5 py-0.5 rounded border border-[#00FF85]/20">
                  WebGPU PRO
                </span>
              </div>

              {/* THEME PREFERENCES */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-neutral-400">Appearance Theme</span>
                <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => onThemeChange('dark')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                      theme === 'dark' ? 'bg-[#00FF85] text-black shadow' : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span>🌙</span> Dark
                  </button>
                  <button
                    onClick={() => onThemeChange('light')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                      theme === 'light' ? 'bg-[#00FF85] text-black shadow' : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span>☀️</span> Light
                  </button>
                  <button
                    onClick={() => onThemeChange('system')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                      theme === 'system' ? 'bg-[#00FF85] text-black shadow' : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span>💻</span> Auto
                  </button>
                </div>
              </div>

              {/* LOCAL HISTORY */}
              <button
                onClick={() => {
                  onTabChange('history');
                  setIsSettingsOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon name="history" size={16} className="text-[#00FF85]" />
                  <span>View Processing History</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#00FF85]/20 text-[#00FF85] text-[10px] font-bold font-mono">
                  {historyCount} items
                </span>
              </button>

              {/* KEYBOARD SHORTCUTS */}
              <button
                onClick={() => {
                  onOpenShortcuts();
                  setIsSettingsOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>⌨️</span>
                  <span>Keyboard Shortcuts</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-white border border-white/10 font-mono">
                  ?
                </kbd>
              </button>
          
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
