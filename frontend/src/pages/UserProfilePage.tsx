import React from 'react';
import { User, ShieldCheck, Mail, Key, Clock, Award } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          <span>Operator Profile & Access Credentials</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          System user identity, assigned role permissions, and session credentials
        </p>
      </div>

      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center space-x-4 border-b border-slate-800 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 flex items-center justify-center shadow-glow-cyan">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Municipal Chief Patrol Operator</h3>
            <p className="text-xs text-cyan-400 font-mono">operator@smartroad-ai.org</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-3 h-3" /> ROLE: ADMIN / CHIEF OPERATOR
            </span>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block">DEVICE MANAGEMENT</span>
            <span className="font-bold text-emerald-400">Full Access (Add/Edit/Delete)</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block">DETECTION AUDIT</span>
            <span className="font-bold text-emerald-400">Full Access (Review/Export)</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block">ACTIVE SESSION</span>
            <span className="font-bold text-cyan-400">Authenticated Token Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
