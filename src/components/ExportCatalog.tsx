import React, { useState, useMemo } from 'react';
import { useAppSettings } from '../context/AppSettingsContext';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  ArrowUpRight, 
  Check, 
  FileText, 
  TrendingUp, 
  Truck, 
  Calculator,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { ExportProduct } from '../types/trade';

interface ExportCatalogProps {
  products: ExportProduct[];
  onConsultProduct: (product: ExportProduct, mode: 'calculator' | 'certificate' | 'market') => void;
  onOpenProductDetail: (product: ExportProduct) => void;
  externalSearchFilter?: string;
}

export const ExportCatalog: React.FC<ExportCatalogProps> = ({
  products,
  onConsultProduct,
  onOpenProductDetail,
  externalSearchFilter = '',
}) => {
  const { formatPrice } = useAppSettings();
  const [searchTerm, setSearchTerm] = useState(externalSearchFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [gspOnly, setGspOnly] = useState(false);

  // Sync external search filter if changed
  React.useEffect(() => {
    if (externalSearchFilter) {
      setSearchTerm(externalSearchFilter);
    }
  }, [externalSearchFilter]);

  const categories = ['Barchasi', 'Qishloq xo\'jaligi', 'Tekstil va charm', 'Sanoat va metallurgiya', 'Kimyo va plastmassa', 'Oziq-ovqat'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.hsCode.includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.targetCountries.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'Barchasi' || p.category === selectedCategory;
      const matchesGsp = !gspOnly || p.gspPlusEligible;

      return matchesSearch && matchesCategory && matchesGsp;
    });
  }, [products, searchTerm, selectedCategory, gspOnly]);

  return (
    <div className="space-y-6">
      
      {/* Hero Banner for Export Catalog */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-950 via-slate-900 to-emerald-950/80 text-white p-6 sm:p-8 shadow-2xl border border-emerald-500/20 backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            1-Bo'lim: O'zbekiston Eksport Katalogi
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Mahalliy Mahsulotlar Eksporti & GSP+ Bozor Tahlili
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            TIF TN kodlari, GSP+ doirasida Yevropa Ittifoqiga 0% boj preferensiyasi, MDH erkin savdo shartnomalari 
            va xalqaro sifat sertifikatlari talablari.
          </p>
          
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              GSP+ Yevropa 0% Boj
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-blue-500/30 px-3 py-1.5 rounded-xl text-blue-300 font-semibold">
              <Globe className="w-4 h-4 text-blue-400" />
              MDH Erkin Savdo Rejimi
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Smart AI Savdo Maslahati
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/85 backdrop-blur-md p-4 rounded-xl border border-amber-500/20 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Mahsulot nomi, TIF TN kodi (masalan: 0809.29) yoki mamlakat qidiring..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/80 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition"
            />
          </div>

          {/* GSP+ Checkbox Toggle with Snappy Hover */}
          <button
            onClick={() => setGspOnly(!gspOnly)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer ${
              gspOnly
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border ${gspOnly ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-500 bg-slate-900'}`}>
              {gspOnly && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Faqat GSP+ (0% boj)</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-amber-400/80 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Toifa:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 scale-[1.02]'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="group bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-amber-500/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-200 flex flex-col overflow-hidden"
          >
            {/* Image & Badges */}
            <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
              <img
                src={prod.imageUrl}
                alt={prod.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              {/* HS Code Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border border-amber-500/30">
                <span className="text-amber-400">TIF TN:</span>
                <span>{prod.hsCode}</span>
              </div>

              {/* GSP+ Badge */}
              {prod.gspPlusEligible && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/95 backdrop-blur-md text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GSP+ 0% Boj</span>
                </div>
              )}

              {/* Season & Category on Image bottom */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-slate-300">
                  {prod.category}
                </span>
                <span className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-emerald-300 font-semibold">
                  <Calendar className="w-3 h-3" />
                  {prod.seasonPeak}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition leading-snug">
                  {prod.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              {/* Market Analysis & Top Destination Countries */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    Asosiy bozorlar:
                  </span>
                  <span className="font-semibold text-emerald-400 text-[11px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Talab: {prod.marketDemand}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {prod.targetCountries.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded-md font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                
                {/* Tariff benefit info */}
                <div className="text-[11px] text-amber-200/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{prod.tariffBenefitInfo}</span>
                </div>
              </div>

              {/* Price & Export Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">O'rtacha jahon narxi:</span>
                  <span className="text-sm font-extrabold text-white">
                    {formatPrice(prod.averagePriceUsd)}
                  </span>
                  <span className="text-slate-400 text-[11px]"> / {prod.unit}</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">2025 yillik eksport:</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {prod.exportVolume2025}
                  </span>
                </div>
              </div>

              {/* Action Buttons with Fast Snappy Hover */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onConsultProduct(prod, 'calculator')}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold border border-emerald-500/30 transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
                  title="Moliyaviy xarajatlar va foydani hisoblash"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>AI Hisob-kitob</span>
                </button>

                <button
                  onClick={() => onConsultProduct(prod, 'certificate')}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer shadow-xs"
                  title="ST-1 va Fitosanitariya sertifikatlari talablarini olish"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sertifikatlar</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
