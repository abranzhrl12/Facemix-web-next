// Endpoints de la API para conectar con el backend de Python

export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Gestión de personas
  PEOPLE: {
    LIST: '/people',
    CREATE: '/people',
    GET_BY_ID: (id: string) => `/people/${id}`,
    UPDATE: (id: string) => `/people/${id}`,
    DELETE: (id: string) => `/people/${id}`,
    SEARCH: '/people/search',
    UPLOAD_IMAGE: (id: string) => `/people/${id}/image`,
  },

  // Monitoreo de cámaras
  CAMERAS: {
    LIST: '/cameras',
    CREATE: '/cameras',
    GET_BY_ID: (id: string) => `/cameras/${id}`,
    UPDATE: (id: string) => `/cameras/${id}`,
    DELETE: (id: string) => `/cameras/${id}`,
    STATUS: '/cameras/status',
    ACTIVITY: (id: string) => `/cameras/${id}/activity`,
  },

  // Historial de detecciones
  DETECTIONS: {
    LIST: '/detections',
    CREATE: '/detections',
    GET_BY_ID: (id: string) => `/detections/${id}`,
    SEARCH: '/detections/search',
    STATISTICS: '/detections/statistics',
    EXPORT: '/detections/export',
  },

  // Gestión de sesiones
  SESSIONS: {
    LIST: '/sessions',
    CREATE: '/sessions',
    GET_BY_ID: (id: string) => `/sessions/${id}`,
    UPDATE: (id: string) => `/sessions/${id}`,
    START: (id: string) => `/sessions/${id}/start`,
    PAUSE: (id: string) => `/sessions/${id}/pause`,
    STOP: (id: string) => `/sessions/${id}/stop`,
    STATISTICS: (id: string) => `/sessions/${id}/statistics`,
  },

  // Ubicaciones
  LOCATIONS: {
    LIST: '/locations',
    CREATE: '/locations',
    GET_BY_ID: (id: string) => `/locations/${id}`,
    UPDATE: (id: string) => `/locations/${id}`,
    DELETE: (id: string) => `/locations/${id}`,
    CAMERAS: (id: string) => `/locations/${id}/cameras`,
  },

  // Reportes y analíticas
  REPORTS: {
    ACTIVITY: '/reports/activity',
    PEOPLE: '/reports/people',
    CAMERAS: '/reports/cameras',
    EXPORT_PDF: '/reports/export/pdf',
    EXPORT_EXCEL: '/reports/export/excel',
  },

  // Configuración del sistema
  SYSTEM: {
    CONFIG: '/system/config',
    USERS: '/system/users',
    ROLES: '/system/roles',
    PERMISSIONS: '/system/permissions',
    AI_MODELS: '/system/ai-models',
  },

  // Notificaciones y alertas
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    SETTINGS: '/notifications/settings',
  },

  // WebSocket endpoints para tiempo real
  WEBSOCKET: {
    DETECTIONS: '/ws/detections',
    CAMERA_STATUS: '/ws/camera-status',
    ALERTS: '/ws/alerts',
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
