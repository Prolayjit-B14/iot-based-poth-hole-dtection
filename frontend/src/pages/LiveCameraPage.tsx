import React, { useState } from 'react';
import { LiveCameraFeed } from '../components/ui/LiveCameraFeed';
import { CameraSnapshot } from '../types';
import { Settings, Video } from 'lucide-react';

interface LiveCameraPageProps {
  snapshots: CameraSnapshot[];
  onCaptureSnapshot: () => void;
}

export const LiveCameraPage: React.FC<LiveCameraPageProps> = ({ snapshots, onCaptureSnapshot }) => {
  const [streamUrl, setStreamUrl] = useState('http://192.168.1.100:81/stream');

  return (
    <div className="space-y-6 pb-12">
      {/* Stream Config Banner */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-2.5">
          <Video className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">ESP32-CAM Configuration</h3>
            <p className="text-xs text-slate-400 font-mono">Stream Target URL (MJPEG / HTTP / RTSP)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <input
            type="text"
            value={streamUrl}
            onChange={e => setStreamUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-400 font-mono focus:outline-none focus:border-cyan-500"
            placeholder="http://192.168.1.100:81/stream"
          />
        </div>
      </div>

      {/* Main Camera Feed & Snapshot Gallery */}
      <LiveCameraFeed
        streamUrl={streamUrl}
        snapshots={snapshots}
        onCaptureSnapshot={onCaptureSnapshot}
      />
    </div>
  );
};
