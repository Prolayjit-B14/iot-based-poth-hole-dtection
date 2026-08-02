/**
 * SmartRoad AI - Reactive Vanilla JS State Store
 * Manages central application state and emits change events to UI modules.
 */

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
];

const INITIAL_DEVICES = [
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
    lastSeen: new Date().toISOString()
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
    lastSeen: new Date().toISOString()
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
    lastSeen: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

const INITIAL_DETECTIONS = [
  {
    id: 'det-101',
    deviceId: 'ESP32-ROAD-001',
    type: 'POTHOLE',
    severity: 'CRITICAL',
    confidence: 96,
    distance: 58.4,
    latitude: 26.7285,
    longitude: 88.3962,
    imageUrl: SAMPLE_IMAGES[0],
    timestamp: new Date(Date.now() - 900000).toISOString(),
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
    imageUrl: SAMPLE_IMAGES[3],
    timestamp: new Date(Date.now() - 2700000).toISOString(),
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
    imageUrl: SAMPLE_IMAGES[1],
    timestamp: new Date(Date.now() - 7200000).toISOString(),
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
    imageUrl: SAMPLE_IMAGES[2],
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    status: 'REPAIRED'
  }
];

const INITIAL_ALERTS = [
  {
    id: 'alt-001',
    detectionId: 'det-101',
    deviceId: 'ESP32-ROAD-001',
    type: 'CRITICAL',
    message: 'Severe Pothole (58.4cm depth) detected near Hill Cart Road',
    severity: 'CRITICAL',
    isRead: false,
    createdAt: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: 'alt-002',
    detectionId: 'det-103',
    deviceId: 'ESP32-ROAD-002',
    type: 'WARNING',
    message: 'High severity pothole detected at Station Feeder Road',
    severity: 'HIGH',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

class Store {
  constructor() {
    this.state = {
      demoMode: true,
      devices: INITIAL_DEVICES,
      detections: INITIAL_DETECTIONS,
      alerts: INITIAL_ALERTS,
      snapshots: INITIAL_DETECTIONS.map(d => ({
        id: `snap-${d.id}`,
        detectionId: d.id,
        deviceId: d.deviceId,
        imageUrl: d.imageUrl,
        capturedAt: d.timestamp,
        detectionType: d.type,
        severity: d.severity,
        latitude: d.latitude,
        longitude: d.longitude
      })),
      selectedDetection: null,
      lastAction: null,
      ultrasonicDistance: 32.4
    };

    this.listeners = new Map();
  }

  // Pub-Sub Event Registration
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(fn => fn(data, this.state));
    }
  }

  // Getters
  getState() {
    return this.state;
  }

  getStats() {
    const today = new Date().toISOString().split('T')[0];
    const activeDevs = this.state.devices.filter(d => d.status === 'ONLINE').length;
    return {
      totalDetections: this.state.detections.length,
      totalPotholes: this.state.detections.filter(d => d.type === 'POTHOLE').length,
      totalBumps: this.state.detections.filter(d => d.type === 'ROAD_BUMP').length,
      todayDetections: this.state.detections.filter(d => d.timestamp.startsWith(today)).length,
      criticalDetections: this.state.detections.filter(d => d.severity === 'CRITICAL' || d.severity === 'HIGH').length,
      activeDevices: activeDevs,
      systemStatus: activeDevs > 0 ? 'ONLINE' : 'DEGRADED'
    };
  }

  // Mutations
  toggleDemoMode() {
    this.state.demoMode = !this.state.demoMode;
    this.emit('STATE_CHANGED', { type: 'DEMO_MODE_TOGGLED' });
  }

  addDetection(newDet, alertMessage) {
    this.state.detections = [newDet, ...this.state.detections];
    if (newDet.imageUrl) {
      this.state.snapshots = [
        {
          id: `snap-${newDet.id}`,
          detectionId: newDet.id,
          deviceId: newDet.deviceId,
          imageUrl: newDet.imageUrl,
          capturedAt: newDet.timestamp,
          detectionType: newDet.type,
          severity: newDet.severity,
          latitude: newDet.latitude,
          longitude: newDet.longitude
        },
        ...this.state.snapshots
      ];
    }

    if (alertMessage || newDet.type !== 'NORMAL') {
      const alert = {
        id: `alt-${Date.now()}`,
        detectionId: newDet.id,
        deviceId: newDet.deviceId,
        type: newDet.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
        message: alertMessage || `${newDet.type.replace('_', ' ')} Detected (${newDet.distance}cm ultrasonic reading)`,
        severity: newDet.severity,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      this.state.alerts = [alert, ...this.state.alerts];
    }

    this.state.lastAction = `Log: ${newDet.type} (${newDet.distance}cm) recorded at [${newDet.latitude}, ${newDet.longitude}]`;
    this.emit('DETECTIONS_UPDATED', this.state.detections);
    this.emit('STATE_CHANGED', { type: 'NEW_DETECTION', data: newDet });
  }

  deleteDetection(id) {
    this.state.detections = this.state.detections.filter(d => d.id !== id);
    this.emit('DETECTIONS_UPDATED', this.state.detections);
    this.emit('STATE_CHANGED', { type: 'DETECTION_DELETED', id });
  }

  moveGps(deviceId = 'ESP32-ROAD-001') {
    this.state.devices = this.state.devices.map(d => {
      if (d.deviceId === deviceId) {
        const deltaLat = (Math.random() - 0.48) * 0.003;
        const deltaLng = (Math.random() - 0.48) * 0.003;
        const newLat = Number((d.latitude + deltaLat).toFixed(5));
        const newLng = Number((d.longitude + deltaLng).toFixed(5));
        this.state.lastAction = `${d.deviceId} moved to [${newLat}, ${newLng}]`;
        return { ...d, latitude: newLat, longitude: newLng, lastSeen: new Date().toISOString() };
      }
      return d;
    });

    this.emit('DEVICES_UPDATED', this.state.devices);
    this.emit('STATE_CHANGED', { type: 'GPS_MOVED' });
  }

  markAlertRead(id) {
    this.state.alerts = this.state.alerts.map(a => (a.id === id ? { ...a, isRead: true } : a));
    this.emit('ALERTS_UPDATED', this.state.alerts);
  }

  markAllAlertsRead() {
    this.state.alerts = this.state.alerts.map(a => ({ ...a, isRead: true }));
    this.emit('ALERTS_UPDATED', this.state.alerts);
  }

  setSelectedDetection(det) {
    this.state.selectedDetection = det;
    this.emit('MODAL_CHANGED', det);
  }

  exportCSV() {
    const headers = ['ID', 'Device ID', 'Type', 'Severity', 'Distance(cm)', 'Latitude', 'Longitude', 'Timestamp'];
    const rows = this.state.detections.map(d => [d.id, d.deviceId, d.type, d.severity, d.distance, d.latitude, d.longitude, d.timestamp]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartroad_detections_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const store = new Store();
export { SAMPLE_IMAGES };
