import { TradeRoute } from '../types/trade';

export interface LogisticsCorridorSummary {
  id: string;
  name: string;
  badge: string;
  description: string;
  tradeSharePercent: number;
  avgTransitDays: string;
  mainType: 'Eksport & Import' | 'Asosan Eksport' | 'Asosan Import';
  color: string;
}

export const LOGISTICS_CORRIDORS: LogisticsCorridorSummary[] = [
  {
    id: 'middle-corridor',
    name: "Transkaspiy O'rta Koridor (TITR)",
    badge: 'GSP+ Yevropa Ittifoqi',
    description: "O'zbekiston — Kaspiy dengizi — Ozarbayjon (Alyat) — Gruziya (Poti/Batumi) — Qora dengiz / Turkiya — Yevropa Ittifoqi mamlakatlari.",
    tradeSharePercent: 24,
    avgTransitDays: '12 - 16 kun',
    mainType: 'Eksport & Import',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300'
  },
  {
    id: 'northern-corridor',
    name: 'Shimoliy Koridor (Qozogʻiston — Rossiya — Belarus)',
    badge: 'MDH & YEOII Bozorlari',
    description: "O'zbekiston — Qozog'iston (Beyneu/Chimkent) — Rossiya Federatsiyasi (Samara/Moskva/Sankt-Peterburg). Meva-sabzavot va sanoat buyumlari.",
    tradeSharePercent: 32,
    avgTransitDays: '4 - 7 kun',
    mainType: 'Eksport & Import',
    color: 'from-sky-500/20 to-blue-500/10 border-sky-500/40 text-sky-300'
  },
  {
    id: 'eastern-corridor',
    name: "Sharqiy Koridor (Xitoy — O'zbekiston)",
    badge: 'Yuqori Texnologiyalar & Xomashyo',
    description: "Xitoy (Lianyungang/Urumchi) — Qorg'os / Qashg'ar — Qirg'iziston — O'zbekiston (Andijon/Toshkent). Smartfonlar, chiplar va ehtiyot qismlar.",
    tradeSharePercent: 28,
    avgTransitDays: '8 - 14 kun',
    mainType: 'Asosan Import',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300'
  },
  {
    id: 'southern-corridor',
    name: "Janubiy & Eron Koridori (Bandar-Abbos & Karachi)",
    badge: 'Hind Okeani Portlariga Chiqish',
    description: "O'zbekiston — Turkmaniston (Saraxs) — Eron (Bandar-Abbos) hamda Trans-Afg'on yo'lagi orqali Pokiston (Karachi porti).",
    tradeSharePercent: 16,
    avgTransitDays: '5 - 9 kun',
    mainType: 'Eksport & Import',
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300'
  }
];

