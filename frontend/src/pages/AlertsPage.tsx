import React, { useState } from 'react';
import { Alert } from '../types';
import { Bell, CheckCheck, Trash2, Filter, AlertCircle, ShieldAlert, Info, Cpu } from 'lucide-react';

interface AlertsPageProps {
  alerts: Alert[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts, onMarkRead, onMarkAllRead }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'UNREAD') return !a.isRead;
    if (filter === 'CRITICAL') return a.type === 'CRITICAL';
    if (filter === 'WARNING') return a.type === 'WARNING';
    if (filter === 'SYSTEM') return a.type === 'SYSTEM';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>Alerts & Notifications Center</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Real-time event dispatches for critical potholes, bumps, and device status changes
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-xs font-semibold transition-all"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All As Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'UNREAD', label: 'Unread Only' },
          { id: 'CRITICAL', label: 'Critical' },
          { id: 'WARNING', label: 'Warnings' },
          { id: 'SYSTEM', label: 'System Telemetry' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === tab.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-2xl text-slate-500 text-xs">
            No notifications matching current filter
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all flex justify-between items-center ${
                !alert.isRead ? 'glass-card border-cyan-500/30' : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-3 rounded-xl ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : alert.severity === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {alert.type === 'CRITICAL' ? <ShieldAlert className="w-5 h-5" /> : alert.type === 'SYSTEM' ? <Cpu className="w-5 h-5 text-cyan-400" /> : <AlertCircle className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {alert.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-100 font-medium">{alert.message}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Device ID: {alert.deviceId}</p>
                </div>
              </div>

              {!alert.isRead && (
                <button
                  onClick={() => onMarkRead(alert.id)}
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-semibold"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
