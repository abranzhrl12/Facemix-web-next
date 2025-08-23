import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Interface para el cliente de Supabase (ISP - Interface Segregation Principle)
export interface ISupabaseClient {
  auth: SupabaseClient['auth'];
  from: SupabaseClient['from'];
  storage: SupabaseClient['storage'];
  isConfigured(): boolean;
}

// Clase Singleton para Supabase (DIP - Dependency Inversion Principle)
export class SupabaseService implements ISupabaseClient {
  private static instance: SupabaseService;
  private client: SupabaseClient;

  private constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log("🔧 Configurando Supabase:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'No configurado',
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️ Variables de entorno de Supabase no encontradas');
      console.warn('📝 Crea un archivo .env.local con las siguientes variables:');
      console.warn('   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase');
      console.warn('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase');
      
      // Crear un cliente dummy que simule todos los métodos necesarios
      this.client = this.createDummyClient();
      return;
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
    
    console.log("✅ Cliente Supabase configurado correctamente");
  }

  // Método para crear un cliente dummy funcional
  private createDummyClient(): SupabaseClient {
    const dummyClient = createClient('https://dummy.supabase.co', 'dummy-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    // Agregar métodos dummy para evitar errores
    const enhancedClient = {
      ...dummyClient,
      auth: {
        ...dummyClient.auth,
        getSession: () => Promise.resolve({
          data: {
            session: {
              access_token: 'dummy-token-for-testing',
              refresh_token: 'dummy-refresh-token',
              expires_at: Date.now() + 3600000, // 1 hora
              user: {
                id: 'dummy-user-id',
                email: 'test@example.com',
                created_at: new Date().toISOString(),
              }
            }
          },
          error: null
        }),
        signInWithPassword: () => Promise.resolve({
          data: { user: null, session: null },
          error: { message: 'Supabase no está configurado. Configura las variables de entorno.' }
        }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'No rows returned' } })
          })
        }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Dummy client - operation not supported' } })
      })
    } as unknown as SupabaseClient;

    return enhancedClient;
  }

  // Método estático para obtener la instancia (Singleton)
  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Getters para acceder a los servicios (SRP - Single Responsibility Principle)
  get auth() {
    return this.client.auth;
  }

  get from() {
    return this.client.from;
  }

  get storage() {
    return this.client.storage;
  }

  // Método para obtener el cliente completo si es necesario
  getClient(): SupabaseClient {
    return this.client;
  }

  // Método para verificar si el cliente está configurado correctamente
  isConfigured(): boolean {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(supabaseUrl && supabaseAnonKey);
  }
}

// Exportar la instancia única
export const supabase = SupabaseService.getInstance();

// Exportar tipos útiles
export type { User, Session, AuthError } from '@supabase/supabase-js';
