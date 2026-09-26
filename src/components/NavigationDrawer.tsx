import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'motion/react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Compass,
  Calculator, 
  Code2, 
  UserCheck, 
  Settings, 
  Info, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Coins,
  Megaphone
} from 'lucide-react';
import { NavSection, UserProfile } from '../types/trade';
import { soundEffects } from '../utils/audioEffects';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onOpenCalculator: () => void;
  onOpenArchitecture: () => void;
  onOpenAds: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  user: UserProfile;
  redZoneCount: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  onOpenCalculator,
  onOpenArchitecture,
  onOpenAds,
  onOpenProfile,
  onOpenSettings,
  onOpenAbout,
  user,
  redZoneCount,
}) => {
  if (!isOpen) return null;

  const [cbuPreviewRates, setCbuPreviewRates] = useState<any[]>([
    { Ccy: 'USD', Rate: '12,850' },
    { Ccy: 'EUR', Rate: '13,840' },
    { Ccy: 'RUB', Rate: '142.1' },
    { Ccy: 'CNY', Rate: '1,785' },
  ]);

  useEffect(() => {
    if (isOpen) {
      soundEffects.playClick(950);
      // Fetch rates quietly in background without blocking animation
      fetch('/api/cbu-rates')
        .then(r => r.json())
        .then(data => {
          if (data?.rates && Array.isArray(data.rates)) {
            setCbuPreviewRates(data.rates);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // NATURAL SEQUENTIAL HANDOVER:
  // 1-bo'lim animatsiyasi tugashi bilan hech qanday pauzasiz darhol 2-bo'lim boshlanadi.
  // Har bir bo'lim bir xil tezlikda o'ngdan chapga silliq oqib keladi.
  const ITEM_DURATION = 0.14; // har bir bo'lim uchun 140ms
  const INITIAL_DELAY = 0.04; // boshlang'ich start

  const strictSequenceVariant: Variants = {
    hidden: { 
      opacity: 0, 
      x: 42, // o'ng tomondan chapga ravon surilish
    },
    visible: (stepNumber: number) => ({
      opacity: 1, 
      x: 0,
      transition: {
        // Avvalgi bo'lim tugashi bilan darhol keyingisi boshlanadi:
        delay: INITIAL_DELAY + (stepNumber - 1) * ITEM_DURATION,
        duration: ITEM_DURATION,
        ease: [0.16, 1, 0.3, 1], // ultra-silliq, tabiiy va sakrashlarsiz
      }
    }),
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.1 } 
    }
  };

  const sections = [
    {
      num: 1,
      numLabel: '1-BO\'LIM',
      numColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
      id: 'export' as NavSection,
      title: 'Eksport Katalogi & Tashqi Bozorlar',
      subtitle: 'TIF TN kodlari, GSP+ Yevropa 0% bojxona preferensiyasi va Namangan eksporti',
      icon: ArrowUpRight,
      accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      badge: 'GSP+ 6200+',
      action: () => onSelectSection('export'),
    },
    {
      num: 2,
      numLabel: '2-BO\'LIM',
      numColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
      id: 'import' as NavSection,
      title: 'Import Tahlili & "Qizil Hudud"',
      subtitle: 'Keskin oshgan tovarlar signallari, yuqori texnologiyalar va mahalliylashtirish',
      icon: ArrowDownRight,
      accent: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
      badge: `${redZoneCount} Qizil Hudud`,
      action: () => onSelectSection('import'),
    },
    {
      num: 3,
      numLabel: '3-BO\'LIM',
      numColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
      id: 'rates' as NavSection,
      title: 'Valyuta va Spot (Markaziy Bank)',
      subtitle: 'Davlatlar bayrog\'i bilan CBU rasmiy kurslari, jonli konvertor va Agro/Sanoat birjasi',
      icon: Coins,
      accent: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
      badge: '🇺🇸 🇪🇺 🇷🇺 🇨🇳 LIVE',
      action: () => onSelectSection('rates'),
    },
    {
      num: 4,
      numLabel: '4-BO\'LIM',
      numColor: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
      id: 'logistics' as NavSection,
      title: 'Logistika: Namangan ➔ Xalqaro Yo\'l Xaritasi',
      subtitle: 'Namangandan Toshkent va Xorgos orqali Xitoy, Rossiya, Turkiya hamda YI koridorlari',
      icon: Compass,
      accent: 'border-sky-500/50 text-sky-400 bg-sky-500/10',
      badge: 'Jonli Sxema',
      action: () => onSelectSection('logistics'),
    },
  ];

  // Asboblar va sozlamalar ro'yxati (Asboblar va Sozlamalar orasiga 7-bo'lim Reklama xizmati qo'shildi)
  const toolsAndInfo = [
    {
      num: 5,
      numLabel: '5-BO\'LIM',
      id: 'calc',
      title: 'Moliyaviy Savdo Kalkulyatori',
      subtitle: 'Transport, bojxona, qadoqlash xarajatlari va sof foyda hisobi',
      icon: Calculator,
      accent: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      badge: 'Hisoblash',
      action: onOpenCalculator,
    },
    {
      num: 6,
      numLabel: '6-BO\'LIM',
      id: 'arch',
      title: 'Loyiha Arxitekturasi (4-Qadam Rejasi)',
      subtitle: 'Papka strukturasi, Prisma sxemasi va Gemini AI API kodi',
      icon: Code2,
      accent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      badge: 'Tizim',
      action: onOpenArchitecture,
    },
    {
      num: 7,
      numLabel: '7-BO\'LIM',
      id: 'ads',
      title: 'Reklama & B2B Savdo E\'lonlari',
      subtitle: 'Sotmoqchi bo\'lgan tovaringizni joylashtiring, xaridorlar va hamkorlar bilan bog\'laning',
      icon: Megaphone,
      accent: 'bg-gradient-to-r from-amber-500/25 to-orange-500/25 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10',
      badge: 'Yangi E\'lon',
      action: onOpenAds,
    },
    {
      num: 8,
      numLabel: '8-BO\'LIM',
      id: 'settings',
      title: 'Platforma Sozlamalari',
      subtitle: 'Tizim tili, valyuta ko\'rinishi, signallar va AI konsaltant parametrlari',
      icon: Settings,
      accent: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badge: 'Sozlamalar',
      action: onOpenSettings,
    },
    {
      num: 9,
      numLabel: '9-BO\'LIM',
      id: 'about',
      title: 'Sayt Haqida & Ma\'lumotlar',
      subtitle: 'TradeZone AI missiyasi, GSP+ registri va versiya ma\'lumotlari',
      icon: Info,
      accent: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      badge: 'v2.4.0',
      action: onOpenAbout,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 animate-in fade-in duration-150">
      
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Drawer panel: Zero heavy backdrop-blur to ensure solid 60-120fps performance */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-slate-950 border-l border-cyan-500/40 text-white h-full shadow-2xl flex flex-col justify-between overflow-hidden transform-gpu"
      >
        {/* Header with TradeZone AI Circular Logo */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <img
                src="/assets/tradezone_logo.png"
                alt="TradeZone AI Logo"
                className="w-13 h-13 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black text-white tracking-tight">
                  Trade<span className="text-cyan-400">Zone</span> AI
                </h2>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  Menu
                </span>
              </div>
              <p className="text-[11px] text-amber-300 font-medium">
                Eksport, Import & Texnologiyalar Ekotizimi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-100 active:scale-95 cursor-pointer border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container where sections fly in sequentially from right: 1 -> 2 -> 3 -> 4... */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Main Sections: 1-bo'lim, 2-bo'lim, 3-bo'lim, 4-bo'lim */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Asosiy Bo'limlar</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">1 dan 4 gacha</span>
            </div>

            <div className="space-y-2.5">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isSelected = activeSection === sec.id;

                return (
                  <motion.div
                    key={sec.id}
                    custom={sec.num} // 1, 2, 3, 4 strictly!
                    variants={strictSequenceVariant}
                    initial="hidden"
                    animate="visible"
                    onClick={() => {
                      soundEffects.playClick(880);
                      sec.action();
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-colors duration-150 active:scale-[0.99] flex items-start gap-3.5 group transform-gpu ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400/40'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {/* Number Badge and Icon */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className={`p-2.5 rounded-xl border ${sec.accent} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md border font-mono ${sec.numColor}`}>
                        #{sec.num}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {sec.numLabel}
                          </span>
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {sec.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 whitespace-nowrap shrink-0">
                          {sec.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {sec.subtitle}
                      </p>

                      {/* Integrated CBU Quick Rates preview inside 3-Bo'lim */}
                      {sec.id === 'rates' && (
                        <div className="mt-2.5 pt-2 border-t border-amber-500/20 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-amber-300 font-mono">
                            <span>🇺🇸 USD: {cbuPreviewRates.find(x => x.Ccy === 'USD')?.Rate || '12,850'}</span>
                            <span>🇪🇺 EUR: {cbuPreviewRates.find(x => x.Ccy === 'EUR')?.Rate || '13,840'}</span>
                            <span>🇷🇺 RUB: {cbuPreviewRates.find(x => x.Ccy === 'RUB')?.Rate || '142.1'}</span>
                          </div>
                        </div>
                      )}

                      {/* Integrated Quick distances preview inside 4-Bo'lim */}
                      {sec.id === 'logistics' && (
                        <div className="mt-2.5 pt-2 border-t border-sky-500/20 flex items-center justify-between text-[10px] font-mono text-sky-300">
                          <span>🇪🇺 YI: 5,420 km</span>
                          <span>🇨🇳 Xitoy: 4,850 km</span>
                          <span>🇷🇺 Moskva: 3,360 km</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Secondary Sections: 5-bo'lim, 6-bo'lim, 7-bo'lim (Reklama), 8-bo'lim (Sozlamalar), 9-bo'lim */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Asboblar & Sozlamalar</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">5 dan 9 gacha</span>
            </div>

            <div className="space-y-2">
              {toolsAndInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.id}
                    custom={item.num} // 5, 6, 7, 8, 9 strictly!
                    variants={strictSequenceVariant}
                    initial="hidden"
                    animate="visible"
                    onClick={() => {
                      soundEffects.playClick(900);
                      onClose();
                      item.action();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors duration-150 active:scale-[0.99] cursor-pointer text-left group transform-gpu ${
                      item.id === 'ads'
                        ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-orange-500/10 border-amber-500/40 hover:border-amber-400 hover:bg-slate-850'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl border ${item.accent} shrink-0 flex flex-col items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border font-mono ${
                            item.id === 'ads'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                              : 'bg-slate-800 text-amber-300 border-slate-700'
                          }`}>
                            {item.numLabel}
                          </span>
                          <span className={`text-xs font-bold transition-colors truncate ${
                            item.id === 'ads' ? 'text-amber-200 group-hover:text-amber-300' : 'text-white group-hover:text-cyan-300'
                          }`}>
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                        item.id === 'ads'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Item 10: User Profile Card at Bottom (Appears sequentially as 10th item) */}
        <motion.div 
          custom={10}
          variants={strictSequenceVariant}
          initial="hidden"
          animate="visible"
          className="p-4 border-t border-slate-800 bg-slate-950 space-y-2 shrink-0 transform-gpu"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                10-BO'LIM
              </span>
              <span>Foydalanuvchi Profili</span>
            </span>
            <span className="text-cyan-400">Faol Rol</span>
          </div>

          <div 
            onClick={() => {
              soundEffects.playClick(910);
              onClose();
              onOpenProfile();
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-colors duration-150 active:scale-98 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 border ${
                user.role === 'TADBIRKOR'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : user.role === 'FERMER'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
              }`}>
                <UserCheck className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-white block group-hover:text-cyan-300 transition-colors truncate">
                  {user.fullName}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md border ${
                    user.role === 'TADBIRKOR'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : user.role === 'FERMER'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}>
                    {user.role === 'TADBIRKOR' ? 'Tadbirkor' : user.role === 'FERMER' ? 'Fermer / Agro' : 'Logistika'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {user.companyName}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-xs text-cyan-400 font-bold bg-cyan-500/15 hover:bg-cyan-500 hover:text-slate-950 px-2 py-1 rounded-lg border border-cyan-500/30 shrink-0 transition-colors">
              Tahrirlash
            </span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};
