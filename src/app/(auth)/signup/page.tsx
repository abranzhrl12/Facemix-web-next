"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import styles from './page.module.scss';

export default function SignUpPage() {
  const router = useRouter();
  const { user, session, loading } = useAuth();

  // Efecto para detectar cuando el usuario se registra exitosamente
  useEffect(() => {
    if (user && session && !loading) {
      console.log('🎯 Usuario registrado detectado en SignUpPage, redirigiendo a /home');
      // Usar setTimeout para evitar redirecciones múltiples
      const timer = setTimeout(() => {
        router.replace('/home');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, session, loading, router]);

  const handleSignUpSuccess = () => {
    console.log('🎯 handleSignUpSuccess llamado');
    // La redirección se maneja automáticamente por el useEffect
  };

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>FaceMix</h1>
          <p>Sistema de Reconocimiento Facial</p>
        </div>
        
        <div className={styles.form}>
          <h2>Crear Cuenta</h2>
          <p>Esta funcionalidad estará disponible pronto.</p>
          <button 
            onClick={handleSwitchToLogin}
            className={styles.primaryButton}
          >
            Ir al Login
          </button>
        </div>
      </div>
    </div>
  );
}
