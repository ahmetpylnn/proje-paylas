import Link from 'next/link';
import { FileText } from 'lucide-react';
import { safeGetBlogPosts } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Blog',
  description: 'ahmetpylnn üzerindeki notlar ve yazılar.',
};

export default async function BlogPage() {
  const posts = await safeGetBlogPosts();

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#3B82F6]">Notlar</p>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Blog</h1>
          <p className="mt-4 text-[var(--muted)]">Geliştirme süreçleri, teknik notlar ve proje arkasındaki kararlar.</p>
        </header>

        {posts.length ? (
          <div className="divide-y divide-[var(--card-border)] border-y border-[var(--card-border)]">
            {posts.map((post) => (
              <article key={post.id} className="py-7 first:pt-7">
                <time className="font-mono text-xs text-[var(--muted-foreground)]" dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                  <Link className="transition-colors hover:text-[#3B82F6]" href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-3 max-w-3xl text-[var(--muted)]">{post.summary}</p>
                <Link className="mt-4 inline-flex text-sm font-medium text-[#3B82F6] hover:underline" href={`/blog/${post.slug}`}>Yazıyı oku →</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-16 text-center">
            <FileText className="mx-auto mb-4 h-10 w-10 text-[var(--muted-foreground)]" />
            <h2 className="font-semibold text-[var(--foreground)]">Henüz yayınlanmış yazı bulunmuyor.</h2>
          </div>
        )}
      </div>
    </div>
  );
}
