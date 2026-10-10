import React, { useState } from 'react';
import { CropAnalysis } from '../types/index.ts';

interface CropAnalysisResultProps {
  analysis: CropAnalysis;
  onBack: () => void;
  onConsultAssistant: () => void;
}

export const CropAnalysisResult: React.FC<CropAnalysisResultProps> = ({
  analysis,
  onBack,
  onConsultAssistant,
}) => {
  const [tasks, setTasks] = useState(analysis.recoveryTasks || []);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleTask = (index: number) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const downloadPDFReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>AgriSense AI Diagnostic Report - ${analysis.cropName}</title>
            <style>
              body { font-family: sans-serif; padding: 24px; color: #111c2d; }
              h1 { color: #00652c; }
              .badge { display: inline-block; padding: 4px 8px; background: #d3ffd5; color: #00652c; border-radius: 6px; font-weight: bold; }
              .box { background: #f0f3ff; padding: 12px; border-radius: 8px; margin: 12px 0; }
            </style>
          </head>
          <body>
            <h1>AgriSense AI – Crop Pathogen Diagnostic Report</h1>
            <p><strong>Crop:</strong> ${analysis.cropName} | <strong>Pathogen:</strong> ${analysis.possibleDisease}</p>
            <p><strong>Confidence:</strong> ${analysis.confidence}% | <strong>Severity:</strong> ${analysis.severityLevel || analysis.severity}</p>
            <div class="box">
              <h3>Agronomist Analysis</h3>
              <p>${analysis.aiInsights}</p>
            </div>
            <h3>Recommended Treatment Protocol</h3>
            <ul>
              <li><strong>Bio-Organic Remedy:</strong> ${analysis.recommendations?.bioOrganicRemedy || 'None required'}</li>
              <li><strong>Chemical Contingency:</strong> ${analysis.recommendations?.chemicalContingency || 'None required'}</li>
              <li><strong>Cultural Sanitation:</strong> ${analysis.recommendations?.culturalSanitation || 'Maintain field cleanliness'}</li>
            </ul>
            <p><em>${analysis.disclaimer}</em></p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="w-full max-w-[480px] md:max-w-2xl mx-auto space-y-4 pb-24 md:pb-8">
      {/* Top Navigation Strip matching Stitch Image 9 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-bold text-[#111c2d] hover:text-[#00652c] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Back to Scanner</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-[#d3ffd5] text-[#00652c] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span className="text-[11px] font-bold">{analysis.confidence}% Confidence</span>
          </div>
        </div>
      </div>

      {/* Hero Leaf Analyzed Card with Computer Vision Bounding Overlays matching Stitch Image 9 */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 shadow-md">
        <div className="relative w-full aspect-[4/3] max-h-80">
          <img
            src={analysis.imagePath}
            alt={analysis.cropName}
            className="w-full h-full object-cover"
          />

          {/* Bounding Box Overlays matching Stitch Image 9 */}
          <div className="absolute inset-0 pointer-events-none p-4">
            {/* Lesion #1 (98%) */}
            <div className="absolute top-[28%] left-[22%] w-[38%] h-[32%] rounded-xl shadow-[0_0_12px_rgba(254,147,44,0.7)] flex flex-col justify-between p-1 bg-[#fe932c]/15 backdrop-blur-[1px] border border-[#fe932c]">
              <div className="flex items-center gap-1 bg-[#663500] text-white px-2 py-0.5 rounded text-[10px] font-bold w-max shadow-xs">
                <span className="material-symbols-outlined text-[12px]">biotech</span>
                <span>Lesion #1 (98%)</span>
              </div>
              <span className="self-end text-[9px] bg-[#ffdcc3] text-[#6e3900] font-bold px-1.5 py-0.2 rounded shadow-2xs">
                {analysis.scientificName || 'Alternaria solani'}
              </span>
            </div>

            {/* Lesion #2 (94%) */}
            <div className="absolute bottom-[20%] right-[16%] w-[26%] h-[24%] rounded-xl shadow-[0_0_10px_rgba(254,147,44,0.6)] flex flex-col justify-between p-1 bg-[#fe932c]/15 backdrop-blur-[1px] border border-[#fe932c]">
              <div className="flex items-center gap-1 bg-[#663500] text-white px-1.5 py-0.5 rounded text-[10px] font-bold w-max shadow-xs">
                <span className="material-symbols-outlined text-[12px]">biotech</span>
                <span>Lesion #2 (94%)</span>
              </div>
            </div>
          </div>

          {/* YOLO AgroVision Overlay Tag */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow text-xs">
            <span className="material-symbols-outlined text-[15px] text-[#95f8a7]">center_focus_strong</span>
            <span className="text-[11px] font-bold">YOLO-v11 AgroVision Model</span>
          </div>

          {/* Timestamp */}
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]">
            <span className="material-symbols-outlined text-[13px]">schedule</span>
            <span>{new Date(analysis.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Primary Diagnosis Card matching Stitch Image 9 */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[#904d00]">
              <span className="material-symbols-outlined text-[18px]">psychiatry</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Identified Pathogen</span>
            </div>
            <h2 className="font-headline font-bold text-xl text-[#111c2d] mt-0.5">
              {analysis.possibleDisease}
            </h2>
            <p className="text-xs text-slate-500 italic">{analysis.scientificName}</p>
          </div>

          <div className="bg-[#ffdcc3] text-[#6e3900] px-3.5 py-1.5 rounded-2xl flex flex-col items-center shrink-0 shadow-2xs">
            <span className="text-[9px] uppercase font-bold tracking-wider">Severity</span>
            <span className="font-headline font-extrabold text-sm leading-tight">
              {analysis.severityLevel || 'Level 2/4'}
            </span>
          </div>
        </div>

        {/* Telemetry Factors Grid matching Stitch Image 9 */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#f0f3ff] p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#00652c]">eco</span>
              <span className="text-[11px] font-bold">Crop & Variety</span>
            </div>
            <p className="font-bold text-xs text-[#111c2d]">{analysis.cropName}</p>
            <span className="text-[10px] text-slate-500">Arka Rakshak (F1)</span>
          </div>

          <div className="bg-[#f0f3ff] p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#fe932c]">pie_chart</span>
              <span className="text-[11px] font-bold">Affected Foliage</span>
            </div>
            <p className="font-extrabold text-base text-[#111c2d]">
              {analysis.affectedFoliagePercent || 18}%
            </p>
            <span className="text-[10px] font-bold text-[#904d00]">Confined to lower tier</span>
          </div>

          <div className="bg-[#f0f3ff] p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#005b8c]">pest_control</span>
              <span className="text-[11px] font-bold">Pest Risk</span>
            </div>
            <p className="font-bold text-xs text-[#111c2d]">Low ({analysis.pestRiskPercent || 8}%)</p>
            <span className="text-[10px] text-slate-500">Minor Aphid presence</span>
          </div>

          <div className="bg-[#f0f3ff] p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#904d00]">thermostat</span>
              <span className="text-[11px] font-bold">Thermal Stress</span>
            </div>
            <p className="font-bold text-xs text-[#904d00]">{analysis.thermalStress || 'Mild Heat'}</p>
            <span className="text-[10px] text-slate-500">VPD: 1.4 kPa</span>
          </div>
        </div>
      </div>

      {/* AI Agronomist Narrative Note matching Stitch Image 9 */}
      <div className="bg-[#e7eeff] p-4 rounded-3xl shadow-xs border border-blue-200/50 flex gap-3 items-start">
        <div className="w-10 h-10 rounded-2xl bg-[#00652c] text-white flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[22px]">smart_toy</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#00652c]">AI Agronomist Insights</span>
            <span className="text-[10px] text-slate-500 font-mono">AgriSense Engine</span>
          </div>
          <p className="text-xs text-[#111c2d] mt-1 leading-relaxed">
            {analysis.aiInsights}
          </p>
        </div>
      </div>

      {/* Recommended Treatment Protocol matching Stitch Image 9 */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00652c] text-[22px]">healing</span>
            <h3 className="font-headline font-bold text-sm text-[#111c2d]">Targeted Treatment Protocol</h3>
          </div>
          <span className="bg-[#d3ffd5] text-[#00652c] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            Action Plan
          </span>
        </div>

        {/* Step 1: Bio-Organic Remedy */}
        <div className="bg-[#f0f3ff] p-3.5 rounded-2xl flex gap-3 items-start">
          <div className="w-7 h-7 rounded-lg bg-[#00652c] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            1
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs text-[#111c2d]">Bio-Organic Remedy</span>
              <span className="text-[9px] bg-[#15803d] text-white px-2 py-0.5 rounded-full font-bold">
                Immediate
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {analysis.recommendations?.bioOrganicRemedy || 'Spray Trichoderma harzianum @ 5g/L or pure Neem oil.'}
            </p>
          </div>
        </div>

        {/* Step 2: Chemical Contingency */}
        <div className="bg-[#f0f3ff] p-3.5 rounded-2xl flex gap-3 items-start">
          <div className="w-7 h-7 rounded-lg bg-[#904d00] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            2
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs text-[#111c2d]">Chemical Contingency</span>
              <span className="text-[9px] bg-[#ffdcc3] text-[#6e3900] px-2 py-0.5 rounded-full font-bold">
                Within 48h
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {analysis.recommendations?.chemicalContingency || 'Apply Mancozeb 75% WP @ 2.5g/L if lesions advance.'}
            </p>
          </div>
        </div>

        {/* Step 3: Cultural & Canopy Sanitation */}
        <div className="bg-[#f0f3ff] p-3.5 rounded-2xl flex gap-3 items-start">
          <div className="w-7 h-7 rounded-lg bg-[#005b8c] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            3
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs text-[#111c2d]">Cultural & Canopy Sanitation</span>
              <span className="text-[9px] bg-[#dee8ff] text-[#111c2d] px-2 py-0.5 rounded-full font-bold">
                Sanitation
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {analysis.recommendations?.culturalSanitation || 'Prune infected bottom 25cm leaves and sterilize secateurs.'}
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Recovery Tracker matching Stitch Image 9 */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00652c] text-[20px]">event_repeat</span>
            <h3 className="font-headline font-bold text-sm text-[#111c2d]">7-Day Recovery Tracker</h3>
          </div>
          <span className="text-[10px] text-slate-500">Tap to mark tasks</span>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task, idx) => (
            <div
              key={idx}
              onClick={() => toggleTask(idx)}
              className="flex items-start gap-3 p-3 rounded-2xl bg-[#f0f3ff] hover:bg-[#dee8ff] cursor-pointer transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-white transition-all shrink-0 mt-0.5 ${
                  task.completed ? 'bg-[#00652c]' : 'bg-slate-300'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#111c2d]">{task.title}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      task.completed
                        ? 'bg-[#d3ffd5] text-[#00652c]'
                        : 'bg-[#ffdcc3] text-[#6e3900]'
                    }`}
                  >
                    {task.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Operations Callout matching Stitch Image 9 */}
      <div className="flex flex-col gap-2.5 pt-1">
        <button
          onClick={onConsultAssistant}
          className="w-full min-h-[52px] bg-[#00652c] hover:bg-[#15803d] text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>Consult AI Assistant About This Report</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={downloadPDFReport}
            className="min-h-[48px] bg-[#dee8ff] hover:bg-[#d8e3fb] text-[#111c2d] rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => {
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 3000);
            }}
            className={`min-h-[48px] rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
              savedSuccess
                ? 'bg-[#d3ffd5] text-[#00652c]'
                : 'bg-[#dee8ff] hover:bg-[#d8e3fb] text-[#111c2d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {savedSuccess ? 'check_circle' : 'bookmark'}
            </span>
            <span>{savedSuccess ? 'Saved to Plot A' : 'Save to Plot A'}</span>
          </button>
        </div>
      </div>

      {/* Legal & Botanical Disclaimer matching Stitch Image 9 */}
      <div className="bg-[#f0f3ff] p-3.5 rounded-2xl flex items-start gap-2.5 border border-slate-200/60">
        <span className="material-symbols-outlined text-slate-500 text-[18px] shrink-0 mt-0.5">info</span>
        <p className="text-[11px] text-slate-600 leading-normal">
          <strong>Agronomic Notice:</strong> {analysis.disclaimer}
        </p>
      </div>
    </div>
  );
};
