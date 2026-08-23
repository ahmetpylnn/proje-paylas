import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getBlogPostBySlug } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';
import { absoluteUrl, createMetadata, DEFAULT_OG_IMAGE, jsonLd, SITE_NAME } from '@/lib/seo';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) {
    return { title: 'Sayfa Bulunamadı', robots: { index: false, follow: false } };
  }

  return createMetadata({
    title: post.title,
    description: post.summary,
    path: `/blog/${post.slug}`,
    image: post.coverImage || DEFAULT_OG_IMAGE,
    type: 'article',
    keywords: post.tags,
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) notFound();

  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    url: postUrl,
    author: { '@type': 'Person', name: SITE_NAME, url: absoluteUrl() },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    ...(post.coverImage ? { image: post.coverImage } : {}),
  };

  return (
    <article className="min-h-screen px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">← Blog</Link>
        <time className="mt-8 block font-mono text-xs text-[var(--muted-foreground)]" dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg text-[var(--muted)]">{post.summary}</p>
        <div className="prose prose-dark mt-10 max-w-none border-t border-[var(--card-border)] pt-8"><ReactMarkdown>{post.content}</ReactMarkdown></div>
      </div>
    </article>
  );
}
