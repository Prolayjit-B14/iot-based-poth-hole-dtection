import React from 'react';
import { TelemetryGraph } from '../components/ui/TelemetryGraph';
import { Device } from '../types';
import { Cpu, Wifi, MapPin, Camera, Radio, Volume2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LiveMonitoringPageProps {
  devices: Device[];
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({ devices }) => {
  const primaryDev: Device = devices[0] || {
    id: 'dev-001',
    deviceId: 'ESP32-ROAD-001',
    name: 'Bicycle Patrol Unit Alpha',
    status: 'ONLINE',
    latitude: 26.7271,
    longitude: 88.3953,
    batteryLevel: 94,
    wifiSignal: 88,
    gpsStatus: 'CONNECTED',
    cameraStatus: 'CONNECTED',
    gsmStatus: 'CONNECTED',
    ultrasonicStatus: 'CONNECTED',
    buzzerStatus: 'INACTIVE',
    firmwareVersion: 'v2.4.1',
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Primary Hardware Status Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                <span>{primaryDev.deviceId}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 inline-block rounded-full bg-emerald-400 status-dot-pulse mr-1.5"></span>
                  ONLINE
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">Last Data Packet Received: {new Date(primaryDev.lastSeen).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Firmware: {primaryDev.firmwareVersion}</span>
          </div>
        </div>

        {/* Real-time Hardware Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>GPS Status</span>
            </div>
            <p className="font-bold text-emerald-400">{primaryDev.gpsStatus}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span>Camera</span>
            </div>
            <p className="font-bold text-emerald-400">{primaryDev.cameraStatus}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>GSM Network</span>
            </div>
            <p className="font-bold text-emerald-400">{primaryDev.gsmStatus}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wi-Fi Signal</span>
            </div>
            <p className="font-bold text-cyan-400">{primaryDev.wifiSignal}% (-64dBm)</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Buzzer Alarm</span>
            </div>
            <p className={`font-bold ${primaryDev.buzzerStatus === 'ACTIVE' ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
              {primaryDev.buzzerStatus}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confidence</span>
            </div>
            <p className="font-bold text-emerald-400">94.8% AI Match</p>
          </div>
        </div>
      </div>

      {/* Sensor Chart Visualizer */}
      <TelemetryGraph />
    </div>
  );
};
