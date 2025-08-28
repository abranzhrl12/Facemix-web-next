import { supabase } from '@/shared/lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// Interface para el servicio de autenticación (ISP)
export interface IAuthService {
  signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }>;
  signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<{ user: User | null; error: AuthError | null }>;
  signOut(): Promise<{ error: AuthError | null }>;
  getCurrentUser(): Promise<User | null>;
  getCurrentSession(): Promise<Session | null>;
  resetPassword(email: string): Promise<{ error: AuthError | null }>;
  updatePassword(newPassword: string): Promise<{ error: AuthError | null }>;
}

// Interface para el perfil de usuario
export interface UserProfile {
  nombre: string;
  apellido?: string;
  telefono?: string;
  direccion?: string;
  area_trabajo?: string;
  cargo?: string;
  fecha_ingreso?: string;
}

// Implementación del servicio de autenticación (SRP)
export class AuthService implements IAuthService {
  
  async signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      console.log('🔐 AuthService.signIn llamado para:', email);
      
      // Verificar si Supabase está configurado
      if (!supabase.isConfigured()) {
        console.warn('⚠️ Supabase no está configurado, simulando error de autenticación');
        return { 
          user: null, 
          error: { 
            message: 'Servicio de autenticación no disponible', 
            status: 503 
          } as AuthError 
        };
      }

      console.log('✅ Supabase configurado, intentando login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('❌ Error de Supabase:', error.message);
        return { user: null, error };
      }

      console.log('✅ Login exitoso en Supabase, usuario:', data.user?.email);
      
      // Si el login es exitoso, obtener el perfil del usuario desde system_users
      // SOLO si Supabase está configurado correctamente
      if (data.user && supabase.isConfigured()) {
        // Omitir la obtención del perfil por el momento para evitar errores
        console.log('ℹ️ Login exitoso, omitiendo obtención de perfil por el momento');
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.log('💥 Error inesperado en AuthService.signIn:', error);
      return { user: null, error: error as AuthError };
    }
  }

  async signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      // Si el registro es exitoso, crear el perfil en system_users
      if (data.user) {
        // Omitir la creación del perfil por el momento para evitar errores
        console.log('ℹ️ Registro exitoso, omitiendo creación de perfil por el momento');
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Métodos privados para manejar el perfil de usuario
  // Omitidos por el momento para evitar errores con el cliente dummy
  private async createUserProfile(userId: string, email: string, userData: Partial<UserProfile>): Promise<void> {
    console.log('ℹ️ createUserProfile omitido por el momento');
  }

  private async fetchUserProfile(userId: string): Promise<void> {
    console.log('ℹ️ fetchUserProfile omitido por el momento');
  }
}

// Instancia única del servicio (Singleton)
export const authService = new AuthService();
