import React, { useState, useEffect } from 'react';
import { Bell, Wifi, Cpu, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert } from '../../types';

interface HeaderProps {
  alerts: Alert[];
  onMarkAllRead: () => void;
  activeDeviceCount: number;
  systemOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  alerts,
  onMarkAllRead,
  activeDeviceCount,
  systemOnline
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
  const [showAlertMenu, setShowAlertMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString());
      setDate(d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <header className="bg-[#0F172A]/70 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Date & Time */}
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Welcome, Operator</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-3 h-3" /> ADMIN
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {date} <span className="text-cyan-400/90 font-bold ml-1">{time}</span>
          </p>
        </div>
      </div>

      {/* Right Metrics & Actions */}
      <div className="flex items-center space-x-3 lg:space-x-5">
        {/* System Status */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className={`w-2.5 h-2.5 rounded-full ${systemOnline ? 'bg-emerald-400 status-dot-pulse' : 'bg-red-500'}`} />
          <span className="text-xs font-mono font-medium text-slate-300">
            SYSTEM {systemOnline ? 'ONLINE' : 'DEGRADED'}
          </span>
        </div>

        {/* Active Devices */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Devices:</span>
          <span className="font-bold text-cyan-400 font-mono">{activeDeviceCount} Connected</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors relative"
            title="Alert Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl z-50 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-slate-100">Live Alerts</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto my-2 space-y-2">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No notifications</p>
                ) : (
                  alerts.slice(0, 5).map(alert => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-500/10 border-red-500/30 text-red-300'
                          : alert.severity === 'HIGH'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-black/40">
                          {alert.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>

              <Link
                to="/alerts"
                onClick={() => setShowAlertMenu(false)}
                className="block text-center text-xs text-cyan-400 hover:text-cyan-300 font-semibold pt-2 border-t border-slate-800"
              >
                View All Notifications →
              </Link>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link to="/profile" className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-800 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
};
