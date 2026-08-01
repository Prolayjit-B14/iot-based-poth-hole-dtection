import React, { useState, useMemo } from 'react';
import { Detection } from '../../types';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

interface DetectionTableProps {
  detections: Detection[];
  onSelectDetection: (detection: Detection) => void;
  onDeleteDetection?: (id: string) => void;
}

export const DetectionTable: React.FC<DetectionTableProps> = ({
  detections,
  onSelectDetection,
  onDeleteDetection
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredDetections = useMemo(() => {
    return detections.filter(d => {
      const matchesSearch =
        d.id.toLowerCase().includes(search.toLowerCase()) ||
        d.deviceId.toLowerCase().includes(search.toLowerCase()) ||
        d.type.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'ALL' || d.type === typeFilter;
      const matchesSeverity = severityFilter === 'ALL' || d.severity === severityFilter;
      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [detections, search, typeFilter, severityFilter]);

  const totalPages = Math.ceil(filteredDetections.length / itemsPerPage) || 1;
  const paginatedDetections = filteredDetections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-2xl glass-card border border-slate-800 p-5 space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, device, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Types</option>
            <option value="POTHOLE">Potholes</option>
            <option value="ROAD_BUMP">Road Bumps</option>
            <option value="NORMAL">Normal Road</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Table Component */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Thumbnail</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Ultrasonic</th>
              <th className="py-3 px-4">Device ID</th>
              <th className="py-3 px-4">GPS Coordinates</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {paginatedDetections.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-500">
                  No detection records found
                </td>
              </tr>
            ) : (
              paginatedDetections.map(det => (
                <tr key={det.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-2.5 px-4">
                    {det.imageUrl ? (
                      <img
                        src={det.imageUrl}
                        alt="Road condition"
                        className="w-10 h-8 object-cover rounded-md border border-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-8 bg-slate-800 rounded-md flex items-center justify-center text-[9px] text-slate-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      det.type === 'POTHOLE'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : det.type === 'ROAD_BUMP'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {det.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`font-bold ${
                      det.severity === 'CRITICAL' ? 'text-purple-400 glow-text-cyan' : det.severity === 'HIGH' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {det.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-cyan-400 font-bold">
                    {det.distance} cm
                  </td>
                  <td className="py-2.5 px-4 text-slate-300">
                    {det.deviceId}
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                    [{det.latitude.toFixed(4)}, {det.longitude.toFixed(4)}]
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                    {new Date(det.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onSelectDetection(det)}
                      className="p-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {onDeleteDetection && (
                      <button
                        onClick={() => onDeleteDetection(det.id)}
                        className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                        title="Delete Detection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
        <div>
          Showing {paginatedDetections.length} of {filteredDetections.length} records
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
