import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Obtener la sesión actual con mejor manejo de errores
  let session = null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('⚠️ Error obteniendo sesión en middleware:', error.message);
    } else {
      session = data.session;
    }
  } catch (error) {
    console.log('⚠️ Error inesperado en middleware:', error);
  }

  // SOLO proteger rutas de autenticación (login/signup)
  // Las rutas protegidas se manejan por useRequireAuth del lado del cliente
  const authRoutes = [
    '/login',
    '/signup'
  ];

  const { pathname } = req.nextUrl;

  console.log('🔍 Middleware - Ruta:', pathname, 'Sesión:', !!session, 'Pathname:', pathname);

  // Si el usuario está autenticado y trata de acceder a rutas de auth, redirigir a home
  if (session && authRoutes.includes(pathname)) {
    console.log('🔄 Usuario autenticado en ruta de auth, redirigiendo a /home');
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // Permitir acceso a todas las demás rutas - la autenticación se maneja del lado del cliente
  console.log('✅ Middleware - Acceso permitido a:', pathname, '(autenticación manejada por useRequireAuth)');
  return res;
}

export const config = {
  matcher: [
    /*
     * Solo proteger rutas de autenticación específicas
     * - login
     * - signup
     */
    '/login',
    '/signup',
  ],
};
