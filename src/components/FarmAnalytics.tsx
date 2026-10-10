import React from 'react';
import { Farm, Crop, CropAnalysis, SensorReading } from '../types/index.ts';

interface AnalyticsProps {
  farms: Farm[];
  crops: Crop[];
  analyses: CropAnalysis[];
  sensors: SensorReading[];
}

export const FarmAnalytics: React.FC<AnalyticsProps> = ({
  farms,
  crops,
  analyses,
  sensors,
}) => {
  const totalAcres = farms.reduce((acc, f) => acc + (f.area || 0), 0);
  const averageHealth =
    crops.length > 0
      ? Math.round(crops.reduce((acc, c) => acc + (c.healthScore || 0), 0) / crops.length)
      : 88;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#d3ffd5] text-[#00652c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">monitoring</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-[#111c2d]">
              Farm Telemetry & Agronomy Analytics
            </h2>
            <p className="text-xs text-slate-500">
              NDVI vegetative health trends, disease progression rates, and volumetric soil water history
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Monitored Land</span>
          <p className="font-headline font-extrabold text-2xl text-[#111c2d]">{totalAcres} Ac</p>
          <span className="text-[10px] text-[#00652c] font-bold">100% Geo-mapped</span>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Average Crop Health</span>
          <p className="font-headline font-extrabold text-2xl text-[#00652c]">{averageHealth}%</p>
          <span className="text-[10px] text-[#00652c] font-bold">Optimal Range</span>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total AI Bio-Scans</span>
          <p className="font-headline font-extrabold text-2xl text-[#111c2d]">{analyses.length}</p>
          <span className="text-[10px] text-blue-700 font-bold">YOLO-v11 active</span>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Estimated Water Saved</span>
          <p className="font-headline font-extrabold text-2xl text-[#005b8c]">32%</p>
          <span className="text-[10px] text-blue-700 font-bold">Rain-predictive</span>
        </div>
      </div>

      {/* Plots Health Comparison Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-headline font-bold text-sm text-[#111c2d]">
          Plot Health Indices & NDVI Comparison
        </h3>
        <div className="space-y-3">
          {crops.map((crop) => (
            <div key={crop.cropId} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>
                  {crop.cropName} ({crop.variety}) • {crop.area} Ac
                </span>
                <span className="font-bold text-[#00652c]">{crop.healthScore}% Optimal</span>
              </div>
              <div className="w-full bg-[#dee8ff] rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#00652c] h-full rounded-full transition-all"
                  style={{ width: `${crop.healthScore}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Log History */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-headline font-bold text-sm text-[#111c2d]">
          Recent ESP32 Soil Moisture & Ambient Log
        </h3>
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {sensors.map((s) => (
            <div key={s.sensorReadingId} className="p-3.5 bg-slate-50/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00652c]">sensors</span>
                <div>
                  <strong className="text-[#111c2d]">{s.temperature}°C Ambient</strong>
                  <span className="text-slate-500 block text-[11px]">{s.humidity}% Air Humidity</span>
                </div>
              </div>
              <div className="text-right">
                <strong className="text-[#00652c] block">{s.soilMoisture}% Soil Moisture</strong>
                <span className="text-slate-400 text-[10px]">
                  {new Date(s.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
