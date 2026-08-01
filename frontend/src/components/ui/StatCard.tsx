import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'danger' | 'warning' | 'emerald' | 'purple';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
  trend
}) => {
  const colorStyles = {
    cyan: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      glow: 'shadow-glow-cyan'
    },
    danger: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30',
      glow: 'shadow-glow-danger'
    },
    warning: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-glow-warning'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]'
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]'
    }
  };

  const style = colorStyles[color];

  return (
    <div className={`p-5 rounded-2xl glass-card transition-all duration-300 relative overflow-hidden group ${style.glow}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-100 mt-1 font-mono tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              {trend && <span className="font-bold text-emerald-400">{trend}</span>}
              <span>{subtitle}</span>
            </p>
          )}
        </div>

        <div className={`p-3.5 rounded-2xl ${style.bg} ${style.text} border ${style.border} transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Decorative subtle background gradient */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${style.bg} blur-2xl pointer-events-none opacity-40`} />
    </div>
  );
};
