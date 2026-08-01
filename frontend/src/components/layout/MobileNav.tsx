import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Camera,
  MapPin,
  Menu,
  X,
  History,
  Bell,
  BarChart3,
  Cpu,
  Settings,
  Globe
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const mainTabs = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Live', path: '/live-monitoring', icon: Activity },
    { label: 'Camera', path: '/live-camera', icon: Camera },
    { label: 'Map', path: '/map', icon: MapPin },
  ];

  const drawerLinks = [
    { label: 'Landing Page', path: '/landing', icon: Globe },
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Live Monitoring', path: '/live-monitoring', icon: Activity },
    { label: 'Live Camera', path: '/live-camera', icon: Camera },
    { label: 'Road Map', path: '/map', icon: MapPin },
    { label: 'Detection History', path: '/history', icon: History },
    { label: 'Alerts', path: '/alerts', icon: Bell },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Devices', path: '/devices', icon: Cpu },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Bottom Sticky Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/90 backdrop-blur-xl border-t border-slate-800 px-4 py-2 flex items-center justify-around">
        {mainTabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <tab.icon className="w-5 h-5 mb-0.5" />
            {tab.label}
          </NavLink>
        ))}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-medium text-slate-400 hover:text-slate-200"
        >
          {isOpen ? <X className="w-5 h-5 mb-0.5 text-cyan-400" /> : <Menu className="w-5 h-5 mb-0.5" />}
          More
        </button>
      </div>

      {/* Collapsible Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">SmartRoad AI Navigation</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {drawerLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-2.5 p-3 rounded-xl text-xs font-medium border ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-800/40 text-slate-300 border-slate-700/50'
                    }`
                  }
                >
                  <link.icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
