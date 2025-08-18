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
        // Intentar obtener el perfil, pero NO fallar si no existe
        this.fetchUserProfile(data.user.id).catch(profileError => {
          console.warn('⚠️ Error obteniendo perfil, pero login exitoso:', profileError);
          console.log('ℹ️ El usuario puede no tener perfil en system_users aún');
          // NO fallar el login por un error en el perfil
        });
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
        await this.createUserProfile(data.user.id, email, userData);
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
  private async createUserProfile(userId: string, email: string, userData: Partial<UserProfile>): Promise<void> {
    try {
      // Verificar si Supabase está configurado antes de hacer la consulta
      if (!supabase.isConfigured()) {
        console.log('⚠️ Supabase no configurado, saltando createUserProfile');
        return;
      }

      // Verificar que el cliente tenga el método 'from' disponible
      if (typeof supabase.from !== 'function') {
        console.warn('⚠️ Método "from" no disponible en cliente Supabase');
        return;
      }

      const { error } = await supabase
        .from('system_users')
        .insert({
          supabase_user_id: userId,
          email,
          ...userData,
        });

      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        console.log('✅ Perfil de usuario creado exitosamente');
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      // No propagar el error para no fallar el registro
    }
  }

  private async fetchUserProfile(userId: string): Promise<void> {
    try {
      // Verificar si Supabase está configurado antes de hacer la consulta
      if (!supabase.isConfigured()) {
        console.log('⚠️ Supabase no configurado, saltando fetchUserProfile');
        return;
      }

      // Verificar que el cliente tenga el método 'from' disponible
      if (typeof supabase.from !== 'function') {
        console.warn('⚠️ Método "from" no disponible en cliente Supabase');
        return;
      }

      console.log('🔍 Buscando perfil para usuario:', userId);
      
      const { data, error } = await supabase
        .from('system_users')
        .select('*')
        .eq('supabase_user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Usuario no encontrado en system_users (normal si es nuevo)
          console.log('ℹ️ Usuario no tiene perfil en system_users aún (normal para usuarios nuevos)');
        } else {
          console.error('Error fetching user profile:', error);
        }
      } else {
        console.log('✅ Perfil de usuario obtenido:', data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // No propagar el error para no fallar el login
    }
  }
}

// Instancia única del servicio (Singleton)
export const authService = new AuthService();
