import React from 'react';
import {
  BarChart3,
  FileText,
  Sparkles,
  HardDrive,
  MessageSquare,
  PieChart,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { DocumentModel } from '../types/index.ts';

interface AnalyticsProps {
  documents: DocumentModel[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ documents }) => {
  const totalDocuments = documents.length;
  const analyzedCount = documents.filter((d) => d.status === 'COMPLETED').length;
  const totalBytes = documents.reduce((sum, d) => sum + (d.fileSize || 0), 0);
  const totalStorageMb = (totalBytes / (1024 * 1024)).toFixed(2);

  // Category counts
  const categoryMap: Record<string, number> = {};
  documents.forEach((d) => {
    categoryMap[d.category] = (categoryMap[d.category] || 0) + 1;
  });

  // Type counts
  const typeMap: Record<string, number> = {};
  documents.forEach((d) => {
    typeMap[d.fileType] = (typeMap[d.fileType] || 0) + 1;
  });

  const categories = Object.entries(categoryMap);
  const types = Object.entries(typeMap);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-slate-900">
              Platform Analytics & Storage
            </h2>
            <p className="text-xs text-slate-500">
              Live intelligence metrics, document classifications, and storage telemetry
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics matching Stitch Data Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Documents</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="font-headline font-extrabold text-2xl sm:text-3xl text-slate-900">
            {totalDocuments}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Vault Operational</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Analyzed by AI</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="font-headline font-extrabold text-2xl sm:text-3xl text-slate-900">
            {analyzedCount}
          </p>
          <span className="text-[11px] text-blue-700 font-semibold">
            {totalDocuments > 0 ? `${Math.round((analyzedCount / totalDocuments) * 100)}% coverage` : '0%'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Vault Storage</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <p className="font-headline font-extrabold text-2xl sm:text-3xl text-slate-900">
            {totalStorageMb} <span className="text-sm font-normal text-slate-400">MB</span>
          </p>
          <span className="text-[11px] text-amber-700 font-semibold">Secure client quota</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active AI Engines</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="font-headline font-extrabold text-2xl sm:text-3xl text-slate-900">
            Gemini 3.8
          </p>
          <span className="text-[11px] text-purple-700 font-semibold">Server-side proxy ready</span>
        </div>
      </div>

      {/* Visual Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-headline font-bold text-slate-900 text-sm">
            Documents by Category
          </h3>
          <div className="space-y-3">
            {categories.length > 0 ? (
              categories.map(([cat, count]) => {
                const percent = Math.round((count / (totalDocuments || 1)) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                      <span>{cat}</span>
                      <span className="font-bold">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">No categories tracked yet.</p>
            )}
          </div>
        </div>

        {/* File Type Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-headline font-bold text-slate-900 text-sm">
            Supported File Format Distribution
          </h3>
          <div className="space-y-3">
            {types.length > 0 ? (
              types.map(([type, count]) => {
                const percent = Math.round((count / (totalDocuments || 1)) * 100);
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                      <span className="uppercase font-mono">{type}</span>
                      <span className="font-bold">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">No document formats recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
