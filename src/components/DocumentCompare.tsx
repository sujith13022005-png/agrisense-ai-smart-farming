import React, { useState } from 'react';
import {
  GitCompare,
  Plus,
  Minus,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { DocumentModel, ComparisonResult } from '../types/index.ts';

interface DocumentCompareProps {
  documents: DocumentModel[];
}

export const DocumentCompare: React.FC<DocumentCompareProps> = ({ documents }) => {
  const [docAId, setDocAId] = useState<string>(documents[0]?.id || '');
  const [docBId, setDocBId] = useState<string>(documents[1]?.id || documents[0]?.id || '');
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!docAId || !docBId) {
      setErrorMsg('Please select two documents to compare.');
      return;
    }
    if (docAId === docBId) {
      setErrorMsg('Please select two distinct documents.');
      return;
    }

    setComparing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/documents/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docAId, docBId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Comparison failed');
      setResult(data.comparison);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while comparing documents.');
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-slate-900">
              Document Comparison Engine
            </h2>
            <p className="text-xs text-slate-500">
              Select two documents to evaluate clause variations, additions, removed text, and amount shifts
            </p>
          </div>
        </div>
      </div>

      {/* Selectors Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Document A (Base Document)
            </label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            >
              <option value="">Select Document A...</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fileName} ({d.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Document B (Revised / Second Document)
            </label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            >
              <option value="">Select Document B...</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fileName} ({d.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
            {errorMsg}
          </p>
        )}

        <button
          onClick={handleCompare}
          disabled={comparing || !docAId || !docBId || docAId === docBId}
          className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {comparing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Differences with Gemini AI...</span>
            </>
          ) : (
            <>
              <GitCompare className="w-4 h-4" />
              <span>Compare Documents</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Results */}
      {result && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Comparison Assessment
            </span>
            <p className="text-sm font-semibold text-slate-900 mt-1 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Key Differences Overview */}
          {result.importantDifferences && result.importantDifferences.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Important Variations</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.importantDifferences.map((diff, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-800 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <span>{diff}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Added and Removed Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Added in Document B */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Added in Document B</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result.addedInformation && result.addedInformation.length > 0 ? (
                  result.addedInformation.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No significant additions noted.</li>
                )}
              </ul>
            </div>

            {/* Removed from Document A */}
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 space-y-2">
              <span className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <Minus className="w-4 h-4 text-red-700" />
                <span>Removed from Document A</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result.removedInformation && result.removedInformation.length > 0 ? (
                  result.removedInformation.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-700 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No significant omissions detected.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Value Changes (Dates, Amounts, Terms) */}
          {result.changedAmounts && result.changedAmounts.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>Financial Value Changes</span>
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {result.changedAmounts.map((amt, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 flex items-center justify-between text-xs text-slate-800"
                  >
                    <span className="font-medium">{amt.item}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="line-through text-red-500">{amt.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-emerald-700">{amt.to}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
