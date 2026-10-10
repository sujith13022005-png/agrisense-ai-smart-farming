import React from 'react';
import { FarmAlert } from '../types/index.ts';

interface AlertsManagerProps {
  alerts: FarmAlert[];
  onMarkRead: (id: string) => void;
  onOpenAnalysis?: (crop: string) => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({ alerts, onMarkRead, onOpenAnalysis }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] text-[#6e3900] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-[#111c2d]">
              Field Alerts & Pest Warnings
            </h2>
            <p className="text-xs text-slate-500">
              Immediate notifications on pathogen spread, microclimate thermal spikes, and scheduled drip
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alt) => (
            <div
              key={alt.alertId}
              className={`bg-white p-4.5 rounded-3xl border shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alt.severity === 'HIGH' || alt.severity === 'CRITICAL'
                  ? 'border-[#fe932c]/50 bg-[#ffdcc3]/10'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    alt.severity === 'HIGH' || alt.severity === 'CRITICAL'
                      ? 'bg-[#fe932c] text-[#663500]'
                      : 'bg-[#cce5ff] text-[#005b8c]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {alt.type === 'Disease' ? 'coronavirus' : alt.type === 'Irrigation' ? 'water_drop' : 'warning'}
                  </span>
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#111c2d] truncate">{alt.title}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                        alt.severity === 'HIGH' || alt.severity === 'CRITICAL'
                          ? 'bg-[#ffdcc3] text-[#6e3900]'
                          : 'bg-[#dee8ff] text-[#00652c]'
                      }`}
                    >
                      {alt.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{alt.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {new Date(alt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Plot Level Notice
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {!alt.read && (
                  <button
                    onClick={() => onMarkRead(alt.alertId)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
            <span className="material-symbols-outlined text-slate-400 text-[36px]">notifications_paused</span>
            <h3 className="font-bold text-sm text-[#111c2d]">No Active Alerts</h3>
            <p className="text-xs text-slate-500">All plots operating within optimal biometric thresholds.</p>
          </div>
        )}
      </div>
    </div>
  );
};
