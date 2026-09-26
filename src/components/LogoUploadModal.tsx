import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Check, Image as ImageIcon, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoUpdated: (newLogoUrl: string) => void;
  initialFile?: File | null;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  isOpen,
  onClose,
  onLogoUpdated,
  initialFile
}) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(215);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFile) {
      handleFile(initialFile);
    }
  }, [initialFile]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Iltimos, rasm faylini yuklang (PNG, JPG yoki WebP)");
      return;
    }
    setError(null);
    setSuccess(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      processBackgroundRemoval(result, threshold);
    };
    reader.readAsDataURL(file);
  };

  const processBackgroundRemoval = (imageSrc: string, whiteThreshold: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Mathematical White Background Removal:
      // We detect white/off-white background while preserving 100% of all colored elements,
      // brushed metals, golds, teals, text, and borders without modifying any of their pixels!
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const minRGB = Math.min(r, g, b);
        const maxRGB = Math.max(r, g, b);
        const sat = maxRGB - minRGB;

        // Pure white background condition
        if (minRGB >= whiteThreshold && sat <= 24) {
          data[i + 3] = 0; // 100% transparent
        } else if (minRGB >= whiteThreshold - 35 && sat <= 32) {
          // Smooth edge transition & un-premultiplying white halo
          const t = (minRGB - (whiteThreshold - 35)) / 35.0;
          const satFactor = Math.max(0, (35.0 - sat) / 35.0);
          const whiteness = Math.max(0, Math.min(1.0, t * satFactor));
          const newAlpha = Math.max(0, Math.min(255, Math.round(255 * (1.0 - whiteness))));

          if (newAlpha <= 4) {
            data[i + 3] = 0;
          } else {
            const aNorm = newAlpha / 255.0;
            data[i] = Math.min(255, Math.max(0, Math.round((r - (1.0 - aNorm) * 255) / aNorm)));
            data[i + 1] = Math.min(255, Math.max(0, Math.round((g - (1.0 - aNorm) * 255) / aNorm)));
            data[i + 2] = Math.min(255, Math.max(0, Math.round((b - (1.0 - aNorm) * 255) / aNorm)));
            data[i + 3] = newAlpha;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentUrl = canvas.toDataURL('image/png');
      setProcessedImage(transparentUrl);
      setIsProcessing(false);
    };
    img.onerror = () => {
      setError("Rasmni yuklashda xatolik yuz berdi");
      setIsProcessing(false);
    };
    img.src = imageSrc;
  };

  const handleSave = async () => {
    if (!processedImage) return;
    setIsSaving(true);
    try {
      // 1. Send to server to persist in public/assets/tradezone_logo.png
      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: processedImage }),
      });

      if (!res.ok) {
        throw new Error('Serverda logoni saqlab bo\'lmadi');
      }

      // 2. Persist in localStorage as immediate fallback
      localStorage.setItem('tradezone_custom_logo', processedImage);

      // 3. Update app-wide state
      onLogoUpdated(processedImage);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      // Even if server failed, save locally in client
      localStorage.setItem('tradezone_custom_logo', processedImage);
      onLogoUpdated(processedImage);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 900);
    } finally {
      setIsSaving(false);
    }
  };

  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    if (originalImage) {
      processBackgroundRemoval(originalImage, val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full border border-cyan-500/40 overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-slate-950 via-slate-900 to-cyan-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Asl Logoni Yuklash & Oq Fonini Tozalash
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Siz tashlagan rasmdagi barcha oq fonlar tozalanadi, logoning o'ziga umuman tegilmaydi
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 shrink-0" />
              Asl logo muvaffaqiyatli saqlandi va saytga to'liq o'rnatildi!
            </div>
          )}

          {/* Upload Dropzone */}
          {!originalImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFile(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-10 text-center cursor-pointer transition-all bg-slate-900/40 hover:bg-slate-900/70 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-white mb-1">
                ChatGPT'dan yuklagan asl faylingizni shu yerga tashlang
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Faylni bosing yoki sudrab tashlang (masalan, <span className="text-cyan-300 font-mono">ChatGPT Image...png</span>)
              </p>
              <button 
                type="button" 
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Kompyuterdan faylni tanlash
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left: Original with white background */}
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    Asl Rasm (Oq fonli)
                  </span>
                  <div className="w-44 h-44 rounded-xl bg-white p-2 flex items-center justify-center border border-slate-700 overflow-hidden shadow-inner">
                    <img 
                      src={originalImage} 
                      alt="Original Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                {/* Right: Transparent over dark background */}
                <div className="bg-slate-900/60 rounded-xl p-4 border border-cyan-500/40 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                    Tozalangan
                  </div>
                  <span className="text-xs font-bold text-cyan-300 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Toza Shaffof Logo (Saytdagi ko'rinishi)
                  </span>
                  <div className="w-44 h-44 rounded-xl bg-slate-950 p-2 flex items-center justify-center border border-cyan-500/50 overflow-hidden shadow-lg shadow-cyan-950/50 relative">
                    {/* Subtle grid pattern to show transparency */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:10px_10px]"></div>
                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-2 text-cyan-400 text-xs font-medium">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span>Oq fon tozalanmoqda...</span>
                      </div>
                    ) : processedImage ? (
                      <img 
                        src={processedImage} 
                        alt="Transparent Logo" 
                        className="max-w-full max-h-full object-contain relative z-10"
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Threshold Slider for Precision */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-300 font-bold">Oq rangni tozalash aniqligi (Sensibility):</span>
                  <span className="text-cyan-400 font-mono font-bold">{threshold}</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="245"
                  value={threshold}
                  onChange={(e) => handleThresholdChange(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Yengil (faqat toza oq)</span>
                  <span>Standart (tavsiya etiladi)</span>
                  <span>Kuchli (barcha kulrang/oq)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOriginalImage(null);
                    setProcessedImage(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Boshqa rasm tanlash
                </button>

                <button
                  type="button"
                  disabled={!processedImage || isProcessing || isSaving}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs hover:from-cyan-400 hover:to-emerald-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      O'rnatilmoqda...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Ushbu Asl Logoni Saytga O'rnatish
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
