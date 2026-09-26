import React from 'react';
import { 
  X, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Globe2, 
  Cpu, 
  Building2, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  FileCheck2,
  Zap,
  TrendingUp,
  Server
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  customLogoUrl?: string;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  customLogoUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full border border-cyan-500/30 overflow-hidden text-white backdrop-blur-xl flex flex-col max-h-[92vh]">
        
        {/* Header with Circular Logo */}
        <div className="px-6 py-6 border-b border-slate-800 flex items-start justify-between bg-linear-to-r from-slate-950 via-slate-900 to-cyan-950/40 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <img
                src={customLogoUrl || "/assets/tradezone_logo.png"}
                alt="TradeZone AI"
                className="w-20 h-20 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Trade<span className="text-cyan-400">Zone</span> AI
                </h2>
                <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  v2.4.0
                </span>
              </div>
              <p className="text-xs text-amber-300 font-medium mt-0.5">
                O'zbekiston Eksport, Import va Yuqori Texnologiyalar Aqlli B2B Platformasi
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                <span>© 2026 TradeZone AI</span>
                <span>•</span>
                <span className="text-emerald-400">Ishga tushirilgan va sertifikatlangan</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable About Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Mission Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 shadow-md space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Platformaning Asosiy Missiyasi</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              <strong className="text-white">TradeZone AI</strong> — Markaziy Osiyo va O'zbekiston tadbirkorlari, fermerlari, eksportyorlari hamda sanoat korxonalariga tashqi savdo operatsiyalarini sun'iy intellekt (Gemini 3.8) yordamida tezkor, aniq va eng yuqori foyda bilan amalga oshirishga ko'maklashuvchi yagona milliy B2B intellektual ekotizimidir.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="space-y-3">
            <span className="text-slate-300 font-bold uppercase tracking-wider block text-[11px]">
              Platformaning 4 Ta Asosiy Imkoniyati:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>1. GSP+ 6,200+ Bojsiz Eksport</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Yevropa Ittifoqiga 0% boj bilan eksport qilinadigan mahsulotlar to'liq katalogi, TIF TN kodlari va ST-1/EUR.1 talablari.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-rose-500/30 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>2. Import & "Qizil Hudud" Signali</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  O'zbekistonga kirib kelayotgan va importi keskin oshgan mahsulotlar tahlili, o'rnini bosish va mahalliylashtirish biznes-rejasi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>3. Yuqori Texnologiyalar & SKD Yig'uv</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Smartfonlar, mikrosxemalar, noutbuklar, quyosh panellari va elektrotexnika bojlari, sertifikatlash va mahalliy yig'uv imkoniyatlari.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>4. Gemini 3.8 AI & Kalkulyator</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Har qanday tovar hajmi (masalan, 10 tonna olma yoki 1000 dona smartfon) uchun xarid, transport, boj va sof foydani avtomatik hisoblash.
                </p>
              </div>
            </div>
          </div>

          {/* Official Data Sources */}
          <div className="space-y-2.5">
            <span className="text-slate-300 font-bold uppercase tracking-wider block text-[11px]">
              Rasmiy Ma'lumot Manbalari & Integratsiyalar:
            </span>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>O'zbekiston Respublikasi Bojxona qo'mitasi:</strong> TIF TN kodlari, bojxona to'lovlari va imtiyozli tariflar</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Savdo-sanoat palatasi & "O'zbekekspertiza":</strong> ST-1 va EUR.1 kelib chiqish sertifikatlari</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Yevrokomissiya GSP+ Portal:</strong> 6,200 turdagi mahsulotlarga nisbatan 0% nol bojxona stavkalari</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>O'simliklar karantini va himoyasi agentligi:</strong> Fitosanitariya laboratoriya sinovlari va me'yorlari</span>
              </div>
            </div>
          </div>

          {/* Technical Architecture Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">AI Neyrotizimi</span>
              <span className="font-bold text-cyan-300">Gemini 3.8 Flash</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Frontend</span>
              <span className="font-bold text-white">React 19 + Vite</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Backend Server</span>
              <span className="font-bold text-amber-300">Node.js Express</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Dizayn Tizimi</span>
              <span className="font-bold text-emerald-300">Tailwind CSS v4</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <span className="text-[11px] text-slate-400">
            Savol va takliflar uchun rasmiy AI konsalting chati doim ochiq
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-black bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            Tushundim
          </button>
        </div>

      </div>
    </div>
  );
};
