import React from 'react';

export const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Free Studio',
      price: '$0',
      period: 'forever',
      desc: '100% client-side browser upscaling with local WebGPU engine.',
      features: [
        'Unlimited local upscaling',
        '2×, 4×, 8× super-resolution',
        'Face restoration & noise removal',
        'Interactive split slider & zoom loupe',
        '100% privacy-first (No server uploads)',
      ],
      cta: 'Current Plan',
      highlighted: true,
    },
    {
      name: 'Pro Cloud',
      price: '$19',
      period: 'per month',
      desc: 'Heavy multi-GPU cloud processing for massive 16K batch workflows.',
      features: [
        'Everything in Free Studio',
        'Batch upscale 500 images at once',
        'Cloud GPU clusters (16K output)',
        'RAW & DNG format support',
        'Commercial license',
      ],
      cta: 'Upgrade to Pro',
      highlighted: false,
    },
    {
      name: 'Enterprise API',
      price: 'Custom',
      period: 'usage pricing',
      desc: 'Dedicated REST & WebSockets API endpoint for high-volume apps.',
      features: [
        '99.99% uptime SLA',
        'Custom fine-tuned ONNX models',
        'Dedicated GPU nodes',
        '24/7 Priority support',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section className="py-16 border-t border-white/10 text-center">
      <div className="max-w-xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-white">Simple, Transparent Pricing</h2>
        <p className="text-sm text-muted mt-2">Enjoy free unlimited local browser processing or scale up with cloud GPUs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`glass-card rounded-2xl p-6 border flex flex-col justify-between relative ${
              p.highlighted
                ? 'border-primary shadow-2xl shadow-primary/20 bg-primary/5 ring-1 ring-primary'
                : 'border-white/10'
            }`}
          >
            {p.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-primary text-white shadow">
                Always Free Local Engine
              </span>
            )}
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
              <p className="text-xs text-muted mb-4">{p.desc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-white">{p.price}</span>
                <span className="text-xs text-muted">{p.period}</span>
              </div>

              <div className="space-y-2 mb-6">
                {p.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-white/90">
                    <span className="text-accent font-bold">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                p.highlighted
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
