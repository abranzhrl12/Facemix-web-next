"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/features/authentication/components/LoginForm';
import styles from './page.module.scss';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    console.log('🎯 handleLoginSuccess llamado - redirigiendo a registro de personas');
    console.log('🎯 URL actual:', window.location.href);
    console.log('🎯 Redirigiendo a /people/register');
    
    // Redirigir a la página de registro de personas después del login exitoso
    router.push('/people/register');
  };

  const handleSwitchToSignUp = () => {
    // Redirigir a la página de registro
    router.push('/signup');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>FaceMix</h1>
          <p>Sistema de Reconocimiento Facial</p>
        </div>
        
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      </div>
    </div>
  );
}
