import React, { useState, useRef } from 'react';

interface ZoomLensProps {
  originalUrl: string;
  resultUrl: string;
  width: number;
  height: number;
}

export const ZoomLens: React.FC<ZoomLensProps> = ({ originalUrl, resultUrl, width, height }) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [zoomFactor, setZoomFactor] = useState(2.5);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseLeave = () => {
    setPosition(null);
  };

  const lensSize = 180; // px

  return (
    <div className="space-y-3">
      {/* Controls Bar */}
      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Hover image for Real-time 8K Zoom Inspection</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Magnification:</span>
          {[2, 3, 4].map((z) => (
            <button
              key={z}
              onClick={() => setZoomFactor(z)}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                zoomFactor === z ? 'bg-accent text-black' : 'bg-white/5 text-muted hover:text-white'
              }`}
            >
              {z}×
            </button>
          ))}
        </div>
      </div>

      {/* Main Image Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full overflow-hidden rounded-xl border border-white/10 glass-card cursor-crosshair select-none"
      >
        {/* Main Display Image */}
        <img
          src={resultUrl}
          alt="Upscaled output"
          className="w-full h-auto max-h-[600px] object-contain block mx-auto"
        />

        {/* Loupe Lens Overlay */}
        {position && (
          <div
            className="absolute pointer-events-none rounded-full border-2 border-accent shadow-2xl overflow-hidden z-30"
            style={{
              width: `${lensSize}px`,
              height: `${lensSize}px`,
              left: `calc(${position.x}% - ${lensSize / 2}px)`,
              top: `calc(${position.y}% - ${lensSize / 2}px)`,
              boxShadow: '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0,0,0,0.5)',
            }}
          >
            {/* Split Loupe: Left half original, right half upscaled */}
            <div className="relative w-full h-full bg-black">
              {/* Scaled Upscaled Image */}
              <div
                className="absolute inset-0 bg-no-repeat"
                style={{
                  backgroundImage: `url(${resultUrl})`,
                  backgroundPosition: `${position.x}% ${position.y}%`,
                  backgroundSize: `${zoomFactor * 100}%`,
                }}
              />

              {/* Scaled Original Image (Left Half Overlay) */}
              <div
                className="absolute top-0 left-0 w-1/2 h-full overflow-hidden border-r border-accent/80"
                style={{
                  backgroundImage: `url(${originalUrl})`,
                  backgroundPosition: `${position.x}% ${position.y}%`,
                  backgroundSize: `${zoomFactor * 100}%`,
                }}
              >
                <span className="absolute bottom-1 left-2 text-[9px] font-bold text-white bg-black/70 px-1 rounded">
                  ORIGINAL
                </span>
              </div>
              <span className="absolute bottom-1 right-2 text-[9px] font-bold text-accent bg-black/70 px-1 rounded">
                UPSCALED 8K
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoomLens;
