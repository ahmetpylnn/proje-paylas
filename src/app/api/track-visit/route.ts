import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getSupabaseServer } from '@/lib/supabase/server';

// Hash IP with daily salt for privacy (GDPR compliant - no raw IP stored)
function hashIp(ip: string): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return createHash('sha256').update(ip + today + 'ahmetpylnn-visit-salt').digest('hex').slice(0, 16);
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const ipHash = hashIp(ip);
    const userAgent = req.headers.get('user-agent') || '';
    const { page = '/' } = await req.json().catch(() => ({}));

    const { error } = await getSupabaseServer().from('analytics_events').insert({
      type: 'visit', ip_hash: ipHash, page, user_agent: userAgent,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('track-visit error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
