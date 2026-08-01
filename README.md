# 🛣️ SmartRoad AI – IoT-Based Pothole & Road Bump Detection System

A complete full-stack web application for real-time road hazard detection, GPS mapping, live ESP32-CAM monitoring, analytics, and IoT telemetry broadcasting.

---

## 📐 System Architecture

```
+-------------------------------------------------------------+
|               ESP32 / IoT Hardware (Physical)              |
|  Ultrasonic Sensor + ESP32-CAM + GPS Module + GSM + Buzzer  |
+------------------------------+------------------------------+
                               | (HTTP REST / JSON Payload)
                               v
+-------------------------------------------------------------+
|                  Node.js / Express Backend                  |
|  - REST API Routes (/api/detections, /api/devices, etc.)   |
|  - WebSocket Broadcasting Server (/ws)                      |
|  - Mock / In-Memory Data Store + Supabase PG Client Layer    |
|  - Live Demo Simulation Engine (Potholes, Bumps, GPS Route) |
+------------------------------+------------------------------+
                               | (REST API & WebSockets)
                               v
+-------------------------------------------------------------+
|                React / TypeScript Frontend                  |
|  - Modern Dark Futuristic Glassmorphism UI (Tailwind CSS)   |
|  - Leaflet + OpenStreetMap Live GPS Pothole Map             |
|  - Recharts Analytics Dashboard & Real-Time Sensor Telemetry|
|  - ESP32-CAM Stream Viewer & Snapshot Gallery               |
|  - 14 Full Pages (Landing, Dashboard, Live Telemetry, etc.) |
+-------------------------------------------------------------+
```

---

## ⚡ Quick Start & Installation

### 1. Install Dependencies
Run the command below from the project root directory:

```bash
# Install root, backend, and frontend packages
npm run install:all
```

Or manually in subdirectories:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 🚀 Running Locally

### Start Backend Server (Node.js + Express + WebSockets)
```bash
cd backend
npm run dev
```
The backend server runs at: `http://localhost:5000` (WebSocket at `ws://localhost:5000/ws`).

### Start Frontend Application (React + Vite)
In a separate terminal window:
```bash
cd frontend
npm run dev
```
The application opens at: `http://localhost:3000`.

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Open your Supabase project SQL Editor or local PostgreSQL database.
2. Execute the schema file located at: `database/schema.sql`.
3. Set your environment variables in `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. The system automatically works out of the box with the included mock engine if Supabase environment variables are omitted during initial local testing!

---

## 🔌 ESP32 API Integration Guide & Specification

### API Endpoint for ESP32 Data Transmission
- **URL:** `POST http://<YOUR_SERVER_IP>:5000/api/detections`
- **Headers:** `Content-Type: application/json`

### Example JSON Payload Sent by ESP32:
```json
{
  "deviceId": "ESP32-ROAD-001",
  "type": "pothole",
  "severity": "high",
  "confidence": 94,
  "distance": 48.2,
  "latitude": 26.7271,
  "longitude": 88.3953,
  "timestamp": "2026-08-01T12:30:00Z",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Example cURL Command to Test Endpoint:
```bash
curl -X POST http://localhost:5000/api/detections \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "ESP32-ROAD-001",
    "type": "pothole",
    "severity": "high",
    "confidence": 95,
    "distance": 52.4,
    "latitude": 26.7271,
    "longitude": 88.3953,
    "imageUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  }'
```

### ESP32 Periodic Heartbeat Endpoint
- **URL:** `POST http://<YOUR_SERVER_IP>:5000/api/device/heartbeat`
```json
{
  "deviceId": "ESP32-ROAD-001",
  "status": "ONLINE",
  "batteryLevel": 92,
  "wifiSignal": 85,
  "latitude": 26.7271,
  "longitude": 88.3953
}
```

---

## 📡 Where to Connect Physical ESP32 Microcontroller Code Later

When flashing code to your physical ESP32 Arduino/ESP-IDF project:
1. Configure `WiFi.begin("YOUR_SSID", "YOUR_PASSWORD")`.
2. Use `HTTPClient` to send `POST` requests to `http://<SERVER_IP>:5000/api/detections` whenever the ultrasonic sensor reads distance deviations (&gt;45cm for pothole or &lt;20cm for bump).
3. If using ESP32-CAM, host the MJPEG stream server on port `81` and configure `CAMERA_STREAM_URL` on the website settings page to `http://<ESP32_CAM_IP>:81/stream`.

---

## 🕹️ Interactive Demo Simulation Mode

If physical ESP32 hardware is not connected, use the **Live Demo Simulation Bar** at the top of the dashboard:
- Click **"Simulate Pothole Detection"** to trigger a real-time simulated pothole event.
- Click **"Simulate Road Bump"** to log an elevation change.
- Click **"Simulate Moving GPS"** to move the IoT device marker live on the interactive Leaflet map.

All views, KPI counters, audio/visual badges, alerts, map markers, and charts update instantly via WebSockets!
