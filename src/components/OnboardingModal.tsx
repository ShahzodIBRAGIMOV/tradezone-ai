import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Sprout, 
  Truck, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  User, 
  Phone, 
  Layers,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserRole } from '../types/trade';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveUser: (user: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
}) => {
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [companyName, setCompanyName] = useState(currentUser.companyName);
  const [industryFocus, setIndustryFocus] = useState(currentUser.industryFocus);
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [isSaved, setIsSaved] = useState(false);

  // Synchronize state whenever modal opens or currentUser updates
  useEffect(() => {
    if (isOpen) {
      setRole(currentUser.role);
      setFullName(currentUser.fullName);
      setCompanyName(currentUser.companyName);
      setIndustryFocus(currentUser.industryFocus);
      setPhoneNumber(currentUser.phoneNumber || '');
      setIsSaved(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      ...currentUser,
      fullName: fullName.trim() || 'Tadbirkor',
      companyName: companyName.trim() || 'TradeZone B2B Korxonasi',
      role: role,
      industryFocus: industryFocus.trim() || 'Qishloq xo\'jaligi va oziq-ovqat',
      phoneNumber: phoneNumber.trim(),
    };

    onSaveUser(updatedUser);
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 400);
  };

  const roles = [
    {
      id: 'TADBIRKOR' as UserRole,
      title: 'Tadbirkor / Ishlab chiqaruvchi',
      badge: 'Biznes & Eksport',
      desc: 'Mahalliy tovarlarni jahon bozorlariga eksport qilish, texnologiyalar importi va mahalliylashtirish dasturi.',
      icon: Building2,
      activeColor: 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/50',
      iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'FERMER' as UserRole,
      title: 'Fermer / Agroklaster',
      badge: 'Qishloq xo\'jaligi',
      desc: 'Meva-sabzavot, gilos, uzum va dukkakli ekinlarni Fitosanitariya va GlobalG.A.P. standartlarida eksport qilish.',
      icon: Sprout,
      activeColor: 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/50',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'LOGISTIKA' as UserRole,
      title: 'Logistika agenti / Bojxona brokeri',
      badge: 'Transport & Bojxona',
      desc: 'TIR avtotransport, refrijerator va temiryo\'l yuk tashish marshrutlari, BYuD bojxona deklaratsiyasi.',
      icon: Truck,
      activeColor: 'border-sky-400 bg-sky-500/20 text-sky-300 ring-2 ring-sky-400/50',
      iconBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-xl w-full border border-amber-500/30 overflow-hidden text-white backdrop-blur-xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-white">
                Foydalanuvchi Profili & Ma'lumotlari
              </h2>
            </div>
            <p className="text-xs text-amber-300/80 mt-1">
              O'z ma'lumotlaringiz va rolingizni istalgan paytda erkin o'zgartirishingiz mumkin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Scrollable if screen is small) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Role Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Foydalanuvchi Roli:</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Tanlangan: <strong className="text-white">{roles.find(r => r.id === role)?.title.split('/')[0]}</strong>
              </span>
            </div>

            <div className="space-y-2.5">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-150 active:scale-[0.98] flex items-start gap-3.5 cursor-pointer relative ${
                      isSelected
                        ? `${r.activeColor} shadow-lg`
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border ${isSelected ? r.iconBg : 'bg-slate-800/80 border-slate-700 text-slate-400'} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{r.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                          isSelected ? 'bg-white/10 text-white border-white/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{r.desc}</p>
                    </div>

                    {/* Radio indicator circle */}
                    <div className="absolute right-3.5 top-3.5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-white bg-white text-slate-950 shadow-xs' 
                          : 'border-slate-600 bg-slate-800'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Foydalanuvchi Ism-sharifi *</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masalan: Sardor Aliyev"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Korxona / Kompaniya Nomi *</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Masalan: Trade Smart Export MCHJ"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Asosiy Faoliyat Yo'nalishi *</span>
              </label>
              <select
                value={industryFocus}
                onChange={(e) => setIndustryFocus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition cursor-pointer"
              >
                <option value="Qishloq xo'jaligi va oziq-ovqat">Qishloq xo'jaligi va oziq-ovqat</option>
                <option value="Yuqori texnologiyalar, smartfonlar va chiplar">Yuqori texnologiyalar, smartfonlar va chiplar</option>
                <option value="To'qimachilik va tayyor tekstil">To'qimachilik va tayyor tekstil</option>
                <option value="Sanoat xomashyosi va metallurgiya">Sanoat xomashyosi va metallurgiya</option>
                <option value="Kimyo, polimerlar va qadoqlash">Kimyo, polimerlar va qadoqlash</option>
                <option value="Xalqaro logistika va bojxona rasmiylashtiruvi">Xalqaro logistika va bojxona rasmiylashtiruvi</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Telefon Raqami (Ixtiyoriy)</span>
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * Ma'lumotlar brauzeringizda avtomatik saqlanadi
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-black rounded-xl shadow-lg transition-all duration-150 active:scale-95 hover:scale-[1.03] cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>Saqlandi!</span>
                  </>
                ) : (
                  <>
                    <span>Saqlash va Davom etish</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
