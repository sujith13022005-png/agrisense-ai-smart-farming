import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Trash2,
  ExternalLink,
  MessageSquare,
  FileCheck,
  Tag,
  Share2,
} from 'lucide-react';
import { DocumentModel } from '../types/index.ts';

interface DocumentCardProps {
  document: DocumentModel;
  onSelect: (doc: DocumentModel) => void;
  onDelete?: (id: string) => void;
  onOpenChat?: (doc: DocumentModel) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onSelect,
  onDelete,
  onOpenChat,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'finance':
      case 'bills':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'certificates':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const formattedDate = new Date(document.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const fileSizeKb = (document.fileSize / 1024).toFixed(1);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden hover:border-emerald-300">
      <div className="p-4.5 space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
              document.category
            )}`}
          >
            {document.category}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* File Name & Format */}
        <div
          onClick={() => onSelect(document)}
          className="cursor-pointer space-y-1"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-slate-900 text-sm truncate group-hover:text-emerald-800 transition-colors">
                {document.fileName}
              </h4>
              <p className="text-[11px] text-slate-400 uppercase font-mono">
                {document.fileType} • {fileSizeKb} KB
              </p>
            </div>
          </div>

          {/* AI Summary snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
            {document.summary || 'Summary processing...'}
          </p>
        </div>

        {/* Tags / Keywords */}
        {document.keywords && document.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {document.keywords.slice(0, 3).map((kw, i) => (
              <span
                key={i}
                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-4.5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {onOpenChat && (
            <button
              onClick={() => onOpenChat(document)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-white transition-colors"
              title="Chat with Document"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to permanently delete "${document.fileName}"?`)) {
                  onDelete(document.id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => onSelect(document)}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
        >
          <span>View Insights</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
