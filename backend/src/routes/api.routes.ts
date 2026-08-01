import { Router } from 'express';
import { DetectionsController } from '../controllers/detections.controller';
import { DevicesController } from '../controllers/devices.controller';
import { AlertsController } from '../controllers/alerts.controller';
import { DemoController } from '../controllers/demo.controller';
import { dataStore } from '../services/data.store';

const router = Router();

const detectionsCtrl = new DetectionsController();
const devicesCtrl = new DevicesController();
const alertsCtrl = new AlertsController();
const demoCtrl = new DemoController();

// Detections Endpoints
router.get('/detections', (req, res) => detectionsCtrl.getDetections(req, res));
router.get('/detections/:id', (req, res) => detectionsCtrl.getDetectionById(req, res));
router.post('/detections', (req, res) => detectionsCtrl.createDetection(req, res));
router.delete('/detections/:id', (req, res) => detectionsCtrl.deleteDetection(req, res));

// Devices Endpoints
router.get('/devices', (req, res) => devicesCtrl.getDevices(req, res));
router.get('/devices/:id', (req, res) => devicesCtrl.getDeviceById(req, res));
router.post('/devices', (req, res) => devicesCtrl.registerDevice(req, res));
router.post('/device/heartbeat', (req, res) => devicesCtrl.heartbeat(req, res));

// Alerts Endpoints
router.get('/alerts', (req, res) => alertsCtrl.getAlerts(req, res));
router.put('/alerts/:id/read', (req, res) => alertsCtrl.markAsRead(req, res));
router.put('/alerts/read-all', (req, res) => alertsCtrl.markAllRead(req, res));

// Camera Snapshots Endpoint
router.get('/snapshots', (req, res) => {
  const snapshots = dataStore.getSnapshots();
  return res.status(200).json({ success: true, count: snapshots.length, data: snapshots });
});

// System Statistics Endpoint
router.get('/statistics', (req, res) => {
  const stats = dataStore.getStats();
  return res.status(200).json({ success: true, data: stats });
});

// Demo Simulation Triggers
router.post('/demo/simulate-pothole', (req, res) => demoCtrl.simulatePothole(req, res));
router.post('/demo/simulate-bump', (req, res) => demoCtrl.simulateBump(req, res));
router.post('/demo/move-gps', (req, res) => demoCtrl.moveGps(req, res));

export default router;
