import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import UploadArea from './components/UploadArea';
import ImageComparison from './components/ImageComparison';
import ControlPanel from './components/ControlPanel';
import ModelInfoPanel from './components/ModelInfoPanel';
import ProgressCard from './components/ProgressCard';
import StatsBar from './components/StatsBar';
import ErrorMessage from './components/ErrorMessage';
import { useONNX } from './hooks/useONNX';
import { useImageFile } from './hooks/useImageFile';
import { useUpscale } from './hooks/useUpscale';

import { MODELS } from './constants';
import type { Step, ModelKey, ProcessResult, ProgressState } from './types';

export default function App() {
  const { ortRef, backend, sessionRef, isLoading: modelLoading, initONNX, loadModel } = useONNX();
  const { imageData, isLoading: imageLoading, error: imageError, handleFile, clear: clearImage } = useImageFile();
  const { upscale } = useUpscale({ ortRef, sessionRef });

  const [step, setStep] = useState<Step>('upload');
  const [modelKey, setModelKey] = useState<ModelKey>('espcn');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({ percent: 0, text: '' });

  useEffect(() => { initONNX(); }, [initONNX]);

  useEffect(() => {
    if (imageData) {
      setStep('config');
      setError(null);
      setResult(null);
      loadModel(modelKey);
    }
  }, [imageData, modelKey, loadModel]);

  const handleModelChange = useCallback(
    async (key: ModelKey) => {
      setModelKey(key);
      setResult(null);
      setError(null);
      const ok = await loadModel(key);
      if (!ok) setError(`Failed to load ${key === 'espcn' ? 'ESPCN' : 'Real-ESRGAN'} model.`);
    },
    [loadModel],
  );

  const handleUpscale = useCallback(async () => {
    if (!imageData || isProcessing || modelLoading) return;
    setIsProcessing(true);
    setStep('processing');
    setError(null);
    setResult(null);

    try {
      const s = MODELS[modelKey].scale;
      const res = await upscale(imageData.img, modelKey, s, (p: ProgressState) => setProgress(p));
      setResult(res);
      setStep('result');
      setProgress({ percent: 100, text: 'Complete!' });
    } catch (err: any) {
      setError(err.message || 'Upscaling failed.');
      setStep('config');
      setProgress({ percent: 0, text: '' });
    } finally {
      setIsProcessing(false);
    }
  }, [imageData, isProcessing, modelLoading, upscale, modelKey]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const canvas = document.createElement('canvas');
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext('2d')!;
    const rgbaClone = new Uint8ClampedArray(result.rgba);
    ctx.putImageData(new ImageData(rgbaClone, result.width, result.height), 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image_upscaled.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, [result]);

  const handleClear = useCallback(() => {
    clearImage();
    setResult(null);
    setError(null);
    setStep('upload');
    setProgress({ percent: 0, text: '' });
  }, [clearImage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isProcessing && (step === 'config' || step === 'result') && imageData) {
        handleUpscale();
      }
      if (e.key === 'Escape' && step !== 'processing') {
        handleClear();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, isProcessing, imageData, handleUpscale, handleClear]);

  const visibleError = error || imageError;

  return (
    <div className="min-h-screen bg-bg text-white font-sans flex justify-center">
      <div className="w-full max-w-[1040px] px-4 sm:px-6 py-8">
        <Header backend={backend} />
        <StepIndicator currentStep={step} />

        <UploadArea
          onFile={handleFile}
          isLoading={imageLoading}
          fileName={imageData?.name}
          fileSize={imageData?.size}
          onClear={handleClear}
        />

        <ErrorMessage
          message={visibleError}
          onDismiss={() => setError(null)}
        />

        <ImageComparison
          image={imageData}
          result={result}
          scale={MODELS[modelKey].scale}
        />

        <ControlPanel
          modelKey={modelKey}
          step={step}
          isProcessing={isProcessing}
          isLoading={modelLoading}
          hasResult={!!result}
          onModelChange={handleModelChange}
          onUpscale={handleUpscale}
          onDownload={handleDownload}
        />

        <ModelInfoPanel currentModel={modelKey} />

        <ProgressCard progress={progress} visible={step === 'processing' || step === 'result'} timeMs={result?.time} />

        <StatsBar
          image={imageData}
          result={result}
          backend={backend}
          modelKey={modelKey}
        />

        <footer className="mt-12 mb-4 text-center text-xs text-muted-dark">
          <p className="leading-relaxed">
            Powered by ONNX Runtime Web &middot; All processing happens locally.
            <br />
            Your images never leave your device.
          </p>
        </footer>
      </div>
    </div>
  );
}
