import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert, Activity } from 'lucide-react';
import { Detection } from '../types';

interface AnalyticsPageProps {
  detections: Detection[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ detections }) => {
  // Weekly Trend Mock Data
  const weeklyData = [
    { day: 'Mon', potholes: 12, bumps: 8 },
    { day: 'Tue', potholes: 19, bumps: 14 },
    { day: 'Wed', potholes: 15, bumps: 10 },
    { day: 'Thu', potholes: 25, bumps: 18 },
    { day: 'Fri', potholes: 22, bumps: 12 },
    { day: 'Sat', potholes: 30, bumps: 21 },
    { day: 'Sun', potholes: 18, bumps: 11 },
  ];

  // Severity Distribution Data
  const severityData = [
    { name: 'Critical', value: detections.filter(d => d.severity === 'CRITICAL').length || 4, color: '#EF4444' },
    { name: 'High', value: detections.filter(d => d.severity === 'HIGH').length || 8, color: '#F59E0B' },
    { name: 'Medium', value: detections.filter(d => d.severity === 'MEDIUM').length || 12, color: '#38BDF8' },
    { name: 'Low', value: detections.filter(d => d.severity === 'LOW').length || 5, color: '#10B981' }
  ];

  // Condition Ratio
  const conditionData = [
    { name: 'Pothole', value: detections.filter(d => d.type === 'POTHOLE').length || 15, color: '#EF4444' },
    { name: 'Road Bump', value: detections.filter(d => d.type === 'ROAD_BUMP').length || 9, color: '#F59E0B' },
    { name: 'Normal Road', value: 45, color: '#10B981' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>Road Infrastructure Analytics Dashboard</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Statistical visualization of road deterioration trends and spatial anomaly density
        </p>
      </div>

      {/* Top Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Line Chart */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Daily Pothole & Bump Trends</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '0.75rem'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="potholes" stroke="#EF4444" strokeWidth={2.5} name="Potholes" />
                <Line type="monotone" dataKey="bumps" stroke="#F59E0B" strokeWidth={2.5} name="Road Bumps" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Donut */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Hazard Severity Distribution</h3>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '0.75rem'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Bar Charts */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">Overall Road Condition Breakdown</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conditionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(56, 189, 248, 0.3)',
                  borderRadius: '0.75rem'
                }}
              />
              <Bar dataKey="value" fill="#06B6D4" radius={[6, 6, 0, 0]}>
                {conditionData.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
