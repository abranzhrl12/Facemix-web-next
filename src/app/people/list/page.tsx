"use client";

import React from 'react';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import PeopleTable from '@/features/people/components/PeopleTable';
import Link from 'next/link';
import styles from './page.module.scss';

export default function PeopleListPage() {
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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/home" className={styles.breadcrumbLink}>
            Inicio
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Lista de Personas</span>
        </div>
        
        <div className={styles.actions}>
          <Link href="/people/register" className={styles.actionButton}>
            👤 Registrar Nueva Persona
          </Link>
          <Link href="/people/add-image" className={styles.actionButton}>
            📸 Agregar Imagen
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.pageTitle}>
          <h1>Gestión de Personas</h1>
          <p>Visualiza y gestiona todas las personas registradas en el sistema</p>
        </div>

        <PeopleTable />
      </div>
    </div>
  );
}
