"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks/useAuth';

interface UseRequireAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

interface UseRequireAuthReturn {
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  session: any;
}

export const useRequireAuth = (
  options: UseRequireAuthOptions = {}
): UseRequireAuthReturn => {
  const { redirectTo = '/login', requireAuth = true } = options;
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pathname, setPathname] = useState<string>('');

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    console.log('🔍 useRequireAuth - useEffect ejecutándose:', {
      user: !!user,
      session: !!session,
      authLoading,
      pathname,
      redirectTo,
      requireAuth
    });

    if (authLoading) {
      console.log('⏳ useRequireAuth - Esperando autenticación...');
      return;
    }

    if (requireAuth && !user) {
      console.log('🚫 useRequireAuth - Usuario no autenticado, redirigiendo a:', redirectTo);
      router.replace(redirectTo);
    } else if (user && !requireAuth) {
      console.log('✅ useRequireAuth - Usuario autenticado en ruta de auth, redirigiendo a /home');
      router.replace('/home');
    } else {
      console.log('✅ useRequireAuth - Estado válido, no se requiere redirección');
    }

    setLoading(false);
  }, [user, session, authLoading, pathname, redirectTo, requireAuth, router]);

  console.log('🔍 useRequireAuth - Render:', {
    tieneUsuario: !!user, 
    tieneSesion: !!session,
    pathname,
    redirectTo,
    isAuthenticated: !!user,
    loading,
    authLoading
  });

  return {
    isAuthenticated: !!user,
    loading: loading || authLoading,
    user,
    session
  };
};
