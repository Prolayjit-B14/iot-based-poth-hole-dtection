/**
 * SmartRoad AI - Detection Inspection Modal Dialog Module
 */
import { store } from '../store.js';

class ModalModule {
  init() {
    this.overlayEl = document.getElementById('modal-overlay');
    this.closeBtn = document.getElementById('btn-close-modal');
    this.contentEl = document.getElementById('modal-content');

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', (e) => {
        if (e.target === this.overlayEl) this.close();
      });
    }

    store.subscribe('MODAL_CHANGED', (det) => {
      if (det) {
        this.open(det);
      } else {
        this.close();
      }
    });
  }

  open(det) {
    if (!this.overlayEl || !this.contentEl) return;

    this.contentEl.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 class="font-extrabold text-sm text-cyan-400 font-mono uppercase">${det.type} HAZARD REPORT (${det.id})</h3>
          <button id="modal-close-icon" class="text-slate-400 hover:text-white font-bold text-lg">✕</button>
        </div>
        <img src="${det.imageUrl}" class="w-full h-48 object-cover rounded-xl border border-slate-800" alt="Hazard Location" />
        <div class="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div><span class="text-slate-500 block">Severity:</span> <span class="font-bold text-red-400">${det.severity}</span></div>
          <div><span class="text-slate-500 block">Clearance / Distance:</span> <span class="font-bold text-cyan-400">${det.distance} cm</span></div>
          <div><span class="text-slate-500 block">Device ID:</span> <span class="text-slate-200">${det.deviceId}</span></div>
          <div><span class="text-slate-500 block">GPS Coordinates:</span> <span class="text-slate-200">[${det.latitude}, ${det.longitude}]</span></div>
          <div><span class="text-slate-500 block">Confidence Level:</span> <span class="text-emerald-400 font-bold">${det.confidence}%</span></div>
          <div><span class="text-slate-500 block">Timestamp:</span> <span class="text-slate-300">${new Date(det.timestamp).toLocaleString()}</span></div>
        </div>
      </div>
    `;

    document.getElementById('modal-close-icon')?.addEventListener('click', () => this.close());
    this.overlayEl.classList.add('active');
  }

  close() {
    if (this.overlayEl) {
      this.overlayEl.classList.remove('active');
    }
    store.state.selectedDetection = null;
  }
}

export const modalModule = new ModalModule();
