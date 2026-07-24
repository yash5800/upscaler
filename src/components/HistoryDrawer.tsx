import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryDrawerProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelect,
  onClear,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#18181B] border-l border-white/10 h-full p-6 flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-white">Upscale History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Clear All action */}
        {history.length > 0 && (
          <div className="flex justify-end mb-3">
            <button
              onClick={onClear}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear History
            </button>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <div className="text-4xl mb-3">🖼</div>
              <p className="text-sm font-semibold">No upscaled images yet.</p>
              <p className="text-xs text-muted-dark mt-1">Your recent upscales will be stored locally here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-xl p-3 border border-white/10 hover:border-accent/40 transition-all duration-200 flex gap-3 group"
              >
                <img
                  src={item.thumbnailUrl || item.resultUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-black border border-white/10 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate max-w-[150px]">{item.name}</span>
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
                      {item.scale}×
                    </span>
                  </div>

                  <div className="text-[11px] text-muted mb-2 font-mono">
                    {item.originalWidth}×{item.originalHeight} → <span className="text-white font-bold">{item.upscaledWidth}×{item.upscaledHeight}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-dark">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button
                      onClick={() => onSelect(item)}
                      className="text-xs font-bold text-primary hover:text-white transition-colors"
                    >
                      View & Download →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;
