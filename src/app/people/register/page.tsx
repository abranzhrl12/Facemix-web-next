"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import PersonRegistrationForm from '@/features/people/components/PersonRegistrationForm';
import styles from './page.module.scss';

export default function PersonRegistrationPage() {
  const router = useRouter();

  const handleRegistrationSuccess = (personId: string) => {
    console.log('✅ Persona registrada exitosamente:', personId);
    // Aquí podrías redirigir a una página de éxito o al dashboard
    // Por ahora solo mostramos un mensaje
    alert(`🎉 ¡Persona registrada exitosamente!\n\nID: ${personId}\n\nLa persona ha sido registrada en el sistema de reconocimiento facial.`);
  };

  const handleCancel = () => {
    // Redirigir al dashboard o página principal
    router.push('/dashboard');
  };

  return (
    <div className={styles.personRegistrationPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>FaceMix</h1>
          <p>Sistema de Reconocimiento Facial</p>
        </div>
        
        <PersonRegistrationForm
          onSuccess={handleRegistrationSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
