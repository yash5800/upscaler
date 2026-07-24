import React, { useRef, useState, useEffect, type DragEvent } from 'react';

interface UploadAreaProps {
  onFile: (file: File) => void;
  isLoading: boolean;
  fileName?: string;
  fileSize?: number;
  onClear: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadArea({ onFile, isLoading, fileName, fileSize, onClear }: UploadAreaProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Paste image handler (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          onFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFile]);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onFile(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);
  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = '';
  };

  return (
    <section className="mb-8">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-[24px] border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer
          transition-all duration-300 backdrop-blur-xl shadow-2xl overflow-hidden
          ${dragging
            ? 'border-accent bg-accent/10 scale-[1.01] ring-4 ring-accent/20'
            : fileName
              ? 'border-emerald-500/40 bg-white/5'
              : 'border-white/15 bg-white/5 hover:border-primary/60 hover:bg-white/10'
          }
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
        />

        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        {fileName ? (
          <div className="animate-fade-in relative z-10">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-base font-bold text-white max-w-md mx-auto truncate">{fileName}</p>
            <p className="text-xs text-muted mt-1">
              {fileSize ? formatSize(fileSize) : ''} · <span className="text-accent font-bold">Auto-detected: 4× AI Recommended</span>
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="mt-4 px-4 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
              type="button"
            >
              Remove & choose another
            </button>
          </div>
        ) : (
          <div className="animate-fade-in relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
              🖼
            </div>
            <p className="text-xl font-bold text-white mb-1">
              Drag & Drop Image or <span className="text-accent underline underline-offset-4">Browse</span>
            </p>
            <p className="text-xs text-muted max-w-sm mx-auto mt-2 leading-relaxed">
              Supports <span className="text-white font-semibold">PNG, JPEG, WEBP</span> up to 25MB · Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-accent font-mono">Ctrl+V</kbd> to paste
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
