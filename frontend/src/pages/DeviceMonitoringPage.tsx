import React, { useState } from 'react';
import { DeviceCard } from '../components/ui/DeviceCard';
import { Device } from '../types';
import { Cpu, Plus, Radio, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

interface DeviceMonitoringPageProps {
  devices: Device[];
  onRefreshDevices: () => void;
}

export const DeviceMonitoringPage: React.FC<DeviceMonitoringPageProps> = ({ devices, onRefreshDevices }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceId) return;

    await api.registerDevice({
      deviceId: newDeviceId,
      name: newDeviceName || `ESP32 Device (${newDeviceId})`,
      status: 'ONLINE'
    });

    setShowAddModal(false);
    setNewDeviceId('');
    setNewDeviceName('');
    onRefreshDevices();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>ESP32 Hardware Device Inventory</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Active telemetry status, sensor health, battery level, and wireless diagnostics
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRefreshDevices}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Refresh Devices"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New IoT Device</span>
          </button>
        </div>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map(dev => (
          <DeviceCard key={dev.id || dev.deviceId} device={dev} />
        ))}
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleAddDevice}
            className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">Register ESP32 Microcontroller</h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">DEVICE ID (e.g. ESP32-ROAD-004)</label>
                <input
                  type="text"
                  required
                  value={newDeviceId}
                  onChange={e => setNewDeviceId(e.target.value)}
                  placeholder="ESP32-ROAD-004"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">DEVICE NAME</label>
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={e => setNewDeviceName(e.target.value)}
                  placeholder="Bicycle Unit Delta"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-glow-cyan"
              >
                Register Device
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
