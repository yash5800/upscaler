import React, { useState } from 'react';
import { FAQS } from '../constants';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 border-t border-white/10">
      <div className="max-w-xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        <p className="text-sm text-muted mt-2">Everything you need to know about browser-based AI upscaling.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left font-bold text-white flex items-center justify-between gap-4 text-sm sm:text-base hover:bg-white/5 transition-colors"
              >
                <span>{faq.q}</span>
                <span className={`text-accent font-mono text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-muted leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
