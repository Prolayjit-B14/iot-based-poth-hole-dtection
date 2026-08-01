import React, { useState } from 'react';
import { DetectionTable } from '../components/ui/DetectionTable';
import { DetectionModal } from '../components/ui/DetectionModal';
import { Detection } from '../types';
import { History, Download } from 'lucide-react';

interface DetectionHistoryPageProps {
  detections: Detection[];
  onDeleteDetection: (id: string) => void;
}

export const DetectionHistoryPage: React.FC<DetectionHistoryPageProps> = ({
  detections,
  onDeleteDetection
}) => {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  const handleExportCSV = () => {
    const headers = ['ID', 'Device ID', 'Type', 'Severity', 'Distance(cm)', 'Latitude', 'Longitude', 'Timestamp'];
    const rows = detections.map(d => [
      d.id,
      d.deviceId,
      d.type,
      d.severity,
      d.distance,
      d.latitude,
      d.longitude,
      d.timestamp
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartroad_detections_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Detection Audit Log & History</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Filterable database records of road anomalies registered by IoT units
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Log</span>
        </button>
      </div>

      <DetectionTable
        detections={detections}
        onSelectDetection={setSelectedDetection}
        onDeleteDetection={onDeleteDetection}
      />

      <DetectionModal
        detection={selectedDetection}
        onClose={() => setSelectedDetection(null)}
      />
    </div>
  );
};
