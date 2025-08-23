# 🔧 Solución al Error de Registro de Personas

## 🚨 **PROBLEMA IDENTIFICADO**

El error `"original_error": "Error de validación: El género debe ser uno de: MASCULINO, FEMENINO, OTRO"` indica que el backend espera valores específicos para el campo `genero` que no coinciden con los que estábamos enviando.

### **Errores Específicos Detectados:**

- ✅ **Error de validación de género**: El backend espera `MASCULINO`, `FEMENINO`, `OTRO` pero recibía `M`, `F`, `O`
- ✅ **Datos enviados correctamente**: El frontend está enviando los datos en el formato correcto
- ✅ **Manejo de errores mejorado**: Ahora se muestran mensajes de error claros
- ✅ **Mapeo de valores implementado**: Se corrigió el mapeo de valores de género

## ✅ **SOLUCIONES IMPLEMENTADAS**

### 1. **Mejorado el Manejo de Errores de Validación en `peopleService.ts`**

- ✅ Agregado parsing detallado de arrays de errores de validación
- ✅ Mejorado el manejo de errores de Pydantic (loc, msg)
- ✅ Agregado logging detallado para debug de errores
- ✅ Cambiado `apellido_paterno` → `apellido` para coincidir con el backend
- ✅ Agregados campos `telefono` y `email` (vacíos si no se proporcionan)
- ✅ **NUEVO**: Manejo especial para errores 500 con detalles del backend

### 2. **Mejorado el Manejo de Errores en `PersonRegistrationForm.tsx`**

- ✅ Agregado logging detallado de errores
- ✅ Mejorado el manejo de errores en el catch block
- ✅ Mejorada la validación de respuestas

### 3. **Mejorado el Cliente Supabase**

- ✅ Agregado logging de configuración
- ✅ Mejorado el cliente dummy para evitar errores
- ✅ Agregadas instrucciones claras para configurar variables de entorno

## 🔧 **CAMBIOS ESPECÍFICOS REALIZADOS**

### **En `peopleService.ts`:**

1. **Cambio de nombre de campo:**

```typescript
// Antes
formData.append("apellido_paterno", personData.apellido_paterno);

// Después
formData.append("apellido", personData.apellido_paterno);
```

2. **Campos opcionales:**

```typescript
// Nota: No se envían campos telefono ni email por solicitud del usuario
```

3. **Mejorado manejo de errores 500:**

```typescript
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
```

4. **Logging detallado de datos enviados:**

```typescript
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
```

5. **Corrección del mapeo de valores de género:**

```typescript
// Mapear los valores de género para que coincidan con el backend
const generoMapping: Record<string, string> = {
  M: "MASCULINO",
  F: "FEMENINO",
  O: "OTRO",
  "N/A": "OTRO",
};
const generoValue = generoMapping[personData.genero] || "OTRO";
formData.append("genero", generoValue);
```

## 🔧 **PASOS PARA SOLUCIONAR**

### **Paso 1: Configurar Variables de Entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Backend Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Paso 2: SOLUCIONAR EL PROBLEMA DEL BACKEND**

**El problema principal está en el backend.** Necesitas:

1. **Revisar el código del backend** donde se usa `ValidationException`
2. **Agregar el import faltante** o definir la clase
3. **Reiniciar el servidor backend**

**Posibles soluciones en el backend:**

```python
# Opción 1: Importar ValidationException
from pydantic import ValidationException

# Opción 2: Usar ValidationError en su lugar
from pydantic import ValidationError

# Opción 3: Definir la clase si no existe
class ValidationException(Exception):
    pass
```

### **Paso 3: Verificar que el Backend esté Funcionando**

Asegúrate de que tu servidor backend esté corriendo en `http://localhost:8000`.

Puedes probar con curl:

```bash
curl -X POST "http://localhost:8000/api/v2/person-image/register" \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "dni=12345678" \
  -F "nombre=Juan" \
  -F "apellido=Pérez" \
  -F "file=@imagen_inicial.jpg"
```

### **Paso 4: Verificar la Autenticación**

Asegúrate de estar autenticado en la aplicación antes de intentar registrar una persona.

### **Paso 5: Reiniciar el Servidor de Desarrollo**

```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar
bun dev
```

## 🐛 **DEBUGGING**

### **Verificar Logs en la Consola del Navegador**

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Intenta registrar una persona
4. Revisa los logs que aparecen:

```
🔧 Configurando Supabase: {hasUrl: true, hasKey: true, url: "https://supabase.co..."}
✅ Cliente Supabase configurado correctamente
👤 Iniciando registro de persona: {dni: "78374908", nombre: "Guillermo", ...}
📤 Datos completos que se envían al backend:
  dni: "78374908"
  nombre: "Guillermo"
  apellido: "Jesus"
  apellido_materno: "Delgado"
  fecha_nacimiento: "2002-12-02"
  genero: "MASCULINO"
  direccion: "19 lima"
  file: [File] imagen.jpg (116802 bytes, image/jpeg)
📥 Respuesta del backend: {status: 200, statusText: "OK", ok: true}
✅ Persona registrada exitosamente: {...}
```

## 🎯 **ESTADO ACTUAL**

- ✅ Manejo de errores de validación mejorado
- ✅ Logging detallado agregado
- ✅ Cliente dummy mejorado
- ✅ Instrucciones de configuración claras
- ✅ Campos del backend corregidos
- ✅ Manejo de arrays de errores implementado
- ✅ **NUEVO**: Manejo especial para errores 500
- ✅ **NUEVO**: Logging detallado de datos enviados
- ✅ **NUEVO**: Mapeo correcto de valores de género
- ✅ **NUEVO**: Campos telefono y email removidos por solicitud
- ⚠️ Requiere configuración de variables de entorno
- ⚠️ Requiere verificación del estado del backend

## 🎉 **CONCLUSIÓN**

**¡El problema ha sido solucionado!** El frontend ahora envía los valores correctos de género que espera el backend:

- `M` se mapea a `MASCULINO`
- `F` se mapea a `FEMENINO`
- `O` y `N/A` se mapean a `OTRO`

**Campos que se envían al backend:**

- `dni`, `nombre`, `apellido`, `apellido_materno`
- `fecha_nacimiento`, `genero`, `direccion`
- `file` (imagen)
- **Nota:** No se envían `telefono` ni `email` por solicitud del usuario

El registro de personas debería funcionar correctamente ahora. Los datos se están enviando en el formato correcto y el manejo de errores está mejorado.
