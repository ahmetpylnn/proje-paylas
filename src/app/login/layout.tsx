import { createMetadata } from '@/lib/seo';

export const metadata = {
  ...createMetadata({ title: 'Giriş', path: '/login', description: 'Yönetim paneline güvenli giriş.' }),
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}