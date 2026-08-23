'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';
import { getBlogPostById } from '@/lib/supabase/queries';
import type { BlogPost } from '@/types';

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  useEffect(() => { getBlogPostById(id).then(setPost); }, [id]);
  if (!post) return <p className="p-8 text-[#A1A1AA]">Yükleniyor…</p>;
  return <div><h1 className="mb-6 text-3xl font-bold text-white">Yazıyı düzenle</h1><BlogEditor post={post} /></div>;
}
