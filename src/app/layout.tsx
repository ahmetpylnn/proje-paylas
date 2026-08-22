import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/shared/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ByteHub — Proje Paylaşım Platformu',
    template: '%s | ByteHub',
  },
  description: 'Geliştiricilerin kendi yazılım projelerini, web sitelerini, oyunlarını ve uygulamalarını paylaştığı platform.',
  keywords: ['yazılım', 'proje', 'açık kaynak', 'geliştirici', 'topluluk', 'bytehub'],
  authors: [{ name: 'ByteHub' }],
  creator: 'ByteHub',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'ByteHub',
    title: 'ByteHub — Proje Paylaşım Platformu',
    description: 'Modern geliştirici topluluğunda projelerini keşfet ve paylaş.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ByteHub — Proje Paylaşım Platformu',
    description: 'Modern geliştirici topluluğunda projelerini keşfet ve paylaş.',
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
    <html lang="tr" className={inter.variable} suppressHydrationWarning>
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
