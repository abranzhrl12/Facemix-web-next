"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginForm.module.scss';

export interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToSignUp,
  className = '',
}) => {
  const { signIn, loading, error, user, session } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Efecto para detectar cuando el usuario se autentica exitosamente
  useEffect(() => {
    if (user && session && !loading) {
      console.log('🎯 LoginForm detectó usuario autenticado, llamando onSuccess');
      // Usar setTimeout para evitar llamadas múltiples
      const timer = setTimeout(() => {
        onSuccess?.();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, session, loading, onSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      console.log('📝 Formulario enviado, iniciando login...');
      console.log('📧 Email:', formData.email);
      console.log('🔑 Password:', formData.password ? '***' : 'vacío');
      
      await signIn(formData.email, formData.password);
      
      console.log('🔄 signIn completado, la redirección se maneja automáticamente');
    } catch (error) {
      console.error('💥 Error inesperado en formulario:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={`${styles.loginForm} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        <p className={styles.subtitle}>
          Accede a tu cuenta de FaceMix
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorMessage}>
            {error.message || 'Error al iniciar sesión'}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="tu@email.com"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Contraseña
          </label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.passwordToggle}
              disabled={loading}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !formData.email || !formData.password}
        >
          {loading ? (
            <span className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              Iniciando sesión...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      <div className={styles.footer}>
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className={styles.switchButton}
          disabled={loading}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
