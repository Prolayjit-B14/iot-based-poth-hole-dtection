import { Request, Response } from 'express';
import { dataStore } from '../services/data.store';
import { wsService } from '../services/websocket.service';

export class DetectionsController {
  // GET /api/detections
  public getDetections(req: Request, res: Response) {
    try {
      const type = req.query.type as string;
      const severity = req.query.severity as string;
      const deviceId = req.query.deviceId as string;

      const detections = dataStore.getDetections({ type, severity, deviceId });
      return res.status(200).json({
        success: true,
        count: detections.length,
        data: detections
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/detections/:id
  public getDetectionById(req: Request, res: Response) {
    try {
      const detection = dataStore.getDetectionById(req.params.id);
      if (!detection) {
        return res.status(404).json({ success: false, message: 'Detection not found' });
      }
      return res.status(200).json({ success: true, data: detection });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/detections (Target Endpoint for ESP32 & Web App)
  public createDetection(req: Request, res: Response) {
    try {
      const { deviceId, type, severity, confidence, distance, latitude, longitude, imageUrl, timestamp } = req.body;

      if (!deviceId || !type || distance === undefined || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: deviceId, type, distance, latitude, longitude'
        });
      }

      // Format & validate severity
      const formattedType = type.toUpperCase() === 'POTHOLE' ? 'POTHOLE' : type.toUpperCase() === 'ROAD_BUMP' ? 'ROAD_BUMP' : 'NORMAL';
      const formattedSeverity = (severity || (distance > 50 ? 'CRITICAL' : distance > 40 ? 'HIGH' : 'MEDIUM')).toUpperCase();

      const { detection, alert } = dataStore.addDetection({
        deviceId,
        type: formattedType,
        severity: formattedSeverity,
        confidence: confidence || Math.floor(Math.random() * 15) + 85,
        distance: Number(distance),
        latitude: Number(latitude),
        longitude: Number(longitude),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        timestamp: timestamp || new Date().toISOString(),
        status: 'ACTIVE'
      });

      // Broadcast real-time WebSocket update
      wsService.broadcast('NEW_DETECTION', { detection, alert });

      return res.status(201).json({
        success: true,
        message: 'Detection logged successfully',
        data: detection,
        alert
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/detections/:id
  public deleteDetection(req: Request, res: Response) {
    try {
      const success = dataStore.deleteDetection(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Detection not found' });
      }

      wsService.broadcast('DETECTION_DELETED', { id: req.params.id });

      return res.status(200).json({ success: true, message: 'Detection deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
