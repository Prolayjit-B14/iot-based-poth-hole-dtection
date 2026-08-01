import React, { useState } from 'react';
import { StatCard } from '../components/ui/StatCard';
import { TelemetryGraph } from '../components/ui/TelemetryGraph';
import { PotholeMap } from '../components/ui/PotholeMap';
import { DetectionModal } from '../components/ui/DetectionModal';
import { Detection, Device, SystemStats } from '../types';
import { AlertCircle, Activity, Calendar, ShieldAlert, Cpu, Radio, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  stats: SystemStats;
  detections: Detection[];
  devices: Device[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, detections, devices }) => {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Potholes"
          value={stats.totalPotholes}
          subtitle="Detected road cavities"
          icon={AlertCircle}
          color="danger"
          trend="+12%"
        />
        <StatCard
          title="Total Bumps"
          value={stats.totalBumps}
          subtitle="Road elevations"
          icon={Activity}
          color="warning"
        />
        <StatCard
          title="Today's Detections"
          value={stats.todayDetections}
          subtitle="Logged last 24h"
          icon={Calendar}
          color="cyan"
        />
        <StatCard
          title="Critical Hazards"
          value={stats.criticalDetections}
          subtitle="High depth pothole"
          icon={ShieldAlert}
          color="purple"
        />
        <StatCard
          title="Active Devices"
          value={stats.activeDevices}
          subtitle="Connected ESP32"
          icon={Cpu}
          color="emerald"
        />
        <StatCard
          title="System Status"
          value={stats.systemStatus}
          subtitle="WebSocket Stream Active"
          icon={Radio}
          color="cyan"
        />
      </div>

      {/* Main Center Telemetry & Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Telemetry Graph */}
        <TelemetryGraph />

        {/* Live GPS Road Map Snippet */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-slate-200">Live Geographic Road Conditions</h3>
            <Link to="/map" className="text-xs text-cyan-400 hover:underline">Full Map View →</Link>
          </div>
          <PotholeMap
            detections={detections}
            devices={devices}
            onSelectDetection={setSelectedDetection}
            height="h-[320px]"
          />
        </div>
      </div>

      {/* Recent Detections Quick Feed */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Live Hazard Activity Feed</h3>
            <p className="text-xs text-slate-400 font-mono">Latest detections recorded by ESP32 sensors</p>
          </div>
          <Link to="/history" className="text-xs text-cyan-400 hover:underline font-semibold">View All Logs →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detections.slice(0, 6).map(det => (
            <div
              key={det.id}
              onClick={() => setSelectedDetection(det)}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  det.type === 'POTHOLE' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {det.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{new Date(det.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="flex space-x-3 items-center">
                {det.imageUrl && (
                  <img src={det.imageUrl} alt="Pothole preview" className="w-14 h-12 object-cover rounded-lg border border-slate-800" />
                )}
                <div className="text-xs font-mono">
                  <p className="text-cyan-400 font-bold">Ultrasonic: {det.distance} cm</p>
                  <p className="text-slate-400 text-[11px]">Device: {det.deviceId}</p>
                  <p className="text-slate-400 text-[10px]">[{det.latitude.toFixed(4)}, {det.longitude.toFixed(4)}]</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Detail Modal */}
      <DetectionModal
        detection={selectedDetection}
        onClose={() => setSelectedDetection(null)}
      />
    </div>
  );
};
