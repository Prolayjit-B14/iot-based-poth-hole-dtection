/**
 * SmartRoad AI - Main Application Bootstrapper & Orchestrator
 */
import { store } from './store.js';
import { router } from './router.js';
import { wsClient } from './services/ws.js';
import { mqttService } from './services/mqtt.js';

import { mapModule } from './modules/map.js';
import { telemetryModule } from './modules/telemetry.js';
import { cameraModule } from './modules/camera.js';
import { tableModule } from './modules/table.js';
import { modalModule } from './modules/modal.js';
import { alertsModule } from './modules/alerts.js';
import { devicesModule } from './modules/devices.js';
import { simulationModule } from './modules/simulation.js';

class App {
  init() {
    console.log('🚀 Initializing SmartRoad AI Clean Mobile-Responsive App');

    // 1. Initialize View Router
    router.init();

    // 2. Initialize Mobile Navigation Drawer Handlers
    this.initMobileNav();

    // 3. Initialize UI Modules
    telemetryModule.init();
    cameraModule.init();
    tableModule.init();
    modalModule.init();
    alertsModule.init();
    devicesModule.init();
    simulationModule.init();
    mapModule.init();

    // 4. Handle View Change Triggers (e.g. Map Size Fixes & Mobile Drawer Closing)
    router.onViewChange((viewId) => {
      this.closeMobileNav();
      if (viewId === 'map' || viewId === 'dashboard') {
        setTimeout(() => mapModule.invalidateSize(), 200);
      }
    });

    // 5. Connect WebSocket & MQTT Clients
    wsClient.connect();
    mqttService.connect();

    // 6. Start Header Clock Timer
    this.startHeaderClock();

    // 7. Subscribe to State Changes for KPI Metric Counters
    store.subscribe('STATE_CHANGED', () => this.updateKPIs());
    store.subscribe('DETECTIONS_UPDATED', () => this.updateKPIs());
    store.subscribe('DEVICES_UPDATED', () => this.updateKPIs());
    this.updateKPIs();

    // 8. Render Lucide Icons
    this.refreshIcons();
  }

  initMobileNav() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const openBtn = document.getElementById('btn-toggle-sidebar');
    const closeBtn = document.getElementById('btn-close-sidebar');

    if (openBtn && sidebar && backdrop) {
      openBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        backdrop.classList.add('active');
      });
    }

    if (closeBtn && sidebar && backdrop) {
      closeBtn.addEventListener('click', () => this.closeMobileNav());
    }

    if (backdrop && sidebar) {
      backdrop.addEventListener('click', () => this.closeMobileNav());
    }
  }

  closeMobileNav() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  }

  startHeaderClock() {
    const clockEl = document.getElementById('header-clock');
    const dateEl = document.getElementById('header-date');

    const updateClock = () => {
      const now = new Date();
      if (clockEl) clockEl.textContent = now.toLocaleTimeString();
      if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  updateKPIs() {
    const stats = store.getStats();

    const potholesEl = document.getElementById('kpi-potholes');
    const bumpsEl = document.getElementById('kpi-bumps');
    const todaysEl = document.getElementById('kpi-todays');
    const criticalEl = document.getElementById('kpi-critical');
    const devicesEl = document.getElementById('kpi-devices');
    const statusEl = document.getElementById('kpi-status');

    if (potholesEl) potholesEl.textContent = stats.totalPotholes;
    if (bumpsEl) bumpsEl.textContent = stats.totalBumps;
    if (todaysEl) todaysEl.textContent = stats.todayDetections;
    if (criticalEl) criticalEl.textContent = stats.criticalDetections;
    if (devicesEl) devicesEl.textContent = stats.activeDevices;
    if (statusEl) statusEl.textContent = stats.systemStatus;

    this.refreshIcons();
  }

  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
