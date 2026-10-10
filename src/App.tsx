import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { BottomNavigation } from './components/BottomNavigation.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AuthView } from './components/AuthView.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { CropDiagnosticScanner } from './components/CropDiagnosticScanner.tsx';
import { CropAnalysisResult } from './components/CropAnalysisResult.tsx';
import { FarmCropManager } from './components/FarmCropManager.tsx';
import { IrrigationManager } from './components/IrrigationManager.tsx';
import { FertilizerManager } from './components/FertilizerManager.tsx';
import { AgronomyAssistant } from './components/AgronomyAssistant.tsx';
import { AlertsManager } from './components/AlertsManager.tsx';
import { FarmAnalytics } from './components/FarmAnalytics.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { ProfileSettings } from './components/ProfileSettings.tsx';
import { Farm, Crop, CropAnalysis, SensorReading, FarmAlert } from './types/index.ts';

function AppContent() {
  const { user, loading, loginAsDemoFarmer } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [analyses, setAnalyses] = useState<CropAnalysis[]>([]);
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);

  // Sync initial farm data
  const fetchData = async () => {
    if (!user) return;
    try {
      const [fRes, cRes, aRes, sRes, altRes] = await Promise.all([
        fetch(`/api/farms?userId=${user.userId}`),
        fetch(`/api/crops?userId=${user.userId}`),
        fetch(`/api/crop-analysis?userId=${user.userId}`),
        fetch(`/api/sensors/data`),
        fetch(`/api/alerts?userId=${user.userId}`),
      ]);

      const [fData, cData, aData, sData, altData] = await Promise.all([
        fRes.json(),
        cRes.json(),
        aRes.json(),
        sRes.json(),
        altRes.json(),
      ]);

      if (fData.farms) setFarms(fData.farms);
      if (cData.crops) setCrops(cData.crops);
      if (aData.analyses) setAnalyses(aData.analyses);
      if (sData.readings) setSensors(sData.readings);
      if (altData.alerts) setAlerts(altData.alerts);
    } catch (e) {
      console.error('Fetch error:', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      if (currentRoute === '/' || currentRoute === '/login' || currentRoute === '/register') {
        setCurrentRoute('/dashboard');
      }
    } else {
      if (currentRoute !== '/' && currentRoute !== '/login' && currentRoute !== '/register') {
        setCurrentRoute('/');
      }
    }
  }, [user]);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisComplete = (newAnalysis: CropAnalysis) => {
    setAnalyses((prev) => [newAnalysis, ...prev]);
    setActiveAnalysisId(newAnalysis.analysisId);
    setCurrentRoute(`/crop-analysis/${newAnalysis.analysisId}`);
  };

  const handleOpenAnalysis = (id: string) => {
    setActiveAnalysisId(id);
    setCurrentRoute(`/crop-analysis/${id}`);
  };

  const handleAddFarm = async (farmData: Partial<Farm>) => {
    try {
      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmData),
      });
      const data = await res.json();
      if (data.farm) setFarms((prev) => [...prev, data.farm]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCrop = async (cropData: Partial<Crop>) => {
    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cropData),
      });
      const data = await res.json();
      if (data.crop) setCrops((prev) => [...prev, data.crop]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFarm = async (farmId: string) => {
    try {
      await fetch(`/api/farms/${farmId}`, { method: 'DELETE' });
      setFarms((prev) => prev.filter((f) => f.farmId !== farmId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAlertRead = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}/read`, { method: 'PUT' });
      setAlerts((prev) =>
        prev.map((a) => (a.alertId === alertId ? { ...a, read: true } : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-[36px] animate-spin text-[#00652c]">
            progress_activity
          </span>
          <p className="text-xs font-bold text-slate-600">Connecting to AgriSense AI...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated Routes
  if (!user) {
    if (currentRoute === '/login' || currentRoute === '/register') {
      return (
        <div className="min-h-screen bg-[#f9f9ff] flex flex-col">
          <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />
          <AuthView
            initialMode={currentRoute === '/register' ? 'signup' : 'signin'}
            onSuccess={() => handleNavigate('/dashboard')}
            onSwitchMode={(m) => handleNavigate(m === 'signup' ? '/register' : '/login')}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f9f9ff] flex flex-col">
        <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />
        <LandingPage
          onAnalyzeCrop={async () => {
            await loginAsDemoFarmer();
            handleNavigate('/crop-analysis');
          }}
          onExploreFeatures={() => {
            const el = document.getElementById('features-sec');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onSignIn={() => handleNavigate('/login')}
        />
      </div>
    );
  }

  // Active analysis item
  const currentAnalysis =
    analyses.find((a) => a.analysisId === activeAnalysisId) || analyses[0];

  return (
    <div className="min-h-screen bg-[#f9f9ff] flex flex-col text-[#111c2d]">
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            cropCount={crops.length}
            farmCount={farms.length}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0">
          {currentRoute === '/dashboard' && (
            <Dashboard
              farms={farms}
              crops={crops}
              recentAnalyses={analyses}
              sensors={sensors}
              alerts={alerts}
              onNavigate={handleNavigate}
              onOpenAnalysis={handleOpenAnalysis}
            />
          )}

          {currentRoute === '/crop-analysis' && (
            <CropDiagnosticScanner
              onAnalysisComplete={handleAnalysisComplete}
              onOpenAnalysis={handleOpenAnalysis}
              recentAnalyses={analyses}
            />
          )}

          {currentRoute.startsWith('/crop-analysis/') && currentAnalysis && (
            <CropAnalysisResult
              analysis={currentAnalysis}
              onBack={() => handleNavigate('/crop-analysis')}
              onConsultAssistant={() => handleNavigate('/ai-assistant')}
            />
          )}

          {(currentRoute === '/farms' || currentRoute === '/crops') && (
            <FarmCropManager
              farms={farms}
              crops={crops}
              onAddFarm={handleAddFarm}
              onAddCrop={handleAddCrop}
              onDeleteFarm={handleDeleteFarm}
            />
          )}

          {currentRoute === '/irrigation' && (
            <IrrigationManager sensors={sensors} />
          )}

          {currentRoute === '/fertilizer' && (
            <FertilizerManager />
          )}

          {currentRoute === '/ai-assistant' && (
            <AgronomyAssistant />
          )}

          {currentRoute === '/weather' && (
            <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#dee8ff] text-[#00652c] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">wb_sunny</span>
                  </div>
                  <div>
                    <h2 className="font-headline font-bold text-lg text-[#111c2d]">
                      Farm Microclimate & Weather
                    </h2>
                    <p className="text-xs text-slate-500">
                      Geo-sensor microclimate readings for Tirunelveli, Tamil Nadu
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Temperature</span>
                  <strong className="text-2xl font-headline text-[#111c2d]">29.2°C</strong>
                  <span className="text-xs text-slate-500 block">Partly Sunny</span>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Air Humidity</span>
                  <strong className="text-2xl font-headline text-[#005b8c]">68%</strong>
                  <span className="text-xs text-slate-500 block">Morning Dew</span>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Rain Probability</span>
                  <strong className="text-2xl font-headline text-[#00652c]">15%</strong>
                  <span className="text-xs text-slate-500 block">Low Precipitation</span>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Wind Speed</span>
                  <strong className="text-2xl font-headline text-[#111c2d]">8 km/h</strong>
                  <span className="text-xs text-slate-500 block">Gentle Breeze</span>
                </div>
              </div>
            </div>
          )}

          {currentRoute === '/alerts' && (
            <AlertsManager
              alerts={alerts}
              onMarkRead={handleMarkAlertRead}
              onOpenAnalysis={() => handleNavigate('/crop-analysis')}
            />
          )}

          {currentRoute === '/analytics' && (
            <FarmAnalytics
              farms={farms}
              crops={crops}
              analyses={analyses}
              sensors={sensors}
            />
          )}

          {currentRoute === '/reports' && (
            <ReportsView farms={farms} crops={crops} analyses={analyses} />
          )}

          {currentRoute === '/profile' && (
            <ProfileSettings />
          )}
        </main>
      </div>

      {/* Persistent Bottom Tab Navigation for Mobile matching Stitch exact tabs */}
      <BottomNavigation currentRoute={currentRoute} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
