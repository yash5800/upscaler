import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import UploadArea from './UploadArea';
import BGComparator, { ImageAdjustments, ImageEffects } from './BGComparator';
import CanvasEditor from './CanvasEditor';
import { makeId, downloadName } from '../lib/bgUtils';
import { writeBGHistory } from '../lib/bgDb';
import type { BGJob, HistoryItem } from '../types';

interface BGRemoveWorkspaceProps {
  jobs: BGJob[];
  setJobs: React.Dispatch<React.SetStateAction<BGJob[]>>;
  addToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onOpenPicker: () => void;
  onAddHistoryRecord?: (item: HistoryItem) => void;
  onFileAdd?: (files: FileList | File[]) => void;
}

type TabType = 'cutout' | 'background' | 'effects' | 'adjust' | 'design';
type BgSubTab = 'photo' | 'color';

const DEMO_SAMPLES = [
  { src: '/samples/s1.png', name: 'Street style', tag: 'Portrait Cutout' },
  { src: '/samples/s2.png', name: 'Studio portrait', tag: 'Studio Cutout' },
  { src: '/samples/s3.png', name: 'Product shot', tag: 'Product Cutout' },
];

const COLOR_PRESETS = [
  { id: 'transparent', label: 'Transparent', style: 'bg-[radial-gradient(#ddd_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100 dark:bg-[radial-gradient(#333_1px,transparent_1px)] dark:bg-neutral-950', fill: null },
  { id: 'white', label: 'White', style: 'bg-white', fill: '#ffffff' },
  { id: 'dark', label: 'Midnight', style: 'bg-[#09090D]', fill: '#09090D' },
  { id: 'mint', label: 'Mint Studio', style: 'bg-gradient-to-br from-[#050507] via-[#00FF85]/20 to-[#0A0A0E]', fill: '#050507' },
  { id: 'blue', label: 'Sky Blue', style: 'bg-gradient-to-tr from-sky-400 to-blue-600', fill: '#38bdf8' },
  { id: 'pink', label: 'Pastel Pink', style: 'bg-gradient-to-tr from-pink-300 to-rose-400', fill: '#f472b6' },
];

const PHOTO_PRESETS = [
  { id: 'street', label: 'Architecture', url: '/samples/s1.png' },
  { id: 'studio', label: 'Studio Room', url: '/samples/s2.png' },
  { id: 'product', label: 'Product Wall', url: '/samples/s3.png' },
  { id: 'bg-img', label: 'Abstract Texture', url: '/bg-img.jpg' },
];

