/**
 * SmartRoad AI - Header Alerts Dropdown & Notifications Module
 */
import { store } from '../store.js';

class AlertsModule {
  init() {
    this.badgeEl = document.getElementById('alert-count-badge');
    this.popoverEl = document.getElementById('alert-popover');
    this.toggleBtn = document.getElementById('btn-toggle-alerts');
    this.listEl = document.getElementById('alert-list-container');
    this.markAllBtn = document.getElementById('btn-mark-all-read');

    if (this.toggleBtn && this.popoverEl) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.popoverEl.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!this.popoverEl.contains(e.target) && !this.toggleBtn.contains(e.target)) {
          this.popoverEl.classList.add('hidden');
        }
      });
    }

    if (this.markAllBtn) {
      this.markAllBtn.addEventListener('click', () => {
        store.markAllAlertsRead();
      });
    }

    store.subscribe('ALERTS_UPDATED', () => this.render());
    store.subscribe('STATE_CHANGED', () => this.render());
    this.render();
  }

  render() {
    const { alerts } = store.getState();
    const unreadCount = alerts.filter(a => !a.isRead).length;

    if (this.badgeEl) {
      if (unreadCount > 0) {
        this.badgeEl.textContent = unreadCount;
        this.badgeEl.classList.remove('hidden');
      } else {
        this.badgeEl.classList.add('hidden');
      }
    }

    if (this.listEl) {
      if (alerts.length === 0) {
        this.listEl.innerHTML = `<p class="text-xs text-slate-500 p-4 text-center">No alerts logged</p>`;
        return;
      }

      this.listEl.innerHTML = alerts.map(alert => `
        <div class="p-3 border-b border-slate-800 flex justify-between items-start ${alert.isRead ? 'opacity-60' : 'bg-slate-900/60'}">
          <div class="space-y-1">
            <span class="badge ${alert.type === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}">${alert.type}</span>
            <p class="text-xs text-slate-200">${alert.message}</p>
            <span class="text-[10px] text-slate-400 font-mono">${new Date(alert.createdAt).toLocaleTimeString()}</span>
          </div>
          ${!alert.isRead ? `<button data-read-id="${alert.id}" class="text-[10px] text-cyan-400 font-mono hover:underline ml-2">Mark Read</button>` : ''}
        </div>
      `).join('');

      this.listEl.querySelectorAll('[data-read-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          const alertId = btn.getAttribute('data-read-id');
          store.markAlertRead(alertId);
        });
      });
    }
  }
}

export const alertsModule = new AlertsModule();
