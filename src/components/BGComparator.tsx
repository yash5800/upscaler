import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import type { BGJob } from '../types';

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

export interface ImageEffects {
  shadow: boolean;
  shadowBlur: number;
  stroke: boolean;
  strokeColor: string;
  strokeWidth: number;
}

interface BGComparatorProps {
  job: BGJob;
  backgroundStyle?: string;
  customBgColor?: string;
  customBgImage?: string;
  adjustments?: ImageAdjustments;
  effects?: ImageEffects;
  isCompareMode?: boolean;
  scale?: number;
  onScaleChange?: (scale: number) => void;
}

export default function BGComparator({
  job,
  backgroundStyle = 'bg-[radial-gradient(#ddd_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100 dark:bg-[radial-gradient(#333_1px,transparent_1px)] dark:bg-neutral-950',
  customBgColor,
  customBgImage,
  adjustments = { brightness: 100, contrast: 100, saturation: 100, blur: 0 },
  effects = { shadow: false, shadowBlur: 15, stroke: false, strokeColor: '#00FF85', strokeWidth: 4 },
  isCompareMode = false,
  scale = 1,
  onScaleChange,
}: BGComparatorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [split, setSplit] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const isProcessing = job.status === 'loading' || job.status === 'processing';

  // Calculate CSS filters for adjustments
  const filterCSS = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px)`;

  // Calculate shadow styling
  const shadowCSS = effects.shadow
    ? `drop-shadow(0 20px ${effects.shadowBlur}px rgba(0, 0, 0, 0.45))`
    : 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.2))';

  return (
    <div className="relative w-full flex flex-col items-center justify-center my-2 select-none">
      {/* POSITION & SCALE INTERACTIVE CONTROLS BAR */}
      {job.resultUrl && !isProcessing && !isCompareMode && (
        <div className="z-20 -mb-3 px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#16161E]/90 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg flex items-center gap-4 text-xs font-semibold">
          <span className="text-slate-600 dark:text-neutral-300 flex items-center gap-1">
            <span>✋</span> Drag subject to move
          </span>

          <div className="w-px h-4 bg-slate-200 dark:bg-white/15" />

          <label className="flex items-center gap-2 text-slate-700 dark:text-neutral-300">
            <span>Size:</span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={scale}
              onChange={(e) => onScaleChange && onScaleChange(Number(e.target.value))}
              className="accent-blue-500 cursor-pointer w-20"
            />
            <span className="font-mono text-[11px] text-blue-500 font-bold">{Math.round(scale * 100)}%</span>
          </label>

          <button
            onClick={() => onScaleChange && onScaleChange(1)}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Reset
          </button>
        </div>
      )}

      {/* CENTER CANVAS CONTAINER CARD */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className={`relative w-full max-w-2xl min-h-[380px] sm:min-h-[460px] max-h-[600px] rounded-[32px] overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xl flex items-center justify-center p-6 transition-all duration-300 ${
          customBgImage || customBgColor ? '' : backgroundStyle
        }`}
        style={customBgColor ? { backgroundColor: customBgColor } : {}}
      >
        {/* CUSTOM BACKGROUND IMAGE LAYER */}
        {customBgImage && !isProcessing && (
          <img
            src={customBgImage}
            alt="Custom Background"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          />
        )}

        {/* LOADING ANIMATION OVERLAY */}
        {isProcessing || !job.resultUrl ? (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center gap-5">
            <img
              src={job.sourceUrl}
              alt="Source preview"
              className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xl scale-110 pointer-events-none"
            />

            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 border-r-cyan-400 animate-spin shadow-[0_0_25px_rgba(59,130,246,0.5)]" />
            </div>

            <div className="relative z-10 max-w-sm">
              <h4 className="text-lg font-bold text-white mb-1">Removing Background...</h4>
              <p className="text-xs text-neutral-300 font-mono">
                {job.message || 'BiRefNet neural network detecting edges...'}
              </p>
            </div>

            <div className="relative z-10 w-full max-w-xs h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-[#00FF85] transition-all duration-300 shadow-[0_0_12px_#3b82f6]"
                style={{ width: `${job.progress || 10}%` }}
              />
            </div>
            <span className="relative z-10 text-[11px] font-mono text-blue-400 font-bold">
              {job.progress || 10}% Complete
            </span>
          </div>
        ) : isCompareMode ? (
          /* COMPARE MODE: SPLIT SLIDER */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden z-10">
            <img
              src={job.resultUrl}
              alt="Result cutout"
              className="max-h-[460px] w-auto object-contain transition-all"
              style={{ filter: `${filterCSS} ${shadowCSS}` }}
            />

            <div
              className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
            >
              <img
                src={job.sourceUrl}
                alt="Original photo"
                className="max-h-[460px] w-auto object-contain"
              />
            </div>

            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] pointer-events-none z-10 flex items-center justify-center"
              style={{ left: `${split}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white border-2 border-white shadow-xl flex items-center justify-center text-xs">
                <Icon name="arrows" size={16} />
              </div>
            </div>

            <input
              aria-label="Compare original and cutout"
              type="range"
              min="0"
              max="100"
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>
        ) : (
          /* DRAGGABLE & SCALABLE CUTOUT SUBJECT DISPLAY */
          <div className="relative flex items-center justify-center w-full h-full z-10 overflow-hidden">
            <motion.div
              drag
              dragConstraints={containerRef}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              className={`cursor-grab active:cursor-grabbing relative p-1 rounded-2xl transition-shadow ${
                isDragging ? 'ring-2 ring-blue-500/80 shadow-2xl scale-[1.02]' : 'hover:ring-1 hover:ring-white/30'
              }`}
              style={{ scale }}
            >
              <img
                src={job.resultUrl}
                alt={job.name}
                className="max-h-[420px] w-auto object-contain pointer-events-none select-none"
                style={{ filter: `${filterCSS} ${shadowCSS}` }}
              />
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
