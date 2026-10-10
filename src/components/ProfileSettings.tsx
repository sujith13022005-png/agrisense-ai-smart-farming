import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';

export const ProfileSettings: React.FC = () => {
  const { user, language, setLanguage } = useAuth();
  const [name, setName] = useState(user?.name || 'Rajesh Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 98450 12345');
  const [location, setLocation] = useState(user?.location || 'Tirunelveli, Tamil Nadu');
  const [primaryCrop, setPrimaryCrop] = useState(user?.primaryCrop || 'Tomato');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userId,
          name,
          phone,
          location,
          primaryCrop,
          language,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-24 md:pb-8">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#dee8ff] text-[#00652c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">account_circle</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-[#111c2d]">
              Farmer Profile & Preferences
            </h2>
            <p className="text-xs text-slate-500">
              Manage personal details, language preferences, and default crop plots
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-[#d3ffd5] border border-[#95f8a7] rounded-2xl text-[#00652c] text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200 text-[#111c2d]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200 text-[#111c2d]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Field Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200 text-[#111c2d]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Primary Crop</label>
            <input
              type="text"
              value={primaryCrop}
              onChange={(e) => setPrimaryCrop(e.target.value)}
              className="w-full bg-[#f0f3ff] p-2.5 rounded-xl border border-slate-200 text-[#111c2d]"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Role: <strong>{user?.role || 'FARMER'}</strong></span>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#15803d] text-white font-bold text-xs shadow-sm"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};
