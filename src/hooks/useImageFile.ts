import { useState, useCallback } from 'react';
import type { ImageData } from '../types';

interface UseImageFileReturn {
  imageData: ImageData | null;
  isLoading: boolean;
  error: string | null;
  handleFile: (file: File) => void;
  loadDemoImage: () => void;
  clear: () => void;
}

export function useImageFile(): UseImageFileReturn {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clear = useCallback(() => {
    setImageData(null);
    setError(null);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a PNG, JPG, JPEG, or WEBP image.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target!.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.width > 8192 || img.height > 8192) {
          setError('Maximum input image size is 8192×8192 pixels.');
          setIsLoading(false);
          return;
        }
        setImageData({
          file,
          url,
          img,
          width: img.width,
          height: img.height,
          name: file.name,
          size: file.size,
        });
        setIsLoading(false);
      };
      img.src = url;
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const loadDemoImage = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Create a high-detail synthetic portrait/cyberpunk demo canvas
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d')!;

    // Background dark gradient
    const grad = ctx.createLinearGradient(0, 0, 640, 480);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(0.5, '#1E1B4B');
    grad.addColorStop(1, '#0284C7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    // Neon glowing rings & micro texture
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(320, 240, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#EC4899';
    ctx.beginPath();
    ctx.arc(320, 240, 90, 0, Math.PI * 2);
    ctx.stroke();

    // Stylized Face geometry
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(320, 210, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(300, 200, 8, 0, Math.PI * 2);
    ctx.arc(340, 200, 8, 0, Math.PI * 2);
    ctx.fill();

    // High detail grid lines & text
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('AI DEMO SAMPLE', 320, 340);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('640 x 480 Low-Res Input · Ready to Upscale to 8K', 320, 370);

    const dataUrl = canvas.toDataURL('image/png');
    const img = new Image();
    img.onload = () => {
      // Mock File object
      const blob = new Blob([], { type: 'image/png' });
      const file = new File([blob], 'demo_sample_portrait.png', { type: 'image/png' });

      setImageData({
        file,
        url: dataUrl,
        img,
        width: 640,
        height: 480,
        name: 'demo_sample_portrait.png',
        size: 142000
      });
      setIsLoading(false);
    };
    img.src = dataUrl;
  }, []);

  return { imageData, isLoading, error, handleFile, loadDemoImage, clear };
}
