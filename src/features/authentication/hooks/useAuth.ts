"use client";

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { UserProfile } from '../services/authService';

// Interface para el estado de autenticación (ISP)
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

// Interface para el hook de autenticación (ISP)
export interface IUseAuth {
  // Estado
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  
  // Métodos
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  
  // Utilidades
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOperator: boolean;
  isSupervisor: boolean;
}

// Hook personalizado para autenticación (SRP)
export const useAuth = (): IUseAuth => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  // Función para actualizar el estado (OCP)
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Función de login
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login para:', email);
      updateState({ loading: true, error: null });
      
      const { user, error } = await authService.signIn(email, password);
      
      if (error) {
        console.log('❌ Error en login:', error.message);
        updateState({ error, loading: false });
        return;
      }

      if (user) {
        console.log('✅ Login exitoso para usuario:', user.email);
        const session = await authService.getCurrentSession();
        updateState({ user, session, loading: false, error: null });
        // NO redirigir aquí, dejar que el componente padre maneje la redirección
      }
    } catch (error) {
      console.log('💥 Error inesperado en login:', error);
      updateState({ error: error as AuthError, loading: false });
    }
  }, [updateState]);

  // Función de registro
  const signUp = useCallback(async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      updateState({ loading: true, error: null });
      
      const { user, error } = await authService.signUp(email, password, userData);
      
      if (error) {
        updateState({ error, loading: false });
        return;
      }

      if (user) {
        const session = await authService.getCurrentSession();
        updateState({ user, session, loading: false, error: null });
      }
    } catch (error) {
      updateState({ error: error as AuthError, loading: false });
    }
  }, [updateState]);

  // Función de logout
  const signOut = useCallback(async () => {
    try {
      updateState({ loading: true });
      
      const { error } = await authService.signOut();
      
      if (error) {
        updateState({ error, loading: false });
        return;
      }

      updateState({ user: null, session: null, loading: false, error: null });
    } catch (error) {
      updateState({ error: error as AuthError, loading: false });
    }
  }, [updateState]);

  // Función para resetear contraseña
  const resetPassword = useCallback(async (email: string) => {
    try {
      updateState({ loading: true, error: null });
      
      const { error } = await authService.resetPassword(email);
      
      if (error) {
        updateState({ error, loading: false });
        return;
      }

      updateState({ loading: false });
    } catch (error) {
      updateState({ error: error as AuthError, loading: false });
    }
  }, [updateState]);

  // Función para actualizar contraseña
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      updateState({ loading: true, error: null });
      
      const { error } = await authService.updatePassword(newPassword);
      
      if (error) {
        updateState({ error, loading: false });
        return;
      }

      updateState({ loading: false });
    } catch (error) {
      updateState({ error: error as AuthError, loading: false });
    }
  }, [updateState]);

  // Efecto para verificar la sesión al cargar
  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        console.log('🔍 useAuth - Verificando sesión actual...');
        
        // Verificar si hay una sesión activa
        const session = await authService.getCurrentSession();
        const user = await authService.getCurrentUser();
        
        // Verificar si el componente sigue montado antes de actualizar el estado
        if (!isMounted) return;
        
        console.log('📋 useAuth - Sesión encontrada:', !!session, 'Usuario:', !!user);
        
        if (session && user) {
          console.log('✅ useAuth - Usuario autenticado encontrado:', user.email);
          updateState({ user, session, loading: false, error: null });
        } else {
          console.log('ℹ️ useAuth - No hay sesión activa');
          updateState({ user: null, session: null, loading: false, error: null });
        }
      } catch (error) {
        console.error('❌ useAuth - Error verificando sesión:', error);
        if (isMounted) {
          updateState({ loading: false, error: null });
        }
      }
    };

    checkSession();

    // Cleanup function para evitar actualizaciones de estado en componentes desmontados
    return () => {
      isMounted = false;
    };
  }, [updateState]);

  // Efecto para detectar cuando el usuario se autentica exitosamente
  useEffect(() => {
    if (state.user && state.session && !state.loading) {
      console.log('🎯 Usuario autenticado exitosamente, notificando cambio de estado');
      // Este efecto se ejecuta cuando el usuario se autentica
    }
  }, [state.user, state.session, state.loading]);

  // Computed properties (LSP)
  const isAuthenticated = !!state.user && !!state.session;
  const isAdmin = state.user?.user_metadata?.role === 'admin';
  const isOperator = state.user?.user_metadata?.role === 'operator';
  const isSupervisor = state.user?.user_metadata?.role === 'supervisor';

  return {
    // Estado
    user: state.user,
    session: state.session,
    loading: state.loading,
    error: state.error,
    
    // Métodos
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    
    // Utilidades
    isAuthenticated,
    isAdmin,
    isOperator,
    isSupervisor,
  };
};
