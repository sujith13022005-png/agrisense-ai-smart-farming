import React, { useState } from 'react';
import { IrrigationRecommendation, SensorReading } from '../types/index.ts';

interface IrrigationManagerProps {
  sensors: SensorReading[];
}

export const IrrigationManager: React.FC<IrrigationManagerProps> = ({ sensors }) => {
  const [crop, setCrop] = useState('Tomato (Plot A)');
  const [soilMoisture, setSoilMoisture] = useState(38);
  const [temperature, setTemperature] = useState(29);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<IrrigationRecommendation | null>({
    crop: 'Tomato',
    growthStage: 'Flowering & Fruiting Stage',
    soilMoisture: 38,
    temperature: 29,
    humidity: 68,
    status: 'Scheduled',
    nextSchedule: 'Today at 5:30 PM',
    durationMinutes: 45,
    waterSavingsLitres: 320,
    reasoning:
      'Current volumetric soil moisture (38%) is approaching lower limit (35%). Drip scheduled for early evening to minimize evaporative losses.',
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/irrigation/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop,
          soilMoisture,
          temperature,
        }),
      });
      const data = await res.json();
      if (data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#cce5ff] text-[#005b8c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">water_drop</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-[#111c2d]">
              Smart Precision Irrigation
            </h2>
            <p className="text-xs text-slate-500">
              Weather-predictive automated water scheduling & ESP32 tensiometer sync
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Controls Form (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
            <h3 className="font-headline font-bold text-sm text-[#111c2d]">Irrigation Parameters</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Crop / Plot</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Tomato (Plot A)">Plot A • Tomato (Flowering)</option>
                <option value="Chilli (Plot B)">Plot B • Chilli (Vegetative)</option>
                <option value="Paddy (Plot C)">Plot C • Paddy / Rice (Tillering)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Soil Moisture Level</span>
                <span className="text-[#00652c] font-mono">{soilMoisture}% Volumetric</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
                className="w-full accent-[#00652c]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Ambient Temperature</span>
                <span className="text-[#904d00] font-mono">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full accent-[#fe932c]"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#00652c] hover:bg-[#15803d] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>{loading ? 'Evaluating with Gemini...' : 'Recalculate Water Schedule'}</span>
            </button>
          </div>
        </div>

        {/* Live Recommendation View (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          {recommendation && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-base text-[#111c2d]">
                    Irrigation Action Directive
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d3ffd5] text-[#00652c]">
                    {recommendation.status}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {recommendation.nextSchedule}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#f0f3ff] rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Cycle Length</span>
                  <strong className="text-base text-[#111c2d]">
                    {recommendation.durationMinutes} minutes
                  </strong>
                  <span className="text-[10px] text-slate-500 block">Drip Emitter Mode</span>
                </div>
                <div className="p-3.5 bg-[#d3ffd5]/40 rounded-2xl border border-[#95f8a7]/40">
                  <span className="text-[10px] text-[#00652c] font-bold uppercase block">Estimated Savings</span>
                  <strong className="text-base text-[#00652c]">
                    ~{recommendation.waterSavingsLitres} Litres
                  </strong>
                  <span className="text-[10px] text-slate-600 block">Rain-predictive cut</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#f0f3ff] rounded-2xl text-xs space-y-1">
                <span className="font-bold text-[#111c2d] block">AI Agronomic Reasoning:</span>
                <p className="text-slate-600 leading-relaxed">{recommendation.reasoning}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => alert('Drip cycle triggered early via Automated Valve API.')}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>Run Automated Valve Early</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
