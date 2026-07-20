import { MODELS } from '../constants';
import type { ModelKey, Step } from '../types';

interface ControlPanelProps {
  modelKey: ModelKey;
  step: Step;
  isProcessing: boolean;
  isLoading: boolean;
  hasResult: boolean;
  onModelChange: (key: ModelKey) => void;
  onUpscale: () => void;
  onDownload: () => void;
}

export default function ControlPanel({
  modelKey,
  step,
  isProcessing,
  isLoading,
  hasResult,
  onModelChange,
  onUpscale,
  onDownload,
}: ControlPanelProps) {
  const m = MODELS[modelKey];
  const showControls = step === 'config' || step === 'processing' || step === 'result';

  if (!showControls) return null;

  const busy = isProcessing || isLoading;

  return (
    <section className="mb-6 animate-slide-up">
      <div className="bg-surface-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5">
            <label htmlFor="model-select" className="text-xs font-medium text-muted-dark">Model</label>
            <select
              id="model-select"
              value={modelKey}
              onChange={(e) => onModelChange(e.target.value as ModelKey)}
              disabled={busy}
              className="bg-transparent text-sm font-semibold text-white border-none outline-none cursor-pointer disabled:opacity-40 font-sans"
            >
              <option value="espcn">ESPCN</option>
              <option value="realesrgan">Real-ESRGAN</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5" id="model-badges">
            <ModelBadge color="teal">{m.badges.quality}</ModelBadge>
            <ModelBadge color="amber">{m.badges.time}</ModelBadge>
            <ModelBadge color="coral">{m.badges.req}</ModelBadge>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          <button
            onClick={onUpscale}
            disabled={busy}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white
              bg-gradient-to-r from-accent to-[#8b7cf7]
              shadow-lg shadow-accent-glow
              hover:shadow-xl hover:shadow-accent-glow hover:-translate-y-0.5
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg
              transition-all duration-200 active:translate-y-0"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            {isProcessing ? 'Processing...' : hasResult ? 'Upscale Again' : 'Upscale Image'}
          </button>

          {hasResult && (
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white
                bg-surface-card border border-border
                hover:bg-surface-hover hover:border-muted-dark
                transition-all duration-200"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PNG
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function ModelBadge({ color, children }: { color: string; children: React.ReactNode }) {
  const colorClasses: Record<string, string> = {
    teal: 'text-teal border-teal/20 bg-teal/5',
    amber: 'text-amber border-amber/20 bg-amber/5',
    coral: 'text-coral border-coral/20 bg-coral/5',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorClasses[color] || colorClasses.teal}`}>
      {children}
    </span>
  );
}
