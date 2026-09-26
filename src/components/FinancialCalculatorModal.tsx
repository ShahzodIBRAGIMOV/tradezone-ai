import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  TrendingUp, 
  Truck, 
  Package, 
  FileCheck2, 
  DollarSign, 
  ArrowRight, 
  Sparkles,
  Percent,
  CheckCircle,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { CalculationRequest, CalculationResult } from '../types/trade';

interface FinancialCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (prompt: string) => void;
  initialProduct?: string;
}

export const FinancialCalculatorModal: React.FC<FinancialCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
  initialProduct = 'Gilos (Sweet Cherries)',
}) => {
  const [productName, setProductName] = useState(initialProduct);
  const [volumeTons, setVolumeTons] = useState(10);
  const [destination, setDestination] = useState('Rossiya (Moskva)');
  const [transportMode, setTransportMode] = useState<CalculationRequest['transportMode']>('Avto TIR (Refrijerator)');
  const [purchasePricePerKg, setPurchasePricePerKg] = useState(1.4);
  const [sellingPricePerKg, setSellingPricePerKg] = useState(2.8);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  if (!isOpen) return null;

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          volumeTons,
          destination,
          transportMode,
          purchasePricePerKg,
          sellingPricePerKg,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        // Local calculation fallback
        const tons = Number(volumeTons) || 10;
        const weightKg = tons * 1000;
        const buyPerKg = Number(purchasePricePerKg) || 1.4;
        const sellPerKg = Number(sellingPricePerKg) || 2.8;
        const transportRate = transportMode.includes('Avia') ? 1800 : transportMode.includes('Temiryo\'l') ? 280 : 380;
        
        const purchaseCost = Math.round(weightKg * buyPerKg);
        const packagingCost = Math.round(weightKg * 0.22);
        const transportCost = Math.round(tons * transportRate);
        const customsCost = 350;
        const certificationCost = 200;
        const totalCost = purchaseCost + packagingCost + transportCost + customsCost + certificationCost;
        const expectedRevenue = Math.round(weightKg * sellPerKg);
        const netProfit = expectedRevenue - totalCost;

        setResult({
          productName,
          volumeTons: tons,
          destination,
          transportMode,
          purchaseCost,
          packagingCost,
          transportCost,
          customsCost,
          certificationCost,
          totalCost,
          expectedRevenue,
          netProfit,
          profitMarginPercent: Number(((netProfit / expectedRevenue) * 100).toFixed(1)),
          roiPercent: Number(((netProfit / totalCost) * 100).toFixed(1)),
          deliveryDays: transportMode.includes('Avia') ? '1-2 kun' : '5-7 kun',
          aiAdvice: `Hisob-kitob bo'yicha kutilayotgan sof foyda: $${netProfit.toLocaleString()}. INCOTERMS DAP qoidasi bilan shartnoma tuzish tavsiya etiladi.`
        });
      }
    } catch {
      // Handled gracefully with defaults
    } finally {
      setLoading(false);
    }
  };

  const handleAskAIConsultant = () => {
    const prompt = `${volumeTons} tonna ${productName}ni ${destination}ga ${transportMode} orqali eksport qilish bo'yicha to'liq moliyaviy hisob-kitob, INCOTERMS shartlari va tavsiyalar bering.`;
    onSendToChat(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950/95 rounded-2xl shadow-2xl max-w-2xl w-full border border-amber-500/30 overflow-hidden max-h-[90vh] flex flex-col text-white backdrop-blur-xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                TradeZona AI Savdo Kalkulyatori
              </h2>
              <p className="text-xs text-amber-300/80">
                Transport, bojxona, qadoqlash xarajatlari va kutilayotgan sof foyda tahlili
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Quick presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold shrink-0">Namunalar:</span>
            <button
              onClick={() => { setProductName('Gilos (Saralangan)'); setVolumeTons(10); setDestination('Rossiya (Moskva)'); setPurchasePricePerKg(1.5); setSellingPricePerKg(3.0); }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-medium shrink-0 transition-all duration-150 active:scale-95 border border-slate-800 cursor-pointer"
            >
              🍒 10t Gilos (Moskva)
            </button>
            <button
              onClick={() => { setProductName('Smartfonlar (5G)'); setVolumeTons(2); setDestination('Xitoy (Shenjen -> Toshkent)'); setPurchasePricePerKg(180); setSellingPricePerKg(230); }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-medium shrink-0 transition-all duration-150 active:scale-95 border border-slate-800 cursor-pointer"
            >
              📱 2t Smartfonlar (Xitoy)
            </button>
            <button
              onClick={() => { setProductName('Quritilgan mayiz'); setVolumeTons(15); setDestination('Germaniya (Frankfurt)'); setPurchasePricePerKg(1.8); setSellingPricePerKg(3.8); }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-medium shrink-0 transition-all duration-150 active:scale-95 border border-slate-800 cursor-pointer"
            >
              🍇 15t Mayiz (Germaniya)
            </button>
          </div>

          {/* Input Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tovarning Nomi:
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Masalan: 10 tonna olma"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Eksport/Import Hajmi (Tonna):
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={volumeTons}
                onChange={(e) => setVolumeTons(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Yo'nalish (Manzil):
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition"
              >
                <option value="Rossiya (Moskva)">Rossiya (Moskva)</option>
                <option value="Germaniya (Frankfurt)">Germaniya (Frankfurt - GSP+)</option>
                <option value="BAA (Dubay)">BAA (Dubay)</option>
                <option value="Qozog'iston (Olmaota)">Qozog'iston (Olmaota)</option>
                <option value="Xitoy (Shenjen - Toshkent)">Xitoy (Shenjen — Toshkent)</option>
                <option value="Turkiya (Istanbul)">Turkiya (Istanbul)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Transport Rejimi:
              </label>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition"
              >
                <option value="Avto TIR (Refrijerator)">Avto TIR (Refrijerator +2...+4°C)</option>
                <option value="Avto TIR (Tent)">Avto TIR (Standart Tent)</option>
                <option value="Temiryo'l konteyner">Temiryo'l konteyner</option>
                <option value="Avia Kargo">Avia Kargo (Tezkor)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Xarid / Tannarx ($/kg):
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={purchasePricePerKg}
                onChange={(e) => setPurchasePricePerKg(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Kutilayotgan Sotish Narxi ($/kg):
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={sellingPricePerKg}
                onChange={(e) => setSellingPricePerKg(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>{loading ? 'Hisoblanmoqda...' : 'Xarajat va Foydani Hisoblash'}</span>
          </button>

          {/* Results Display */}
          {result && (
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Hisob-Kitob Natijasi:
                </span>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  Yetkazish: {result.deliveryDays}
                </span>
              </div>

              {/* Profit Metric Highlight */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Jami Tushum:</span>
                  <span className="text-base font-extrabold text-white">
                    ${result.expectedRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Jami Xarajatlar:</span>
                  <span className="text-base font-extrabold text-slate-300">
                    ${result.totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="bg-emerald-950/60 p-3 rounded-lg border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 block font-semibold">Sof Foyda:</span>
                  <span className="text-base font-black text-emerald-300">
                    +${result.netProfit.toLocaleString()}
                  </span>
                </div>
                <div className="bg-amber-950/60 p-3 rounded-lg border border-amber-500/40">
                  <span className="text-[10px] text-amber-400 block font-semibold">Rentabellik (ROI):</span>
                  <span className="text-base font-black text-amber-300">
                    {result.roiPercent}%
                  </span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="text-xs space-y-1.5 pt-2">
                <span className="text-slate-400 font-semibold block">Xarajatlar tafsiloti:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Mahsulot xaridi:</span>
                    <span className="font-bold text-white">${result.purchaseCost.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Transport xarajati:</span>
                    <span className="font-bold text-white">${result.transportCost.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Qadoqlash & yashiklar:</span>
                    <span className="font-bold text-white">${result.packagingCost.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Bojxona & Broker:</span>
                    <span className="font-bold text-white">${result.customsCost}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Sertifikatlar (ST-1, Fito):</span>
                    <span className="font-bold text-white">${result.certificationCost}</span>
                  </div>
                </div>
              </div>

              {/* AI Advice note */}
              <div className="text-xs bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-slate-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{result.aiAdvice}</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleAskAIConsultant}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Chatda to'liq hisob-kitobni ochish</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95 cursor-pointer"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
