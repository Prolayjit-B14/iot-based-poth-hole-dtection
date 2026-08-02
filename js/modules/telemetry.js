/**
 * SmartRoad AI - Dual Ultrasonic Telemetry Stream Module
 */
import { store } from '../store.js';

class TelemetryModule {
  init() {
    this.value1El = document.getElementById('telemetry-sensor1-val');
    this.value2El = document.getElementById('telemetry-sensor2-val');
    this.statusEl = document.getElementById('telemetry-status-text');

    store.subscribe('STATE_CHANGED', (data, state) => {
      this.update(state.sensor1Distance || state.ultrasonicDistance, state.sensor2Distance || state.ultrasonicDistance);
    });
  }

  update(dist1, dist2) {
    if (this.value1El) {
      this.value1El.textContent = `${dist1.toFixed(1)} cm`;
    }
    if (this.value2El) {
      this.value2El.textContent = `${dist2.toFixed(1)} cm`;
    }

    const maxDist = Math.max(dist1, dist2);
    const minDist = Math.min(dist1, dist2);

    if (this.statusEl) {
      if (maxDist > 45) {
        this.statusEl.textContent = 'POTHOLE DETECTED (>45cm)';
        this.statusEl.className = 'text-red-400 font-bold';
      } else if (minDist < 20) {
        this.statusEl.textContent = 'ROAD BUMP DETECTED (<20cm)';
        this.statusEl.className = 'text-amber-400 font-bold';
      } else {
        this.statusEl.textContent = 'Dual Sensors Signal Normal';
        this.statusEl.className = 'text-emerald-400 font-bold';
      }
    }
  }
}

export const telemetryModule = new TelemetryModule();
