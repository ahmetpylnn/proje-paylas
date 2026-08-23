'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PUBLIC_VIEW_COUNT_KEY = 'public-view-count';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const storedCount = Number(window.localStorage.getItem(PUBLIC_VIEW_COUNT_KEY));
    const nextCount = Number.isFinite(storedCount) && storedCount >= 42 ? storedCount + 1 : 42;
    window.localStorage.setItem(PUBLIC_VIEW_COUNT_KEY, String(nextCount));

    void fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname }),
    });
  }, [pathname]);

  return null;
}
