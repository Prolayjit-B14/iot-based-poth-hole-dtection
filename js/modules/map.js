/**
 * SmartRoad AI - Interactive Leaflet GIS Map Module
 */
import { store } from '../store.js';

class MapModule {
  constructor() {
    this.mapDashboard = null;
    this.mapFull = null;
    this.markersGroupDash = null;
    this.markersGroupFull = null;
  }

  init() {
    // Wait for Leaflet L object and DOM
    setTimeout(() => {
      this.initDashboardMap();
      this.initFullMap();
    }, 300);

    store.subscribe('DETECTIONS_UPDATED', () => this.renderMarkers());
    store.subscribe('DEVICES_UPDATED', () => this.renderMarkers());
    store.subscribe('STATE_CHANGED', () => this.renderMarkers());
  }

  initDashboardMap() {
    const el = document.getElementById('leaflet-map');
    if (!el || !window.L || this.mapDashboard) return;

    this.mapDashboard = L.map(el).setView([26.7271, 88.3953], 14);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.mapDashboard);

    this.markersGroupDash = L.layerGroup().addTo(this.mapDashboard);
    this.renderMarkers();
  }

  initFullMap() {
    const el = document.getElementById('leaflet-map-full');
    if (!el || !window.L || this.mapFull) return;

    this.mapFull = L.map(el).setView([26.7271, 88.3953], 14);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.mapFull);

    this.markersGroupFull = L.layerGroup().addTo(this.mapFull);
    this.renderMarkers();
  }

  invalidateSize() {
    if (this.mapDashboard) this.mapDashboard.invalidateSize();
    if (this.mapFull) this.mapFull.invalidateSize();
  }

  renderMarkers() {
    if (!window.L) return;
    const { detections, devices } = store.getState();

    [this.markersGroupDash, this.markersGroupFull].forEach(group => {
      if (!group) return;
      group.clearLayers();

      // Render Detection Pins
      detections.forEach(det => {
        const color = det.type === 'POTHOLE' ? '#EF4444' : '#F59E0B';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28" stroke="#0F172A"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
        const icon = L.divIcon({ className: 'custom-leaflet-marker', html: svg, iconSize: [28, 28], iconAnchor: [14, 28] });
        
        L.marker([det.latitude, det.longitude], { icon })
          .addTo(group)
          .bindPopup(`
            <div style="font-family: monospace; font-size: 11px; padding: 4px;">
              <b style="color: ${color}">${det.type}</b><br/>
              Depth: <b>${det.distance} cm</b><br/>
              Device: <b>${det.deviceId}</b><br/>
              Severity: <b style="color: #EF4444">${det.severity}</b>
            </div>
          `);
      });

      // Render Device Location Pins
      devices.filter(d => d.status === 'ONLINE').forEach(dev => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#06B6D4" width="30" height="30" stroke="#FFFFFF"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="#FFFFFF"/></svg>`;
        const icon = L.divIcon({ className: 'custom-device-marker', html: svg, iconSize: [30, 30], iconAnchor: [15, 15] });

        L.marker([dev.latitude, dev.longitude], { icon })
          .addTo(group)
          .bindPopup(`
            <div style="font-family: monospace; font-size: 11px; padding: 4px;">
              <b style="color: #06B6D4">🛰️ ${dev.name}</b><br/>
              ID: ${dev.deviceId}<br/>
              Battery: ${dev.batteryLevel}% | WiFi: ${dev.wifiSignal}%<br/>
              GPS: [${dev.latitude}, ${dev.longitude}]
            </div>
          `);
      });
    });
  }
}

export const mapModule = new MapModule();
