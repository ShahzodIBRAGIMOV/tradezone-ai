import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Globe2, 
  Mic,
  Loader2,
  Zap,
  Volume2,
  VolumeX,
  CheckCircle2,
  Info,
  Square,
  Check
} from 'lucide-react';
import { AISearchResult } from '../types/trade';
import { soundEffects } from '../utils/audioEffects';
import { browserNotifications } from '../utils/browserNotifications';

interface AISmartSearchBarProps {
  onSelectProductForChat: (prompt: string) => void;
  onFilterCatalog?: (query: string) => void;
}

export const AISmartSearchBar: React.FC<AISmartSearchBarProps> = ({
  onSelectProductForChat,
  onFilterCatalog,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Suggested prompt chips
  const suggestions = [
    'iPhone / Smartfon',
    'Toshkent — Frankfurt (5,420 km)',
    'Mikroprotsessor / Chip',
    'Gilos (0809.29)',
    'Lianyungang — Toshkent (Xitoy)',
    'Paxta ipi (GSP+)',
    'Bandar-Abbos (Dengiz yo\'li)',
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const performAISearch = async (searchQuery: string, fromVoice: boolean = false) => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setResult(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });

      if (response.ok) {
        const data: AISearchResult = await response.json();
        data.isVoiceSearch = fromVoice;
        setResult(data);
        setIsOpen(true);
        soundEffects.playChime();

        // Brauzerga AI tahlili tayyorligi haqida bildirishnoma yuborish
        browserNotifications.notifyAISearchReady(data.productName, data.hsCode, data.dutyRateUzbekistan);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (onFilterCatalog) onFilterCatalog(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length >= 2) {
      setLoading(true);
      debounceRef.current = setTimeout(() => {
        performAISearch(val);
      }, 500);
    } else {
      setResult(null);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setIsOpen(false);
    if (onFilterCatalog) onFilterCatalog('');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSuggestionClick = (sug: string) => {
    const clean = sug.split('(')[0].replace('/', ' ').trim();
    setQuery(clean);
    performAISearch(clean);
    if (onFilterCatalog) onFilterCatalog(clean);
  };

  // Toggle Voice Recognition (Directly activates the voice recording div and listens)
  const toggleVoiceSearch = async () => {
    soundEffects.playClick(isListening ? 700 : 950);

    if (isListening) {
      // Stop and search what was captured
      const textToSearch = query.trim();
      stopListening();
      if (textToSearch.length >= 2) {
        performAISearch(textToSearch, true);
      }
      return;
    }

    // 1. Activate recording DIV immediately!
    setIsListening(true);

    // 2. Request browser microphone natively via getUserMedia to trigger the browser prompt
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      } catch (err) {
        console.warn('Microphone permission or access issue:', err);
      }
    }

    // 3. Request browser notification in background if supported
    if (browserNotifications.isSupported() && browserNotifications.getPermission() === 'default') {
      browserNotifications.requestPermission().catch(() => {});
    }

    // Send start notification if permitted
    browserNotifications.sendNotification('🎙️ Ovozli AI qidiruv faollashtirildi', {
      body: "Mahsulot nomini ayting. Sun'iy intellekt tahlil qilmoqda...",
    });

    // 4. Start Web Speech Recognition
    const SpeechRecognition = typeof window !== 'undefined'
      ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
      : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'uz-UZ';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join('');

          if (transcript) {
            setQuery(transcript);
            if (onFilterCatalog) onFilterCatalog(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
          // If still marked listening, finish and search
          setIsListening(false);
          if (query.trim().length >= 2) {
            performAISearch(query.trim(), true);
          }
        };

        recognition.start();
      } catch (e) {
        console.warn('Could not start SpeechRecognition:', e);
      }
    }
  };

  const handleFinishVoiceSearch = () => {
    const textToSearch = query.trim();
    stopListening();
    soundEffects.playChime();
    if (textToSearch.length >= 2) {
      performAISearch(textToSearch, true);
    }
  };

  // Text-To-Speech for AI result summary
  const toggleSpeakResult = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !result) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${result.productName}. TIF TN kodi: ${result.hsCode}. Bojxona stavkasi: ${result.dutyRateUzbekistan}. Bozor holati: ${result.marketOutlook}. Tavsiya: ${result.recommendedAction}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'uz-UZ';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleAskAIInDepth = () => {
    if (!result) return;
    const prompt = `"${result.productName}" (TIF TN: ${result.hsCode}) bo'yicha to'liq tashqi savdo tahlili, boj stavkalari, sertifikatlar va 10 tonna / 1000 dona uchun kutilayotgan moliyaviy hisob-kitobni qilib bering.`;
    onSelectProductForChat(prompt);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto z-30">
      
      {/* Search Input Box with Background Aesthetic */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/40 via-emerald-500/30 to-indigo-500/40 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-200"></div>
        
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3 shadow-2xl">
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Mahsulot yoki tovar yozing yoki ovoz orqali ayting..."
              className="w-full bg-transparent text-white text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-0 border-none"
            />
          </div>

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer shrink-0"
              title="Tozalash"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* OVOZ ORQALI QIDIRISH TUGMASI (FAQATGINA LOGO, SO'Z YO'Q) */}
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`p-2.5 sm:p-2.5 rounded-xl border transition-all duration-200 active:scale-90 cursor-pointer shrink-0 flex items-center justify-center relative ${
              isListening
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/50 ring-2 ring-rose-400/80 animate-pulse'
                : 'bg-slate-800/90 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border-amber-500/40 hover:border-amber-400 shadow-sm'
            }`}
            title={isListening ? "Ovoz yozilmoqda... To'xtatish uchun bosing" : "Ovoz orqali AI qidiruv"}
            aria-label="Ovozli qidiruv"
          >
            {isListening ? (
              <>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
              </>
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            )}
          </button>

          {/* ASOSIY QIDIRUV TUGMASI */}
          <button
            type="button"
            onClick={() => performAISearch(query)}
            disabled={!query.trim() || loading}
            className="flex items-center gap-1.5 px-4 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all duration-150 active:scale-95 hover:scale-[1.03] hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer disabled:opacity-40 shrink-0"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">AI Qidiruv</span>
          </button>
        </div>
      </div>

      {/* FAOLLASHTIRILGAN OVOZ YOZISH STATUS DIVI */}
      {isListening && (
        <div className="mt-2.5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-950/95 via-slate-900 to-rose-950/95 border-2 border-rose-500/70 text-rose-200 text-xs shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div className="min-w-0">
              <span className="font-black text-rose-300 mr-2">Ovoz yozilmoqda:</span>
              <span className="text-white font-semibold italic truncate">
                {query ? `"${query}"` : "Xohlagan mahsulot nomini ayting (masalan: Gilos, Smartfon, Kungaboqar moyi)..."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-2">
            {/* Audio Wave Bars */}
            <div className="flex items-center gap-1">
              <span className="w-1 h-3.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-5.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="w-1 h-4.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
            </div>

            {/* Finish & Search Button */}
            <button
              type="button"
              onClick={handleFinishVoiceSearch}
              className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Tahlil qilish</span>
            </button>
          </div>
        </div>
      )}

      {/* Suggested Quick Search Chips */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-amber-400/80 font-bold shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Tezkor AI qidiruv:
        </span>
        {suggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSuggestionClick(sug)}
            className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-semibold border border-amber-500/20 whitespace-nowrap transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* AI Live Intelligence Result Drawer / Card */}
      {result && isOpen && (
        <div className="mt-3.5 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border-2 border-amber-500/40 p-4 sm:p-5 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-top-2 duration-200 text-white space-y-4">
          
          {/* Card Top Title & TIF TN */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shadow-md">
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">
                    TradeZona AI Tahlili (Faktlarga asoslangan):
                  </span>
                  {result.isVoiceSearch && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold flex items-center gap-1">
                      <Mic className="w-2.5 h-2.5" />
                      Ovozli AI Qidiruv
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {result.productName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-lg">
                TIF TN: {result.hsCode}
              </span>
              <span className="text-xs font-bold bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">
                {result.tradeType}
              </span>

              {/* Text-to-Speech audio reader button */}
              <button
                type="button"
                onClick={toggleSpeakResult}
                className={`p-1.5 rounded-lg border transition-all duration-150 active:scale-95 cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
                }`}
                title={isSpeaking ? "Ovozli o'qishni to'xtatish" : "Tahlilni ovozli eshitish"}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            
            {/* Duty rate in Uzbekistan */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                O'zbekiston Bojxona Boji & Soliq:
              </span>
              <span className="text-xs font-bold text-emerald-300 block">
                {result.dutyRateUzbekistan}
              </span>
            </div>

            {/* GSP+ and Trade Preference */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                GSP+ / MDH Imtiyozi:
              </span>
              <span className="text-xs font-bold text-blue-300 block">
                {result.gspPlusBenefit}
              </span>
            </div>

            {/* Certificates */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1 sm:col-span-2 lg:col-span-1">
              <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Talab Etiladigan Hujjatlar:
              </span>
              <div className="flex flex-wrap gap-1">
                {result.keyCertificates.map((cert, idx) => (
                  <span key={idx} className="bg-slate-800 text-amber-200 text-[10px] px-1.5 py-0.5 rounded border border-white/5">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Fact-Based Insights Section */}
          {result.keyFacts && result.keyFacts.length > 0 && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
              <span className="text-[11px] text-cyan-300 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                Tekshirilgan Rasmiy Faktlar va Savdo Ko'rsatkichlari:
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                {result.keyFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug text-[11px]">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Market Outlook & Recommendation */}
          <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 text-xs space-y-2">
            <span className="text-amber-400 font-bold block flex items-center gap-1">
              <span>📊 Bozor Kon'yunkturasi & Hajmi:</span>
            </span>
            <p className="text-slate-200 leading-relaxed text-xs">
              {result.marketOutlook}
            </p>
            <p className="text-amber-200 font-semibold pt-2 border-t border-amber-500/20 text-xs">
              💡 {result.recommendedAction}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400">
              Ushbu tovar bo'yicha to'liq transport, bojxona va sof foyda hisobi kerakmi?
            </span>

            <button
              type="button"
              onClick={handleAskAIInDepth}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Smart AI Chatda To'liq Hisoblash</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
