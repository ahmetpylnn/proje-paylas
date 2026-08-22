import { supabase } from './client';
import type { MediaFile } from '@/types';

const BUCKETS = ['avatars', 'project-covers', 'project-images', 'blog-images'] as const;

export const uploadFile = async (
  file: File,
  folder: 'avatars' | 'project-covers' | 'project-images' | 'blog-images'
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error } = await supabase.storage
    .from(folder)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from(folder)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Basic extraction of path from public URL. Supabase URLs end with /storage/v1/object/public/bucket_name/file_path
    const matches = url.match(/\/public\/([^/]+)\/(.+)$/);
    if (!matches || !matches[1] || !matches[2]) {
      console.warn('Could not extract file path from URL to delete:', url);
      return;
    }
    const bucket = matches[1];
    const path = matches[2];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const listFiles = async (): Promise<MediaFile[]> => {
  const files: MediaFile[] = [];
  for (const bucket of BUCKETS) {
    const { data, error } = await supabase.storage.from(bucket).list('', {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) throw error;
    for (const file of data || []) {
      if (!file.name) continue;
      const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(file.name);
      files.push({
        id: `${bucket}/${file.name}`,
        name: file.name,
        url: publicUrl.publicUrl,
        type: file.metadata?.mimetype?.startsWith('image/') ? 'image' : 'other',
        size: file.metadata?.size || 0,
        path: file.name,
        createdAt: file.created_at || new Date().toISOString(),
      });
    }
  }
  return files;
};
