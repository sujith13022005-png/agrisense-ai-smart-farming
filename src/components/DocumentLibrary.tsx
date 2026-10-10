import React, { useState } from 'react';
import {
  FolderOpen,
  Filter,
  Grid,
  List,
  Search,
  Plus,
  ArrowUpDown,
  FileText,
} from 'lucide-react';
import { DocumentModel, DocumentCategory } from '../types/index.ts';
import { DocumentCard } from './DocumentCard.tsx';

interface DocumentLibraryProps {
  documents: DocumentModel[];
  onOpenUpload: () => void;
  onSelectDocument: (doc: DocumentModel) => void;
  onOpenChat: (doc: DocumentModel) => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  onOpenUpload,
  onSelectDocument,
  onOpenChat,
  onDeleteDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'All',
    'Academic',
    'Finance',
    'Certificates',
    'Bills',
    'Reports',
    'Personal',
    'Other',
  ];

  // Filter
  let filtered = documents.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQ =
      !q ||
      d.fileName.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.keywords.some((k) => k.toLowerCase().includes(q));

    const matchCat =
      selectedCategory === 'All' || d.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchQ && matchCat;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'name') {
      return a.fileName.localeCompare(b.fileName);
    }
    if (sortBy === 'size') {
      return (b.fileSize || 0) - (a.fileSize || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="font-headline font-bold text-lg text-slate-900">
            Document Vault & Library
          </h2>
          <p className="text-xs text-slate-500">
            Browse, categorize, sort, and manage all indexed documents
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New File</span>
        </button>
      </div>

      {/* Control Bar: Search, Category Filters, Sort & View Mode */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by file name, keyword or summary..."
              className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Selector */}
            <div className="flex items-center gap-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none font-medium cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="size">File Size</option>
              </select>
            </div>

            {/* View Grid / List Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
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
      </div>

      {/* Document Grid / List */}
      {filtered.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onSelect={onSelectDocument}
                onOpenChat={onOpenChat}
                onDelete={onDeleteDocument}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{doc.fileName}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{doc.summary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {(doc.fileSize / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">No Documents In This View</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No files match your current category or search criteria.
          </p>
        </div>
      )}
    </div>
  );
};
