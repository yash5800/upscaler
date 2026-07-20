import { useState, useCallback, useRef } from 'react';
import { detectBackend } from '../constants';
import { loadONNX, createSession } from '../utils/upscale';
import type { Backend, ModelKey } from '../types';

interface UseONNXReturn {
  ortRef: React.MutableRefObject<any>;
  backend: Backend | null;
  sessionRef: React.MutableRefObject<any>;
  isLoading: boolean;
  initONNX: () => Promise<void>;
  loadModel: (key: ModelKey) => Promise<boolean>;
}

export function useONNX(): UseONNXReturn {
  const ortRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);
  const [backend, setBackend] = useState<Backend | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initONNX = useCallback(async () => {
    if (ortRef.current) return;
    setIsLoading(true);
    try {
      const back = detectBackend();
      setBackend(back);
      const ort = await loadONNX();
      ortRef.current = ort;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadModel = useCallback(async (key: ModelKey): Promise<boolean> => {
    if (!ortRef.current) {
      await initONNX();
    }
    setIsLoading(true);
    try {
      const session = await createSession(ortRef.current, key);
      sessionRef.current = session;
      return true;
    } catch (e) {
      console.error('Failed to load model:', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [initONNX]);

  return { ortRef, backend, sessionRef, isLoading, initONNX, loadModel };
}
