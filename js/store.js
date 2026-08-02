/**
 * SmartRoad AI - Clean Reactive State Store
 * Manages application state without pre-populated hardcoded mock data.
 */

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
];

class Store {
  constructor() {
    this.state = {
      demoMode: true,
      devices: [],
      detections: [],
      alerts: [],
      snapshots: [],
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
      systemStatus: activeDevs > 0 ? 'ONLINE' : 'STANDBY'
    };
  }

  // Mutations
  toggleDemoMode() {
    this.state.demoMode = !this.state.demoMode;
    this.emit('STATE_CHANGED', { type: 'DEMO_MODE_TOGGLED' });
  }

  addDetection(newDet, alertMessage) {
    this.state.detections = [newDet, ...this.state.detections];

    // Auto-register device if not existing
    let dev = this.state.devices.find(d => d.deviceId === newDet.deviceId);
    if (!dev) {
      dev = {
        id: `dev-${Date.now()}`,
        deviceId: newDet.deviceId,
        name: `Mobile Unit (${newDet.deviceId})`,
        status: 'ONLINE',
        latitude: newDet.latitude,
        longitude: newDet.longitude,
        batteryLevel: 95,
        wifiSignal: 88,
        gpsStatus: 'CONNECTED',
        cameraStatus: 'CONNECTED',
        gsmStatus: 'CONNECTED',
        ultrasonicStatus: 'CONNECTED',
        buzzerStatus: 'INACTIVE',
        firmwareVersion: 'v2.4.1',
        lastSeen: new Date().toISOString()
      };
      this.state.devices.unshift(dev);
      this.emit('DEVICES_UPDATED', this.state.devices);
    } else {
      dev.lastSeen = new Date().toISOString();
      dev.latitude = newDet.latitude;
      dev.longitude = newDet.longitude;
      dev.status = 'ONLINE';
      this.emit('DEVICES_UPDATED', this.state.devices);
    }

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
      this.emit('ALERTS_UPDATED', this.state.alerts);
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
    let dev = this.state.devices.find(d => d.deviceId === deviceId);
    if (!dev) {
      dev = {
        id: `dev-${Date.now()}`,
        deviceId,
        name: `Bicycle Patrol Unit Alpha`,
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
      };
      this.state.devices.unshift(dev);
    } else {
      const deltaLat = (Math.random() - 0.48) * 0.003;
      const deltaLng = (Math.random() - 0.48) * 0.003;
      dev.latitude = Number((dev.latitude + deltaLat).toFixed(5));
      dev.longitude = Number((dev.longitude + deltaLng).toFixed(5));
      dev.lastSeen = new Date().toISOString();
    }

    this.state.lastAction = `${deviceId} moved to [${dev.latitude}, ${dev.longitude}]`;
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
    if (this.state.detections.length === 0) return;
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
