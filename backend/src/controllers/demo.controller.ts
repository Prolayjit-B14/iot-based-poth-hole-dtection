import { Request, Response } from 'express';
import { dataStore } from '../services/data.store';
import { wsService } from '../services/websocket.service';

export class DemoController {
  // POST /api/demo/simulate-pothole
  public simulatePothole(req: Request, res: Response) {
    try {
      // Random coordinates around Siliguri / Bengal road network
      const baseLat = 26.7271 + (Math.random() - 0.5) * 0.02;
      const baseLng = 88.3953 + (Math.random() - 0.5) * 0.02;
      const distance = Number((48 + Math.random() * 25).toFixed(1)); // 48cm - 73cm depth

      const potholeImages = [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80'
      ];

      const { detection, alert } = dataStore.addDetection({
        deviceId: 'ESP32-ROAD-001',
        type: 'POTHOLE',
        severity: distance > 60 ? 'CRITICAL' : 'HIGH',
        confidence: Math.floor(Math.random() * 8) + 92,
        distance,
        latitude: Number(baseLat.toFixed(5)),
        longitude: Number(baseLng.toFixed(5)),
        imageUrl: potholeImages[Math.floor(Math.random() * potholeImages.length)],
        timestamp: new Date().toISOString(),
        status: 'ACTIVE'
      });

      wsService.broadcast('NEW_DETECTION', { detection, alert });

      return res.status(200).json({
        success: true,
        message: 'Simulated Pothole Detection Triggered',
        data: detection,
        alert
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/demo/simulate-bump
  public simulateBump(req: Request, res: Response) {
    try {
      const baseLat = 26.7271 + (Math.random() - 0.5) * 0.02;
      const baseLng = 88.3953 + (Math.random() - 0.5) * 0.02;
      const distance = Number((10 + Math.random() * 12).toFixed(1)); // 10cm - 22cm bump height elevation

      const bumpImages = [
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80'
      ];

      const { detection, alert } = dataStore.addDetection({
        deviceId: 'ESP32-ROAD-001',
        type: 'ROAD_BUMP',
        severity: distance < 14 ? 'HIGH' : 'MEDIUM',
        confidence: Math.floor(Math.random() * 10) + 88,
        distance,
        latitude: Number(baseLat.toFixed(5)),
        longitude: Number(baseLng.toFixed(5)),
        imageUrl: bumpImages[Math.floor(Math.random() * bumpImages.length)],
        timestamp: new Date().toISOString(),
        status: 'ACTIVE'
      });

      wsService.broadcast('NEW_DETECTION', { detection, alert });

      return res.status(200).json({
        success: true,
        message: 'Simulated Road Bump Triggered',
        data: detection,
        alert
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/demo/move-gps
  public moveGps(req: Request, res: Response) {
    try {
      let dev = dataStore.getDeviceById('ESP32-ROAD-001');
      if (dev) {
        const deltaLat = (Math.random() - 0.48) * 0.003;
        const deltaLng = (Math.random() - 0.48) * 0.003;
        const newLat = Number((dev.latitude + deltaLat).toFixed(5));
        const newLng = Number((dev.longitude + deltaLng).toFixed(5));

        dev = dataStore.registerOrUpdateDevice({
          deviceId: dev.deviceId,
          latitude: newLat,
          longitude: newLng,
          status: 'ONLINE'
        });

        wsService.broadcast('GPS_LOCATION_UPDATE', { deviceId: dev.deviceId, latitude: dev.latitude, longitude: dev.longitude });
      }
      return res.status(200).json({ success: true, message: 'GPS Movement Simulated', device: dev });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
