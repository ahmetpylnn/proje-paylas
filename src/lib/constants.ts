export const SITE_NAME = 'ahmetpylnn';
export const SITE_DESCRIPTION =
  'ahmetpylnn tarafından geliştirilen yazılım projeleri, deneysel çalışmalar ve kişisel üretimler.';

export const CATEGORIES = [
  { id: 'web', name: 'Web', icon: 'Globe', color: '#0070F3' },
  { id: 'mobil', name: 'Mobil', icon: 'Smartphone', color: '#8B5CF6' },
  { id: 'oyun', name: 'Oyun', icon: 'Gamepad2', color: '#EC4899' },
  { id: 'ai', name: 'AI', icon: 'Cpu', color: '#10B981' },
  { id: 'desktop', name: 'Desktop', icon: 'Monitor', color: '#F59E0B' },
  { id: 'backend', name: 'Backend', icon: 'Server', color: '#EF4444' },
  { id: 'diger', name: 'Diğer', icon: 'Layers', color: '#6B7280' },
] as const;

export const TECHNOLOGIES = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
  'Node.js', 'Express', 'NestJS', 'FastAPI', 'Django',
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'C++',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite',
  'Supabase', 'AWS', 'GCP', 'Azure',
  'Docker', 'Kubernetes', 'Terraform',
  'Tailwind CSS', 'Shadcn/UI', 'Material UI', 'Chakra UI',
  'GraphQL', 'REST', 'WebSocket', 'gRPC',
  'React Native', 'Flutter', 'Swift', 'Kotlin',
  'Electron', 'Tauri',
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Yeni' },
  { value: 'most-viewed', label: 'Popüler' },
  { value: 'most-downloaded', label: 'Çok Görüntülenen' },
] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/projects', label: 'Projeler' },
  { href: '/about', label: 'Hakkımda' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'İletişim' },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/projects', label: 'Projeler', icon: 'FolderOpen' },
  { href: '/admin/blog', label: 'Blog', icon: 'FileText' },
  { href: '/admin/media', label: 'Medya', icon: 'Image' },
  { href: '/admin/messages', label: 'Mesajlar', icon: 'Mail' },
  { href: '/admin/analytics', label: 'Analitik', icon: 'BarChart2' },
  { href: '/admin/settings', label: 'Ayarlar', icon: 'Settings' },
] as const;

export const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};

export const ACCEPTED_ZIP_TYPES = {
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_ZIP_SIZE = 500 * 1024 * 1024;
export const MAX_GALLERY_IMAGES = 10;
