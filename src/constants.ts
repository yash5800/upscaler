import type { ModelConfig, ModelKey } from './types';

export const MODELS: Record<ModelKey, ModelConfig> = {
  espcn: {
    name: 'ESPCN',
    file: 'models/model.onnx',
    tileSize: 224,
    scale: 3,
    color: 'y',
    size: '235KB',
    badges: {
      quality: 'Good',
      time: '~50ms/tile',
      req: 'Low',
    },
    description:
      'Efficient Sub-Pixel CNN — a lightweight model optimized for speed. Processes only the luminance channel for fast, low-memory upscaling. Ideal for everyday photos and real-time preview.',
    recommendation: 'Best for quick upscales, small images, and devices with limited memory.',
  },
  realesrgan: {
    name: 'Real-ESRGAN',
    file: 'models/Real-ESRGAN-x4plus.onnx',
    tileSize: 128,
    scale: 4,
    color: 'rgb',
    size: '65MB',
    badges: {
      quality: 'Excellent',
      time: '~1-3s/tile',
      req: 'Very High',
    },
    description:
      'Real-ESRGAN (Enhanced Super-Resolution GAN) — a state-of-the-art model that delivers exceptional detail and sharpness. Processes full RGB color. Requires significant memory and processing time.',
    recommendation: 'Best for large prints, detailed enlargements, and when maximum quality is required.',
  },
};

export const MAX_OUTPUT_DIM = 16384;

export function detectBackend(): 'webgpu' | 'wasm' {
  const isSecure =
    location.hostname === 'localhost' || location.protocol === 'https:';
  if (isSecure && 'gpu' in navigator && navigator.gpu) return 'webgpu';
  return 'wasm';
}
