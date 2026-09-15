import { supabase } from './client';
import type { User, Session } from '@supabase/supabase-js';

export const onAuthChange = (callback: (user: User | null, session: Session | null) => void) => {
  // Initial session check
  supabase.auth.getSession().then(({ data: { session } }) => {
    callback(session?.user ?? null, session);
  });

  // Listen for changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null, session);
  });

  return () => {
    subscription.unsubscribe();
  };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user || !data.session) throw error || new Error('Authentication failed');
  return data;
};

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  // 1. Supabase custom claims
  if (user.app_metadata?.role === 'admin') return true;
  // 2. Environment variable fallback
  if (process.env.NEXT_PUBLIC_ADMIN_EMAIL && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) return true;
  
  // If neither is set, we deny access to be safe
  return false;
};
