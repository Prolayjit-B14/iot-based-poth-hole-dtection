import { Request, Response } from 'express';
import { dataStore } from '../services/data.store';

export class AlertsController {
  // GET /api/alerts
  public getAlerts(req: Request, res: Response) {
    try {
      const alerts = dataStore.getAlerts();
      return res.status(200).json({ success: true, count: alerts.length, data: alerts });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // PUT /api/alerts/:id/read
  public markAsRead(req: Request, res: Response) {
    try {
      const success = dataStore.markAlertRead(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Alert not found' });
      }
      return res.status(200).json({ success: true, message: 'Alert marked as read' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // PUT /api/alerts/read-all
  public markAllRead(req: Request, res: Response) {
    try {
      dataStore.markAllAlertsRead();
      return res.status(200).json({ success: true, message: 'All alerts marked as read' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
