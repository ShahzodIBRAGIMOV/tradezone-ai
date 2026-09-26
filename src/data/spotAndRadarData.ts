export interface SpotCommodity {
  id: string;
  name: string;
  nameUz: string;
  hsCode: string;
  category: 'agro' | 'industrial';
  spotPrice: number;
  unit: string;
  currency: string;
  priceUzS: number;
  changePercent: number; // e.g. +2.4 or -1.1
  changeAmount: number;
  trend: 'up' | 'down' | 'stable';
  exchangeName: string; // e.g., "UZEX Spot / Tashkent", "LME / AGMK", "Cotlook A Index"
  tradingVolume: string; // e.g., "1,450 tonna"
  minMax24h: [number, number];
  fobCifComparison?: {
    fobTashkent: string;
    cifDestination: string;
    destinationName: string;
    spread: string;
  };
  recommendation: string;
  lastUpdated: string;
}

export interface TradeRadarSignal {
  id: string;
  title: string;
  category: 'export' | 'import' | 'currency' | 'logistics';
  priority: 'high' | 'medium' | 'opportunity';
  tag: string;
  badgeColor: string;
  summary: string;
  impactAnalysis: string;
  actionableStep: string;
  targetMarket: string;
  affectedProducts: string[];
  suggestedPrompt: string;
  timestamp: string;
}

