import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Radio } from 'lucide-react';

interface TelemetryPoint {
  time: string;
  distance: number;
  threshold: number;
}

export const TelemetryGraph: React.FC = () => {
  const [data, setData] = useState<TelemetryPoint[]>([]);

  useEffect(() => {
    // Generate initial live telemetry buffer
    const initialPoints: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 15; i >= 0; i--) {
      const timeStr = new Date(now - i * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const baseline = 32.4;
      const variation = (Math.random() - 0.5) * 2;
      initialPoints.push({
        time: timeStr,
        distance: Number((baseline + variation).toFixed(1)),
        threshold: 32.0
      });
    }
    setData(initialPoints);

    // Dynamic stream update every 2 seconds
    const interval = setInterval(() => {
      setData(prev => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const lastDist = prev[prev.length - 1]?.distance || 32.4;
        // Occasional anomaly spike
        const spike = Math.random() > 0.85 ? (Math.random() > 0.5 ? 22 : -15) : (Math.random() - 0.5) * 3;
        const newDist = Math.max(10, Math.min(75, Number((32.4 + spike).toFixed(1))));

        const next = [...prev.slice(1), { time: timeStr, distance: newDist, threshold: 32.0 }];
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1] || { distance: 32.4 };
  const isPothole = latest.distance > 45;
  const isBump = latest.distance < 20;

  return (
    <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Live Ultrasonic Distance Sensing</h3>
            <p className="text-xs text-slate-400 font-mono">ESP32 Road Telemetry • 45° Ultrasonic Array</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Current Distance</span>
            <span className={`text-xl font-extrabold font-mono ${
              isPothole ? 'text-red-400 glow-text-danger' : isBump ? 'text-amber-400' : 'text-cyan-400 glow-text-cyan'
            }`}>
              {latest.distance} cm
            </span>
          </div>

          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
            isPothole
              ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
              : isBump
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}>
            {isPothole ? 'POTHOLE!' : isBump ? 'ROAD BUMP!' : 'NORMAL ROAD'}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="distanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
            <YAxis domain={[0, 80]} stroke="#64748B" fontSize={10} tickLine={false} unit="cm" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                borderRadius: '0.75rem',
                color: '#F8FAFC',
                fontSize: '12px'
              }}
            />
            <Area
              type="monotone"
              dataKey="distance"
              stroke="#06B6D4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#distanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
