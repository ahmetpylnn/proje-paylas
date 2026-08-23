import type { MetadataRoute } from 'next';
import { safeGetBlogPosts, safeGetProjects } from '@/lib/supabase/queries';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    safeGetProjects({ published: true }),
    safeGetBlogPosts(),
  ]);

  const projectUrls = projects.map((project) => ({
    url: absoluteUrl(`/project/${project.slug}`),
    lastModified: new Date(project.updatedAt || project.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogUrls = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    {
      url: absoluteUrl(),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: absoluteUrl('/projects'),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: absoluteUrl('/blog'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  return [...staticUrls, ...projectUrls, ...blogUrls];
}
