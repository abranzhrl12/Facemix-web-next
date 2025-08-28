"use client";

import React, { useState, useEffect } from 'react';
import { peopleService, PersonDetail, ReferenceImage } from '../../services/peopleService';
import styles from './PersonDetailModal.module.scss';

interface PersonDetailModalProps {
  personId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PersonDetailModal({ personId, isOpen, onClose }: PersonDetailModalProps) {
  const [personDetail, setPersonDetail] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ReferenceImage | null>(null);

  useEffect(() => {
    if (isOpen && personId) {
      loadPersonDetail();
    }
  }, [isOpen, personId]);

  const loadPersonDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await peopleService.getPersonById(personId);
      
      if (response.success && response.data) {
        setPersonDetail(response.data);
        // Seleccionar la imagen primaria por defecto
        const primaryImage = response.data.reference_images.find(img => img.is_primary);
        setSelectedImage(primaryImage || response.data.reference_images[0] || null);
      } else {
        setError(response.error || 'Error al cargar los detalles de la persona');
      }
    } catch (err) {
      setError('Error inesperado al cargar los detalles');
      console.error('Error loading person detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClass = status === 'ACTIVO' ? styles.activeBadge : styles.inactiveBadge;
    return <span className={statusClass}>{status}</span>;
  };

  const getGenderLabel = (gender: string) => {
    const genderMap: Record<string, string> = {
      'MASCULINO': 'Masculino',
      'FEMENINO': 'Femenino',
      'OTRO': 'Otro'
    };
    return genderMap[gender] || gender;
  };

  const handleImageClick = (image: ReferenceImage) => {
    setSelectedImage(image);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Detalles de la Persona</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando detalles...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button onClick={loadPersonDetail} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        )}

        {personDetail && !loading && (
          <div className={styles.modalBody}>
            <div className={styles.contentGrid}>
              {/* Columna de información */}
              <div className={styles.infoColumn}>
                <div className={styles.infoSection}>
                  <h3>Información Personal</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>Nombre Completo:</label>
                      <span>{personDetail.nombre_completo}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>DNI:</label>
                      <span className={styles.dniValue}>{personDetail.dni}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Fecha de Nacimiento:</label>
                      <span>{personDetail.fecha_nacimiento}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Género:</label>
                      <span>{getGenderLabel(personDetail.genero)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Dirección:</label>
                      <span>{personDetail.direccion}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Estado:</label>
                      <span>{getStatusBadge(personDetail.estado)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3>Información del Sistema</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>ID:</label>
                      <span className={styles.idValue}>{personDetail.id}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Embeddings:</label>
                      <span>{personDetail.embeddings_count}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Fecha de Registro:</label>
                      <span>{formatDate(personDetail.created_at)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Última Actualización:</label>
                      <span>{formatDate(personDetail.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna de imágenes */}
              <div className={styles.imagesColumn}>
                <h3>Imágenes de Referencia ({personDetail.reference_images.length})</h3>
                
                {personDetail.reference_images.length === 0 ? (
                  <div className={styles.noImages}>
                    <p>No hay imágenes de referencia</p>
                  </div>
                ) : (
                  <>
                    {/* Imagen principal */}
                    {selectedImage && (
                      <div className={styles.mainImageContainer}>
                        <img 
                          src={selectedImage.image_url} 
                          alt={selectedImage.description}
                          className={styles.mainImage}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className={styles.imageInfo}>
                          <p className={styles.imageDescription}>{selectedImage.description}</p>
                          <p className={styles.imageConfidence}>
                            Confianza: {(selectedImage.confidence_level * 100).toFixed(1)}%
                          </p>
                          {selectedImage.is_primary && (
                            <span className={styles.primaryBadge}>Principal</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Galería de miniaturas */}
                    {personDetail.reference_images.length > 1 && (
                      <div className={styles.thumbnailGallery}>
                        <h4>Otras Imágenes</h4>
                        <div className={styles.thumbnails}>
                          {personDetail.reference_images.map((image) => (
                            <div 
                              key={image.id} 
                              className={`${styles.thumbnail} ${selectedImage?.id === image.id ? styles.selected : ''}`}
                              onClick={() => handleImageClick(image)}
                            >
                              <img 
                                src={image.image_url} 
                                alt={image.description}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-image.jpg';
                                }}
                              />
                              {image.is_primary && (
                                <span className={styles.primaryIndicator}>★</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
