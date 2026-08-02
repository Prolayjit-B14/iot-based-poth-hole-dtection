/**
 * SmartRoad AI - Enterprise Analytics & Chart.js Visualizer Module
 */
import { store } from '../store.js';

class AnalyticsModule {
  constructor() {
    this.trendChart = null;
    this.doughnutChart = null;
    this.telemetryChart = null;
    this.dashTelemetryChart = null;
  }

  init() {
    setTimeout(() => {
      this.initAnalyticsCharts();
      this.initTelemetryChart();
      this.initDashboardTelemetryChart();
    }, 300);

    store.subscribe('DETECTIONS_UPDATED', () => this.updateCharts());
    store.subscribe('STATE_CHANGED', () => this.updateCharts());
  }

  initAnalyticsCharts() {
    const trendEl = document.getElementById('analytics-trend-chart');
    const doughnutEl = document.getElementById('analytics-doughnut-chart');

    if (window.Chart && trendEl && !this.trendChart) {
      this.trendChart = new Chart(trendEl, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Potholes Detected',
              data: [12, 19, 8, 15, 22, 14, 9],
              borderColor: '#DC2626',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Road Bumps Detected',
              data: [7, 11, 5, 12, 9, 6, 8],
              borderColor: '#F59E0B',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#CBD5E1' } } },
          scales: {
            x: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' } },
            y: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' } }
          }
        }
      });
    }

    if (window.Chart && doughnutEl && !this.doughnutChart) {
      this.doughnutChart = new Chart(doughnutEl, {
        type: 'doughnut',
        data: {
          labels: ['Potholes', 'Road Bumps', 'Normal Surface'],
          datasets: [{
            data: [45, 25, 30],
            backgroundColor: ['#DC2626', '#F59E0B', '#16A34A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#CBD5E1' } } }
        }
      });
    }
  }

  initTelemetryChart() {
    const el = document.getElementById('telemetry-chart');
    if (window.Chart && el && !this.telemetryChart) {
      this.telemetryChart = new Chart(el, {
        type: 'line',
        data: {
          labels: Array.from({ length: 20 }, (_, i) => `${i + 1}s`),
          datasets: [
            {
              label: 'Sensor 1 (Left Track)',
              data: Array(20).fill(32.4),
              borderColor: '#2563EB',
              tension: 0.3
            },
            {
              label: 'Sensor 2 (Right Track)',
              data: Array(20).fill(32.4),
              borderColor: '#10B981',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#CBD5E1' } } },
          scales: {
            x: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' } },
            y: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' }, min: 10, max: 80 }
          }
        }
      });
    }
  }

  initDashboardTelemetryChart() {
    const el = document.getElementById('dashboard-telemetry-chart');
    if (window.Chart && el && !this.dashTelemetryChart) {
      const times = ['13:26', '13:27', '13:28', '13:29', '13:30', '13:31'];
      this.dashTelemetryChart = new Chart(el, {
        type: 'line',
        data: {
          labels: times,
          datasets: [
            {
              label: 'Sensor 1',
              data: [31.2, 33.5, 30.8, 34.1, 31.9, 32.4],
              borderColor: '#2563EB',
              backgroundColor: '#2563EB',
              pointRadius: 3,
              tension: 0.35
            },
            {
              label: 'Sensor 2',
              data: [46.1, 48.2, 45.9, 47.3, 46.8, 45.4],
              borderColor: '#10B981',
              backgroundColor: '#10B981',
              pointRadius: 3,
              tension: 0.35
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', align: 'end', labels: { color: '#CBD5E1', boxWidth: 12 } } },
          scales: {
            x: { ticks: { color: '#94A3B8', font: { size: 10 } }, grid: { color: 'rgba(51, 65, 85, 0.4)' } },
            y: { ticks: { color: '#94A3B8', font: { size: 10 } }, grid: { color: 'rgba(51, 65, 85, 0.4)' }, min: 0, max: 100 }
          }
        }
      });
    }
  }

  updateCharts() {
    const stats = store.getStats();

    if (this.doughnutChart) {
      this.doughnutChart.data.datasets[0].data = [
        stats.totalPotholes || 1,
        stats.totalBumps || 1,
        10
      ];
      this.doughnutChart.update();
    }
  }
}

export const analyticsModule = new AnalyticsModule();
