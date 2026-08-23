import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import CategorySection from '@/components/home/CategorySection';
import TechStackSection from '@/components/home/TechStackSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';
import AnnouncementSection from '@/components/home/AnnouncementSection';
import { safeGetProjects, safeGetDashboardStats, safeGetSiteSettings } from '@/lib/supabase/queries';
import { absoluteUrl, createMetadata, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, jsonLd, SITE_NAME } from '@/lib/seo';

export const revalidate = 0;

export async function generateMetadata() {
  const settings = await safeGetSiteSettings();
  return createMetadata({
    title: settings?.seoTitle || undefined,
    description: settings?.seoDescription || DEFAULT_DESCRIPTION,
    path: '/',
    image: settings?.ogImage || DEFAULT_OG_IMAGE,
  });
}

export default async function HomePage() {
  const [featuredProjects, stats, allProjects, settings] = await Promise.all([
    safeGetProjects({ published: true, featured: true, limitCount: 6 }),
    safeGetDashboardStats(),
    safeGetProjects({ published: true }),
    safeGetSiteSettings(),
  ]);

  const categoryCounts = allProjects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: absoluteUrl(),
            description: settings?.seoDescription || DEFAULT_DESCRIPTION,
            inLanguage: 'tr-TR',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: settings?.developerName || SITE_NAME,
            url: absoluteUrl(),
            ...(settings?.developerAvatar ? { image: settings.developerAvatar } : {}),
            ...(settings?.githubUrl || settings?.linkedinUrl || settings?.twitterUrl
              ? { sameAs: [settings.githubUrl, settings.linkedinUrl, settings.twitterUrl].filter(Boolean) }
              : {}),
            ...(settings?.developerTitle ? { jobTitle: settings.developerTitle } : {}),
          }),
        }}
      />
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <CategorySection counts={categoryCounts} />
      <TechStackSection />
      <StatsSection stats={stats} linesOfCode={settings?.linesOfCode || ''} />
      {/* Announcement + CTA */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <div className="flex-1">
            <AnnouncementSection text={settings?.announcement || ''} />
          </div>
          <div className="hidden md:block w-px bg-[#1a1a1a]" />
          <div className="flex-1">
            <CTASection />
          </div>
        </div>
      </div>
    </>
  );
}
