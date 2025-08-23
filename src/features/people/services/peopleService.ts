import { supabase } from "@/shared/lib/supabase";

// Interface para el registro de persona
export interface PersonRegistration {
  dni: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  fecha_nacimiento?: string;
  genero?: "M" | "F" | "O" | "N/A";
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
  private baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  async registerPerson(
    personData: PersonRegistration
  ): Promise<PersonRegistrationResponse> {
    try {
      console.log("👤 Iniciando registro de persona:", personData);

      // Obtener el token de autenticación de Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No hay sesión activa");
      }

      // Crear FormData para enviar al backend
      const formData = new FormData();
      formData.append("dni", personData.dni);
      formData.append("nombre", personData.nombre);
      formData.append("apellido", personData.apellido_paterno); // Cambiado de apellido_paterno a apellido

      if (personData.apellido_materno) {
        formData.append("apellido_materno", personData.apellido_materno);
      }
      if (personData.fecha_nacimiento) {
        formData.append("fecha_nacimiento", personData.fecha_nacimiento);
      }
      if (personData.genero) {
        // Mapear los valores de género para que coincidan con el backend
        const generoMapping: Record<string, string> = {
          M: "MASCULINO",
          F: "FEMENINO",
          O: "OTRO",
          "N/A": "OTRO",
        };
        const generoValue = generoMapping[personData.genero] || "OTRO";
        formData.append("genero", generoValue);
      }
      if (personData.direccion) {
        formData.append("direccion", personData.direccion);
      }
      if (personData.imagen) {
        formData.append("file", personData.imagen); // Cambiado de "image" a "file" para coincidir con el curl
      }

      // Agregar campos opcionales que pueden ser requeridos por el backend
      // Nota: No se envían campos telefono ni email por solicitud del usuario

      // Logging detallado de todos los campos que se envían
      console.log("📤 Datos completos que se envían al backend:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `  ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`  ${key}: "${value}"`);
        }
      }

      console.log("📤 Enviando datos al backend:", {
        url: `${this.baseUrl}/api/v2/person-image/register`,
        dni: personData.dni,
        nombre: personData.nombre,
        apellido: personData.apellido_paterno,
        apellido_materno: personData.apellido_materno,
        fecha_nacimiento: personData.fecha_nacimiento,
        genero: personData.genero
          ? personData.genero === "M"
            ? "MASCULINO"
            : personData.genero === "F"
            ? "FEMENINO"
            : "OTRO"
          : "No especificado",
        direccion: personData.direccion,
        tieneImagen: !!personData.imagen,
      });

      // Realizar la petición al backend
      const response = await fetch(
        `${this.baseUrl}/api/v2/person-image/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      console.log("📥 Respuesta del backend:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          console.log("📋 Datos de error del backend:", errorData);
          console.log("📋 Tipo de errorData.detail:", typeof errorData.detail);
          console.log(
            "📋 Es array errorData.detail:",
            Array.isArray(errorData.detail)
          );

          // Logging adicional para errores 500
          if (response.status === 500) {
            console.log("🚨 ERROR 500 - Detalles completos:", {
              error_type: errorData.error_type,
              error_code: errorData.error_code,
              message: errorData.message,
              details: errorData.details,
              full_response: errorData,
            });
          }

          if (Array.isArray(errorData.detail)) {
            console.log("📋 Elementos del array de errores:", errorData.detail);
            errorData.detail.forEach((err: any, index: number) => {
              console.log(`📋 Error ${index}:`, err);
              console.log(`📋 Tipo del error ${index}:`, typeof err);
              if (err && typeof err === "object") {
                console.log(
                  `📋 Propiedades del error ${index}:`,
                  Object.keys(err)
                );
              }
            });
          }

          if (errorData.detail) {
            // Si detail es un array, procesar cada error de validación
            if (Array.isArray(errorData.detail)) {
              const validationErrors = errorData.detail.map((err: any) => {
                if (typeof err === "string") {
                  return err;
                } else if (err && typeof err === "object") {
                  // Manejar errores de validación de Pydantic
                  if (err.loc && err.msg) {
                    const field = err.loc[err.loc.length - 1]; // Obtener el último elemento del path
                    return `${field}: ${err.msg}`;
                  } else if (err.msg) {
                    return err.msg;
                  } else if (err.message) {
                    return err.message;
                  }
                }
                return JSON.stringify(err);
              });
              errorMessage = validationErrors.join(", ");
            } else {
              errorMessage = errorData.detail;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          } else if (Array.isArray(errorData)) {
            errorMessage = errorData
              .map((err) =>
                typeof err === "string" ? err : JSON.stringify(err)
              )
              .join(", ");
          }

          // Manejo especial para errores 500
          if (response.status === 500) {
            if (errorData.details && typeof errorData.details === "object") {
              const detailsStr = JSON.stringify(errorData.details, null, 2);
              errorMessage = `Error interno del servidor: ${
                errorData.message || "Error desconocido"
              }\nDetalles: ${detailsStr}`;
            } else {
              errorMessage = `Error interno del servidor: ${
                errorData.message || "Error desconocido"
              }`;
            }
          }
        } catch (parseError) {
          console.log(
            "⚠️ No se pudo parsear la respuesta de error:",
            parseError
          );
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("✅ Persona registrada exitosamente:", result);

      return {
        success: true,
        message: result.message || "Persona registrada exitosamente",
        person_id: result.person_id,
        embedding_created: result.embedding_created,
        embedding_id: result.embedding_id,
        processing_time_ms: result.processing_time_ms,
        warning: result.warning,
      };
    } catch (error) {
      console.error("❌ Error registrando persona:", error);

      let errorMessage = "Error desconocido";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        errorMessage = JSON.stringify(error);
      }

      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
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
