import type { Backend, ImageData, ProcessResult, ModelKey } from '../types';
import { MODELS } from '../constants';

interface StatsBarProps {
  image: ImageData | null;
  result: ProcessResult | null;
  backend: Backend | null;
  modelKey: ModelKey;
}

export default function StatsBar({ image, result, backend, modelKey }: StatsBarProps) {
  if (!result || !image) return null;

  const m = MODELS[modelKey];
  const label = m.name;

  return (
    <section className="mb-6 animate-slide-up">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Pill>{image.width}×{image.height} → {result.width}×{result.height}</Pill>
        <Pill>{label}</Pill>
        {backend && <Pill>{backend.toUpperCase()}</Pill>}
        <Pill className="text-amber border-amber/20 bg-amber/5">
          {result.time >= 1000 ? `${(result.time / 1000).toFixed(1)}s` : `${result.time}ms`}
        </Pill>
      </div>
    </section>
  );
}

function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border border-border bg-surface-card text-muted ${className}`}
    >
      {children}
    </span>
  );
}
