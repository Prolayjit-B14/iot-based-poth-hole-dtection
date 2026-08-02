/**
 * SmartRoad AI - Interactive Leaflet GIS Map & Real-time GPS Stream Fetcher Module
 */
import { store } from '../store.js';

class MapModule {
  constructor() {
    this.mapDashboard = null;
    this.mapFull = null;
    this.markersGroupDash = null;
    this.markersGroupFull = null;
    this.currentGps = { lat: 26.7271, lng: 88.3953 };
    this.routeHistory = [
      [26.7230, 88.3900],
      [26.7250, 88.3920],
      [26.7271, 88.3953],
      [26.7285, 88.3962],
      [26.7291, 88.3975],
      [26.7310, 88.3990],
      [26.7322, 88.4012],
      [26.7350, 88.4050]
    ];
  }

  init() {
    setTimeout(() => {
      this.initDashboardMap();
      this.initFullMap();
    }, 300);

    store.subscribe('DETECTIONS_UPDATED', () => this.renderMarkers());
    store.subscribe('DEVICES_UPDATED', () => this.renderMarkers());
    store.subscribe('STATE_CHANGED', () => this.renderMarkers());
    store.subscribe('TELEMETRY_UPDATED', (data) => this.onTelemetryStream(data));
  }

  onTelemetryStream(data) {
    if (data && data.latitude && data.longitude) {
      this.updateGPSPosition(data.latitude, data.longitude);
    }
  }

  updateGPSPosition(lat, lng) {
    this.currentGps = { lat, lng };
    
    // Append to route history polyline if new coordinate
    const last = this.routeHistory[this.routeHistory.length - 1];
    if (!last || Math.abs(last[0] - lat) > 0.0001 || Math.abs(last[1] - lng) > 0.0001) {
      this.routeHistory.push([lat, lng]);
    }

    // Pan maps smoothly to current vehicle position
    if (this.mapDashboard) this.mapDashboard.panTo([lat, lng]);
    if (this.mapFull) this.mapFull.panTo([lat, lng]);

    // Update GPS lat / long text labels in Detection Analysis Panel
    const latEl = document.getElementById('panel-gps-lat');
    const longEl = document.getElementById('panel-gps-long');
    if (latEl) latEl.textContent = `${lat.toFixed(4)}° N`;
    if (longEl) longEl.textContent = `${lng.toFixed(4)}° E`;

    this.renderMarkers();
  }

  initDashboardMap() {
    const el = document.getElementById('leaflet-map');
    if (!el || !window.L || this.mapDashboard) return;

    this.mapDashboard = L.map(el, { zoomControl: true }).setView([this.currentGps.lat, this.currentGps.lng], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.mapDashboard);

    this.markersGroupDash = L.layerGroup().addTo(this.mapDashboard);
    this.renderMarkers();
  }

  initFullMap() {
    const el = document.getElementById('leaflet-map-full');
    if (!el || !window.L || this.mapFull) return;

    this.mapFull = L.map(el, { zoomControl: true }).setView([this.currentGps.lat, this.currentGps.lng], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
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

      // Render Dashed Blue Route History Polyline
      L.polyline(this.routeHistory, {
        color: '#2563EB',
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.85
      }).addTo(group);

      // Render Hazard Detection Pins
      detections.forEach(det => {
        const isCritical = det.severity === 'CRITICAL';
        const color = isCritical ? '#DC2626' : det.type === 'POTHOLE' ? '#EF4444' : '#F59E0B';
        const iconSymbol = isCritical ? '⚠️' : det.type === 'POTHOLE' ? '▲' : '▲';
        
        const html = `<div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 13px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1.5px solid #FFFFFF;">${iconSymbol}</div>`;
        const icon = L.divIcon({ className: 'custom-leaflet-marker', html, iconSize: [26, 26], iconAnchor: [13, 13] });
        
        L.marker([det.latitude, det.longitude], { icon })
          .addTo(group)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
              <b style="color: ${color}">${det.type} (${det.severity})</b><br/>
              Depth: <b>${det.distance} cm</b><br/>
              Device: <b>${det.deviceId}</b><br/>
              GPS: [${det.latitude}, ${det.longitude}]
            </div>
          `);
      });

      // Render Current Vehicle Position Pin (Green Vehicle Marker)
      const currentLat = this.currentGps.lat;
      const currentLng = this.currentGps.lng;
      const html = `<div style="background-color: #10B981; width: 32px; height: 32px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 16px; box-shadow: 0 0 12px rgba(16, 185, 129, 0.6); border: 2px solid #FFFFFF;">🚗</div>`;
      const vehicleIcon = L.divIcon({ className: 'custom-device-marker', html, iconSize: [32, 32], iconAnchor: [16, 16] });

      L.marker([currentLat, currentLng], { icon: vehicleIcon })
        .addTo(group)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
            <b style="color: #10B981">🚗 ESP32 Sensing Vehicle</b><br/>
            Status: <b>ACTIVE TRACKING</b><br/>
            Position: [${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}]<br/>
            GPS Fix: <b>3D LOCK (±0.5m)</b>
          </div>
        `);
    });
  }
}

export const mapModule = new MapModule();
