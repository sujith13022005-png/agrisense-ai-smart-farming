import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';

interface LandingPageProps {
  onAnalyzeCrop: () => void;
  onExploreFeatures: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeCrop,
  onExploreFeatures,
  onSignIn,
}) => {
  const { language, setLanguage } = useAuth();

  const isTamil = language === 'ta';

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 md:pb-12">
      <div className="w-full max-w-[540px] md:max-w-4xl px-4 py-4 space-y-6">
        {/* Top Brand Navigation / Utility Strip matching Stitch Image 1 & Image 5 */}
        <div className="w-full bg-white rounded-2xl p-3 shadow-xs flex items-center justify-between border border-slate-200/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00652c] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">eco</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-headline font-bold text-base text-[#111c2d]">AgriSense</span>
              <span className="text-[10px] font-bold text-[#00652c] uppercase tracking-wider">AI</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(isTamil ? 'en' : 'ta')}
              className="flex items-center bg-[#dee8ff] px-2.5 py-1 rounded-full text-xs font-semibold text-[#111c2d]"
            >
              <span className={!isTamil ? 'text-[#00652c] font-bold' : 'text-slate-600'}>English</span>
              <span className="mx-1 text-slate-400">|</span>
              <span className={isTamil ? 'text-[#00652c] font-bold' : 'text-slate-600'}>தமிழ்</span>
            </button>
            <button
              onClick={onSignIn}
              className="bg-[#dee8ff] hover:bg-[#d8e3fb] text-[#00652c] font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors"
            >
              {isTamil ? 'உள்நுழைக' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Hero Section Card matching Stitch Image 1 & Image 5 */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 md:p-8 shadow-xs border border-slate-200/60">
          <div className="relative z-10 flex flex-col space-y-4">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 self-start bg-[#d3ffd5]/60 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#00652c] animate-pulse"></span>
              <span className="text-xs text-[#00652c] font-bold">
                {isTamil ? '🌿 அடுத்த தலைமுறை விவசாய நுண்ணறிவு' : '🌿 Next-Gen Agricultural Intelligence'}
              </span>
            </div>

            {/* Headline & Subtitle */}
            <div className="space-y-2">
              <h1 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl text-[#111c2d] tracking-tight leading-tight">
                {isTamil
                  ? 'சிறந்த விவசாயத்திற்கான AI-இயங்கும் நுண்ணறிவு'
                  : 'AI-Powered Intelligence for Smarter Farming'}
              </h1>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                {isTamil
                  ? 'உடனடி பயிர் நோய் கண்டறிதல், துல்லியமான பாசன அட்டவணைகள் மற்றும் நிகழ்நேர வேளாண் வழிகாட்டுதல்.'
                  : 'Instant crop disease diagnostics, precision irrigation schedules, and real-time agronomy guidance tailored for Indian and global growers.'}
              </p>
            </div>

            {/* Hero Visual Card with Camera Diagnostic Highlight */}
            <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden shadow-inner bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&auto=format&fit=crop&q=80"
                alt="Indian lush green field with AI overlay"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-4 pointer-events-none">
                <div className="self-end bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold border border-white/20">
                  v4.2 Model
                </div>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#95f8a7] text-[20px]">verified</span>
                    <span className="text-xs font-bold">Live Field Neural Vision Active</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300">Targeting Locked</span>
                </div>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={onAnalyzeCrop}
                className="flex-1 bg-[#00652c] hover:bg-[#15803d] text-white font-bold text-sm py-3.5 px-5 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
              >
                <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                <span>{isTamil ? 'பயிரை ஸ்கேன் செய்க (இலவசம்)' : 'Analyze My Crop (Free)'}</span>
              </button>
              <button
                onClick={onExploreFeatures}
                className="bg-[#dee8ff] hover:bg-[#d8e3fb] text-[#111c2d] font-bold text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-[#00652c]">explore</span>
                <span>{isTamil ? 'அம்சங்களை அறிக' : 'Explore Features'}</span>
              </button>
            </div>

            {/* Trust Metrics Strip matching Stitch 3-card grid */}
            <div className="grid grid-cols-3 gap-2 pt-3 bg-[#f0f3ff] p-3 rounded-xl text-center">
              <div className="flex flex-col">
                <span className="font-headline font-bold text-lg sm:text-xl text-[#00652c]">98.4%</span>
                <span className="text-[11px] text-slate-600 leading-tight mt-0.5">Diagnostic Accuracy</span>
              </div>
              <div className="flex flex-col bg-white/70 py-1 rounded-lg">
                <span className="font-headline font-bold text-lg sm:text-xl text-[#904d00]">45k+</span>
                <span className="text-[11px] text-slate-600 leading-tight mt-0.5">Farms Empowered</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-lg sm:text-xl text-[#005b8c]">32%</span>
                <span className="text-[11px] text-slate-600 leading-tight mt-0.5">Water Saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offline-Ready In Fields Delight Widget */}
        <div className="bg-gradient-to-r from-[#dee8ff] to-[#e7eeff] p-4 rounded-2xl flex items-center justify-between border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-[#111c2d]">Offline-Ready in Fields</p>
              <p className="text-[11px] text-slate-600">Diagnostics run locally without 4G delay</p>
            </div>
          </div>
          <span className="text-xs bg-white text-[#00652c] font-bold px-2.5 py-1 rounded-full shadow-2xs">
            Zero Lag
          </span>
        </div>

        {/* Precision Farm Modules Grid matching Stitch 6-card stack */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-lg text-[#111c2d]">Precision Farm Modules</h2>
              <p className="text-xs text-slate-500">Intelligent decision systems built for resilient yields</p>
            </div>
            <span className="material-symbols-outlined text-[#00652c]">spa</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 1. Crop Disease Detection */}
            <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200/60 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#d3ffd5] text-[#00652c] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">coronavirus</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-[#111c2d]">Crop Disease Detection</h3>
                    <span className="text-[10px] font-bold bg-[#d3ffd5] text-[#00652c] px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Instant Bio-Scan
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-mono">&lt; 3 sec</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Snap a leaf photo to diagnose 120+ pathogens in under 3 seconds with localized botanical treatment prescriptions.
              </p>
            </div>

            {/* 2. Pest & Insect Detection */}
            <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200/60 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#ffdcc3] text-[#6e3900] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">pest_control</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-[#111c2d]">Pest & Insect Detection</h3>
                    <span className="text-[10px] font-bold bg-[#ffdcc3] text-[#6e3900] px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Bio-Control Active
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#904d00]">IPM Friendly</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Early-stage nymph & borer identification with targeted biological controls, minimizing non-selective chemical spray waste.
              </p>
            </div>

            {/* 3. Smart Precision Irrigation */}
            <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200/60 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#004b73] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">water_drop</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-[#111c2d]">Smart Precision Irrigation</h3>
                    <span className="text-[10px] font-bold bg-[#cce5ff] text-[#004b73] px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Automated Valve API
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#005b8c]">IoT Integrated</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                IoT soil moisture sync & weather-predictive automated water scheduling to prevent over-watering and root rot.
              </p>
            </div>

            {/* 4. Custom Fertilizer Plans */}
            <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200/60 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#dee8ff] text-[#00652c] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">science</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-[#111c2d]">Custom Fertilizer Plans</h3>
                    <span className="text-[10px] font-bold bg-[#d8e3fb] text-[#111c2d] px-2 py-0.5 rounded-full inline-block mt-0.5">
                      NPK Ratio Engine
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-semibold">-24% Cost</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                NPK soil nutrient-balanced dosage charts to slash input costs while maximizing vegetative and flowering stage yields.
              </p>
            </div>

            {/* 5. Satellite & Sensor Health */}
            <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200/60 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#d3ffd5]/50 text-[#00652c] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-[#111c2d]">Satellite & Sensor Health</h3>
                    <span className="text-[10px] font-bold bg-[#d3ffd5] text-[#00652c] px-2 py-0.5 rounded-full inline-block mt-0.5">
                      NDVI Canopy Map
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#00652c]">10m Res</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Continuous NDVI health indexing & thermal stress alerts flagging nitrogen deficiency and moisture variance.
              </p>
            </div>

            {/* 6. Multilingual AI Assistant */}
            <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200/60 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#004b73] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">record_voice_over</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-[#111c2d]">Multilingual AI Assistant</h3>
                    <span className="text-[10px] font-bold bg-[#cce5ff] text-[#004b73] px-2 py-0.5 rounded-full inline-block mt-0.5">
                      English & தமிழ்
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#00652c]">24/7 Voice</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Voice-enabled farm agronomist in Tamil and English available 24/7. Ask questions naturally right from the field.
              </p>
            </div>
          </div>
        </div>

        {/* 3-Step Process matching Stitch Image 1 & Image 5 */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/60 space-y-4">
          <div>
            <span className="text-[11px] font-bold text-[#00652c] uppercase tracking-wider">Simple 3-Step Process</span>
            <h2 className="font-headline font-bold text-lg text-[#111c2d] mt-0.5">How AgriSense AI Works</h2>
            <p className="text-xs text-slate-500">From plant photo to harvest recovery in minutes</p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-full bg-[#00652c] text-white font-headline font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                1
              </div>
              <div className="space-y-0.5 pt-0.5">
                <h4 className="text-xs font-bold text-[#111c2d]">Snap or Upload Photo</h4>
                <p className="text-xs text-slate-600">Capture a clear smartphone image of the affected crop leaf or stem directly under sunlight.</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-full bg-[#fe932c] text-[#663500] font-headline font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                2
              </div>
              <div className="space-y-0.5 pt-0.5">
                <h4 className="text-xs font-bold text-[#111c2d]">AI Neural Diagnostics</h4>
                <p className="text-xs text-slate-600">Deep-learning vision models cross-reference botanical datasets to pinpoint infection pathogen, percentage spread, and phase.</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-full bg-[#15803d] text-white font-headline font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                3
              </div>
              <div className="space-y-0.5 pt-0.5">
                <h4 className="text-xs font-bold text-[#111c2d]">Get Actionable Treatment</h4>
                <p className="text-xs text-slate-600">Receive precise dosage instructions, organic remedies, irrigation adjustments, and spray safety protocols instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Testimonial Quote Card matching Stitch Image 1 & Image 5 */}
        <div className="bg-[#f0f3ff] p-5 rounded-2xl space-y-3 relative border border-slate-200/40">
          <div className="flex items-center justify-between">
            <div className="flex text-[#fe932c]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-[18px]">star</span>
              ))}
            </div>
            <span className="text-[10px] bg-[#d3ffd5] text-[#00652c] font-bold px-2 py-0.5 rounded-full">Verified Grower</span>
          </div>
          <blockquote className="text-xs text-[#111c2d] italic leading-relaxed">
            "AgriSense detected blast fungus on my samba paddy crop 5 days before it became visible across the field. The Tamil voice guide saved me nearly ₹40,000 in ruined harvest and pesticide costs."
          </blockquote>
          <div className="flex items-center gap-3 pt-1">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80"
              alt="Muthuvel Karuppiah"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00652c]/20"
            />
            <div>
              <h5 className="text-xs font-bold text-[#111c2d]">Muthuvel Karuppiah</h5>
              <p className="text-[11px] text-slate-500">Sugarcane & Paddy Farmer, Thanjavur (14.2 Acres)</p>
            </div>
          </div>
        </div>

        {/* Research & Validation Partners Strip */}
        <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200/60 text-center space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Research & Validation Partners</p>
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 bg-[#f0f3ff] rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00652c] text-[20px]">school</span>
              <span className="text-xs font-semibold text-[#111c2d]">TNAU Agronomy Labs</span>
            </div>
            <div className="p-2.5 bg-[#f0f3ff] rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00652c] text-[20px]">biotech</span>
              <span className="text-xs font-semibold text-[#111c2d]">ICAR Field Trials</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-4 text-center space-y-2 text-xs text-slate-500">
          <p>© 2026 AgriSense AI Technologies. Built for sustainable agrarian resilience.</p>
          <p className="text-[11px] text-slate-400">Powered by Google Gemini Models • Dedicated to Indian & Global Farmers</p>
        </footer>
      </div>
    </div>
  );
};
