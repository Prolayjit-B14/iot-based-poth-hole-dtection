-- ============================================================
-- SmartRoad AI – IoT-Based Pothole & Road Bump Detection System
-- Supabase / PostgreSQL Database Schema
-- ============================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'OPERATOR' CHECK (role IN ('ADMIN', 'OPERATOR', 'VIEWER')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEVICES TABLE
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'MAINTENANCE')),
    latitude DOUBLE PRECISION DEFAULT 26.7271,
    longitude DOUBLE PRECISION DEFAULT 88.3953,
    battery_level INT DEFAULT 95 CHECK (battery_level BETWEEN 0 AND 100),
    wifi_signal INT DEFAULT 85 CHECK (wifi_signal BETWEEN 0 AND 100),
    gps_status VARCHAR(50) DEFAULT 'CONNECTED',
    camera_status VARCHAR(50) DEFAULT 'CONNECTED',
    gsm_status VARCHAR(50) DEFAULT 'CONNECTED',
    ultrasonic_status VARCHAR(50) DEFAULT 'CONNECTED',
    buzzer_status VARCHAR(50) DEFAULT 'INACTIVE',
    firmware_version VARCHAR(50) DEFAULT 'v2.4.1',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DETECTIONS TABLE
CREATE TABLE IF NOT EXISTS detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    detection_type VARCHAR(50) NOT NULL CHECK (detection_type IN ('POTHOLE', 'ROAD_BUMP', 'NORMAL')),
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    confidence INT DEFAULT 90 CHECK (confidence BETWEEN 0 AND 100),
    ultrasonic_distance DOUBLE PRECISION NOT NULL, -- Distance in cm
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    image_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVIEWED', 'REPAIRED', 'DISMISSED'))
);

-- 4. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    detection_id UUID REFERENCES detections(id) ON DELETE SET NULL,
    device_id VARCHAR(100) REFERENCES devices(device_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CRITICAL', 'WARNING', 'INFO', 'SYSTEM')),
    message TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. IMAGES TABLE
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    device_id VARCHAR(100) REFERENCES devices(device_id) ON DELETE CASCADE,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_detections_device_id ON detections(device_id);
CREATE INDEX IF NOT EXISTS idx_detections_timestamp ON detections(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_detections_type ON detections(detection_type);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);

-- SEED DATA FOR INITIAL SETUP
INSERT INTO devices (device_id, name, status, latitude, longitude, battery_level, wifi_signal, firmware_version)
VALUES 
('ESP32-ROAD-001', 'Bicycle Patrol Unit Alpha', 'ONLINE', 26.7271, 88.3953, 94, 88, 'v2.4.1'),
('ESP32-ROAD-002', 'Motorcycle Monitor Beta', 'ONLINE', 26.7310, 88.3990, 78, 92, 'v2.4.1'),
('ESP32-ROAD-003', 'Highway Patrol Unit Gamma', 'OFFLINE', 26.7190, 88.3880, 15, 0, 'v2.3.0')
ON CONFLICT (device_id) DO NOTHING;
