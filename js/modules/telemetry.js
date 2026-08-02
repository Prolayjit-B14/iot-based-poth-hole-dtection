/**
 * SmartRoad AI - Ultrasonic Telemetry Stream Module
 */
import { store } from '../store.js';

class TelemetryModule {
  init() {
    this.valueEl = document.getElementById('telemetry-distance-val');
    this.statusEl = document.getElementById('telemetry-status-text');

    store.subscribe('STATE_CHANGED', (data, state) => {
      this.update(state.ultrasonicDistance);
    });
  }

  update(dist) {
    if (this.valueEl) {
      this.valueEl.textContent = `${dist.toFixed(1)} cm`;
    }
    if (this.statusEl) {
      if (dist > 45) {
        this.statusEl.textContent = 'POTHOLE DETECTED (>45cm)';
        this.statusEl.className = 'text-red-400 font-bold';
      } else if (dist < 20) {
        this.statusEl.textContent = 'ROAD BUMP DETECTED (<20cm)';
        this.statusEl.className = 'text-amber-400 font-bold';
      } else {
        this.statusEl.textContent = 'Road Surface Baseline Normal';
        this.statusEl.className = 'text-emerald-400 font-bold';
      }
    }
  }
}

export const telemetryModule = new TelemetryModule();
