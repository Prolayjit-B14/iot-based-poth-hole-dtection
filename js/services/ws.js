/**
 * SmartRoad AI - WebSocket Live Telemetry Client
 * Manages WebSocket streams for real-time IoT hardware broadcasts.
 */
import { store } from '../store.js';

class WebSocketClient {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.reconnectInterval = 3000;
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('⚡ Connected to SmartRoad AI Live Telemetry Stream');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event) {
            this.handleEvent(data.event, data.payload);
          }
        } catch (e) {
          // Parse error
        }
      };

      this.ws.onclose = () => {
        console.log('⚡ Telemetry Stream disconnected. Retrying connection...');
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = () => {
        console.warn('WebSocket telemetry stream offline (using client simulation engine)');
      };
    } catch (e) {
      console.warn('WebSocket connection not available');
    }
  }

  handleEvent(event, payload) {
    if (event === 'NEW_DETECTION') {
      if (payload.detection) {
        store.addDetection(payload.detection, payload.alert?.message);
      }
    } else if (event === 'GPS_LOCATION_UPDATE') {
      store.moveGps(payload.deviceId);
    }
  }
}

export const wsClient = new WebSocketClient();
