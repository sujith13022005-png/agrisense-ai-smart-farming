import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  Trash2,
  MessageSquare,
  Sparkles,
  Calendar,
  DollarSign,
  Building2,
  CheckCircle2,
  Tag,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { DocumentModel } from '../types/index.ts';

interface DocumentDetailsProps {
  document: DocumentModel;
  onBack: () => void;
  onOpenChat: (doc: DocumentModel) => void;
  onDelete: (id: string) => void;
}

export const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  document,
  onBack,
  onOpenChat,
  onDelete,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [summaryMode, setSummaryMode] = useState<string>('Detailed Summary');
  const [customSummary, setCustomSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const summaryModes = [
    'Short Summary',
    'Detailed Summary',
    'Key Points',
    'Executive Summary',
    'Study Notes',
  ];

  const handleGenerateSummary = async (mode: string) => {
    setSummaryMode(mode);
    setSummarizing(true);
    try {
      const res = await fetch(`/api/documents/${document.id}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      setCustomSummary(data.summary);
    } catch (e) {
      console.error(e);
    } finally {
      setSummarizing(false);
    }
  };

  const handleGenerateShareLink = async () => {
    try {
      const res = await fetch(`/api/documents/${document.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresInHours: 48 }),
      });
      const data = await res.json();
      const fullUrl = `${window.location.origin}${data.shareUrl}`;
      setShareLink(fullUrl);
      navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const analysis = document.extractedData;

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            ← Back
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline font-bold text-lg text-slate-900 truncate">
                {document.fileName}
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {document.category}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Uploaded on {new Date(document.createdAt).toLocaleDateString()} • {(document.fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenChat(document)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Document</span>
          </button>
          <button
            onClick={handleGenerateShareLink}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Generate Temporary Share Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this document and all associated AI chats?')) {
                onDelete(document.id);
              }
            }}
            className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {shareLink && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
          <span className="flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium truncate">Share link active (expires in 48h): {shareLink}</span>
          </span>
          <span className="font-bold text-emerald-800 shrink-0 ml-2">
            {copySuccess ? 'Copied to clipboard!' : 'Copied'}
          </span>
        </div>
      )}

      {/* Two-Panel Layout matching Stitch Document View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Document Viewer & Content Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[700px]">
            {/* Viewer Controls */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>Document Preview</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                  className="p-1 rounded hover:bg-slate-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
                  className="p-1 rounded hover:bg-slate-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content Canvas */}
            <div className="flex-1 overflow-auto p-6 bg-slate-100/60 flex items-start justify-center">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-slate-200 text-slate-800 font-serif leading-relaxed text-sm min-h-[500px] transition-transform duration-100 whitespace-pre-wrap select-text"
              >
                {document.storageUrl && document.storageUrl.startsWith('data:image') ? (
                  <img
                    src={document.storageUrl}
                    alt={document.fileName}
                    className="max-w-full rounded shadow-sm mx-auto"
                  />
                ) : (
                  <div>
                    <div className="border-b border-slate-200 pb-3 mb-4 font-sans text-xs text-slate-400 flex justify-between">
                      <span>DOCUMIND NEURAL TEXT BUFFER</span>
                      <span>PAGE 1 OF 1</span>
                    </div>
                    {document.rawText || document.summary}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: AI Analysis & Intelligence Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Summarization Engine Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-slate-900 text-sm">
                    AI Summary Engine
                  </h3>
                  <p className="text-[11px] text-slate-500">Gemini 3.8 Multi-Mode Analysis</p>
                </div>
              </div>
            </div>

            {/* Mode selection buttons */}
            <div className="flex flex-wrap gap-1.5">
              {summaryModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleGenerateSummary(mode)}
                  disabled={summarizing}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    summaryMode === mode
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Generated Summary Area */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed max-h-56 overflow-y-auto">
              {summarizing ? (
                <div className="flex items-center gap-2 py-4 justify-center text-slate-500 font-medium">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>Synthesizing {summaryMode}...</span>
                </div>
              ) : (
                customSummary || analysis?.detailedSummary || document.summary
              )}
            </div>
          </div>

          {/* Extracted Information: Entities, Dates & Financials */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-slate-900 text-sm">
              Extracted Key Metadata
            </h3>

            {/* Dates */}
            {analysis?.importantDates && analysis.importantDates.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Important Dates</span>
                </span>
                <div className="space-y-1">
                  {analysis.importantDates.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs"
                    >
                      <span className="font-medium text-slate-800">{item.event}</span>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {item.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Amounts */}
            {analysis?.amounts && analysis.amounts.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  <span>Financial Values</span>
                </span>
                <div className="space-y-1">
                  {analysis.amounts.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 text-xs border border-amber-100"
                    >
                      <span className="text-slate-700">{item.description}</span>
                      <span className="font-mono font-extrabold text-amber-900">
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Entities Identified */}
            {analysis?.entities && analysis.entities.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Entities & Organizations</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.entities.map((ent, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 text-[11px] font-semibold border border-blue-100"
                    >
                      <span>{ent.name}</span>
                      <span className="text-[9px] text-blue-500 uppercase font-mono">
                        ({ent.type})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {analysis?.actionItems && analysis.actionItems.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Action Items Detected</span>
                </span>
                <div className="space-y-1">
                  {analysis.actionItems.map((act, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      <div>
                        <p className="font-semibold">{act.task}</p>
                        {act.dueDate && (
                          <p className="text-[10px] text-emerald-700">Due: {act.dueDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
