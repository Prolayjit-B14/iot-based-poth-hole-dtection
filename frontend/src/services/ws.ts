type EventListener = (data: any) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<EventListener>> = new Map();
  private reconnectInterval = 3000;

  public connect() {
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
            const handlers = this.listeners.get(data.event);
            if (handlers) {
              handlers.forEach(fn => fn(data.payload));
            }
          }
        } catch (e) {
          // ignore
        }
      };

      this.ws.onclose = () => {
        console.log('⚡ Telemetry Stream disconnected. Reconnecting in 3s...');
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = (err) => {
        console.warn('WebSocket connection error', err);
      };
    } catch (e) {
      console.warn('Failed to establish WebSocket connection');
    }
  }

  public subscribe(event: string, callback: EventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }
}

export const wsClient = new WebSocketClient();
