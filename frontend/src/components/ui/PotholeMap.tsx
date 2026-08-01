import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Detection, Device } from '../../types';
import { MapPin, Navigation, Eye, Filter, Search } from 'lucide-react';

interface PotholeMapProps {
  detections: Detection[];
  devices: Device[];
  onSelectDetection?: (detection: Detection) => void;
  height?: string;
}

// Custom SVG Markers
const createCustomIcon = (color: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#0F172A" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const icons = {
  POTHOLE: createCustomIcon('#EF4444'), // Red
  ROAD_BUMP: createCustomIcon('#F59E0B'), // Yellow
  NORMAL: createCustomIcon('#10B981'), // Green
  CRITICAL: createCustomIcon('#A855F7'), // Purple
  DEVICE: L.divIcon({
    className: 'custom-device-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <span class="absolute w-8 h-8 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
        <div class="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white shadow-glow-cyan flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
};

// Component to programmatically recenter map
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, 15, { duration: 1.2 });
  }, [center, map]);
  return null;
}

export const PotholeMap: React.FC<PotholeMapProps> = ({
  detections,
  devices,
  onSelectDetection,
  height = 'h-[500px]'
}) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCenter, setActiveCenter] = useState<[number, number]>([26.7271, 88.3953]);

  // Primary online device
  const primaryDevice = devices[0] || { latitude: 26.7271, longitude: 88.3953, deviceId: 'ESP32-ROAD-001' };

  // Filtered Detections
  const filteredDetections = useMemo(() => {
    return detections.filter(d => {
      if (filter === 'POTHOLE') return d.type === 'POTHOLE';
      if (filter === 'ROAD_BUMP') return d.type === 'ROAD_BUMP';
      if (filter === 'CRITICAL') return d.severity === 'CRITICAL';
      if (filter === 'HIGH') return d.severity === 'HIGH';
      if (filter === 'TODAY') {
        const today = new Date().toISOString().split('T')[0];
        return d.timestamp.startsWith(today);
      }
      return true;
    });
  }, [detections, filter]);

  const handleLocateDevice = () => {
    if (primaryDevice) {
      setActiveCenter([primaryDevice.latitude, primaryDevice.longitude]);
    }
  };

  return (
    <div className="rounded-2xl glass-card border border-slate-800 p-4 space-y-3 relative overflow-hidden">
      {/* Map Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        {/* Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          <Filter className="w-4 h-4 text-cyan-400 mr-1 shrink-0" />
          {[
            { id: 'ALL', label: 'All Markers' },
            { id: 'POTHOLE', label: 'Potholes (Red)' },
            { id: 'ROAD_BUMP', label: 'Bumps (Yellow)' },
            { id: 'CRITICAL', label: 'Critical (Purple)' },
            { id: 'TODAY', label: "Today's Detections" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                filter === item.id
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-glow-cyan'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Locate Device Button */}
        <button
          onClick={handleLocateDevice}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all shadow-glow-cyan"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Locate Active Device</span>
        </button>
      </div>

      {/* Map Canvas */}
      <div className={`${height} w-full rounded-xl overflow-hidden relative border border-slate-800/80 shadow-2xl`}>
        <MapContainer
          center={activeCenter}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapRecenter center={activeCenter} />

          {/* Dark Mode Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Device Marker */}
          {primaryDevice && (
            <Marker
              position={[primaryDevice.latitude, primaryDevice.longitude]}
              icon={icons.DEVICE}
            >
              <Popup>
                <div className="p-1 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <h4 className="font-bold text-xs text-cyan-400">{primaryDevice.deviceId}</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">STATUS: {primaryDevice.status}</p>
                  <p className="text-[10px] text-slate-400">GPS: [{primaryDevice.latitude}, {primaryDevice.longitude}]</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Detection Markers */}
          {filteredDetections.map(det => {
            const iconToUse =
              det.severity === 'CRITICAL'
                ? icons.CRITICAL
                : det.type === 'POTHOLE'
                ? icons.POTHOLE
                : det.type === 'ROAD_BUMP'
                ? icons.ROAD_BUMP
                : icons.NORMAL;

            return (
              <Marker
                key={det.id}
                position={[det.latitude, det.longitude]}
                icon={iconToUse}
              >
                <Popup>
                  <div className="w-56 p-1 space-y-2">
                    {det.imageUrl && (
                      <img
                        src={det.imageUrl}
                        alt="Road Condition"
                        className="w-full h-24 object-cover rounded-lg border border-slate-700"
                      />
                    )}
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        det.type === 'POTHOLE' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {det.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{det.severity}</span>
                    </div>

                    <div className="text-[11px] space-y-0.5 text-slate-300 font-mono">
                      <p>Depth/Elev: <span className="font-bold text-cyan-400">{det.distance} cm</span></p>
                      <p>Device: {det.deviceId}</p>
                      <p>Time: {new Date(det.timestamp).toLocaleTimeString()}</p>
                    </div>

                    {onSelectDetection && (
                      <button
                        onClick={() => onSelectDetection(det)}
                        className="w-full py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold transition-colors flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Details</span>
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
