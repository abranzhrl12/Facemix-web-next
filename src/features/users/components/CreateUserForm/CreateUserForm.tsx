"use client";

import React, { useState, useEffect } from 'react';
import { userService, CreateUserRequest, SystemRole } from '../../services/userService';
import styles from './CreateUserForm.module.scss';

export default function CreateUserForm() {
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    area_trabajo: '',
    cargo_id: '',
    fecha_ingreso: '',
    is_active: true
  });

  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      const response = await userService.getSystemRoles();
      
      if (response.success && response.data) {
        setRoles(response.data);
        console.log('✅ Roles cargados exitosamente:', response.data);
      } else {
        const errorMessage = response.error || response.message || 'Error al cargar los roles del sistema';
        setError(errorMessage);
        console.error('❌ Error en respuesta del servicio:', response);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado al cargar los roles del sistema';
      setError(errorMessage);
      console.error('❌ Error inesperado loading roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Limpiar error de validación del campo
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validar email
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!userService.validateEmail(formData.email)) {
      errors.email = 'El email no es válido';
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (!userService.validatePassword(formData.password)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
    }

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      errors.apellido = 'El apellido es requerido';
    }

    // Validar teléfono
    if (!formData.telefono) {
      errors.telefono = 'El teléfono es requerido';
    } else if (!userService.validatePhone(formData.telefono)) {
      errors.telefono = 'El teléfono debe tener entre 9 y 15 dígitos';
    }

    // Validar dirección
    if (!formData.direccion.trim()) {
      errors.direccion = 'La dirección es requerida';
    }

    // Validar área de trabajo
    if (!formData.area_trabajo.trim()) {
      errors.area_trabajo = 'El área de trabajo es requerida';
    }

    // Validar cargo
    if (!formData.cargo_id) {
      errors.cargo_id = 'El cargo es requerido';
    }

    // Validar fecha de ingreso
    if (!formData.fecha_ingreso) {
      errors.fecha_ingreso = 'La fecha de ingreso es requerida';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await userService.createUser(formData);
      
      if (response.success) {
        setSuccess(response.message || 'Usuario creado exitosamente');
        // Limpiar formulario
        setFormData({
          email: '',
          password: '',
          nombre: '',
          apellido: '',
          telefono: '',
          direccion: '',
          area_trabajo: '',
          cargo_id: '',
          fecha_ingreso: '',
          is_active: true
        });
      } else {
        setError(response.error || 'Error al crear el usuario');
      }
    } catch (err) {
      setError('Error inesperado al crear el usuario');
      console.error('Error creating user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (!password) return { strength: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        return { strength: 'Muy débil', color: '#dc2626' };
      case 2:
        return { strength: 'Débil', color: '#ea580c' };
      case 3:
        return { strength: 'Media', color: '#d97706' };
      case 4:
        return { strength: 'Fuerte', color: '#059669' };
      case 5:
        return { strength: 'Muy fuerte', color: '#047857' };
      default:
        return { strength: '', color: '' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando roles del sistema...</p>
      </div>
    );
  }

  return (
    <div className={styles.createUserFormContainer}>
      <div className={styles.header}>
        <h1>Crear Nuevo Usuario</h1>
        <p>Complete el formulario para crear un nuevo usuario en el sistema</p>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className={styles.successAlert}>
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Información Personal */}
          <div className={styles.formSection}>
            <h3>Información Personal</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={validationErrors.nombre ? styles.inputError : ''}
                placeholder="Ingrese el nombre"
              />
              {validationErrors.nombre && (
                <span className={styles.errorText}>{validationErrors.nombre}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="apellido">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className={validationErrors.apellido ? styles.inputError : ''}
                placeholder="Ingrese el apellido"
              />
              {validationErrors.apellido && (
                <span className={styles.errorText}>{validationErrors.apellido}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={validationErrors.email ? styles.inputError : ''}
                placeholder="usuario@empresa.com"
              />
              {validationErrors.email && (
                <span className={styles.errorText}>{validationErrors.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className={validationErrors.telefono ? styles.inputError : ''}
                placeholder="123456789"
              />
              {validationErrors.telefono && (
                <span className={styles.errorText}>{validationErrors.telefono}</span>
              )}
            </div>
          </div>

          {/* Información Laboral */}
          <div className={styles.formSection}>
            <h3>Información Laboral</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="cargo_id">Cargo del Sistema *</label>
              <select
                id="cargo_id"
                name="cargo_id"
                value={formData.cargo_id}
                onChange={handleInputChange}
                className={validationErrors.cargo_id ? styles.inputError : ''}
              >
                <option value="">Seleccione un cargo</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.nombre} - {role.descripcion}
                  </option>
                ))}
              </select>
              {validationErrors.cargo_id && (
                <span className={styles.errorText}>{validationErrors.cargo_id}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="area_trabajo">Área de Trabajo *</label>
              <input
                type="text"
                id="area_trabajo"
                name="area_trabajo"
                value={formData.area_trabajo}
                onChange={handleInputChange}
                className={validationErrors.area_trabajo ? styles.inputError : ''}
                placeholder="Ej: Desarrollo, Marketing, Ventas"
              />
              {validationErrors.area_trabajo && (
                <span className={styles.errorText}>{validationErrors.area_trabajo}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="fecha_ingreso">Fecha de Ingreso *</label>
              <input
                type="date"
                id="fecha_ingreso"
                name="fecha_ingreso"
                value={formData.fecha_ingreso}
                onChange={handleInputChange}
                className={validationErrors.fecha_ingreso ? styles.inputError : ''}
              />
              {validationErrors.fecha_ingreso && (
                <span className={styles.errorText}>{validationErrors.fecha_ingreso}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="direccion">Dirección *</label>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className={validationErrors.direccion ? styles.inputError : ''}
                placeholder="Ingrese la dirección completa"
                rows={3}
              />
              {validationErrors.direccion && (
                <span className={styles.errorText}>{validationErrors.direccion}</span>
              )}
            </div>
          </div>

          {/* Información de Acceso */}
          <div className={styles.formSection}>
            <h3>Información de Acceso</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Contraseña *</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={validationErrors.password ? styles.inputError : ''}
                  placeholder="Ingrese la contraseña"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.password && (
                <div className={styles.passwordStrength}>
                  <span style={{ color: passwordStrength.color }}>
                    Fortaleza: {passwordStrength.strength}
                  </span>
                </div>
              )}
              {validationErrors.password && (
                <span className={styles.errorText}>{validationErrors.password}</span>
              )}
              <div className={styles.passwordRequirements}>
                <p>La contraseña debe contener:</p>
                <ul>
                  <li>Mínimo 8 caracteres</li>
                  <li>Al menos una letra mayúscula</li>
                  <li>Al menos una letra minúscula</li>
                  <li>Al menos un número</li>
                  <li>Al menos un carácter especial (@$!%*?&)</li>
                </ul>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <span>Usuario activo</span>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? 'Creando usuario...' : 'Crear Usuario'}
          </button>
          
          <button
            type="button"
                         onClick={() => {
               setFormData({
                 email: '',
                 password: '',
                 nombre: '',
                 apellido: '',
                 telefono: '',
                 direccion: '',
                 area_trabajo: '',
                 cargo_id: '',
                 fecha_ingreso: '',
                 is_active: true
               });
              setValidationErrors({});
              setError(null);
              setSuccess(null);
            }}
            className={styles.resetButton}
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
}
