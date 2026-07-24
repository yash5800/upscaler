import React from 'react';
import { FEATURES } from '../constants';

export const FeatureGrid: React.FC = () => {
  return (
    <section className="py-16 text-center">
      <div className="max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-3">
          Studio Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Powered by Next-Gen AI Models
        </h2>
        <p className="text-muted text-sm mt-3">
          Everything you need for studio-quality photo enhancement directly inside your web browser.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
        {FEATURES.map((feature, idx) => (
          <div
            key={idx}
            className="glass-card glass-card-hover rounded-2xl p-6 border border-white/10 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              {feature.icon}
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
              {feature.title}
            </h3>

            <p className="text-xs text-muted leading-relaxed font-normal">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
