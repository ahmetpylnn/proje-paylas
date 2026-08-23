'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBlogPost, updateBlogPost } from '@/lib/supabase/queries';
import { generateSlug } from '@/lib/utils';
import type { BlogPost } from '@/types';
import { toast } from 'sonner';

type FormData = Pick<BlogPost, 'title' | 'slug' | 'summary' | 'content' | 'coverImage' | 'tags' | 'published'>;

export default function BlogEditor({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(post ?? { title: '', slug: '', summary: '', content: '', coverImage: '', tags: [], published: false });
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const normalized = { ...form, slug: form.slug || generateSlug(form.title) };
      if (post) await updateBlogPost(post.id, normalized);
      else await createBlogPost(normalized);
      toast.success(post ? 'Yazı güncellendi.' : 'Yazı oluşturuldu.');
      router.push('/admin/blog');
      router.refresh();
    } catch {
      toast.error('Yazı kaydedilemedi. Başlık ve slug benzersiz olmalıdır.');
    } finally { setSaving(false); }
  }

  const inputClass = 'w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[#3B82F6]';
  return <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5">
    <div><label className="mb-1 block text-sm text-[var(--muted)]">Başlık</label><input required value={form.title} onChange={(e) => update('title', e.target.value)} onBlur={() => !form.slug && update('slug', generateSlug(form.title))} className={inputClass} /></div>
    <div><label className="mb-1 block text-sm text-[var(--muted)]">Slug</label><input required value={form.slug} onChange={(e) => update('slug', generateSlug(e.target.value))} className={inputClass} /></div>
    <div><label className="mb-1 block text-sm text-[var(--muted)]">Özet</label><textarea required rows={3} value={form.summary} onChange={(e) => update('summary', e.target.value)} className={inputClass} /></div>
    <div><label className="mb-1 block text-sm text-[var(--muted)]">İçerik (Markdown)</label><textarea required rows={14} value={form.content} onChange={(e) => update('content', e.target.value)} className={`${inputClass} font-mono text-sm`} /></div>
    <div><label className="mb-1 block text-sm text-[var(--muted)]">Kapak görseli URL&apos;si</label><input value={form.coverImage} onChange={(e) => update('coverImage', e.target.value)} className={inputClass} /></div>
    <div><label className="mb-1 block text-sm text-[var(--muted)]">Etiketler</label><input value={form.tags.join(', ')} onChange={(e) => update('tags', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))} className={inputClass} placeholder="nextjs, supabase" /></div>
    <label className="flex items-center gap-2 text-sm text-[var(--foreground)]"><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Yayınla</label>
    <div className="flex gap-3"><button disabled={saving} className="rounded-md bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? 'Kaydediliyor…' : 'Kaydet'}</button><button type="button" onClick={() => router.back()} className="rounded-md border border-[var(--card-border)] px-4 py-2 text-sm text-[var(--foreground)]">İptal</button></div>
  </form>;
}
