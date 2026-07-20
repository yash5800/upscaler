import { useRef, useState, type DragEvent } from 'react';

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

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
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
          relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer
          transition-all duration-300
          ${dragging
            ? 'border-accent bg-accent/5 scale-[1.01]'
            : fileName
              ? 'border-teal/30 bg-surface-card'
              : 'border-border bg-surface-card hover:border-accent hover:bg-surface-hover'
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

        {fileName ? (
          <div className="animate-fade-in">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white">{fileName}</p>
            <p className="text-xs text-muted-dark mt-0.5">
              {fileSize ? formatSize(fileSize) : ''}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="mt-3 text-xs font-medium text-coral hover:text-red-400 transition-colors"
              type="button"
            >
              Remove & choose another
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-surface flex items-center justify-center text-muted-dark transition-colors group-hover:text-accent">
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 32V16m0 0l-6 6m6-6l6 6" />
                <path d="M8 32v4a4 4 0 004 4h24a4 4 0 004-4v-4" />
              </svg>
            </div>
            <p className="text-base font-semibold text-white">
              Drop image here or click to upload
            </p>
            <p className="text-xs text-muted-dark mt-1">
              PNG, JPG, WEBP &middot; max 4096×4096 &middot; 100% private
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
