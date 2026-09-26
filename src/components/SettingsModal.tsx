import React, { useState, useEffect } from 'react';
import { useAppSettings, AppLanguage, AppCurrency } from '../context/AppSettingsContext';
import { 
  X, 
  Settings, 
  Globe2, 
  DollarSign, 
  Bell, 
  Sparkles, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Moon, 
  Cpu, 
  Sliders
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    language: currentAppLang, 
    currency: currentAppCurr, 
    setLanguage: setAppLang, 
    setCurrency: setAppCurr 
  } = useAppSettings();

  const [language, setLanguage] = useState<AppLanguage>(currentAppLang);
  const [currency, setCurrency] = useState<AppCurrency>(currentAppCurr);

  const [notifications, setNotifications] = useState({
    redZone: true,
    gspPlus: true,
    customsNews: true,
  });

  const [aiModelMode, setAiModelMode] = useState<'flash' | 'pro'>('flash');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLanguage(currentAppLang);
    setCurrency(currentAppCurr);
  }, [currentAppLang, currentAppCurr, isOpen]);

  useEffect(() => {
    try {
      const savedNotifs = localStorage.getItem('tradezone_notifs');
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setAppLang(language);
    setAppCurr(currency);
    localStorage.setItem('tradezone_notifs', JSON.stringify(notifications));
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 450);
  };

  const handleResetDefaults = () => {
    setLanguage('uz');
    setCurrency('USD');
    setAppLang('uz');
    setAppCurr('USD');
    setNotifications({
      redZone: true,
      gspPlus: true,
      customsNews: true,
    });
    setAiModelMode('flash');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-xl w-full border border-amber-500/30 overflow-hidden text-white backdrop-blur-xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-md">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Platforma Sozlamalari</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-mono">
                  TradeZone AI
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Til, valyuta ko'rinishi, bildirishnomalar va AI konsalting parametrlari
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* 1. Language Selection */}
          <div className="space-y-2.5">
            <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-400" />
              <span>Tizim Tili (Interface Language)</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { code: 'uz', label: "O'zbekcha", desc: 'Asosiy til' },
                { code: 'en', label: 'English', desc: 'Global B2B' },
                { code: 'ru', label: 'Русский', desc: 'СНГ и ЕАЭС' },
              ].map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => setLanguage(l.code as any)}
                    className={`p-3 rounded-xl border text-left transition-all duration-150 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/50 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{l.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{l.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Currency Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Asosiy Valyuta Ko'rinishi</span>
              </label>
              <span className="text-[11px] text-amber-400/90 font-mono">
                1 USD = 12,850 UZS
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { code: 'USD', symbol: '$', label: 'AQSH Dollari (USD)' },
                { code: 'UZS', symbol: 'so\'m', label: 'O\'zbek So\'mi (UZS)' },
                { code: 'EUR', symbol: '€', label: 'Yevro (EUR)' },
              ].map((c) => {
                const isSelected = currency === c.code;
                return (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => setCurrency(c.code as any)}
                    className={`p-3 rounded-xl border text-left transition-all duration-150 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/50 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-white">{c.symbol}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 block mt-0.5">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Notifications & Smart Alerts */}
          <div className="space-y-3">
            <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-rose-400" />
              <span>Tahliliy Signallar & Bildirishnomalar</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">"Qizil Hudud" Import Ogohlantirishlari</span>
                  <span className="text-[11px] text-slate-400">Importi 30%+ ga keskin oshgan mahsulotlar bo'yicha signal berish</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.redZone}
                  onChange={(e) => setNotifications({ ...notifications, redZone: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">GSP+ Imtiyozlari Yangilanishi</span>
                  <span className="text-[11px] text-slate-400">Yevropa Ittifoqiga 0% bojsiz tovarlar ro'yxatidagi o'zgarishlar</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.gspPlus}
                  onChange={(e) => setNotifications({ ...notifications, gspPlus: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Bojxona Yangiliklari va TIF TN O'zgarishlari</span>
                  <span className="text-[11px] text-slate-400">Yangi bojxona stavkalari va ruxsatnomalar haqida eslatmalar</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.customsNews}
                  onChange={(e) => setNotifications({ ...notifications, customsNews: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 4. AI Consultant Model Options */}
          <div className="space-y-2.5">
            <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Savdo Konsaltanti Modeli</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAiModelMode('flash')}
                className={`p-3 rounded-xl border text-left transition-all duration-150 active:scale-95 cursor-pointer ${
                  aiModelMode === 'flash'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/50 shadow-md'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Gemini 3.8 Flash</span>
                  {aiModelMode === 'flash' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Tezkor savdo javoblari, TIF TN qidiruvi va kalkulyatsiya</span>
              </button>

              <button
                type="button"
                onClick={() => setAiModelMode('pro')}
                className={`p-3 rounded-xl border text-left transition-all duration-150 active:scale-95 cursor-pointer ${
                  aiModelMode === 'pro'
                    ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/50 shadow-md'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Chuqurlashtirilgan Tahlil</span>
                  {aiModelMode === 'pro' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Ko'p yillik makroiqtisodiy bozor prognozlari</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Standart holatga qaytarish</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer"
            >
              Yopish
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-black rounded-xl shadow-lg transition-all duration-150 active:scale-95 hover:scale-[1.03] cursor-pointer ${
                isSaved
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  <span>Saqlandi!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Sozlamalarni Saqlash</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
