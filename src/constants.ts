import type { ModelConfig, ModelKey, BackgroundPrompt } from './types';

export const MODELS: Record<ModelKey, ModelConfig> = {
  espcn: {
    name: 'ESPCN Turbo (2× / 4×)',
    file: 'models/model.onnx',
    tileSize: 224,
    scale: 3,
    color: 'y',
    size: '235KB',
    badges: {
      quality: 'Ultra Fast',
      time: '~30ms',
      req: 'Ultra Low',
    },
    description:
      'Efficient Sub-Pixel CNN — a lightweight model optimized for lightning-fast 60fps inference. Processes luminance channel with crisp sub-pixel interpolation.',
    recommendation: 'Best for instant preview, quick batch jobs, and lower-spec hardware.',
    maxScale: 4,
    presets: ['Standard', 'Fast', 'Crisp'],
    features: {
      faceRestore: false,
      colorEnhance: true,
      hdrBoost: true,
    },
  },
  realesrgan: {
    name: 'Real-ESRGAN Studio (4× / 8×)',
    file: 'models/Real-ESRGAN-x4plus.onnx',
    tileSize: 128,
    scale: 4,
    color: 'rgb',
    size: '65MB',
    badges: {
      quality: '8K Ultra Precision',
      time: '~450ms',
      req: 'WebGPU Preferred',
    },
    description:
      'Real-ESRGAN — state-of-the-art super-resolution network that reconstructs high-frequency details, removes compression artifacts, and restores crisp focus.',
    recommendation: 'Best for portraits, professional photos, high-res prints, and 8K displays.',
    maxScale: 8,
    presets: ['Balanced', 'Portrait', 'Landscape', 'Artwork'],
    features: {
      faceRestore: true,
      colorEnhance: true,
      hdrBoost: true,
    },
  },
};

export const MAX_OUTPUT_DIM = 16384;

export function detectBackend(): 'webgpu' | 'wasm' {
  const isSecure =
    location.hostname === 'localhost' || location.protocol === 'https:';
  if (isSecure && 'gpu' in navigator && navigator.gpu) return 'webgpu';
  return 'wasm';
}

export const BACKGROUND_PROMPTS: BackgroundPrompt[] = [
  {
    id: 'futuristic',
    category: 'Futuristic',
    title: 'Neon Aurora Glow',
    prompt: 'A futuristic aurora gradient with soft neon blue and purple glows, abstract flowing light, ultra minimal, cinematic lighting, premium SaaS landing page background, no objects, dark theme, high resolution.',
    tags: ['Neon', 'Aurora', 'Cinematic', 'Dark Mode']
  },
  {
    id: 'glassmorphism',
    category: 'Glassmorphism',
    title: 'Translucent Ambient Glow',
    prompt: 'Dark glassmorphism interface background with floating translucent panels, subtle reflections, cyan and violet ambient glow, premium UI aesthetic, ultra clean, minimal.',
    tags: ['Glass', 'Translucent', 'Cyan Glow', 'Minimal']
  },
  {
    id: 'mesh-gradient',
    category: 'Mesh Gradient',
    title: 'Indigo & Cyan Mesh',
    prompt: 'Abstract mesh gradient in indigo, cyan, purple, soft blur, smooth transitions, premium AI startup landing page, modern web design background, dark mode.',
    tags: ['Mesh', 'Gradient', 'Indigo', 'Modern']
  },
  {
    id: 'technology',
    category: 'Technology',
    title: 'Neural Network Waves',
    prompt: 'Abstract AI neural network made of glowing particles and flowing lines on a dark background, elegant, futuristic, minimal, soft blue and violet lighting, high-end technology aesthetic.',
    tags: ['AI', 'Neural Lines', 'Particles', 'High-End']
  },
  {
    id: 'luxury',
    category: 'Luxury',
    title: 'Metallic Streaks & Grain',
    prompt: 'Minimal black background with soft metallic gradients, elegant blue light streaks, subtle grain texture, luxury SaaS product design, modern premium aesthetic.',
    tags: ['Luxury', 'Metallic', 'Black Theme', 'Grain']
  }
];

export const FEATURES = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Hardware-accelerated local WebGPU inference delivers 8K results in milliseconds.'
  },
  {
    icon: '✨',
    title: 'AI Detail Enhancement',
    description: 'Generative edge reconstruction restores missing micro-textures and subtle contrast.'
  },
  {
    icon: '🎯',
    title: 'Face Restoration',
    description: 'AI facial landmark detector smooths skin, enhances eyes, and fixes portrait blur.'
  },
  {
    icon: '📸',
    title: '8K Ultra Super-Res',
    description: 'Scale low-res images up to 8K resolution (7680×4320) with lossless detail.'
  },
  {
    icon: '🖌',
    title: 'Smart Noise & Artifact Removal',
    description: 'Wipes out heavy JPEG compression artifacts, grain, and banding in 1-click.'
  },
  {
    icon: '🔒',
    title: '100% Privacy-First',
    description: 'All processing happens 100% client-side inside your browser. No server uploads.'
  }
];

export const FAQS = [
  {
    q: 'How does client-side AI image upscaling work?',
    a: 'We leverage ONNX Runtime Web with WebGPU / WebAssembly acceleration. Neural network models run directly in your web browser, using your GPU to process pixel tensors without sending images to any remote server.'
  },
  {
    q: 'Does it cost money or require credits?',
    a: 'No! The browser studio runs 100% locally on your machine, so you can upscale unlimited photos, portraits, and graphics completely free of charge.'
  },
  {
    q: 'What is the maximum image size I can upscale?',
    a: 'You can input images up to 40MB and output up to 16,384 x 16,384 pixels (equivalent to 16K resolution) depending on your computer’s GPU memory.'
  },
  {
    q: 'Which image formats are supported?',
    a: 'We support PNG, JPEG, WEBP, GIF, and SVG inputs, with output options for lossless PNG, optimized WebP, or high-quality JPEG.'
  },
  {
    q: 'What are the keyboard shortcuts?',
    a: 'Press Ctrl+V (or Cmd+V) anywhere to paste an image, Space bar to toggle Before/After compare mode, Esc to reset, F for Fullscreen, and D to download output.'
  }
];
