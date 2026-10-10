import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';

interface AuthViewProps {
  initialMode: 'signin' | 'signup';
  onSuccess: () => void;
  onSwitchMode: (mode: 'signin' | 'signup') => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode,
  onSuccess,
  onSwitchMode,
}) => {
  const { login, register, loginAsDemoFarmer, loginAsDemoAdmin, language, setLanguage } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [identifier, setIdentifier] = useState('rajesh.kumar@agrisense.farm');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Rajesh Kumar');
  const [phone, setPhone] = useState('98450 12345');
  const [selectedCrop, setSelectedCrop] = useState('Paddy / Rice');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isTamil = language === 'ta';

  const crops = [
    { label: 'Tomato', emoji: '🍅' },
    { label: 'Paddy / Rice', emoji: '🌾' },
    { label: 'Cotton', emoji: '☁️' },
    { label: 'Sugarcane', emoji: '🎋' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (mode === 'signin') {
      const res = await login(identifier, password);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    } else {
      const res = await register({
        name,
        email: identifier,
        phone,
        password,
        primaryCrop: selectedCrop,
        farmName: `${name}'s Farm`,
        location: 'Tirunelveli, Tamil Nadu',
      });
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center min-h-[calc(100vh-4.5rem)] bg-[#f9f9ff] text-[#111c2d] py-6 px-4">
      <div className="w-full max-w-[440px] flex flex-col pb-8">
        {/* Top Utility Bar: Farm Secure & Bilingual Toggle matching Stitch Image 3 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e7eeff] text-[#111c2d]">
            <span className="material-symbols-outlined text-[#00652c] text-[18px]">verified</span>
            <span className="text-[11px] font-bold tracking-wide uppercase">Farm Secure v2.4</span>
          </div>

          <div className="flex items-center bg-[#dee8ff] rounded-full p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                !isTamil ? 'bg-white text-[#00652c] shadow-xs' : 'text-slate-600'
              }`}
            >
              <span>EN</span>
              {!isTamil && <span className="w-1.5 h-1.5 rounded-full bg-[#00652c] inline-block ml-1"></span>}
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                isTamil ? 'bg-white text-[#00652c] shadow-xs' : 'text-slate-600'
              }`}
            >
              <span>தமிழ்</span>
              {isTamil && <span className="w-1.5 h-1.5 rounded-full bg-[#00652c] inline-block ml-1"></span>}
            </button>
          </div>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#00652c] text-white flex items-center justify-center mb-2 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">eco</span>
          </div>
          <h2 className="font-headline font-bold text-xl text-[#111c2d]">AgriSense AI</h2>
          <p className="text-xs text-slate-600 max-w-[310px] leading-snug mt-1">
            {isTamil
              ? 'உங்கள் நிலத்திற்கு ஏற்ற நுண்ணறிவு மண், வானிலை மற்றும் பயிர் ஆலோசனை.'
              : 'Intelligent soil, weather, & crop advisory directly tailored to your soil.'}
          </p>
        </div>

        {/* Segmented Auth Mode Switcher matching Stitch Image 3 */}
        <div className="w-full bg-[#dee8ff] p-1 rounded-2xl flex items-center mb-5 shadow-2xs">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-xs text-center transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin' ? 'bg-white text-[#00652c]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>{isTamil ? 'உள்நுழைக' : 'Sign In'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup' ? 'bg-white text-[#00652c] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>{isTamil ? 'பதிவு செய்க' : 'Create Account'}</span>
          </button>
        </div>

        {/* Main Auth Form Card matching Stitch Image 3 */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 mb-5 flex flex-col gap-4"
        >
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#111c2d] flex items-center gap-1">
                <span className="material-symbols-outlined text-[#00652c] text-[16px]">badge</span>
                <span>{isTamil ? 'முழு பெயர்' : 'Full Name'}</span>
              </label>
              <div className="flex items-center rounded-xl bg-[#f0f3ff] px-3 py-1">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajesh Kumar"
                  className="w-full bg-transparent py-2.5 text-[#111c2d] text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Identifier Input */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-bold text-[#111c2d]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#00652c] text-[16px]">smartphone</span>
                <span>{isTamil ? 'கைபேசி எண் அல்லது மின்னஞ்சல்' : 'Mobile Number or Email'}</span>
              </span>
              <span className="text-[10px] text-[#00652c] font-bold">Kisan Verified</span>
            </div>
            <div className="flex items-center rounded-xl bg-[#f0f3ff] px-3 py-1">
              <div className="flex items-center gap-1 pr-2 mr-2 border-r border-slate-200">
                <span className="text-xs font-bold">🇮🇳 +91</span>
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="98450 12345 or kisan@farm.in"
                className="w-full bg-transparent py-2.5 text-[#111c2d] text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-bold text-[#111c2d]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#00652c] text-[16px]">lock</span>
                <span>{isTamil ? 'கடவுச்சொல் / பின்' : 'Password / PIN'}</span>
              </span>
              <button type="button" className="text-[11px] text-[#00652c] font-semibold hover:underline">
                Forgot PIN?
              </button>
            </div>
            <div className="flex items-center rounded-xl bg-[#f0f3ff] px-3 py-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure PIN or password"
                className="w-full bg-transparent py-2.5 text-[#111c2d] text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-500 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Remember check */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#00652c]" />
              <span className="text-xs text-slate-600">Remember this phone</span>
            </label>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="material-symbols-outlined text-[14px] text-[#00652c]">eco</span>
              <span>Low-data mode</span>
            </span>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[50px] bg-[#00652c] hover:bg-[#15803d] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all mt-1"
          >
            <span className="material-symbols-outlined text-[20px]">agriculture</span>
            <span>
              {loading
                ? 'Processing...'
                : mode === 'signin'
                ? isTamil
                  ? 'பண்ணைக்குள் உள்நுழைக'
                  : 'Sign In to My Farm'
                : isTamil
                ? 'பண்ணையை பதிவு செய்க'
                : 'Register My Farm'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-0.5">
            <div className="w-full h-[1px] bg-slate-200"></div>
            <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Instant Demo Access
            </span>
          </div>

          {/* Quick Demo Triggers */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                await loginAsDemoFarmer();
                onSuccess();
              }}
              className="min-h-[44px] bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] rounded-xl flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#00652c]">person</span>
              <span>Demo Farmer</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                await loginAsDemoAdmin();
                onSuccess();
              }}
              className="min-h-[44px] bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] rounded-xl flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-purple-700">admin_panel_settings</span>
              <span>Demo Admin</span>
            </button>
          </div>
        </form>

        {/* Farmer Quick Profile Setup Teaser Card matching Stitch Image 3 */}
        <div className="w-full bg-[#d3ffd5]/30 border border-[#95f8a7]/60 rounded-3xl p-5 mb-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#15803d] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">timer</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-sm text-[#111c2d]">New to AgriSense?</h3>
                <p className="text-xs text-slate-600">Set up your farmer profile in 60 seconds</p>
              </div>
            </div>
            <span className="bg-[#95f8a7] text-[#00210a] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              Free
            </span>
          </div>

          {/* Quick Crop Selector Pills matching Stitch Image 3 */}
          <div>
            <div className="text-xs font-bold text-[#111c2d] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#00652c]">potted_plant</span>
              <span>Select Primary Crop:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {crops.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setSelectedCrop(c.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                    selectedCrop === c.label
                      ? 'bg-[#00652c] text-white shadow-2xs'
                      : 'bg-white text-[#111c2d] border border-slate-200'
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Geo-Sensor Badge matching Stitch Image 3 */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-slate-200/60 text-[#111c2d]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00652c] text-[20px]">near_me</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold">Tirunelveli, Tamil Nadu</span>
                <span className="text-[11px] text-slate-500">Geo-sensor ready • 32°C Sunny</span>
              </div>
            </div>
            <span className="bg-[#d3ffd5] text-[#00652c] text-[10px] font-bold px-2 py-0.5 rounded-md">
              Auto-detected
            </span>
          </div>
        </div>

        {/* Kisan Helpline & Field Assistance Footer matching Stitch Image 3 */}
        <div className="w-full bg-[#dee8ff] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fe932c] text-[#663500] flex items-center justify-center shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-[#904d00] tracking-wider">
                Toll-Free Kisan Help
              </span>
              <a href="tel:18001801551" className="font-headline font-bold text-sm text-[#111c2d] hover:text-[#00652c]">
                1800-180-1551
              </a>
            </div>
          </div>
          <a
            href="tel:18001801551"
            className="px-3.5 py-2 bg-white text-[#00652c] font-bold text-xs rounded-xl flex items-center gap-1 shadow-2xs hover:bg-[#00652c] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Call</span>
          </a>
        </div>
      </div>
    </div>
  );
};
