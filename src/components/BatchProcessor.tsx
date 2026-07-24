import React, { useState } from 'react';
import type { BatchItem, EnhancementOptions } from '../types';

interface BatchProcessorProps {
  onProcessBatch: (files: File[], options: EnhancementOptions) => void;
  options: EnhancementOptions;
  onChangeOptions: (opts: EnhancementOptions) => void;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({
  onProcessBatch,
  options,
  onChangeOptions,
}) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      addFiles(files);
    }
  };

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    const newItems: BatchItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
      originalUrl: URL.createObjectURL(file),
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const startBatch = () => {
    if (items.length === 0 || isProcessing) return;
    setIsProcessing(true);
    const files = items.map((i) => i.file);
    onProcessBatch(files, options);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Batch Image Upscaler</h2>
        <p className="text-sm text-muted max-w-lg mx-auto mb-6">
          Drag and drop multiple photos to upscale them in sequence with your selected AI options.
        </p>

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropFiles}
          className="border-2 border-dashed border-white/20 hover:border-primary/60 rounded-xl p-8 bg-white/5 hover:bg-white/10 transition-all cursor-pointer text-center relative mb-6"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleSelectFiles}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="text-4xl mb-3">📁</div>
          <p className="font-bold text-white text-base">Drop multiple images here or browse</p>
          <p className="text-xs text-muted mt-1">PNG, JPG, WEBP · Max 50 files per batch</p>
        </div>

        {/* Batch Queue List */}
        {items.length > 0 && (
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-muted uppercase tracking-wider">
              <span>Batch Queue ({items.length} files)</span>
              <button
                onClick={() => setItems([])}
                className="text-rose-400 hover:underline"
              >
                Clear Queue
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.originalUrl} alt={item.name} className="w-10 h-10 rounded object-cover bg-black" />
                    <div>
                      <div className="text-sm font-bold text-white truncate max-w-xs">{item.name}</div>
                      <div className="text-xs text-muted">{(item.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-accent capitalize">{item.status}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-white p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {items.length > 0 && (
          <button
            onClick={startBatch}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all text-base"
          >
            {isProcessing ? 'Processing Batch...' : `Upscale ${items.length} Images (${options.scale}×)`}
          </button>
        )}
      </div>
    </div>
  );
};

export default BatchProcessor;
