import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Truck, 
  Train, 
  Plane, 
  Ship, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  Filter, 
  Search, 
  Sparkles, 
  Layers, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertTriangle,
  Globe2,
  TrendingUp,
  Scale,
  Calendar,
  Share2,
  X
} from 'lucide-react';
import { TradeRoute, BorderCheckpoint, TransportOption } from '../types/trade';
import { 
  TRADE_ROUTES_DATA, 
  LOGISTICS_CORRIDORS, 
  UZBEKISTAN_HUBS, 
  INTERNATIONAL_HUBS, 
  DISTANCE_MATRIX 
} from '../data/logisticsData';
import { InteractiveLogisticsMap } from './InteractiveLogisticsMap';

interface LogisticsRoadmapProps {
  onSendToChat?: (prompt: string) => void;
  externalSearchFilter?: string;
}

export const LogisticsRoadmap: React.FC<LogisticsRoadmapProps> = ({
  onSendToChat,
  externalSearchFilter = '',
}) => {
  // State
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'export' | 'import'>('all');
  const [selectedCorridorFilter, setSelectedCorridorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(externalSearchFilter);
  const [selectedRoute, setSelectedRoute] = useState<TradeRoute | null>(null);
  const [activeTab, setActiveTab] = useState<'schematic' | 'map' | 'routes' | 'calculator'>('schematic');

  // Interactive Route Calculator State
  const [calcOrigin, setCalcOrigin] = useState<string>('Toshkent');
  const [calcDestination, setCalcDestination] = useState<string>('Frankfurt (Germaniya / EI)');
  const [calcDirection, setCalcDirection] = useState<'export' | 'import'>('export');
  const [calcCargoCategory, setCalcCargoCategory] = useState<string>('Meva-sabzavot (Gilos, Pomidor)');
  const [calcCargoWeightTons, setCalcCargoWeightTons] = useState<number>(20);
  const [calcTransportMode, setCalcTransportMode] = useState<string>('Avto-Refrijerator (+2°C / +4°C)');

  // Filtered routes
  const filteredRoutes = useMemo(() => {
    return TRADE_ROUTES_DATA.filter((route) => {
      // Type filter
      if (selectedTypeFilter === 'export' && route.type === 'import') return false;
      if (selectedTypeFilter === 'import' && route.type === 'export') return false;

      // Corridor filter
      if (selectedCorridorFilter !== 'all' && route.corridorName !== selectedCorridorFilter) return false;

      // Search query
      const query = (searchQuery || externalSearchFilter).toLowerCase().trim();
      if (!query) return true;

      return (
        route.name.toLowerCase().includes(query) ||
        route.originCity.toLowerCase().includes(query) ||
        route.destinationCity.toLowerCase().includes(query) ||
        route.destinationCountry.toLowerCase().includes(query) ||
        route.corridorName.toLowerCase().includes(query) ||
        route.exportCargo.some((c) => c.toLowerCase().includes(query)) ||
        route.importCargo.some((c) => c.toLowerCase().includes(query)) ||
        route.transitCountries.some((c) => c.toLowerCase().includes(query))
      );
    });
  }, [selectedTypeFilter, selectedCorridorFilter, searchQuery, externalSearchFilter]);

  // Calculator computation
  const calcResult = useMemo(() => {
    const originMatrix = DISTANCE_MATRIX[calcOrigin] || DISTANCE_MATRIX['Toshkent'];
    const destData = originMatrix[calcDestination] || {
      distanceKm: 4200,
      transitDays: '8-12 kun',
      costTirUsd: 4800,
      costTrainUsd: 4100,
      recommendedMode: 'Avtotransport (TIR)'
    };

    let baseCost = destData.costTirUsd;
    let days = destData.transitDays;
    let modeIcon = Truck;

    if (calcTransportMode.includes('Temiryo')) {
      baseCost = destData.costTrainUsd;
      modeIcon = Train;
    } else if (calcTransportMode.includes('Avia')) {
      baseCost = Math.round(destData.distanceKm * 2.1 * (calcCargoWeightTons > 10 ? 10 : calcCargoWeightTons));
      days = '1 - 2 kun (14-18 soat)';
      modeIcon = Plane;
    } else if (calcTransportMode.includes('Refrijerator')) {
      baseCost = Math.round(destData.costTirUsd * 1.18);
      modeIcon = Truck;
    } else if (calcTransportMode.includes('Multimodal')) {
      baseCost = Math.round(destData.costTrainUsd * 1.05);
      days = '14 - 18 kun';
      modeIcon = Ship;
    }

    // Weight multiplier adjustment for TIR / containers
    const containersCount = Math.max(1, Math.ceil(calcCargoWeightTons / 22));
    const totalEstimatedCost = baseCost * containersCount;
    const costPerKg = (totalEstimatedCost / (calcCargoWeightTons * 1000)).toFixed(2);
    const costPerTon = Math.round(totalEstimatedCost / calcCargoWeightTons);

    return {
      distanceKm: destData.distanceKm,
      transitDays: days,
      totalEstimatedCost,
      costPerKg,
      costPerTon,
      containersCount,
      modeIcon
    };
  }, [calcOrigin, calcDestination, calcDirection, calcCargoCategory, calcCargoWeightTons, calcTransportMode]);

  // Trigger AI consultation from route or calculator
  const handleConsultWithAI = (customPrompt?: string) => {
    if (!onSendToChat) return;

    if (customPrompt) {
      onSendToChat(customPrompt);
      return;
    }

    const prompt = `LOGISTIKA YO'L XARITASI BO'YICHA SO'ROV:
• Yo'nalish: ${calcOrigin} -> ${calcDestination} (${calcDirection === 'export' ? 'Eksport' : 'Import'})
• Masofa: ~${calcResult.distanceKm} km
• Yuk turi: ${calcCargoCategory}, Hajmi: ${calcCargoWeightTons} tonna
• Transport turi: ${calcTransportMode}
• Taxminiy tranzit vaqti: ${calcResult.transitDays}, Kutilayotgan xarajat: $${calcResult.totalEstimatedCost.toLocaleString()}

Iltimos, ushbu marshrut bo'yicha:
1. Eng optimal chegara o'tkazish punktlari va ulardagi ehtimoliy navbatlar
2. Zarur xalqaro hujjatlar (CMR, TIR Carnet, ST-1 / EUR.1 GSP+, Fitosanitariya/Karantin)
3. Yo'lda yukning sifatini saqlash (temperatura, yuklash qoidalari)
4. Xarajatlarni 10-15% gacha tejash bo'yicha amaliy maslahatlar berib bering.`;

    onSendToChat(prompt);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner with Modern Corridor Indicators */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/30 p-5 sm:p-7 shadow-2xl shadow-sky-950/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mb-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold tracking-wide">
              <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>3-Bo'lim: Xalqaro Savdo Yo'laklari & Yo'l Xaritasi</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Eksport va Import O'rtasidagi <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 via-teal-300 to-amber-300">Masofalar & Yo'l Xaritasi</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              O'zbekistonning Markaziy Osiyo, Yevropa Ittifoqi (GSP+), Xitoy, Rossiya, Turkiya va Fors ko'rfazi bozorlari bilan bog'lovchi asosiy quruqlik, temiryo'l va multimodal koridorlari, real masofalar, tranzit muddatlari va chegara bojxona tahlili.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <span className="text-[11px] text-slate-400 block font-semibold">Asosiy Koridorlar</span>
                <span className="text-lg font-black text-white">4 ta Strategik</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <span className="text-[11px] text-slate-400 block font-semibold">GSP+ EI Masofasi</span>
                <span className="text-lg font-black text-emerald-400">5,420 km</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <span className="text-[11px] text-slate-400 block font-semibold">Xitoy Silk Road</span>
                <span className="text-lg font-black text-amber-400">10-14 kun</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <span className="text-[11px] text-slate-400 block font-semibold">Eng Yaqin Dengiz Porti</span>
                <span className="text-lg font-black text-cyan-400">2,380 km</span>
              </div>
            </div>
          </div>

          {/* Quick CTA to Ask AI Logist */}
          <div className="lg:w-72 shrink-0 bg-slate-950/80 border border-sky-500/40 rounded-xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center gap-2 text-sky-300 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Logistika Konsultanti</span>
            </div>
            <p className="text-xs text-slate-300 leading-normal mb-3">
              Yukingiz xususiyatidan kelib chiqib eng arzon, tezkor va xavfsiz marshrutni hisoblang.
            </p>
            <button
              onClick={() => handleConsultWithAI()}
              className="w-full py-2.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <span>AI bilan Marshrut Tuzish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View Mode Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* TAB 0: Namangan -> Xalqaro Jonli Sxematik Marshrut */}
          <button
            onClick={() => setActiveTab('schematic')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-sm ${
              activeTab === 'schematic'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 border border-amber-300'
                : 'bg-slate-900/90 text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/30'
            }`}
          >
            <Compass className={`w-4 h-4 ${activeTab === 'schematic' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>Namangan ➔ Xalqaro Marshrutlar (Jonli SXEMA)</span>
            <span className="text-[10px] bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded font-extrabold border border-amber-400/40">
              JONLI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-sm ${
              activeTab === 'map'
                ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/25'
                : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>5 Koridor Xaritasi</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-sm ${
              activeTab === 'calculator'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Masofa & Xarajat Kalkulyatori</span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-sm ${
              activeTab === 'routes'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Marshrutlar Ro'yxati ({filteredRoutes.length})</span>
          </button>
        </div>

        {/* Trade Direction Quick Switcher */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setSelectedTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedTypeFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Barcha Yo'nalishlar
          </button>
          <button
            onClick={() => setSelectedTypeFilter('export')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedTypeFilter === 'export'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Faqat Eksport</span>
          </button>
          <button
            onClick={() => setSelectedTypeFilter('import')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedTypeFilter === 'import'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            <span>Faqat Import</span>
          </button>
        </div>
      </div>

      {/* Corridor Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {LOGISTICS_CORRIDORS.map((corridor) => (
          <div
            key={corridor.id}
            onClick={() => setSelectedCorridorFilter(selectedCorridorFilter === corridor.name ? 'all' : corridor.name)}
            className={`p-3.5 rounded-xl border bg-gradient-to-br transition-all duration-150 cursor-pointer text-left group ${corridor.color} ${
              selectedCorridorFilter === corridor.name 
                ? 'ring-2 ring-white/60 scale-[1.02]' 
                : 'hover:border-white/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 border border-white/10">
                {corridor.badge}
              </span>
              <span className="text-[11px] font-bold text-white/90">
                {corridor.tradeSharePercent}% ulush
              </span>
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
              {corridor.name}
            </h3>
            <p className="text-[11px] text-slate-300/80 mt-1 line-clamp-2 leading-relaxed">
              {corridor.description}
            </p>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-white/70" />
                {corridor.avgTransitDays}
              </span>
              <span className="font-semibold text-white/90">{corridor.mainType}</span>
            </div>
          </div>
        ))}
      </div>

      {/* TAB 0: ANIMATED SCHEMATIC ROUTE MAP (Namangan -> Tashkent -> Khorgos -> Destinations) */}
      {activeTab === 'schematic' && (
        <div className="space-y-4">
          <InteractiveLogisticsMap onSendToChat={onSendToChat} />
        </div>
      )}

      {/* TAB 1: INTERACTIVE MAP VISUALIZER */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-6 overflow-hidden shadow-2xl">
            
            {/* Map Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 z-10 relative">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-sky-400" />
                  <span>Xalqaro Tranzit & Savdo Yo'laklari Sxematik Xaritasi</span>
                </h2>
                <p className="text-xs text-slate-400">
                  O'zbekiston transport xabidan Yevropa, Osiyo va dengiz portlariga eltuvchi real koridorlar
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-semibold flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Eksport Oqimlari
                </span>
                <span className="flex items-center gap-1.5 text-rose-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  Import Oqimlari
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  Multimodal / Dengiz Portlari
                </span>
              </div>
            </div>

            {/* Stylized Interactive Map Canvas (SVG) */}
            <div className="relative w-full aspect-[16/9] min-h-[360px] max-h-[580px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
              
              {/* Background Geographic Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Continents Subtle Silhouette Paths */}
              <svg viewBox="0 0 1000 600" className="w-full h-full absolute inset-0 select-none">
                <defs>
                  {/* Glowing line gradients */}
                  <linearGradient id="grad-eu" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="grad-cn" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <linearGradient id="grad-ru" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                  <linearGradient id="grad-ir" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>

                  {/* Pulsing filters */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Stylized continent silhouettes */}
                {/* Europe */}
                <path d="M120 120 Q180 100 240 130 T280 200 T220 280 T140 240 Z" fill="#1e293b" opacity="0.4" />
                {/* Russia / North Eurasia */}
                <path d="M260 90 Q400 60 600 80 T800 120 T750 200 T450 180 T280 140 Z" fill="#1e293b" opacity="0.35" />
                {/* Central Asia (Uzbekistan Hub area) */}
                <path d="M420 260 Q490 240 550 270 T540 360 T440 360 Z" fill="#0f766e" opacity="0.3" />
                {/* Middle East & Iran */}
                <path d="M260 300 Q360 290 410 350 T380 440 T280 390 Z" fill="#1e293b" opacity="0.4" />
                {/* South Asia / Pakistan / India */}
                <path d="M460 380 Q520 370 560 440 T520 540 T440 450 Z" fill="#1e293b" opacity="0.4" />
                {/* China & East Asia */}
                <path d="M620 220 Q780 200 880 270 T860 420 T700 420 T600 320 Z" fill="#1e293b" opacity="0.45" />

                {/* --- CONNECTING TRADE CORRIDORS PATHS --- */}
                
                {/* 1. Trans-Caspian Middle Corridor: Tashkent -> Baku -> Poti -> Frankfurt (Europe GSP+) */}
                <path
                  d="M 480 310 Q 360 280 290 280 T 170 190"
                  fill="none"
                  stroke="url(#grad-eu)"
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
                
                {/* 2. Northern Corridor: Tashkent -> Moscow */}
                <path
                  d="M 480 310 Q 380 220 270 160"
                  fill="none"
                  stroke="url(#grad-ru)"
                  strokeWidth="3"
                  strokeDasharray="5,4"
                />

                {/* 3. Eastern Silk Road: Lianyungang/China -> Tashkent */}
                <path
                  d="M 820 280 Q 660 250 480 310"
                  fill="none"
                  stroke="url(#grad-cn)"
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                />

                {/* 4. Turkey Corridor: Tashkent -> Tehran -> Istanbul */}
                <path
                  d="M 480 310 Q 370 330 250 280"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.8"
                  strokeDasharray="4,4"
                />

                {/* 5. Southern Iran: Tashkent -> Bandar-Abbas */}
                <path
                  d="M 480 310 Q 430 380 390 440"
                  fill="none"
                  stroke="url(#grad-ir)"
                  strokeWidth="3"
                />

                {/* 6. Trans-Afghan: Tashkent -> Termiz -> Karachi Port */}
                <path
                  d="M 480 310 Q 480 380 500 470"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="5,3"
                />

                {/* 7. Persian Gulf: Tashkent -> Dubai */}
                <path
                  d="M 480 310 Q 400 410 350 450"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                />

                {/* 8. Baltic: Tashkent -> Riga */}
                <path
                  d="M 480 310 Q 340 180 200 130"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />

                {/* 9. Regional: Tashkent -> Almaty */}
                <path
                  d="M 480 310 L 560 280"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* --- CITY & HUB MARKERS --- */}

                {/* Frankfurt / Europe (GSP+) */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoute(TRADE_ROUTES_DATA[0])}>
                  <circle cx="170" cy="190" r="7" fill="#10b981" filter="url(#glow)" />
                  <circle cx="170" cy="190" r="3" fill="#ffffff" />
                  <text x="170" y="175" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Frankfurt (EI) 5,420 km
                  </text>
                  <text x="170" y="208" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    GSP+ 0% Boj
                  </text>
                </g>

                {/* Moscow (Russia/CIS) */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoute(TRADE_ROUTES_DATA[1])}>
                  <circle cx="270" cy="160" r="6" fill="#38bdf8" />
                  <circle cx="270" cy="160" r="2.5" fill="#ffffff" />
                  <text x="270" y="145" fill="#7dd3fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Moskva 3,360 km
                  </text>
                  <text x="270" y="177" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    MDH Agro-xab
                  </text>
                </g>

                {/* Lianyungang / China */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoute(TRADE_ROUTES_DATA[2])}>
                  <circle cx="820" cy="280" r="7" fill="#f59e0b" filter="url(#glow)" />
                  <circle cx="820" cy="280" r="3" fill="#ffffff" />
                  <text x="820" y="265" fill="#fcd34d" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Lianyungang / Urumchi 4,850 km
                  </text>
                  <text x="820" y="298" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    Yuqori Texnologiya & Chiplar
                  </text>
                </g>

                {/* Istanbul / Turkey */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoute(TRADE_ROUTES_DATA[3])}>
                  <circle cx="250" cy="280" r="6" fill="#38bdf8" />
                  <circle cx="250" cy="280" r="2.5" fill="#ffffff" />
                  <text x="250" y="265" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Istanbul 4,150 km
                  </text>
                </g>

                {/* Bandar Abbas / Iran */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoute(TRADE_ROUTES_DATA[4])}>
                  <circle cx="390" cy="440" r="6" fill="#a855f7" />
                  <circle cx="390" cy="440" r="2.5" fill="#ffffff" />
                  <text x="390" y="460" fill="#d8b4fe" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Bandar-Abbos 2,650 km
                  </text>
                </g>

                {/* Karachi / Pakistan */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoute(TRADE_ROUTES_DATA[5])}>
                  <circle cx="500" cy="470" r="6" fill="#f59e0b" />
                  <circle cx="500" cy="470" r="2.5" fill="#ffffff" />
                  <text x="500" y="490" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Karachi porti 2,380 km
                  </text>
                </g>

                {/* Dubai / UAE */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoute(TRADE_ROUTES_DATA[6])}>
                  <circle cx="350" cy="450" r="5" fill="#06b6d4" />
                  <circle cx="350" cy="450" r="2" fill="#ffffff" />
                  <text x="320" y="465" fill="#67e8f9" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Dubay (Avia)
                  </text>
                </g>

                {/* Riga / Baltics */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoute(TRADE_ROUTES_DATA[7])}>
                  <circle cx="200" cy="130" r="5" fill="#94a3b8" />
                  <circle cx="200" cy="130" r="2" fill="#ffffff" />
                  <text x="200" y="118" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Riga 4,120 km
                  </text>
                </g>

                {/* Almaty / Kazakhstan */}
                <g className="cursor-pointer group" onClick={() => setSelectedRoute(TRADE_ROUTES_DATA[8])}>
                  <circle cx="560" cy="280" r="5" fill="#10b981" />
                  <circle cx="560" cy="280" r="2" fill="#ffffff" />
                  <text x="580" y="270" fill="#86efac" fontSize="9" fontWeight="bold" textAnchor="start">
                    Olmaota 810 km
                  </text>
                </g>

                {/* CENTRAL HUB: TASHKENT / UZBEKISTAN */}
                <g className="cursor-pointer group">
                  {/* Outer pulsating ring */}
                  <circle cx="480" cy="310" r="20" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="r" values="14;26;14" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="480" cy="310" r="11" fill="#0284c7" filter="url(#glow)" />
                  <circle cx="480" cy="310" r="5" fill="#ffffff" />
                  <text x="480" y="338" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                    O'ZBEKISTON
                  </text>
                  <text x="480" y="352" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    (Toshkent Xalqaro Xabi)
                  </text>
                </g>
              </svg>

              {/* Floating Map Helper Badge */}
              <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Har qanday shahar ustiga bosib, to'liq masofa va bojxona rejasini ko'rishingiz mumkin</span>
              </div>
            </div>

            {/* Quick Interactive Selector from Map */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-300">
                Tezkor tanlov bo'yicha masofa va tranzit vaqtlari:
              </span>
              <div className="flex flex-wrap gap-2">
                {TRADE_ROUTES_DATA.slice(0, 5).map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="font-semibold">{route.destinationCity}</span>
                    <span className="text-[10px] text-sky-400 font-mono">({route.distanceKm.toLocaleString()} km)</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <span>Eksport va Import Masofa & Logistika Xarajatlari Kalkulyatori</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Shahar, transport turi va tovar xususiyatlariga ko'ra avtomatik masofa, muddat va tannarx hisobi
              </p>
            </div>
            
            {/* Direction Selector */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setCalcDirection('export')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  calcDirection === 'export'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Eksport (O'zbekistondan)</span>
              </button>
              <button
                onClick={() => setCalcDirection('import')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  calcDirection === 'import'
                    ? 'bg-rose-500 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Import (O'zbekistonga)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Config Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Origin */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {calcDirection === 'export' ? "Jo'nash Nuqtasi (O'zbekiston)" : "Xorijiy Yetkazib Beruvchi Shahar"}
                    </span>
                  </label>
                  {calcDirection === 'export' ? (
                    <select
                      value={calcOrigin}
                      onChange={(e) => setCalcOrigin(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 font-semibold"
                    >
                      {UZBEKISTAN_HUBS.map((h) => (
                        <option key={h.city} value={h.city}>
                          {h.city} ({h.country})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={calcDestination}
                      onChange={(e) => setCalcDestination(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 font-semibold"
                    >
                      {INTERNATIONAL_HUBS.map((h) => (
                        <option key={h.city} value={h.city}>
                          {h.city}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {calcDirection === 'export' ? "Qabul Qiluvchi Davlat / Bozor" : "Qabul Qiluvchi Shahar (O'zbekiston)"}
                    </span>
                  </label>
                  {calcDirection === 'export' ? (
                    <select
                      value={calcDestination}
                      onChange={(e) => setCalcDestination(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 font-semibold"
                    >
                      {INTERNATIONAL_HUBS.map((h) => (
                        <option key={h.city} value={h.city}>
                          {h.city}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={calcOrigin}
                      onChange={(e) => setCalcOrigin(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 font-semibold"
                    >
                      {UZBEKISTAN_HUBS.map((h) => (
                        <option key={h.city} value={h.city}>
                          {h.city} ({h.country})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Cargo Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Yuk Turi va Spetsifikatsiyasi
                </label>
                <select
                  value={calcCargoCategory}
                  onChange={(e) => setCalcCargoCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
                >
                  <option value="Meva-sabzavot (Gilos, Pomidor)">Meva-sabzavot (Gilos, shaftoli, pomidor — Harorat nazorati zarur)</option>
                  <option value="To'qimachilik & Paxta kalava ipi">To'qimachilik & Paxta kalava ipi (Oddiy tent, namlikdan himoya)</option>
                  <option value="Mis katodi & Metall quvurlar">Mis katodi, armatura & metall quvurlar (Og'ir vazn, temiryo'l)</option>
                  <option value="Yuqori Texnologiyalar & Elektronika">Yuqori Texnologiyalar, smartfonlar va mikrosxemalar (Xavfsiz kargo)</option>
                  <option value="Qurilish mollari & Xomashyo">Qurilish mollari, sement va yog'och taxtalar</option>
                  <option value="Farmatsevtika & Tibbiyot apparatlari">Farmatsevtika & Tibbiyot apparatlari (+2°C / +8°C)</option>
                </select>
              </div>

              {/* Weight & Transport Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Yuk Hajmi (Tonna)
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {calcCargoWeightTons} tonna
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={calcCargoWeightTons}
                    onChange={(e) => setCalcCargoWeightTons(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 tonna</span>
                    <span>20 t (1 TIR)</span>
                    <span>60 t (Temiryo'l)</span>
                    <span>100 t</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Transport Turi
                  </label>
                  <select
                    value={calcTransportMode}
                    onChange={(e) => setCalcTransportMode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 font-semibold"
                  >
                    <option value="Avto-Refrijerator (+2°C / +4°C)">Avto-Refrijerator (+2°C / +4°C sovutilgan)</option>
                    <option value="Avtotransport (TIR tent)">Avtotransport (TIR tent 22 tonna)</option>
                    <option value="Temiryo'l (40ft HQ konteyner)">Temiryo'l (40ft HQ konteyner / blok-poyezd)</option>
                    <option value="Multimodal (Kema + Poezd)">Multimodal (Transkaspiy kema + temiryo'l)</option>
                    <option value="Avia Kargo (Ekspress)">Avia Kargo (Tezkor parvoz)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleConsultWithAI()}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer transition"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Ushbu Parametrlar Bo'yicha AI Rejasini Olish</span>
                </button>
              </div>
            </div>

            {/* Right Calculation Results Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Hisoblangan Yo'l Xaritasi Ko'rsatkichlari</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {calcDirection === 'export' ? 'Eksport' : 'Import'}
                  </span>
                </div>

                <div className="space-y-3.5 mt-4">
                  {/* Distance */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Umumiy Masofa</span>
                        <span className="text-sm font-bold text-white">
                          {calcOrigin} → {calcDestination}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-sky-400 font-mono">
                      {calcResult.distanceKm.toLocaleString()} km
                    </span>
                  </div>

                  {/* Transit Days */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Kutilayotgan Tranzit Vaqti</span>
                        <span className="text-xs font-semibold text-slate-300">{calcTransportMode}</span>
                      </div>
                    </div>
                    <span className="text-base font-black text-teal-300 font-mono">
                      {calcResult.transitDays}
                    </span>
                  </div>

                  {/* Cost Summary */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-200 font-bold">Taxminiy Transport Xarajati:</span>
                      <span className="text-xl font-black text-amber-400 font-mono">
                        ${calcResult.totalEstimatedCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-amber-500/20 pt-2">
                      <span>1 kg uchun transport tannarxi:</span>
                      <span className="font-mono text-white font-bold">${calcResult.costPerKg} / kg</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>1 tonna uchun narx:</span>
                      <span className="font-mono text-white font-bold">${calcResult.costPerTon} / t</span>
                    </div>
                  </div>

                  {/* Customs & Certs Tip */}
                  <div className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-300 block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Tavsiya etiladigan Hujjatlar:
                    </span>
                    <p className="leading-relaxed text-[11px] text-slate-400">
                      {calcDestination.includes('Frankfurt') || calcDestination.includes('Rotterdam')
                        ? 'EUR.1 / REX (GSP+ 0% boj), TIR Carnet, CMR, Fitosanitariya xulosasi.'
                        : calcDestination.includes('Moskva') || calcDestination.includes('Olmaota')
                        ? 'ST-1 erkin savdo sertifikati (0% boj), CMR yukxati, Rosselxoznadzor ruxsati.'
                        : calcDestination.includes('Lianyungang') || calcDestination.includes('Urumchi')
                        ? 'SMGS temiryo\'l yukxati, UZIMEI/Telekom sertifikati, bojxona tranzit deklaratsiyasi.'
                        : 'Xalqaro CMR yukxati, TIR Carnet, kelib chiqish sertifikati.'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 text-center">
                * Ko'rsatkichlar mavsumiy yonilg'i narxlari, chegara navbatlari va logistika tariflariga binoan o'zgarishi mumkin.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: ROUTES LIST CATALOG */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Shahar, davlat, koridor yoki tovar nomi bo'yicha qidiring (masalan: Frankfurt, gilos, poezd)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCorridorFilter}
                onChange={(e) => setSelectedCorridorFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 font-semibold focus:outline-hidden"
              >
                <option value="all">Barcha Koridorlar</option>
                <option value="Transkaspiy O'rta Koridor (TITR)">Transkaspiy (EI / GSP+)</option>
                <option value="Shimoliy Koridor (Qozogʻiston — Rossiya)">Shimoliy Koridor (Rossiya/MDH)</option>
                <option value="Sharqiy Koridor (Xitoy — O'zbekiston)">Sharqiy Koridor (Xitoy)</option>
                <option value="Turkiya & O'rta Yer Dengizi Yo'lagi">Turkiya & O'rta Yer</option>
                <option value="Janubiy Eron Koridori (Dengiz yoʻli)">Eron / Bandar-Abbos</option>
                <option value="Trans-Afg'on & Janubiy Osiyo Koridori">Trans-Afg'on / Pokiston</option>
              </select>
            </div>
          </div>

          {/* Routes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className="bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-4.5 transition-all duration-150 cursor-pointer flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-3">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-sky-300 truncate max-w-[190px]">
                      {route.corridorName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      route.status === 'Faol va tezkor'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : route.status === 'Strategik rivojlanayotgan'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  {/* Route Title & Distance */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition flex items-center justify-between">
                      <span>{route.name}</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono font-black text-amber-400">
                        {route.distanceKm.toLocaleString()} km
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {route.transitDaysRange}
                      </span>
                    </div>
                  </div>

                  {/* Export & Import Preview Tags */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 shrink-0 mt-0.5">Eksport:</span>
                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        {route.exportCargo.slice(0, 2).join(', ')}...
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] font-bold text-rose-400 shrink-0 mt-0.5">Import:</span>
                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        {route.importCargo.slice(0, 2).join(', ')}...
                      </p>
                    </div>
                  </div>

                  {/* Key Advantage Snippet */}
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    {route.keyAdvantage}
                  </p>
                </div>

                {/* Footer with Price & Details CTA */}
                <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Konteyner / FTL narxi:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ${route.avgCostPerContainerUsd.toLocaleString()} / 40ft
                    </span>
                  </div>
                  <span className="text-xs text-sky-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    <span>Batafsil</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredRoutes.length === 0 && (
            <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <Compass className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-white">So'rovingiz bo'yicha marshrut topilmadi</p>
              <p className="text-xs text-slate-400">Qidiruv so'zini o'zgartirib ko'ring yoki barcha koridorlarni tanlang.</p>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL FOR SELECTED ROUTE */}
      {selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-slate-950 border border-sky-500/40 w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                  {selectedRoute.corridorName}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedRoute.name}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="font-mono text-amber-400 font-bold">
                    {selectedRoute.distanceKm.toLocaleString()} km
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-semibold">
                    {selectedRoute.transitDaysRange}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    O'rtacha ${selectedRoute.avgCostPerContainerUsd.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tranzit davlatlari */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>Tranzit Davlatlar va Yo'nalish Zanjiri:</span>
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedRoute.transitCountries.map((country, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    {country}
                  </span>
                ))}
              </div>
            </div>

            {/* Transport Options Comparison */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">
                Mavjud Transport Turlari & Tariflar:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedRoute.transportOptions.map((opt, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{opt.mode}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{opt.costFormatted}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Muddat: {opt.durationDays}</span>
                      <span className="text-slate-500">{opt.capacity}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 line-clamp-1">
                      Tavsiya: {opt.recommendedFor}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Export & Import Commodities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  Eksport Tovar Oqimi (O'zbekistondan):
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  {selectedRoute.exportCargo.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                  Import Tovar Oqimi (O'zbekistonga):
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  {selectedRoute.importCargo.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Checkpoints Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Asosiy Bojxona va Chegara O'tkazish Punktlari:
              </span>
              <div className="space-y-1.5">
                {selectedRoute.borderCheckpoints.map((cp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div>
                      <span className="font-bold text-white block">{cp.name}</span>
                      <span className="text-[10px] text-slate-400">{cp.country} ({cp.type})</span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      Kutish: {cp.avgWaitHours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Customs Documents */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                Majburiy Xalqaro Bojxona Hujjatlari:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedRoute.customsDocuments.map((doc, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-700 text-[11px] text-slate-300 font-medium">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  const prompt = `LOGISTIKA REJASI SO'ROVI: "${selectedRoute.name}" (${selectedRoute.corridorName}, masofa: ${selectedRoute.distanceKm} km). Ushbu yo'nalish bo'yicha tovar yetkazishning eng optimal usuli, qish/bahor mavsumidagi xatarlar va transport narxini kamaytirish bo'yicha tavsiyalarni tahlil qilib bering.`;
                  setSelectedRoute(null);
                  handleConsultWithAI(prompt);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer transition active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Ushbu Marshrut Rejasini AI bilan Batafsil Tuzish</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