export const TRADE_ROUTES_DATA: TradeRoute[] = [
  {
    id: 'route-eu-frankfurt',
    name: 'Toshkent — Frankfurt (Yevropa Ittifoqi Hubi)',
    corridorName: "Transkaspiy O'rta Koridor (TITR)",
    type: 'both',
    originCity: 'Toshkent',
    originCountry: "O'zbekiston",
    originCoords: [48, 54], // percentage position on stylized SVG map
    destinationCity: 'Frankfurt / Myunxen',
    destinationCountry: 'Germaniya (EI)',
    destinationCoords: [18, 28],
    distanceKm: 5420,
    primaryTransportMode: 'Multimodal & Avto TIR',
    transitDaysRange: '12 - 16 kun',
    avgCostPerContainerUsd: 6200,
    transitCountries: ["Qozog'iston", 'Kaspiy dengizi', 'Ozarbayjon', 'Gruziya', 'Turkiya / Ruminiya', 'Germaniya'],
    borderCheckpoints: [
      { name: "Yallama / G'ishtko'prik (O'z-Qoz)", country: "O'zbekiston - Qozog'iston", type: 'Avtomobil', avgWaitHours: '4-8 soat' },
      { name: 'Kurik / Aktau dengiz porti', country: "Qozog'iston (Kaspiy)", type: 'Dengiz porti', avgWaitHours: '12-24 soat' },
      { name: 'Alyat xalqaro savdo porti (Boku)', country: 'Ozarbayjon', type: 'Dengiz porti', avgWaitHours: '8-14 soat' },
      { name: 'Sarpi / Batumi chegara punkti', country: 'Gruziya - Turkiya', type: 'Avtomobil', avgWaitHours: '6-12 soat' },
      { name: 'Kapitan Andreevo', country: 'Turkiya - Bolgariya (EI)', type: 'Avtomobil', avgWaitHours: '10-18 soat' }
    ],
    transportOptions: [
      {
        mode: 'Avto-Refrijerator',
        durationDays: '12 - 14 kun',
        costEstimateUsd: 6800,
        costFormatted: '$6,800 / TIR',
        capacity: '20-22 tonna (+2°C / -18°C)',
        reliability: 'Yuqori',
        recommendedFor: 'Shirin gilos, meva-sabzavot, farmatsevtika'
      },
      {
        mode: 'Multimodal (Kema + Poezd)',
        durationDays: '16 - 20 kun',
        costEstimateUsd: 5400,
        costFormatted: '$5,400 / 40ft HQ',
        capacity: '26-28 tonna',
        reliability: 'Juda Yuqori',
        recommendedFor: 'Mis quvurlari, paxta ipi, sanoat tovarlari'
      },
      {
        mode: 'Avia Kargo',
        durationDays: '1 - 2 kun (14 soat parvoz)',
        costEstimateUsd: 14500,
        costFormatted: '$2.80 / kg',
        capacity: '5-15 tonna',
        reliability: 'Juda Yuqori',
        recommendedFor: 'Ekspress farmatsevtika, nozik gilos partiyalari'
      }
    ],
    exportCargo: [
      "Gilos va barra o'rik (GSP+ 0% boj)",
      'Paxta kalava ipi va matolar',
      'Mis katodi va choksiz mis quvurlar',
      'Quritilgan mayiz va yong\'oqlar',
      'Polietilen va polipropilen'
    ],
    importCargo: [
      'Germaniya yuqori aniqlikdagi dastgohlari',
      'Siemens MRT va tibbiyot texnikalari',
      'Farmatsevtika va vaksinalar',
      'Avtomobil podshipniklari va elektrika',
      'Sanoat kimyoviy reagentlari'
    ],
    customsDocuments: [
      'EUR.1 / REX (GSP+ preferensial sertifikat)',
      'TIR Carnet (Xalqaro tranzit kitobchasi)',
      'CMR xalqaro tovar-transport yukxati',
      'Fitosanitariya xalqaro sertifikati',
      'T1 / T2 Yevropa tranzit deklaratsiyasi'
    ],
    status: 'Faol va tezkor',
    keyAdvantage: "GSP+ orqali 6,200 turdagi tovarlar Yevroittifoqqa 0% boj bilan kiradi. Transkaspiy portlarida raqamlashtirish hisobiga o'tish tezlashdi.",
    bottlenecks: "Kaspiy dengizida noqulay ob-havo paytida fider kemalari 1-2 kun kechikishi mumkin.",
    co2SavingsPercent: 32
  },
  {
    id: 'route-ru-moscow',
    name: 'Toshkent — Moskva / Sankt-Peterburg',
    corridorName: 'Shimoliy Koridor (Qozogʻiston — Rossiya)',
    type: 'both',
    originCity: 'Toshkent',
    originCountry: "O'zbekiston",
    originCoords: [48, 54],
    destinationCity: 'Moskva (Food City xabi)',
    destinationCountry: 'Rossiya',
    destinationCoords: [26, 20],
    distanceKm: 3360,
    primaryTransportMode: 'Avtotransport (TIR) & Temiryoʻl',
    transitDaysRange: '4 - 6 kun',
    avgCostPerContainerUsd: 3800,
    transitCountries: ["Qozog'iston", 'Rossiya'],
    borderCheckpoints: [
      { name: "Yallama / G'ishtko'prik", country: "O'zbekiston - Qozog'iston", type: 'Avtomobil', avgWaitHours: '3-6 soat' },
      { name: 'Mashtakovo / Sagarchin', country: "Qozog'iston - Rossiya", type: 'Avtomobil', avgWaitHours: '6-12 soat' },
      { name: 'Iletsk temiryo\'l punkti', country: "Qozog'iston - Rossiya", type: 'Temiryo\'l', avgWaitHours: '4-8 soat' }
    ],
    transportOptions: [
      {
        mode: 'Avto-Refrijerator',
        durationDays: '4 - 5 kun',
        costEstimateUsd: 4100,
        costFormatted: '$4,100 / TIR',
        capacity: '20-22 tonna',
        reliability: 'Juda Yuqori',
        recommendedFor: 'Issiqxona pomidorlari, shaftoli, qovun, uzum'
      },
      {
        mode: 'Temiryo\'l (Konteyner)',
        durationDays: '6 - 8 kun',
        costEstimateUsd: 3200,
        costFormatted: '$3,200 / 40ft',
        capacity: '28 tonna',
        reliability: 'Juda Yuqori',
        recommendedFor: 'Kabel, paxta ipi, metall buyumlar, quritilgan meva'
      }
    ],
    exportCargo: [
      'Gidroponika qizil va pushti pomidori',
      'Mavsumiy uzum, gilos va poliz ekinlari',
      'Trikotaj kiyim-kechak va tayyor tekstil',
      'Plastmassa buyumlari va qadoqlar',
      'Mis kabellari va elektrotexnika'
    ],
    importCargo: [
      "Qurilish yog'och taxtalari (Sibir qarag'ayi)",
      'Qora metall prokat va armatura',
      "Kungaboqar yog'i va bug'doy",
      'Kimyoviy xomashyo va polimer granulalari',
      'Konditer va sut xomashyolari'
    ],
    customsDocuments: [
      'ST-1 kelib chiqish sertifikati (0% bojxona boji)',
      'CMR tovar-transport yukxati',
      'Rosselxoznadzor karantin ruxsatnomasi',
      'E-Permit elektron ruxsatnomasi (O\'z-Qoz-RF)'
    ],
    status: 'Faol va tezkor',
    keyAdvantage: "Erkin savdo zonasida (MDH) 0% bojxona boji, eng qisqa quruqlik masofasi va 'Yashil yo'lak' agrologistika tizimi.",
    bottlenecks: 'Qish faslida qor bo\'ronlari va chegara navbatlarining cho\'zilishi.',
    co2SavingsPercent: 18
  },
  {
    id: 'route-cn-lianyungang',
    name: 'Lianyungang / Shanxay — Toshkent',
    corridorName: "Sharqiy Koridor (Xitoy — O'zbekiston)",
    type: 'both',
    originCity: 'Lianyungang porti / Urumchi',
    originCountry: 'Xitoy Xalq Respublikasi',
    originCoords: [82, 45],
    destinationCity: 'Toshkent / Andijon logistika markazi',
    destinationCountry: "O'zbekiston",
    destinationCoords: [48, 54],
    distanceKm: 4850,
    primaryTransportMode: 'Temiryoʻl blok-poyezd & Multimodal',
    transitDaysRange: '10 - 14 kun',
    avgCostPerContainerUsd: 4600,
    transitCountries: ['Xitoy', "Qozog'iston (Xorgos/Dostik)", "O'zbekiston"],
    borderCheckpoints: [
      { name: "Xorgos / Nur Joli (Quruqlik porti)", country: "Xitoy - Qozog'iston", type: 'Avtomobil va Temiryo\'l', avgWaitHours: '8-16 soat' },
      { name: 'Alashankou / Dostik', country: "Xitoy - Qozog'iston", type: 'Temiryo\'l', avgWaitHours: '12-20 soat' },
      { name: "Irkeshtam / Do'stlik (Qashg'ar - O'sh)", country: "Xitoy - Qirg'iziston", type: 'Avtomobil', avgWaitHours: '6-10 soat' }
    ],
    transportOptions: [
      {
        mode: 'Temiryo\'l (Konteyner)',
        durationDays: '10 - 12 kun (Blok-poyezd)',
        costEstimateUsd: 4400,
        costFormatted: '$4,400 / 40ft HQ',
        capacity: '26 tonna',
        reliability: 'Juda Yuqori',
        recommendedFor: 'Elektronika, quyosh panellari, avto ehtiyot qismlar'
      },
      {
        mode: 'Avtotransport (TIR)',
        durationDays: '7 - 9 kun (Qashg\'ar orqali tezkor)',
        costEstimateUsd: 5900,
        costFormatted: '$5,900 / TIR',
        capacity: '22 tonna',
        reliability: 'Yuqori',
        recommendedFor: 'Shoshilinch mikrosxemalar, smartfonlar'
      }
    ],
    exportCargo: [
      'Katod misi va mis simlar (99.99%)',
      'Paxta kalava ipi (Ne 30/1, 20/1)',
      'Mineral o\'g\'itlar va kimyo xomashyosi',
      'Charm xomashyosi va yarim tayyor mahsulotlar',
      'Mosh, loviya va qizilmiyador ildizi'
    ],
    importCargo: [
      'Smartfonlar va aloqa texnikasi ($1.15 Mldr)',
      'Quyosh fotoelektr panellari va invertorlar',
      'Mikrosxemalar, chiplar va server plata',
      'BYD va elektromobillar uchun akkumulyatorlar',
      'Sanoat robotlari va lazer dastgohlari'
    ],
    customsDocuments: [
      'SMGS temiryo\'l yukxati',
      'Bojxona tranzit deklaratsiyasi',
      'TIF TN muvofiqlik sertifikati',
      'UZIMEI va telekom sertifikatlari (elektronika uchun)'
    ],
    status: 'Faol va tezkor',
    keyAdvantage: "O'zbekiston-Xitoy to'g'ridan-to'g'ri blok-poyezdlari muntazam yo'lga qo'yilgan. Xitoy-Qirg'iziston-O'zbekiston temiryo'li masofani 900 km qisqartirmoqda.",
    bottlenecks: "Xitoy chegarasida rels kengligi o'zgarishi (1435 mm dan 1520 mm ga) vagon g'ildiraklarini almashtirishni talab qiladi.",
    co2SavingsPercent: 44
  },
  {
    id: 'route-tr-istanbul',
    name: 'Toshkent — Istanbul / Mersin porti',
    corridorName: "Turkiya & O'rta Yer Dengizi Yo'lagi",
    type: 'both',
    originCity: 'Toshkent',
    originCountry: "O'zbekiston",
    originCoords: [48, 54],
    destinationCity: 'Istanbul / Mersin xalqaro porti',
    destinationCountry: 'Turkiya',
    destinationCoords: [22, 44],
    distanceKm: 4150,
    primaryTransportMode: 'Avtotransport (TIR) & Ro-Ro',
    transitDaysRange: '6 - 9 kun',
    avgCostPerContainerUsd: 4900,
    transitCountries: ['Turkmaniston', 'Eron', 'Turkiya'],
    borderCheckpoints: [
      { name: 'Olot / Farap', country: "O'zbekiston - Turkmaniston", type: 'Avtomobil', avgWaitHours: '4-8 soat' },
      { name: 'Saraxs / Gaudan', country: 'Turkmaniston - Eron', type: 'Avtomobil', avgWaitHours: '6-10 soat' },
      { name: 'Bazorgan / Gurbuloq', country: 'Eron - Turkiya', type: 'Avtomobil', avgWaitHours: '8-14 soat' }
    ],
    transportOptions: [
      {
        mode: 'Avtotransport (TIR)',
        durationDays: '7 - 8 kun',
        costEstimateUsd: 4900,
        costFormatted: '$4,900 / TIR',
        capacity: '22 tonna',
        reliability: 'Yuqori',
        recommendedFor: 'To\'qimachilik, mis buyumlar, meva, qurilish materiallari'
      },
      {
        mode: 'Temiryo\'l (Konteyner)',
        durationDays: '10 - 12 kun',
        costEstimateUsd: 4100,
        costFormatted: '$4,100 / 40ft',
        capacity: '26 tonna',
        reliability: 'Yuqori',
        recommendedFor: 'Sanoat xomashyosi, o\'g\'itlar, metall buyumlar'
      }
    ],
    exportCargo: [
      'Katod misi va mis simlari',
      'To\'qimachilik kalava ipi va gazlamalar',
      'Sink va rangli metallar',
      'Quritilgan mevalar va qandolatchilik yong\'og\'i',
      'Ipak va pilla xomashyosi'
    ],
    importCargo: [
      'To\'qimachilik dastgohlari va tikuv mashinalari',
      'Qurilish kimyosi va armaturalari',
      'Santexnika va mebel furnituralari',
      'Oziq-ovqat va qandolatchilik xomashyosi',
      'Sanoat bo\'yoqlari va polimer plyonkalar'
    ],
    customsDocuments: [
      'Preferensial savdo bitimi sertifikati (O\'z-Turkiya)',
      'TIR Carnet',
      'CMR xalqaro yukxati',
      'Fitosanitariya va karantin hujjatlari'
    ],
    status: 'Faol va tezkor',
    keyAdvantage: "Turkiya bilan preferensial savdo bitimi va Mersin dengiz porti orqali Afrika hamda Yaqin Sharq bozorlariga chiqish imkoniyati.",
    bottlenecks: 'Turkmaniston orqali tranzit vizalari va chegara yig\'imlari.',
    co2SavingsPercent: 22
  },
  {
    id: 'route-ir-bandarabbas',
    name: 'Toshkent — Bandar-Abbos (Hind Okeani)',
    corridorName: 'Janubiy Eron Koridori (Dengiz yoʻli)',
    type: 'both',
    originCity: 'Toshkent / Samarqand',
    originCountry: "O'zbekiston",
    originCoords: [48, 54],
    destinationCity: 'Bandar-Abbos porti (Xormuz)',
    destinationCountry: 'Eron (Hindiston va Janubi-Sharqiy Osiyoga tranzit)',
    destinationCoords: [38, 62],
    distanceKm: 2650,
    primaryTransportMode: 'Avtotransport (TIR) & Temiryoʻl',
    transitDaysRange: '5 - 7 kun',
    avgCostPerContainerUsd: 3400,
    transitCountries: ['Turkmaniston', 'Eron'],
    borderCheckpoints: [
      { name: 'Olot / Farap', country: "O'zbekiston - Turkmaniston", type: 'Avtomobil', avgWaitHours: '4-7 soat' },
      { name: 'Saraxs temiryo\'l va avto', country: 'Turkmaniston - Eron', type: 'Avtomobil va Temiryo\'l', avgWaitHours: '6-10 soat' },
      { name: 'Bandar-Abbos dengiz terminali', country: 'Eron porti', type: 'Dengiz porti', avgWaitHours: '12-24 soat' }
    ],
    transportOptions: [
      {
        mode: 'Temiryo\'l (Konteyner)',
        durationDays: '7 - 9 kun',
        costEstimateUsd: 3200,
        costFormatted: '$3,200 / 40ft',
        capacity: '28 tonna',
        reliability: 'Juda Yuqori',
        recommendedFor: 'Mineral o\'g\'itlar, klinker, paxta tolasi, don'
      },
      {
        mode: 'Avtotransport (TIR)',
        durationDays: '5 - 6 kun',
        costEstimateUsd: 3600,
        costFormatted: '$3,600 / TIR',
        capacity: '22 tonna',
        reliability: 'Yuqori',
        recommendedFor: 'Qayta ishlangan mevalar, loviya, tekstil'
      }
    ],
    exportCargo: [
      'Kaliy xlorid va azotli mineral o\'g\'itlar',
      'Paxta tolasi va paxta moyi',
      'Bug\'doy va un mahsulotlari (tranzit)',
      'Sement va klinker xomashyosi',
      'Rangli metall konsentratlari'
    ],
    importCargo: [
      'Tropik mevalar (Banan, mango, ananas)',
      'Hindiston qora choyi va ziravorlari',
      'Muzlatilgan dengiz mahsulotlari va baliq',
      'Polimer va plastmassa stabilizatorlari',
      'Sun\'iy tolalar va buyoq moddalar'
    ],
    customsDocuments: [
      'TIR Carnet & CMR',
      'Ashxobod kelishuvi tranzit ruxsatnomasi',
      'Fitosanitariya va radiologik xulosa',
      'Dengiz konosamenti (Bill of Lading - Hindistonga)'
    ],
    status: 'Faol va tezkor',
    keyAdvantage: "O'zbekiston uchun dunyo okeaniga eng qisqa va arzon quruqlik yo'li (2,650 km). Hindistonning Mumbay portiga Bandar-Abbosdan dengiz orqali 3-4 kunda yetib boradi.",
    bottlenecks: "Bank to'lovlari va xalqaro sanksiyalar tufayli to'lov mexanizmlarida ehtiyotkorlik talab etiladi.",
    co2SavingsPercent: 38
  },
  {
    id: 'route-pk-karachi',
    name: 'Toshkent — Termiz — Karachi porti',
    corridorName: "Trans-Afg'on & Janubiy Osiyo Koridori",
    type: 'both',
    originCity: 'Toshkent / Termiz Kargo Markazi',
    originCountry: "O'zbekiston",
    originCoords: [48, 54],
    destinationCity: 'Karachi & Gvadar dengiz portlari',
    destinationCountry: 'Pokiston',
    destinationCoords: [49, 74],
    distanceKm: 2380,
    primaryTransportMode: 'Avtotransport (TIR)',
    transitDaysRange: '5 - 8 kun',
    avgCostPerContainerUsd: 3100,
    transitCountries: ["Afg'oniston", 'Pokiston'],
    borderCheckpoints: [
      { name: "Ayritom / Hayraton (Termiz)", country: "O'zbekiston - Afg'oniston", type: 'Avtomobil va Temiryo\'l', avgWaitHours: '3-5 soat' },
      { name: 'Torkxam (Torxam pass)', country: "Afg'oniston - Pokiston", type: 'Avtomobil', avgWaitHours: '8-14 soat' },
      { name: 'Karachi port bojxonasi', country: 'Pokiston dengiz xabi', type: 'Dengiz porti', avgWaitHours: '10-18 soat' }
    ],
    transportOptions: [
      {
        mode: 'Avtotransport (TIR)',
        durationDays: '5 - 7 kun',
        costEstimateUsd: 3100,
        costFormatted: '$3,100 / TIR',
        capacity: '22 tonna',
        reliability: 'O\'rtacha',
        recommendedFor: 'Tekstil, meva, elektrotexnika, Pokiston guruchi'
      }
    ],
    exportCargo: [
      'Elektrotexnika va Artel maishiy texnikalari',
      'Ipak va paxta kalava iplari',
      'Ko\'n-charm poyabzallar va aksessuarlar',
      'Qishloq xo\'jaligi uskunalari va kultivatorlar',
      'Shisha idishlar va chinni buyumlar'
    ],
    importCargo: [
      'Pokiston basmati sara guruchi',
      'Sitrus mevalari (Kinnow mandarini, apelsin)',
      'Jarrohlik asboblari va farmatsevtika',
      'Charm xomashyosi va terilar',
      'Dengiz tuzi va tabiiy minerallar'
    ],
    customsDocuments: [
      'TIR Carnet (Trans-Afg\'on yo\'nalishi akkreditatsiyasi)',
      'O\'zbekiston-Pokiston preferensial savdo bitimi sertifikati',
      'Xalqaro CMR va sug\'urta polisi',
      'Karantin va fitosanitariya ruxsatnomasi'
    ],
    status: 'Strategik rivojlanayotgan',
    keyAdvantage: "Trans-Afg'on yo'lagi O'zbekistonni Pokistonning 240 millionlik ulkan bozoriga va Hind okeani dengiz portlariga eng yaqin masofada bog'laydi.",
    bottlenecks: "Salang dovoni va tog'li yo'llarda qish oylaridagi murakkab iqlim sharoiti.",
    co2SavingsPercent: 40
  },
  {
    id: 'route-ae-dubai',
    name: 'Toshkent — Dubay / Jebel Ali porti',
    corridorName: 'Fors Koʻrfazi & Yaqin Sharq Yoʻlagi',
    type: 'both',
    originCity: 'Toshkent (Navoiy Hub)',
    originCountry: "O'zbekiston",
    originCoords: [48, 54],
    destinationCity: 'Dubay (Jebel Ali Free Zone)',
    destinationCountry: 'BAA (Birlashgan Arab Amirliklari)',
    destinationCoords: [34, 66],
    distanceKm: 2950,
    primaryTransportMode: 'Avia Kargo & Multimodal',
    transitDaysRange: '1 - 7 kun',
    avgCostPerContainerUsd: 4200,
    transitCountries: ['Turkmaniston / Eron', 'Fors ko\'rfazi fider kemasi'],
    borderCheckpoints: [
      { name: 'Toshkent Xalqaro Aeroporti Kargo', country: "O'zbekiston", type: 'Avia', avgWaitHours: '2-4 soat' },
      { name: 'Navoiy Kargo Hubi', country: "O'zbekiston", type: 'Avia', avgWaitHours: '2-3 soat' },
      { name: 'Jebel Ali dengiz porti', country: 'BAA', type: 'Dengiz porti', avgWaitHours: '6-10 soat' }
    ],
    transportOptions: [
      {
        mode: 'Avia Kargo',
        durationDays: '3.5 soat (To\'g\'ridan-to\'g\'ri reys)',
        costEstimateUsd: 11000,
        costFormatted: '$1.85 / kg',
        capacity: '10-30 tonna',
        reliability: 'Juda Yuqori',
        recommendedFor: 'Premium gilos, shaftoli, go\'sht, qandolatchilik'
      },
      {
        mode: 'Multimodal (Kema + Poezd)',
        durationDays: '7 - 9 kun (Bandar-Abbos orqali fider)',
        costEstimateUsd: 3900,
        costFormatted: '$3,900 / 40ft',
        capacity: '24 tonna',
        reliability: 'Yuqori',
        recommendedFor: 'Quritilgan mevalar, o\'g\'itlar, qurilish buyumlari'
      }
    ],
    exportCargo: [
      'Ekstra kalibrli sara shirin gilos ($3,800/t)',
      'Samarqand va Namangan asal va yong\'oqlari',
      'Halol qo\'zichoq go\'shti va sarxil mevalar',
      'Qora mayiz va quritilgan meva asortilari',
      'Hunarmandchilik ipak matolari va zardo\'zlik'
    ],
    importCargo: [
      'Zamonaviy kompyuter va noutbuklar',
      'Yuqori sifatli parfyumeriya va kosmetika',
      'Avto ehtiyot qismlari va moylash materiallari',
      'Polimer granulalari va texnologik xomashyo',
      'Qayta ishlangan oziq-ovqat mahsulotlari'
    ],
    customsDocuments: [
      'Air Waybill (AWB) avia yukxati',
      'Halal xalqaro sertifikati',
      'ST-1 yoki Kelib chiqish sertifikati',
      'Birlashgan Arab Amirliklari ESMA sertifikati'
    ],
    status: 'Faol va tezkor',
    keyAdvantage: "Navoiy va Toshkent aeroportlaridan Dubayga har kuni to'g'ridan-to'g'ri reyslar. Mahsulot daladan Dubay supermarket peshtaxtasiga 24 soatda yetib boradi.",
    bottlenecks: 'Yozgi jaziramada kargo terminallarida doimiy sovuq zanjirni (+2°C) saqlash talabi.',
    co2SavingsPercent: 15
  },
  {
    id: 'route-baltic-riga',
    name: 'Toshkent — Riga / Klaypeda (Boltiqboʻyi portlari)',
    corridorName: 'Boltiq Dengizi & Shimoliy Yevropa Koridori',
    type: 'both',
    originCity: 'Toshkent',
    originCountry: "O'zbekiston",
    originCoords: [48, 54],
    destinationCity: 'Riga / Klaypeda portlari',
    destinationCountry: 'Latviya / Litva (EI)',
    destinationCoords: [19, 18],
    distanceKm: 4120,
    primaryTransportMode: 'Temiryoʻl & Avtotransport TIR',
    transitDaysRange: '8 - 12 kun',
    avgCostPerContainerUsd: 4800,
    transitCountries: ["Qozog'iston", 'Rossiya', 'Latviya / Litva'],
    borderCheckpoints: [
      { name: "G'ishtko'prik / Yallama", country: "O'zbekiston - Qozog'iston", type: 'Avtomobil', avgWaitHours: '4-8 soat' },
      { name: 'Terexovo / Burachki', country: 'Rossiya - Latviya (EI)', type: 'Avtomobil', avgWaitHours: '16-36 soat' },
      { name: 'Riga dengiz porti terminali', country: 'Latviya porti', type: 'Dengiz porti', avgWaitHours: '8-14 soat' }
    ],
    transportOptions: [
      {
        mode: 'Temiryo\'l (Konteyner)',
        durationDays: '10 - 12 kun',
        costEstimateUsd: 4600,
        costFormatted: '$4,600 / 40ft',
        capacity: '28 tonna',
        reliability: 'Yuqori',
        recommendedFor: 'O\'g\'itlar, metallar, paxta ipi, yog\'och buyumlari'
      },
      {
        mode: 'Avtotransport (TIR)',
        durationDays: '7 - 9 kun',
        costEstimateUsd: 5200,
        costFormatted: '$5,200 / TIR',
        capacity: '22 tonna',
        reliability: 'O\'rtacha',
        recommendedFor: 'GSP+ quritilgan mevalar, qandolatchilik, to\'qimachilik'
      }
    ],
    exportCargo: [
      'GSP+ orqali quritilgan mevalar (mayiz, o\'rik)',
      'Mis katodi va rux konsentrati',
      'Mineral o\'g\'itlar (Karbid, Ammiakli selitra)',
      'To\'qimachilik paxta matolari va ip',
      'Yong\'oq va quritilgan dukkakli ekinlar'
    ],
    importCargo: [
      'Qog\'oz va karton sanoat mahsulotlari',
      'Boltiq konservalangan baliqlari va xomashyosi',
      'Dori vositalari (Grindeks, Olainfarm)',
      'Qishloq xo\'jaligi uskunalari va traktor qismlari',
      'Kimyo laboratoriya reaktivlari'
    ],
    customsDocuments: [
      'EUR.1 / REX sertifikati (EI 0% preferensiyasi)',
      'TIR Carnet & CMR',
      'SMGS temiryo\'l hujjati',
      'Yevropa Ittifoqi veterinariya va fitosanitariya hujjati'
    ],
    status: 'O\'rtacha yuklangan',
    keyAdvantage: "Boltiqbo'yi portlarida O'zbekistonning konsignatsiya omborlari mavjud bo'lib, Skandinaviya bozorlariga to'g'ridan-to'g'ri chiqish yo'lagidir.",
    bottlenecks: 'EI tashqi chegaralarida bojxona ko\'rigi va sanksiya tekshiruvlari sababli kutish vaqti ortishi.',
    co2SavingsPercent: 28
  },
  {
    id: 'route-kz-almaty',
    name: 'Toshkent — Olmaota / Chimkent',
    corridorName: 'Mintaqaviy Markaziy Osiyo Koridori',
    type: 'both',
    originCity: 'Toshkent',
    originCountry: "O'zbekiston",
    originCoords: [48, 54],
    destinationCity: 'Olmaota',
    destinationCountry: "Qozog'iston",
    destinationCoords: [55, 48],
    distanceKm: 810,
    primaryTransportMode: 'Avtotransport (TIR)',
    transitDaysRange: '1 - 2 kun',
    avgCostPerContainerUsd: 1100,
    transitCountries: ["Qozog'iston"],
    borderCheckpoints: [
      { name: "G'ishtko'prik / Jibek Joli", country: "O'zbekiston - Qozog'iston", type: 'Avtomobil', avgWaitHours: '2-4 soat' },
      { name: 'Sariagash temiryo\'l punkti', country: "O'zbekiston - Qozog'iston", type: 'Temiryo\'l', avgWaitHours: '3-6 soat' }
    ],
    transportOptions: [
      {
        mode: 'Avtotransport (TIR)',
        durationDays: '1 kun (18-24 soat)',
        costEstimateUsd: 1100,
        costFormatted: '$1,100 / TIR',
        capacity: '22 tonna',
        reliability: 'Juda Yuqori',
        recommendedFor: 'Tez buziluvchi meva, sabzavot, maishiy texnika'
      },
      {
        mode: 'Temiryo\'l (Konteyner)',
        durationDays: '2 kun',
        costEstimateUsd: 950,
        costFormatted: '$950 / vagon',
        capacity: '60 tonna',
        reliability: 'Juda Yuqori',
        recommendedFor: 'Sement, gips, o\'g\'itlar, quyma yuklar'
      }
    ],
    exportCargo: [
      'Erta bahorgi barra qulupnay, pomidor va bodring',
      'Artel maishiy texnikalari (muzlatgich, televizor)',
      'Qurilish gipsi, sement va keramika koshinlari',
      'Qandolatchilik shirinliklari va alkogolsiz ichimliklar',
      'Plastmassa va quvur buyumlari'
    ],
    importCargo: [
      'Sara bug\'doy va bug\'doy uni (3-sinf yuqori nav)',
      'Qora metall, relslar va po\'lat prokat',
      'Energetik ko\'mir va tabiiy minerallar',
      'Sut kukuni va sariyog\' xomashyolari',
      'Asfalьt va bitum mahsulotlari'
    ],
    customsDocuments: [
      'ST-1 erkin savdo sertifikati (0% bojxona boji)',
      'CMR avtomobil yukxati',
      'Fitosanitariya va karantin xulosasi'
    ],
    status: 'Faol va tezkor',
    keyAdvantage: "Eng yaqin qardosh bozor, sutkalik logistika tezligi, to'liq erkin savdo tartibi (bojxona bojlari 0%).",
    bottlenecks: "Mavsum cho'qqisida chegaradagi transport oqimining ko'payishi.",
    co2SavingsPercent: 12
  }
];

