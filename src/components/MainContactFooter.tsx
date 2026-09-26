import React from 'react';
import { 
  Phone, 
  PhoneCall, 
  Headphones, 
  Mail, 
  Send, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Building2, 
  Globe, 
  ShieldAlert, 
  FileCheck, 
  ExternalLink,
  HelpCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { soundEffects } from '../utils/audioEffects';

interface MainContactFooterProps {
  onOpenCalculator?: () => void;
  onOpenChatWithPrompt?: (prompt: string) => void;
}

export const MainContactFooter: React.FC<MainContactFooterProps> = ({
  onOpenCalculator,
  onOpenChatWithPrompt,
}) => {
  const handlePhoneClick = () => {
    soundEffects.playClick(850);
  };

  return (
    <footer className="w-full mt-14 pt-10 pb-8 border-t-2 border-emerald-500/30 bg-gradient-to-b from-slate-950 via-[#071322] to-slate-950 text-slate-200 relative overflow-hidden rounded-3xl shadow-2xl">
      
      {/* Decorative ambient gradient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Title and Badge */}
        <div className="text-center space-y-2.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-xs font-black uppercase tracking-wider shadow-sm">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Bog'lanish Markazi va Rasmiy Ma'lumotlar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Savollaringiz bormi? Mutaxassislarimiz bilan bog'laning
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Eksport-import bojxona to'lovlari, GSP+ sertifikatlashtirish, Namangan va xalqaro koridorlar logistikasi bo'yicha rasmiy telefon raqamlar va kontakt ma'lumotlari.
          </p>
        </div>

        {/* 4-Column Grid with Dedicated Category Logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. TELEFON RAQAMLAR (Har bir nomer oldida mos telefon logosi) */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Telefon Raqamlari</h3>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">24/7 Qaynoq Liniya</span>
                </div>
              </div>

              <ul className="space-y-3">
                {/* 1. Koll-markaz */}
                <li className="flex items-start gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Yagona Koll-markaz:</span>
                    <a 
                      href="tel:+998712004444" 
                      onClick={handlePhoneClick}
                      className="text-xs sm:text-sm font-black text-white hover:text-emerald-400 transition-colors tracking-wide"
                    >
                      +998 (71) 200-44-44
                    </a>
                  </div>
                </li>

                {/* 2. Eksport bo'limi */}
                <li className="flex items-start gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Eksportni qo'llab-quvvatlash:</span>
                    <a 
                      href="tel:+998712070404" 
                      onClick={handlePhoneClick}
                      className="text-xs sm:text-sm font-black text-white hover:text-sky-400 transition-colors tracking-wide"
                    >
                      +998 (71) 207-04-04
                    </a>
                  </div>
                </li>

                {/* 3. Logistika dispetcherligi */}
                <li className="flex items-start gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Headphones className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Logistika dispetcheri (Namangan):</span>
                    <a 
                      href="tel:+998692270011" 
                      onClick={handlePhoneClick}
                      className="text-xs sm:text-sm font-black text-white hover:text-amber-400 transition-colors tracking-wide"
                    >
                      +998 (69) 227-00-11
                    </a>
                  </div>
                </li>

                {/* 4. Bojxona ishonch telefoni */}
                <li className="flex items-start gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Bojxona ishonch telefoni:</span>
                    <a 
                      href="tel:1108" 
                      onClick={handlePhoneClick}
                      className="text-xs sm:text-sm font-black text-rose-300 hover:text-rose-200 transition-colors tracking-wider"
                    >
                      1108 <span className="text-[10px] text-slate-400 font-normal">(Qisqa raqam)</span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-emerald-400/90 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Qo'ng'iroqlar bepul va navbatsiz qabul qilinadi
              </span>
            </div>
          </div>

          {/* 2. ELEKTRON VA ONLAYN ALOQA (Har birining oldida mos logo) */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-sky-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Onlayn & Xabarlar</h3>
                  <span className="text-[10px] text-sky-400 font-mono font-bold">Tezkor Yozishma</span>
                </div>
              </div>

              <ul className="space-y-3">
                {/* 1. Telegram Kanal */}
                <li className="flex items-start gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Rasmiy Telegram Kanal:</span>
                    <a 
                      href="https://t.me" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      <span>@TradeZoneUz</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                {/* 2. Telegram Bot */}
                <li className="flex items-start gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">AI Bojxona Yordamchisi:</span>
                    <a 
                      href="https://t.me" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>@TradeZoneBot</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                {/* 3. Elektron Pochta */}
                <li className="flex items-start gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Elektron Pochta:</span>
                    <a 
                      href="mailto:info@tradezone.uz"
                      className="text-xs sm:text-sm font-bold text-indigo-300 hover:text-indigo-200 truncate block"
                    >
                      info@tradezone.uz
                    </a>
                  </div>
                </li>

                {/* 4. Rasmiy Veb-Sayt */}
                <li className="flex items-start gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Rasmiy Portal:</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-300">
                      www.tradezone.uz
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-sky-300/80 font-medium">
                Murojaatlarga o'rtacha 5 daqiqada javob beriladi
              </span>
            </div>
          </div>

          {/* 3. ISH TARTIBI VA MANZILLAR (Har birining oldida mos logo) */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Manzil & Ish Tartibi</h3>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">Ofislar</span>
                </div>
              </div>

              <ul className="space-y-3">
                {/* 1. Ish Vaqti */}
                <li className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Qabul va Ish Soatlari:</span>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      Dush — Shan: 09:00 — 18:00
                    </span>
                    <span className="text-[10px] text-slate-400">Yakshanba: Navbatchi dispetcher</span>
                  </div>
                </li>

                {/* 2. Bosh Ofis Manzili */}
                <li className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Bosh Ofis (Toshkent):</span>
                    <span className="text-xs text-white font-medium block leading-snug">
                      Toshkent sh., Bunyodkor shoh ko'chasi, 42-uy. "TIF Markazi" binosi, 4-qavat.
                    </span>
                  </div>
                </li>

                {/* 3. Namangan Agro-Logistika Filiali */}
                <li className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Namangan Logistika Markazi:</span>
                    <span className="text-xs text-white font-medium block leading-snug">
                      Namangan sh., To'raqo'rg'on shossesi, 12-uy (Eksport Agro-Xabi).
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-amber-300/80 font-medium">
                Toshkent va Namanganda yuzma-yuz qabul mavjud
              </span>
            </div>
          </div>

          {/* 4. TEZKOR FOYDALI PORTALLAR & AI YORDAM */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Rasmiy Portallar</h3>
                  <span className="text-[10px] text-purple-400 font-mono font-bold">Davlat Resurslari</span>
                </div>
              </div>

              <ul className="space-y-2.5">
                <li>
                  <a 
                    href="https://customs.uz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>customs.uz (Bojxona)</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </li>

                <li>
                  <a 
                    href="https://singlewindow.uz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>singlewindow.uz (BYuD)</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </li>

                <li>
                  <a 
                    href="https://mift.uz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>mift.uz (Savdo Vazirligi)</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </li>
              </ul>

              {/* AI Consulting Button */}
              {onOpenChatWithPrompt && (
                <button
                  onClick={() => onOpenChatWithPrompt("Assalomu alaykum! Eksport-import to'lovlari va bojxona masalalari bo'yicha maslahat olmoqchiman.")}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-sky-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>AI Konsultantdan So'rash</span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400">
                O'zbekiston Respublikasi TIF Milliy Standartlari asosida
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-black text-white">TradeZone AI</span>
            <span>• O'zbekiston Tashqi Savdo, Eksport-Import & Logistika Platformasi</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-4">
            <span>© {new Date().getFullYear()} Barcha huquqlar himoyalangan.</span>
            <span className="text-emerald-500 font-mono font-bold">Namangan ➔ Global Bozorlar</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
