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
  return user?.app_metadata?.role === 'admin';
};
