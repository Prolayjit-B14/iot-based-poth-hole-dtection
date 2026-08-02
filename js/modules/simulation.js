/**
 * SmartRoad AI - Hardware Simulation Engine Module
 */
import { store, SAMPLE_IMAGES } from '../store.js';

class SimulationModule {
  init() {
    this.demoToggleBtn = document.getElementById('btn-toggle-demo');
    this.demoIndicator = document.getElementById('demo-status-indicator');
    this.demoBarContainer = document.getElementById('demo-simulation-bar');

    this.simPotholeBtn = document.getElementById('btn-sim-pothole');
    this.simBumpBtn = document.getElementById('btn-sim-bump');
    this.simGpsBtn = document.getElementById('btn-sim-gps');
    this.lastActionEl = document.getElementById('simulation-last-action');

    if (this.demoToggleBtn) {
      this.demoToggleBtn.addEventListener('click', () => {
        store.toggleDemoMode();
      });
    }

    if (this.simPotholeBtn) {
      this.simPotholeBtn.addEventListener('click', () => this.simulatePothole());
    }

    if (this.simBumpBtn) {
      this.simBumpBtn.addEventListener('click', () => this.simulateBump());
    }

    if (this.simGpsBtn) {
      this.simGpsBtn.addEventListener('click', () => this.simulateGpsMovement());
    }

    store.subscribe('STATE_CHANGED', (data, state) => {
      this.render(state);
    });
    this.render(store.getState());
  }

  simulatePothole() {
    const baseLat = 26.7271 + (Math.random() - 0.5) * 0.02;
    const baseLng = 88.3953 + (Math.random() - 0.5) * 0.02;
    const distance = Number((48 + Math.random() * 25).toFixed(1));

    const newDet = {
      id: `det-${Date.now()}`,
      deviceId: 'ESP32-ROAD-001',
      type: 'POTHOLE',
      severity: distance > 60 ? 'CRITICAL' : 'HIGH',
      confidence: Math.floor(Math.random() * 8) + 92,
      distance,
      latitude: Number(baseLat.toFixed(5)),
      longitude: Number(baseLng.toFixed(5)),
      imageUrl: SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
      timestamp: new Date().toISOString(),
      status: 'ACTIVE'
    };

    store.state.ultrasonicDistance = distance;
    store.addDetection(newDet, `Simulated Pothole (${distance}cm depth) detected near Hill Cart Road`);
  }

  simulateBump() {
    const baseLat = 26.7271 + (Math.random() - 0.5) * 0.02;
    const baseLng = 88.3953 + (Math.random() - 0.5) * 0.02;
    const distance = Number((10 + Math.random() * 12).toFixed(1));

    const newDet = {
      id: `det-${Date.now()}`,
      deviceId: 'ESP32-ROAD-001',
      type: 'ROAD_BUMP',
      severity: distance < 14 ? 'HIGH' : 'MEDIUM',
      confidence: Math.floor(Math.random() * 10) + 88,
      distance,
      latitude: Number(baseLat.toFixed(5)),
      longitude: Number(baseLng.toFixed(5)),
      imageUrl: SAMPLE_IMAGES[3],
      timestamp: new Date().toISOString(),
      status: 'ACTIVE'
    };

    store.state.ultrasonicDistance = distance;
    store.addDetection(newDet, `Simulated Road Bump (${distance}cm clearance) detected`);
  }

  simulateGpsMovement() {
    store.moveGps('ESP32-ROAD-001');
  }

  render(state) {
    if (this.demoBarContainer) {
      this.demoBarContainer.style.display = state.demoMode ? 'flex' : 'none';
    }

    if (this.demoIndicator) {
      if (state.demoMode) {
        this.demoIndicator.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 status-dot-pulse';
      } else {
        this.demoIndicator.className = 'w-2.5 h-2.5 rounded-full bg-slate-500';
      }
    }

    if (this.lastActionEl && state.lastAction) {
      this.lastActionEl.textContent = state.lastAction;
      this.lastActionEl.style.display = 'inline-block';
    }
  }
}

export const simulationModule = new SimulationModule();
