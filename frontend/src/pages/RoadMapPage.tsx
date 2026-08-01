import React, { useState } from 'react';
import { PotholeMap } from '../components/ui/PotholeMap';
import { DetectionModal } from '../components/ui/DetectionModal';
import { Detection, Device } from '../types';
import { MapPin, Globe } from 'lucide-react';

interface RoadMapPageProps {
  detections: Detection[];
  devices: Device[];
}

export const RoadMapPage: React.FC<RoadMapPageProps> = ({ detections, devices }) => {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  return (
    <div className="space-y-4 pb-12">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Interactive Road Condition GIS Map</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Spatial mapping of potholes, road bumps, and patrol route tracking
          </p>
        </div>
      </div>

      <PotholeMap
        detections={detections}
        devices={devices}
        onSelectDetection={setSelectedDetection}
        height="h-[75vh]"
      />

      <DetectionModal
        detection={selectedDetection}
        onClose={() => setSelectedDetection(null)}
      />
    </div>
  );
};