export const INITIAL_SPOT_COMMODITIES: SpotCommodity[] = [
  {
    id: 'spot-cherry',
    name: 'Sweet Cherries (Saralangan Gilos)',
    nameUz: 'Yangi gilos (28mm+, saralangan)',
    hsCode: '0809.29.00',
    category: 'agro',
    spotPrice: 3.85,
    unit: 'kg',
    currency: 'USD',
    priceUzS: 45500,
    changePercent: 3.2,
    changeAmount: 0.12,
    trend: 'up',
    exchangeName: 'Vodiy Agro Spot (Farg\'ona/Namangan)',
    tradingVolume: '420 tonna / sutka',
    minMax24h: [3.70, 3.95],
    fobCifComparison: {
      fobTashkent: '$3.85 / kg',
      cifDestination: '$6.50 / kg',
      destinationName: 'Moskva (Food City)',
      spread: '+$2.65 / kg (Netto foyda: 41%)'
    },
    recommendation: 'Moskva va Sankt-Peterburg bozorlarida talab eng yuqori nuqtada. Avto-refrijerator transportini oldindan band qilish zarur.',
    lastUpdated: 'Bugun, 09:30'
  },
  {
    id: 'spot-copper',
    name: 'Refined Copper Cathodes (Mis katodi)',
    nameUz: 'Mis katodlari (Marka M00k, 99.99%)',
    hsCode: '7403.11.00',
    category: 'industrial',
    spotPrice: 9480,
    unit: 'tonna',
    currency: 'USD',
    priceUzS: 112100000,
    changePercent: 1.45,
    changeAmount: 135,
    trend: 'up',
    exchangeName: 'UZEX / OKMK (AGMK) Eksport Birjasi',
    tradingVolume: '1,800 tonna',
    minMax24h: [9350, 9520],
    fobCifComparison: {
      fobTashkent: '$9,480 / t',
      cifDestination: '$9,820 / t',
      destinationName: 'Istanbul / Mersin porti',
      spread: '+$340 / t (LME asosida)'
    },
    recommendation: 'Turkiya va Xitoy kabel zavodlari tomonidan faol xarid kuzatilmoqda. Spot fyuchers shartnomalarini uzaytirish tavsiya etiladi.',
    lastUpdated: 'Bugun, 10:15'
  },
  {
    id: 'spot-cotton',
    name: 'Cotton Fiber (Paxta tolasi 1-nav)',
    nameUz: 'Paxta tolasi (O\'rta tolali, 1-nav, 4-tip)',
    hsCode: '5201.00.00',
    category: 'agro',
    spotPrice: 1980,
    unit: 'tonna',
    currency: 'USD',
    priceUzS: 23410000,
    changePercent: -0.6,
    changeAmount: -12,
    trend: 'down',
    exchangeName: 'UZEX Birjasi / Cotlook A Index',
    tradingVolume: '3,200 tonna',
    minMax24h: [1970, 2010],
    fobCifComparison: {
      fobTashkent: '$1,980 / t',
      cifDestination: '$2,190 / t',
      destinationName: 'Qingdao (Xitoy) porti',
      spread: '+$210 / t (Tranzit xarajati)'
    },
    recommendation: 'Jahon paxta kotirovkalarida yengil tuzatish (korreksiya). Mahalliy to\'qimachilik klasterlari uchun xarid qilishga qulay fursat.',
    lastUpdated: 'Bugun, 11:00'
  },
  {
    id: 'spot-hdpe',
    name: 'HDPE Polymer Granules (Polietilen)',
    nameUz: 'Polietilen granulalari (Shurtan / Uz-Kor Gas)',
    hsCode: '3901.20.90',
    category: 'industrial',
    spotPrice: 1140,
    unit: 'tonna',
    currency: 'USD',
    priceUzS: 13480000,
    changePercent: 2.1,
    changeAmount: 23.5,
    trend: 'up',
    exchangeName: 'UZEX Sanoat Auksioni / Ustyurt GKM',
    tradingVolume: '2,650 tonna',
    minMax24h: [1115, 1150],
    fobCifComparison: {
      fobTashkent: '$1,140 / t',
      cifDestination: '$1,310 / t',
      destinationName: 'Poti (Gruziya) orqali Yevropa',
      spread: '+$170 / t'
    },
    recommendation: 'Yevropa va Turkiya plastmassa quvur hamda qadoqlash korxonalari talabi ortgan. GSP+ boji 0%.',
    lastUpdated: 'Bugun, 10:45'
  },
  {
    id: 'spot-raisins',
    name: 'Black Kishmish Raisins (Qora mayiz)',
    nameUz: 'Quritilgan soyaki qora kishmish (Samarqand)',
    hsCode: '0806.20.30',
    category: 'agro',
    spotPrice: 3.40,
    unit: 'kg',
    currency: 'USD',
    priceUzS: 40200,
    changePercent: 1.8,
    changeAmount: 0.06,
    trend: 'up',
    exchangeName: 'Samarqand & Urgut Agrobirjasi',
    tradingVolume: '190 tonna',
    minMax24h: [3.30, 3.45],
    fobCifComparison: {
      fobTashkent: '$3.40 / kg',
      cifDestination: '$5.60 / kg',
      destinationName: 'Hamburg (Germaniya)',
      spread: '+$2.20 / kg (GSP+ 0% boj)'
    },
    recommendation: 'Yevropa Ittifoqiga eksport qilishda aflatoksin va ochratoksin A laboratoriya tahlillari ST-1 bilan birga talab etiladi.',
    lastUpdated: 'Bugun, 08:50'
  },
  {
    id: 'spot-urea',
    name: 'Mineral Fertilizer / Urea (Karbamid)',
    nameUz: 'Karbamid mineral o\'g\'iti (Marka B)',
    hsCode: '3102.10.10',
    category: 'industrial',
    spotPrice: 385,
    unit: 'tonna',
    currency: 'USD',
    priceUzS: 4552000,
    changePercent: -1.2,
    changeAmount: -4.8,
    trend: 'down',
    exchangeName: 'Maxam-Chirchiq / Navoiyazot Spot',
    tradingVolume: '5,100 tonna',
    minMax24h: [380, 395],
    recommendation: 'Qo\'shni Afg\'oniston va Qozog\'iston agrar sektoriga eksport shartnomalari faol amalga oshirilmoqda.',
    lastUpdated: 'Bugun, 11:30'
  },
  {
    id: 'spot-rebar',
    name: 'Steel Rebar A500C (Qurilish armaturasi)',
    nameUz: 'Po\'lat armatura (A500C, d 12-25mm)',
    hsCode: '7214.20.00',
    category: 'industrial',
    spotPrice: 690,
    unit: 'tonna',
    currency: 'USD',
    priceUzS: 8159000,
    changePercent: 0.7,
    changeAmount: 5.0,
    trend: 'stable',
    exchangeName: 'O\'zmetkombinat (Bekobod) Birjasi',
    tradingVolume: '4,800 tonna',
    minMax24h: [685, 695],
    recommendation: 'Markaziy Osiyo ichki bozorida qurilish mavsumi davom etayotgani sababli narx barqaror darajada saqlanmoqda.',
    lastUpdated: 'Bugun, 09:10'
  },
  {
    id: 'spot-gold',
    name: 'Gold Bullion 999.9 (Navoiy oltin quymasi)',
    nameUz: 'Bank o\'lchovli oltin quymasi (999.9 proba)',
    hsCode: '7108.13.10',
    category: 'industrial',
    spotPrice: 84.50,
    unit: 'gramm',
    currency: 'USD',
    priceUzS: 999200,
    changePercent: 0.9,
    changeAmount: 0.75,
    trend: 'up',
    exchangeName: 'Markaziy Bank / London Bullion (LBMA)',
    tradingVolume: '120 kg',
    minMax24h: [83.80, 84.90],
    recommendation: 'Global noaniqliklar fonida oltin narxi yangi tarixiy cho\'qqilarni zabt etmoqda. Zargarlik xomashyosi talabi barqaror.',
    lastUpdated: 'Bugun, 12:00'
  }
];

