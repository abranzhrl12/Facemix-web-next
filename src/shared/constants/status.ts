// Constantes para los estados del sistema

export const PERSON_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export const CAMERA_STATUS = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  ERROR: 'ERROR',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export const SESSION_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
  COMPLETED: 'COMPLETED',
} as const;

export const NOTIFICATION_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export const NOTIFICATION_TYPE = {
  DETECTION: 'DETECTION',
  CAMERA_OFFLINE: 'CAMERA_OFFLINE',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  ALERT: 'ALERT',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  SUPERVISOR: 'supervisor',
} as const;

// Mapeo de estados a colores para la UI
export const STATUS_COLORS = {
  [PERSON_STATUS.ACTIVE]: 'success',
  [PERSON_STATUS.INACTIVE]: 'warning',
  [PERSON_STATUS.SUSPENDED]: 'error',
  
  [CAMERA_STATUS.ONLINE]: 'success',
  [CAMERA_STATUS.OFFLINE]: 'error',
  [CAMERA_STATUS.ERROR]: 'error',
  [CAMERA_STATUS.MAINTENANCE]: 'warning',
  
  [SESSION_STATUS.PENDING]: 'warning',
  [SESSION_STATUS.ACTIVE]: 'success',
  [SESSION_STATUS.PAUSED]: 'info',
  [SESSION_STATUS.STOPPED]: 'error',
  [SESSION_STATUS.COMPLETED]: 'success',
  
  [NOTIFICATION_PRIORITY.LOW]: 'info',
  [NOTIFICATION_PRIORITY.MEDIUM]: 'warning',
  [NOTIFICATION_PRIORITY.HIGH]: 'error',
  [NOTIFICATION_PRIORITY.CRITICAL]: 'error',
} as const;

// Mapeo de estados a etiquetas en español
export const STATUS_LABELS = {
  [PERSON_STATUS.ACTIVE]: 'Activo',
  [PERSON_STATUS.INACTIVE]: 'Inactivo',
  [PERSON_STATUS.SUSPENDED]: 'Suspendido',
  
  [CAMERA_STATUS.ONLINE]: 'En Línea',
  [CAMERA_STATUS.OFFLINE]: 'Desconectada',
  [CAMERA_STATUS.ERROR]: 'Error',
  [CAMERA_STATUS.MAINTENANCE]: 'Mantenimiento',
  
  [SESSION_STATUS.PENDING]: 'Pendiente',
  [SESSION_STATUS.ACTIVE]: 'Activa',
  [SESSION_STATUS.PAUSED]: 'Pausada',
  [SESSION_STATUS.STOPPED]: 'Detenida',
  [SESSION_STATUS.COMPLETED]: 'Completada',
  
  [NOTIFICATION_PRIORITY.LOW]: 'Baja',
  [NOTIFICATION_PRIORITY.MEDIUM]: 'Media',
  [NOTIFICATION_PRIORITY.HIGH]: 'Alta',
  [NOTIFICATION_PRIORITY.CRITICAL]: 'Crítica',
} as const;

export type PersonStatusType = typeof PERSON_STATUS[keyof typeof PERSON_STATUS];
export type CameraStatusType = typeof CAMERA_STATUS[keyof typeof CAMERA_STATUS];
export type SessionStatusType = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];
export type NotificationPriorityType = typeof NOTIFICATION_PRIORITY[keyof typeof NOTIFICATION_PRIORITY];
export type NotificationTypeType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];
