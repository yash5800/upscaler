import { useState, useCallback } from 'react';
import type { ImageData } from '../types';

interface UseImageFileReturn {
  imageData: ImageData | null;
  isLoading: boolean;
  error: string | null;
  handleFile: (file: File) => void;
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
      const img = new Image();
      img.onload = () => {
        if (img.width > 4096 || img.height > 4096) {
          setError('Maximum image size is 4096×4096 pixels.');
          setIsLoading(false);
          return;
        }
        setImageData({
          file,
          url: e.target!.result as string,
          img,
          width: img.width,
          height: img.height,
          name: file.name,
          size: file.size,
        });
        setIsLoading(false);
      };
      img.src = e.target!.result as string;
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  return { imageData, isLoading, error, handleFile, clear };
}
