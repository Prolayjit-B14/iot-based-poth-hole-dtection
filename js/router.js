/**
 * SmartRoad AI - SPA View Router
 * Handles seamless view switching and active navigation states.
 */

class Router {
  constructor() {
    this.currentView = 'dashboard';
    this.viewChangeListeners = new Set();
  }

  init() {
    // Listen to click events on navigation links
    document.querySelectorAll('[data-view-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = el.getAttribute('data-view-target');
        this.navigateTo(targetView);
      });
    });

    // Handle hash location change if available
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        this.navigateTo(hash);
      }
    });

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
      this.navigateTo(initialHash);
    } else {
      this.navigateTo('dashboard');
    }
  }

  navigateTo(viewId) {
    const validViews = ['dashboard', 'live', 'camera', 'map', 'history', 'devices', 'alerts', 'analytics', 'reports', 'settings', 'profile'];
    if (!validViews.includes(viewId)) {
      viewId = 'dashboard';
    }

    this.currentView = viewId;
    window.location.hash = viewId;

    // Toggle active class on view sections
    document.querySelectorAll('.view-section').forEach(section => {
      if (section.id === `view-${viewId}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Toggle active styling on navigation buttons
    document.querySelectorAll('[data-view-target]').forEach(link => {
      if (link.getAttribute('data-view-target') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Notify listeners (e.g., map resize trigger)
    this.viewChangeListeners.forEach(fn => fn(viewId));
  }

  onViewChange(callback) {
    this.viewChangeListeners.add(callback);
  }
}

export const router = new Router();
