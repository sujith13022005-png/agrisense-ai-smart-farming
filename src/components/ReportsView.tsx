import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Farm, Crop, CropAnalysis } from '../types/index.ts';

interface ReportsViewProps {
  farms: Farm[];
  crops: Crop[];
  analyses: CropAnalysis[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  farms,
  crops,
  analyses,
}) => {
  const { user } = useAuth();

  const handlePrint = (title: string) => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] text-[#904d00] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-[#111c2d]">
              Field Health & Agronomy Reports
            </h2>
            <p className="text-xs text-slate-500">
              Download and print standardized field diagnosis certificates for Krishi Vigyan Kendra (KVK) consultation
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report 1: Weekly Field Pathology Audit */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#00652c] uppercase tracking-wider">Audit Dossier</span>
              <h3 className="font-headline font-bold text-sm text-[#111c2d] mt-0.5">
                Weekly Crop Pathology Audit
              </h3>
            </div>
            <span className="bg-[#dee8ff] text-[#00652c] px-2 py-0.5 rounded text-[10px] font-bold">
              PDF Ready
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Consolidated record of all {analyses.length} leaf lesions scanned across GreenValley Farm plots with bio-spray logs.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()}</span>
            <button
              onClick={() => handlePrint('Weekly Pathology Audit')}
              className="px-3.5 py-1.5 rounded-xl bg-[#00652c] text-white text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Generate PDF</span>
            </button>
          </div>
        </div>

        {/* Report 2: Water & Precision Irrigation Certificate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#005b8c] uppercase tracking-wider">Resource Report</span>
              <h3 className="font-headline font-bold text-sm text-[#111c2d] mt-0.5">
                Water Conservation & Drip Log
              </h3>
            </div>
            <span className="bg-[#dee8ff] text-[#005b8c] px-2 py-0.5 rounded text-[10px] font-bold">
              IoT Certified
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Volumetric moisture records, estimated 320L daily conservation, and tensiometer calibration indices.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()}</span>
            <button
              onClick={() => handlePrint('Water Conservation Report')}
              className="px-3.5 py-1.5 rounded-xl bg-[#005b8c] text-white text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Generate PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
