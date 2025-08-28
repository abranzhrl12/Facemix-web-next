"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import AddImageToPersonForm from '@/features/people/components/AddImageToPersonForm';
import styles from './page.module.scss';

export default function AddImageToPersonPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El hook se encargará de la redirección
  }

  const handleImageAddedSuccess = (personId: string, embeddingId: string) => {
    console.log('✅ Imagen agregada exitosamente:', { personId, embeddingId });
    alert(`🎉 ¡Imagen agregada exitosamente!\n\nID de Persona: ${personId}\nID de Embedding: ${embeddingId}\n\nLa nueva imagen ha sido procesada y agregada al sistema de reconocimiento facial.`);
  };

  const handleCancel = () => {
    router.push('/home');
  };

  return (
    <div className={styles.addImagePage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>FaceMix</h1>
          <p>Sistema de Reconocimiento Facial</p>
        </div>
        
        <AddImageToPersonForm
          onSuccess={handleImageAddedSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
