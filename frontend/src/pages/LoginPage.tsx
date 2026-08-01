import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radio, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('operator@smartroad-ai.org');
  const [password, setPassword] = useState('••••••••');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">
      <div className="max-w-md w-full glass-card rounded-3xl border border-cyan-500/20 p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-2.5 flex items-center justify-center shadow-glow-cyan">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            SmartRoad <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">IoT Pothole & Road Bump Portal Sign In</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1 text-xs font-mono">
            <label className="text-slate-400 block">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <label className="text-slate-400 block">PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
          >
            <span>Authenticate Operator Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-cyan-400 hover:underline font-bold">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};
