import React, { useState } from 'react';
import { Camera, RefreshCw, Maximize2, CameraOff, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { CameraSnapshot } from '../../types';

interface LiveCameraFeedProps {
  streamUrl?: string;
  snapshots: CameraSnapshot[];
  onCaptureSnapshot?: () => void;
}

export const LiveCameraFeed: React.FC<LiveCameraFeedProps> = ({
  streamUrl = '',
  snapshots,
  onCaptureSnapshot
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CameraSnapshot | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sampleLiveFeed = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-4">
      {/* Live Feed Primary Panel */}
      <div className="rounded-2xl glass-card border border-slate-800 p-5 space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>ESP32-CAM Live Monitoring Feed</span>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot-pulse"></span>
                  STREAM ONLINE
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Module: ESP32-CAM OV2640 • Stream: {streamUrl || 'CAMERA_STREAM_URL (Demo Active)'}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Stream"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {onCaptureSnapshot && (
              <button
                onClick={onCaptureSnapshot}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Capture Snapshot</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
          <img
            src={sampleLiveFeed}
            alt="ESP32 CAM Stream"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay Hud */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-400 space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-bold text-white uppercase">LIVE REC</span>
            </div>
            <div>RES: 1280x720 HD</div>
            <div>FPS: 24.5 FPS</div>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
            GPS: 26.7271° N, 88.3953° E
          </div>
        </div>
      </div>

      {/* Snapshot Gallery */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-slate-100">Recent Automated Snapshots</h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {snapshots.map(snap => (
            <div
              key={snap.id}
              onClick={() => setSelectedImage(snap)}
              className="group relative aspect-video rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
            >
              <img
                src={snap.imageUrl}
                alt="Captured Pothole"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-[10px] font-mono">
                <span className={`px-1.5 py-0.5 rounded font-bold ${
                  snap.detectionType === 'POTHOLE' ? 'bg-red-500/80 text-white' : 'bg-amber-500/80 text-white'
                }`}>
                  {snap.detectionType || 'POTHOLE'}
                </span>
                <span className="text-slate-300">{new Date(snap.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Snapshot Modal Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                  {selectedImage.detectionType} SNAPSHOT DETAILED INSPECTION
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Captured at {new Date(selectedImage.capturedAt).toLocaleString()} by {selectedImage.deviceId}
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <img
              src={selectedImage.imageUrl}
              alt="Detailed View"
              className="w-full max-h-[60vh] object-contain rounded-xl border border-slate-800"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl">
              <div><span className="text-slate-500 block">Severity:</span> <span className="font-bold text-red-400">{selectedImage.severity || 'CRITICAL'}</span></div>
              <div><span className="text-slate-500 block">Device ID:</span> <span className="text-slate-200">{selectedImage.deviceId}</span></div>
              <div><span className="text-slate-500 block">Latitude:</span> <span className="text-cyan-400">{selectedImage.latitude || 26.7271}</span></div>
              <div><span className="text-slate-500 block">Longitude:</span> <span className="text-cyan-400">{selectedImage.longitude || 88.3953}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
