import { useRef, useEffect, useState, useCallback } from 'react';
import type { ImageData, ProcessResult } from '../types';

interface ImageComparisonProps {
  image: ImageData | null;
  result: ProcessResult | null;
  scale: number;
}

export default function ImageComparison({ image, result, scale }: ImageComparisonProps) {
  const origRef = useRef<HTMLCanvasElement>(null);
  const resRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

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
    ctx.fillStyle = '#080810';
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
    e.preventDefault();
    setDragging(true);
    updateSlider(e.clientX);
  }, [updateSlider]);

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

  const displayH = Math.min(Math.max(image.width, image.height) / 1.5, 500);

  const leftLabel = 'Original';
  const rightLabel = `Upscaled ${scale}×`;

  return (
    <section className="mb-6 animate-fade-in">
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden select-none bg-[#080810] border border-border"
        style={{ height: displayH }}
        onMouseDown={result ? onMouseDown : undefined}
      >
        <canvas
          ref={origRef}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'contain' }}
        />

        {result && (
          <canvas
            ref={resRef}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'contain',
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            }}
          />
        )}

        {result && (
          <>
            <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-black/50 text-white/80 backdrop-blur-sm pointer-events-none">
              {leftLabel}
            </span>
            <span className="absolute top-3 right-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-black/50 text-white/80 backdrop-blur-sm pointer-events-none">
              {rightLabel}
            </span>
          </>
        )}

        {result && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-[10px] font-mono tabular-nums px-3 py-1.5 rounded-full bg-black/50 text-white/60 backdrop-blur-sm pointer-events-none">
            <span>{image.width}×{image.height}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <span>{result.width}×{result.height}</span>
          </div>
        )}

        {!result && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-medium text-muted-dark">Original · {image.width}×{image.height}</span>
          </div>
        )}

        {result && (
          <>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/70 shadow-lg pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-accent shadow-lg flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="3" strokeLinecap="round">
                <line x1="8" y1="4" x2="8" y2="20" />
                <line x1="16" y1="4" x2="16" y2="20" />
              </svg>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
