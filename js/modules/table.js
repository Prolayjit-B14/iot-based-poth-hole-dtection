/**
 * SmartRoad AI - Detection Activity Log Table Module
 */
import { store } from '../store.js';

class TableModule {
  init() {
    this.tableDashEl = document.getElementById('table-body-dash');
    this.tableHistoryEl = document.getElementById('table-body-history');
    this.exportBtns = document.querySelectorAll('[data-action="export-csv"]');

    this.exportBtns.forEach(btn => {
      btn.addEventListener('click', () => store.exportCSV());
    });

    store.subscribe('DETECTIONS_UPDATED', () => this.render());
    store.subscribe('STATE_CHANGED', () => this.render());
    this.render();
  }

  render() {
    const { detections } = store.getState();

    const emptyRow = `
      <tr>
        <td colspan="6" class="py-8 text-center text-slate-500 font-mono">
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            <p class="text-xs">No hazard detections logged yet.</p>
            <p class="text-[10px] text-slate-600 mt-1">Use the Hardware Simulation Engine or connect real ESP32 hardware.</p>
          </div>
        </td>
      </tr>
    `;

    const generateRows = (dets) => {
      if (dets.length === 0) return emptyRow;
      return dets.map(det => `
        <tr class="hover:bg-slate-800/40 cursor-pointer" data-det-id="${det.id}">
          <td class="py-2.5 px-3">
            <span class="badge ${det.type === 'POTHOLE' ? 'badge-critical' : 'badge-warning'}">
              ${det.type}
            </span>
          </td>
          <td class="py-2.5 px-3 font-bold ${det.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}">${det.severity}</td>
          <td class="py-2.5 px-3 text-cyan-400 font-bold font-mono">${det.distance} cm</td>
          <td class="py-2.5 px-3 text-slate-300 font-mono">${det.deviceId}</td>
          <td class="py-2.5 px-3 text-slate-400 font-mono">[${det.latitude}, ${det.longitude}]</td>
          <td class="py-2.5 px-3 text-slate-400 font-mono">${new Date(det.timestamp).toLocaleTimeString()}</td>
        </tr>
      `).join('');
    };

    if (this.tableDashEl) {
      this.tableDashEl.innerHTML = generateRows(detections.slice(0, 5));
      this.bindRowClick(this.tableDashEl);
    }

    if (this.tableHistoryEl) {
      this.tableHistoryEl.innerHTML = generateRows(detections);
      this.bindRowClick(this.tableHistoryEl);
    }
  }

  bindRowClick(containerEl) {
    containerEl.querySelectorAll('tr[data-det-id]').forEach(row => {
      row.addEventListener('click', () => {
        const detId = row.getAttribute('data-det-id');
        const det = store.getState().detections.find(d => d.id === detId);
        if (det) {
          store.setSelectedDetection(det);
        }
      });
    });
  }
}

export const tableModule = new TableModule();
