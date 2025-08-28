"use client";

import React from 'react';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import CreateUserForm from '@/features/users/components/CreateUserForm';
import styles from './page.module.scss';

export default function CreateUserPage() {
  const { isAuthenticated, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useRequireAuth manejará la redirección
  }

  return (
    <div className={styles.createUserPage}>
      <div className={styles.breadcrumbs}>
        <span>Inicio</span>
        <span>/</span>
        <span>Usuarios</span>
        <span>/</span>
        <span>Crear Usuario</span>
      </div>

      <CreateUserForm />
    </div>
  );
}
