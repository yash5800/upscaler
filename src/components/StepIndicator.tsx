import type { Step } from '../types';

const STEPS: { key: Step; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'config', label: 'Configure' },
  { key: 'processing', label: 'Process' },
  { key: 'result', label: 'Download' },
];

interface StepIndicatorProps {
  currentStep: Step;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav className="flex items-center justify-center gap-1 mb-8" aria-label="Workflow steps">
      {STEPS.map((s, i) => {
        const isComplete = i < stepIndex;
        const isCurrent = i === stepIndex;
        const isFuture = i > stepIndex;

        return (
          <div key={s.key} className="flex items-center">
            <div
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300
                ${isComplete ? 'bg-accent/20 text-accent' : ''}
                ${isCurrent ? 'bg-accent text-white shadow-lg shadow-accent-glow' : ''}
                ${isFuture ? 'bg-surface-card text-muted-dark border border-border' : ''}
              `}
            >
              {isComplete ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className="w-2 h-2 rounded-full bg-current opacity-60" />
              )}
              {s.label}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-6 h-px mx-0.5 transition-colors duration-300 ${i < stepIndex ? 'bg-accent' : 'bg-border'}`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
