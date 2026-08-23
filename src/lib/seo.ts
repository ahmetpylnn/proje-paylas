import type { Metadata } from 'next';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ahmetpylnn.vercel.app').replace(/\/$/, '');
export const SITE_NAME = 'Ahmet Paylan';
export const DEFAULT_TITLE = 'Ahmet Paylan — Yazılım Projeleri ve Geliştirici Portföyü';
export const DEFAULT_DESCRIPTION = "Ahmet Paylan'ın geliştirdiği yazılım projelerini, teknolojilerini ve çalışmalarını keşfedin.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`;

export function absoluteUrl(path = ''): string {
  return `${SITE_URL}/${path.replace(/^\//, '')}`.replace(/\/$/, '') || SITE_URL;
}

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  keywords,
  publishedTime,
  modifiedTime,
  robots,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  robots?: Metadata['robots'];
}): Metadata {
  const url = absoluteUrl(path);
  const metadata: Metadata = {
    title,
    description,
    keywords,
    robots,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: 'tr_TR',
      url,
      siteName: SITE_NAME,
      title: title || DEFAULT_TITLE,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title || SITE_NAME }],
      ...(type === 'article' && (publishedTime || modifiedTime)
        ? { publishedTime, modifiedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: title || DEFAULT_TITLE,
      description,
      images: [image],
    },
  };

  return metadata;
}

export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
