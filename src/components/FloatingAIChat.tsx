import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Bot, 
  User, 
  Calendar, 
  FileCheck2, 
  Calculator, 
  Factory, 
  Copy, 
  Check, 
  RotateCcw,
  ArrowRight,
  Maximize2,
  Minimize2,
  Cpu,
  Globe2
} from 'lucide-react';
import { AIChatPromptCategory, ChatMessageItem, UserProfile } from '../types/trade';

interface FloatingAIChatProps {
  user: UserProfile;
  initialPrompt?: string;
  isAutoOpened?: boolean;
}

export const FloatingAIChat: React.FC<FloatingAIChatProps> = ({
  user,
  initialPrompt,
  isAutoOpened = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpandedFull, setIsExpandedFull] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState<AIChatPromptCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Assalomu alaykum, **${user.fullName}**! Men **TradeZone AI** savdo konsalting tizimiman. 

Sizga eksport, import va yuqori texnologiyalar bo'yicha quyidagi asosiy yo'nalishlarda amaliy yordam beraman:
1. 🌸 **Mavsumiy tahlil:** Qaysi davlatga hozir nima eksport qilish yuqori marja beradi?
2. 📜 **Sertifikatlar & Bojxona:** Fitosanitariya, ST-1 (MDH 0%), EUR.1 (GSP+ Yevropa 0% boj), UZIMEI va muvofiqlik.
3. 🧮 **Moliyaviy kalkulyator:** Masalan: *"10 tonna olma Rossiyaga"* yoki *"1000 dona smartfon Xitoydan"* deb yozsangiz, transport va sof foydani hisoblayman.
4. 📱 **Texnika & Chiplar:** Smartfonlar, mikrosxemalar, noutbuklar importi va O'zbekistonda yig'ish (SKD) imkoniyati.
5. 🏭 **Import o'rnini bosish:** Qizil hudud tovarlari bo'yicha ixcham mahalliylashtirish biznes-rejasi.

Quyidagi tugmalardan birini tanlang yoki o'z savolingizni yozing!`,
      timestamp: 'Hozir',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && (prev[0].id === 'welcome' || prev[0].id === 'welcome-reset')) {
        const roleTitle = user.role === 'TADBIRKOR' ? 'Tadbirkor' : user.role === 'FERMER' ? 'Fermer' : 'Logistika agenti';
        return [
          {
            ...prev[0],
            content: `Assalomu alaykum, **${user.fullName}** (${roleTitle})! Men **TradeZone AI** savdo konsalting tizimiman. 

Sizga eksport, import va yuqori texnologiyalar bo'yicha quyidagi asosiy yo'nalishlarda amaliy yordam beraman:
1. 🌸 **Mavsumiy tahlil:** Qaysi davlatga hozir nima eksport qilish yuqori marja beradi?
2. 📜 **Sertifikatlar & Bojxona:** Fitosanitariya, ST-1 (MDH 0%), EUR.1 (GSP+ Yevropa 0% boj), UZIMEI va muvofiqlik.
3. 🧮 **Moliyaviy kalkulyator:** Masalan: *"10 tonna olma Rossiyaga"* yoki *"1000 dona smartfon Xitoydan"* deb yozsangiz, transport va sof foydani hisoblayman.
4. 📱 **Texnika & Chiplar:** Smartfonlar, mikrosxemalar, noutbuklar importi va O'zbekistonda yig'ish (SKD) imkoniyati.
5. 🏭 **Import o'rnini bosish:** Qizil hudud tovarlari bo'yicha ixcham mahalliylashtirish biznes-rejasi.

Quyidagi tugmalardan birini tanlang yoki o'z savolingizni yozing!`,
          },
        ];
      }
      return prev;
    });
  }, [user.fullName, user.role]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialPrompt) {
      setIsOpen(true);
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (customText?: string, categoryType?: AIChatPromptCategory) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      category: categoryType || activeCategory || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          category: categoryType || activeCategory,
          userRole: user.role,
          companyName: user.companyName,
          industryFocus: user.industryFocus,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessageItem = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          content: data.reply,
          category: categoryType || activeCategory || undefined,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setTimeout(() => {
        const aiMsg: ChatMessageItem = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          content: `### 📈 TradeZone AI Tahlili (${user.role} uchun)

Sizning so'rovingiz bo'yicha: **"${textToSend}"**

1. **Bozor va TIF TN tahlili:**
   - Joriy mavsumda mazkur tovar yo'nalishida O'zbekiston mahsulotlariga MDH va Yevroittifoq (GSP+ orqali 0% stavka) bozorlarida talab yuqori.
   - Bojxona rasmiylashtiruvi "Yashil yo'lak" orqali amalga oshiriladi.

2. **Xarajat va Marja:**
   - 10 tonna meva-sabzavot yoki to'qimachilik mahsulotlarini eksport qilishda logistika xarajatlari o'rtacha 18-25% ni, kutilayotgan sof foyda rentabelligi esa 35-50% ni tashkil qiladi.
   - Hujjatlar: ST-1 kelib chiqish sertifikati, Fitosanitariya karantin ruxsatnomasi va elektron BYuD.

Qo'shimcha hisob-kitob yoki aniq davlat bo'yicha boj stavkalari kerakmi?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptChipClick = (cat: AIChatPromptCategory, text: string) => {
    setActiveCategory(cat);
    handleSendMessage(text, cat);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        content: `Muloqot yangilandi. Qanday savdo, texnika, eksport yoki import masalasida yordam bera olaman?`,
        timestamp: 'Hozir',
      },
    ]);
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isExpandedFull
          ? 'inset-2 sm:inset-6 max-w-5xl mx-auto'
          : isOpen
          ? 'bottom-0 right-0 sm:right-6 w-full sm:w-[490px] max-h-[640px]'
          : 'bottom-0 right-0 sm:right-6 w-full sm:w-[440px]'
      }`}
    >
      <div className="bg-slate-950/95 backdrop-blur-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-amber-500/30 flex flex-col overflow-hidden h-full max-h-[85vh] sm:max-h-[640px] ring-1 ring-amber-500/20">
        
        {/* Floating Bar Header with Gold & Obsidian Luxury Theme */}
        <div 
          onClick={() => !isExpandedFull && setIsOpen(!isOpen)}
          className="bg-linear-to-r from-slate-950 via-slate-900 to-amber-950/90 text-white px-4 py-3 sm:py-3.5 flex items-center justify-between cursor-pointer select-none border-b border-amber-500/20"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-sm">
                <Bot className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 ring-2 ring-slate-950 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-tight">
                  TradeZona <span className="text-amber-400">AI Chat</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                  RAG Konsalting
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {user.role}: {user.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isOpen && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleResetChat(); }}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer"
                  title="Yangi muloqot boshlash"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsExpandedFull(!isExpandedFull); }}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer hidden sm:block"
                  title={isExpandedFull ? "Kichiklashtirish" : "To'liq ekranga yoyish"}
                >
                  {isExpandedFull ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer"
            >
              {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* When Open: Chat Body */}
        {isOpen && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-950/80">
            
            {/* Quick Action Prompt Chips with Snappy Hover */}
            <div className="p-2.5 bg-slate-900/90 border-b border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handlePromptChipClick('seasonal', 'Hozirgi mavsumda qaysi davlatlarga nima eksport qilish eng foydali?')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 whitespace-nowrap transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
              >
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>1. Mavsumiy tahlil</span>
              </button>

              <button
                onClick={() => handlePromptChipClick('certificate', 'Meva-sabzavot, to\'qimachilik yoki texnika eksporti/importi uchun qanday sertifikatlar (Fito, ST-1, UZIMEI) kerak?')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 hover:bg-blue-500 hover:text-slate-950 text-blue-300 text-[11px] font-semibold border border-blue-500/30 whitespace-nowrap transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
              >
                <FileCheck2 className="w-3 h-3 text-blue-400" />
                <span>2. Sertifikatlar</span>
              </button>

              <button
                onClick={() => handlePromptChipClick('calculator', '10 tonna olma Rossiyaga yoki 1000 dona smartfon Xitoydan olib kirilsa, transport, bojxona va sof foyda qanday bo\'ladi?')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[11px] font-semibold border border-amber-500/30 whitespace-nowrap transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
              >
                <Calculator className="w-3 h-3 text-amber-400" />
                <span>3. Moliyaviy hisob</span>
              </button>

              <button
                onClick={() => handlePromptChipClick('substitution', 'O\'zbekistonda smartfon yig\'uv liniyasi (SKD) yoki gofrokarton ishlab chiqarish bo\'yicha ixcham biznes-reja')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 hover:bg-rose-500 hover:text-slate-950 text-rose-300 text-[11px] font-semibold border border-rose-500/30 whitespace-nowrap transition-all duration-150 active:scale-95 hover:scale-[1.02] cursor-pointer"
              >
                <Factory className="w-3 h-3 text-rose-400" />
                <span>4. Mahalliylashtirish</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 shadow-md leading-relaxed space-y-1.5 ${
                      m.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-semibold rounded-tr-xs shadow-amber-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] break-words">
                      {m.content}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                      <span>{m.timestamp}</span>
                      {m.sender === 'assistant' && (
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="hover:text-amber-400 flex items-center gap-1 transition"
                          title="Nusxa olish"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Nusxalandi</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Nusxa olish</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-6 h-6 rounded-md bg-slate-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-amber-500/30">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 items-center text-slate-400 text-xs bg-slate-900 p-3 rounded-2xl border border-slate-800 w-fit">
                  <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 animate-spin" />
                  </div>
                  <span>TradeZona AI tahlil qilmoqda...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form with Fast Snappy Submit */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder='Savol bering: "10 tonna olma Rossiyaga" yoki "iPhone UZIMEI bojlari"...'
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950 text-white border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl shadow-md transition-all duration-150 active:scale-95 hover:scale-[1.05] hover:shadow-amber-500/30 cursor-pointer"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
