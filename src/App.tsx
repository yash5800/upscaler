import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadArea from './components/UploadArea';
import ImageComparison from './components/ImageComparison';
import ControlPanel from './components/ControlPanel';
import ProcessingOverlay from './components/ProcessingOverlay';
import StatsBar from './components/StatsBar';
import ErrorMessage from './components/ErrorMessage';
import HistoryDrawer from './components/HistoryDrawer';
import BatchProcessor from './components/BatchProcessor';
import ShortcutsModal from './components/ShortcutsModal';
import FeatureGrid from './components/FeatureGrid';
import HowItWorks from './components/HowItWorks';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';

import { useONNX } from './hooks/useONNX';
import { useImageFile } from './hooks/useImageFile';
import { useUpscale } from './hooks/useUpscale';

import type {
  Step,
  ModelKey,
  ProcessResult,
  ProgressState,
  EnhancementOptions,
  ViewTab,
  HistoryItem
} from './types';

const STORAGE_KEY = 'litert_upscaler_history_2026';

export default function App() {
  const { ortRef, backend, sessionRef, isLoading: modelLoading, initONNX, loadModel } = useONNX();
  const { imageData, isLoading: imageLoading, error: imageError, handleFile, loadDemoImage, clear: clearImage } = useImageFile();
  const { upscale } = useUpscale({ ortRef, sessionRef });

  const [step, setStep] = useState<Step>('upload');
  const [modelKey, setModelKey] = useState<ModelKey>('espcn');
  const [activeTab, setActiveTab] = useState<ViewTab>('studio');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({ percent: 0, text: '' });
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // AI Enhancement options state
  const [options, setOptions] = useState<EnhancementOptions>({
    scale: 4,
    faceRestore: true,
    removeNoise: true,
    sharpen: true,
    colorEnhance: false,
    hdrBoost: false,
  });

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [history]);

  useEffect(() => { initONNX(); }, [initONNX]);

  useEffect(() => {
    if (imageData) {
      setStep('config');
      setError(null);
      setResult(null);
      loadModel(modelKey);
    }
  }, [imageData, modelKey, loadModel]);

  const handleModelChange = useCallback(
    async (key: ModelKey) => {
      setModelKey(key);
      setResult(null);
      setError(null);
      const ok = await loadModel(key);
      if (!ok) setError(`Failed to load ${key === 'espcn' ? 'ESPCN' : 'Real-ESRGAN'} model.`);
    },
    [loadModel],
  );

  const handleUpscale = useCallback(async () => {
    if (!imageData || isProcessing || modelLoading) return;
    setIsProcessing(true);
    setStep('processing');
    setError(null);
    setResult(null);

    try {
      const res = await upscale(imageData.img, modelKey, options, (p: ProgressState) => setProgress(p));
      setResult(res);
      setStep('result');
      setProgress({ percent: 100, text: 'Complete!' });

      // Add to history
      const historyRecord: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: imageData.name,
        originalWidth: imageData.width,
        originalHeight: imageData.height,
        upscaledWidth: res.width,
        upscaledHeight: res.height,
        scale: options.scale,
        timestamp: Date.now(),
        thumbnailUrl: imageData.url,
        resultUrl: res.dataUrl || imageData.url,
        timeMs: res.time,
        enhancements: res.enhancementsApplied || []
      };
      setHistory((prev) => [historyRecord, ...prev.slice(0, 19)]);
    } catch (err: any) {
      setError(err.message || 'Upscaling failed.');
      setStep('config');
      setProgress({ percent: 0, text: '' });
    } finally {
      setIsProcessing(false);
    }
  }, [imageData, isProcessing, modelLoading, upscale, modelKey, options]);

  const handleDownload = useCallback((format: 'png' | 'webp' | 'jpeg' = 'png') => {
    if (!result) return;
    const canvas = document.createElement('canvas');
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext('2d')!;
    const rgbaClone = new Uint8ClampedArray(result.rgba);
    ctx.putImageData(new ImageData(rgbaClone, result.width, result.height), 0, 0);

    const mime = format === 'webp' ? 'image/webp' : format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const ext = format === 'webp' ? 'webp' : format === 'jpeg' ? 'jpg' : 'png';

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upscaled_8k_${options.scale}x.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }, mime, 0.95);
  }, [result, options.scale]);

  const handleClear = useCallback(() => {
    clearImage();
    setResult(null);
    setError(null);
    setStep('upload');
    setProgress({ percent: 0, text: '' });
  }, [clearImage]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setIsShortcutsOpen((prev) => !prev);
      }
      if (e.key === 'Enter' && !isProcessing && (step === 'config' || step === 'result') && imageData) {
        handleUpscale();
      }
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsHistoryOpen(false);
        if (step !== 'processing') handleClear();
      }
      if (e.key.toLowerCase() === 'd' && result && step === 'result') {
        handleDownload('png');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, isProcessing, imageData, result, handleUpscale, handleClear, handleDownload]);

  const visibleError = error || imageError;

  return (
    <div className="min-h-screen bg-bg text-white font-sans bg-grid-pattern bg-radial-vignette relative">
      <Header
        backend={backend}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'history') {
            setIsHistoryOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        historyCount={history.length}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 relative z-10">
        {/* TAB 1: STUDIO VIEW */}
        {activeTab === 'studio' && (
          <>
            {step === 'upload' && (
              <Hero
                onUploadClick={() => {
                  const el = document.querySelector('section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onTryDemo={loadDemoImage}
              />
            )}

            <UploadArea
              onFile={handleFile}
              isLoading={imageLoading}
              fileName={imageData?.name}
              fileSize={imageData?.size}
              onClear={handleClear}
            />

            <ErrorMessage
              message={visibleError}
              onDismiss={() => setError(null)}
            />

            {step === 'processing' ? (
              <ProcessingOverlay progress={progress} />
            ) : (
              <ImageComparison
                image={imageData}
                result={result}
                scale={options.scale}
              />
            )}

            <ControlPanel
              modelKey={modelKey}
              step={step}
              isProcessing={isProcessing}
              isLoading={modelLoading}
              hasResult={!!result}
              options={options}
              onOptionsChange={setOptions}
              onModelChange={handleModelChange}
              onUpscale={handleUpscale}
              onDownload={handleDownload}
            />

            <StatsBar
              image={imageData}
              result={result}
              backend={backend}
              modelKey={modelKey}
            />

            {step === 'upload' && (
              <>
                <FeatureGrid />
                <HowItWorks />
                <PricingSection />
                <FAQSection />
              </>
            )}
          </>
        )}

        {/* TAB 2: BATCH VIEW */}
        {activeTab === 'batch' && (
          <BatchProcessor
            options={options}
            onChangeOptions={setOptions}
            onProcessBatch={(files) => {
              if (files.length > 0) handleFile(files[0]);
              setActiveTab('studio');
            }}
          />
        )}


      </main>

      {/* History Drawer Modal */}
      {isHistoryOpen && (
        <HistoryDrawer
          history={history}
          onClose={() => setIsHistoryOpen(false)}
          onClear={() => setHistory([])}
          onSelect={(item) => {
            setIsHistoryOpen(false);
            setActiveTab('studio');
          }}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <footer className="mt-16 py-8 border-t border-white/10 text-center text-xs text-muted">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>AI Processing 100% Local & Private</span>
          </div>

          <p>© 2026 AI Image Upscaler Creative Studio · Powered by ONNX & WebGPU</p>

          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="hover:text-white transition-colors"
          >
            Shortcuts (?)
          </button>
        </div>
      </footer>
    </div>
  );
}
