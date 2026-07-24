import React from 'react';
import type { EnhancementOptions, ScaleFactor } from '../types';

interface EnhancementCardsProps {
  options: EnhancementOptions;
  onChange: (newOptions: EnhancementOptions) => void;
  disabled?: boolean;
}

export const EnhancementCards: React.FC<EnhancementCardsProps> = ({
  options,
  onChange,
  disabled = false,
}) => {
  const handleScaleSelect = (scale: ScaleFactor) => {
    if (disabled) return;
    onChange({ ...options, scale });
  };

  const handleToggle = (key: keyof Omit<EnhancementOptions, 'scale'>) => {
    if (disabled) return;
    onChange({ ...options, [key]: !options[key] });
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Upscale Factor Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Upscale Factor
          </label>
          <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
            Output: {options.scale}× Scale
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { factor: 2 as ScaleFactor, label: '2× Upscale', badge: 'Fast', desc: 'Double dimensions' },
            { factor: 4 as ScaleFactor, label: '4× Upscale', badge: 'AI Recommended', desc: 'Quadruple pixels (4K)' },
            { factor: 8 as ScaleFactor, label: '8× Super-Res', badge: 'Pro 8K', desc: 'Ultra High Res (8K)' },
          ].map((item) => {
            const isSelected = options.scale === item.factor;
            return (
              <button
                key={item.factor}
                type="button"
                onClick={() => handleScaleSelect(item.factor)}
                disabled={disabled}
                className={`relative p-3.5 rounded-xl text-left border transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary/15 border-primary shadow-lg shadow-primary/20 ring-1 ring-primary'
                    : 'glass-card border-white/10 hover:border-white/20 hover:bg-white/5'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {item.badge && (
                  <span
                    className={`absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.factor === 4
                        ? 'bg-gradient-to-r from-primary to-accent text-white border-white/20 shadow'
                        : 'bg-white/10 text-muted border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-bold text-white">{item.label}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected ? 'bg-primary border-primary text-white' : 'border-white/20 bg-white/5'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted font-normal">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: AI Enhancement Toggles */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
          AI Enhancement Tools
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              key: 'faceRestore' as const,
              icon: '🎯',
              title: 'Face Restore',
              desc: 'Restores skin & facial features',
              badge: 'Popular',
            },
            {
              key: 'removeNoise' as const,
              icon: '🖌',
              title: 'Remove Noise',
              desc: 'Eliminates JPEG artifacts & grain',
            },
            {
              key: 'sharpen' as const,
              icon: '📐',
              title: 'Sharpen',
              desc: 'Enhances fine edges & clarity',
            },
            {
              key: 'colorEnhance' as const,
              icon: '✨',
              title: 'Color Enhance',
              desc: 'Boosts saturation & warmth',
            },
            {
              key: 'hdrBoost' as const,
              icon: '💡',
              title: 'HDR Boost',
              desc: 'Stretches dynamic light range',
            },
          ].map((tool) => {
            const isActive = options[tool.key];
            return (
              <div
                key={tool.key}
                onClick={() => handleToggle(tool.key)}
                className={`relative p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 border-accent/60 shadow-lg shadow-accent/10 ring-1 ring-accent/40'
                    : 'glass-card border-white/10 hover:border-white/20 hover:bg-white/5'
                } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {tool.badge && (
                  <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">
                    {tool.badge}
                  </span>
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{tool.icon}</span>
                  <div
                    className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                      isActive ? 'bg-accent border-accent text-black font-bold' : 'border-white/30 bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="font-bold text-sm text-white mb-0.5">{tool.title}</div>
                <div className="text-[11px] text-muted leading-tight">{tool.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancementCards;
