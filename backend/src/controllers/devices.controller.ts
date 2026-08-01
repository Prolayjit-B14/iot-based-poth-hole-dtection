import { Request, Response } from 'express';
import { dataStore } from '../services/data.store';
import { wsService } from '../services/websocket.service';

export class DevicesController {
  // GET /api/devices
  public getDevices(req: Request, res: Response) {
    try {
      const devices = dataStore.getDevices();
      return res.status(200).json({ success: true, count: devices.length, data: devices });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/devices/:id
  public getDeviceById(req: Request, res: Response) {
    try {
      const device = dataStore.getDeviceById(req.params.id);
      if (!device) {
        return res.status(404).json({ success: false, message: 'Device not found' });
      }
      return res.status(200).json({ success: true, data: device });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/devices (Register / Add Device)
  public registerDevice(req: Request, res: Response) {
    try {
      const { deviceId, name, latitude, longitude, batteryLevel, wifiSignal } = req.body;
      if (!deviceId) {
        return res.status(400).json({ success: false, message: 'deviceId is required' });
      }

      const device = dataStore.registerOrUpdateDevice({
        deviceId,
        name,
        latitude,
        longitude,
        batteryLevel,
        wifiSignal
      });

      wsService.broadcast('DEVICE_UPDATED', { device });
      return res.status(200).json({ success: true, message: 'Device registered successfully', data: device });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/device/heartbeat (ESP32 Periodic Heartbeat)
  public heartbeat(req: Request, res: Response) {
    try {
      const { deviceId, status, batteryLevel, wifiSignal, latitude, longitude } = req.body;
      if (!deviceId) {
        return res.status(400).json({ success: false, message: 'deviceId is required' });
      }

      const device = dataStore.registerOrUpdateDevice({
        deviceId,
        status: status || 'ONLINE',
        batteryLevel,
        wifiSignal,
        latitude,
        longitude
      });

      wsService.broadcast('DEVICE_HEARTBEAT', { device });
      return res.status(200).json({ success: true, message: 'Heartbeat acknowledged', timestamp: new Date().toISOString() });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
