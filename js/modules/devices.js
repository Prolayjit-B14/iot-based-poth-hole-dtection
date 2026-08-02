/**
 * SmartRoad AI - ESP32 Hardware Devices Inventory Module
 */
import { store } from '../store.js';

class DevicesModule {
  init() {
    this.gridEl = document.getElementById('devices-grid');

    store.subscribe('DEVICES_UPDATED', () => this.render());
    store.subscribe('STATE_CHANGED', () => this.render());
    this.render();
  }

  render() {
    if (!this.gridEl) return;
    const { devices } = store.getState();

    if (devices.length === 0) {
      this.gridEl.innerHTML = `
        <div class="col-span-full glass-card p-8 text-center text-slate-500 font-mono space-y-2">
          <p class="text-xs">No active ESP32 units registered.</p>
          <p class="text-[10px] text-slate-600">Click "Simulate Pothole" or "Move GPS" in the simulation bar to connect a unit.</p>
        </div>
      `;
      return;
    }

    this.gridEl.innerHTML = devices.map(dev => `
      <div class="glass-card p-5 space-y-3 border border-slate-800">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-100 text-sm flex items-center gap-2">
            <span>${dev.name}</span>
          </h3>
          <span class="badge ${dev.status === 'ONLINE' ? 'badge-online' : 'badge-offline'}">${dev.status}</span>
        </div>
        <p class="text-xs text-cyan-400 font-mono">${dev.deviceId}</p>

        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div>Battery: <b class="${dev.batteryLevel < 20 ? 'text-red-400' : 'text-emerald-400'}">${dev.batteryLevel}%</b></div>
          <div>WiFi Signal: <b class="text-cyan-400">${dev.wifiSignal}%</b></div>
          <div>GPS: <b class="${dev.gpsStatus === 'CONNECTED' ? 'text-emerald-400' : 'text-slate-500'}">${dev.gpsStatus}</b></div>
          <div>Camera: <b class="${dev.cameraStatus === 'CONNECTED' ? 'text-emerald-400' : 'text-slate-500'}">${dev.cameraStatus}</b></div>
          <div>GSM Modem: <b class="text-slate-300">${dev.gsmStatus}</b></div>
          <div>Ultrasonic: <b class="text-slate-300">${dev.ultrasonicStatus}</b></div>
        </div>

        <div class="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
          <span>Firmware: ${dev.firmwareVersion}</span>
          <span>Seen: ${new Date(dev.lastSeen).toLocaleTimeString()}</span>
        </div>
      </div>
    `).join('');
  }
}

export const devicesModule = new DevicesModule();
