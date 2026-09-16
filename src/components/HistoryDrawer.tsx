import React, { useState } from 'react';
import type { HistoryItem } from '../types';
import Icon from './Icon';

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
  const [filter, setFilter] = useState<'all' | 'upscale' | 'bg_remove'>('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'upscale') return item.type === 'upscale' || !item.type;
    if (filter === 'bg_remove') return item.type === 'bg_remove';
    return true;
  });

  const upscaleCount = history.filter((i) => i.type === 'upscale' || !i.type).length;
  const bgRemoveCount = history.filter((i) => i.type === 'bg_remove').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#121216] border-l border-white/10 h-full p-6 flex flex-col shadow-2xl overflow-hidden">
        
        {/* DRAWER HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Icon name="history" size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Local Activity History</h3>
              <p className="text-[11px] text-muted -mt-0.5">Stored 100% locally in browser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* FEATURE CATEGORY FILTER TABS */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === 'all' ? 'bg-white/20 text-white' : 'text-muted hover:text-white'
              }`}
            >
              All ({history.length})
            </button>
            
            <button
              onClick={() => setFilter('upscale')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                filter === 'upscale' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40' : 'text-muted hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Upscaling ({upscaleCount})</span>
            </button>

            <button
              onClick={() => setFilter('bg_remove')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                filter === 'bg_remove' ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40' : 'text-muted hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Cutouts ({bgRemoveCount})</span>
            </button>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition px-2 py-1 rounded hover:bg-rose-500/10"
            >
              Clear
            </button>
          )}
        </div>

        {/* ITEMS LIST WITH COLOR-CODED CARDS FOR EACH FEATURE */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20 text-muted flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                🖼
              </div>
              <p className="text-sm font-semibold text-white">No history records found.</p>
              <p className="text-xs text-muted max-w-xs">
                Process images in the Upscaler Studio or Cutout Canvas to see local activity cards here.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isBG = item.type === 'bg_remove';

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3.5 border transition-all duration-300 flex gap-3.5 group shadow-lg ${
                    isBG
                      ? 'bg-violet-950/20 border-violet-500/30 hover:border-violet-500/60 hover:shadow-violet-500/10'
                      : 'bg-cyan-950/20 border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-cyan-500/10'
                  }`}
                >
                  {/* THUMBNAIL (Checkerboard for BG cutouts) */}
                  <div
                    className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 relative ${
                      isBG ? 'checkerboard' : 'bg-black'
                    }`}
                  >
                    <img
                      src={item.thumbnailUrl || item.resultUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-1 left-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isBG ? 'bg-violet-600 text-white' : 'bg-cyan-500 text-white'
                      }`}
                    >
                      {isBG ? 'CUTOUT' : `${item.scale || 4}×`}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white truncate max-w-[180px]">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* FEATURE SPECIFIC BADGES */}
                      {isBG ? (
                        <div className="flex items-center gap-2 text-[11px] text-violet-300 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-violet-500/20 border border-violet-500/30">
                            BiRefNet Neural
                          </span>
                          {item.timeMs > 0 && (
                            <span>{Math.round(item.timeMs)}ms</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-[11px] text-cyan-300 font-mono flex items-center gap-1">
                          <span>{item.originalWidth || '?'}×{item.originalHeight || '?'}</span>
                          <span>→</span>
                          <span className="font-bold text-white">{item.upscaledWidth || '?'}×{item.upscaledHeight || '?'}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                      <span className="text-[10px] text-muted">
                        {isBG ? 'Transparent PNG Cutout' : `${item.scale || 4}x Resolution Boost`}
                      </span>

                      <button
                        onClick={() => onSelect(item)}
                        className={`text-xs font-bold transition flex items-center gap-1 ${
                          isBG
                            ? 'text-violet-400 hover:text-violet-200'
                            : 'text-cyan-400 hover:text-cyan-200'
                        }`}
                      >
                        <span>View Card</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;
