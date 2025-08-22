import { supabase } from '@/shared/lib/supabase';

// Interface para el registro de persona
export interface PersonRegistration {
  dni: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  fecha_nacimiento?: string;
  genero?: 'M' | 'F' | 'O' | 'N/A';
  direccion?: string;
  imagen?: File;
}

// Interface para la respuesta del backend
export interface PersonRegistrationResponse {
  success: boolean;
  message: string;
  person_id?: string;
  embedding_created?: boolean;
  embedding_id?: string;
  processing_time_ms?: number;
  warning?: string;
  error?: string;
}

// Servicio para manejar personas
export class PeopleService {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  async registerPerson(personData: PersonRegistration): Promise<PersonRegistrationResponse> {
    try {
      console.log('👤 Iniciando registro de persona:', personData);

      // Obtener el token de autenticación de Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }

      // Crear FormData para enviar al backend
      const formData = new FormData();
      formData.append('dni', personData.dni);
      formData.append('nombre', personData.nombre);
      formData.append('apellido_paterno', personData.apellido_paterno);
      
      if (personData.apellido_materno) {
        formData.append('apellido_materno', personData.apellido_materno);
      }
      if (personData.fecha_nacimiento) {
        formData.append('fecha_nacimiento', personData.fecha_nacimiento);
      }
      if (personData.genero) {
        formData.append('genero', personData.genero);
      }
      if (personData.direccion) {
        formData.append('direccion', personData.direccion);
      }
      if (personData.imagen) {
        formData.append('image', personData.imagen);
      }

      // Realizar la petición al backend
      const response = await fetch(`${this.baseUrl}/api/v2/person-management/register-person-with-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Persona registrada exitosamente:', result);
      
      return {
        success: true,
        message: result.message || 'Persona registrada exitosamente',
        person_id: result.person_id,
        embedding_created: result.embedding_created,
        embedding_id: result.embedding_id,
        processing_time_ms: result.processing_time_ms,
        warning: result.warning,
      };

    } catch (error) {
      console.error('❌ Error registrando persona:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Método para validar DNI (formato peruano)
  validateDNI(dni: string): boolean {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  }

  // Método para validar fecha de nacimiento
  validateBirthDate(date: string): boolean {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  }
}

// Instancia única del servicio
export const peopleService = new PeopleService();
