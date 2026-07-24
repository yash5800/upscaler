import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ImageData, ProcessResult, CompareMode } from '../types';
import ZoomLens from './ZoomLens';

interface ImageComparisonProps {
  image: ImageData | null;
  result: ProcessResult | null;
  scale: number;
}

export default function ImageComparison({ image, result, scale }: ImageComparisonProps) {
  const origRef = useRef<HTMLCanvasElement>(null);
  const resRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<CompareMode>('slider');
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const drawOriginal = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas || !image) return;
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d')?.drawImage(image.img, 0, 0);
  }, [image]);

  const drawResult = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas || !result) return;
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#09090B';
    ctx.fillRect(0, 0, result.width, result.height);
    const rgbaClone = new Uint8ClampedArray(result.rgba);
    ctx.putImageData(new ImageData(rgbaClone, result.width, result.height), 0, 0);
  }, [result]);

  useEffect(() => { drawOriginal(origRef.current); }, [drawOriginal, result]);
  useEffect(() => { drawResult(resRef.current); }, [drawResult, result]);

  const updateSlider = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== 'slider') return;
    e.preventDefault();
    setDragging(true);
    updateSlider(e.clientX);
  }, [mode, updateSlider]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updateSlider(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, updateSlider]);

  if (!image) return null;

  const resultDataUrl = result?.dataUrl || image.url;

  return (
    <section className="mb-8 animate-fade-in">
      {/* View Mode Controls & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          {[
            { id: 'slider' as CompareMode, label: 'Split Slider', icon: '↔' },
            { id: 'sideBySide' as CompareMode, label: 'Side by Side', icon: '⧈' },
            { id: 'zoomLens' as CompareMode, label: 'Zoom Lens Loupe', icon: '🔍' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                mode === item.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span>{image.width}×{image.height}</span>
              <span className="text-accent font-bold">→</span>
              <span className="text-white font-bold">{result.width}×{result.height} (8K)</span>
            </div>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted hover:text-white border border-white/10 transition-all"
            title="Toggle Fullscreen (F)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main View Container */}
      <div className={isFullscreen ? 'fixed inset-0 z-50 bg-black/95 p-8 flex flex-col justify-center' : ''}>
        {isFullscreen && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm"
            >
              Close Fullscreen (Esc)
            </button>
          </div>
        )}

        {/* View Mode 1: Split Slider */}
        {mode === 'slider' && (
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden select-none bg-[#09090B] border border-white/10 glass-card h-[450px] sm:h-[550px] cursor-ew-resize"
            onMouseDown={result ? onMouseDown : undefined}
          >
            <canvas
              ref={origRef}
              className="absolute inset-0 w-full h-full object-contain"
            />

            {result && (
              <canvas
                ref={resRef}
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                }}
              />
            )}

            {/* Labels */}
            {result && (
              <>
                <span className="absolute top-4 left-4 z-10 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-black/70 text-white border border-white/10 backdrop-blur-md">
                  Original ({image.width}×{image.height})
                </span>
                <span className="absolute top-4 right-4 z-10 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-primary/90 text-white border border-primary/40 backdrop-blur-md shadow-lg shadow-primary/20">
                  Upscaled {scale}× ({result.width}×{result.height})
                </span>
              </>
            )}

            {/* Slider Handle */}
            {result && (
              <>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-accent shadow-2xl pointer-events-none z-20"
                  style={{ left: `${sliderPos}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-accent text-black border-2 border-white shadow-2xl flex items-center justify-center pointer-events-none z-30"
                  style={{ left: `${sliderPos}%` }}
                >
                  <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
                  </svg>
                </div>
              </>
            )}
          </div>
        )}

        {/* View Mode 2: Side by Side */}
        {mode === 'sideBySide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-xs font-bold text-muted mb-2 uppercase tracking-wider">
                Original Image ({image.width}×{image.height})
              </div>
              <div className="h-[380px] sm:h-[480px] flex items-center justify-center bg-black/40 rounded-xl overflow-hidden">
                <img src={image.url} alt="Original" className="max-w-full max-h-full object-contain" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-primary/30 text-center">
              <div className="text-xs font-bold text-accent mb-2 uppercase tracking-wider">
                Upscaled 8K Output ({result ? result.width : image.width * scale}×{result ? result.height : image.height * scale})
              </div>
              <div className="h-[380px] sm:h-[480px] flex items-center justify-center bg-black/40 rounded-xl overflow-hidden">
                <img src={resultDataUrl} alt="Upscaled" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
        )}

        {/* View Mode 3: Zoom Lens Loupe */}
        {mode === 'zoomLens' && (
          <ZoomLens
            originalUrl={image.url}
            resultUrl={resultDataUrl}
            width={result ? result.width : image.width * scale}
            height={result ? result.height : image.height * scale}
          />
        )}
      </div>
    </section>
  );
}
