import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Farm, Crop, CropAnalysis, SensorReading, FarmAlert } from '../types/index.ts';

interface DashboardProps {
  farms: Farm[];
  crops: Crop[];
  recentAnalyses: CropAnalysis[];
  sensors: SensorReading[];
  alerts: FarmAlert[];
  onNavigate: (route: string) => void;
  onOpenAnalysis: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  farms,
  crops,
  recentAnalyses,
  sensors,
  alerts,
  onNavigate,
  onOpenAnalysis,
}) => {
  const { user, language } = useAuth();
  const isTamil = language === 'ta';

  const primaryFarm = farms[0] || {
    farmName: 'GreenValley Farm #1',
    area: 12.5,
  };

  const latestSensor = sensors[0] || {
    temperature: 29.0,
    humidity: 68,
    soilMoisture: 38,
  };

  return (
    <div className="w-full max-w-[500px] md:max-w-5xl mx-auto space-y-5 pb-24 md:pb-8">
      {/* Top Greeting & Farm Context Card matching Stitch Image 5 */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTamil ? 'பண்ணை கட்டளை மையம்' : 'Field Command Center'}
            </span>
            <h1 className="font-headline font-bold text-lg sm:text-xl text-[#111c2d] truncate mt-0.5">
              {isTamil ? 'காலை வணக்கம்' : 'Good Morning'}, {user?.name || 'Rajesh Kumar'} 👋
            </h1>
            <div className="inline-flex items-center gap-1.5 mt-2 bg-[#dee8ff] px-3 py-1 rounded-full self-start">
              <span className="w-2 h-2 rounded-full bg-[#00652c] animate-pulse"></span>
              <span className="text-xs text-[#111c2d] font-bold">
                {primaryFarm.farmName} • {primaryFarm.area} Acres
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#dee8ff] flex items-center justify-center shrink-0 text-[#00652c] shadow-xs">
            <span className="material-symbols-outlined text-[26px]">wb_sunny</span>
          </div>
        </div>
      </div>

      {/* Immediate Operations 4-Column Grid matching Stitch Image 5 */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
          {isTamil ? 'உடனடி செயல்பாடுகள்' : 'Immediate Operations'}
        </span>
        <div className="grid grid-cols-4 gap-2">
          {/* 1. Analyze Crop */}
          <button
            onClick={() => onNavigate('/crop-analysis')}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-[#15803d] hover:bg-[#166534] text-white shadow-sm active:scale-95 transition-transform min-h-[88px] text-center"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            </div>
            <span className="text-[11px] font-bold leading-tight">
              {isTamil ? 'பயிரை' : 'Analyze'}<br />{isTamil ? 'ஆராய்க' : 'Crop'}
            </span>
          </button>

          {/* 2. Ask AI (Tamil/En) */}
          <button
            onClick={() => onNavigate('/ai-assistant')}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-[#0075b1] hover:bg-[#005b8c] text-white shadow-sm active:scale-95 transition-transform min-h-[88px] text-center"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <span className="text-[11px] font-bold leading-tight">
              {isTamil ? 'கேளுங்கள்' : 'Ask AI'}<br />
              <span className="text-[9px] opacity-90">தமிழ்/En</span>
            </span>
          </button>

          {/* 3. Add Farm */}
          <button
            onClick={() => onNavigate('/farms')}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-200/80 text-[#111c2d] shadow-xs hover:bg-slate-50 active:scale-95 transition-transform min-h-[88px] text-center"
          >
            <div className="w-10 h-10 rounded-full bg-[#dee8ff] flex items-center justify-center text-[#00652c]">
              <span className="material-symbols-outlined text-[22px]">add_location_alt</span>
            </div>
            <span className="text-[11px] font-bold leading-tight">
              {isTamil ? 'பண்ணை' : 'Add'}<br />{isTamil ? 'சேர்' : 'Farm'}
            </span>
          </button>

          {/* 4. View Reports */}
          <button
            onClick={() => onNavigate('/reports')}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-200/80 text-[#111c2d] shadow-xs hover:bg-slate-50 active:scale-95 transition-transform min-h-[88px] text-center"
          >
            <div className="w-10 h-10 rounded-full bg-[#ffdcc3] flex items-center justify-center text-[#904d00]">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <span className="text-[11px] font-bold leading-tight">
              {isTamil ? 'அறிக்கை' : 'View'}<br />{isTamil ? 'பார்' : 'Reports'}
            </span>
          </button>
        </div>
      </div>

      {/* Active Agronomic Risk Alert Banner matching Stitch Image 5 */}
      {alerts.length > 0 && (
        <div className="rounded-2xl bg-[#fe932c]/15 border border-[#fe932c]/40 p-4 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#fe932c] text-[#663500] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#904d00]">
                {alerts[0].title}
              </span>
            </div>
            <p className="text-xs text-[#111c2d] mt-1 leading-snug">
              {alerts[0].message}
            </p>
          </div>
        </div>
      )}

      {/* Live Microclimate & Soil Sensors Bar matching Stitch Image 5 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Live Microclimate & Soil Sensors
          </span>
          <span className="text-[11px] font-bold text-[#00652c] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00652c] inline-block animate-pulse"></span>
            <span>ESP32 Live</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Sensor 1: Ambient Weather */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Ambient Weather</span>
              <span className="material-symbols-outlined text-[18px] text-[#005b8c]">partly_cloudy_day</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="font-headline font-extrabold text-3xl text-[#111c2d]">
                  {latestSensor.temperature}°C
                </span>
                <span className="text-xs text-slate-600 font-semibold">Partly Sunny</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Relative Humidity: <strong className="text-[#111c2d]">{latestSensor.humidity}%</strong>
              </p>
            </div>
            <div className="w-full bg-[#dee8ff] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#0075b1] h-full rounded-full" style={{ width: `${latestSensor.humidity}%` }}></div>
            </div>
          </div>

          {/* Sensor 2: Soil Moisture */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Rootzone Moisture</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d3ffd5] text-[#00652c]">
                OPTIMAL
              </span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline font-extrabold text-3xl text-[#00652c]">
                  {latestSensor.soilMoisture}%
                </span>
                <span className="text-xs text-slate-500 font-semibold">Volumetric</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Field Capacity Target: <strong className="text-[#111c2d]">35–42%</strong>
              </p>
            </div>
            <div className="w-full bg-[#dee8ff] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#15803d] h-full rounded-full" style={{ width: '76%' }}></div>
            </div>
          </div>

          {/* Sensor 3: Soil Temp & Nutrients */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Soil Temp & Nutrients</span>
              <span className="material-symbols-outlined text-[18px] text-[#904d00]">eco</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline font-extrabold text-3xl text-[#111c2d]">24.2°C</span>
                <span className="text-xs text-slate-500 font-semibold">Depth 15cm</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                NPK Profile: <strong className="text-[#00652c]">Balanced (N+ P= K+)</strong>
              </p>
            </div>
            <div className="w-full bg-[#dee8ff] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#fe932c] h-full rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Crop Health Score Widget matching Stitch Image 5 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Field Diagnostic Health
            </span>
            <h2 className="font-headline font-bold text-base text-[#111c2d]">Overall Health Score</h2>
          </div>
          <span className="material-symbols-outlined text-[#00652c] text-[24px]">verified</span>
        </div>

        <div className="flex items-center gap-4 p-4 bg-[#f0f3ff] rounded-2xl">
          {/* Gauge circle SVG */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="38" fill="transparent" stroke="#dee8ff" strokeWidth="8" />
              <circle
                cx="48"
                cy="48"
                r="38"
                fill="transparent"
                stroke="#00652c"
                strokeWidth="8"
                strokeDasharray="238.76"
                strokeDashoffset="28.65"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-headline font-extrabold text-2xl text-[#111c2d] leading-none">88</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase">/ 100</span>
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d3ffd5] text-[#00652c] self-start text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00652c]"></span>
              <span>Good Health Status</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Vegetative biomass index elevated. Water stress remains suppressed across 85% canopy.
            </p>
          </div>
        </div>

        {/* Monitored Plots Breakdown */}
        <div className="flex flex-col gap-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Individual Monitored Plots
          </span>

          {crops.map((crop, idx) => (
            <div
              key={crop.cropId}
              className="p-3.5 rounded-xl bg-[#f9f9ff] border border-slate-200/60 flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    idx === 0 ? 'bg-[#d3ffd5] text-[#00652c]' : 'bg-[#ffdcc3] text-[#6e3900]'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-[#111c2d] truncate">
                    Plot {String.fromCharCode(65 + idx)} • {crop.cropName} ({crop.area} Ac)
                  </span>
                  <span className="text-[11px] text-slate-500">{crop.growthStage} Stage</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`font-headline font-extrabold text-sm ${
                    crop.healthScore >= 80 ? 'text-[#00652c]' : 'text-[#904d00]'
                  }`}
                >
                  {crop.healthScore}%
                </span>
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    crop.healthScore >= 80 ? 'text-[#00652c]' : 'text-[#904d00]'
                  }`}
                >
                  {crop.healthScore >= 80 ? 'check_circle' : 'priority_high'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Irrigation Action of the Day matching Stitch Image 5 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#005b8c] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Automated Precision Drip</span>
              <h3 className="font-headline font-bold text-sm text-[#111c2d]">Irrigation Action of the Day</h3>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dee8ff] text-[#00652c]">
            Scheduled
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#f0f3ff] space-y-1.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500">Next Smart Cycle</span>
              <p className="font-headline font-bold text-base text-[#111c2d]">Today at 5:30 PM</p>
            </div>
            <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[#0075b1] text-xs font-bold shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>45 mins drip</span>
            </div>
          </div>
          <p className="text-xs text-[#00652c] font-medium flex items-center gap-1 pt-1">
            <span className="material-symbols-outlined text-[16px]">energy_savings_leaf</span>
            <span>Saves ~320L water based on rain forecast modeling</span>
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onNavigate('/irrigation')}
            className="flex-1 py-3 px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>Run Cycle Early</span>
          </button>
          <button
            onClick={() => onNavigate('/irrigation')}
            className="p-3 rounded-xl bg-[#dee8ff] text-[#111c2d] flex items-center justify-center"
            title="Configure Schedule"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </div>

      {/* AI Daily Agronomy Directive matching Stitch Image 5 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#d3ffd5] text-[#00652c] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">psychology</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#00652c] uppercase tracking-wider">AgriSense Agent</span>
            <h3 className="font-headline font-bold text-sm text-[#111c2d]">Daily Agronomy Directive</h3>
          </div>
        </div>

        <div className="p-3.5 bg-[#f0f3ff] rounded-xl space-y-2">
          <p className="text-xs text-[#111c2d] leading-relaxed">
            "Apply <strong className="text-[#00652c]">Neem oil 3ml/L spray</strong> to boundary plants before sunset to prevent whitefly vector migration triggered by low wind speeds."
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
            <span className="text-slate-500">
              Recommended window: <strong>5:00 PM - 6:30 PM</strong>
            </span>
            <button
              onClick={() => onNavigate('/ai-assistant')}
              className="text-[#00652c] font-bold flex items-center gap-0.5 hover:underline"
            >
              <span>Ask Agent</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Crop Diagnostics List matching Stitch Image 5 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Recent Crop Diagnostics
          </span>
          <button
            onClick={() => onNavigate('/crop-analysis')}
            className="text-xs font-bold text-[#00652c] hover:underline flex items-center gap-0.5"
          >
            <span>View All ({recentAnalyses.length})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {recentAnalyses.map((item) => (
            <div
              key={item.analysisId}
              onClick={() => onOpenAnalysis(item.analysisId)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-3 cursor-pointer hover:border-[#00652c]/50 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img src={item.imagePath} alt={item.cropName} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-1 left-1 px-1 rounded text-[8px] font-bold text-white ${
                      item.severity === 'LOW' ? 'bg-[#15803d]' : 'bg-[#ba1a1a]'
                    }`}
                  >
                    {item.severity === 'LOW' ? 'SAFE' : 'ALERT'}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-xs text-[#111c2d] truncate">{item.cropName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold mt-0.5 ${
                      item.severity === 'LOW' ? 'text-[#00652c]' : 'text-[#904d00]'
                    }`}
                  >
                    {item.possibleDisease}
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>
                      Confidence: <strong>{item.confidence}%</strong>
                    </span>
                    <span>•</span>
                    <span
                      className={`font-semibold ${
                        item.severity === 'LOW' ? 'text-[#00652c]' : 'text-[#904d00]'
                      }`}
                    >
                      Severity: {item.severity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 bg-[#f0f3ff] p-2.5 rounded-xl">
                <span className="text-xs text-slate-600 truncate">
                  {item.recommendations?.bioOrganicRemedy ? 'Bio-Organic Remedy Ready' : 'Optimal vegetative stage'}
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#fe932c] text-[#663500] font-bold text-xs flex items-center gap-1">
                  <span>View RX</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
