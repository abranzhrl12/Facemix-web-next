import { supabase } from "@/shared/lib/supabase";

// Interface para crear usuario
export interface CreateUserRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  area_trabajo: string;
  cargo_id: string;
  fecha_ingreso: string;
  is_active: boolean;
}

// Interface para la respuesta de crear usuario
export interface CreateUserResponse {
  success: boolean;
  message: string;
  user_id?: string;
  error?: string;
}

// Interface para rol del sistema
export interface SystemRole {
  id: string;
  nombre: string;
  descripcion: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interface para la respuesta de obtener roles del sistema
export interface GetSystemRolesResponse {
  success: boolean;
  data?: SystemRole[];
  message?: string;
  error?: string;
}

// Servicio para manejar usuarios
export class UserService {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      console.log("👤 Iniciando creación de usuario:", userData);

      // Obtener el token de autenticación de Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No hay sesión activa");
      }

      // Realizar la petición al backend
      const response = await fetch(
        `${this.baseUrl}/api/v2/user-management/create-user`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData),
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

          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              const validationErrors = errorData.detail.map((err: any) => {
                if (typeof err === "string") {
                  return err;
                } else if (err && typeof err === "object") {
                  if (err.loc && err.msg) {
                    const field = err.loc[err.loc.length - 1];
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
        } catch (parseError) {
          console.log(
            "⚠️ No se pudo parsear la respuesta de error:",
            parseError
          );
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("✅ Usuario creado exitosamente:", result);

      return {
        success: true,
        message: result.message || "Usuario creado exitosamente",
        user_id: result.user_id,
      };
    } catch (error) {
      console.error("❌ Error creando usuario:", error);

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

  async getSystemRoles(): Promise<GetSystemRolesResponse> {
    try {
      console.log("🏢 Obteniendo roles del sistema...");
      console.log("🔗 URL del backend:", this.baseUrl);

      // Obtener el token de autenticación de Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      console.log("🔐 Estado de la sesión:", {
        tieneSession: !!session,
        tieneToken: !!session?.access_token,
        tokenLength: session?.access_token?.length || 0
      });
      
      if (!session?.access_token) {
        throw new Error("No hay sesión activa");
      }

      const url = `${this.baseUrl}/api/v2/cargos/sistema/roles`;
      console.log("🌐 Haciendo petición a:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
      });

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

          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              const validationErrors = errorData.detail.map((err: any) => {
                if (typeof err === "string") {
                  return err;
                } else if (err && typeof err === "object") {
                  if (err.loc && err.msg) {
                    const field = err.loc[err.loc.length - 1];
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
        } catch (parseError) {
          console.log(
            "⚠️ No se pudo parsear la respuesta de error:",
            parseError
          );
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Roles del sistema obtenidos exitosamente:", data);

      return {
        success: true,
        data: data,
        message: "Roles del sistema obtenidos exitosamente",
      };
    } catch (error) {
      console.error("❌ Error obteniendo roles del sistema:", error);

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

  // Método para validar email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para validar contraseña
  validatePassword(password: string): boolean {
    // Mínimo 8 caracteres, al menos una letra mayúscula, una minúscula, un número y un carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Método para validar teléfono
  validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{9,15}$/;
    return phoneRegex.test(phone);
  }
}

// Instancia única del servicio
export const userService = new UserService();
