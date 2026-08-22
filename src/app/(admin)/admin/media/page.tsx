'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { listFiles, deleteFile } from '@/lib/supabase/storage';
import type { MediaFile } from '@/types';

export default function MediaManager() {
  const [search, setSearch] = useState('');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listFiles().then(setFiles).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Medya Yöneticisi</h1>
          <p className="text-[#A1A1AA] text-sm">Yüklenen tüm görsel ve dosyaları yönetin.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Dosya ara" className="bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 text-white" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? <p className="text-[#A1A1AA]">Yükleniyor...</p> : filteredFiles.map((file) => (
          <div key={file.id} className="bg-[#111111] border border-[#222222] rounded-xl p-4">
            {file.type === 'image' ? <img src={file.url} alt={file.name} className="w-full aspect-video object-cover rounded-lg mb-3" /> : <ImageIcon className="w-12 h-12 text-[#52525B] mb-3" />}
            <div className="flex items-center justify-between gap-2"><span className="text-sm text-white truncate">{file.name}</span><button title="Sil" onClick={() => deleteFile(file.url).then(() => setFiles((current) => current.filter((item) => item.id !== file.id)))} className="text-red-400"><Trash2 className="w-4 h-4" /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
