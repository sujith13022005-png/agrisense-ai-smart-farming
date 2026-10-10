import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  FileText,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DocumentModel, DocumentCategory } from '../types/index.ts';

interface SmartSearchProps {
  documents: DocumentModel[];
  onSelectDocument: (doc: DocumentModel) => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  documents,
  onSelectDocument,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const categories: (string | DocumentCategory)[] = [
    'All',
    'Academic',
    'Finance',
    'Certificates',
    'Bills',
    'Reports',
    'Personal',
  ];

  const filteredDocs = documents.filter((doc) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      doc.fileName.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      (doc.keywords && doc.keywords.some((k) => k.toLowerCase().includes(q))) ||
      (doc.rawText && doc.rawText.toLowerCase().includes(q)) ||
      (doc.extractedData?.entities &&
        doc.extractedData.entities.some((e) => e.name.toLowerCase().includes(q)));

    const matchesCategory =
      selectedCategory === 'All' ||
      doc.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesType =
      selectedType === 'All' || doc.fileType.toLowerCase() === selectedType.toLowerCase();

    return matchesQuery && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="font-headline font-bold text-lg text-slate-900">
            Intelligent Cross-Document Search
          </h2>
          <p className="text-xs text-slate-500">
            Natural language and semantic entity queries across your entire document vault
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything or search by entity, invoice number, date, topic..."
            className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Filters Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            Showing <strong>{filteredDocs.length}</strong> matching results
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="group bg-white p-4.5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 text-sm truncate group-hover:text-emerald-800 transition-colors">
                      {doc.fileName}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {doc.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <span>Uploaded {new Date(doc.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="uppercase">{doc.fileType}</span>
                    {doc.keywords && doc.keywords.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {doc.keywords.slice(0, 3).map((k, i) => (
                            <span key={i} className="text-emerald-700 font-medium">
                              #{k}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Open Document</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">No Matching Documents Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or removing category filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
