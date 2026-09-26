import React, { useState, useMemo } from 'react';
import { useAppSettings } from '../context/AppSettingsContext';
import { 
  AlertTriangle, 
  TrendingUp, 
  Factory, 
  Sparkles, 
  ArrowDownRight, 
  DollarSign, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Briefcase, 
  ExternalLink,
  ChevronRight,
  Flame,
  Lightbulb,
  Cpu,
  Smartphone,
  Laptop,
  Server,
  BatteryCharging,
  Bot as DroneIcon,
  Sun,
  Activity,
  Zap,
  Globe,
  Calculator,
  ShieldCheck,
  Search
} from 'lucide-react';
import { ImportStatistic } from '../types/trade';

interface ImportAnalyticsProps {
  statistics: ImportStatistic[];
  onConsultSubstitution: (stat: ImportStatistic) => void;
  onConsultTech?: (stat: ImportStatistic, mode: 'calculator' | 'assembly' | 'customs') => void;
  externalSearchFilter?: string;
}

export const ImportAnalytics: React.FC<ImportAnalyticsProps> = ({
  statistics,
  onConsultSubstitution,
  onConsultTech,
  externalSearchFilter = '',
}) => {
  const { formatVolumeUSD } = useAppSettings();
  const [filterType, setFilterType] = useState<'all' | 'redZone' | 'tech'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [localSearch, setLocalSearch] = useState<string>('');

  const renderVolume = (rawFormatted: string) => {
    const match = rawFormatted.match(/[\d.]+/);
    if (!match) return rawFormatted;
    const num = parseFloat(match[0]);
    return formatVolumeUSD(num);
  };

  const techCategories = [
    'Smartfonlar va aloqa',
    'Mikrosxemalar va chiplar',
    'Hisoblash texnikasi',
    'Server va tarmoq',
    'Energiya va akkumulyator',
    'Quyosh va yashil texnologiya',
    'Dronlar va robototexnika',
    'Tibbiy yuqori texnologiyalar'
  ];

  const categories = [
    'Barchasi',
    'Yuqori Texnologiyalar',
    'Smartfonlar va aloqa',
    'Mikrosxemalar va chiplar',
    'Hisoblash texnikasi',
    'Server va tarmoq',
    'Energiya va akkumulyator',
    'Quyosh va yashil texnologiya',
    'Dronlar va robototexnika',
    'Tibbiy yuqori texnologiyalar',
    'Oziq-ovqat va yog\'-moy',
    'Qadoqlash',
    'Metallurgiya',
    'Farmatsevtika',
    'Texnika va agregatlar'
  ];

  const effectiveSearch = (externalSearchFilter || localSearch).trim().toLowerCase();

  const filteredStats = useMemo(() => {
    return statistics.filter((item) => {
      const matchesSearch = !effectiveSearch || 
        item.title.toLowerCase().includes(effectiveSearch) ||
        item.hsCode.toLowerCase().includes(effectiveSearch) ||
        (item.brandExamples && item.brandExamples.some(b => b.toLowerCase().includes(effectiveSearch))) ||
        item.recommendation.toLowerCase().includes(effectiveSearch);

      const isTech = techCategories.includes(item.category) || Boolean(item.imageUrl) || Boolean(item.customsDutyRate);

      let matchesFilterType = true;
      if (filterType === 'redZone') {
        matchesFilterType = item.isRedZone;
      } else if (filterType === 'tech') {
        matchesFilterType = isTech;
      }

      let matchesCategory = true;
      if (selectedCategory === 'Yuqori Texnologiyalar') {
        matchesCategory = isTech;
      } else if (selectedCategory !== 'Barchasi') {
        matchesCategory = item.category === selectedCategory;
      }

      return matchesSearch && matchesFilterType && matchesCategory;
    });
  }, [statistics, filterType, selectedCategory, effectiveSearch]);

  const totalVolume = useMemo(() => {
    return statistics.reduce((acc, curr) => acc + curr.importVolumeUsd, 0);
  }, [statistics]);

  const redZoneTotalVolume = useMemo(() => {
    return statistics
      .filter((s) => s.isRedZone)
      .reduce((acc, curr) => acc + curr.importVolumeUsd, 0);
  }, [statistics]);

  const techTotalVolume = useMemo(() => {
    return statistics
      .filter((s) => techCategories.includes(s.category) || s.id.startsWith('tech-'))
      .reduce((acc, curr) => acc + curr.importVolumeUsd, 0);
  }, [statistics]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Smartfonlar va aloqa': return Smartphone;
      case 'Mikrosxemalar va chiplar': return Cpu;
      case 'Hisoblash texnikasi': return Laptop;
      case 'Server va tarmoq': return Server;
      case 'Energiya va akkumulyator': return BatteryCharging;
      case 'Dronlar va robototexnika': return DroneIcon;
      case 'Quyosh va yashil texnologiya': return Sun;
      case 'Tibbiy yuqori texnologiyalar': return Activity;
      default: return Factory;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner for Import Substitution & High-Tech */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-950 via-slate-900 to-rose-950/80 text-white p-6 sm:p-8 shadow-2xl border border-rose-500/20 backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            2-Bo'lim: Import Tahlili & "Qizil Hudud" Signallari
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Import Tahlili & Mahalliylashtirish
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Mamlakatimizga eng ko'p kirib kelayotgan oziq-ovqat, metallurgiya, farmatsevtika hamda <strong className="text-amber-300">smartfonlar, integral chiplar, serverlar va yuqori texnologik uskunalar</strong> monitoringi. 
            Mahalliy xomashyo va SKD yig'uv asosida import o'rnini bosish bo'yicha sun'iy intellekt tahlillari.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Jami Tahlildagi Import:</span>
              <span className="text-lg font-bold text-white">
                ${(totalVolume / 1_000_000_000).toFixed(2)} Mldr+
              </span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-rose-500/30">
              <span className="text-[11px] text-rose-300 flex items-center gap-1 font-semibold">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                "Qizil Hudud" Importi:
              </span>
              <span className="text-lg font-bold text-rose-300">
                ${(redZoneTotalVolume / 1_000_000_000).toFixed(2)} Mldr
              </span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-amber-500/30">
              <span className="text-[11px] text-amber-300 flex items-center gap-1 font-semibold">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Texnika & Chiplar Importi:
              </span>
              <span className="text-lg font-bold text-amber-300">
                ${(techTotalVolume / 1_000_000_000).toFixed(2)} Mldr
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/85 backdrop-blur-md p-4 rounded-xl border border-amber-500/20 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Main Filter Tabs */}
          <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Barcha Import ({statistics.length})
            </button>
            <button
              onClick={() => setFilterType('redZone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                filterType === 'redZone'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
              Faqat "Qizil Hudud" ({statistics.filter(s => s.isRedZone).length})
            </button>
            <button
              onClick={() => setFilterType('tech')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                filterType === 'tech'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Texnika & Chiplar ({statistics.filter(s => techCategories.includes(s.category) || s.id.startsWith('tech-')).length})
            </button>
          </div>

          {/* Quick inline search for instant filter */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Import tovar yoki TIF TN kodi..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 text-white rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none pt-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                selectedCategory === c
                  ? 'bg-amber-500 text-slate-950 font-bold scale-[1.02]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Import Statistics & Tech Cards */}
      <div className="space-y-4">
        {filteredStats.map((item) => {
          const CategoryIcon = getCategoryIcon(item.category);
          const isTechItem = techCategories.includes(item.category) || Boolean(item.imageUrl) || Boolean(item.customsDutyRate);

          return (
            <div
              key={item.id}
              className={`bg-slate-900/85 backdrop-blur-md rounded-2xl border transition-all duration-200 p-5 sm:p-6 shadow-xl ${
                item.isRedZone
                  ? 'border-rose-500/40 hover:border-rose-400 hover:shadow-rose-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                
                {/* Optional Product Image for Tech/Equipment Items */}
                {item.imageUrl && (
                  <div className="w-full lg:w-48 h-36 lg:h-44 rounded-xl overflow-hidden bg-slate-950 shrink-0 relative border border-slate-800 group">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    {item.customsDutyRate && (
                      <span className="absolute bottom-2 left-2 bg-emerald-500/90 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                        {item.customsDutyRate.split('+')[0].trim()}
                      </span>
                    )}
                  </div>
                )}

                {/* Main Product Info & Volumes */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Red Zone Badge */}
                    {item.isRedZone && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        QIZIL HUDUD SIGNALI
                      </span>
                    )}
                    
                    {/* HS Code */}
                    <span className="text-xs font-mono font-bold bg-slate-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                      TIF TN: {item.hsCode}
                    </span>

                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <CategoryIcon className="w-3.5 h-3.5 text-amber-400" />
                      {item.category}
                    </span>

                    {item.customsDutyRate && (
                      <span className="text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                        {item.customsDutyRate}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {item.title}
                    </h3>
                    <span className="text-xs font-bold text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                      +{item.annualGrowthPercent}% o'sish
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Brand Examples if present */}
                  {item.brandExamples && item.brandExamples.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[11px] text-slate-400">Mashhur brendlar:</span>
                      {item.brandExamples.map((brand, idx) => (
                        <span key={idx} className="bg-slate-800 text-amber-200 px-2 py-0.2 rounded text-[11px] font-mono border border-slate-700">
                          {brand}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Import Details & Countries */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Import Hajmi (Yillik):</span>
                      <span className="text-sm font-black text-white">
                        {renderVolume(item.importVolumeFormatted)}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Ichki Bozordagi Ehtiyoj:</span>
                      <span className="text-xs font-bold text-slate-200">
                        {item.domesticDemandTon}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-slate-400 block text-[10px]">Asosiy Importyor Davlatlar:</span>
                      <span className="text-xs font-medium text-slate-300">
                        {item.originCountries.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Local Production Opportunity Box */}
                  <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                    item.isRedZone
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-100'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>Mahalliylashtirish va O'rnini Bosish Imkoniyati:</span>
                      <span className={`px-2 py-0.2 rounded text-[11px] font-bold ${
                        item.substitutionFeasibility === 'Yuqori'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.substitutionFeasibility}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed">
                      {item.recommendation}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 pt-1 text-[11px]">
                      <span>
                        <strong className="text-amber-400">Xomashyo / Komponentlar:</strong> {item.localRawMaterial || item.localComponents}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Investment metrics & Action CTA */}
                <div className="lg:w-72 shrink-0 bg-slate-950/70 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400/80">
                      Ishlab chiqarish bahosi
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Zarur investitsiya:</span>
                      <span className="text-xs font-extrabold text-white block">
                        {item.estimatedInvestment}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-slate-400">Qoplanish muddati:</span>
                      <span className="font-bold text-white">
                        {item.paybackPeriodMonths} oy
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Davlat soliq & kredit imtiyozi</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => onConsultSubstitution(item)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-linear-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-black rounded-lg shadow-md transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Biznes-reja tuzish (AI)</span>
                    </button>

                    {/* Additional action buttons for high-tech items */}
                    {isTechItem && onConsultTech && (
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => onConsultTech(item, 'calculator')}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[11px] font-bold border border-amber-500/30 transition-all duration-150 active:scale-95 cursor-pointer"
                        >
                          <Calculator className="w-3 h-3" />
                          <span>Boj & Xarajat</span>
                        </button>
                        <button
                          onClick={() => onConsultTech(item, 'assembly')}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold border border-slate-700 transition-all duration-150 active:scale-95 cursor-pointer"
                        >
                          <Cpu className="w-3 h-3 text-amber-400" />
                          <span>SKD Yig'uv</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
