// Tipos que reflejan la respuesta de la API del backend de Python

// Tipos base
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Autenticación
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export type UserRole = 'admin' | 'operator' | 'supervisor';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

// Gestión de personas
export interface Person extends BaseEntity {
  dni: string;
  first_name: string;
  last_name: string;
  status: PersonStatus;
  reference_image_url?: string;
  last_detection?: string;
  detection_count: number;
}

export type PersonStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface CreatePersonRequest {
  dni: string;
  first_name: string;
  last_name: string;
  status: PersonStatus;
  reference_image?: File;
}

export interface UpdatePersonRequest {
  first_name?: string;
  last_name?: string;
  status?: PersonStatus;
}

// Monitoreo de cámaras
export interface Camera extends BaseEntity {
  name: string;
  ip_address: string;
  location_id: string;
  status: CameraStatus;
  last_activity: string;
  is_recording: boolean;
  model: string;
  resolution: string;
}

export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'ERROR' | 'MAINTENANCE';

export interface CreateCameraRequest {
  name: string;
  ip_address: string;
  location_id: string;
  model: string;
  resolution: string;
}

export interface UpdateCameraRequest {
  name?: string;
  ip_address?: string;
  location_id?: string;
  model?: string;
  resolution?: string;
}

// Historial de detecciones
export interface Detection extends BaseEntity {
  person_id?: string;
  camera_id: string;
  confidence: number;
  image_url: string;
  timestamp: string;
  location: string;
  is_recognized: boolean;
  person?: Person;
  camera?: Camera;
}

export interface DetectionStatistics {
  total_detections: number;
  recognized_persons: number;
  unrecognized_persons: number;
  average_confidence: number;
  detections_by_hour: Array<{
    hour: number;
    count: number;
  }>;
  detections_by_day: Array<{
    date: string;
    count: number;
  }>;
}

// Gestión de sesiones
export interface Session extends BaseEntity {
  name: string;
  location_id: string;
  status: SessionStatus;
  start_time?: string;
  end_time?: string;
  duration?: number;
  camera_count: number;
  detection_count: number;
}

export type SessionStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'STOPPED' | 'COMPLETED';

export interface CreateSessionRequest {
  name: string;
  location_id: string;
  camera_ids: string[];
}

export interface SessionStatistics {
  session_id: string;
  total_detections: number;
  unique_persons: number;
  average_confidence: number;
  camera_performance: Array<{
    camera_id: string;
    detection_count: number;
    uptime_percentage: number;
  }>;
}

// Ubicaciones
export interface Location extends BaseEntity {
  name: string;
  description?: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  camera_count: number;
  is_active: boolean;
}

export interface CreateLocationRequest {
  name: string;
  description?: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Reportes y analíticas
export interface ReportRequest {
  start_date: string;
  end_date: string;
  location_id?: string;
  camera_id?: string;
  person_id?: string;
  format: 'pdf' | 'excel';
}

export interface ActivityReport {
  period: string;
  total_detections: number;
  unique_persons: number;
  camera_uptime: number;
  top_detected_persons: Array<{
    person_id: string;
    person_name: string;
    detection_count: number;
  }>;
}

// Configuración del sistema
export interface SystemConfig {
  confidence_threshold: number;
  ai_model: string;
  detection_interval: number;
  alert_settings: {
    email_enabled: boolean;
    sms_enabled: boolean;
    webhook_enabled: boolean;
  };
  storage_settings: {
    max_image_age_days: number;
    compression_enabled: boolean;
  };
}

// Notificaciones y alertas
export interface Notification extends BaseEntity {
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  priority: NotificationPriority;
  metadata?: Record<string, any>;
}

export type NotificationType = 'DETECTION' | 'CAMERA_OFFLINE' | 'SYSTEM_ERROR' | 'ALERT';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Filtros y búsqueda
export interface SearchFilters {
  query?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  location_id?: string;
  camera_id?: string;
  person_id?: string;
}

export interface PaginationParams {
  page: number;
  page_size: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
