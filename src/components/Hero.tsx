import React from 'react';

interface HeroProps {
  onUploadClick: () => void;
  onTryDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onUploadClick, onTryDemo }) => {
  return (
    <div className="relative pt-8 pb-12 overflow-hidden text-center">
      {/* Background Aurora Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 rounded-full blur-[140px] pointer-events-none animate-aurora-slow" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[300px] bg-accent/15 rounded-full blur-[160px] pointer-events-none animate-aurora-reverse" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[250px] bg-purple/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Tech Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent mb-6 backdrop-blur-md animate-fade-in shadow-lg">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span>2026 AI Studio Edition · WebGPU Accelerated</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
        <span className="text-white">Transform Blurry Images into </span>
        <span className="gradient-text-vibrant">Stunning 8K Quality</span>
      </h1>

      {/* Hero Subtitle */}
      <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto font-normal leading-relaxed mb-8">
        AI-powered image enhancement with crystal-clear details, face restoration, noise removal, and lightning-fast processing.
      </p>

      {/* Hero CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <button
          onClick={onUploadClick}
          className="group relative px-8 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
        >
          <svg className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Upload Image</span>
        </button>

        <button
          onClick={onTryDemo}
          className="px-8 py-3.5 rounded-xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-md hover:-translate-y-0.5 flex items-center gap-2"
        >
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Try Instant Demo</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/10 text-left sm:text-center">
        <div>
          <div className="text-xl sm:text-2xl font-bold text-white">5,000,000+</div>
          <div className="text-xs text-muted">Images Enhanced</div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-accent">Sub-Second</div>
          <div className="text-xs text-muted">WebGPU Inference</div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">100% On-Device</div>
          <div className="text-xs text-muted">Complete Privacy</div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-purple">Up to 8K</div>
          <div className="text-xs text-muted">Super-Resolution</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