export const INITIAL_TRADE_RADAR_SIGNALS: TradeRadarSignal[] = [
  {
    id: 'sig-1',
    title: 'Gilos va Saralangan Mevalar Eksportida Narx Arbitraji',
    category: 'export',
    priority: 'high',
    tag: 'Eksport Imkoniyati',
    badgeColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    summary: 'Rossiya va BAA (Dubay) bozorlarida yangi hosil gilosi va o\'rikka talab o\'tgan haftaga nisbatan +28% oshdi. Farg\'ona FOB narxi ($3.85/kg) va Moskva CIF narxi ($6.50/kg) orasidagi marja 41% ni tashkil qilmoqda.',
    impactAnalysis: 'Avto-refrijerator transporti (harorati +2°C) orqali yetkazib berish muddati 4.5 kun. Har bir 20 tonnalik furaning kutilayotgan sof foydasi $18,000 - $22,000 atrofida.',
    actionableStep: 'Karantin ruxsatnomasi va ST-1 sertifikatini onlayn oling, avto-refrijerator logistika zaxirasini 48 soat oldin band qiling.',
    targetMarket: 'Rossiya Federatsiyasi & BAA',
    affectedProducts: ['Gilos', 'O\'rik', 'Shaftoli'],
    suggestedPrompt: '20 tonna saralangan gilosni Farg\'onadan Moskva (Food City) bozoriga avto-refrijeratorda eksport qilishning to\'liq xarajat, yo\'l bojxona va kutilayotgan sof foyda hisobini tuzib ber.',
    timestamp: 'Bugun, 08:30'
  },
  {
    id: 'sig-2',
    title: 'Yevropa Ittifoqining GSP+ Qoidalariga Yangi O\'zgarishlar',
    category: 'export',
    priority: 'opportunity',
    tag: 'GSP+ 0% Boj',
    badgeColor: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
    summary: 'O\'zbekiston to\'qimachilik mahsulotlari (kalava ip, tayyor kiyim-kechak) va quritilgan mevalari uchun Yevropa Ittifoqiga 0% bojxona preferensiyasi (GSP+) bo\'yicha Yevropa distribyutorlaridan yangi buyurtmalar kelib tushmoqda.',
    impactAnalysis: 'Oddiy bojlarga nisbatan (standart 4-12%) o\'zbek mahsulotlari Germaniya va Polsha bozorlarida Turkiya va Pokiston tovarlariga nisbatan 8% narx afzalligiga ega.',
    actionableStep: 'EUR.1 yoki REX (Registered Exporter System) ro\'yxatidan o\'tish va OEKO-TEX sertifikatlarini yangilash lozim.',
    targetMarket: 'Germaniya, Polsha, Italiya',
    affectedProducts: ['Kalava ip', 'Trikotaj', 'Qora mayiz', 'Yong\'oq'],
    suggestedPrompt: 'Yevropa Ittifoqiga (Germaniya va Polsha) 100% paxta kalava ipi eksport qilishda GSP+ 0% boji, REX tizimi va kerakli laboratoriya sinovlari bo\'yicha to\'liq yo\'riqnoma ber.',
    timestamp: 'Bugun, 09:15'
  },
  {
    id: 'sig-3',
    title: 'Qizil Hudud Tahlili: Polimer Granulalar Importining Oshishi',
    category: 'import',
    priority: 'high',
    tag: 'Qizil Hudud & Mahalliylashtirish',
    badgeColor: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
    summary: 'Qadoqlash sanoati va issiqxona plyonkalari uchun import qilinayotgan LDPE/LLDPE polietilen xomashyosi hajmi $140M ga yetdi va import o\'sish sur\'ati +28% ni tashkil etmoqda.',
    impactAnalysis: 'Shurtan GKM va Ustyurt gaz-kimyo majmuasi ishlab chiqarish quvvatlarini kengaytirishi hisobiga ushbu import o\'rnini to\'liq mahalliy xomashyo bilan qoplash imkoni mavjud.',
    actionableStep: 'Mahalliy granulalardan 3 qatlamli plyonka va qadoqlash idishlari ishlab chiqarish bo\'yicha investitsiya loyihasini ko\'rib chiqing.',
    targetMarket: 'O\'zbekiston ichki bozori',
    affectedProducts: ['Polietilen granulalari', 'Gofrotara', 'Qadoqlash plyonkalari'],
    suggestedPrompt: 'Import qilinayotgan polimer granulalari o\'rniga Shurtan GKM xomashyosi asosida plyonka va qadoqlash ishlab chiqarish bo\'yicha ixcham biznes-reja va qoplanish muddatini hisoblab ber.',
    timestamp: 'Bugun, 10:00'
  },
  {
    id: 'sig-4',
    title: 'Markaziy Bank Valyuta Kurslari & Shartnomaviy Risklar',
    category: 'currency',
    priority: 'medium',
    tag: 'Valyuta Tebranishi',
    badgeColor: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    summary: 'AQSH dollari va Xitoy Yuani kurslarining so\'mga nisbatan barqarorligi fonida, Rossiya rubli tebranishlari eksportchilarga shartnomalarni ko\'p valyutali klausula (currency clause) bilan tuzish zarurligini ko\'rsatmoqda.',
    impactAnalysis: 'Eksport to\'lovlarini qabul qilishda valyuta kursining keskin o\'zgarishidan xedjlash yoki to\'lovlarni to\'g\'ridan-to\'g\'ri Markaziy Bank spot kursi bo\'yicha fiksatsiyalash tavsiya etiladi.',
    actionableStep: 'Tashqi savdo shartnomalarida hisob-kitob sanasidagi Markaziy Bank kursi bo\'yicha to\'lov bandini kiriting.',
    targetMarket: 'MDH va Xitoy',
    affectedProducts: ['Barcha eksport va import shartnomalari'],
    suggestedPrompt: 'Eksport-import shartnomalarida valyuta risklarini kamaytirish uchun qanday shartnoma bandlari (valyuta klausulasi va xedjlash) kiritilishi kerak?',
    timestamp: 'Bugun, 10:45'
  },
  {
    id: 'sig-5',
    title: 'O\'zbekiston-Qozog\'iston Chegarasi Logistika Postlari Holati',
    category: 'logistics',
    priority: 'medium',
    tag: 'Chegara & TIR Tranziti',
    badgeColor: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
    summary: '"Yallama" va "G\'ishtko\'prik" o\'tkazish punktlarida elektron navbat (E-navbat) tizimi joriy etilishi natijasida yuk avtotransportlarining o\'rtacha o\'tish vaqti 3.5 soatgacha qisqardi.',
    impactAnalysis: 'Meva-sabzavot mahsulotlari uchun "Yashil yo\'lak" (Green Corridor) orqali tezlashtirilgan navbatsiz o\'tish rejimi amal qilmoqda.',
    actionableStep: 'Haydovchilarga E-navbat platformasida oldindan ro\'yxatdan o\'tishni va fitosanitariya hujjatlarining QR-kodini tayyorlab qo\'yishni topshiring.',
    targetMarket: 'Qozog\'iston, Rossiya, Yevropa yo\'nalishlari',
    affectedProducts: ['Tez buziluvchi qishloq xo\'jaligi tovarlari'],
    suggestedPrompt: 'O\'zbekistondan Qozog\'iston orqali Rossiyaga yuk olib o\'tishda "Yashil yo\'lak" va E-navbat tizimidan qanday tez va muammosiz foydalanish mumkin?',
    timestamp: 'Bugun, 11:20'
  }
];
