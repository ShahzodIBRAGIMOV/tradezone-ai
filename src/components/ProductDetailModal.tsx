import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Globe, 
  FileText, 
  Truck, 
  Sparkles, 
  Calendar, 
  Calculator, 
  TrendingUp,
  Layers,
  CheckCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { ExportProduct } from '../types/trade';

interface ProductDetailModalProps {
  product: ExportProduct | null;
  onClose: () => void;
  onConsult: (product: ExportProduct, mode: 'calculator' | 'certificate') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onConsult,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950/95 rounded-2xl shadow-2xl max-w-2xl w-full border border-amber-500/30 overflow-hidden max-h-[90vh] flex flex-col text-white backdrop-blur-xl">
        
        {/* Header with image */}
        <div className="relative h-48 bg-slate-950 shrink-0">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded shadow-sm">
                TIF TN: {product.hsCode}
              </span>
              {product.gspPlusEligible && (
                <span className="text-xs bg-emerald-950/90 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  GSP+ Yevropa 0% Boj
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {product.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Mahsulot tavsifi
            </span>
            <p className="text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Trade Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Jahon Bozor Narxi:</span>
              <span className="text-sm font-extrabold text-white">
                ${product.averagePriceUsd.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400"> / {product.unit}</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Eng Qulay Mavsum:</span>
              <span className="text-xs font-bold text-emerald-400">
                {product.seasonPeak}
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">2025 Yillik Eksport:</span>
              <span className="text-xs font-bold text-white">
                {product.exportVolume2025}
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Minimal Partiya:</span>
              <span className="text-xs font-bold text-white">
                {product.minOrderQty} {product.unit}
              </span>
            </div>
          </div>

          {/* Bojxona va GSP+ Imtiyozi */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bojxona Imtiyozlari & Preferensiyalar:</span>
            </div>
            <p className="text-emerald-200 text-xs leading-relaxed">
              {product.tariffBenefitInfo}
            </p>
          </div>

          {/* Target Countries */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Asosiy Xaridor Davlatlar (Eksport Yo'nalishlari)
            </span>
            <div className="flex flex-wrap gap-2">
              {product.targetCountries.map((c, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-medium">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Certificates */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Majburiy Hujjatlar va Xalqaro Sertifikatlar
            </span>
            <div className="space-y-1.5">
              {product.requiredCerts.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics recommendations */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Tavsiya Etiladigan Logistika Rejimlari
            </span>
            <div className="flex flex-wrap gap-2">
              {product.logisticsModes.map((lm, idx) => (
                <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 rounded-lg font-medium">
                  <Truck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{lm}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTAs with Snappy Hover */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              onConsult(product, 'certificate');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Sertifikatlar Yo'riqnomasi</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onConsult(product, 'calculator');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Foydani Hisoblash</span>
          </button>
        </div>

      </div>
    </div>
  );
};
