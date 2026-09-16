import React from 'react';
import type { Backend, ViewTab } from '../types';

interface HeaderProps {
  backend: Backend | null;
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  historyCount: number;
  onOpenShortcuts: () => void;
}

export default function Header({
  backend,
  activeTab,
  onTabChange,
  historyCount,
  onOpenShortcuts,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('upscaler')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent p-0.5 shadow-lg shadow-primary/20">
          <div className="w-full h-full bg-[#09090B] rounded-[10px] flex items-center justify-center text-accent">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg text-white tracking-tight">UPSCALER</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-accent border border-accent/30">
              2026 STUDIO
            </span>
          </div>
          <p className="text-[11px] text-muted -mt-0.5">8K Creative Super-Resolution</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
        {[
          { id: 'upscaler' as ViewTab, label: 'Studio Engine', icon: '🎨' },
          { id: 'batch' as ViewTab, label: 'Batch Queue', icon: '📁' },
          { id: 'history' as ViewTab, label: `History (${historyCount})`, icon: '🕒' },

        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${activeTab === tab.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-muted hover:text-white hover:bg-white/5'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Action Indicators */}
      <div className="flex items-center gap-3">
        {backend && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-muted">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {backend.toUpperCase()} local
          </span>
        )}

        <button
          onClick={onOpenShortcuts}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted hover:text-white text-xs font-mono transition-all"
          title="Keyboard Shortcuts (?)"
        >
          ⌨️ ?
        </button>
      </div>
    </header>
  );
}
