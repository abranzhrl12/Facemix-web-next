"use client";

import React, { useState, useRef, useCallback } from 'react';
import { peopleService, type PersonRegistration } from '../../services/peopleService';
import styles from './PersonRegistrationForm.module.scss';

export interface PersonRegistrationFormProps {
  onSuccess?: (personId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const PersonRegistrationForm: React.FC<PersonRegistrationFormProps> = ({
  onSuccess,
  onCancel,
  className = '',
}) => {
  const [formData, setFormData] = useState<PersonRegistration>({
    dni: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    genero: 'M',
    direccion: '',
  });

  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar selección de archivo
  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImagen(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Por favor selecciona un archivo de imagen válido');
    }
  };

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add(styles.dragOver);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove(styles.dragOver);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove(styles.dragOver);
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  // Abrir selector de archivos
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.dni || !formData.nombre || !formData.apellido_paterno) {
      setError('Los campos DNI, Nombre y Apellido Paterno son obligatorios');
      return;
    }

    if (!peopleService.validateDNI(formData.dni)) {
      setError('El DNI debe tener 8 dígitos');
      return;
    }

    if (formData.fecha_nacimiento && !peopleService.validateBirthDate(formData.fecha_nacimiento)) {
      setError('La fecha de nacimiento no es válida');
      return;
    }

    if (!imagen) {
      setError('Debes seleccionar una imagen');
      return;
    }

    setLoading(true);

    try {
      const result = await peopleService.registerPerson({
        ...formData,
        imagen,
      });

      if (result.success) {
        // Crear mensaje de éxito con información del embedding
        let successMessage = result.message;
        if (result.embedding_created) {
          successMessage += ` ✅ Embedding facial generado exitosamente`;
          if (result.processing_time_ms) {
            successMessage += ` (${result.processing_time_ms}ms)`;
          }
        } else if (result.warning) {
          successMessage += ` ⚠️ ${result.warning}`;
        }
        
        setSuccess(successMessage);
        setFormData({
          dni: '',
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          fecha_nacimiento: '',
          genero: 'M',
          direccion: '',
        });
        setImagen(null);
        setImagenPreview('');
        
        if (onSuccess && result.person_id) {
          onSuccess(result.person_id);
        }
      } else {
        console.error("❌ Error en el registro:", result.message);
        setError(result.message || 'Error al registrar la persona');
      }
    } catch (error) {
      console.error("❌ Error inesperado:", error);
      let errorMessage = 'Error inesperado al registrar la persona';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.personRegistrationForm} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Registro de Persona</h2>
        <p className={styles.subtitle}>
          Complete los datos de la persona y suba una foto para el reconocimiento facial
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            {success}
          </div>
        )}

        {/* Campos obligatorios */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Información Obligatoria</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="dni" className={styles.label}>
                DNI <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="12345678"
                maxLength={8}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nombre" className={styles.label}>
                Nombre <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Juan"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="apellido_paterno" className={styles.label}>
                Apellido Paterno <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="apellido_paterno"
                name="apellido_paterno"
                value={formData.apellido_paterno}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Pérez"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="apellido_materno" className={styles.label}>
                Apellido Materno
              </label>
              <input
                type="text"
                id="apellido_materno"
                name="apellido_materno"
                value={formData.apellido_materno}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="García"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Campos opcionales */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Información Opcional</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fecha_nacimiento" className={styles.label}>
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="genero" className={styles.label}>
                Género
              </label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleInputChange}
                className={styles.select}
                disabled={loading}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
                <option value="N/A">No Aplica</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="direccion" className={styles.label}>
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Av. Principal 123"
              disabled={loading}
            />
          </div>
        </div>

        {/* Subida de imagen */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Foto para Reconocimiento Facial</h3>
          
          <div className={styles.imageUploadSection}>
            <div
              ref={dropZoneRef}
              className={styles.dropZone}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileSelector}
            >
              {imagenPreview ? (
                <div className={styles.imagePreview}>
                  <img src={imagenPreview} alt="Preview" />
                  <div className={styles.imageOverlay}>
                    <span>Click para cambiar imagen</span>
                  </div>
                </div>
              ) : (
                <div className={styles.dropZoneContent}>
                  <div className={styles.dropZoneIcon}>📷</div>
                  <p className={styles.dropZoneText}>
                    Arrastra una imagen aquí o haz click para seleccionar
                  </p>
                  <p className={styles.dropZoneSubtext}>
                    Formatos: JPG, PNG, GIF (Max: 5MB)
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className={styles.hiddenInput}
            />

            {imagen && (
              <div className={styles.imageInfo}>
                <p><strong>Archivo:</strong> {imagen.name}</p>
                <p><strong>Tamaño:</strong> {(imagen.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  type="button"
                  onClick={() => {
                    setImagen(null);
                    setImagenPreview('');
                  }}
                  className={styles.removeImageButton}
                  disabled={loading}
                >
                  ❌ Remover imagen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !imagen}
          >
            {loading ? (
              <span className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                Registrando persona...
              </span>
            ) : (
              'Registrar Persona'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonRegistrationForm;
