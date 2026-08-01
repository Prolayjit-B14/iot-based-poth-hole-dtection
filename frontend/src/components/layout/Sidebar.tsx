import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Camera,
  MapPin,
  History,
  Bell,
  BarChart3,
  Cpu,
  FileText,
  Settings,
  User,
  Radio,
  Globe,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  demoMode: boolean;
  onToggleDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ demoMode, onToggleDemo }) => {
  const navItems = [
    { label: 'Landing Page', path: '/landing', icon: Globe },
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Live Monitoring', path: '/live-monitoring', icon: Activity },
    { label: 'Live Camera', path: '/live-camera', icon: Camera },
    { label: 'Road Condition Map', path: '/map', icon: MapPin },
    { label: 'Detection History', path: '/history', icon: History },
    { label: 'Alerts & Notifications', path: '/alerts', icon: Bell },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Device Monitoring', path: '/devices', icon: Cpu },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'User Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0F172A]/80 backdrop-blur-xl border-r border-slate-800/80 min-h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-glow-cyan">
          <Radio className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            SmartRoad <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-[10px] uppercase font-mono tracking-widest text-cyan-400/90 font-semibold">IoT Road Detection</p>
        </div>
      </div>

      {/* Demo Mode Toggle */}
      <div className="mx-4 my-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${demoMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-xs font-medium text-slate-300">Demo Simulation</span>
        </div>
        <button
          onClick={onToggleDemo}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${demoMode ? 'bg-cyan-500' : 'bg-slate-700'}`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${demoMode ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`
            }
          >
            <item.icon className="w-4 h-4 mr-3 transition-transform group-hover:scale-110" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-400">
              SR
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Admin Patrol</p>
              <p className="text-[10px] text-emerald-400 font-mono">ESP32 Ready</p>
            </div>
          </div>
          <NavLink to="/login" title="Logout" className="text-slate-500 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
