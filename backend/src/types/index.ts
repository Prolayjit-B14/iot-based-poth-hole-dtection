export type DetectionType = 'POTHOLE' | 'ROAD_BUMP' | 'NORMAL';
export type SeverityType = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DeviceStatusType = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
export type AlertType = 'CRITICAL' | 'WARNING' | 'INFO' | 'SYSTEM';
export type UserRole = 'ADMIN' | 'OPERATOR' | 'VIEWER';

export interface Device {
  id: string;
  deviceId: string;
  name: string;
  status: DeviceStatusType;
  latitude: number;
  longitude: number;
  batteryLevel: number;
  wifiSignal: number;
  gpsStatus: 'CONNECTED' | 'DISCONNECTED';
  cameraStatus: 'CONNECTED' | 'DISCONNECTED';
  gsmStatus: 'CONNECTED' | 'DISCONNECTED';
  ultrasonicStatus: 'CONNECTED' | 'DISCONNECTED';
  buzzerStatus: 'ACTIVE' | 'INACTIVE';
  firmwareVersion: string;
  lastSeen: string;
  createdAt: string;
}

export interface Detection {
  id: string;
  deviceId: string;
  type: DetectionType;
  severity: SeverityType;
  confidence: number;
  distance: number; // in cm
  latitude: number;
  longitude: number;
  imageUrl?: string;
  timestamp: string;
  status: 'ACTIVE' | 'REVIEWED' | 'REPAIRED' | 'DISMISSED';
}

export interface Alert {
  id: string;
  detectionId?: string;
  deviceId: string;
  type: AlertType;
  message: string;
  severity: SeverityType;
  isRead: boolean;
  createdAt: string;
}

export interface CameraSnapshot {
  id: string;
  detectionId?: string;
  deviceId: string;
  imageUrl: string;
  capturedAt: string;
  detectionType?: DetectionType;
  severity?: SeverityType;
  latitude?: number;
  longitude?: number;
}

export interface SystemStats {
  totalDetections: number;
  totalPotholes: number;
  totalBumps: number;
  todayDetections: number;
  criticalDetections: number;
  activeDevices: number;
  systemStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
}
