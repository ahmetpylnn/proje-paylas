'use client';
/* eslint-disable react-hooks/static-components */

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Code2, Menu, X, Home, LayoutDashboard, FolderOpen, Image, Mail, Settings, BarChart2 } from 'lucide-react';
import { ADMIN_NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/supabase/auth';
import { toast } from 'sonner';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, FolderOpen, Image, Mail, Settings, BarChart2,
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      toast.success('Çıkış yapıldı.');
      router.push('/');
    } catch (error) {
      toast.error('Çıkış yapılamadı.');
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-bg-card border-r border-border text-text-primary w-64">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group mb-8">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
            <Code2 className="w-4 h-4 text-text-primary" />
          </div>
          <span className="font-bold text-lg">ahmetpylnn</span>
        </Link>

        <nav className="space-y-1">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon];
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#3B82F6] text-text-primary'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                )}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
        >
          <Home className="w-5 h-5" />
          Siteye Dön
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-bg-card border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-text-primary" />
          </div>
          <span className="font-bold text-text-primary text-lg">Admin</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-64 transform transition-transform duration-200">
            <SidebarContent />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-[-40px] p-2 text-text-primary bg-bg-card rounded-r-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-50">
        <SidebarContent />
      </div>
    </>
  );
}
