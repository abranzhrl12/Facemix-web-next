"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { peopleService } from '../../services/peopleService';
import styles from './AddImageToPersonForm.module.scss';

export interface AddImageToPersonFormProps {
  onSuccess?: (personId: string, embeddingId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const AddImageToPersonForm: React.FC<AddImageToPersonFormProps> = ({
  onSuccess,
  onCancel,
  className = '',
}) => {
  const [personId, setPersonId] = useState<string>('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Debug: Log del estado inicial
  console.log('🔍 AddImageToPersonForm - Estado inicial:', {
    personId,
    imagen: !!imagen,
    loading,
    error,
    success
  });

  // Debug: Log cada vez que cambia personId
  useEffect(() => {
    console.log('🔍 AddImageToPersonForm - personId cambió:', personId);
  }, [personId]);

  // Debug: Log cada vez que cambia loading
  useEffect(() => {
    console.log('🔍 AddImageToPersonForm - loading cambió:', loading);
  }, [loading]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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

  // Validar UUID
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!personId.trim()) {
      setError('El ID de la persona es obligatorio');
      return;
    }

    if (!isValidUUID(personId.trim())) {
      setError('El ID de la persona debe ser un UUID válido');
      return;
    }

    if (!imagen) {
      setError('Debes seleccionar una imagen');
      return;
    }

    setLoading(true);

    try {
      const result = await peopleService.addImageToPerson({
        personId: personId.trim(),
        file: imagen,
      });

      if (result.success) {
        setSuccess(result.message || 'Imagen agregada exitosamente');
        setPersonId('');
        setImagen(null);
        setImagenPreview('');
        
        if (onSuccess && result.personId && result.embeddingId) {
          onSuccess(result.personId, result.embeddingId);
        }
      } else {
        setError(result.message || 'Error al agregar la imagen');
      }
    } catch (error) {
      console.error("❌ Error inesperado:", error);
      let errorMessage = 'Error inesperado al agregar la imagen';
      
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
    <div className={`${styles.addImageToPersonForm} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Agregar Imagen a Persona</h2>
        <p className={styles.subtitle}>
          Sube una nueva imagen para mejorar el reconocimiento facial de una persona existente
        </p>
        <p className={styles.apiInfo}>
          📋 Solo necesitas: <strong>ID de la persona</strong> + <strong>imagen</strong>
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

        {/* ID de la persona */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Identificación de Persona</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="personId" className={styles.label}>
              ID de la Persona <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="personId"
              name="personId"
              value={personId}
              onChange={(e) => {
                console.log('🔍 onChange personId:', e.target.value);
                setPersonId(e.target.value);
              }}
              className={styles.input}
              placeholder="123e4567-e89b-12d3-a456-426614174000"
              required
              disabled={loading}
            />
            <small className={styles.helpText}>
              Ingresa el UUID de la persona existente en el sistema
            </small>
          </div>
        </div>



        {/* Subida de imagen */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Nueva Imagen para Reconocimiento</h3>
          
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
            disabled={loading || !imagen || !personId.trim()}
          >
            {loading ? (
              <span className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                Agregando imagen...
              </span>
            ) : (
              'Agregar Imagen'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddImageToPersonForm;
