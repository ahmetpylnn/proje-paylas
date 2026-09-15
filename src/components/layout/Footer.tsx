import Link from 'next/link';
import { Code2, Mail, Heart } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '@/components/shared/BrandIcons';
import { NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
    { icon: LinkedinIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@example.com', label: 'E-posta' },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                <Code2 className="w-4 h-4 text-text-primary" />
              </div>
              <span className="font-bold text-text-primary text-lg">ahmetpylnn</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              ahmetpylnn&apos;in yazılım projeleri, deneysel çalışmaları ve kişisel üretimleri.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4 text-sm">Sayfalar</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4 text-sm">Bağlantılar</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-subtle hover:bg-bg-elevated transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {year} ahmetpylnn. Tüm hakları saklıdır.
          </p>
          <p className="text-text-muted text-sm flex items-center gap-1">
            Sevgiyle yapıldı <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
