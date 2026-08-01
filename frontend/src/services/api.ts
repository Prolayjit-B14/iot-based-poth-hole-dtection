import { Detection, Device, Alert, CameraSnapshot, SystemStats } from '../types';

const API_BASE = '/api';

export const api = {
  // Detections
  async getDetections(filters?: { type?: string; severity?: string; deviceId?: string }): Promise<Detection[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.deviceId) params.append('deviceId', filters.deviceId);

    const res = await fetch(`${API_BASE}/detections?${params.toString()}`);
    const json = await res.json();
    return json.data || [];
  },

  async getDetectionById(id: string): Promise<Detection | null> {
    const res = await fetch(`${API_BASE}/detections/${id}`);
    const json = await res.json();
    return json.data || null;
  },

  async createDetection(data: Partial<Detection>): Promise<{ success: boolean; data: Detection; alert?: Alert }> {
    const res = await fetch(`${API_BASE}/detections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteDetection(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/detections/${id}`, { method: 'DELETE' });
    const json = await res.json();
    return json.success || false;
  },

  // Devices
  async getDevices(): Promise<Device[]> {
    const res = await fetch(`${API_BASE}/devices`);
    const json = await res.json();
    return json.data || [];
  },

  async registerDevice(data: Partial<Device>): Promise<Device> {
    const res = await fetch(`${API_BASE}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json.data;
  },

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    const res = await fetch(`${API_BASE}/alerts`);
    const json = await res.json();
    return json.data || [];
  },

  async markAlertAsRead(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/alerts/${id}/read`, { method: 'PUT' });
    const json = await res.json();
    return json.success || false;
  },

  async markAllAlertsAsRead(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/alerts/read-all`, { method: 'PUT' });
    const json = await res.json();
    return json.success || false;
  },

  // Snapshots
  async getSnapshots(): Promise<CameraSnapshot[]> {
    const res = await fetch(`${API_BASE}/snapshots`);
    const json = await res.json();
    return json.data || [];
  },

  // Stats
  async getStats(): Promise<SystemStats> {
    const res = await fetch(`${API_BASE}/statistics`);
    const json = await res.json();
    return json.data;
  },

  // Demo Simulation Triggers
  async simulatePothole() {
    const res = await fetch(`${API_BASE}/demo/simulate-pothole`, { method: 'POST' });
    return await res.json();
  },

  async simulateBump() {
    const res = await fetch(`${API_BASE}/demo/simulate-bump`, { method: 'POST' });
    return await res.json();
  },

  async moveGps() {
    const res = await fetch(`${API_BASE}/demo/move-gps`, { method: 'POST' });
    return await res.json();
  }
};
