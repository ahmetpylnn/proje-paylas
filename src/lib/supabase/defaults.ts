import type { SiteSettings, DashboardStats } from '@/types';

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  totalProjects: 0,
  totalViews: 0,
  totalDownloads: 0,
  publishedProjects: 0,
  featuredProjects: 0,
  draftProjects: 0,
};

export const DEFAULT_SITE_SETTINGS: Omit<SiteSettings, 'id' | 'updatedAt'> = {
  developerName: 'Geliştirici Adı',
  developerTitle: 'Yazılım Geliştirici',
  developerBio: 'Merhaba! Ben tutkulu bir yazılım geliştiriciyim. Yeni teknolojiler öğrenmeyi ve açık kaynak projelere katkıda bulunmayı seviyorum.',
  developerAvatar: '',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  twitterUrl: '',
  email: 'hello@example.com',
  websiteUrl: 'https://example.com',
  techStack: [],
  categories: [],
  heroTitle: 'Yazılım Projelerini Keşfet',
  heroSubtitle: 'Modern açık kaynak ve kişisel projeler',
  seoTitle: 'ByteHub — Yazılım Projeleri',
  seoDescription: 'Modern yazılım projelerini keşfet, incele ve indir.',
  ogImage: '',
  announcement: '🚀 Yenilikler — Yeni projeler ve güncellemeler burada!',
  linesOfCode: '10,000+',
};
