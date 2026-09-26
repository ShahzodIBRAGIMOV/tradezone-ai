import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Compass,
  Cpu, 
  ShieldCheck, 
  UserCheck, 
  Calculator, 
  Code2, 
  Globe2,
  Sparkles,
  Menu,
  Layers,
  Flame,
  Zap,
  Coins
} from 'lucide-react';
import { NavSection, UserProfile, UserRole } from '../types/trade';

interface NavbarProps {
  user: UserProfile;
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;
  onOpenOnboarding: () => void;
  onOpenCalculator: () => void;
  onOpenArchitecture: () => void;
  onOpenDrawer: () => void;
  redZoneCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeSection,
  setActiveSection,
  onOpenOnboarding,
  onOpenCalculator,
  onOpenArchitecture,
  onOpenDrawer,
  redZoneCount,
}) => {
  const [cbuLiveTicker, setCbuLiveTicker] = useState<{ usd: string; eur: string; rub: string; cny: string } | null>(null);

  useEffect(() => {
    fetch('/api/cbu-rates')
      .then(r => r.json())
      .then(data => {
        if (data && Array.isArray(data.rates)) {
          const usd = data.rates.find((x: any) => x.Ccy === 'USD')?.Rate || '12,850.40';
          const eur = data.rates.find((x: any) => x.Ccy === 'EUR')?.Rate || '13,840.15';
          const rub = data.rates.find((x: any) => x.Ccy === 'RUB')?.Rate || '142.10';
          const cny = data.rates.find((x: any) => x.Ccy === 'CNY')?.Rate || '1,785.60';
          setCbuLiveTicker({ usd, eur, rub, cny });
        }
      })
      .catch(() => {});
  }, []);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'TADBIRKOR': return 'Tadbirkor';
      case 'FERMER': return 'Fermer / Agro';
      case 'LOGISTIKA': return 'Logistika';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'TADBIRKOR': return {
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      };
      case 'FERMER': return {
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      };
      case 'LOGISTIKA': return {
        badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
      };
    }
  };

  const currentRoleStyle = getRoleColor(user.role);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-amber-500/20 shadow-xl shadow-black/40">
      {/* Top micro info bar with live CBU rates ticker */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 hidden sm:block border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              TradeZone AI: Eksport, Import, Valyuta & Yuqori Texnologiyalar
            </span>
            <span className="text-slate-400 hidden lg:inline">
              GSP+ Yevropa Ittifoqiga 6,200+ tovar 0% boj bilan
            </span>
          </div>

          <div className="flex items-center space-x-3.5 text-[11px]">
            {/* Live CBU Rates Ticker */}
            <button
              onClick={() => setActiveSection('rates')}
              className="flex items-center gap-2 px-2 py-0.5 rounded bg-slate-900/90 border border-amber-500/30 text-amber-300 hover:text-white hover:border-amber-400 transition cursor-pointer font-mono"
              title="Markaziy Bank valyuta kurslariga o'tish"
            >
              <span>🇺🇸 {cbuLiveTicker?.usd || '12,850'}</span>
              <span className="text-slate-600">|</span>
              <span>🇪🇺 {cbuLiveTicker?.eur || '13,840'}</span>
              <span className="text-slate-600">|</span>
              <span>🇷🇺 {cbuLiveTicker?.rub || '142.1'}</span>
              <span className="text-slate-600">|</span>
              <span>🇨🇳 {cbuLiveTicker?.cny || '1,785'}</span>
            </button>

            <span className="text-slate-700">|</span>

            <button 
              onClick={onOpenArchitecture}
              className="text-slate-300 hover:text-cyan-300 flex items-center gap-1 transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Arxitektura</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* User's Circular Futuristic TradeZone AI Logo */}
          <div 
            onClick={() => setActiveSection('export')} 
            className="flex items-center gap-3.5 cursor-pointer group select-none shrink-0"
          >
            <div className="relative flex items-center justify-center">
              <img
                src="/assets/tradezone_logo.png"
                alt="TradeZone AI Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain group-hover:scale-105 transition-transform duration-150"
                referrerPolicy="no-referrer"
              />
              {/* Active live dot */}
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl sm:text-2xl text-white tracking-tight">
                  Trade<span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-teal-300 to-amber-400">Zone</span>
                </span>
                <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase shadow-xs">
                  AI
                </span>
              </div>
              <p className="text-[10px] tracking-wide text-slate-400 font-semibold hidden sm:block">
                Eksport, Import, Valyuta & Texnologiyalar
              </p>
            </div>
          </div>

          {/* Module Switcher Tabs */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4.5">
            {/* 1-Bo'lim: EKSPORT */}
            <button
              onClick={() => setActiveSection('export')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 hover:scale-[1.03] cursor-pointer shadow-sm ${
                activeSection === 'export'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30 border border-emerald-400 ring-1 ring-emerald-400/50'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/40 backdrop-blur-md'
              }`}
            >
              <ArrowUpRight className={`w-4 h-4 ${activeSection === 'export' ? 'text-slate-950 stroke-[2.5]' : 'text-emerald-400'}`} />
              <span>1-Bo'lim: EKSPORT</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${activeSection === 'export' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'}`}>
                GSP+
              </span>
            </button>

            {/* 2-Bo'lim: IMPORT */}
            <button
              onClick={() => setActiveSection('import')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 hover:scale-[1.03] cursor-pointer shadow-sm ${
                activeSection === 'import'
                  ? 'bg-rose-600 text-white font-black shadow-lg shadow-rose-600/35 border border-rose-400 ring-1 ring-rose-400/50'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-700/80 hover:border-rose-500/40 backdrop-blur-md'
              }`}
            >
              <ArrowDownRight className={`w-4 h-4 ${activeSection === 'import' ? 'text-white stroke-[2.5]' : 'text-rose-400'}`} />
              <span>2-Bo'lim: IMPORT</span>
              {redZoneCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeSection === 'import' ? 'bg-rose-900 text-rose-200 border border-rose-300' : 'bg-rose-950 text-rose-300 border border-rose-500/40'}`}>
                  {redZoneCount} Qizil
                </span>
              )}
            </button>
          </div>

          {/* Right Action buttons & TOP RIGHT 3-LINES HAMBURGER MENU BUTTON */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Calculator button */}
            <button
              onClick={onOpenCalculator}
              className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/30 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition-all duration-150 active:scale-95 hover:scale-[1.03] hover:shadow-lg hover:shadow-amber-500/20 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Kalkulyator</span>
            </button>

            {/* User Profile Card Button */}
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800 hover:border-amber-500/50 bg-slate-900/90 hover:bg-slate-850 text-white transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer group text-left shadow-sm"
              title="Profilni ko'rish / o'zgartirish"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 border ${currentRoleStyle.iconBg}`}>
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition max-w-[120px] sm:max-w-[150px] truncate">
                  {user.fullName}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border w-fit leading-tight mt-0.5 ${currentRoleStyle.badge}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </button>

            {/* TOP RIGHT 3-LINES MENU BUTTON */}
            <button
              onClick={onOpenDrawer}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-amber-400 flex items-center justify-center transition-all duration-150 active:scale-95 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer border border-amber-500/40 shadow-sm"
              title="Bo'limlar menyusi"
              aria-label="Menyu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
