import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import BGRemoveWorkspace from './components/BGRemoveWorkspace';
import UploadArea from './components/UploadArea';
// ImageComparison and ControlPanel replaced by UpscaleWorkspace
import UpscaleWorkspace from './components/UpscaleWorkspace';
// ProcessingOverlay and StatsBar are no longer used here
import ErrorMessage from './components/ErrorMessage';
import HistoryDrawer from './components/HistoryDrawer';
import ShortcutsModal from './components/ShortcutsModal';
import FeatureGrid from './components/FeatureGrid';
import HowItWorks from './components/HowItWorks';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

import { useONNX } from './hooks/useONNX';
import { useImageFile } from './hooks/useImageFile';
import { useUpscale } from './hooks/useUpscale';
import { makeId } from './lib/bgUtils';

import CardDeck from './components/CardsTest';

import type {
  Step,
  ModelKey,
  ProcessResult,
  ProgressState,
  EnhancementOptions,
  ViewTab,
  ThemeMode,
  HistoryItem,
  BGJob,
  ToastMessage,
} from './types';

const STORAGE_KEY = 'pixelify_upscaler_history_2026';
const THEME_KEY = 'pixelify_theme_pref';
const MAX_FILE_SIZE = 15 * 1024 * 1024;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = useCallback((): ViewTab => {
    const path = location.pathname.replace(/^\//, '');
    if (path === 'upscaler' || path === 'bg_remove' || path === 'history') {
      return path as ViewTab;
    }
    return 'home';
  }, [location.pathname]);

  const activeTab = getActiveTab();

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Theme state management
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'dark';
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state with URL navigation via React Router
  const navigateTo = useCallback(
    (tab: ViewTab) => {
      if (tab === 'history') {
        setIsHistoryOpen(true);
        return;
      }
      const targetPath = tab === 'home' ? '/' : `/${tab}`;
      navigate(targetPath);
    },
    [navigate]
  );

  useEffect(() => {
    if (location.pathname === '/history') {
      setIsHistoryOpen(true);
    }
  }, [location.pathname]);

  // Theme effect application
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.add('light');
    } else if (theme === 'dark') {
      root.classList.remove('light');
    } else {
      // System mode
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      if (prefersLight) root.classList.add('light');
      else root.classList.remove('light');
    }
  }, [theme]);

  // Background Remover Jobs State
  const [bgJobs, setBgJobs] = useState<BGJob[]>([]);

  // Upscaler State Hooks
  const { ortRef, backend, sessionRef, isLoading: modelLoading, initONNX, loadModel } = useONNX();
  const { imageData, isLoading: imageLoading, error: imageError, handleFile, clear: clearImage } = useImageFile();
  const { upscale } = useUpscale({ ortRef, sessionRef });

  const [step, setStep] = useState<Step>('upload');
  const [modelKey, setModelKey] = useState<ModelKey>('espcn');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({ percent: 0, text: '' });

  // AI Enhancement options
  const DEFAULT_OPTIONS: EnhancementOptions = {
    scale: 4,
    faceRestore: true,
    removeNoise: true,
    sharpen: true,
    colorEnhance: false,
    hdrBoost: false,
    sharpenLevel: 60,
    removeNoiseLevel: 50,
    faceRestoreLevel: 60,
    colorLevel: 0,
    hdrLevel: 0,
    brightness: 50,
    contrast: 50,
  };

  const [options, setOptions] = useState<EnhancementOptions>(DEFAULT_OPTIONS);
  

  // Local Dual History State (Upscale & Cutouts)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToast = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = makeId();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const addHistoryRecord = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev.filter((i) => i.id !== item.id).slice(0, 24)]);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [history]);

  useEffect(() => {
    initONNX();
  }, [initONNX]);

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
    [loadModel]
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

      const historyRecord: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'upscale',
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
        enhancements: res.enhancementsApplied || [],
      };
      addHistoryRecord(historyRecord);
      addToast('success', `${imageData.name} upscaled successfully!`);
    } catch (err: any) {
      setError(err.message || 'Upscaling failed.');
      setStep('config');
      setProgress({ percent: 0, text: '' });
      addToast('error', 'Upscaling encountered an error.');
    } finally {
      setIsProcessing(false);
    }
  }, [imageData, isProcessing, modelLoading, upscale, modelKey, options, addToast, addHistoryRecord]);

  const handleSelectThumb = useCallback(
    async (url: string) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], 'selected.jpg', { type: blob.type || 'image/jpeg' });
        handleFile(file);
      } catch (e) {
        addToast('error', 'Could not load selected image.');
      }
    },
    [handleFile, addToast]
  );

  const handleClear = useCallback(() => {
    clearImage();
    setResult(null);
    setError(null);
    setStep('upload');
    setProgress({ percent: 0, text: '' });
  }, [clearImage]);

  const handleRemoveThumb = useCallback(
    (url: string) => {
      // If the removed thumbnail is the currently loaded image, clear the workspace image.
      if (imageData?.url === url) {
        handleClear();
      }
    },
    [imageData, handleClear]
  );

  const handleDownload = useCallback(
    (format: 'png' | 'webp' | 'jpeg' = 'png') => {
      if (!result) return;
      const canvas = document.createElement('canvas');
      canvas.width = result.width;
      canvas.height = result.height;
      const ctx = canvas.getContext('2d')!;
      const rgbaClone = new Uint8ClampedArray(result.rgba);
      ctx.putImageData(new ImageData(rgbaClone, result.width, result.height), 0, 0);

      const mime = format === 'webp' ? 'image/webp' : format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const ext = format === 'webp' ? 'webp' : format === 'jpeg' ? 'jpg' : 'png';

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `pixelify_upscaled_${options.scale}x.${ext}`;
          a.click();
          URL.revokeObjectURL(url);
        },
        mime,
        0.95
      );
    },
    [result, options.scale]
  );

  const resetSettings = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
    addToast('info', 'Settings reset to defaults.');
  }, [addToast]);

  // Global File Picker Handler for BG Remove
  const handleBGFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= MAX_FILE_SIZE);
    if (!valid.length) {
      addToast('error', 'Please choose images under 15 MB.');
      return;
    }
    const additions: BGJob[] = valid.map((file) => ({
      id: makeId(),
      file,
      name: file.name,
      sourceUrl: URL.createObjectURL(file),
      resultUrl: null,
      resultBlob: null,
      status: 'ready',
      progress: 0,
      message: 'Queued for cutout processing',
    }));
    setBgJobs((prev) => [...prev, ...additions]);
    navigateTo('bg_remove');
    addToast('success', `${additions.length} image(s) added to Cutout Canvas.`);
  };

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
    <div className="app-shell min-h-screen font-sans bg-grid-pattern relative flex flex-col">
      {/* TOAST MESSAGES */}
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type === 'error' ? 'error' : ''}`}>
            <span>{t.type === 'error' ? '!' : '✓'}</span>
            <p className="m-0 font-medium">{t.text}</p>
          </div>
        ))}
      </div>

      {/* HIDDEN FILE INPUT FOR BG REMOVE */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) handleBGFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* STICKY GLASSMORPHIC NAVBAR (REQUIRED TASK 1 & 5) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={navigateTo}
        theme={theme}
        onThemeChange={setTheme}
        backend={backend}
        historyCount={history.length}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <Routes>
          {/* ROUTE 1: HOME PAGE (/) */}

          <Route
            path="/cards"
            element={
              <CardDeck />
            }
          />

          <Route
            path="/"
            element={
              <HomePage
                onLaunchUpscaler={() => navigateTo('upscaler')}
                onLaunchBGRemove={() => navigateTo('bg_remove')}
                onSelectSample={async (sampleUrl, type) => {
                  try {
                    const res = await fetch(sampleUrl);
                    const blob = await res.blob();
                    const file = new File([blob], 'sample.jpg', { type: blob.type || 'image/jpeg' });
                    if (type === 'upscale') {
                      handleFile(file);
                      navigateTo('upscaler');
                    } else {
                      handleBGFiles([file]);
                    }
                  } catch {
                    addToast('error', 'Could not load sample.');
                  }
                }}
                onTabChange={navigateTo}
              />
            }
          />


          {/* ROUTE 2: AI UPSCALER STUDIO (/upscaler) */}
          <Route
            path="/upscaler"
            element={
              <div className="flex flex-col gap-8 py-4">
  
                {step === 'upload' && (
                  <UploadArea
                    onFile={handleFile}
                    isLoading={imageLoading}
                    fileName={imageData?.name}
                    fileSize={imageData?.size}
                    onClear={handleClear}
                    beforeImage="/spiderman3.jpeg"
                    afterImage="/sm3_out_hdr_2ndmodel.png"
                  />
                )}

                <ErrorMessage message={visibleError} onDismiss={() => setError(null)} />

                {step === 'upload' ? (
                  <>
                    <FeatureGrid />
                    <HowItWorks />
                    <FAQSection />
                  </>
                ) : (
                  <UpscaleWorkspace
                    imageUrl={imageData?.url || ''}
                    modelKey={modelKey}
                    step={step}

                    isProcessing={isProcessing}
                    isLoading={modelLoading}
                    hasResult={!!result}
                      resultUrl={result?.dataUrl || ''}

                    options={options}

                    onOptionsChange={setOptions}
                    onModelChange={handleModelChange}

                    onUpscale={handleUpscale}
                    onDownload={handleDownload}

                    onReset={handleClear}
                    onAddFile={handleFile}
                    onSelectThumb={handleSelectThumb}
                    onRemoveThumb={handleRemoveThumb}
                    onResetSettings={resetSettings}
                  />
                )}
                <Footer onTabChange={navigateTo} />
              </div>
            }
          />

          {/* ROUTE 3: BACKGROUND REMOVER CANVAS (/bg_remove) */}
          <Route
            path="/bg_remove"
            element={
              <div className="py-4">
                <BGRemoveWorkspace
                  jobs={bgJobs}
                  setJobs={setBgJobs}
                  addToast={addToast}
                  onOpenPicker={() => fileInputRef.current?.click()}
                  onAddHistoryRecord={addHistoryRecord}
                />
                <Footer onTabChange={navigateTo} />
              </div>
            }
          />

          {/* FALLBACK ROUTE: Redirect to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* HISTORY DRAWER */}
      {isHistoryOpen && (
        <HistoryDrawer
          history={history}
          onClose={() => setIsHistoryOpen(false)}
          onClear={() => setHistory([])}
          onSelect={(item) => {
            setIsHistoryOpen(false);
            if (item.type === 'bg_remove') {
              navigateTo('bg_remove');
            } else {
              navigateTo('upscaler');
            }
          }}
        />
      )}

      {/* SHORTCUTS MODAL */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

    </div>
  );
}
