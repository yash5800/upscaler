import React from 'react';
import type { ViewTab, Backend } from '../types';
import Icon from './Icon';

interface SidebarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  backend: Backend | null;
  historyCount: number;
  bgJobCount: number;
  onOpenShortcuts: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  backend,
  historyCount,
  bgJobCount,
  onOpenShortcuts,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-surface/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-4 min-h-screen select-none fixed top-0 left-0 z-40">
      {/* BRAND & NAVIGATION */}
      <div className="flex flex-col gap-6">
        {/* LOGO */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-neutral-950 rounded-[11px] flex items-center justify-center text-violet-400">
              <Icon name="spark" size={20} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
              Pixelify <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono">v2</span>
            </h1>
            <p className="text-[10px] text-muted font-medium">AI Creative Studio</p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => onTabChange('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/30 text-white border border-violet-500/30 shadow-md font-semibold'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon name="spark" size={17} />
            <span>Discover & Home</span>
          </button>

          <button
            onClick={() => onTabChange('history')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/30 text-white border border-violet-500/30 shadow-md font-semibold'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon name="history" size={17} />
              <span>Local History</span>
            </div>
            {historyCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* TOOLS & WORKSPACES */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-muted font-bold px-3">
            Canvas Workspaces
          </span>

          <button
            onClick={() => onTabChange('upscaler')}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition group ${
              activeTab === 'upscaler'
                ? 'bg-violet-600/20 border-violet-500/40 text-white shadow-lg'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-muted'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Icon name="image" size={18} />
              </div>
              <div>
                <b className="block text-xs font-semibold text-white group-hover:text-violet-300 transition">
                  AI Image Upscaler
                </b>
                <small className="text-[10px] text-muted block">8K Super-Res & Restore</small>
              </div>
            </div>
          </button>

          <button
            onClick={() => onTabChange('bg_remove')}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition group ${
              activeTab === 'bg_remove'
                ? 'bg-violet-600/20 border-violet-500/40 text-white shadow-lg'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-muted'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <Icon name="spark" size={18} />
              </div>
              <div>
                <b className="block text-xs font-semibold text-white group-hover:text-violet-300 transition">
                  Background Remover
                </b>
                <small className="text-[10px] text-muted block">AI Cutouts & Edge Refine</small>
              </div>
            </div>
            {bgJobCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => onTabChange('batch')}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition group ${
              activeTab === 'batch'
                ? 'bg-violet-600/20 border-violet-500/40 text-white shadow-lg'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-muted'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Icon name="upload" size={18} />
              </div>
              <div>
                <b className="block text-xs font-semibold text-white group-hover:text-violet-300 transition">
                  Batch Processor
                </b>
                <small className="text-[10px] text-muted block">Multi-file Workflow</small>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* FOOTER & STATUS */}
      <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                backend === 'webgpu'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] font-medium text-white">
              {backend === 'webgpu' ? 'WebGPU Active' : 'WASM Accelerated'}
            </span>
          </div>
          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/10 text-muted font-mono">
            Local AI
          </span>
        </div>

        <button
          onClick={onOpenShortcuts}
          className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted hover:text-white text-xs font-medium transition flex items-center justify-center gap-2"
        >
          <span>Shortcuts</span>
          <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-white border border-white/10 font-mono">
            ?
          </kbd>
        </button>
      </div>
    </aside>
  );
}
