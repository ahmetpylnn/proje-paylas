'use client';

import type { ReactNode } from 'react';
import { incrementDownloadCount, recordAnalyticsEvent } from '@/lib/supabase/queries';

type EventType = 'download' | 'github_click' | 'demo_click';

interface Props {
  href: string;
  eventType: EventType;
  projectId: string;
  projectTitle: string;
  className: string;
  children: ReactNode;
  download?: boolean;
}

export default function TrackedProjectLink({ href, eventType, projectId, projectTitle, className, children, download }: Props) {
  function track() {
    void recordAnalyticsEvent({ type: eventType, projectId, projectTitle });
    if (eventType === 'download') void incrementDownloadCount(projectId);
  }

  return <a href={href} download={download} onClick={track} className={className} target={eventType === 'download' ? undefined : '_blank'} rel={eventType === 'download' ? undefined : 'noopener noreferrer'}>{children}</a>;
}
