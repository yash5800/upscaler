import type { ProgressState } from '../types';

interface ProgressCardProps {
  progress: ProgressState;
  visible: boolean;
  timeMs?: number;
}

export default function ProgressCard({ progress, visible, timeMs }: ProgressCardProps) {
  if (!visible) return null;

  const done = progress.percent >= 100 && timeMs !== undefined;

  return (
    <section className="mb-8 animate-fade-in">
      <div className="max-w-md mx-auto bg-surface-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          {done ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal shrink-0">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="animate-spin-slow text-accent shrink-0"
            >
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          )}
          <p className="text-sm font-medium text-white">{progress.text || 'Processing...'}</p>
          {done && (
            <span className="ml-auto text-xs font-semibold font-mono tabular-nums text-amber">
              {timeMs >= 1000 ? `${(timeMs / 1000).toFixed(1)}s` : `${timeMs}ms`}
            </span>
          )}
        </div>

        <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${done ? 'bg-teal' : 'bg-gradient-to-r from-accent via-purple-400 to-accent bg-[length:200%_100%] animate-shimmer'}`}
            style={{ width: `${Math.max(2, progress.percent)}%` }}
          />
        </div>

        <p className={`text-xs mt-2 font-mono tabular-nums ${done ? 'text-teal' : 'text-muted-dark'}`}>
          {done ? 'Complete' : `${progress.percent}%`}
        </p>
      </div>
    </section>
  );
}
