import React, { useState } from 'react';
import { Settings, Save, Server, Camera, Sliders, Database, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/api');
  const [cameraUrl, setCameraUrl] = useState('http://192.168.1.100:81/stream');
  const [potholeThreshold, setPotholeThreshold] = useState('45');
  const [bumpThreshold, setBumpThreshold] = useState('20');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>System Parameters & Environment Settings</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Configure API endpoints, ESP32-CAM stream, ultrasonic threshold sensitivity, and Supabase keys
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* API & Camera URL Config */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Server className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">API & Camera Network Stream</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">BACKEND REST API URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">ESP32-CAM STREAM URL (CAMERA_STREAM_URL)</label>
              <input
                type="text"
                value={cameraUrl}
                onChange={e => setCameraUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Ultrasonic Sensor Sensitivity */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Ultrasonic Sensor Detection Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">POTHOLE THRESHOLD (DISTANCE &gt; CM)</label>
              <input
                type="number"
                value={potholeThreshold}
                onChange={e => setPotholeThreshold(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-red-400 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">Readings above this depth trigger Pothole Alerts</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">ROAD BUMP THRESHOLD (DISTANCE &lt; CM)</label>
              <input
                type="number"
                value={bumpThreshold}
                onChange={e => setBumpThreshold(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">Readings below this distance trigger Bump Alerts</span>
            </div>
          </div>
        </div>

        {/* Supabase Cloud Connection Settings */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Supabase Cloud Database Settings</h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">SUPABASE_URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">SUPABASE_ANON_KEY</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={e => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end items-center space-x-3">
          {saved && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> System parameters updated successfully!
            </span>
          )}

          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Environment Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
};
