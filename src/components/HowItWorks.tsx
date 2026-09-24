import React from 'react';

interface StepItem {
  num: string;
  title: string;
  desc: string;
  icon: string;
}

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  title = 'How It Works',
  subtitle = 'Three simple steps to transform low-res images into 8K perfection.',
  steps,
}) => {
  const defaultSteps: StepItem[] = steps ?? [
    {
      num: '01',
      title: 'Drag & Drop Image',
      desc: 'Drop any photo, portrait, illustration, or graphic up to 8192×8192 pixels. Or press Ctrl+V to paste.',
      icon: '📥',
    },
    {
      num: '02',
      title: 'Choose AI Enhancement',
      desc: 'Select 2×, 4×, or 8× super-resolution along with face restoration, noise reduction, and HDR boost.',
      icon: '⚙️',
    },
    {
      num: '03',
      title: 'Download 8K Output',
      desc: 'Inspect details with the interactive slider & zoom loupe, then save lossless PNG or WebP instantly.',
      icon: '⚡',
    },
  ];

  return (
    <section className="py-16 text-center border-t border-white/10">
      <div className="max-w-xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-white">{title}</h2>
        <p className="text-sm text-muted mt-2">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {defaultSteps.map((s, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-6 border border-white/10 text-left relative overflow-hidden">
            <span className="text-4xl font-black text-white/10 absolute top-4 right-4 select-none">
              {s.num}
            </span>
            <div className="text-3xl mb-4">{s.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
            <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
