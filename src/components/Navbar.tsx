import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  farmSelectorText?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  farmSelectorText = 'GreenValley Farm #1 · 12.5 Ac',
}) => {
  const { user, logout, language, setLanguage, loginAsDemoFarmer, loginAsDemoAdmin } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 flex items-center justify-between gap-3">
          {/* Logo & Brand matching Stitch exact layout */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onNavigate(user ? '/dashboard' : '/')}
              className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
            >
              {/* Agricultural Leaf Logo Icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00652c] to-[#15803d] flex items-center justify-center text-white shadow-md shadow-[#00652c]/20 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">eco</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-headline font-bold text-lg text-[#111c2d] tracking-tight leading-none">
                    AgriSense
                  </span>
                  <span className="text-[11px] font-bold text-[#00652c] uppercase tracking-wider">
                    AI
                  </span>
                </div>
              </div>
            </button>

            {/* Farm Selector Pill matching Stitch Header */}
            {user && (
              <button
                onClick={() => onNavigate('/farms')}
                className="hidden sm:flex items-center gap-1.5 bg-[#dee8ff] hover:bg-[#d8e3fb] px-3 py-1 rounded-full text-xs font-semibold text-[#111c2d] truncate max-w-[240px] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00652c] shrink-0"></span>
                <span className="truncate">{user.farmName || farmSelectorText}</span>
                <span className="material-symbols-outlined text-[16px] text-slate-500 shrink-0">expand_more</span>
              </button>
            )}
          </div>

          {/* Right utility items: Language pill toggle, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Bilingual Toggle EN | தமிழ் */}
            <div className="flex items-center bg-[#dee8ff] rounded-full p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-white text-[#00652c] shadow-xs'
                    : 'text-slate-600 hover:text-[#111c2d]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'ta'
                    ? 'bg-white text-[#00652c] shadow-xs'
                    : 'text-slate-600 hover:text-[#111c2d]'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {user ? (
              <>
                {/* Notifications trigger with red badge */}
                <button
                  onClick={() => onNavigate('/alerts')}
                  className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-[#111c2d] hover:bg-[#dee8ff]/60 transition-colors"
                  title="Alerts & Field Notifications"
                >
                  <span className="material-symbols-outlined text-[22px]">notifications</span>
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#f9f9ff]"></span>
                </button>

                {/* Profile Avatar & dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-1.5 p-1 rounded-full ring-2 ring-[#00652c]/20 hover:ring-[#00652c]/50 transition-all focus:outline-none"
                  >
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  {showProfileMenu && (
                    <div
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[#111c2d] truncate">{user.name}</p>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#00652c]">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <p className="text-[10px] text-emerald-800 mt-0.5 truncate">
                          📍 {user.location}
                        </p>
                      </div>

                      <button
                        onClick={() => onNavigate('/dashboard')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#dee8ff]/40 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#00652c]">dashboard</span>
                        <span>Field Dashboard</span>
                      </button>

                      <button
                        onClick={() => onNavigate('/farms')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#dee8ff]/40 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#00652c]">fence</span>
                        <span>My Farms & Plots</span>
                      </button>

                      <button
                        onClick={() => onNavigate('/crops')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#dee8ff]/40 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#00652c]">grass</span>
                        <span>Crop Management</span>
                      </button>

                      <button
                        onClick={() => onNavigate('/profile')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#dee8ff]/40 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#00652c]">account_circle</span>
                        <span>Farmer Profile</span>
                      </button>

                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => onNavigate('/admin')}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loginAsDemoFarmer}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d3ffd5] text-[#00652c] font-bold text-xs hover:bg-[#95f8a7] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">agriculture</span>
                  <span>Demo Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#dee8ff] hover:bg-[#d8e3fb] text-[#00652c] font-bold text-xs transition-colors"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="hidden sm:inline-flex px-4 py-1.5 rounded-xl bg-[#00652c] hover:bg-[#15803d] text-white font-bold text-xs shadow-sm transition-all"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