export default function BGRemoveWorkspace({
  jobs,
  setJobs,
  addToast,
  onOpenPicker,
  onAddHistoryRecord,
  onFileAdd,
}: BGRemoveWorkspaceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id || null);
  const [activeTab, setActiveTab] = useState<TabType>('cutout');
  const [bgSubTab, setBgSubTab] = useState<BgSubTab>('photo');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Subject scale state
  const [subjectScale, setSubjectScale] = useState(1);

  // Undo / Redo clickable state (disabled by default until edits occur)
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [selectedBg, setSelectedBg] = useState(COLOR_PRESETS[0]);
  const [customBgColor, setCustomBgColor] = useState<string | undefined>(undefined);
  const [customBgImage, setCustomBgImage] = useState<string | undefined>(undefined);

  const bgFileInputRef = useRef<HTMLInputElement | null>(null);

  // Image adjustments & effects state
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  });

  const [effects, setEffects] = useState<ImageEffects>({
    shadow: false,
    shadowBlur: 15,
    stroke: false,
    strokeColor: '#00FF85',
    strokeWidth: 4,
  });

  const pipelineRef = useRef<any>(null);

  const selected = jobs.find((job) => job.id === selectedId) ?? jobs[0];

  // RESET BACKGROUND & CANVAS SETTINGS WHEN SELECTING/UPLOADING A NEW IMAGE
  useEffect(() => {
    setSelectedBg(COLOR_PRESETS[0]);
    setCustomBgColor(undefined);
    setCustomBgImage(undefined);
    setSubjectScale(1);
    setAdjustments({ brightness: 100, contrast: 100, saturation: 100, blur: 0 });
    setEffects({ shadow: false, shadowBlur: 15, stroke: false, strokeColor: '#00FF85', strokeWidth: 4 });
  }, [selectedId]);

  const updateJob = (id: string, changes: Partial<BGJob>) => {
    setJobs((items) => items.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  async function getRemover(onProgress: (pct: number) => void) {
    if (pipelineRef.current) return pipelineRef.current;
    try {
      const { pipeline } = await import('@huggingface/transformers');
      pipelineRef.current = pipeline('background-removal', 'studioludens/birefnet-lite-512', {
        dtype: 'fp32',
        progress_callback: (event: any) => {
          if (event.status === 'progress' && event.total) {
            onProgress(Math.round((event.loaded / event.total) * 78));
          }
        },
      });
      return await pipelineRef.current;
    } catch (error) {
      pipelineRef.current = null;
      throw error;
    }
  }

  async function processJob(job: BGJob) {
    const startedAt = performance.now();
    updateJob(job.id, { status: 'loading', progress: 5, message: 'Loading AI model...' });
    try {
      const remover = await getRemover((progress) =>
        updateJob(job.id, { progress, message: 'Downloading neural network...' })
      );
      updateJob(job.id, { status: 'processing', progress: 85, message: 'Detecting background cutout...' });

      const output = await remover(job.sourceUrl);
      const blob = await output.toBlob('image/png');
      const url = URL.createObjectURL(blob);
      const elapsedMs = Math.round(performance.now() - startedAt);

      updateJob(job.id, {
        status: 'done',
        progress: 100,
        message: 'Complete',
        resultUrl: url,
        resultBlob: blob,
        elapsedMs,
      });

      await writeBGHistory({
        id: job.id,
        name: job.name,
        original: job.file,
        result: blob,
        elapsedMs,
        updatedAt: Date.now(),
      });

      if (onAddHistoryRecord) {
        onAddHistoryRecord({
          id: job.id,
          type: 'bg_remove',
          name: job.name,
          timestamp: Date.now(),
          thumbnailUrl: url,
          resultUrl: url,
          timeMs: elapsedMs,
        });
      }

      addToast('success', `${job.name} background removed!`);
    } catch (err: any) {
      console.error(err);
      updateJob(job.id, { status: 'error', message: 'Cutout process failed.' });
      addToast('error', 'Could not process background removal for this image.');
    }
  }

  // AUTOMATIC BACKGROUND REMOVAL ON IMAGE UPLOAD OR ADDITION
  useEffect(() => {
    const readyJob = jobs.find((job) => job.status === 'ready');
    if (readyJob) {
      setSelectedId(readyJob.id);
      processJob(readyJob);
    }
  }, [jobs]);

  function removeJob(id: string) {
    setJobs((items) => {
      const found = items.find((item) => item.id === id);
      if (found) {
        URL.revokeObjectURL(found.sourceUrl);
        if (found.resultUrl) URL.revokeObjectURL(found.resultUrl);
      }
      return items.filter((item) => item.id !== id);
    });
    if (selectedId === id) setSelectedId(null);
    addToast('info', 'Image removed from workspace.');
  }

  // COMPOSITE IMAGE EXPORT FUNCTION
  async function download(job: BGJob, format: 'png' | 'webp' | 'jpeg' = 'png') {
    if (!job?.resultUrl) return;
    setShowDownloadMenu(false);

    addToast('info', 'Rendering composite image for download...');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cutoutImg = new Image();
    cutoutImg.crossOrigin = 'anonymous';

    cutoutImg.onload = async () => {
      const width = cutoutImg.width;
      const height = cutoutImg.height;

      canvas.width = width;
      canvas.height = height;

      if (customBgImage) {
        await new Promise<void>((resolve) => {
          const bgImg = new Image();
          bgImg.crossOrigin = 'anonymous';
          bgImg.onload = () => {
            const hRatio = canvas.width / bgImg.width;
            const vRatio = canvas.height / bgImg.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - bgImg.width * ratio) / 2;
            const centerShift_y = (canvas.height - bgImg.height * ratio) / 2;
            ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, centerShift_x, centerShift_y, bgImg.width * ratio, bgImg.height * ratio);
            resolve();
          };
          bgImg.onerror = () => resolve();
          bgImg.src = customBgImage;
        });
      } else if (customBgColor) {
        ctx.fillStyle = customBgColor;
        ctx.fillRect(0, 0, width, height);
      } else if (selectedBg.fill) {
        ctx.fillStyle = selectedBg.fill;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.save();
      ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px)`;

      if (subjectScale !== 1) {
        const scaledW = width * subjectScale;
        const scaledH = height * subjectScale;
        const dx = (width - scaledW) / 2;
        const dy = (height - scaledH) / 2;
        ctx.drawImage(cutoutImg, dx, dy, scaledW, scaledH);
      } else {
        ctx.drawImage(cutoutImg, 0, 0, width, height);
      }

      ctx.restore();

      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName(job.name).replace(/\.png$/, `.${format}`);
        a.click();
        URL.revokeObjectURL(url);
        addToast('success', 'Download complete!');
      }, mimeType, 0.95);
    };

    cutoutImg.src = job.resultUrl;
  }

  function handleCustomBgImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBgImage(url);
      setCustomBgColor(undefined);
      addToast('success', 'Custom background photo applied!');
    }
  }

  async function handleLoadSample(sampleUrl: string, name: string) {
    try {
      addToast('info', `Downloading sample image "${name}"...`);
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], `${name.toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: blob.type || 'image/jpeg' });
      const newJob: BGJob = {
        id: makeId(),
        file,
        name: `${name}.jpg`,
        sourceUrl: URL.createObjectURL(file),
        resultUrl: null,
        resultBlob: null,
        status: 'ready',
        progress: 0,
        message: 'Queued for cutout processing',
      };
      setJobs((prev) => [...prev, newJob]);
      setSelectedId(newJob.id);
      addToast('success', `Sample "${name}" loaded to canvas.`);
    } catch (e) {
      addToast('error', 'Failed to load sample image.');
    }
  }

  const handleUpload = (file: File) => {
    if (onFileAdd) {
      onFileAdd([file]);
      return;
    }
    const newJob: BGJob = {
      id: makeId(),
      file,
      name: file.name,
      sourceUrl: URL.createObjectURL(file),
      resultUrl: null,
      resultBlob: null,
      status: 'ready',
      progress: 0,
      message: 'Queued for cutout processing',
    };
    setJobs((prev) => [...prev, newJob]);
    setSelectedId(newJob.id);
    addToast('success', `Image "${file.name}" ready for cutout.`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full py-4">
      {jobs.length > 0 && selected?.name && (
        <div className="flex items-center justify-end">
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-neutral-300 border border-slate-300/50 dark:border-white/10 font-semibold">
            📁 {selected.name}
          </span>
        </div>
      )}

      {/* CANVA-STYLE WORKSPACE (ACTIVE AFTER UPLOADING IMAGES) */}
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-4 items-center w-full">
          {/* ========================================================================= */}
          {/* 1. TOP FLOATING NAVBAR / TOOLBAR PILL (EXACTLY AS IN SCREENSHOT) */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl bg-white/95 dark:bg-[#16161E]/95 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-white rounded-full px-5 py-2.5 shadow-xl backdrop-blur-2xl flex flex-wrap items-center justify-between gap-3 z-30"
          >
            {/* LEFT SIDE: FEATURE TABS */}
            <div className="flex items-center gap-1 sm:gap-2">
              {[
                { id: 'cutout' as TabType, label: 'Cutout', icon: '🪄' },
                { id: 'background' as TabType, label: 'Background', icon: '🖼️' },
                { id: 'effects' as TabType, label: 'Effects', icon: '🎨' },
                { id: 'adjust' as TabType, label: 'Adjust', icon: '🎛️' },
                { id: 'design' as TabType, label: 'Design', icon: '📁' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-slate-200/80 dark:bg-white/15 text-slate-900 dark:text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* RIGHT SIDE: UTILITIES (COMPARE, UNDO, REDO) + PRIMARY DOWNLOAD BUTTON */}
            <div className="flex items-center gap-3">
              <div className="w-px h-5 bg-slate-200 dark:bg-white/15" />

              {/* COMPARE SPLIT TOGGLE [|] */}
              <button
                onClick={() => setIsCompareMode(!isCompareMode)}
                className={`p-2 rounded-full transition ${
                  isCompareMode
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
                title="Toggle Before/After Compare"
              >
                <Icon name="arrows" size={15} />
              </button>

              {/* UNDO BUTTON */}
              <button
                disabled={!canUndo}
                className="p-2 rounded-full text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition"
                title={canUndo ? 'Undo Last Modification' : 'No Modifications to Undo'}
              >
                <Icon name="undo" size={15} />
              </button>

              {/* REDO BUTTON */}
              <button
                disabled={!canRedo}
                className="p-2 rounded-full text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition"
                title={canRedo ? 'Redo Last Modification' : 'No Modifications to Redo'}
              >
                <Icon name="redo" size={15} />
              </button>

              {/* DOWNLOAD DROPDOWN BUTTON */}
              <div className="relative">
                <button
                  disabled={selected?.status === 'loading' || selected?.status === 'processing'}
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Download</span>
                  <span className="text-[10px]">∨</span>
                </button>

                {showDownloadMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1A1A24] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50 flex flex-col gap-1 text-xs font-semibold">
                    <button
                      onClick={() => download(selected, 'png')}
                      className="px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white transition flex items-center justify-between"
                    >
                      <span>PNG Image</span>
                      <span className="text-[10px] font-mono text-blue-500 font-bold">HD</span>
                    </button>

                    <button
                      onClick={() => download(selected, 'webp')}
                      className="px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white transition flex items-center justify-between"
                    >
                      <span>WebP Format</span>
                      <span className="text-[10px] font-mono text-neutral-400">Web</span>
                    </button>

                    <button
                      onClick={() => download(selected, 'jpeg')}
                      className="px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white transition flex items-center justify-between"
                    >
                      <span>JPG Photo</span>
                      <span className="text-[10px] font-mono text-neutral-400">Solid</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* 2. ACTIVE TOOL SUB-PANEL DRAWER (BASED ON TOP TAB SELECTION) */}
          {/* ========================================================================= */}
          <AnimatePresence mode="wait">
            {activeTab === 'background' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-3xl p-4 rounded-3xl bg-white/95 dark:bg-[#16161E]/95 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-4 z-20"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <div className="flex items-center bg-slate-100 dark:bg-white/10 p-1 rounded-full border border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => setBgSubTab('photo')}
                      className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all ${
                        bgSubTab === 'photo'
                          ? 'bg-white dark:bg-white text-slate-900 shadow-md'
                          : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Photo
                    </button>
                    <button
                      onClick={() => setBgSubTab('color')}
                      className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all ${
                        bgSubTab === 'color'
                          ? 'bg-white dark:bg-white text-slate-900 shadow-md'
                          : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Color
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400">
                    Custom background generator
                  </span>
                </div>

                {bgSubTab === 'photo' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        Background Photos
                      </span>

                      <button
                        onClick={() => bgFileInputRef.current?.click()}
                        className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                      >
                        <span>+</span> Upload Custom Photo
                      </button>
                      <input
                        ref={bgFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCustomBgImageUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {PHOTO_PRESETS.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => {
                            setCustomBgImage(photo.url);
                            setCustomBgColor(undefined);
                          }}
                          className={`group relative h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shadow-md ${
                            customBgImage === photo.url
                              ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105'
                              : 'border-transparent hover:border-slate-300 dark:hover:border-white/30'
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.label}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1 left-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-semibold text-white truncate text-center">
                            {photo.label}
                          </span>
                        </div>
                      ))}

                      {customBgImage && (
                        <button
                          onClick={() => setCustomBgImage(undefined)}
                          className="h-20 rounded-2xl border-2 border-dashed border-rose-400/50 hover:bg-rose-500/10 text-rose-500 font-bold text-xs flex flex-col items-center justify-center gap-1 transition"
                        >
                          <span>✕</span> Clear Photo
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {bgSubTab === 'color' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                    <span className="text-slate-700 dark:text-neutral-300 font-bold">Presets:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setSelectedBg(preset);
                            setCustomBgColor(undefined);
                            setCustomBgImage(undefined);
                          }}
                          className={`px-3 py-1 rounded-xl border transition ${
                            selectedBg.id === preset.id && !customBgColor && !customBgImage
                              ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                      <label className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 cursor-pointer text-slate-700 dark:text-neutral-300 hover:bg-slate-100">
                        <span>Custom Hex</span>
                        <input
                          type="color"
                          onChange={(e) => {
                            setCustomBgColor(e.target.value);
                            setCustomBgImage(undefined);
                          }}
                          className="w-4 h-4 rounded border-none bg-transparent cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'adjust' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-3xl p-4 rounded-2xl bg-white/90 dark:bg-[#16161E]/90 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold z-20"
              >
                <label className="flex flex-col gap-1.5 text-slate-700 dark:text-neutral-300">
                  <div className="flex justify-between">
                    <span>Brightness</span>
                    <span className="font-mono text-blue-500">{adjustments.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={adjustments.brightness}
                    onChange={(e) => setAdjustments((prev) => ({ ...prev, brightness: Number(e.target.value) }))}
                    className="accent-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-slate-700 dark:text-neutral-300">
                  <div className="flex justify-between">
                    <span>Contrast</span>
                    <span className="font-mono text-blue-500">{adjustments.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={adjustments.contrast}
                    onChange={(e) => setAdjustments((prev) => ({ ...prev, contrast: Number(e.target.value) }))}
                    className="accent-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-slate-700 dark:text-neutral-300">
                  <div className="flex justify-between">
                    <span>Saturation</span>
                    <span className="font-mono text-blue-500">{adjustments.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={adjustments.saturation}
                    onChange={(e) => setAdjustments((prev) => ({ ...prev, saturation: Number(e.target.value) }))}
                    className="accent-blue-500 cursor-pointer"
                  />
                </label>
              </motion.div>
            )}

            {activeTab === 'effects' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-3xl p-3.5 rounded-2xl bg-white/90 dark:bg-[#16161E]/90 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg flex flex-wrap items-center justify-around gap-4 text-xs font-semibold z-20"
              >
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={effects.shadow}
                    onChange={(e) => setEffects((prev) => ({ ...prev, shadow: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Soft Drop Shadow</span>
                </label>

                {effects.shadow && (
                  <label className="flex items-center gap-2 text-slate-700 dark:text-neutral-300">
                    <span>Blur:</span>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={effects.shadowBlur}
                      onChange={(e) => setEffects((prev) => ({ ...prev, shadowBlur: Number(e.target.value) }))}
                      className="accent-blue-500 cursor-pointer w-24"
                    />
                  </label>
                )}
              </motion.div>
            )}

            {activeTab === 'cutout' && selected?.status === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-3xl z-20"
              >
                <CanvasEditor
                  job={selected}
                  updateJob={updateJob}
                  toast={addToast}
                  onHistoryChange={(undoable, redoable) => {
                    setCanUndo(undoable);
                    setCanRedo(redoable);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================================= */}
          {/* 3. CENTER MAIN CANVAS */}
          {/* ========================================================================= */}
          <BGComparator
            job={selected}
            backgroundStyle={selectedBg.style}
            customBgColor={customBgColor}
            customBgImage={customBgImage}
            adjustments={adjustments}
            effects={effects}
            isCompareMode={isCompareMode}
            scale={subjectScale}
            onScaleChange={setSubjectScale}
          />

          {/* ========================================================================= */}
          {/* 4. BOTTOM FLOATING THUMBNAIL DOCK (+ BUTTON & IMAGE THUMBNAILS WITH DELETE) */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 my-2 z-20"
          >
            <button
              onClick={onOpenPicker}
              className="w-14 h-14 rounded-2xl bg-slate-200/90 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 border border-slate-300 dark:border-white/10 flex items-center justify-center text-xl font-extrabold text-slate-700 dark:text-white transition shadow-lg cursor-pointer"
              title="Add Image to Canvas"
            >
              +
            </button>

            <div className="flex items-center gap-3 overflow-x-auto max-w-md py-1 px-1">
              {jobs.map((job) => {
                const isSelected = selected?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedId(job.id)}
                    className={`group relative w-14 h-14 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-600 dark:border-[#00FF85] ring-4 ring-blue-500/20 shadow-xl scale-105'
                        : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={job.resultUrl || job.sourceUrl}
                      alt={job.name}
                      className="w-full h-full object-cover bg-neutral-900"
                    />

                    {isSelected && (
                      <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-slate-900/90 text-white flex items-center justify-center text-[9px] font-bold z-10">
                        ^
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeJob(job.id);
                      }}
                      className={`absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md transition z-20 ${
                        isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-90'
                      }`}
                      title="Delete Image"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      ) : (
        /* EMPTY HOME STATE: SHARE THE UPSCALER UPLOAD PANEL BUT KEEP BG-REMOVAL FILE HANDLING */
        <div className="flex flex-col gap-12 py-4">
          <UploadArea
            onFile={handleUpload}
            isLoading={false}
            onClear={() => setJobs([])}
            title="Cutout"
            description={"Drop your images here to start cutout\nSelect PNG, JPG, or WebP files under 15MB."}
            beforeImage="/gta6.jpg"
            afterImage="/gta6.png"
          />

          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-400">
                  Try it Live
                </span>
                <h3 className="text-xl font-bold text-white">Test background removal with sample images</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {DEMO_SAMPLES.map((sample) => (
                <div
                  key={sample.name}
                  onClick={() => handleLoadSample(sample.src, sample.name)}
                  className="group cursor-pointer rounded-2xl border border-white/10 bg-neutral-950/80 overflow-hidden hover:border-violet-500/50 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={sample.src}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-violet-300">
                      {sample.tag}
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-between border-t border-white/5">
                    <div>
                      <b className="block text-xs font-bold text-white group-hover:text-violet-300 transition">
                        {sample.name}
                      </b>
                      <span className="text-[10px] text-muted">Click to add to cutout canvas</span>
                    </div>
                    <span className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-violet-600 text-white flex items-center justify-center text-xs transition">
                      +
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-surface/50 p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <Icon name="spark" size={22} />
              </div>
              <h4 className="text-base font-bold text-white">BiRefNet Neural Cutouts</h4>
              <p className="text-xs text-muted leading-relaxed">
                State-of-the-art bilateral reference network detects hair strands, transparent glass, and intricate background edges.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-surface/50 p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Icon name="image" size={22} />
              </div>
              <h4 className="text-base font-bold text-white">Interactive Brush Canvas</h4>
              <p className="text-xs text-muted leading-relaxed">
                Fine-tune edges post-processing with real-time Erase and Restore brushes, custom brush radii, zoom lens, and undo/redo stacks.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-surface/50 p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Icon name="check" size={22} />
              </div>
              <h4 className="text-base font-bold text-white">100% Private Local WebGPU</h4>
              <p className="text-xs text-muted leading-relaxed">
                All image data and AI models execute strictly within your web browser using Transformers.js and WebGPU/WASM. Zero server uploads.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
