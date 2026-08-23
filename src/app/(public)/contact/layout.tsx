import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'İletişim',
  path: '/contact',
  description: 'Proje fikirleri, iş teklifleri ve iş birlikleri için Ahmet Paylan ile iletişime geçin.',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}