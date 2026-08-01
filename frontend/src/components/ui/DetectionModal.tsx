import React from 'react';
import { Detection } from '../../types';
import { X, MapPin, Activity, Calendar, Clock, Cpu, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface DetectionModalProps {
  detection: Detection | null;
  onClose: () => void;
}

export const DetectionModal: React.FC<DetectionModalProps> = ({ detection, onClose }) => {
  if (!detection) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-extrabold text-slate-100 uppercase tracking-wider">
              {detection.type.replace('_', ' ')} INSPECTION REPORT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Image & Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Image preview */}
          <div>
            {detection.imageUrl ? (
              <img
                src={detection.imageUrl}
                alt="Detection snapshot"
                className="w-full h-56 object-cover rounded-xl border border-slate-800"
              />
            ) : (
              <div className="w-full h-56 bg-slate-950 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                No Camera Snapshot Captured
              </div>
            )}
          </div>

          {/* Key Metrics */}
          <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block uppercase">Severity Level</span>
              <span className={`text-base font-extrabold ${
                detection.severity === 'CRITICAL' ? 'text-red-400 glow-text-danger' : 'text-amber-400'
              }`}>
                {detection.severity}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase">Ultrasonic Distance / Depth</span>
              <span className="text-base font-extrabold text-cyan-400">{detection.distance} cm</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase">Detection Confidence</span>
              <span className="text-slate-200 font-bold">{detection.confidence}%</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase">IoT Device ID</span>
              <span className="text-slate-200 font-bold">{detection.deviceId}</span>
            </div>
          </div>
        </div>

        {/* GPS Location & Timestamp */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-slate-500 block">GPS COORDINATES</span>
              <span className="text-slate-200">[{detection.latitude}, {detection.longitude}]</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-slate-500 block">LOGGED TIMESTAMP</span>
              <span className="text-slate-200">{new Date(detection.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-colors"
        >
          Dismiss Detail View
        </button>
      </div>
    </div>
  );
};
