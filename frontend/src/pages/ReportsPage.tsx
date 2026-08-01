import React, { useState } from 'react';
import { FileText, Printer, Download, Calendar, ShieldAlert, CheckCircle } from 'lucide-react';
import { Detection } from '../types';

interface ReportsPageProps {
  detections: Detection[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ detections }) => {
  const [reportType, setReportType] = useState('SUMMARY');
  const [dateRange, setDateRange] = useState('7DAYS');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Municipal Road Inspection Reports</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Generate formal documentation for city road maintenance departments
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print Official Report</span>
        </button>
      </div>

      {/* Report Controls */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-wrap gap-4 items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-3">
          <span>Report Format:</span>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-cyan-400 focus:outline-none"
          >
            <option value="SUMMARY">Executive Summary Report</option>
            <option value="CRITICAL">Critical Hazards Audit</option>
            <option value="DEVICE">Device Telemetry Logs</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <span>Time Horizon:</span>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="24H">Past 24 Hours</option>
            <option value="7DAYS">Past 7 Days</option>
            <option value="30DAYS">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="p-8 rounded-2xl glass-card border border-slate-800 space-y-6 print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black uppercase text-cyan-400">SMARTROAD AI MUNICIPAL ROAD AUDIT</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Generated: {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right text-xs font-mono text-slate-400">
            <p>Report ID: SR-RPT-2026-0801</p>
            <p>Authority: Smart City Infrastructure Wing</p>
          </div>
        </div>

        {/* Summary Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block">TOTAL LOGGED POTHOLES</span>
            <span className="text-2xl font-extrabold text-red-400">{detections.filter(d => d.type === 'POTHOLE').length}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block">TOTAL ROAD BUMPS</span>
            <span className="text-2xl font-extrabold text-amber-400">{detections.filter(d => d.type === 'ROAD_BUMP').length}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block">CRITICAL REPAIR REQUIRED</span>
            <span className="text-2xl font-extrabold text-purple-400">{detections.filter(d => d.severity === 'CRITICAL').length}</span>
          </div>
        </div>

        {/* Top Priority Hazards */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200">High Priority Critical Anomaly Summary</h3>
          <div className="space-y-2 text-xs font-mono">
            {detections.slice(0, 5).map(det => (
              <div key={det.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-cyan-400">{det.type} ({det.distance}cm)</span>
                  <p className="text-[11px] text-slate-400">GPS: [{det.latitude}, {det.longitude}] • Device: {det.deviceId}</p>
                </div>
                <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold">
                  {det.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
