'use client';

import { useEffect, useRef } from 'react';
import { incrementViewCount, recordAnalyticsEvent } from '@/lib/supabase/queries';

export default function ClientAnalytics({
  type,
  projectId,
  projectTitle,
}: {
  type: 'view' | 'download';
  projectId?: string;
  projectTitle?: string;
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
  }, [type, projectId, projectTitle]);

  return null;
}
