import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  cropCount?: number;
  farmCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  cropCount = 2,
  farmCount = 1,
}) => {
  const { user } = useAuth();

  const mainModules = [
    { id: '/dashboard', label: 'Field Command Center', icon: 'home' },
    { id: '/crop-analysis', label: 'AI Crop Diagnostics', icon: 'document_scanner', badge: 'v4.2 Vision' },
    { id: '/farms', label: 'Farms & Plots', icon: 'fence', count: farmCount },
    { id: '/crops', label: 'Monitored Crops', icon: 'grass', count: cropCount },
    { id: '/irrigation', label: 'Precision Irrigation', icon: 'water_drop' },
    { id: '/fertilizer', label: 'Custom Fertilizer (NPK)', icon: 'science' },
    { id: '/ai-assistant', label: 'Multilingual Assistant', icon: 'smart_toy', badge: 'EN/தமிழ்' },
    { id: '/weather', label: 'Microclimate & Weather', icon: 'partly_cloudy_day' },
    { id: '/alerts', label: 'Agronomic Alerts', icon: 'warning' },
    { id: '/analytics', label: 'Farm Analytics', icon: 'monitoring' },
    { id: '/reports', label: 'Field Health Reports', icon: 'description' },
  ];

  return (
    <aside className="w-68 bg-white border-r border-slate-200/80 flex flex-col shrink-0 min-h-[calc(100vh-4.5rem)] p-4 select-none">
      <div className="space-y-6 flex-1">
        {/* Core Field Operations */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
            Agronomy Command
          </span>
          <nav className="mt-2 space-y-1">
            {mainModules.map((item) => {
              const isActive = currentRoute === item.id || (item.id === '/crop-analysis' && currentRoute.startsWith('/crop-analysis/'));
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-[#d3ffd5]/60 text-[#00652c] font-bold shadow-2xs ring-1 ring-[#95f8a7]'
                      : 'text-slate-600 hover:text-[#111c2d] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive ? 'text-[#00652c]' : 'text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#dee8ff] text-[#00652c] shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && !item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Section if authorized */}
        {user?.role === 'ADMIN' && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 px-3">
              Admin Governance
            </span>
            <nav className="mt-2 space-y-1">
              <button
                onClick={() => onNavigate('/admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  currentRoute === '/admin'
                    ? 'bg-purple-50 text-purple-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-purple-700">admin_panel_settings</span>
                <span>Regional Oversight</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* IoT Sensor Live Telemetry Box at bottom */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#111c2d] to-[#263143] text-white shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#95f8a7] animate-pulse"></span>
              <span className="text-[11px] font-bold text-[#95f8a7]">IoT Geo-Sensor Active</span>
            </div>
            <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">ESP32</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-400 block text-[9px]">Rootzone Moist</span>
              <strong className="text-white text-xs">38% Vol</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Ambient Temp</span>
              <strong className="text-white text-xs">29.2°C</strong>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
