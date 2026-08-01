import React from 'react';
import { Device } from '../../types';
import { Cpu, Wifi, Battery, MapPin, Camera, Activity, Radio, Volume2 } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const isOnline = device.status === 'ONLINE';

  return (
    <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4 relative overflow-hidden group">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">{device.name}</h3>
            <p className="text-xs text-cyan-400 font-mono">{device.deviceId}</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
          isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 status-dot-pulse' : 'bg-red-500'}`}></span>
          {device.status}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center space-x-2">
          <Battery className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-500 block">BATTERY</span>
            <span className="font-bold text-slate-200">{device.batteryLevel}%</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Wifi className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-[10px] text-slate-500 block">WIFI SIGNAL</span>
            <span className="font-bold text-slate-200">{device.wifiSignal}%</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-500 block">GPS MODULE</span>
            <span className="font-bold text-emerald-400">{device.gpsStatus}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-purple-400" />
          <div>
            <span className="text-[10px] text-slate-500 block">CAMERA</span>
            <span className="font-bold text-emerald-400">{device.cameraStatus}</span>
          </div>
        </div>
      </div>

      {/* Sensor Peripherals */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <span>GSM: <strong className="text-slate-200">{device.gsmStatus}</strong></span>
        <span>Buzzer: <strong className={device.buzzerStatus === 'ACTIVE' ? 'text-amber-400 animate-pulse' : 'text-slate-400'}>{device.buzzerStatus}</strong></span>
        <span>Firmware: <strong className="text-cyan-400">{device.firmwareVersion}</strong></span>
      </div>
    </div>
  );
};
