import React from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  MapPin,
  Camera,
  Activity,
  ShieldAlert,
  BarChart3,
  ArrowRight,
  Cpu,
  Wifi,
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      title: 'Real-Time Pothole Detection',
      desc: 'Detect road cavities down to millimeter precision using 45° angled ultrasonic sensor arrays.',
      icon: Activity,
      color: 'text-red-400',
      border: 'hover:border-red-500/50'
    },
    {
      title: 'Road Bump Detection',
      desc: 'Instant elevation change profiling to distinguish speed bumps from surface erosion.',
      icon: Zap,
      color: 'text-amber-400',
      border: 'hover:border-amber-500/50'
    },
    {
      title: 'GPS Location Tracking',
      desc: 'Pinpoint exact geographic coordinates of hazards using on-board NEO-6M GPS modules.',
      icon: MapPin,
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/50'
    },
    {
      title: 'Live Camera Monitoring',
      desc: 'ESP32-CAM wireless module automatically captures visual snapshot proof of every road defect.',
      icon: Camera,
      color: 'text-purple-400',
      border: 'hover:border-purple-500/50'
    },
    {
      title: 'IoT Cloud Dashboard',
      desc: 'Centralized telemetry server broadcasting real-time updates via WebSockets and REST APIs.',
      icon: Cpu,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/50'
    },
    {
      title: 'Instant Alerts',
      desc: 'Immediate notifications dispatched to city maintenance operators upon hazard detection.',
      icon: ShieldAlert,
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/50'
    }
  ];

  const workflowSteps = [
    'Ultrasonic Sensor Measures Road',
    'ESP32 Analyzes Road Surface',
    'Pothole/Bump Is Detected',
    'GPS Gets Location',
    'Camera Captures Image',
    'Data Is Sent to Backend',
    'Website Displays Alert',
    'Location Appears on Map'
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <header className="px-6 lg:px-12 py-5 flex justify-between items-center border-b border-slate-800/80 sticky top-0 bg-[#0B0F19]/80 backdrop-blur-xl z-40">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-glow-cyan">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            SmartRoad <span className="text-cyan-400">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
          >
            Launch Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 pt-16 pb-24 max-w-7xl mx-auto text-center space-y-8 bg-hero-gradient relative">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Zap className="w-3.5 h-3.5" />
          <span>Next-Generation Smart City IoT Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight">
          SmartRoad <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent glow-text-cyan">AI</span>
          <br />
          <span className="text-3xl sm:text-5xl text-slate-300">Real-Time IoT-Based Pothole & Road Bump Detection</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Monitor road conditions in real time using ESP32, ultrasonic sensing, GPS location tracking, wireless camera monitoring, and IoT technology.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <Link
            to="/"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-glow-cyan transition-all flex items-center space-x-2"
          >
            <span>Open Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/map"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 font-bold text-sm transition-all flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>View Road Map</span>
          </Link>
        </div>

        {/* Futuristic System Graphic */}
        <div className="mt-12 p-6 rounded-3xl glass-card border border-cyan-500/20 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <Cpu className="w-5 h-5 text-cyan-400 mb-2" />
              <span className="text-slate-500 block">MICROCONTROLLER</span>
              <span className="font-bold text-slate-200">ESP32 Dual-Core</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <Activity className="w-5 h-5 text-emerald-400 mb-2" />
              <span className="text-slate-500 block">DISTANCE SENSOR</span>
              <span className="font-bold text-slate-200">HC-SR04 / Ultrasonic</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <Camera className="w-5 h-5 text-purple-400 mb-2" />
              <span className="text-slate-500 block">VISION MODULE</span>
              <span className="font-bold text-slate-200">ESP32-CAM OV2640</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <MapPin className="w-5 h-5 text-amber-400 mb-2" />
              <span className="text-slate-500 block">GEOLOCATION</span>
              <span className="font-bold text-slate-200">NEO-6M GPS Module</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-100">Enterprise IoT Road Monitoring Capabilities</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Engineered for high-frequency road condition profiling mounted on municipal patrol bicycles, motorcycles, or fleet vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl glass-card transition-all duration-300 border border-slate-800 ${f.border} space-y-3`}
            >
              <div className={`p-3 rounded-xl bg-slate-900 w-fit ${f.color}`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 lg:px-12 py-20 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-100">How The System Works</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              From physical sensor road measurement to instant live map alert rendering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-card border border-slate-800 relative space-y-2"
              >
                <span className="text-2xl font-extrabold text-cyan-400/40 font-mono">0{idx + 1}</span>
                <h4 className="text-sm font-bold text-slate-100">{step}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 text-center text-xs text-slate-500 border-t border-slate-800/80">
        <p>© 2026 SmartRoad AI. IoT-Based Pothole & Road Bump Detection System.</p>
      </footer>
    </div>
  );
};