export interface CityHubOption {
  city: string;
  country: string;
  isUzbekistan: boolean;
  type: 'export' | 'import' | 'both';
  coords: [number, number];
}

export const UZBEKISTAN_HUBS: CityHubOption[] = [
  { city: 'Toshkent', country: "O'zbekiston", isUzbekistan: true, type: 'both', coords: [48, 54] },
  { city: 'Samarqand', country: "O'zbekiston", isUzbekistan: true, type: 'both', coords: [46, 56] },
  { city: 'Andijon / Farg\'ona', country: "O'zbekiston", isUzbekistan: true, type: 'both', coords: [52, 54] },
  { city: 'Navoiy (Xalqaro kargo xabi)', country: "O'zbekiston", isUzbekistan: true, type: 'both', coords: [43, 53] },
  { city: 'Termiz (Xalqaro savdo markazi)', country: "O'zbekiston", isUzbekistan: true, type: 'both', coords: [47, 62] },
  { city: 'Buxoro', country: "O'zbekiston", isUzbekistan: true, type: 'both', coords: [42, 55] },
  { city: 'Nukus', country: "O'zbekiston", isUzbekistan: true, type: 'both', coords: [36, 49] },
];

export const INTERNATIONAL_HUBS: CityHubOption[] = [
  { city: 'Frankfurt (Germaniya / EI)', country: 'Germaniya', isUzbekistan: false, type: 'both', coords: [18, 28] },
  { city: 'Moskva (Rossiya / MDH)', country: 'Rossiya', isUzbekistan: false, type: 'both', coords: [26, 20] },
  { city: 'Lianyungang porti (Xitoy)', country: 'Xitoy', isUzbekistan: false, type: 'both', coords: [82, 45] },
  { city: 'Urumchi (Xitoy / Shinjon)', country: 'Xitoy', isUzbekistan: false, type: 'both', coords: [68, 42] },
  { city: 'Istanbul / Mersin (Turkiya)', country: 'Turkiya', isUzbekistan: false, type: 'both', coords: [22, 44] },
  { city: 'Bandar-Abbos porti (Eron / Hind okeani)', country: 'Eron', isUzbekistan: false, type: 'both', coords: [38, 62] },
  { city: 'Karachi porti (Pokiston)', country: 'Pokiston', isUzbekistan: false, type: 'both', coords: [49, 74] },
  { city: 'Dubay / Jebel Ali (BAA)', country: 'BAA', isUzbekistan: false, type: 'both', coords: [34, 66] },
  { city: 'Riga (Latviya / Boltiq porti)', country: 'Latviya', isUzbekistan: false, type: 'both', coords: [19, 18] },
  { city: 'Olmaota (Qozog\'iston)', country: 'Qozog\'iston', isUzbekistan: false, type: 'both', coords: [55, 48] },
  { city: 'Boku / Alyat porti (Ozarbayjon)', country: 'Ozarbayjon', isUzbekistan: false, type: 'both', coords: [32, 48] },
  { city: 'Rotterdam dengiz porti (Niderlandiya)', country: 'Niderlandiya', isUzbekistan: false, type: 'both', coords: [16, 26] },
  { city: 'Mumbay (Hindiston dengiz xabi)', country: 'Hindiston', isUzbekistan: false, type: 'both', coords: [54, 82] }
];

