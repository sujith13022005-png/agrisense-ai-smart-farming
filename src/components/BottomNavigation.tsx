import React from 'react';

interface BottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const isDiagnoseActive = currentRoute === '/crop-analysis' || currentRoute.startsWith('/crop-analysis/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#f9f9ff]/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.05)] pb-safe md:hidden">
      <div className="h-16 max-w-md mx-auto px-2 flex items-center justify-around relative">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('/dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
            currentRoute === '/dashboard' ? 'text-[#00652c] font-bold' : 'text-slate-500 hover:text-[#111c2d]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[11px] font-semibold mt-0.5">Home</span>
        </button>

        {/* 2. Diagnose Floating Center Trigger */}
        <button
          onClick={() => onNavigate('/crop-analysis')}
          className="flex flex-col items-center justify-center min-w-[56px] h-12 relative group"
        >
          <div className="w-12 h-12 -mt-6 rounded-full bg-[#15803d] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(21,128,61,0.4)] group-active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[26px]">document_scanner</span>
          </div>
          <span
            className={`text-[11px] font-bold mt-1 ${
              isDiagnoseActive ? 'text-[#00652c]' : 'text-slate-600'
            }`}
          >
            Diagnose
          </span>
        </button>

        {/* 3. Irrigation */}
        <button
          onClick={() => onNavigate('/irrigation')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
            currentRoute === '/irrigation' ? 'text-[#00652c] font-bold' : 'text-slate-500 hover:text-[#111c2d]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">water_drop</span>
          <span className="text-[11px] font-semibold mt-0.5">Irrigation</span>
        </button>

        {/* 4. Assistant */}
        <button
          onClick={() => onNavigate('/ai-assistant')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
            currentRoute === '/ai-assistant' ? 'text-[#00652c] font-bold' : 'text-slate-500 hover:text-[#111c2d]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          <span className="text-[11px] font-semibold mt-0.5">Assistant</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => onNavigate('/farms')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
            ['/farms', '/crops', '/fertilizer', '/weather', '/analytics', '/reports', '/settings'].includes(currentRoute)
              ? 'text-[#00652c] font-bold'
              : 'text-slate-500 hover:text-[#111c2d]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">apps</span>
          <span className="text-[11px] font-semibold mt-0.5">More</span>
        </button>
      </div>
    </nav>
  );
};
