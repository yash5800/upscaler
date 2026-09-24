import React, { useState } from 'react';
import { FAQS } from '../constants';

interface FAQSectionProps {
  /** Optional custom FAQ list; falls back to the upscaler FAQS constant */
  faqs?: { q: string; a: string }[];
  title?: string;
  subtitle?: string;
  /** Emit FAQPage JSON-LD for Google rich results / Ads landing page quality */
  withJsonLd?: boolean;
  /** Optional base name for JSON-LD ids when multiple FAQ sections exist on one page */
  jsonLdIdSuffix?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  faqs = FAQS,
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about browser-based AI upscaling.',
  withJsonLd = false,
  jsonLdIdSuffix,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const ldId = jsonLdIdSuffix ? `faq-jsonld-${jsonLdIdSuffix}` : 'faq-jsonld';

  return (
    <section className="py-16 border-t border-white/10">
      {/* FAQPage structured data for search engines */}
      {withJsonLd && (
        <script
          type="application/ld+json"
          id={ldId}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.a,
                },
              })),
            }),
          }}
        />
      )}

      <div className="max-w-xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-extrabold text-white">{title}</h2>
        <p className="text-sm text-muted mt-2">{subtitle}</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
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
