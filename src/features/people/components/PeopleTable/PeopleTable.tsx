"use client";

import React, { useState, useEffect } from 'react';
import { peopleService, Person } from '../../services/peopleService';
import PersonDetailModal from '../PersonDetailModal';
import styles from './PeopleTable.module.scss';

export default function PeopleTable() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Person>('nombre_completo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPersons();
  }, []);

  const loadPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await peopleService.getAllPersons();
      
      if (response.success && response.data) {
        setPersons(response.data);
      } else {
        setError(response.error || 'Error al cargar las personas');
      }
    } catch (err) {
      setError('Error inesperado al cargar las personas');
      console.error('Error loading persons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Person) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedPersons = persons
    .filter(person => 
      person.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.dni.includes(searchTerm) ||
      person.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

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

  const handleViewPerson = (person: Person) => {
    setSelectedPersonId(person.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPersonId(null);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando personas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={loadPersons} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.peopleTableContainer}>
      <div className={styles.header}>
        <h2>Lista de Personas Registradas</h2>
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar por nombre, DNI o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button onClick={loadPersons} className={styles.refreshButton}>
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.peopleTable}>
          <thead>
            <tr>
              <th onClick={() => handleSort('nombre_completo')} className={styles.sortableHeader}>
                Nombre Completo
                {sortField === 'nombre_completo' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('dni')} className={styles.sortableHeader}>
                DNI
                {sortField === 'dni' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('fecha_nacimiento')} className={styles.sortableHeader}>
                Fecha de Nacimiento
                {sortField === 'fecha_nacimiento' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('genero')} className={styles.sortableHeader}>
                Género
                {sortField === 'genero' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('direccion')} className={styles.sortableHeader}>
                Dirección
                {sortField === 'direccion' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('estado')} className={styles.sortableHeader}>
                Estado
                {sortField === 'estado' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('created_at')} className={styles.sortableHeader}>
                Fecha de Registro
                {sortField === 'created_at' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th className={styles.actionHeader}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPersons.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.noData}>
                  {searchTerm ? 'No se encontraron personas que coincidan con la búsqueda' : 'No hay personas registradas'}
                </td>
              </tr>
            ) : (
              filteredAndSortedPersons.map((person) => (
                <tr key={person.id} className={styles.tableRow}>
                  <td className={styles.nameCell}>{person.nombre_completo}</td>
                  <td className={styles.dniCell}>{person.dni}</td>
                  <td className={styles.dateCell}>{person.fecha_nacimiento}</td>
                  <td className={styles.genderCell}>{getGenderLabel(person.genero)}</td>
                  <td className={styles.addressCell}>{person.direccion}</td>
                  <td className={styles.statusCell}>{getStatusBadge(person.estado)}</td>
                  <td className={styles.dateCell}>{formatDate(person.created_at)}</td>
                  <td className={styles.actionCell}>
                    <button 
                      className={styles.viewButton}
                      onClick={() => handleViewPerson(person)}
                      title="Ver detalles de la persona"
                    >
                      🔍
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <p className={styles.summary}>
          Mostrando {filteredAndSortedPersons.length} de {persons.length} personas
        </p>
      </div>

      {/* Modal de detalles de persona */}
      {selectedPersonId && (
        <PersonDetailModal
          personId={selectedPersonId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
