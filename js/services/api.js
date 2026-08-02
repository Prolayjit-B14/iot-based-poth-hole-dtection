/**
 * SmartRoad AI - REST API Service Client
 * Connects to backend endpoints or seamlessly updates local store fallback.
 */
import { store } from '../store.js';

const API_BASE = '/api';

export const api = {
  async getDetections(filters) {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.severity) params.append('severity', filters.severity);
      if (filters?.deviceId) params.append('deviceId', filters.deviceId);

      const res = await fetch(`${API_BASE}/detections?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {
      // Return store state on connection offline
    }
    return store.getState().detections;
  },

  async getDevices() {
    try {
      const res = await fetch(`${API_BASE}/devices`);
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {
      // Fallback
    }
    return store.getState().devices;
  },

  async getAlerts() {
    try {
      const res = await fetch(`${API_BASE}/alerts`);
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {
      // Fallback
    }
    return store.getState().alerts;
  },

  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/statistics`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      // Fallback
    }
    return store.getStats();
  },

  async markAlertAsRead(id) {
    store.markAlertRead(id);
    try {
      await fetch(`${API_BASE}/alerts/${id}/read`, { method: 'PUT' });
    } catch (e) {
      // Offline mode
    }
  },

  async markAllAlertsAsRead() {
    store.markAllAlertsRead();
    try {
      await fetch(`${API_BASE}/alerts/read-all`, { method: 'PUT' });
    } catch (e) {
      // Offline mode
    }
  },

  async deleteDetection(id) {
    store.deleteDetection(id);
    try {
      await fetch(`${API_BASE}/detections/${id}`, { method: 'DELETE' });
    } catch (e) {
      // Offline mode
    }
  }
};
