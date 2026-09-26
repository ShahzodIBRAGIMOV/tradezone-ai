import React, { useState } from 'react';
import { 
  X, 
  FolderTree, 
  Database, 
  LayoutDashboard, 
  MessageSquareCode, 
  Copy, 
  Check, 
  Code2, 
  Sparkles,
  Server,
  Layers,
  Cpu
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const folderStructureCode = `tradezone-ai/
├── prisma/
│   └── schema.prisma            # PostgreSQL Prisma ORM sxemasi (User, ExportProduct, ImportStat, TechProduct)
├── server.ts                    # Full-stack Express server + Gemini AI (gemini-3.8-flash) + RAG + AI Search
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # B2B yuqori panel, TradeZone logosi, rol & Top Right Menyu
│   │   ├── AISmartSearchBar.tsx # Sun'iy intellekt ulangan avtomatik mahsulot qidiruvi
│   │   ├── NavigationDrawer.tsx # O'ng yuqori burchakdagi barcha bo'limlar menyusi (stagger effect)
│   │   ├── SettingsModal.tsx    # Tizim tili, valyuta ko'rinishi, bildirishnomalar va AI sozlamalari
│   │   ├── AboutModal.tsx       # TradeZone AI missiyasi, GSP+ registri va texnik arxitekturasi
│   │   ├── ExportCatalog.tsx    # 1-Bo'lim: Eksport katalogi, TIF TN, GSP+ va bozor tahlili
│   │   ├── ImportAnalytics.tsx  # 2-Bo'lim: Import tahlili, Yuqori texnologiyalar, "Qizil Hudud" va mahalliylashtirish
│   │   ├── FloatingAIChat.tsx   # C. Doimiy ochiq Smart AI Chat (4 ta superimkoniyat)
│   │   ├── FinancialCalculatorModal.tsx # Moliyaviy xarajat va foyda kalkulyatori
│   │   ├── ProductDetailModal.tsx       # TIF TN va sertifikatlar to'liq kartochkasi
│   │   └── OnboardingModal.tsx  # Foydalanuvchi ro'yxatdan o'tishi va roli
│   ├── data/
│   │   └── tradeDatabase.ts     # Eksport, Import va Texnika (smartfon, chiplar) ma'lumotlari
│   ├── types/
│   │   └── trade.ts             # TypeScript interfeyslari (TechProduct, AISearchResult, etc.)
│   ├── App.tsx                  # Asosiy ilova ssenariysi & Neoclassical dark background
│   ├── main.tsx                 # React DOM rejimida ishga tushirish
│   └── index.css                # Tailwind CSS v4 styling
├── package.json                 # Loyiha kutubxonalari
├── tsconfig.json                # TypeScript konfiguratsiyasi
└── vite.config.ts               # Vite & Tailwind plaginlari`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950/95 rounded-2xl shadow-2xl max-w-4xl w-full border border-amber-500/30 overflow-hidden max-h-[92vh] flex flex-col text-white backdrop-blur-xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                TradeZone AI — Arxitektura & Reja
              </h2>
              <p className="text-xs text-amber-300/80">
                Loyiha papka strukturasi, Prisma sxemasi, Texnika bo'limi va AI qidiruv mantig'i
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
              activeStep === 1
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>1-Qadam: Papka & Kutubxonalar</span>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
              activeStep === 2
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2-Qadam: Prisma Schema</span>
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
              activeStep === 3
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>3-Qadam: Eksport, Import & Texnika</span>
          </button>

          <button
            onClick={() => setActiveStep(4)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
              activeStep === 4
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>4-Qadam: AI Qidiruv & Chatbot</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-amber-400" />
                  <span>Loyihaning Papka Strukturasi (Folder Structure)</span>
                </h3>
                <button
                  onClick={() => copyToClipboard(folderStructureCode)}
                  className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 bg-slate-800 px-2.5 py-1 rounded transition-all duration-150 active:scale-95 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Nusxalandi' : 'Nusxa olish'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-amber-300 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                {folderStructureCode}
              </pre>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>PostgreSQL Ma'lumotlar Bazasi Sxemasi (Prisma ORM)</span>
              </h3>
              <p className="text-xs text-slate-300">
                Eksport tovarlari, Import statistikasi, Yuqori texnologiyalar (Smartfonlar, Chiplar), foydalanuvchilar va savdo hisoblari to'liq qamrab olingan.
              </p>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Frontend Dashboard: 3 Asosiy Bo'lim</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30">
                  <span className="font-bold text-emerald-300 block mb-1">1-Bo'lim: Eksport Katalogi</span>
                  <p className="text-slate-400 text-xs">GSP+ 0% Yevropa preferensiyasi, MDH shartnomalari, saralangan qishloq xo'jaligi va sanoat tovarlari.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30">
                  <span className="font-bold text-rose-300 block mb-1">2-Bo'lim: Import & Qizil Hudud</span>
                  <p className="text-slate-400 text-xs">Keskin oshgan import mahsulotlari (o'simlik moyi, karton, metall), mahalliylashtirish tavsiyasi.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30">
                  <span className="font-bold text-amber-300 block mb-1">3-Bo'lim: Texnika & Chiplar</span>
                  <p className="text-slate-400 text-xs">Smartfonlar ($1.18B), integral mikrosxemalar ($385M), noutbuklar va O'zbekistonda yig'uv (SKD) imkoniyati.</p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI-Powered Avtomatik Qidiruv & Smart AI Chat</span>
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Qidiruv maydoniga ixtiyoriy tovar nomi (masalan, iPhone, chip, olma, moy, traktor) yozilganda, 
                tizim avtomatik ravishda uning TIF TN kodini, O'zbekiston bojxona stavkalarini, GSP+ preferensiyalarini va tavsiyalarini bir zumda chiqarib beradi.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-amber-400/90 font-medium">
            TradeZona AI to'liq yangilandi va ishchi holatda.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
