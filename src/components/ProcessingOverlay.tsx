import React from 'react';
import type { ProgressState } from '../types';

interface ProcessingOverlayProps {
  progress: ProgressState;
  onCancel?: () => void;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ progress }) => {
  const stepsList = [
    'AI analyzing image tensor structure...',
    'Restoring fine texture details & facial geometry...',
    'Removing JPEG compression artifacts...',
    'Enhancing high-frequency edges...',
    'Generating final 8K output buffer...',
  ];

  const currentPercent = progress.percent || 0;
  // Estimate step index based on progress percent
  const currentStepIdx = Math.min(
    stepsList.length - 1,
    Math.floor((currentPercent / 100) * stepsList.length)
  );

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 max-w-xl mx-auto my-8 shadow-2xl relative overflow-hidden">
      {/* Background glowing ambient light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary animate-pulse">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Processing in Progress</h3>
            <p className="text-xs text-muted">Local WebGPU Acceleration active</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-white">{currentPercent}%</span>
        </div>
      </div>

      {/* Glowing Progress Bar */}
      <div className="w-full bg-white/5 rounded-full h-3 mb-6 p-0.5 overflow-hidden border border-white/10 relative">
        <div
          className="h-full rounded-full shimmer-bar transition-all duration-300 ease-out"
          style={{ width: `${Math.max(5, currentPercent)}%` }}
        />
      </div>

      {/* Multi-step checklist logger */}
      <div className="space-y-3 relative z-10 text-left">
        {stepsList.map((stepText, idx) => {
          const isDone = idx < currentStepIdx || currentPercent >= 100;
          const isCurrent = idx === currentStepIdx && currentPercent < 100;
          const isUpcoming = idx > currentStepIdx && currentPercent < 100;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-sm py-1.5 transition-all duration-200 ${
                isDone
                  ? 'text-white'
                  : isCurrent
                  ? 'text-accent font-semibold'
                  : 'text-muted/40'
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/10 bg-white/5" />
                )}
              </div>
              <span className="truncate">{stepText}</span>
            </div>
          );
        })}
      </div>

      {/* Dynamic status footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Generating tensor pixels...</span>
        </div>
        <span>Do not close browser tab</span>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
