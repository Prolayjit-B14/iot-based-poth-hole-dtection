import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

export class WebSocketService {
  private wss: WebSocketServer | null = null;

  public init(server: HTTPServer) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('⚡ Client connected to SmartRoad AI WebSocket');

      // Send initial welcome message
      ws.send(JSON.stringify({
        type: 'CONNECTED',
        message: 'Real-time SmartRoad AI WebSocket active',
        timestamp: new Date().toISOString()
      }));

      ws.on('message', (data: string) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.type === 'PING') {
            ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
          }
        } catch (e) {
          // ignore invalid json
        }
      });

      ws.on('close', () => {
        console.log('⚡ Client disconnected from WebSocket');
      });
    });

    console.log('🚀 WebSocket server running on path /ws');
  }

  public broadcast(event: string, payload: any) {
    if (!this.wss) return;

    const message = JSON.stringify({
      event,
      payload,
      timestamp: new Date().toISOString()
    });

    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export const wsService = new WebSocketService();
