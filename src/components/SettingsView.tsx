import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Lock,
  Trash2,
  CheckCircle2,
  Key,
  Server,
  Cloud,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const SettingsView: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(user?.preferences?.emailNotifications ?? true);
  const [autoSummarize, setAutoSummarize] = useState(user?.preferences?.aiAutoSummarize ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const ok = await updateProfile({
      name,
      email,
      preferences: {
        ...user.preferences,
        emailNotifications: notifications,
        aiAutoSummarize: autoSummarize,
      },
    });
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="font-headline font-bold text-lg text-slate-900">
          Settings & Environment Configuration
        </h2>
        <p className="text-xs text-slate-500">
          Manage your user profile, AI preferences, security controls, and cloud credentials
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Profile and settings updated successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-emerald-700" />
          <h3 className="font-headline font-bold text-slate-900 text-sm">Profile Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
            />
          </div>
        </div>

        {/* AI & Automation Preferences */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700">AI Automation Preferences</h4>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSummarize}
              onChange={(e) => setAutoSummarize(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-700">
              Automatically trigger multi-mode Gemini analysis on document upload
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-700">
              Receive status notifications when large documents finish processing
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-all"
        >
          Save Changes
        </button>
      </form>

      {/* Cloud & Integration Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Server className="w-4 h-4 text-emerald-700" />
          <h3 className="font-headline font-bold text-slate-900 text-sm">
            Cloud & Environment Infrastructure
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="font-bold text-slate-900">Gemini AI Model</span>
            <p className="text-slate-500">
              Google GenAI SDK (<code className="text-emerald-700 font-mono">gemini-3.8-flash</code>)
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
              Active Server-Side
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="font-bold text-slate-900">Storage & Database</span>
            <p className="text-slate-500">
              Encrypted in-memory storage layer with Firestore blueprint compatibility
            </p>
            <span className="inline-block text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full mt-1">
              Firebase-Ready
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs space-y-3">
        <h3 className="font-headline font-bold text-red-700 text-sm flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-600" />
          <span>Account Actions</span>
        </h3>
        <p className="text-xs text-slate-500">
          Sign out of all sessions or reset local testing configuration.
        </p>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Sign Out of DocuMind
          </button>
        </div>
      </div>
    </div>
  );
};
