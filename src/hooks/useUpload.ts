'use client';

import { useState, useCallback } from 'react';
import { uploadFile } from '@/lib/supabase/storage';

interface UploadState {
  progress: number;
  uploading: boolean;
  error: string | null;
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    progress: 0,
    uploading: false,
    error: null,
  });

  const uploadCover = useCallback(
    async (file: File, projectId: string): Promise<string> => {
      setState({ progress: 10, uploading: true, error: null });
      try {
        const url = await uploadFile(file, 'project-covers');
        setState({ progress: 100, uploading: false, error: null });
        return url;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Yükleme başarısız';
        setState({ progress: 0, uploading: false, error: msg });
        throw err;
      }
    },
    []
  );

  const uploadGallery = useCallback(
    async (files: File[], projectId: string): Promise<string[]> => {
      setState({ progress: 10, uploading: true, error: null });
      try {
        const urls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const url = await uploadFile(files[i], 'project-images');
          urls.push(url);
          setState((prev) => ({ ...prev, progress: Math.round(((i + 1) / files.length) * 100) }));
        }
        setState({ progress: 100, uploading: false, error: null });
        return urls;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Yükleme başarısız';
        setState({ progress: 0, uploading: false, error: msg });
        throw err;
      }
    },
    []
  );

  const uploadZip = useCallback(
    async (file: File, projectId: string): Promise<string> => {
      setState({ progress: 10, uploading: true, error: null });
      try {
        const url = await uploadFile(file, 'project-images');
        setState({ progress: 100, uploading: false, error: null });
        return url;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Yükleme başarısız';
        setState({ progress: 0, uploading: false, error: msg });
        throw err;
      }
    },
    []
  );

  const uploadAvatarFile = useCallback(
    async (file: File): Promise<string> => {
      setState({ progress: 10, uploading: true, error: null });
      try {
        const url = await uploadFile(file, 'avatars');
        setState({ progress: 100, uploading: false, error: null });
        return url;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Yükleme başarısız';
        setState({ progress: 0, uploading: false, error: msg });
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ progress: 0, uploading: false, error: null });
  }, []);

  return { ...state, uploadCover, uploadGallery, uploadZip, uploadAvatarFile, reset };
}
