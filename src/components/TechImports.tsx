import React, { useState, useMemo } from 'react';
import { 
  Smartphone, 
  Cpu, 
  Laptop, 
  Server, 
  BatteryCharging, 
  Radio, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  Layers, 
  CheckCircle2, 
  Calculator, 
  Flame, 
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Zap,
  Microchip,
  Bot as DroneIcon,
  Sun,
  Activity
} from 'lucide-react';
import { TechProduct } from '../types/trade';

interface TechImportsProps {
  products: TechProduct[];
  onConsultTech: (product: TechProduct, mode: 'calculator' | 'assembly' | 'customs') => void;
}

export const TechImports: React.FC<TechImportsProps> = ({
  products,
  onConsultTech,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'Barchasi',
    'Smartfonlar va aloqa',
    'Mikrosxemalar va chiplar',
    'Hisoblash texnikasi',
    'Server va tarmoq',
    'Energiya va akkumulyator',
    'Dronlar va robototexnika',
    'Quyosh va yashil texnologiya',
    'Tibbiy yuqori texnologiyalar'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.hsCode.includes(searchTerm) ||
        p.brandExamples.some((b) => b.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'Barchasi' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const totalTechVolume = useMemo(() => {
    return products.reduce((acc, curr) => acc + curr.importVolumeUsd, 0);
  }, [products]);

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
      default: return Zap;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner for High-Tech & Electronics */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-950 via-slate-900 to-amber-950/80 text-white p-6 sm:p-8 shadow-2xl border border-amber-500/20 backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            3-Bo'lim: Yuqori Texnologiyalar & Elektronika Importi
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Smartfonlar, Chiplar & Hisoblash Texnikalari Tahlili
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            O'zbekistonga kirib kelayotgan $2.8 Mldr+ hajmdagi mobil apparatlar, integral mikrosxemalar (chiplar), 
            noutbuklar va serverlar monitoringi hamda mahalliy yig'uv (SKD) imkoniyatlari.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-amber-500/20">
              <span className="text-[11px] text-slate-400 block">Jami Texnika Importi:</span>
              <span className="text-lg font-bold text-amber-300">
                ${(totalTechVolume / 1_000_000_000).toFixed(2)} Mldr
              </span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Bojxona Boji Imtiyozi:
              </span>
              <span className="text-lg font-bold text-emerald-300">0% Stavka (Ko'piga)</span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-blue-500/20">
              <span className="text-[11px] text-blue-400 block">Lokalizatsiya / Yig'uv:</span>
              <span className="text-lg font-bold text-blue-300">SKD & OEM Imkon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/85 backdrop-blur-md p-4 rounded-xl border border-amber-500/20 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Texnika nomi, TIF TN (masalan: 8517.13 yoki 8542), brend (iPhone, STM32, Lenovo)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/80 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-amber-400/80 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Toifa:
          </span>
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tech Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((tech) => {
          const Icon = getCategoryIcon(tech.category);
          return (
            <div
              key={tech.id}
              className="group bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-amber-500/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-200 flex flex-col overflow-hidden"
            >
              {/* Product Image & Badges */}
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                <img
                  src={tech.imageUrl}
                  alt={tech.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                {/* HS Code Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border border-amber-500/30">
                  <span className="text-amber-400">TIF TN:</span>
                  <span>{tech.hsCode}</span>
                </div>

                {/* Duty Rate Badge */}
                <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {tech.customsDutyRate.split('+')[0].trim()}
                </div>

                {/* Category & Growth */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-amber-300">
                    <Icon className="w-3 h-3" />
                    {tech.category}
                  </span>
                  <span className="flex items-center gap-1 bg-rose-950/80 border border-rose-500/40 text-rose-300 px-2 py-0.5 rounded text-[11px] font-bold">
                    +{tech.annualGrowthPercent}% o'sish
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition leading-snug">
                    {tech.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                {/* Tech Specs & Brands */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      Kelib chiqish:
                    </span>
                    <span className="font-semibold text-amber-300 text-[11px]">
                      {tech.originCountries.slice(0, 2).join(', ')}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 flex flex-wrap gap-1">
                    <span className="text-slate-400">Mashhur brendlar:</span>
                    {tech.brandExamples.map((b, i) => (
                      <span key={i} className="bg-slate-800 text-amber-200 px-1.5 py-0.2 rounded text-[10px] font-mono">
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <span className="text-amber-400 font-semibold block mb-0.5">Lokal komponentlar & Yig'uv:</span>
                    <span>{tech.localComponents}</span>
                  </div>
                </div>

                {/* Import Metrics Summary */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Yillik Import Hajmi:</span>
                    <span className="text-sm font-extrabold text-white">
                      {tech.importVolumeFormatted}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Mahalliy yig'uv imkoni:</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      {tech.localAssemblyPotential}
                    </span>
                  </div>
                </div>

                {/* Action Buttons with Fast Snappy Hover Effect */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onConsultTech(tech, 'calculator')}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold border border-amber-500/30 transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
                    title="Texnika importi xarajatlari va bojlarni hisoblash"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>AI Hisob-kitob</span>
                  </button>

                  <button
                    onClick={() => onConsultTech(tech, 'assembly')}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
                    title="O'zbekistonda yig'ish va SKD bo'yicha AI maslahati"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Yig'uv Tahlili</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
