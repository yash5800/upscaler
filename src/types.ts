export type Step = 'upload' | 'config' | 'processing' | 'result';
export type Backend = 'webgpu' | 'wasm';
export type ModelKey = 'espcn' | 'realesrgan';
export type ScaleFactor = 2 | 4 | 8;
export type ViewTab = 'studio' | 'batch' | 'history' | 'prompts';
export type CompareMode = 'slider' | 'sideBySide' | 'zoomLens';

export interface ModelBadges {
  quality: string;
  time: string;
  req: string;
}

export interface ModelConfig {
  name: string;
  file: string;
  tileSize: number;
  scale: number;
  color: 'y' | 'rgb';
  size: string;
  badges: ModelBadges;
  description: string;
  recommendation: string;
}

export interface ImageData {
  file: File;
  url: string;
  img: HTMLImageElement;
  width: number;
  height: number;
  name: string;
  size: number;
}

export interface EnhancementOptions {
  scale: ScaleFactor;
  faceRestore: boolean;
  removeNoise: boolean;
  sharpen: boolean;
  colorEnhance: boolean;
  hdrBoost: boolean;
}

export interface UpscaleResult {
  type: 'upscale';
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
  time: number;
  psnrGain?: string;
  detailGain?: string;
  enhancementsApplied?: string[];
  dataUrl?: string;
}

export type ProcessResult = UpscaleResult;

export interface ProgressState {
  percent: number;
  text: string;
  stepIndex?: number;
  totalSteps?: number;
}

export interface HistoryItem {
  id: string;
  name: string;
  originalWidth: number;
  originalHeight: number;
  upscaledWidth: number;
  upscaledHeight: number;
  scale: ScaleFactor;
  timestamp: number;
  thumbnailUrl: string;
  resultUrl: string;
  timeMs: number;
  enhancements: string[];
}

export interface BatchItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  originalUrl?: string;
  resultUrl?: string;
  resultWidth?: number;
  resultHeight?: number;
  error?: string;
}

export interface BackgroundPrompt {
  id: string;
  category: 'Futuristic' | 'Glassmorphism' | 'Mesh Gradient' | 'Technology' | 'Luxury';
  title: string;
  prompt: string;
  tags: string[];
}
