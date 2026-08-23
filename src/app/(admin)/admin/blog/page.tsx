'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { deleteBlogPost, getBlogPosts, updateBlogPost } from '@/lib/supabase/queries';
import { useWhenAuthed } from '@/hooks/useWhenAuthed';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';
import { toast } from 'sonner';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  useWhenAuthed(async () => { try { setPosts(await getBlogPosts(false)); } catch { toast.error('Yazılar yüklenemedi.'); } finally { setLoading(false); } });
  async function remove(post: BlogPost) { if (!confirm(`“${post.title}” silinsin mi?`)) return; try { await deleteBlogPost(post.id); setPosts((items) => items.filter((item) => item.id !== post.id)); toast.success('Yazı silindi.'); } catch { toast.error('Yazı silinemedi.'); } }
  async function toggle(post: BlogPost) { try { await updateBlogPost(post.id, { published: !post.published }); setPosts((items) => items.map((item) => item.id === post.id ? { ...item, published: !item.published } : item)); } catch { toast.error('Durum değiştirilemedi.'); } }
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold text-white">Blog</h1><p className="text-sm text-[#A1A1AA]">Yazıları yönetin.</p></div><Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-md bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" />Yeni yazı</Link></div><div className="divide-y divide-[#222222] rounded-xl border border-[#222222] bg-[#111111]">{loading ? <p className="p-8 text-[#A1A1AA]">Yükleniyor…</p> : posts.length ? posts.map((post) => <div key={post.id} className="flex items-center justify-between gap-4 p-5"><div className="min-w-0"><Link className="font-medium text-white hover:text-[#3B82F6]" href={`/admin/blog/${post.id}`}>{post.title}</Link><p className="mt-1 text-xs text-[#52525B]">{formatDate(post.createdAt)}</p></div><div className="flex items-center gap-3"><button onClick={() => toggle(post)} className={`rounded px-2 py-1 text-xs ${post.published ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{post.published ? 'Yayında' : 'Taslak'}</button><button onClick={() => remove(post)} className="text-red-400" aria-label="Sil"><Trash2 className="h-4 w-4" /></button></div></div>) : <div className="p-12 text-center text-[#A1A1AA]"><FileText className="mx-auto mb-3 h-9 w-9" />Henüz yazı yok.</div>}</div></div>;
}
