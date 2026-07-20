import type { Backend } from '../types';

interface HeaderProps {
  backend: Backend | null;
}

export default function Header({ backend }: HeaderProps) {
  return (
    <header className="flex items-center justify-between flex-wrap gap-3 mb-8">
      <div className="flex items-center gap-3">
        <svg width="36" height="36" viewBox="0 0 32 32" fill="none" className="shrink-0">
          <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#g)" strokeWidth="2" />
          <path d="M10 20l4-6 3 4 3-6 4 8" stroke="url(#g)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#6c5ce7" />
              <stop offset="1" stopColor="#a29bfe" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-[#a29bfe] bg-clip-text text-transparent">
            Image Upscaler
          </h1>
          <p className="text-xs text-muted-dark -mt-0.5">AI super-resolution powered by ONNX</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {backend && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-surface-card text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            Backend: <span className="text-white font-semibold">{backend.toUpperCase()}</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-surface-card text-teal">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          100% Private
        </span>
      </div>
    </header>
  );
}
