'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { onAuthChange, isAdmin } from '@/lib/supabase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdminUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdminUser: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Do not leave the guard waiting forever if auth is unavailable.
    const timeout = setTimeout(() => setLoading(false), 5000);

    const unsubscribe = onAuthChange((u, session) => {
      clearTimeout(timeout);
      setUser(u);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdminUser: isAdmin(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
