import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { wsService } from './services/websocket.service';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize WebSocket Service
wsService.init(server);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SmartRoad AI Backend Running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server listening on ws://localhost:${PORT}/ws`);
  console.log(`=======================================================`);
});
