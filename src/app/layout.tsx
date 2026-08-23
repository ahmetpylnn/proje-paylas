import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/shared/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'ahmetpylnn — Yazılım Projeleri',
    template: '%s | ahmetpylnn',
  },
  description: 'Ahmet Paylan tarafından geliştirilen yazılım projelerini, deneysel çalışmaları ve kişisel üretimleri keşfedin.',
  keywords: ['Ahmet Paylan', 'ahmetpylnn', 'yazılım', 'proje', 'açık kaynak', 'geliştirici'],
  authors: [{ name: 'Ahmet Paylan' }],
  creator: 'Ahmet Paylan',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ahmetpylnn.vercel.app',
    siteName: 'ahmetpylnn',
    title: 'ahmetpylnn — Yazılım Projeleri',
    description: 'Ahmet Paylan tarafından geliştirilen yazılım projelerini keşfedin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ahmetpylnn — Yazılım Projeleri',
    description: 'Ahmet Paylan tarafından geliştirilen yazılım projelerini keşfedin.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              theme="system"
              position="bottom-right"
              toastOptions={{
                className: 'dark:bg-[#111111] dark:border-[#222222] dark:text-white bg-white border-gray-200 text-gray-900',
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
