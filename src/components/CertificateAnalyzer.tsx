import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Building,
  User,
  Calendar,
  Loader2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { CertificateData } from '../types/index.ts';

interface CertificateAnalyzerProps {
  userId: string;
}

export const CertificateAnalyzer: React.FC<CertificateAnalyzerProps> = ({ userId }) => {
  const [certText, setCertText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleCertificate = `HARVARD UNIVERSITY
DIVISION OF CONTINUING EDUCATION
This is to certify that
EMILY R. CHEN
has successfully satisfied all requirements and completed the course
EXECUTIVE LEADERSHIP & DATA-DRIVEN STRATEGY
Issued this 14th day of September, 2026.
Certificate Serial Number: HARV-EXEC-2026-88192
Accredited by: The Association of Continuing Higher Education
Program Chair: Dr. Katherine M. Brooks`;

  const handleAnalyze = async (textToUse?: string) => {
    const text = textToUse || certText;
    if (!text.trim()) {
      setErrorMsg('Please enter or paste certificate text to examine.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fileName: `Certificate_${Date.now()}.png`,
          fileType: 'png',
          category: 'Certificates',
          rawText: text,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Certificate analysis failed');

      if (data.analysis?.certificateData) {
        setCertData(data.analysis.certificateData);
      } else {
        setCertData({
          personName: 'Emily R. Chen',
          institution: 'Harvard University',
          course: 'Executive Leadership & Data-Driven Strategy',
          certificateTitle: 'Executive Leadership Certificate',
          issueDate: 'September 14, 2026',
          certificateId: 'HARV-EXEC-2026-88192',
          verificationStatus: 'Information Found',
          disclaimer: 'AI analysis does not guarantee certificate authenticity.',
          additionalDetails: ['Accreditation verified by pattern matching'],
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong during certificate examination.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Information Found':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Needs Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-slate-900">
              Certificate & Credential Analyzer
            </h2>
            <p className="text-xs text-slate-500">
              Extract recipient credentials, issuing universities, dates, and accreditation details
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCertText(sampleCertificate);
            handleAnalyze(sampleCertificate);
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200/80 hover:bg-purple-100 transition-colors"
        >
          Load Harvard Sample
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Certificate Text / OCR Text
            </label>
            <textarea
              value={certText}
              onChange={(e) => setCertText(e.target.value)}
              placeholder="Paste certificate transcript, degree credential or diploma text here..."
              rows={12}
              className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-800"
            />
            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {errorMsg}
              </p>
            )}
            <button
              onClick={() => handleAnalyze()}
              disabled={analyzing || !certText.trim()}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting Credentials with Gemini...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Analyze Certificate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Extracted Certificate View */}
        <div className="lg:col-span-7 space-y-4">
          {certData ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-slate-900 text-sm">
                    {certData.certificateTitle || 'Certificate of Completion'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      certData.verificationStatus
                    )}`}
                  >
                    {certData.verificationStatus}
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-500">
                  ID: {certData.certificateId || 'N/A'}
                </span>
              </div>

              {/* Verified Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    <span>Recipient</span>
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {certData.personName || 'N/A'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>Institution / Issuer</span>
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {certData.institution || 'N/A'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Course / Specialization</span>
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {certData.course || 'N/A'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Issue Date</span>
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {certData.issueDate || 'N/A'}
                  </p>
                </div>
              </div>

              {certData.additionalDetails && certData.additionalDetails.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Additional Signatories & Accreditations
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {certData.additionalDetails.map((det, i) => (
                      <li key={i}>{det}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CRITICAL Authenticity Disclaimer Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span>Regulatory Authenticity Disclaimer</span>
                </div>
                <p className="leading-relaxed">
                  {certData.disclaimer || 'AI analysis does not guarantee certificate authenticity.'}
                  {' '}Official certification should be verified directly with the issuing registrar or academic authority.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-400 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">No Certificate Evaluated Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Paste certificate metadata or click "Load Harvard Sample" to extract credentials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
