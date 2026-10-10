import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Farm, Crop } from '../types/index.ts';

interface FarmCropManagerProps {
  farms: Farm[];
  crops: Crop[];
  onAddFarm: (farm: Partial<Farm>) => Promise<void>;
  onAddCrop: (crop: Partial<Crop>) => Promise<void>;
  onDeleteFarm: (id: string) => Promise<void>;
}

export const FarmCropManager: React.FC<FarmCropManagerProps> = ({
  farms,
  crops,
  onAddFarm,
  onAddCrop,
  onDeleteFarm,
}) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'farms' | 'crops'>('farms');
  const [isAddingFarm, setIsAddingFarm] = useState(false);
  const [isAddingCrop, setIsAddingCrop] = useState(false);

  // New farm state
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('Tirunelveli, Tamil Nadu');
  const [area, setArea] = useState('10.0');
  const [soilType, setSoilType] = useState<any>('Loamy');
  const [irrigationType, setIrrigationType] = useState<any>('Drip');
  const [primaryCrop, setPrimaryCrop] = useState('Tomato');

  // New crop state
  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('Arka Rakshak (F1)');
  const [cropArea, setCropArea] = useState('5.0');
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.farmId || '');
  const [growthStage, setGrowthStage] = useState<any>('Vegetative');

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) return;
    await onAddFarm({
      userId: user?.userId,
      farmName,
      location,
      area: parseFloat(area),
      soilType,
      irrigationType,
      primaryCrop,
    });
    setFarmName('');
    setIsAddingFarm(false);
  };

  const handleCreateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim() || !selectedFarmId) return;
    await onAddCrop({
      userId: user?.userId,
      farmId: selectedFarmId,
      cropName,
      variety,
      area: parseFloat(cropArea),
      growthStage,
    });
    setIsAddingCrop(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-bold text-lg text-[#111c2d]">
            Farm & Plot Management
          </h2>
          <p className="text-xs text-slate-500">
            Define GPS plots, soil conditions, and track individual crop lifecycles
          </p>
        </div>

        {/* Segmented Switcher */}
        <div className="flex items-center bg-[#dee8ff] p-1 rounded-2xl">
          <button
            onClick={() => setTab('farms')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'farms' ? 'bg-white text-[#00652c] shadow-xs' : 'text-slate-600'
            }`}
          >
            Farms ({farms.length})
          </button>
          <button
            onClick={() => setTab('crops')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'crops' ? 'bg-white text-[#00652c] shadow-xs' : 'text-slate-600'
            }`}
          >
            Crops ({crops.length})
          </button>
        </div>
      </div>

      {tab === 'farms' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Registered Farms
            </span>
            <button
              onClick={() => setIsAddingFarm(!isAddingFarm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00652c] text-white text-xs font-bold shadow-xs hover:bg-[#15803d]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Farm</span>
            </button>
          </div>

          {isAddingFarm && (
            <form
              onSubmit={handleCreateFarm}
              className="bg-white p-5 rounded-3xl border border-[#00652c]/30 shadow-xs space-y-4"
            >
              <h3 className="font-headline font-bold text-sm text-[#111c2d]">Add New Farm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Farm Name</label>
                  <input
                    type="text"
                    required
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. GreenValley East Plot"
                    className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Soil Type</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as any)}
                    className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Loamy">Loamy</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Red Soil">Red Soil</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingFarm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00652c] text-white text-xs font-bold"
                >
                  Save Farm
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farms.map((farm) => (
              <div
                key={farm.farmId}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#d3ffd5] text-[#00652c] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">fence</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-sm text-[#111c2d]">{farm.farmName}</h4>
                      <p className="text-[11px] text-slate-500">📍 {farm.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteFarm(farm.farmId)}
                    className="p-1 text-slate-400 hover:text-red-600"
                    title="Delete Farm"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-[#f0f3ff] rounded-2xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Area</span>
                    <strong className="text-[#111c2d]">{farm.area} Ac</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Soil</span>
                    <strong className="text-[#111c2d]">{farm.soilType}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Irrigation</span>
                    <strong className="text-[#00652c]">{farm.irrigationType}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Monitored Crops
            </span>
            <button
              onClick={() => setIsAddingCrop(!isAddingCrop)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00652c] text-white text-xs font-bold shadow-xs hover:bg-[#15803d]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Crop</span>
            </button>
          </div>

          {isAddingCrop && (
            <form
              onSubmit={handleCreateCrop}
              className="bg-white p-5 rounded-3xl border border-[#00652c]/30 shadow-xs space-y-4"
            >
              <h3 className="font-headline font-bold text-sm text-[#111c2d]">Add New Crop</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Farm</label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(e.target.value)}
                    className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200"
                  >
                    {farms.map((f) => (
                      <option key={f.farmId} value={f.farmId}>{f.farmName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Tomato or Paddy"
                    className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Variety</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Growth Stage</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as any)}
                    className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Seedling">Seedling</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting/Harvest">Fruiting/Harvest</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCrop(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00652c] text-white text-xs font-bold"
                >
                  Save Crop
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crops.map((crop) => (
              <div
                key={crop.cropId}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#dee8ff] text-[#00652c] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">grass</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-sm text-[#111c2d]">{crop.cropName}</h4>
                      <p className="text-[11px] text-slate-500">{crop.variety}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      crop.status === 'Healthy'
                        ? 'bg-[#d3ffd5] text-[#00652c]'
                        : 'bg-[#ffdcc3] text-[#6e3900]'
                    }`}
                  >
                    {crop.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-[#f0f3ff] rounded-2xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Growth Stage</span>
                    <strong className="text-[#111c2d]">{crop.growthStage}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Area</span>
                    <strong className="text-[#111c2d]">{crop.area} Ac</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Health Score</span>
                    <strong className="text-[#00652c]">{crop.healthScore}/100</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
