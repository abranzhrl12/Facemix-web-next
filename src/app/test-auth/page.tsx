"use client";

import React from 'react';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import styles from './page.module.scss';

export default function TestAuthPage() {
  const { isAuthenticated, loading } = useRequireAuth();
  const { user, session } = useAuth();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <h1>🔒 Acceso Denegado</h1>
        <p>Esta página requiere autenticación.</p>
        <p>Redirigiendo al login...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>✅ Página de Prueba de Autenticación</h1>
      <div className={styles.userInfo}>
        <h2>Información del Usuario</h2>
        <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
        <p><strong>ID:</strong> {user?.id || 'No disponible'}</p>
        <p><strong>Sesión Activa:</strong> {session ? '✅ Sí' : '❌ No'}</p>
        <p><strong>Autenticado:</strong> {isAuthenticated ? '✅ Sí' : '❌ No'}</p>
      </div>
      
      <div className={styles.links}>
        <h3>Enlaces de Prueba</h3>
        <a href="/people/register">📝 Registrar Persona</a>
        <a href="/people/add-image">📸 Agregar Imagen</a>
        <a href="/home">🏠 Volver al Dashboard</a>
      </div>
    </div>
  );
}
