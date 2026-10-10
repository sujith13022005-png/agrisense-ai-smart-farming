import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { DocumentCategory, DocumentModel } from '../types/index.ts';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUploadSuccess: (newDoc: DocumentModel) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  userId,
  onUploadSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>('Reports');
  const [manualText, setManualText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: DocumentCategory[] = [
    'Academic',
    'Finance',
    'Certificates',
    'Bills',
    'Reports',
    'Personal',
    'Other',
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setErrorMsg(null);
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext)) {
      setErrorMsg('Unsupported file type. Please upload a PDF, PNG, JPG, or DOCX document.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File exceeds 25MB maximum limit.');
      return;
    }

    setSelectedFile(file);

    // Auto-categorize based on file name
    const lower = file.name.toLowerCase();
    if (lower.includes('invoice') || lower.includes('bill') || lower.includes('receipt')) {
      setCategory('Finance');
    } else if (lower.includes('cert') || lower.includes('diploma') || lower.includes('degree')) {
      setCategory('Certificates');
    } else if (lower.includes('thesis') || lower.includes('paper') || lower.includes('study')) {
      setCategory('Academic');
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !manualText.trim()) {
      setErrorMsg('Please select a file or paste document content to analyze.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    const steps = [
      'Uploading...',
      'Processing document...',
      'Reading content...',
      'Analyzing with Gemini...',
      'Generating insights...',
      'Almost done...',
    ];

    let stepIndex = 0;
    setUploadStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setUploadStep(steps[stepIndex]);
      }
    }, 1100);

    try {
      let fileData = '';
      let rawText = manualText.trim();

      if (selectedFile) {
        fileData = await readFileAsDataURL(selectedFile);
        if (!rawText) {
          rawText = `Document: ${selectedFile.name}\nSize: ${selectedFile.size} bytes\nType: ${selectedFile.type}\nContent extracted and prepared for semantic synthesis.`;
        }
      }

      const payload = {
        userId,
        fileName: selectedFile ? selectedFile.name : `Doc_${Date.now()}.txt`,
        fileType: selectedFile ? selectedFile.name.split('.').pop()?.toLowerCase() || 'txt' : 'txt',
        fileSize: selectedFile ? selectedFile.size : rawText.length,
        fileContent: fileData,
        category,
        rawText,
      };

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload document');
      }

      onUploadSuccess(data.document);
      onClose();
      // Reset state
      setSelectedFile(null);
      setManualText('');
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || 'Something went wrong while analyzing your document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-slate-900 text-base">Upload Document</h3>
              <p className="text-xs text-slate-500">Gemini Neural Vision & Text Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive
                ? 'border-emerald-600 bg-emerald-50/60'
                : selectedFile
                ? 'border-emerald-500 bg-emerald-50/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelection(e.target.files[0]);
                }
              }}
            />

            {selectedFile ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200 shadow-xs">
                <div className="flex items-center gap-3 truncate text-left">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to browse or drag and drop document
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supported formats: PDF, PNG, JPG, JPEG, DOCX (Max 25MB)
                </p>
              </label>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Document Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Optional manual text input / paste content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Or Paste Document Text / Notes (Optional)
            </label>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Paste raw text, invoice lines, transcript, or academic summary here for instant processing..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Progress / Loading indicator */}
          {uploading && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>{uploadStep}</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-700">Gemini 3.8</span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || (!selectedFile && !manualText.trim())}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{uploading ? 'Analyzing...' : 'Analyze Document'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
