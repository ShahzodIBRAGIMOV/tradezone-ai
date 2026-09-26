import React, { useState, useEffect } from 'react';
import { 
  X, 
  Megaphone, 
  PlusCircle, 
  Phone, 
  Send, 
  Mail, 
  MapPin, 
  Tag, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Search, 
  Package, 
  DollarSign, 
  FileText, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { TradeAdvertisement, UserProfile } from '../types/trade';
import { soundEffects } from '../utils/audioEffects';

interface TradeAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

const STORAGE_KEY = 'tradezone_b2b_advertisements';

const INITIAL_ADS: TradeAdvertisement[] = [
  {
    id: 'ad-1',
    title: 'Namangan 100% Paxta Kalava Ipi (Cotton Yarn Ne 30/1 ring)',
    category: 'Tekstil va charm',
    hsCode: '5205 12 000 0',
    price: '$2.45 / kg (FOB Toshkent/Namangan)',
    quantity: 'Oyiga 80 tonnagacha (Minimal 5 tonna)',
    origin: 'Namangan viloyati, Chust tumani',
    description: 'Yuqori sifatli 100% taroqli paxta iplari. To\'qimachilik fabrikalari, trikotaj va paypoq ishlab chiqarish uchun ideal. OEKO-TEX Standard 100 va ISO 9001 sertifikatlariga ega. Yevropa va MDHga eksportga to\'liq tayyor.',
    certificates: 'OEKO-TEX 100, ISO 9001, GSP+ 0% boj',
    contactName: 'Bobur Mirzayev (Eksport bo\'limi rahbari)',
    contactPhone: '+998 90 770 12 34',
    contactTelegram: 'chust_textile_uz',
    contactEmail: 'export@chusttextile.uz',
    location: 'Namangan vil., Chust sh., Sanoatchilar ko\'chasi 12-bino',
    createdAt: '2026-03-24',
    isOwner: false,
  },
  {
    id: 'ad-2',
    title: 'Saralangan Namangan O\'rigi va Quritilgan Mayiz (Organic Dry Fruits)',
    category: 'Qishloq xo\'jaligi',
    hsCode: '0813 10 000 0',
    price: '$3.80 / kg (Refrijerator / Tent)',
    quantity: '25 tonna mavjud omborda',
    origin: 'Namangan viloyati, Kosonsoy tumani',
    description: 'Tabiiy quyoshda quritilgan, oltingugurtsiz (sulfur-free) va saralangan yuqori navli o\'rik qoqisi hamda mayiz. Oziq-ovqat xavfsizligi fitosanitariya va Global G.A.P. xalqaro sertifikatlariga ega.',
    certificates: 'Global G.A.P., Fitosaniariya, Halal',
    contactName: 'Mansur Hakimov (Agro-eksport menejeri)',
    contactPhone: '+998 91 360 45 88',
    contactTelegram: 'namangan_agro_export',
    contactEmail: 'info@kosonsoyagro.uz',
    location: 'Kosonsoy tumani, Tergachi MFY',
    createdAt: '2026-03-22',
    isOwner: false,
  },
  {
    id: 'ad-3',
    title: 'Sanoat Transformatorlari va Tarmoq Elektr Shkaflari (TMG-100-1000)',
    category: 'Sanoat va metallurgiya',
    hsCode: '8504 21 000 0',
    price: 'Kelishilgan narxda (Zavod narxida)',
    quantity: 'Haftasiga 15 komplekt buyurtma asosida',
    origin: 'Namangan viloyati, To\'raqo\'rg\'on tumani',
    description: 'Moyli germetik transformatorlar TMG seriyasi. Sanoat zonalari va yangi korxonalar uchun energiya tejamkor yechim. 3 yillik kafolat va xalqaro GOST/IEC sertifikatlari bilan yetkaziladi.',
    certificates: 'GOST R, IEC Standard, Kafolat 36 oy',
    contactName: 'Jamshid Qodirov (Savdo direktori)',
    contactPhone: '+998 97 250 80 90',
    contactTelegram: 'electrotech_namangan',
    contactEmail: 'sales@electrotech.uz',
    location: 'To\'raqo\'rg\'on EIZ hududi',
    createdAt: '2026-03-20',
    isOwner: false,
  },
];

export const TradeAdsModal: React.FC<TradeAdsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [ads, setAds] = useState<TradeAdvertisement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tekstil va charm');
  const [hsCode, setHsCode] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [origin, setOrigin] = useState('Namangan viloyati');
  const [description, setDescription] = useState('');
  const [certificates, setCertificates] = useState('GSP+, ISO 9001');
  
  // Contact details
  const [contactName, setContactName] = useState(user.fullName || '');
  const [contactPhone, setContactPhone] = useState(user.phoneNumber || '+998 9');
  const [contactTelegram, setContactTelegram] = useState('');
  const [contactEmail, setContactEmail] = useState(user.email || '');
  const [location, setLocation] = useState(user.companyName || 'Namangan shahri');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    } catch {}
  }, [ads]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contactPhone.trim()) {
      alert('Iltimos, tovar nomi va telefon raqamingizni kiriting!');
      return;
    }

    soundEffects.playChime();

    const newAd: TradeAdvertisement = {
      id: `ad-${Date.now()}`,
      title: title.trim(),
      category,
      hsCode: hsCode.trim() || undefined,
      price: price.trim() || 'Kelishuv asosida',
      quantity: quantity.trim() || 'Buyurtmaga ko\'ra',
      origin: origin.trim() || 'Namangan',
      description: description.trim() || 'Sifatli mahsulot, to\'g\'ridan-to\'g\'ri ishlab chiqaruvchidan.',
      certificates: certificates.trim() || undefined,
      contactName: contactName.trim() || user.fullName || 'Tadbirkor',
      contactPhone: contactPhone.trim(),
      contactTelegram: contactTelegram.trim().replace(/^@/, '') || undefined,
      contactEmail: contactEmail.trim() || undefined,
      location: location.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      isOwner: true,
    };

    setAds([newAd, ...ads]);
    setSuccessMessage('Reklamangiz muvaffaqiyatli joylashtirildi va vitrinaga chiqdi!');
    
    // Reset form
    setTitle('');
    setHsCode('');
    setPrice('');
    setQuantity('');
    setDescription('');

    setTimeout(() => {
      setSuccessMessage(null);
      setActiveTab('list');
    }, 1200);
  };

  const categories = [
    'Barchasi',
    'Tekstil va charm',
    'Qishloq xo\'jaligi',
    'Sanoat va metallurgiya',
    'Qurilish materiallari',
    'Oziq-ovqat',
    'Kimyo va plastmassa'
  ];

  const filteredAds = ads.filter(ad => {
    const matchesCat = selectedCategory === 'Barchasi' || ad.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.hsCode && ad.hsCode.includes(searchQuery)) ||
      ad.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Reklama & B2B Savdo E'lonlari Xizmati
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Faol Vitrina
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sotmoqchi bo'lgan tovaringiz haqida ma'lumot yozing va xaridorlar bilan to'g'ridan-to'g'ri bog'laning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
          <button
            onClick={() => {
              soundEffects.playClick(900);
              setActiveTab('create');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Tovar E'lonini Joylashtirish (Sotish)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick(920);
              setActiveTab('list');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-4 h-4 text-cyan-400" />
            <span>B2B Reklama Vitrinasi ({ads.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'create' ? (
            /* CREATE AD FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Product Info Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-800 pb-2.5">
                  <Package className="w-4 h-4" />
                  <span>1. Sotmoqchi Bo'lgan Tovaringiz Haqida Ma'lumot</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tovar / Mahsulot Nomi <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masalan: Namangan 100% paxta kalava ipi (Ne 30/1 ring) yoki Yangi saralangan o'rik"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Soha / Kategoriya
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                    >
                      <option value="Tekstil va charm">Tekstil va charm</option>
                      <option value="Qishloq xo'jaligi">Qishloq xo'jaligi (Mevalar, Sabzavotlar)</option>
                      <option value="Sanoat va metallurgiya">Sanoat va elektrotexnika</option>
                      <option value="Qurilish materiallari">Qurilish materiallari</option>
                      <option value="Oziq-ovqat">Oziq-ovqat va ichimliklar</option>
                      <option value="Kimyo va plastmassa">Kimyo va polimerlar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      TIF TN Kodi (Ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      value={hsCode}
                      onChange={(e) => setHsCode(e.target.value)}
                      placeholder="Masalan: 5205 12 000 0 yoki 0813 10"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Narxi & Shartlari
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Masalan: $2.40 / kg yoki 25,000 so'm / dona"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mavjud Hajm / Minimal Buyurtma (MOQ)
                    </label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Masalan: 20 tonna omborda (Minimal 2 tonna)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Ishlab Chiqarilgan Hudud
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Masalan: Namangan viloyati, Chust tumani"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Sertifikatlar & Standartlar
                    </label>
                    <input
                      type="text"
                      value={certificates}
                      onChange={(e) => setCertificates(e.target.value)}
                      placeholder="Masalan: ISO 9001, GSP+ Yevropa 0%, Halal, OEKO-TEX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tovar Haqida Qo'shimcha Tavsif va Afzalliklar
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mahsulotning sifati, qadoqlash turi, yetkazib berish shartlari (FOB, CIF, EXW) yoki eksport tajribangiz haqida batafsil yozing..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-slate-800 pb-2.5">
                  <Phone className="w-4 h-4" />
                  <span>2. Aloqaga Chiqish Uchun Kerakli Ma'lumotlar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mas'ul Shaxs / Kompaniya Nomi <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="F.I.Sh yoki korxona eksport bo'limi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Telefon Raqami (Qo'ng'iroq uchun) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Telegram Username yoki Guruh
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm">@</span>
                      <input
                        type="text"
                        value={contactTelegram}
                        onChange={(e) => setContactTelegram(e.target.value)}
                        placeholder="telegram_profil"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Elektron Pochta (Email)
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="export@kompaniya.uz"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Ofis / Ombor Joylashuvi (Manzil)
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Masalan: Namangan shahri, Amir Temur ko'chasi 25-bino"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition cursor-pointer"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Reklamani Joylashtirish (Chop etish)</span>
                </button>
              </div>

            </form>
          ) : (
            /* B2B ADS LISTING / VITRINA */
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tovar nomi, TIF TN yoki shahar bo'yicha qidirish..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        soundEffects.playClick(950);
                        setSelectedCategory(cat);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ads Grid */}
              <div className="space-y-3.5">
                {filteredAds.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                    <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-semibold text-sm">
                      Ushbu bo'limda hali e'lonlar mavjud emas
                    </p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="mt-3 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition cursor-pointer"
                    >
                      Birinchi bo'lib tovar e'lonini joylashtiring →
                    </button>
                  </div>
                ) : (
                  filteredAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 group shadow-md"
                    >
                      {/* Top Bar of Card */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              {ad.category}
                            </span>
                            {ad.hsCode && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                                TIF TN: {ad.hsCode}
                              </span>
                            )}
                            {ad.isOwner && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                Sizning e'loningiz
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                            {ad.title}
                          </h3>
                        </div>

                        <div className="text-right">
                          <span className="text-sm sm:text-base font-black text-emerald-400 block font-mono">
                            {ad.price}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {ad.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                        {ad.description}
                      </p>

                      {/* Meta badges */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{ad.origin}</span>
                        </span>
                        {ad.certificates && (
                          <span className="flex items-center gap-1 text-cyan-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{ad.certificates}</span>
                          </span>
                        )}
                      </div>

                      {/* Contact Actions Footer */}
                      <div className="pt-2.5 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-xs">
                            {ad.contactName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {ad.contactName}
                            </span>
                            {ad.location && (
                              <span className="text-[10px] text-slate-400 block">
                                {ad.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Direct Phone Call */}
                          <a
                            href={`tel:${ad.contactPhone.replace(/\s+/g, '')}`}
                            onClick={() => soundEffects.playClick(900)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition active:scale-95 cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Qo'ng'iroq: {ad.contactPhone}</span>
                          </a>

                          {/* Direct Telegram Chat */}
                          {ad.contactTelegram && (
                            <a
                              href={`https://t.me/${ad.contactTelegram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => soundEffects.playClick(920)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500 hover:text-slate-950 text-sky-300 border border-sky-500/40 text-xs font-bold transition active:scale-95 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Telegram</span>
                            </a>
                          )}

                          {/* Email */}
                          {ad.contactEmail && (
                            <a
                              href={`mailto:${ad.contactEmail}`}
                              onClick={() => soundEffects.playClick(910)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition cursor-pointer"
                              title={ad.contactEmail}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Info */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>O'zbekiston & Namangan B2B Ishlab chiqaruvchilar va Eksportchilar Portali</span>
          </span>
          <span className="text-slate-500 font-mono">
            {ads.length} faol e'lon
          </span>
        </div>

      </div>
    </div>
  );
};
