import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Projeler',
  path: '/projects',
  description: 'ahmetpylnn tarafından geliştirilen yazılım projelerini ve açık kaynak çalışmalarını inceleyin.',
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}