export const DISTANCE_MATRIX: Record<string, Record<string, { distanceKm: number; transitDays: string; costTirUsd: number; costTrainUsd: number; recommendedMode: string }>> = {
  'Toshkent': {
    'Frankfurt (Germaniya / EI)': { distanceKm: 5420, transitDays: '12-16 kun', costTirUsd: 6800, costTrainUsd: 5400, recommendedMode: 'Avto-Refrijerator / Multimodal' },
    'Moskva (Rossiya / MDH)': { distanceKm: 3360, transitDays: '4-6 kun', costTirUsd: 4100, costTrainUsd: 3200, recommendedMode: 'Avtotransport (TIR)' },
    'Lianyungang porti (Xitoy)': { distanceKm: 4850, transitDays: '10-14 kun', costTirUsd: 5900, costTrainUsd: 4400, recommendedMode: 'Temiryo\'l blok-poyezd' },
    'Urumchi (Xitoy / Shinjon)': { distanceKm: 1180, transitDays: '3-4 kun', costTirUsd: 2800, costTrainUsd: 2100, recommendedMode: 'Avtotransport (TIR)' },
    'Istanbul / Mersin (Turkiya)': { distanceKm: 4150, transitDays: '6-8 kun', costTirUsd: 4900, costTrainUsd: 4100, recommendedMode: 'Avtotransport (TIR)' },
    'Bandar-Abbos porti (Eron / Hind okeani)': { distanceKm: 2650, transitDays: '5-7 kun', costTirUsd: 3600, costTrainUsd: 3200, recommendedMode: 'Temiryo\'l konteyner' },
    'Karachi porti (Pokiston)': { distanceKm: 2380, transitDays: '5-8 kun', costTirUsd: 3100, costTrainUsd: 2900, recommendedMode: 'Avtotransport (TIR)' },
    'Dubay / Jebel Ali (BAA)': { distanceKm: 2950, transitDays: '1-8 kun', costTirUsd: 3900, costTrainUsd: 3400, recommendedMode: 'Avia Kargo / Multimodal' },
    'Riga (Latviya / Boltiq porti)': { distanceKm: 4120, transitDays: '8-12 kun', costTirUsd: 5200, costTrainUsd: 4600, recommendedMode: 'Temiryo\'l konteyner' },
    'Olmaota (Qozog\'iston)': { distanceKm: 810, transitDays: '1-2 kun', costTirUsd: 1100, costTrainUsd: 950, recommendedMode: 'Avtotransport (TIR)' },
    'Boku / Alyat porti (Ozarbayjon)': { distanceKm: 1820, transitDays: '4-5 kun', costTirUsd: 2900, costTrainUsd: 2400, recommendedMode: 'Multimodal (Ferry)' },
    'Rotterdam dengiz porti (Niderlandiya)': { distanceKm: 5650, transitDays: '14-18 kun', costTirUsd: 7200, costTrainUsd: 5800, recommendedMode: 'Multimodal (TITR)' },
    'Mumbay (Hindiston dengiz xabi)': { distanceKm: 4200, transitDays: '9-12 kun', costTirUsd: 4800, costTrainUsd: 4200, recommendedMode: 'Multimodal (Eron orqali kema)' }
  }
};
