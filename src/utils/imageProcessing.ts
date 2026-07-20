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
