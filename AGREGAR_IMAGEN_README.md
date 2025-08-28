# Funcionalidad: Agregar Imagen a Persona Existente

## Descripción

Esta funcionalidad permite agregar nuevas imágenes/fotos a personas ya registradas en el sistema de reconocimiento facial, mejorando la precisión del reconocimiento al tener múltiples ángulos y condiciones de iluminación.

## Endpoint del Backend

```
POST /embeddings/person/{person_id}/add-image
```

### Parámetros

- **person_id** (path, requerido): UUID de la persona existente
- **file** (form-data, requerido): Archivo de imagen
- **confidence_level** (form-data, opcional): Nivel de confianza (0.0 - 1.0, default: 0.8)
- **source_image** (form-data, opcional): Descripción de la imagen (default: "foto_adicional")

### Respuesta

```json
{
  "success": true,
  "message": "Imagen agregada exitosamente",
  "personId": "123e4567-e89b-12d3-a456-426614174000",
  "embeddingId": "456e7890-e89b-12d3-a456-426614174000",
  "processing_time_ms": 150
}
```

## Estructura de Archivos

```
src/
├── app/
│   └── people/
│       └── add-image/
│           ├── page.tsx                    # Página principal
│           └── page.module.scss            # Estilos de la página
└── features/
    └── people/
        ├── components/
        │   └── AddImageToPersonForm/
        │       ├── AddImageToPersonForm.tsx    # Componente del formulario
        │       ├── AddImageToPersonForm.module.scss  # Estilos del formulario
        │       └── index.ts                     # Exportaciones
        └── services/
            └── peopleService.ts                 # Servicio con método addImageToPerson
```

## Características del Formulario

### 1. **Identificación de Persona**
- Campo para ingresar el UUID de la persona existente
- Validación de formato UUID
- Campo obligatorio

### 2. **Configuración de la Imagen**
- **Nivel de Confianza**: Control deslizante de 0.0 a 1.0 (default: 0.8)
- **Descripción de la Imagen**: Campo de texto para describir la imagen (default: "foto_adicional")

### 3. **Subida de Imagen**
- **Drag & Drop**: Arrastrar y soltar imágenes directamente
- **Selector de Archivos**: Click para abrir el explorador de archivos
- **Preview**: Vista previa de la imagen seleccionada
- **Validación**: Solo acepta archivos de imagen (JPG, PNG, GIF)
- **Información del Archivo**: Nombre, tamaño y botón para remover

### 4. **Validaciones**
- UUID válido requerido
- Imagen requerida
- Nivel de confianza entre 0 y 1
- Formato de imagen válido

### 5. **Estados del Formulario**
- **Loading**: Spinner durante el envío
- **Error**: Mensajes de error con estilo visual
- **Success**: Mensajes de éxito con información del embedding
- **Disabled**: Campos deshabilitados durante el procesamiento

## Flujo de Uso

1. **Acceso**: Navegar a `/people/add-image`
2. **Identificación**: Ingresar el UUID de la persona existente
3. **Configuración**: Ajustar nivel de confianza y descripción (opcional)
4. **Selección de Imagen**: Arrastrar imagen o hacer click para seleccionar
5. **Validación**: El sistema valida todos los campos
6. **Envío**: Se envía la imagen al backend para procesamiento
7. **Confirmación**: Se muestra mensaje de éxito con IDs generados

## Integración con el Sistema

### Navegación
- Enlace desde la página principal (`/`)
- Enlace desde el menú de navegación (cuando esté implementado)
- Redirección al dashboard después de cancelar

### Autenticación
- Requiere sesión activa de Supabase
- Token de autorización enviado en headers
- Manejo de errores de autenticación

### Manejo de Errores
- Errores de validación del backend
- Errores de red y servidor
- Errores de formato de archivo
- Mensajes de error descriptivos

## Estilos y Diseño

### Diseño Responsivo
- Grid adaptativo para diferentes tamaños de pantalla
- Layout móvil optimizado
- Breakpoints en 768px

### Tema Visual
- Gradientes modernos (azul a púrpura)
- Efectos de hover y transiciones suaves
- Iconos emoji para mejor UX
- Sombras y efectos de profundidad

### Componentes Reutilizables
- Estructura similar al formulario de registro
- Estilos consistentes con el sistema
- Patrones de diseño unificados

## Consideraciones Técnicas

### Performance
- Lazy loading de componentes
- Optimización de imágenes con preview
- Manejo eficiente de archivos grandes

### Seguridad
- Validación de tipos de archivo
- Límites de tamaño de archivo
- Sanitización de inputs

### Accesibilidad
- Labels descriptivos
- Mensajes de error claros
- Navegación por teclado
- Contraste adecuado

## Próximas Mejoras

1. **Búsqueda de Personas**: Integrar búsqueda por nombre/DNI en lugar de solo UUID
2. **Historial de Imágenes**: Mostrar imágenes existentes de la persona
3. **Batch Upload**: Subir múltiples imágenes a la vez
4. **Progreso de Carga**: Barra de progreso para archivos grandes
5. **Validación de Calidad**: Análisis automático de calidad de imagen
6. **Integración con Cámara**: Captura directa desde cámara web

## Dependencias

- Next.js 14+
- React 18+
- TypeScript
- SCSS Modules
- Supabase Client
- Fetch API nativo

## Instalación y Configuración

1. Asegurar que las dependencias estén instaladas
2. Configurar variables de entorno para el backend
3. Verificar conexión con Supabase
4. Probar endpoint del backend

## Testing

- Validación de formulario
- Manejo de errores
- Responsividad en diferentes dispositivos
- Integración con backend
- Flujos de usuario completos
