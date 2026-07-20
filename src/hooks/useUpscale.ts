import { useCallback } from 'react';
import { MODELS, MAX_OUTPUT_DIM } from '../constants';
import { extractYCbCr, extractRGB, mergeToRgba, rgbaFromTensor, resizeChannel } from '../utils/imageProcessing';
import { runPass } from '../utils/upscale';
import type { ModelKey, UpscaleResult, ProgressState } from '../types';

interface UseUpscaleParams {
  ortRef: React.MutableRefObject<any>;
  sessionRef: React.MutableRefObject<any>;
}

interface UseUpscaleReturn {
  upscale: (
    img: HTMLImageElement,
    modelKey: ModelKey,
    scale: number,
    onProgress: (p: ProgressState) => void,
  ) => Promise<UpscaleResult>;
}

export function useUpscale({ ortRef, sessionRef }: UseUpscaleParams): UseUpscaleReturn {
  const upscale = useCallback(
    async (
      img: HTMLImageElement,
      modelKey: ModelKey,
      totalScale: number,
      onProgress: (p: ProgressState) => void,
    ): Promise<UpscaleResult> => {
      const ort = ortRef.current;
      const session = sessionRef.current;
      if (!ort || !session) throw new Error('ONNX not initialized');

      const m = MODELS[modelKey];
      const numPasses = totalScale / m.scale;
      const finalW = img.width * Math.pow(m.scale, numPasses);
      const finalH = img.height * Math.pow(m.scale, numPasses);
      if (finalW > MAX_OUTPUT_DIM || finalH > MAX_OUTPUT_DIM) {
        throw new Error(
          `Output would be ${finalW}×${finalH}, exceeding the ${MAX_OUTPUT_DIM}×${MAX_OUTPUT_DIM} limit. Choose a lower scale or a smaller input image.`
        );
      }
      const start = performance.now();

      onProgress({ percent: 5, text: 'Reading image...' });
      await new Promise((r) => setTimeout(r, 0));

      const tc = document.createElement('canvas');
      tc.width = img.width;
      tc.height = img.height;
      tc.getContext('2d')!.drawImage(img, 0, 0);
      const fullImg = tc.getContext('2d')!.getImageData(0, 0, img.width, img.height);

      let cw = img.width;
      let ch = img.height;

      if (m.color === 'rgb') {
        let data = extractRGB(fullImg);
        for (let pass = 0; pass < numPasses; pass++) {
          onProgress({
            percent: Math.round((pass * 100) / numPasses),
            text: numPasses > 1 ? `Pass ${pass + 1}/${numPasses} — enhancing detail...` : 'Processing...',
          });
          data = await runPass(ort, session, data, cw, ch, pass, numPasses, modelKey, (pct, txt) =>
            onProgress({ percent: pct, text: txt }),
          );
          cw *= m.scale;
          ch *= m.scale;
        }
        const rgba = rgbaFromTensor(data, cw, ch);
        const elapsed = Math.round(performance.now() - start);
        return { type: 'upscale', rgba, width: cw, height: ch, time: elapsed };
      } else {
        let { Y, Cb, Cr } = extractYCbCr(fullImg);
        for (let pass = 0; pass < numPasses; pass++) {
          const passDstW = cw * m.scale;
          const passDstH = ch * m.scale;
          onProgress({
            percent: Math.round((pass * 100) / numPasses),
            text: numPasses > 1 ? `Pass ${pass + 1}/${numPasses} — upscaling luminance...` : 'Processing luminance...',
          });
          Cb = resizeChannel(Cb, cw, ch, passDstW, passDstH);
          Cr = resizeChannel(Cr, cw, ch, passDstW, passDstH);
          Y = await runPass(ort, session, Y, cw, ch, pass, numPasses, modelKey, (pct, txt) =>
            onProgress({ percent: pct, text: `Y channel: ${txt}` }),
          );
          cw = passDstW;
          ch = passDstH;
        }
        onProgress({ percent: 95, text: 'Merging color channels...' });
        const rgba = mergeToRgba(Y, Cb, Cr, cw, ch);
        const elapsed = Math.round(performance.now() - start);
        return { type: 'upscale', rgba, width: cw, height: ch, time: elapsed };
      }
    },
    [ortRef, sessionRef],
  );

  return { upscale };
}
