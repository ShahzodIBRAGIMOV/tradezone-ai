import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Search, 
  Calculator, 
  ArrowRightLeft, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Building2, 
  ExternalLink,
  Flame,
  Globe,
  Coins,
  BarChart3,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { CbuCurrency } from '../types/trade';
import { SpotCommodity, TradeRadarSignal } from '../data/spotAndRadarData';
import { getFlagUrl } from '../data/currencyData';
import { soundEffects } from '../utils/audioEffects';

interface DailyMarketAndRatesProps {
  onSendToChat?: (prompt: string) => void;
  onOpenCalculatorWithRate?: (currency: CbuCurrency) => void;
}

type TabType = 'cbu' | 'spot' | 'radar';
type RegionFilter = 'all' | 'top' | 'cis' | 'asia' | 'europe';

export const DailyMarketAndRates: React.FC<DailyMarketAndRatesProps> = ({
  onSendToChat,
  onOpenCalculatorWithRate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('cbu');
  
  // CBU Rates State
  const [rates, setRates] = useState<CbuCurrency[]>([]);
  const [cbuDate, setCbuDate] = useState<string>('');
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('top');
  
  // Interactive Modal / Active Currency Converter
  const [selectedCurrency, setSelectedCurrency] = useState<CbuCurrency | null>(null);
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const [convertDirection, setConvertDirection] = useState<'foreignToUzs' | 'uzsToForeign'>('foreignToUzs');
  const [hasCopied, setHasCopied] = useState(false);
  const [lastClickedCode, setLastClickedCode] = useState<string | null>(null);

  // Spot Commodities State
  const [spotCommodities, setSpotCommodities] = useState<SpotCommodity[]>([]);
  const [spotCategory, setSpotCategory] = useState<'all' | 'agro' | 'industrial'>('all');
  const [selectedSpot, setSelectedSpot] = useState<SpotCommodity | null>(null);

  // Trade Radar Signals State
  const [radarSignals, setRadarSignals] = useState<TradeRadarSignal[]>([]);
  const [radarFilter, setRadarFilter] = useState<'all' | 'export' | 'import' | 'currency' | 'logistics'>('all');

  // Load live CBU data
  const loadCbuRates = async () => {
    setIsLoadingRates(true);
    try {
      const res = await fetch('/api/cbu-rates');
      const data = await res.json();
      if (data && data.rates) {
        setRates(data.rates);
        setCbuDate(data.cbuDate || new Date().toLocaleDateString('ru-RU'));
        if (!selectedCurrency && data.rates.length > 0) {
          // Default selection to USD
          const usd = data.rates.find((r: CbuCurrency) => r.Ccy === 'USD') || data.rates[0];
          setSelectedCurrency(usd);
        }
      }
    } catch (err) {
      console.error('Failed to load CBU rates:', err);
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Load Spot & Radar Data
  useEffect(() => {
    loadCbuRates();

    fetch('/api/market-spot-prices')
      .then(res => res.json())
      .then(data => {
        if (data?.commodities) setSpotCommodities(data.commodities);
      })
      .catch(() => {});

    fetch('/api/trade-radar-signals')
      .then(res => res.json())
      .then(data => {
        if (data?.signals) setRadarSignals(data.signals);
      })
      .catch(() => {});
  }, []);

  // Filtered Currencies
  const filteredCurrencies = useMemo(() => {
    return rates.filter(curr => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        curr.Ccy.toLowerCase().includes(q) ||
        (curr.CcyNm_UZ && curr.CcyNm_UZ.toLowerCase().includes(q)) ||
        (curr.countryUz && curr.countryUz.toLowerCase().includes(q)) ||
        (curr.CcyNm_RU && curr.CcyNm_RU.toLowerCase().includes(q)) ||
        curr.Code.includes(q)
      );

      if (!matchesSearch) return false;

      if (selectedRegion === 'top') {
        return curr.isMajorPartner || ['USD', 'EUR', 'RUB', 'CNY', 'KZT', 'TRY', 'AED', 'GBP', 'JPY', 'KRW'].includes(curr.Ccy);
      }
      if (selectedRegion === 'cis') {
        return ['RUB', 'KZT', 'BYN', 'KGS', 'TJS', 'TMT', 'AZN', 'MDL', 'AMD', 'GEL'].includes(curr.Ccy);
      }
      if (selectedRegion === 'asia') {
        return ['CNY', 'JPY', 'KRW', 'INR', 'AED', 'SAR', 'SGD', 'MYR', 'QAR', 'KWD', 'IRR', 'PKR', 'VND'].includes(curr.Ccy);
      }
      if (selectedRegion === 'europe') {
        return ['EUR', 'GBP', 'CHF', 'PLN', 'HUF', 'CZK', 'SEK', 'NOK', 'DKK', 'BGN', 'RON'].includes(curr.Ccy);
      }

      return true;
    });
  }, [rates, searchQuery, selectedRegion]);

  // Click currency item with haptic visual & audio effect
  const handleCurrencyClick = (curr: CbuCurrency) => {
    soundEffects.playClick(950);
    setLastClickedCode(curr.Ccy);
    setSelectedCurrency(curr);
    setTimeout(() => {
      setLastClickedCode(null);
    }, 450);
  };

  // Convert calculation
  const calculatedConversion = useMemo(() => {
    if (!selectedCurrency) return { from: '0', to: '0 UZS', numericResult: 0 };
    const rate = parseFloat(selectedCurrency.Rate.replace(/\s/g, '')) || 0;
    const nominal = parseFloat(selectedCurrency.Nominal) || 1;
    const unitRate = rate / nominal;

    if (convertDirection === 'foreignToUzs') {
      const result = convertAmount * unitRate;
      return {
        from: `${convertAmount.toLocaleString()} ${selectedCurrency.Ccy}`,
        to: `${Math.round(result).toLocaleString('uz-UZ')} UZS`,
        numericResult: result,
      };
    } else {
      const result = unitRate > 0 ? convertAmount / unitRate : 0;
      return {
        from: `${convertAmount.toLocaleString()} UZS`,
        to: `${result.toLocaleString('uz-UZ', { maximumFractionDigits: 2 })} ${selectedCurrency.Ccy}`,
        numericResult: result,
      };
    }
  }, [selectedCurrency, convertAmount, convertDirection]);

  // Copy converted result to clipboard
  const handleCopyResult = () => {
    soundEffects.playChime();
    navigator.clipboard.writeText(calculatedConversion.to);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Prompt AI Consultant regarding selected currency
  const handleConsultCurrencyAI = () => {
    if (!selectedCurrency || !onSendToChat) return;
    const prompt = `Markaziy Bankning bugungi rasmiy kursi bo'yicha 1 ${selectedCurrency.Ccy} (${selectedCurrency.countryUz || selectedCurrency.CcyNm_UZ}) = ${selectedCurrency.Rate} UZS (o'zgarish: ${selectedCurrency.Diff} so'm). Ushbu valyuta dinamikasining O'zbekiston eksport va import kontraktlariga ta'siri hamda to'lovlarda valyuta risklarini kamaytirish bo'yicha amaliy maslahat bering.`;
    onSendToChat(prompt);
  };

  // Filtered spot commodities
  const filteredSpots = useMemo(() => {
    if (spotCategory === 'all') return spotCommodities;
    return spotCommodities.filter(s => s.category === spotCategory);
  }, [spotCommodities, spotCategory]);

  // Filtered radar signals
  const filteredSignals = useMemo(() => {
    if (radarFilter === 'all') return radarSignals;
    return radarSignals.filter(s => s.category === radarFilter);
  }, [radarSignals, radarFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Tab Navigation */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-950 to-cyan-950/40 border border-cyan-500/25 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Markaziy Bank & Birja Real Vaqt Ma'lumotlari
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                Sana: {cbuDate || 'Bugungi kun'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Kunlik Savdo & Valyuta Radari</span>
              <Coins className="w-7 h-7 text-amber-400 hidden sm:inline" />
            </h1>
            
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              O'zbekiston Markaziy Bankining rasmiy valyuta kurslari (davlatlar bayrog'i bilan), 
              jahon va mintaqaviy Agro & Sanoat birja spot narxlari hamda kunlik operativ bozor signallari.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0 shadow-lg">
            <button
              onClick={() => {
                soundEffects.playClick(750);
                setActiveTab('cbu');
              }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'cbu'
                  ? 'bg-linear-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 ring-1 ring-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>1. Markaziy Bank Kurslari</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick(850);
                setActiveTab('spot');
              }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'spot'
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>2. Spot Birja Narxlari</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick(950);
                setActiveTab('radar');
              }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'radar'
                  ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>3. Bozor Signallari</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CBU FX RATES & INTERACTIVE CONVERTER */}
      {activeTab === 'cbu' && (
        <div className="space-y-6">
          
          {/* Main Top Micro Converter Banner */}
          {selectedCurrency && (() => {
            const topFlagUrl = selectedCurrency.flagUrl || getFlagUrl(selectedCurrency.Ccy);
            return (
            <motion.div 
              layout
              className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden"
            >
              {/* Tiniq formatdagi davlat bayrog'i (Fon qatlami) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {topFlagUrl ? (
                  <img
                    src={topFlagUrl}
                    alt={`${selectedCurrency.countryUz || selectedCurrency.Ccy} bayrog'i`}
                    className="w-full h-full object-cover object-right-top opacity-20 sm:opacity-25 filter saturate-150 contrast-125 brightness-95 scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Currency Identity Card */}
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {topFlagUrl ? (
                      <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl overflow-hidden border border-white/25 shadow-lg shrink-0 bg-slate-800">
                        <img
                          src={topFlagUrl}
                          alt={selectedCurrency.Ccy}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-4xl sm:text-5xl select-none filter drop-shadow-md">
                        {selectedCurrency.flag || '🌐'}
                      </span>
                    )}
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-black text-amber-400">
                      {selectedCurrency.Ccy}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        {selectedCurrency.countryUz || selectedCurrency.CcyNm_UZ}
                      </h2>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {selectedCurrency.Nominal} {selectedCurrency.Ccy}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-sm">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-400">Rasmiy kurs:</span>
                        <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                          {selectedCurrency.Rate} UZS
                        </span>
                      </div>

                      {/* Daily Diff Indicator */}
                      {parseFloat(selectedCurrency.Diff) !== 0 && (
                        <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border ${
                          parseFloat(selectedCurrency.Diff) > 0
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {parseFloat(selectedCurrency.Diff) > 0 ? (
                            <>
                              <TrendingUp className="w-3.5 h-3.5" />
                              +{selectedCurrency.Diff} so'm
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3.5 h-3.5" />
                              {selectedCurrency.Diff} so'm
                            </>
                          )}
                        </span>
                      )}

                      <span className="text-xs text-slate-500 hidden sm:inline">
                        (Markaziy Bank axborotnomasi)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Interactive Converter Inputs */}
                <div className="bg-slate-950/90 rounded-xl p-3.5 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  
                  {/* Amount Input */}
                  <div className="flex items-center bg-slate-900 rounded-lg px-3 py-2 border border-slate-700/80 focus-within:border-amber-400 transition">
                    <span className="text-xs text-slate-400 font-bold mr-2">
                      {convertDirection === 'foreignToUzs' ? selectedCurrency.Ccy : 'UZS'}:
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={convertAmount || ''}
                      onChange={(e) => setConvertAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="bg-transparent text-white font-mono font-bold text-sm w-28 sm:w-32 outline-none"
                      placeholder="Miqdor"
                    />
                  </div>

                  {/* Switch Direction Button */}
                  <button
                    onClick={() => {
                      soundEffects.playClick(800);
                      setConvertDirection(prev => prev === 'foreignToUzs' ? 'uzsToForeign' : 'foreignToUzs');
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 transition-all duration-150 active:scale-90 cursor-pointer self-center"
                    title="Yo'nalishni almashtirish"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>

                  {/* Converted Output Card */}
                  <div className="flex items-center justify-between bg-slate-900 rounded-lg px-3.5 py-2 border border-emerald-500/30 min-w-[160px]">
                    <span className="text-xs text-slate-400 font-bold mr-2">Natija:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm sm:text-base">
                      {calculatedConversion.to}
                    </span>
                    <button
                      onClick={handleCopyResult}
                      className="ml-2 text-slate-400 hover:text-white transition p-1 cursor-pointer"
                      title="Nusxalash"
                    >
                      {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* AI & Calculator Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleConsultCurrencyAI}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap"
                      title="AI dan tahlil so'rash"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Tahlili</span>
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
            );
          })()}

          {/* Search and Regional Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Davlat nomi, valyuta kodi (USD, EUR, RUB, Xitoy, Qozog'iston)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Region Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { id: 'top' as RegionFilter, label: 'Top Hamkorlar', icon: '⭐' },
                { id: 'cis' as RegionFilter, label: 'MDH', icon: '🤝' },
                { id: 'asia' as RegionFilter, label: 'Osiyo & Sharq', icon: '🌏' },
                { id: 'europe' as RegionFilter, label: 'Yevropa', icon: '🇪🇺' },
                { id: 'all' as RegionFilter, label: 'Barcha Valyutalar', icon: '🌐' },
              ].map(reg => (
                <button
                  key={reg.id}
                  onClick={() => {
                    soundEffects.playClick(700);
                    setSelectedRegion(reg.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
                    selectedRegion === reg.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span>{reg.icon}</span>
                  <span>{reg.label}</span>
                </button>
              ))}

              {/* Refresh button */}
              <button
                onClick={() => {
                  soundEffects.playClick(1000);
                  loadCbuRates();
                }}
                disabled={isLoadingRates}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-150 active:scale-90 cursor-pointer ml-1"
                title="Markaziy Bankdan yangilash"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRates ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>

          </div>

          {/* Currency Cards Grid with Country Flags & Tactile Click Effects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredCurrencies.map((curr) => {
              const isSelected = selectedCurrency?.Ccy === curr.Ccy;
              const isJustClicked = lastClickedCode === curr.Ccy;
              const diffNum = parseFloat(curr.Diff) || 0;
              const flagUrl = curr.flagUrl || getFlagUrl(curr.Ccy);

              // 1 xorijiy valyuta birligining so'mdagi aniq qiymati
              const rawRate = parseFloat(curr.Rate.replace(/\s/g, '')) || 0;
              const nominal = parseFloat(curr.Nominal) || 1;
              const unitRate = nominal > 0 ? rawRate / nominal : 0;
              const formattedUnitRate = unitRate >= 100
                ? unitRate.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : unitRate >= 1
                ? unitRate.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
                : unitRate.toLocaleString('uz-UZ', { minimumFractionDigits: 4, maximumFractionDigits: 6 });

              return (
                <motion.div
                  key={curr.Ccy}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCurrencyClick(curr)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 group overflow-hidden select-none ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50'
                      : 'border-slate-800/90 bg-slate-900/80 hover:bg-slate-900 hover:border-slate-600/80 shadow-md'
                  }`}
                >
                  {/* Tiniq formatdagi davlat bayrog'i: O'ng yarmi tiniq ko'rinadi, chap tomoniga esa biroz qora qo'shilgan */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                    {flagUrl ? (
                      <img
                        src={flagUrl}
                        alt={`${curr.countryUz || curr.Ccy} bayrog'i`}
                        className="w-full h-full object-cover object-right opacity-80 sm:opacity-85 group-hover:opacity-95 transition-all duration-300 scale-100 group-hover:scale-105 filter saturate-150 contrast-115 brightness-100"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-end pr-2 text-7xl opacity-40 select-none">
                        {curr.flag || '🌐'}
                      </div>
                    )}
                    {/* Chap tomonga biroz qora fon (matn va summa alohida ajralib turishi uchun), o'ng yarmi esa tiniq */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 via-48% to-transparent transition-opacity duration-200" />
                  </div>

                  {/* Visual Click Pulse Effect */}
                  {isJustClicked && (
                    <motion.span
                      initial={{ scale: 0.2, opacity: 0.8 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="absolute inset-0 bg-radial from-amber-400/40 to-transparent pointer-events-none rounded-xl z-20"
                    />
                  )}

                  <div className="relative z-10 flex items-start justify-between gap-2">
                    
                    {/* Country Flag & Currency Code */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-9 h-7 rounded-md overflow-hidden border border-white/25 shadow-sm shrink-0 bg-slate-800 flex items-center justify-center">
                        {flagUrl ? (
                          <img
                            src={flagUrl}
                            alt={`${curr.Ccy} bayrog'i`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-xl leading-none">{curr.flag || '🌐'}</span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-white group-hover:text-amber-300 transition">
                            {curr.Ccy}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {curr.Code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium truncate max-w-[130px]">
                          {curr.countryUz || curr.CcyNm_UZ}
                        </p>
                      </div>
                    </div>

                    {/* Diff Pill */}
                    {diffNum !== 0 ? (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs ${
                        diffNum > 0
                          ? 'bg-rose-500/25 text-rose-200 border border-rose-500/40'
                          : 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40'
                      }`}>
                        {diffNum > 0 ? (
                          <>
                            <TrendingUp className="w-2.5 h-2.5" />
                            +{curr.Diff}
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-2.5 h-2.5" />
                            {curr.Diff}
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">0.00</span>
                    )}

                  </div>

                  {/* Rate display: Chiqqan summa chap tarafga o'tgan va alohida ajralib turadi */}
                  <div className="relative z-10 mt-3 pt-2.5 border-t border-white/15 flex items-end justify-between gap-2">
                    {/* Chap tarafda: 1 birlik valyuta qiymati va ajralib turuvchi summa */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-amber-300 font-bold font-mono tracking-wide">
                          1 {curr.Ccy} =
                        </span>
                        {nominal !== 1 && (
                          <span className="text-[9px] text-slate-400 font-mono">
                            ({curr.Nominal} {curr.Ccy})
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-md">
                          {formattedUnitRate}
                        </span>
                        <span className="text-xs font-black text-emerald-300 font-mono">UZS</span>
                      </div>
                    </div>

                    {/* O'ng tarafda: MB sanasi va nominal kotirovka */}
                    <div className="text-right shrink-0">
                      {nominal !== 1 && (
                        <span className="text-[9px] text-slate-300 font-mono block bg-slate-950/70 px-1.5 py-0.5 rounded border border-white/10 shadow-xs mb-1">
                          MB: {curr.Rate}
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400 font-mono block">
                        {curr.Date}
                      </span>
                    </div>
                  </div>

                  {/* Micro hint on hover */}
                  <div className="relative z-10 mt-2 text-[10px] text-cyan-300 opacity-0 group-hover:opacity-100 transition flex items-center justify-between font-medium">
                    <span>Konvertorga o'tish</span>
                    <span>→</span>
                  </div>

                </motion.div>
              );
            })}
          </div>

          {filteredCurrencies.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">Qidiruv bo'yicha valyuta topilmadi</p>
              <p className="text-xs text-slate-500">Iltimos, boshqa davlat yoki valyuta nomini kiriting.</p>
            </div>
          )}

          {/* Central Bank Info Footer Note */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold">Rasmiy ma'lumot manbasi:</span> Valyuta kurslari 
              O'zbekiston Respublikasi Markaziy Bankining rasmiy ochiq API xizmati (cbu.uz) orqali to'g'ridan-to'g'ri olinadi. 
              Ushbu kurslar bojxona to'lovlarini hisoblash, tashqi savdo operatsiyalari va buxgalteriya hisobida rasmiy asos bo'lib xizmat qiladi.
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AGRO & INDUSTRIAL SPOT MARKET PRICES */}
      {activeTab === 'spot' && (
        <div className="space-y-6">
          
          {/* Subheader and Category Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Tashqi & Ichki Birja Spot Narxlari</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Kunlik Fiksatsiya
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                UZEX, AGMK, London Metal Exchange (LME) va Cotlook A xalqaro kotirovkalari asosida
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpotCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  spotCategory === 'all'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Barchasi ({spotCommodities.length})
              </button>
              <button
                onClick={() => setSpotCategory('agro')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  spotCategory === 'agro'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🌾 Qishloq Xo'jaligi (Agro)
              </button>
              <button
                onClick={() => setSpotCategory('industrial')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  spotCategory === 'industrial'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🏭 Sanoat & Metallurgiya
              </button>
            </div>
          </div>

          {/* Spot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpots.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 shadow-md flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        TIF TN: {item.hsCode}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                        {item.nameUz}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.name}
                      </p>
                    </div>

                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                      item.changePercent > 0
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.changePercent < 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.changePercent > 0 ? (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{item.changePercent}%
                        </>
                      ) : item.changePercent < 0 ? (
                        <>
                          <TrendingDown className="w-3.5 h-3.5" />
                          {item.changePercent}%
                        </>
                      ) : (
                        '0.0%'
                      )}
                    </span>
                  </div>

                  {/* Price display */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Spot narxi:</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">
                        ${item.spotPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold ml-1">
                        / {item.unit}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">So'm ekvivalentida:</span>
                      <span className="text-sm font-bold text-slate-200 font-mono">
                        {item.priceUzS.toLocaleString('uz-UZ')} UZS
                      </span>
                    </div>
                  </div>

                  {/* FOB vs CIF Spread if available */}
                  {item.fobCifComparison && (
                    <div className="mt-3 p-2.5 rounded-lg bg-sky-950/20 border border-sky-500/20 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">FOB Toshkent:</span>
                        <span className="text-white font-mono font-bold">{item.fobCifComparison.fobTashkent}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">CIF {item.fobCifComparison.destinationName}:</span>
                        <span className="text-emerald-400 font-mono font-bold">{item.fobCifComparison.cifDestination}</span>
                      </div>
                      <div className="text-[10px] text-cyan-300 font-bold pt-1 border-t border-sky-500/20">
                        {item.fobCifComparison.spread}
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  <p className="mt-3 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                    💡 <span className="text-slate-200 font-semibold">Bozor tavsiyasi:</span> {item.recommendation}
                  </p>
                </div>

                {/* Footer and Action */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[170px]">
                    📍 {item.exchangeName}
                  </span>
                  
                  <button
                    onClick={() => {
                      soundEffects.playClick(900);
                      if (onSendToChat) {
                        onSendToChat(`Bugungi birja spot narxi bo'yicha "${item.nameUz}" (${item.spotPrice}$/${item.unit}) bo'yicha eksport shartnomasi va rentabellik tahlilini ber.`);
                      }
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    <span>AI Konsalt</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: DAILY TRADE RADAR & SIGNALS */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          
          {/* Subheader and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Operativ Bozor Signallari (Trade Radar)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Arbitraj imkoniyatlari, GSP+ preferensiyalari, logistika tirbandligi va valyuta tebranishi tahlili
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'export', label: 'Eksport Imkoniyati' },
                { id: 'import', label: 'Import & Qizil Hudud' },
                { id: 'currency', label: 'Valyuta Riski' },
                { id: 'logistics', label: 'Logistika' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setRadarFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    radarFilter === f.id
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Signals Stream */}
          <div className="space-y-4">
            {filteredSignals.map((signal) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 shadow-lg space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${signal.badgeColor}`}>
                      {signal.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {signal.timestamp}
                    </span>
                    <span className="text-xs text-slate-500">|</span>
                    <span className="text-xs font-semibold text-slate-300">
                      Bozor: {signal.targetMarket}
                    </span>
                  </div>

                  {/* Priority Indicator */}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    signal.priority === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : signal.priority === 'opportunity'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {signal.priority === 'high' ? '🔴 Yuqori Ta\'sir' : signal.priority === 'opportunity' ? '🟢 Katta Imkoniyat' : '🟡 Diqqat Talab'}
                  </span>
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {signal.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                    {signal.summary}
                  </p>
                </div>

                {/* Impact & Actionable Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                      📊 Ta'sir va Moliyaviy Baho:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {signal.impactAnalysis}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      ⚡ Tavsiya etiladigan Qadam:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {signal.actionableStep}
                    </p>
                  </div>
                </div>

                {/* Affected Products & AI Trigger */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-slate-400">Tegishli tovarlar:</span>
                    {signal.affectedProducts.map(p => (
                      <span key={p} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {p}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      soundEffects.playClick(1000);
                      if (onSendToChat) {
                        onSendToChat(signal.suggestedPrompt);
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all duration-150 active:scale-95 cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Konsaltantga Yuborish</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
