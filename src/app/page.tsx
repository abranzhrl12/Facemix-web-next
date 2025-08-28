"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import DebugAuth from "@/components/DebugAuth";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (user) {
    return null; // El useEffect se encargará de la redirección
  }

  return (
    <div className={styles.page}>
      <DebugAuth />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>FaceMix</h1>
          <p className={styles.subtitle}>Sistema de Reconocimiento Facial</p>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>👤 Registro de Personas</h3>
            <p>Registra nuevas personas en el sistema con fotos para reconocimiento facial</p>
            <Link href="/people/register" className={styles.featureLink}>
              Registrar Persona
            </Link>
          </div>

          <div className={styles.featureCard}>
            <h3>📸 Agregar Imágenes</h3>
            <p>Agrega nuevas fotos a personas existentes para mejorar el reconocimiento</p>
            <Link href="/people/add-image" className={styles.featureLink}>
              Agregar Imagen
            </Link>
          </div>

          <div className={styles.featureCard}>
            <h3>🔍 Monitoreo en Tiempo Real</h3>
            <p>Sistema de detección y reconocimiento facial en tiempo real</p>
            <Link href="/camera-monitoring" className={styles.featureLink}>
              Monitoreo
            </Link>
          </div>

          <div className={styles.featureCard}>
            <h3>📊 Historial de Detecciones</h3>
            <p>Consulta el historial de detecciones y reconocimientos</p>
            <Link href="/detection-history" className={styles.featureLink}>
              Ver Historial
            </Link>
          </div>

          <div className={styles.featureCard}>
            <h3>📋 Lista de Personas</h3>
            <p>Visualiza y gestiona todas las personas registradas en el sistema</p>
            <Link href="/people/list" className={styles.featureLink}>
              Ver Lista
            </Link>
          </div>

          <div className={styles.featureCard}>
            <h3>👤 Crear Usuario</h3>
            <p>Crear nuevos usuarios en el sistema con roles y permisos</p>
            <Link href="/users/create" className={styles.featureLink}>
              Crear Usuario
            </Link>
          </div>
        </div>

        <div className={styles.ctas}>
          <Link
            className={styles.primary}
            href="/login"
          >
            <Image
              className={styles.logo}
              src="/next.svg"
              alt="Next.js logo"
              width={20}
              height={20}
            />
            Iniciar Sesión
          </Link>
          <Link
            href="/signup"
            className={styles.secondary}
          >
            Crear Cuenta
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>FaceMix - Sistema de Reconocimiento Facial Inteligente</p>
      </footer>
    </div>
  );
}
