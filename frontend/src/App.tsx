import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { DemoBar } from './components/layout/DemoBar';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { LiveCameraPage } from './pages/LiveCameraPage';
import { RoadMapPage } from './pages/RoadMapPage';
import { DetectionHistoryPage } from './pages/DetectionHistoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DeviceMonitoringPage } from './pages/DeviceMonitoringPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

import { api } from './services/api';
import { wsClient } from './services/ws';
import { Detection, Device, Alert, CameraSnapshot, SystemStats } from './types';

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthOrLanding = ['/landing', '/login', '/signup'].includes(location.pathname);

  const [demoMode, setDemoMode] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [snapshots, setSnapshots] = useState<CameraSnapshot[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalDetections: 0,
    totalPotholes: 0,
    totalBumps: 0,
    todayDetections: 0,
    criticalDetections: 0,
    activeDevices: 0,
    systemStatus: 'ONLINE'
  });

  const fetchData = async () => {
    try {
      const [dets, devs, alrts, snps, st] = await Promise.all([
        api.getDetections(),
        api.getDevices(),
        api.getAlerts(),
        api.getSnapshots(),
        api.getStats()
      ]);
      setDetections(dets);
      setDevices(devs);
      setAlerts(alrts);
      setSnapshots(snps);
      setStats(st);
    } catch (e) {
      console.warn('Backend API connection offline, using fallback state', e);
    }
  };

  useEffect(() => {
    fetchData();

    // Connect WebSocket
    wsClient.connect();

    // Subscribe to real-time broadcasts
    const unsubNewDet = wsClient.subscribe('NEW_DETECTION', (payload) => {
      if (payload.detection) {
        setDetections(prev => [payload.detection, ...prev]);
      }
      if (payload.alert) {
        setAlerts(prev => [payload.alert, ...prev]);
      }
      // refresh stats
      api.getStats().then(setStats);
    });

    const unsubGps = wsClient.subscribe('GPS_LOCATION_UPDATE', (payload) => {
      setDevices(prev =>
        prev.map(d => (d.deviceId === payload.deviceId ? { ...d, latitude: payload.latitude, longitude: payload.longitude } : d))
      );
    });

    return () => {
      unsubNewDet();
      unsubGps();
    };
  }, []);

  const handleMarkAllRead = async () => {
    await api.markAllAlertsAsRead();
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const handleMarkRead = async (id: string) => {
    await api.markAlertAsRead(id);
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const handleDeleteDetection = async (id: string) => {
    await api.deleteDetection(id);
    setDetections(prev => prev.filter(d => d.id !== id));
  };

  const handleManualSnapshot = () => {
    const newSnap: CameraSnapshot = {
      id: `snap-manual-${Date.now()}`,
      deviceId: 'ESP32-ROAD-001',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      capturedAt: new Date().toISOString(),
      detectionType: 'POTHOLE',
      severity: 'CRITICAL',
      latitude: 26.7271,
      longitude: 88.3953
    };
    setSnapshots(prev => [newSnap, ...prev]);
  };

  if (isAuthOrLanding) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-slate-100 font-sans antialiased">
      {/* Sidebar */}
      <Sidebar demoMode={demoMode} onToggleDemo={() => setDemoMode(!demoMode)} />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          alerts={alerts}
          onMarkAllRead={handleMarkAllRead}
          activeDeviceCount={stats.activeDevices}
          systemOnline={stats.systemStatus === 'ONLINE'}
        />

        {/* Demo Simulation Controller Bar (when demoMode active) */}
        {demoMode && <DemoBar onTrigger={() => fetchData()} />}

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard stats={stats} detections={detections} devices={devices} />} />
            <Route path="/live-monitoring" element={<LiveMonitoringPage devices={devices} />} />
            <Route path="/live-camera" element={<LiveCameraPage snapshots={snapshots} onCaptureSnapshot={handleManualSnapshot} />} />
            <Route path="/map" element={<RoadMapPage detections={detections} devices={devices} />} />
            <Route path="/history" element={<DetectionHistoryPage detections={detections} onDeleteDetection={handleDeleteDetection} />} />
            <Route path="/alerts" element={<AlertsPage alerts={alerts} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead} />} />
            <Route path="/analytics" element={<AnalyticsPage detections={detections} />} />
            <Route path="/devices" element={<DeviceMonitoringPage devices={devices} onRefreshDevices={fetchData} />} />
            <Route path="/reports" element={<ReportsPage detections={detections} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="*" element={<Dashboard stats={stats} detections={detections} devices={devices} />} />
          </Routes>
        </main>

        <MobileNav />
      </div>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<></>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
