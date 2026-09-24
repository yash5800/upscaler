/// <reference lib="webworker" />
/**
 * bgRemover.worker.ts
 *
 * Runs the BiRefNet background-removal pipeline INSIDE a Web Worker so the
 * main thread (React UI, animations, scrolling) never blocks during model
 * download or inference — matching the smooth behavior of the upscaler,
 * which already runs ONNX inference through ort-web's proxy worker.
 *
 * Engine policy: WEBGPU FIRST (probed with a real requestAdapter() call),
 * automatic WASM fallback. The chosen engine is reported in READY.
 *
 * Protocol:
 *   → { type: 'INIT' }
 *   ← { type: 'PROGRESS', progress }          (0-100, model download only)
 *   ← { type: 'READY', engine, webgpuAvailable }
 *   → { type: 'REMOVE_BG', id, url }
 *   ← { type: 'DONE', id, blob, elapsedMs }
 *   ← { type: 'ERROR', id, message }
 */

import { pipeline, env } from '@huggingface/transformers';

// Keep caches/browsing data local to the worker (no remote code execution path).
env.allowLocalModels = false;

const MODEL_ID = 'studioludens/birefnet-lite-512';

function post(msg: any) {
  (self as any).postMessage(msg);
}

function progressCallback(event: any) {
  if (event.status === 'progress' && event.total) {
    post({
      type: 'PROGRESS',
      progress: Math.round((event.loaded / event.total) * 100),
    });
  }
}

let removerPromise: Promise<any> | null = null;
let chosenEngine: 'webgpu' | 'wasm' | null = null;

/** Probe for a REAL, usable GPU adapter — avoids requesting a webgpu
 *  pipeline on machines where navigator.gpu exists but has no adapter. */
async function detectEngine(): Promise<'webgpu' | 'wasm'> {
  try {
    const gpu = (self.navigator as any)?.gpu;
    if (gpu) {
      const adapter = await gpu.requestAdapter();
      if (adapter) return 'webgpu';
    }
  } catch {
    /* fall through to wasm */
  }
  return 'wasm';
}

function createPipeline(device: 'webgpu' | 'wasm') {
  return pipeline('background-removal', MODEL_ID, {
    dtype: 'fp32',
    device,
    progress_callback: progressCallback,
  });
}

async function getRemover(): Promise<any> {
  if (!removerPromise) {
    removerPromise = (async () => {
      const engine = await detectEngine();
      try {
        const p = await createPipeline(engine);
        chosenEngine = engine;
        return p;
      } catch (err) {
        console.warn(`[bg worker] ${engine} pipeline failed, falling back to WASM:`, err);
        const p = await createPipeline('wasm');
        chosenEngine = 'wasm';
        return p;
      }
    })();
  }
  return removerPromise;
}

async function loadInputBlob(url: string): Promise<Blob> {
  // blob: and data: URLs are same-origin and fetchable from the worker.
  // NOTE: the pipeline accepts RawImage / URL string / Blob — but NOT ImageBitmap
  // (it throws "Unsupported input type: object"), so we hand it a Blob.
  const res = await fetch(url);
  return await res.blob();
}

self.addEventListener('message', async (e: MessageEvent) => {
  const { type, id, url } = e.data || {};

  if (type === 'INIT') {
    try {
      await getRemover();
      post({
        type: 'READY',
        engine: chosenEngine || 'wasm',
        webgpuAvailable: !!(self as any).navigator?.gpu,
      });
    } catch (err: any) {
      removerPromise = null;
      chosenEngine = null;
      post({ type: 'ERROR', id: null, message: err?.message || 'Model init failed' });
    }
    return;
  }

  if (type === 'REMOVE_BG') {
    const startedAt = performance.now();
    try {
      const remover = await getRemover();
      const inputBlob = await loadInputBlob(url);
      const output = await remover(inputBlob);
      const blob = await output.toBlob('image/png');
      post({
        type: 'DONE',
        id,
        blob,
        elapsedMs: Math.round(performance.now() - startedAt),
      });
    } catch (err: any) {
      // If a webgpu pipeline failed at inference time, retry ONCE on wasm.
      if (chosenEngine === 'webgpu') {
        try {
          removerPromise = null;
          chosenEngine = null;
          const wasmRemover = await getRemover();
          const inputBlob = await loadInputBlob(url);
          const output = await wasmRemover(inputBlob);
          const blob = await output.toBlob('image/png');
          post({
            type: 'READY',
            engine: chosenEngine || 'wasm',
            webgpuAvailable: !!(self as any).navigator?.gpu,
          });
          post({
            type: 'DONE',
            id,
            blob,
            elapsedMs: Math.round(performance.now() - startedAt),
          });
          return;
        } catch (retryErr: any) {
          post({ type: 'ERROR', id, message: retryErr?.message || 'Cutout failed' });
          return;
        }
      }
      post({ type: 'ERROR', id, message: err?.message || 'Cutout failed' });
    }
    return;
  }
});
