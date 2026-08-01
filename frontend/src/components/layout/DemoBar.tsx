import React, { useState } from 'react';
import { AlertCircle, Navigation, Zap, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

interface DemoBarProps {
  onTrigger: (type: string) => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({ onTrigger }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handlePothole = async () => {
    setLoading('pothole');
    try {
      const res = await api.simulatePothole();
      setLastAction(`Pothole (${res.data?.distance}cm) at GPS [${res.data?.latitude}, ${res.data?.longitude}]`);
      onTrigger('pothole');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleBump = async () => {
    setLoading('bump');
    try {
      const res = await api.simulateBump();
      setLastAction(`Road Bump (${res.data?.distance}cm elevation) logged`);
      onTrigger('bump');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleGps = async () => {
    setLoading('gps');
    try {
      const res = await api.moveGps();
      setLastAction(`ESP32 moved to [${res.device?.latitude}, ${res.device?.longitude}]`);
      onTrigger('gps');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-900/90 backdrop-blur-xl border-b border-cyan-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
      <div className="flex items-center space-x-2">
        <div className="p-1 rounded-md bg-cyan-500/20 text-cyan-400">
          <Zap className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <span className="font-bold text-slate-100">Live Demo Simulation Engine</span>
          <span className="hidden sm:inline text-slate-400 text-[11px] ml-2">Simulate real-time ESP32 hardware sensors</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePothole}
          disabled={loading !== null}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-semibold transition-all shadow-glow-danger disabled:opacity-50"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{loading === 'pothole' ? 'Simulating...' : 'Simulate Pothole Detection'}</span>
        </button>

        <button
          onClick={handleBump}
          disabled={loading !== null}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold transition-all shadow-glow-warning disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{loading === 'bump' ? 'Simulating...' : 'Simulate Road Bump'}</span>
        </button>

        <button
          onClick={handleGps}
          disabled={loading !== null}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold transition-all shadow-glow-cyan disabled:opacity-50"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{loading === 'gps' ? 'Moving...' : 'Simulate Moving GPS'}</span>
        </button>
      </div>

      {/* Last Trigger Status Feedback */}
      {lastAction && (
        <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{lastAction}</span>
        </div>
      )}
    </div>
  );
};
