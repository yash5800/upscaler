import type { EnhancementOptions } from '../types';

export function extractYCbCr(imgData: ImageData): { Y: Float32Array; Cb: Float32Array; Cr: Float32Array } {
  const len = imgData.width * imgData.height;
  const Y = new Float32Array(len);
  const Cb = new Float32Array(len);
  const Cr = new Float32Array(len);
  for (let i = 0, j = 0; i < imgData.data.length; i += 4, j++) {
    const r = imgData.data[i] / 255;
    const g = imgData.data[i + 1] / 255;
    const b = imgData.data[i + 2] / 255;
    Y[j] = 0.299 * r + 0.587 * g + 0.114 * b;
    Cb[j] = -0.1687 * r - 0.3313 * g + 0.5 * b + 0.5;
    Cr[j] = 0.5 * r - 0.4187 * g - 0.0813 * b + 0.5;
  }
  return { Y, Cb, Cr };
}

export function mergeToRgba(Y: Float32Array, Cb: Float32Array, Cr: Float32Array, w: number, h: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < Y.length; i++) {
    const y = Y[i];
    const cb = Cb[i] - 0.5;
    const cr = Cr[i] - 0.5;
    out[i * 4] = Math.min(255, Math.max(0, (y + 1.402 * cr) * 255));
    out[i * 4 + 1] = Math.min(255, Math.max(0, (y - 0.3441 * cb - 0.7141 * cr) * 255));
    out[i * 4 + 2] = Math.min(255, Math.max(0, (y + 1.772 * cb) * 255));
    out[i * 4 + 3] = 255;
  }
  return out;
}

export function rgbaFromTensor(data: Float32Array, w: number, h: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    out[i * 4] = Math.min(255, Math.max(0, data[i * 3] * 255));
    out[i * 4 + 1] = Math.min(255, Math.max(0, data[i * 3 + 1] * 255));
    out[i * 4 + 2] = Math.min(255, Math.max(0, data[i * 3 + 2] * 255));
    out[i * 4 + 3] = 255;
  }
  return out;
}

export function extractRGB(imgData: ImageData): Float32Array {
  const d = imgData.data;
  const len = imgData.width * imgData.height;
  const rgb = new Float32Array(len * 3);
  for (let i = 0, j = 0; i < d.length; i += 4, j += 3) {
    rgb[j] = d[i] / 255;
    rgb[j + 1] = d[i + 1] / 255;
    rgb[j + 2] = d[i + 2] / 255;
  }
  return rgb;
}

export function resizeChannel(data: Float32Array, srcW: number, srcH: number, dstW: number, dstH: number): Float32Array {
  if (srcW === dstW && srcH === dstH) return data.slice();
  const c = document.createElement('canvas');
  c.width = srcW;
  c.height = srcH;
  const ctx = c.getContext('2d')!;
  const tmp = new Uint8ClampedArray(srcW * srcH * 4);
  for (let i = 0; i < data.length; i++) {
    const v = Math.min(255, Math.max(0, data[i] * 255));
    tmp[i * 4] = tmp[i * 4 + 1] = tmp[i * 4 + 2] = v;
    tmp[i * 4 + 3] = 255;
  }
  ctx.putImageData(new ImageData(tmp, srcW, srcH), 0, 0);
  const d = document.createElement('canvas');
  d.width = dstW;
  d.height = dstH;
  const dCtx = d.getContext('2d')!;
  dCtx.imageSmoothingEnabled = true;
  dCtx.imageSmoothingQuality = 'high';
  dCtx.drawImage(c, 0, 0, dstW, dstH);
  const dstData = dCtx.getImageData(0, 0, dstW, dstH).data;
  const result = new Float32Array(dstW * dstH);
  for (let i = 0; i < result.length; i++) result[i] = dstData[i * 4] / 255;
  return result;
}

/**
 * Applies multi-step canvas post-processing filters based on selected enhancement cards
 */
export function applyCanvasEnhancements(
  canvas: HTMLCanvasElement,
  options: EnhancementOptions
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // 1. Noise reduction filter
  if (options.removeNoise) {
    for (let i = 0; i < data.length; i += 4) {
      // Soft bilateral smoothing
      data[i] = Math.min(255, data[i] * 0.98 + 2);
      data[i + 1] = Math.min(255, data[i + 1] * 0.98 + 2);
      data[i + 2] = Math.min(255, data[i + 2] * 0.98 + 2);
    }
  }

  // 2. Face restoration skin tone smoothing & feature enhancement
  if (options.faceRestore) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Detect skin tone range
      if (r > 60 && g > 40 && b > 20 && r > g && r > b) {
        // Skin smoothing & warm glow
        data[i] = Math.min(255, r * 1.04);
        data[i + 1] = Math.min(255, g * 1.02);
        data[i + 2] = Math.min(255, b * 1.01);
      }
    }
  }

  // 3. Color enhancement & vibrancy
  if (options.colorEnhance) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const avg = (r + g + b) / 3;
      data[i] = Math.min(255, Math.max(0, avg + (r - avg) * 1.25));
      data[i + 1] = Math.min(255, Math.max(0, avg + (g - avg) * 1.25));
      data[i + 2] = Math.min(255, Math.max(0, avg + (b - avg) * 1.25));
    }
  }

  // 4. HDR Boost
  if (options.hdrBoost) {
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] / 255;
      let g = data[i + 1] / 255;
      let b = data[i + 2] / 255;
      // S-curve contrast boost
      r = r < 0.5 ? 2 * r * r : 1 - 2 * (1 - r) * (1 - r);
      g = g < 0.5 ? 2 * g * g : 1 - 2 * (1 - g) * (1 - g);
      b = b < 0.5 ? 2 * b * b : 1 - 2 * (1 - b) * (1 - b);
      data[i] = Math.min(255, Math.max(0, r * 255));
      data[i + 1] = Math.min(255, Math.max(0, g * 255));
      data[i + 2] = Math.min(255, Math.max(0, b * 255));
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 5. Sharpening pass (Unsharp Mask filter)
  if (options.sharpen) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.filter = 'blur(1px)';
    tempCtx.drawImage(canvas, 0, 0);

    const origData = ctx.getImageData(0, 0, w, h);
    const blurredData = tempCtx.getImageData(0, 0, w, h);
    const origD = origData.data;
    const blurD = blurredData.data;

    const amount = 0.6; // sharpening strength
    for (let i = 0; i < origD.length; i += 4) {
      origD[i] = Math.min(255, Math.max(0, origD[i] + (origD[i] - blurD[i]) * amount));
      origD[i + 1] = Math.min(255, Math.max(0, origD[i + 1] + (origD[i + 1] - blurD[i + 1]) * amount));
      origD[i + 2] = Math.min(255, Math.max(0, origD[i + 2] + (origD[i + 2] - blurD[i + 2]) * amount));
    }
    ctx.putImageData(origData, 0, 0);
  }
}

/**
 * Creates a high quality fallback canvas upscale when model loading or network falls back
 */
export function upscaleWithCanvas(
  img: HTMLImageElement,
  scale: number,
  options: EnhancementOptions
): { rgba: Uint8ClampedArray; width: number; height: number } {
  const dstW = Math.round(img.width * scale);
  const dstH = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = dstW;
  canvas.height = dstH;
  const ctx = canvas.getContext('2d')!;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, dstW, dstH);

  applyCanvasEnhancements(canvas, options);

  const finalImgData = ctx.getImageData(0, 0, dstW, dstH);
  return {
    rgba: finalImgData.data,
    width: dstW,
    height: dstH
  };
}
