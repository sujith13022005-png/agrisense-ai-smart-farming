import React, { useState } from 'react';
import { FertilizerRecommendation } from '../types/index.ts';

export const FertilizerManager: React.FC = () => {
  const [crop, setCrop] = useState('Tomato');
  const [growthStage, setGrowthStage] = useState('Flowering & Fruit Set');
  const [soilType, setSoilType] = useState('Loamy');
  const [area, setArea] = useState('6.5');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<FertilizerRecommendation | null>({
    crop: 'Tomato',
    growthStage: 'Flowering & Fruit Set',
    soilType: 'Loamy',
    nutrientFocus: 'Potassium & Boron Enhancement for Fruit Set',
    recommendedFertilizer: 'Water-Soluble NPK (13:0:45) + Micronutrient Mix',
    dosage: '4.5 kg / acre via drip fertigation line',
    applicationSchedule: 'Bi-weekly during active flowering cycle',
    organicAlternatives: 'Wood ash suspension + Fermented cow dung slurry (Jeevamrutha)',
    cautionNotes: 'Consult a qualified agricultural professional for field-specific fertilizer decisions.',
  });

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fertilizer/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, growthStage, soilType, area }),
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
          <div className="w-10 h-10 rounded-2xl bg-[#dee8ff] text-[#00652c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">science</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-[#111c2d]">
              Custom Fertilizer & NPK Nutrition
            </h2>
            <p className="text-xs text-slate-500">
              Balanced nutrient-dosage charts to slash input costs while maximizing yield
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
            <h3 className="font-headline font-bold text-sm text-[#111c2d]">Crop & Soil Nutrition</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Tomato">Tomato</option>
                <option value="Paddy / Rice">Paddy / Rice</option>
                <option value="Chilli">Chilli</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Growth Stage</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Seedling">Seedling</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering & Fruit Set">Flowering & Fruit Set</option>
                <option value="Maturity/Harvest">Maturity / Harvest</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Plot Area (Acres)</label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#00652c] hover:bg-[#15803d] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">calculate</span>
              <span>{loading ? 'Analyzing with NPK Engine...' : 'Calculate Fertilizer Dosage'}</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          {recommendation && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-headline font-bold text-sm text-[#111c2d]">
                  {recommendation.nutrientFocus}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dee8ff] text-[#00652c]">
                  -24% Cost Formula
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#f0f3ff] rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Recommended Formulation
                  </span>
                  <p className="font-bold text-[#111c2d] mt-0.5">{recommendation.recommendedFertilizer}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-[#f0f3ff] rounded-2xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Dosage Rate</span>
                    <p className="font-bold text-[#00652c] mt-0.5">{recommendation.dosage}</p>
                  </div>
                  <div className="p-3 bg-[#f0f3ff] rounded-2xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Schedule</span>
                    <p className="font-bold text-[#111c2d] mt-0.5">{recommendation.applicationSchedule}</p>
                  </div>
                </div>

                <div className="p-3 bg-[#d3ffd5]/40 rounded-2xl border border-[#95f8a7]/40">
                  <span className="text-[10px] text-[#00652c] font-bold uppercase block">
                    Organic / Bio-Alternatives
                  </span>
                  <p className="text-slate-700 mt-0.5">{recommendation.organicAlternatives}</p>
                </div>

                <div className="p-3 bg-[#ffdcc3]/40 rounded-2xl text-[11px] text-[#6e3900]">
                  <strong>Caution:</strong> {recommendation.cautionNotes}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
