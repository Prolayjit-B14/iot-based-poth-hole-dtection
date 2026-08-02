/**
 * SmartRoad AI - ESP32-CAM Vision Stream Module
 */
import { store } from '../store.js';

class CameraModule {
  init() {
    this.galleryEl = document.getElementById('camera-gallery');
    this.captureBtn = document.getElementById('btn-capture-snapshot');

    if (this.captureBtn) {
      this.captureBtn.addEventListener('click', () => this.captureSnapshot());
    }

    store.subscribe('STATE_CHANGED', () => this.renderGallery());
    this.renderGallery();
  }

  captureSnapshot() {
    const newSnap = {
      id: `snap-manual-${Date.now()}`,
      deviceId: 'ESP32-ROAD-001',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      capturedAt: new Date().toISOString(),
      detectionType: 'POTHOLE',
      severity: 'CRITICAL',
      latitude: 26.7271,
      longitude: 88.3953
    };

    store.getState().snapshots.unshift(newSnap);
    store.emit('STATE_CHANGED', { type: 'SNAPSHOT_CAPTURED' });
  }

  renderGallery() {
    if (!this.galleryEl) return;
    const { snapshots } = store.getState();

    if (snapshots.length === 0) {
      this.galleryEl.innerHTML = `
        <div class="col-span-full glass-card p-8 text-center text-slate-500 font-mono space-y-2">
          <p class="text-xs">No camera snapshots captured yet.</p>
          <p class="text-[10px] text-slate-600">Click "Capture Snapshot" above or log a pothole detection.</p>
        </div>
      `;
      return;
    }

    this.galleryEl.innerHTML = snapshots.map(snap => `
      <div class="glass-card p-3 space-y-2 border border-slate-800 rounded-xl overflow-hidden">
        <img src="${snap.imageUrl}" class="w-full h-32 object-cover rounded-lg border border-slate-800" alt="Snapshot" />
        <div class="flex justify-between items-center text-[11px] font-mono">
          <span class="text-cyan-400 font-bold">${snap.detectionType}</span>
          <span class="text-slate-400">${new Date(snap.capturedAt).toLocaleTimeString()}</span>
        </div>
      </div>
    `).join('');
  }
}

export const cameraModule = new CameraModule();
