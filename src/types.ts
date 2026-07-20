export type Step = 'upload' | 'config' | 'processing' | 'result';
export type Backend = 'webgpu' | 'wasm';
export type ModelKey = 'espcn' | 'realesrgan';
export type ResultType = 'upscale';

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

export interface UpscaleResult {
  type: 'upscale';
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
  time: number;
}

export type ProcessResult = UpscaleResult;

export interface ProgressState {
  percent: number;
  text: string;
}
