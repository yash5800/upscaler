import React from 'react';
import type { AdvantageItem } from '../constants';

interface AdvantagesSectionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: AdvantageItem[];
  /** Accent color class for icons, e.g. 'text-primary' or 'text-violet-400' */
  accent?: string;
}

/**
 * DLBunny-style "Advantages of <Tool>" strip: compact icon + title + one-liner
 * grid that gives Ads landing pages / crawlers scannable trust content.
 */
export const AdvantagesSection: React.FC<AdvantagesSectionProps> = ({
  eyebrow = 'Advantages',
  title = 'Advantages',
  subtitle,
  items,
  accent = 'text-primary',
}) => {
  return (
    <section className="py-16 border-t border-white/10">
      <div className="max-w-xl mx-auto text-center mb-12">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-2 block">
          {eyebrow}
        </span>
        <h2 className="text-3xl font-extrabold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-muted mt-2">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl p-6 border border-white/10 text-center flex flex-col items-center gap-3 hover:border-primary/40 transition-colors"
          >
            <span className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
              {item.icon.startsWith('http') ? (
                <img src={item.icon} alt={item.title} className="w-7 h-7 object-contain" />
              ) : (
                item.icon
              )}
            </span>
            <h3 className={`text-sm font-bold ${accent}`}>{item.title}</h3>
            <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdvantagesSection;
