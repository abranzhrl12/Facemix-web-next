"use client";

import React from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import styles from './page.module.scss';

export default function DashboardPage() {
  const { isAuthenticated, loading } = useRequireAuth();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

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
    <div className={styles.dashboardPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <h1>FaceMix</h1>
            <p>Sistema de Reconocimiento Facial</p>
          </div>
          <div className={styles.userInfo}>
            <span>Bienvenido, {user?.email}</span>
            <button onClick={handleSignOut} className={styles.signOutButton}>
              Cerrar Sesión
            </button>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.welcomeSection}>
            <h2>Panel de Control</h2>
            <p>Gestiona el sistema de reconocimiento facial desde aquí</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👤</div>
              <h3>Registro de Personas</h3>
              <p>Registra nuevas personas en el sistema con fotos para reconocimiento facial</p>
              <Link href="/people/register" className={styles.featureLink}>
                Registrar Persona
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📸</div>
              <h3>Agregar Imágenes</h3>
              <p>Agrega nuevas fotos a personas existentes para mejorar el reconocimiento</p>
              <Link href="/people/add-image" className={styles.featureLink}>
                Agregar Imagen
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>Monitoreo en Tiempo Real</h3>
              <p>Sistema de detección y reconocimiento facial en tiempo real</p>
              <Link href="/camera-monitoring" className={styles.featureLink}>
                Monitoreo
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Historial de Detecciones</h3>
              <p>Consulta el historial de detecciones y reconocimientos</p>
              <Link href="/detection-history" className={styles.featureLink}>
                Ver Historial
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚙️</div>
              <h3>Configuración del Sistema</h3>
              <p>Configura parámetros del sistema de reconocimiento facial</p>
              <Link href="/system-config" className={styles.featureLink}>
                Configurar
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔔</div>
              <h3>Notificaciones</h3>
              <p>Gestiona alertas y notificaciones del sistema</p>
              <Link href="/notifications" className={styles.featureLink}>
                Ver Notificaciones
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📋</div>
              <h3>Lista de Personas</h3>
              <p>Visualiza y gestiona todas las personas registradas en el sistema</p>
              <Link href="/people/list" className={styles.featureLink}>
                Ver Lista
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👤</div>
              <h3>Crear Usuario</h3>
              <p>Crear nuevos usuarios en el sistema con roles y permisos</p>
              <Link href="/users/create" className={styles.featureLink}>
                Crear Usuario
              </Link>
            </div>
          </div>

          <div className={styles.statsSection}>
            <h3>Estadísticas del Sistema</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>0</div>
                <div className={styles.statLabel}>Personas Registradas</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>0</div>
                <div className={styles.statLabel}>Imágenes Procesadas</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>0</div>
                <div className={styles.statLabel}>Detecciones Hoy</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>0</div>
                <div className={styles.statLabel}>Precisión Promedio</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
