import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { CropAnalysis } from '../types/index.ts';

interface CropDiagnosticScannerProps {
  onAnalysisComplete: (analysis: CropAnalysis) => void;
  onOpenAnalysis: (id: string) => void;
  recentAnalyses: CropAnalysis[];
}

export const CropDiagnosticScanner: React.FC<CropDiagnosticScannerProps> = ({
  onAnalysisComplete,
  onOpenAnalysis,
  recentAnalyses,
}) => {
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [growthStage, setGrowthStage] = useState('Flowering');
  const [symptoms, setSymptoms] = useState<string[]>(['Yellowing leaves', 'Brown spots']);
  const [fieldNotes, setFieldNotes] = useState('Circular concentric rings on lower leaves, spread over 3 days.');
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1592417817098-8f3d6910a552?w=800&auto=format&fit=crop&q=80'
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Uploading image...');

  const crops = ['Tomato', 'Paddy', 'Chilli', 'Cotton', 'Maize'];
  const stages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting/Harvest'];
  const availableSymptoms = [
    'Yellowing leaves',
    'Brown spots',
    'Wilting',
    'White powdery coating',
    'Leaf curl',
  ];

  const toggleSymptom = (s: string) => {
    if (symptoms.includes(s)) {
      setSymptoms(symptoms.filter((x) => x !== s));
    } else {
      setSymptoms([...symptoms, s]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const steps = [
      'Uploading image...',
      'Processing image with AgroVision...',
      'Analyzing crop pathogen with Gemini...',
      'Checking visible symptoms...',
      'Generating targeted treatment RX...',
      'Preparing report...',
    ];

    let i = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setLoadingStep(steps[i]);
      }
    }, 800);

    try {
      const res = await fetch('/api/crop-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userId || 'farmer_rajesh_01',
          imageBase64: imagePreview,
          cropType: selectedCrop,
          growthStage,
          symptoms,
          notes: fieldNotes,
        }),
      });

      const data = await res.json();
      clearInterval(interval);
      if (!res.ok) throw new Error(data.error || 'Diagnostic failed');

      onAnalysisComplete(data.analysis);
    } catch (err: any) {
      clearInterval(interval);
      alert('Error during diagnosis: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] md:max-w-2xl mx-auto space-y-4 pb-24 md:pb-8">
      {/* Header matching Stitch Image 7 */}
      <div className="flex flex-col gap-1 mt-1 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00652c] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#00652c] tracking-wider uppercase">
              Field Vision AI v4.2
            </span>
          </div>
          <div className="bg-[#dee8ff] px-2.5 py-0.5 rounded-full">
            <span className="text-[10px] text-slate-600 font-semibold">Step 1 of 2: Capture & Crop Details</span>
          </div>
        </div>
        <h1 className="font-headline font-bold text-xl text-[#111c2d] tracking-tight">
          AI Crop Diagnostic Scanner
        </h1>
        <p className="text-xs text-slate-600">
          Capture leaf lesions, select growth stage, and detect pathogenic stress instantly.
        </p>
      </div>

      {/* Camera Capture Card matching Stitch Image 7 */}
      <div className="w-full bg-[#f0f3ff] rounded-2xl p-3 shadow-xs border border-slate-200/80 relative overflow-hidden">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 shadow-inner group">
          <img
            src={imagePreview}
            alt="Leaf macro scan preview"
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

          {/* Locked Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <span className="material-symbols-outlined text-[#00652c] text-[18px]">check_circle</span>
            <span className="text-xs font-bold text-[#111c2d]">Macro Focus Locked</span>
          </div>

          <div className="absolute top-3 right-3 bg-[#fe932c] text-[#663500] px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-xs">
            <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
            <span>Daylight OK</span>
          </div>

          {/* Center Targeting Bracket Overlay */}
          <div className="absolute inset-8 pointer-events-none flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-6 h-6 border-l-2 border-t-2 border-[#95f8a7] rounded-tl-sm"></div>
              <div className="w-6 h-6 border-r-2 border-t-2 border-[#95f8a7] rounded-tr-sm"></div>
            </div>
            <div className="self-center bg-[#15803d]/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">center_focus_strong</span>
              <span>Target Leaf Center</span>
            </div>
            <div className="flex justify-between">
              <div className="w-6 h-6 border-l-2 border-b-2 border-[#95f8a7] rounded-bl-sm"></div>
              <div className="w-6 h-6 border-r-2 border-b-2 border-[#95f8a7] rounded-br-sm"></div>
            </div>
          </div>

          {/* Bottom metadata overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>IMG_7402_LeafMacro.raw</span>
            </div>
            <span className="bg-black/50 px-2 py-0.5 rounded text-[11px] font-mono">12.4 MP</span>
          </div>
        </div>

        {/* Action triggers: Take Photo & From Gallery */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <label className="h-12 bg-[#00652c] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            <span>Take Photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <label className="h-12 bg-[#dee8ff] hover:bg-[#d8e3fb] text-[#111c2d] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">photo_library</span>
            <span>From Gallery</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <div className="mt-3 bg-[#ffdcc3]/60 text-[#6e3900] p-2.5 rounded-xl flex items-center gap-2 border border-[#ffdcc3]">
          <span className="material-symbols-outlined text-[#904d00] text-[20px] shrink-0">lightbulb</span>
          <p className="text-[11px] font-semibold leading-snug">
            Tip: Hold camera 15–20cm from affected leaf in clear natural daylight for &gt;99% AI diagnostic accuracy.
          </p>
        </div>
      </div>

      {/* Form Details matching Stitch Image 7 */}
      <div className="space-y-3">
        {/* 1. Crop Type */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#111c2d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00652c] text-[18px]">psychiatry</span>
              <span>1. Crop Type</span>
            </label>
            <span className="text-[10px] text-[#00652c] font-bold">Autodetected</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {crops.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCrop(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedCrop === c
                    ? 'bg-[#15803d] text-white shadow-xs'
                    : 'bg-[#dee8ff] text-[#111c2d] hover:bg-[#d8e3fb]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Growth Stage */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
          <label className="text-xs font-bold text-[#111c2d] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00652c] text-[18px]">calendar_month</span>
            <span>2. Growth Stage</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {stages.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setGrowthStage(st)}
                className={`p-2.5 rounded-xl flex items-center gap-2 text-left text-xs font-semibold transition-all ${
                  growthStage === st
                    ? 'bg-[#15803d] text-white shadow-xs font-bold'
                    : 'bg-[#f0f3ff] text-slate-700 hover:bg-[#dee8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {st === 'Flowering' ? 'local_florist' : st === 'Seedling' ? 'spoke' : 'grass'}
                </span>
                <span>{st}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Observed Symptoms */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
          <label className="text-xs font-bold text-[#111c2d] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00652c] text-[18px]">coronavirus</span>
            <span>3. Observed Symptoms</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableSymptoms.map((sym) => {
              const active = symptoms.includes(sym);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                    active
                      ? 'bg-[#ffdad6] text-[#93000a]'
                      : 'bg-[#dee8ff] text-slate-700 hover:bg-[#d8e3fb]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {active ? 'check' : 'add'}
                  </span>
                  <span>{sym}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-1">
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Field Operator Notes
            </label>
            <textarea
              value={fieldNotes}
              onChange={(e) => setFieldNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#f0f3ff] rounded-xl p-2.5 text-xs text-[#111c2d] focus:outline-none resize-none border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Primary Action Button: Analyze with AgriSense AI */}
      <div className="pt-2">
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="w-full h-14 bg-[#00652c] hover:bg-[#15803d] text-white rounded-2xl font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(0,101,44,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <span className="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
              <span>{loadingStep}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[24px] text-[#95f8a7]">bolt</span>
              <span>Analyze with AgriSense AI</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-normal">~2 sec</span>
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-slate-500 text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-[#00652c]">security</span>
          <span>Offline sync enabled • Cloud Model v2026.10</span>
        </div>
      </div>

      {/* Recent Diagnostic Scans List matching Stitch Image 7 */}
      <div className="pt-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-headline font-bold text-sm text-[#111c2d]">Recent Diagnostic Scans</h2>
          <span className="text-xs font-bold text-[#00652c]">
            {recentAnalyses.length} Scans
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {recentAnalyses.map((scan) => (
            <div
              key={scan.analysisId}
              onClick={() => onOpenAnalysis(scan.analysisId)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#00652c] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden shrink-0">
                  <img src={scan.imagePath} alt={scan.cropName} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-bold text-xs text-[#111c2d] truncate">{scan.possibleDisease}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 rounded ${
                        scan.severity === 'LOW'
                          ? 'bg-[#d3ffd5] text-[#00652c]'
                          : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      {scan.confidence}% match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {scan.cropName} • {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
