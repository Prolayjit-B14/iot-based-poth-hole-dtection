# SmartRoad AI - IoT-Based Pothole & Road Bump Detection Web System

[![System Status](https://img.shields.io/badge/System-ONLINE-10B981?style=for-the-badge)](https://github.com/Prolayjit-B14/iot-based-poth-hole-dtection)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla_HTML%2FCSS%2FJS-06B6D4?style=for-the-badge)]()
[![Hardware](https://img.shields.io/badge/Hardware-ESP32_--_HC--SR04_--_OV2640-F59E0B?style=for-the-badge)]()

**SmartRoad AI** is an ultra-fast, zero-dependency Vanilla HTML/CSS/JavaScript web dashboard designed for real-time monitoring of road anomalies (potholes and road bumps) collected by mobile IoT sensing hardware.

---

## 🌟 Architecture & Key Features

- **⚡ Zero Build Step**: Pure ES6 modules running directly in any modern browser without needing Vite, React, npm, or bundlers.
- **🛰️ Live Telemetry Stream**: Real-time ultrasonic road clearance measurement (Potholes $> 45\text{ cm}$, Road Bumps $< 20\text{ cm}$).
- **🗺️ Interactive Leaflet GIS Map**: Custom dark-themed Leaflet.js map with live vehicle position tracking and hazard location markers.
- **📷 ESP32-CAM Vision Feed**: Live camera feed display and manual hazard snapshot gallery.
- **🎮 Hardware Simulation Engine**: Built-in live hardware simulation engine to trigger simulated potholes, road bumps, and GPS location movements.
- **📊 Activity Log Audit Table & CSV Export**: Dynamic hazard activity table with inspection modal dialogs and browser CSV downloads.
- **🔔 Real-Time Notification Center**: Header alert dropdown popover with mark-read management.
- **🗄️ PostgreSQL Database Schema**: Authoritative SQL schema provided in `database/schema.sql`.

---

## 📁 Minimal Folder Structure

```
randy-handeling/
├── index.html                  # Core single-page application layout & view templates
├── README.md                   # System documentation & setup guide
├── .env.example                # Environment reference parameters
├── database/
│   └── schema.sql              # Supabase / PostgreSQL database schema definitions
├── css/
│   └── style.css               # Design system: dark mode palette, glassmorphism, glowing shadows
└── js/
    ├── app.js                  # Main application orchestrator & DOM initialization
    ├── store.js                # Centralized reactive state management & event emitter
    ├── router.js               # Tab & view navigation controller
    ├── services/
    │   ├── api.js              # REST API client (with offline fallback store)
    │   └── ws.js               # WebSocket client for telemetry push stream
    └── modules/
        ├── map.js              # Leaflet GIS map controller & pin renderer
        ├── telemetry.js        # Ultrasonic stream visualization controller
        ├── camera.js           # ESP32-CAM stream & snapshot gallery manager
        ├── table.js            # Hazard log table & CSV exporter
        ├── modal.js            # Detection inspect modal dialog controller
        ├── alerts.js           # Header alert notifications popover controller
        ├── devices.js          # ESP32 hardware inventory grid controller
        └── simulation.js       # Live simulation engine button handlers
```

---

## 🚀 How to Run Locally

Because the project is built with Vanilla HTML, CSS, and ES6 JavaScript modules:

1. **Option A (Direct File Launch)**:
   Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari).

2. **Option B (Static Local Server)**:
   Run any static web server in the project directory:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or using VS Code Live Server extension
   ```
   Open `http://localhost:8000` in your browser.

---

## 📡 Hardware Specs & ESP32 Configuration

- **Controller**: ESP32 Dev Module
- **Distance Sensor**: HC-SR04 Ultrasonic Sensor (Trig Pin 5, Echo Pin 18)
- **Camera Module**: OV2640 Camera
- **GPS Receiver**: NEO-6M GPS Module (TX Pin 16, RX Pin 17)
- **Buzzer**: 5V Active Buzzer (Pin 19)

### Ultrasonic Threshold Formula:
$$\text{Baseline Road Surface} = 32.4\text{ cm}$$
$$\text{Pothole Depth} = \text{Ultrasonic Distance} - \text{Baseline} > 45\text{ cm}$$
$$\text{Bump Elevation} = \text{Baseline} - \text{Ultrasonic Distance} < 20\text{ cm}$$

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

Import `database/schema.sql` into your PostgreSQL database or Supabase SQL Editor to create tables for `devices`, `detections`, `alerts`, `users`, and `images`.

