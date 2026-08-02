/**
 * SmartRoad AI - ESP32-CAM Vision Stream & Fetcher Module
 */
import { store } from '../store.js';

class CameraModule {
  constructor() {
    this.streamUrl = 'http://192.168.1.50:81/stream';
  }

  init() {
    this.galleryEl = document.getElementById('camera-gallery');
    this.captureBtn = document.getElementById('btn-capture-snapshot');
    this.dashCaptureBtn = document.getElementById('btn-dash-capture-snapshot');
    this.connectDashBtn = document.getElementById('btn-connect-cam-dash');
    this.inputDashUrl = document.getElementById('input-cam-url-dash');
    this.camImgDash = document.getElementById('img-esp32-cam-dash');
    this.camStatusLabel = document.getElementById('cam-status-label');

    if (this.captureBtn) {
      this.captureBtn.addEventListener('click', () => this.captureSnapshot());
    }

    if (this.dashCaptureBtn) {
      this.dashCaptureBtn.addEventListener('click', () => this.captureSnapshot());
    }

    if (this.connectDashBtn && this.inputDashUrl) {
      this.connectDashBtn.addEventListener('click', () => {
        const url = this.inputDashUrl.value.trim();
        if (url) {
          this.setStreamUrl(url);
        }
      });
    }

    store.subscribe('STATE_CHANGED', () => this.renderGallery());
    this.renderGallery();
  }

  setStreamUrl(url) {
    this.streamUrl = url;
    if (this.camImgDash) {
      this.camImgDash.src = url;
      if (this.camStatusLabel) {
        this.camStatusLabel.textContent = 'CONNECTING...';
      }

      this.camImgDash.onload = () => {
        if (this.camStatusLabel) this.camStatusLabel.textContent = 'ESP32-CAM LIVE';
      };

      this.camImgDash.onerror = () => {
        if (this.camStatusLabel) this.camStatusLabel.textContent = 'OV2640 HD (SIMULATION)';
        // Fallback to active simulation stream image on error
        this.camImgDash.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';
      };
    }
  }

  captureSnapshot() {
    const activeSrc = this.camImgDash ? this.camImgDash.src : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';
    
    const newSnap = {
      id: `snap-${Date.now()}`,
      deviceId: 'ESP32-ROAD-001',
      imageUrl: activeSrc,
      capturedAt: new Date().toISOString(),
      detectionType: 'POTHOLE',
      severity: 'CRITICAL',
      latitude: store.getState().telemetry?.latitude || 26.7271,
      longitude: store.getState().telemetry?.longitude || 88.3953
    };

    store.getState().snapshots.unshift(newSnap);
    store.emit('STATE_CHANGED', { type: 'SNAPSHOT_CAPTURED' });
  }

  renderGallery() {
    if (!this.galleryEl) return;
    const { snapshots } = store.getState();

    if (snapshots.length === 0) {
      this.galleryEl.innerHTML = `
        <div class="col-span-full card p-8 text-center text-slate-500 font-mono space-y-2">
          <p class="text-xs">No camera snapshots captured yet.</p>
          <p class="text-[10px] text-slate-600">Click "Snapshot" button or type an ESP32-CAM stream URL above.</p>
        </div>
      `;
      return;
    }

    this.galleryEl.innerHTML = snapshots.map(snap => `
      <div class="card p-3 space-y-2">
        <div class="aspect-video w-full rounded-lg overflow-hidden relative bg-[#111827]">
          <img src="${snap.imageUrl}" class="w-full h-full object-cover" alt="Snapshot" />
          <span class="absolute top-2 left-2 status-badge ${snap.severity === 'CRITICAL' ? 'badge-danger' : 'badge-warning'} text-[10px]">
            ${snap.detectionType}
          </span>
        </div>
        <div class="text-[11px] font-mono space-y-1 text-slate-400">
          <div class="flex justify-between text-slate-300">
            <span>Device:</span> <b>${snap.deviceId}</b>
          </div>
          <div class="flex justify-between">
            <span>Time:</span> <span>${new Date(snap.capturedAt).toLocaleTimeString()}</span>
          </div>
          <div class="flex justify-between text-blue-400">
            <span>GPS:</span> <span>[${snap.latitude}, ${snap.longitude}]</span>
          </div>
        </div>
      </div>
    `).join('');
  }
}

export const cameraModule = new CameraModule();
