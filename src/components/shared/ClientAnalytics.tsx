'use client';

import { useEffect, useRef } from 'react';
import { incrementViewCount, recordAnalyticsEvent } from '@/lib/supabase/queries';

export default function ClientAnalytics({
  type,
  projectId,
  projectTitle,
  page,
}: {
  type: 'view' | 'download';
  projectId?: string;
  projectTitle?: string;
  page?: string;
}) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;

    // Record analytics event (project views/downloads)
    if (projectId) {
      recordAnalyticsEvent({ type, projectId, projectTitle }).catch(() => {});
      if (type === 'view') incrementViewCount(projectId).catch(() => {});
    }

    // Track visitor via server-side API (IP hashed server-side, GDPR compliant)
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: page || window.location.pathname }),
    }).catch(() => {});
  }, [type, projectId, projectTitle, page]);

  return null;
}
