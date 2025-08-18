# 🚀 Configuración de Supabase para FaceMix

## 📋 **PASOS PARA CONFIGURAR SUPABASE**

### 1. **Crear Proyecto en Supabase**
- Ve a [supabase.com](https://supabase.com)
- Crea una nueva cuenta o inicia sesión
- Crea un nuevo proyecto
- Selecciona tu región preferida

### 2. **Obtener Credenciales**
Una vez creado el proyecto, ve a **Settings > API** y copia:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. **Configurar Variables de Entorno**
Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. **Crear Usuario en Supabase Auth**
- Ve a **Authentication > Users**
- Haz clic en **"Add User"**
- Completa:
  - **Email**: tu@email.com
  - **Password**: tu_contraseña
  - **Email Confirm**: true

### 5. **Configurar Base de Datos**
Tu tabla `system_users` ya está creada. Asegúrate de que tenga los permisos correctos:

```sql
-- Verificar que la tabla existe
SELECT * FROM system_users LIMIT 1;

-- Verificar permisos RLS (Row Level Security)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'system_users';
```

### 6. **Configurar Políticas RLS (Opcional pero Recomendado)**
```sql
-- Habilitar RLS
ALTER TABLE system_users ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean su propio perfil
CREATE POLICY "Users can view own profile" ON system_users
  FOR SELECT USING (auth.uid() = supabase_user_id);

-- Política para que los usuarios puedan actualizar su perfil
CREATE POLICY "Users can update own profile" ON system_users
  FOR UPDATE USING (auth.uid() = supabase_user_id);
```

## 🔐 **FLUJO DE AUTENTICACIÓN**

### **Login:**
1. Usuario ingresa email y contraseña
2. Supabase Auth valida credenciales
3. Se crea una sesión JWT
4. Se obtiene el perfil del usuario desde `system_users`
5. Usuario es redirigido al dashboard

### **Registro:**
1. Usuario ingresa datos de registro
2. Se crea cuenta en Supabase Auth
3. Se crea perfil en `system_users`
4. Usuario recibe email de confirmación
5. Usuario puede hacer login

## 🧪 **PROBAR EL SISTEMA**

### **1. Iniciar el Proyecto:**
```bash
bun dev
```

### **2. Ir a la Página de Login:**
```
http://localhost:3000/login
```

### **3. Usar las Credenciales:**
- **Email**: El que creaste en Supabase Auth
- **Password**: La contraseña que configuraste

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Missing Supabase environment variables"**
- Verifica que `.env.local` existe
- Verifica que las variables están correctamente escritas
- Reinicia el servidor de desarrollo

### **Error: "Invalid login credentials"**
- Verifica que el usuario existe en Supabase Auth
- Verifica que el email está confirmado
- Verifica que la contraseña es correcta

### **Error: "Table system_users does not exist"**
- Verifica que la tabla está creada en Supabase
- Verifica que tienes permisos para acceder a la tabla

### **Error: "JWT token expired"**
- El token se renueva automáticamente
- Si persiste, verifica la configuración de Supabase

## 📱 **FUNCIONALIDADES IMPLEMENTADAS**

✅ **Cliente Supabase Singleton** (Patrón SOLID)  
✅ **Servicio de Autenticación** (SRP, ISP)  
✅ **Hook Personalizado useAuth** (OCP, LSP)  
✅ **Componente LoginForm** (React + SCSS)  
✅ **Página de Login** (Responsive + Animaciones)  
✅ **Manejo de Estados** (Loading, Error, Success)  
✅ **Validación de Formularios**  
✅ **Integración con system_users**  

## 🎯 **PRÓXIMOS PASOS**

1. **Implementar Registro de Usuarios**
2. **Crear Dashboard Principal**
3. **Implementar Protección de Rutas**
4. **Agregar Recuperación de Contraseña**
5. **Implementar Perfil de Usuario**

## 🔗 **ENLACES ÚTILES**

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Next.js App Router](https://nextjs.org/docs/app)
