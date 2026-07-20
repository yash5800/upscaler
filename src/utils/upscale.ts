import { MODELS } from '../constants';
import type { ModelKey } from '../types';

interface OrtModule {
  InferenceSession: {
    create: (path: string | Uint8Array) => Promise<InferenceSession>;
  };
  Tensor: new (type: string, data: Float32Array, shape: number[]) => Tensor;
  env: {
    wasm: {
      wasmPaths: string;
      proxy: boolean;
      numThreads?: number;
    };
  };
}

interface InferenceSession {
  inputNames: string[];
  outputNames: string[];
  run: (inputs: Record<string, Tensor>) => Promise<Record<string, Tensor>>;
}

interface Tensor {
  data: Float32Array;
}

export async function loadONNX(): Promise<OrtModule> {
  const ort: OrtModule = await import(
    'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/esm/ort.min.js'
  );
  ort.env.wasm.wasmPaths =
    'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/';
  ort.env.wasm.proxy = true;
  if (!crossOriginIsolated) {
    ort.env.wasm.numThreads = 1;
  }
  return ort;
}

async function fetchModelWithCache(path: string): Promise<Uint8Array> {
  const cache = await caches.open('onnx-models');
  const cached = await cache.match(path);
  if (cached) {
    return new Uint8Array(await cached.arrayBuffer());
  }
  const res = await fetch(path);
  const data = new Uint8Array(await res.arrayBuffer());
  cache.put(path, new Response(data));
  return data;
}

export async function createSession(ort: OrtModule, modelKey: ModelKey): Promise<InferenceSession> {
  const m = MODELS[modelKey];
  const data = await fetchModelWithCache(m.file);
  return ort.InferenceSession.create(data);
}

export async function runPass(
  ort: OrtModule,
  session: InferenceSession,
  data: Float32Array,
  srcW: number,
  srcH: number,
  passIdx: number,
  totalPasses: number,
  modelKey: ModelKey,
  onProgress: (pct: number, text: string) => void,
): Promise<Float32Array> {
  const m = MODELS[modelKey];
  const tileSize = m.tileSize;
  const scale = m.scale;
  const ch = m.color === 'rgb' ? 3 : 1;
  const dstW = srcW * scale;
  const dstH = srcH * scale;
  const numHTiles = Math.ceil(dstW / (tileSize * scale));
  const numVTiles = Math.ceil(dstH / (tileSize * scale));
  const totalTiles = numHTiles * numVTiles;
  const outData = new Float32Array(dstW * dstH * ch);
  const inputName = session.inputNames[0];
  let done = 0;

  await new Promise((r) => setTimeout(r, 0));

  for (let ty = 0; ty < numVTiles; ty++) {
    for (let tx = 0; tx < numHTiles; tx++) {
      done++;
      const pct =
        (passIdx * 100) / totalPasses +
        (done / totalTiles) * 100 / totalPasses;
      const label =
        totalPasses > 1
          ? `Pass ${passIdx + 1}/${totalPasses} · tile ${done}/${totalTiles}`
          : `Tile ${done}/${totalTiles}`;
      onProgress(Math.round(pct), label);
      await new Promise((r) => setTimeout(r, 0));

      const inX = tx * tileSize;
      const inY = ty * tileSize;
      const tileHWC = new Float32Array(tileSize * tileSize * ch);

      for (let y = 0; y < tileSize; y++) {
        const sy = Math.min(inY + y, srcH - 1);
        for (let x = 0; x < tileSize; x++) {
          const sx = Math.min(inX + x, srcW - 1);
          const srcOff = (sy * srcW + sx) * ch;
          const dstOff = (y * tileSize + x) * ch;
          for (let c = 0; c < ch; c++) tileHWC[dstOff + c] = data[srcOff + c];
        }
      }

      let tensorData = tileHWC;
      if (ch === 3) {
        tensorData = new Float32Array(tileSize * tileSize * 3);
        for (let c = 0; c < 3; c++)
          for (let y = 0; y < tileSize; y++)
            for (let x = 0; x < tileSize; x++)
              tensorData[c * tileSize * tileSize + y * tileSize + x] =
                tileHWC[(y * tileSize + x) * 3 + c];
        await new Promise((r) => setTimeout(r, 0));
      }

      const shape = [1, ch, tileSize, tileSize];
      const t = new ort.Tensor('float32', tensorData, shape);
      const r = await session.run({ [inputName]: t });
      const rawOut = r[session.outputNames[0]].data;
      await new Promise((r) => setTimeout(r, 0));

      const tw = Math.min(tileSize * scale, dstW - tx * tileSize * scale);
      const th = Math.min(tileSize * scale, dstH - ty * tileSize * scale);
      const outX = tx * tileSize * scale;
      const outY = ty * tileSize * scale;

      if (ch === 3) {
        const tileFull = tileSize * scale;
        for (let y = 0; y < th; y++) {
          const hwcRow = (outY + y) * dstW + outX;
          for (let x = 0; x < tw; x++) {
            const hwcOff = (hwcRow + x) * 3;
            const chwBase = y * tileFull + x;
            outData[hwcOff] = rawOut[chwBase];
            outData[hwcOff + 1] = rawOut[1 * tileFull * tileFull + chwBase];
            outData[hwcOff + 2] = rawOut[2 * tileFull * tileFull + chwBase];
          }
        }
      } else {
        for (let y = 0; y < th; y++) {
          const row = (outY + y) * dstW + outX;
          const srcRow = y * tileSize * scale;
          for (let x = 0; x < tw; x++) outData[row + x] = rawOut[srcRow + x];
        }
      }

      if (done % 3 === 0) await new Promise((r) => setTimeout(r, 0));
    }
  }
  return outData;
}
