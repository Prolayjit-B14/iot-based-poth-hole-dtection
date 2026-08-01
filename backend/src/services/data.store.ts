import { Device, Detection, Alert, CameraSnapshot, SystemStats } from '../types';

class DataStoreService {
  private devices: Map<string, Device> = new Map();
  private detections: Detection[] = [];
  private alerts: Alert[] = [];
  private snapshots: CameraSnapshot[] = [];
  private currentDeviceDistance: number = 32.4; // Initial ultrasonic baseline

  constructor() {
    this.seedMockData();
  }

  private seedMockData() {
    // 1. Seed Devices
    const initialDevices: Device[] = [
      {
        id: 'dev-001',
        deviceId: 'ESP32-ROAD-001',
        name: 'Bicycle Patrol Unit Alpha',
        status: 'ONLINE',
        latitude: 26.7271,
        longitude: 88.3953,
        batteryLevel: 94,
        wifiSignal: 88,
        gpsStatus: 'CONNECTED',
        cameraStatus: 'CONNECTED',
        gsmStatus: 'CONNECTED',
        ultrasonicStatus: 'CONNECTED',
        buzzerStatus: 'INACTIVE',
        firmwareVersion: 'v2.4.1',
        lastSeen: new Date().toISOString(),
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      {
        id: 'dev-002',
        deviceId: 'ESP32-ROAD-002',
        name: 'Motorcycle Patrol Unit Beta',
        status: 'ONLINE',
        latitude: 26.7310,
        longitude: 88.3990,
        batteryLevel: 78,
        wifiSignal: 92,
        gpsStatus: 'CONNECTED',
        cameraStatus: 'CONNECTED',
        gsmStatus: 'CONNECTED',
        ultrasonicStatus: 'CONNECTED',
        buzzerStatus: 'INACTIVE',
        firmwareVersion: 'v2.4.1',
        lastSeen: new Date().toISOString(),
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      {
        id: 'dev-003',
        deviceId: 'ESP32-ROAD-003',
        name: 'Highway Inspection Gamma',
        status: 'OFFLINE',
        latitude: 26.7190,
        longitude: 88.3880,
        batteryLevel: 15,
        wifiSignal: 0,
        gpsStatus: 'DISCONNECTED',
        cameraStatus: 'DISCONNECTED',
        gsmStatus: 'DISCONNECTED',
        ultrasonicStatus: 'DISCONNECTED',
        buzzerStatus: 'INACTIVE',
        firmwareVersion: 'v2.3.0',
        lastSeen: new Date(Date.now() - 3 * 3600000).toISOString(),
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
      }
    ];

    initialDevices.forEach(d => this.devices.set(d.deviceId, d));

    // Sample modern road condition imagery standard Unsplash URLs
    const sampleImages = [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80', // Pothole road
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', // Damaged asphalt
      'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80', // Road surface
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'  // City road bump
    ];

    // 2. Seed Historical Detections (Last 7 Days)
    const now = Date.now();
    const mockDetections: Detection[] = [
      {
        id: 'det-101',
        deviceId: 'ESP32-ROAD-001',
        type: 'POTHOLE',
        severity: 'CRITICAL',
        confidence: 96,
        distance: 58.4,
        latitude: 26.7285,
        longitude: 88.3962,
        imageUrl: sampleImages[0],
        timestamp: new Date(now - 15 * 60000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: 'det-102',
        deviceId: 'ESP32-ROAD-001',
        type: 'ROAD_BUMP',
        severity: 'MEDIUM',
        confidence: 92,
        distance: 18.2,
        latitude: 26.7291,
        longitude: 88.3975,
        imageUrl: sampleImages[3],
        timestamp: new Date(now - 45 * 60000).toISOString(),
        status: 'REVIEWED'
      },
      {
        id: 'det-103',
        deviceId: 'ESP32-ROAD-002',
        type: 'POTHOLE',
        severity: 'HIGH',
        confidence: 94,
        distance: 49.8,
        latitude: 26.7322,
        longitude: 88.4012,
        imageUrl: sampleImages[1],
        timestamp: new Date(now - 2 * 3600000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: 'det-104',
        deviceId: 'ESP32-ROAD-001',
        type: 'POTHOLE',
        severity: 'LOW',
        confidence: 88,
        distance: 41.5,
        latitude: 26.7250,
        longitude: 88.3920,
        imageUrl: sampleImages[2],
        timestamp: new Date(now - 5 * 3600000).toISOString(),
        status: 'REPAIRED'
      },
      {
        id: 'det-105',
        deviceId: 'ESP32-ROAD-002',
        type: 'ROAD_BUMP',
        severity: 'HIGH',
        confidence: 91,
        distance: 14.5,
        latitude: 26.7350,
        longitude: 88.4050,
        imageUrl: sampleImages[3],
        timestamp: new Date(now - 14 * 3600000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: 'det-106',
        deviceId: 'ESP32-ROAD-001',
        type: 'POTHOLE',
        severity: 'CRITICAL',
        confidence: 98,
        distance: 63.1,
        latitude: 26.7230,
        longitude: 88.3900,
        imageUrl: sampleImages[0],
        timestamp: new Date(now - 24 * 3600000).toISOString(),
        status: 'ACTIVE'
      }
    ];

    this.detections = mockDetections;

    // 3. Seed Initial Alerts
    this.alerts = [
      {
        id: 'alt-001',
        detectionId: 'det-101',
        deviceId: 'ESP32-ROAD-001',
        type: 'CRITICAL',
        message: 'Severe Pothole (58.4cm depth) detected near Hill Cart Road',
        severity: 'CRITICAL',
        isRead: false,
        createdAt: new Date(now - 15 * 60000).toISOString()
      },
      {
        id: 'alt-002',
        detectionId: 'det-103',
        deviceId: 'ESP32-ROAD-002',
        type: 'WARNING',
        message: 'High severity pothole detected at Station Feeder Road',
        severity: 'HIGH',
        isRead: false,
        createdAt: new Date(now - 2 * 3600000).toISOString()
      },
      {
        id: 'alt-003',
        deviceId: 'ESP32-ROAD-003',
        type: 'SYSTEM',
        message: 'Device ESP32-ROAD-003 lost connection (Offline)',
        severity: 'MEDIUM',
        isRead: true,
        createdAt: new Date(now - 3 * 3600000).toISOString()
      }
    ];

    // 4. Seed Snapshots
    this.snapshots = mockDetections.map(d => ({
      id: `snap-${d.id}`,
      detectionId: d.id,
      deviceId: d.deviceId,
      imageUrl: d.imageUrl || sampleImages[0],
      capturedAt: d.timestamp,
      detectionType: d.type,
      severity: d.severity,
      latitude: d.latitude,
      longitude: d.longitude
    }));
  }

  // --- GETTERS ---
  public getDevices(): Device[] {
    return Array.from(this.devices.values());
  }

  public getDeviceById(deviceId: string): Device | undefined {
    return this.devices.get(deviceId);
  }

  public getDetections(filters?: { type?: string; severity?: string; deviceId?: string }): Detection[] {
    let result = [...this.detections];
    if (filters?.type && filters.type !== 'ALL') {
      result = result.filter(d => d.type === filters.type);
    }
    if (filters?.severity && filters.severity !== 'ALL') {
      result = result.filter(d => d.severity === filters.severity);
    }
    if (filters?.deviceId && filters.deviceId !== 'ALL') {
      result = result.filter(d => d.deviceId === filters.deviceId);
    }
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getDetectionById(id: string): Detection | undefined {
    return this.detections.find(d => d.id === id);
  }

  public getAlerts(): Alert[] {
    return [...this.alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getSnapshots(): CameraSnapshot[] {
    return [...this.snapshots].sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
  }

  public getStats(): SystemStats {
    const today = new Date().toISOString().split('T')[0];
    const activeDevs = Array.from(this.devices.values()).filter(d => d.status === 'ONLINE').length;
    
    return {
      totalDetections: this.detections.length,
      totalPotholes: this.detections.filter(d => d.type === 'POTHOLE').length,
      totalBumps: this.detections.filter(d => d.type === 'ROAD_BUMP').length,
      todayDetections: this.detections.filter(d => d.timestamp.startsWith(today)).length,
      criticalDetections: this.detections.filter(d => d.severity === 'CRITICAL' || d.severity === 'HIGH').length,
      activeDevices: activeDevs,
      systemStatus: activeDevs > 0 ? 'ONLINE' : 'DEGRADED'
    };
  }

  // --- MUTATIONS ---
  public addDetection(detectionData: Omit<Detection, 'id'>): { detection: Detection; alert?: Alert } {
    const id = `det-${Date.now()}`;
    const newDetection: Detection = {
      ...detectionData,
      id
    };

    this.detections.unshift(newDetection);

    // Update Device Last Seen & Position
    const dev = this.devices.get(newDetection.deviceId);
    if (dev) {
      dev.lastSeen = new Date().toISOString();
      dev.latitude = newDetection.latitude;
      dev.longitude = newDetection.longitude;
      dev.status = 'ONLINE';
      if (newDetection.type !== 'NORMAL') {
        dev.buzzerStatus = 'ACTIVE';
        setTimeout(() => { dev.buzzerStatus = 'INACTIVE'; }, 3000);
      }
    }

    // Create Camera Snapshot if URL present
    if (newDetection.imageUrl) {
      this.snapshots.unshift({
        id: `snap-${id}`,
        detectionId: id,
        deviceId: newDetection.deviceId,
        imageUrl: newDetection.imageUrl,
        capturedAt: newDetection.timestamp,
        detectionType: newDetection.type,
        severity: newDetection.severity,
        latitude: newDetection.latitude,
        longitude: newDetection.longitude
      });
    }

    // Create Alert if Pothole/Bump detected
    let alert: Alert | undefined;
    if (newDetection.type !== 'NORMAL') {
      alert = {
        id: `alt-${Date.now()}`,
        detectionId: id,
        deviceId: newDetection.deviceId,
        type: newDetection.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
        message: `${newDetection.type.replace('_', ' ')} Detected (${newDetection.distance}cm ultrasonic reading) by ${newDetection.deviceId}`,
        severity: newDetection.severity,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      this.alerts.unshift(alert);
    }

    return { detection: newDetection, alert };
  }

  public registerOrUpdateDevice(deviceData: Partial<Device> & { deviceId: string }): Device {
    const existing = this.devices.get(deviceData.deviceId);
    const nowStr = new Date().toISOString();

    if (existing) {
      const updated: Device = {
        ...existing,
        ...deviceData,
        lastSeen: nowStr
      };
      this.devices.set(deviceData.deviceId, updated);
      return updated;
    } else {
      const newDev: Device = {
        id: `dev-${Date.now()}`,
        deviceId: deviceData.deviceId,
        name: deviceData.name || `ESP32 Device (${deviceData.deviceId})`,
        status: deviceData.status || 'ONLINE',
        latitude: deviceData.latitude ?? 26.7271,
        longitude: deviceData.longitude ?? 88.3953,
        batteryLevel: deviceData.batteryLevel ?? 100,
        wifiSignal: deviceData.wifiSignal ?? 85,
        gpsStatus: deviceData.gpsStatus || 'CONNECTED',
        cameraStatus: deviceData.cameraStatus || 'CONNECTED',
        gsmStatus: deviceData.gsmStatus || 'CONNECTED',
        ultrasonicStatus: deviceData.ultrasonicStatus || 'CONNECTED',
        buzzerStatus: deviceData.buzzerStatus || 'INACTIVE',
        firmwareVersion: deviceData.firmwareVersion || 'v2.4.1',
        lastSeen: nowStr,
        createdAt: nowStr
      };
      this.devices.set(deviceData.deviceId, newDev);
      return newDev;
    }
  }

  public deleteDetection(id: string): boolean {
    const idx = this.detections.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.detections.splice(idx, 1);
      return true;
    }
    return false;
  }

  public markAlertRead(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      return true;
    }
    return false;
  }

  public markAllAlertsRead(): void {
    this.alerts.forEach(a => (a.isRead = true));
  }
}

export const dataStore = new DataStoreService();
