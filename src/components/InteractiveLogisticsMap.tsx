import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Navigation,
  Globe2,
  Maximize2,
  Layers,
  ShieldCheck,
  Building2,
  Truck,
  Ship,
  Train,
  Info
} from 'lucide-react';
import { soundEffects } from '../utils/audioEffects';

interface StageData {
  id: string;
  name: string;
  role: string;
  time: string;
  icon: string;
  color: string;
  coords: [number, number]; // [x, y] in 920x540 SVG coordinate system
  desc: string;
  tags: string[];
  documents?: string[];
}

interface DestinationRoute {
  id: string;
  name: string;
  flag: string;
  transportMode: string;
  vehicleIcon: string;
  totalDistance: string;
  totalTime: string;
  corridorName: string;
  routeCountryIds: string[]; // Countries designated along this route (will get RED outline)
  stages: StageData[];
}

interface CountryInfo {
  id: string;
  name: string;
  flag: string;
  labelCoords: [number, number];
  path: string;
  info: string;
}

interface InteractiveLogisticsMapProps {
  onSendToChat?: (prompt: string) => void;
}

export const InteractiveLogisticsMap: React.FC<InteractiveLogisticsMapProps> = ({
  onSendToChat,
}) => {
  // Realistic Geopolitical Eurasian Countries Boundaries
  const countries: CountryInfo[] = [
    {
      id: 'uzb',
      name: 'O\'zbekiston',
      flag: '🇺🇿',
      labelCoords: [435, 345],
      path: 'M 320 310 L 350 295 L 390 310 L 440 300 L 470 315 L 500 350 L 515 375 L 485 390 L 450 370 L 420 380 L 390 395 L 360 365 L 325 340 Z',
      info: 'Markaziy Osiyo savdo xabi: Namangan, Toshkent, Samarqand'
    },
    {
      id: 'kaz',
      name: 'Qozog\'iston',
      flag: '🇰🇿',
      labelCoords: [460, 235],
      path: 'M 240 260 L 290 220 L 340 180 L 420 170 L 520 180 L 620 220 L 660 270 L 630 300 L 580 320 L 500 310 L 440 300 L 390 310 L 350 295 L 320 310 L 260 290 Z',
      info: 'Asosiy quruqlik tranziti: Xorgos, Almati, Oqtov porti'
    },
    {
      id: 'chn',
      name: 'Xitoy',
      flag: '🇨🇳',
      labelCoords: [740, 320],
      path: 'M 620 220 L 720 190 L 820 190 L 900 240 L 910 370 L 850 440 L 760 430 L 680 390 L 640 340 L 630 300 L 660 270 Z',
      info: 'Yirik eksport-import bozori: Urumchi, Shanxay, Lianyungang'
    },
    {
      id: 'rus',
      name: 'Rossiya',
      flag: '🇷🇺',
      labelCoords: [320, 130],
      path: 'M 140 160 L 170 110 L 260 90 L 400 90 L 540 100 L 660 140 L 620 220 L 520 180 L 420 170 L 340 180 L 290 220 L 210 200 Z',
      info: 'MDH shimoliy yo\'lagi: Moskva, Sankt-Peterburg, Fudsiti'
    },
    {
      id: 'tur',
      name: 'Turkiya',
      flag: '🇹🇷',
      labelCoords: [160, 360],
      path: 'M 110 340 L 170 330 L 210 340 L 215 375 L 180 390 L 130 380 L 110 355 Z',
      info: 'O\'rta Koridor: Istanbul, Mersin porti, Bosfor bo\'g\'ozi'
    },
    {
      id: 'eu',
      name: 'Yevropa Ittifoqi',
      flag: '🇪🇺',
      labelCoords: [90, 190],
      path: 'M 40 160 L 80 140 L 140 150 L 150 210 L 130 250 L 70 260 L 45 220 Z',
      info: 'GSP+ 0% bojsiz bozor: Frankfurt, Duisburg, Gamburg'
    },
    {
      id: 'irn',
      name: 'Eron',
      flag: '🇮🇷',
      labelCoords: [290, 440],
      path: 'M 240 380 L 300 375 L 360 395 L 370 450 L 320 485 L 260 460 L 235 410 Z',
      info: 'Janubiy dengiz yo\'lagi: Tehron, Bandar-Abbos (Fors ko\'rfazi)'
    },
    {
      id: 'aze',
      name: 'Ozarbayjon',
      flag: '🇦🇿',
      labelCoords: [235, 335],
      path: 'M 220 325 L 250 320 L 255 345 L 230 350 Z',
      info: 'Kavkaz transport darvozasi: Boku, Alat porti (BTQ temiryo\'li)'
    },
    {
      id: 'kgz',
      name: 'Qirg\'iziston',
      flag: '🇰🇬',
      labelCoords: [545, 345],
      path: 'M 500 335 L 575 330 L 600 355 L 530 365 Z',
      info: 'Xitoy-Qirg\'iziston-O\'zbekiston temiryo\'li'
    },
    {
      id: 'tjk',
      name: 'Tojikiston',
      flag: '🇹🇯',
      labelCoords: [495, 395],
      path: 'M 485 375 L 525 375 L 535 410 L 480 405 Z',
      info: 'Qo\'shni transport va energetika xabi: Dushanbe, Sug\'d'
    },
    {
      id: 'tkm',
      name: 'Turkmaniston',
      flag: '🇹🇲',
      labelCoords: [335, 375],
      path: 'M 290 350 L 360 340 L 390 375 L 360 410 L 305 400 Z',
      info: 'Kaspiy porti: Turkmanboshi, Eron va Fors ko\'rfazi yo\'li'
    }
  ];

  // Water Bodies (Seas, Oceans & Gulfs) with realistic deep-blue bathymetry
  const waterBodies = [
    {
      id: 'caspian',
      name: 'Kaspiy Dengizi',
      labelCoords: [265, 335] as [number, number],
      path: 'M 255 280 Q 280 300 270 345 Q 260 380 280 395 L 290 395 Q 295 350 280 300 L 260 275 Z'
    },
    {
      id: 'blacksea',
      name: 'Qora Dengiz',
      labelCoords: [180, 310] as [number, number],
      path: 'M 140 290 Q 180 280 215 305 Q 210 325 180 330 Q 150 320 140 290 Z'
    },
    {
      id: 'persian',
      name: 'Fors Ko\'rfazi',
      labelCoords: [305, 505] as [number, number],
      path: 'M 270 480 Q 320 495 350 515 L 340 525 Q 300 510 260 490 Z'
    },
    {
      id: 'mediterranean',
      name: 'O\'rta Yer Dengizi',
      labelCoords: [95, 385] as [number, number],
      path: 'M 40 365 Q 90 350 140 370 Q 110 405 50 395 Z'
    },
    {
      id: 'balkhash',
      name: 'Balxash Ko\'li',
      labelCoords: [540, 260] as [number, number],
      path: 'M 525 255 Q 550 252 560 265 Q 545 270 525 262 Z'
    }
  ];

  // Mountain Topography Relief Curves (Tian Shan, Pamir, Caucasus, Ural)
  const mountainRanges = [
    { name: 'Tyanshan & Pomir', path: 'M 490 355 Q 520 340 570 345 Q 600 360 620 340', label: [550, 338] as [number, number] },
    { name: 'Kavkaz Tizmasi', path: 'M 210 320 Q 240 310 260 325', label: [235, 308] as [number, number] },
    { name: 'Ural Tog\'lari', path: 'M 350 140 Q 355 180 345 230', label: [362, 190] as [number, number] },
    { name: 'Oltoy Tizmasi', path: 'M 600 210 Q 640 220 670 200', label: [635, 202] as [number, number] }
  ];

  // Surrounding Regional Cities / Trade Nodes
  const regionalHubs = [
    { name: 'Almati', coords: [580, 315], flag: '🇰🇿' },
    { name: 'Ostona', coords: [460, 185], flag: '🇰🇿' },
    { name: 'Pekin', coords: [850, 235], flag: '🇨🇳' },
    { name: 'Shanxay', coords: [885, 335], flag: '🇨🇳' },
    { name: 'Boku', coords: [248, 338], flag: '🇦🇿' },
    { name: 'Tehron', coords: [295, 415], flag: '🇮🇷' },
    { name: 'Bandar-Abbos', coords: [325, 490], flag: '🇮🇷' },
    { name: 'Ashxobod', coords: [340, 385], flag: '🇹🇲' },
    { name: 'Bishkek', coords: [525, 330], flag: '🇰🇬' },
    { name: 'Dushanbe', coords: [490, 390], flag: '🇹🇯' },
    { name: 'Berlin', coords: [115, 175], flag: '🇩🇪' },
    { name: 'Oqtov Porti', coords: [265, 290], flag: '🇰🇿' }
  ];

  // Routes Data (Default: Namangan -> Tashkent -> Khorgos -> Destination Markets)
  const routesData: DestinationRoute[] = [
    {
      id: 'china',
      name: 'Xitoy (Urumchi / Shanxay)',
      flag: '🇨🇳',
      transportMode: 'Temiryo\'l & Avto TIR',
      vehicleIcon: '🚆',
      totalDistance: '4,850 km',
      totalTime: '8 — 12 kun',
      corridorName: 'Buyuk Ipak Yo\'li (Xorgos Koridori)',
      routeCountryIds: ['uzb', 'kaz', 'chn'],
      stages: [
        {
          id: 'namangan',
          name: 'Namangan, O\'zbekiston',
          role: 'Boshlang\'ich Nuqta (Agro & Tekstil yuklash)',
          time: '0-kun',
          icon: '🏛️',
          color: '#10B981',
          coords: [480, 360],
          desc: 'Yuklarni saralash, qadoqlash va eksport partiyalarini shakllantirish (To\'qimachilik, yangi va quritilgan meva-sabzavot).',
          tags: ['Eksport Partiyasi', 'Namangan FEZ', 'Avto TIR'],
          documents: ['Hisob-faktura (Invoice)', 'Spetsifikatsiya', 'CMR']
        },
        {
          id: 'tashkent',
          name: 'Toshkent, O\'zbekiston',
          role: 'Bojxona & Logistika Markazi',
          time: '+1 kun (300 km)',
          icon: '🏢',
          color: '#38BDF8',
          coords: [430, 320],
          desc: 'Bojxona rasmiylashtiruvi (BYuD), Fitosanitariya va ST-1 kelib chiqish sertifikatlari, multimodal temiryo\'l/avto konsolidatsiyasi.',
          tags: ['TIF BYuD', 'Fito Sertifikat', 'Yashil Yo\'lak'],
          documents: ['BYuD Deklaratsiya', 'Fitosanitariya', 'ST-1']
        },
        {
          id: 'khorgos',
          name: 'Xorgos (Khorgos Gateway)',
          role: 'Qozog\'iston — Xitoy Chegara Bojxona Maskani',
          time: '+4 kun (1,450 km)',
          icon: '🛂',
          color: '#F59E0B',
          coords: [620, 260],
          desc: 'Quruqlikdagi eng yirik quruq port (Dry Port). Temiryo\'l relslari kengligi almashinuvi (1520 mm dan 1435 mm gacha) va rentgen-skaner nazorati.',
          tags: ['Quruq Port', 'Rels O\'zgarishi', 'Bojxona Chegarasi'],
          documents: ['Tranzit Deklaratsiyasi', 'SMGS / CIM Hujjati']
        },
        {
          id: 'dest-china',
          name: 'Xitoy (Urumchi / Shanxay)',
          role: 'Yakuniy Iste\'mol Bozori',
          time: '+8 — 12 kun (4,850 km)',
          icon: '🎯',
          color: '#D4AF37',
          coords: [820, 270],
          desc: 'Elektronika va xomashyo importi, o\'zbek paxta ipi va qishloq xo\'jaligi mahsulotlarining Xitoy ulgurji savdo tarmoqlariga topshirilishi.',
          tags: ['Xitoy Ulgurji Bozor', 'Konteyner Logistika', 'Yuqori Talab'],
          documents: ['Import Bojxona Rejimi', 'Qabul Qilish Dalolatnomasi']
        }
      ]
    },
    {
      id: 'russia',
      name: 'Rossiya (Moskva / Fudsiti)',
      flag: '🇷🇺',
      transportMode: 'Refrijerator TIR',
      vehicleIcon: '🚛',
      totalDistance: '3,450 km',
      totalTime: '5 — 7 kun',
      corridorName: 'MDH Shimoliy Refrijerator Koridori',
      routeCountryIds: ['uzb', 'kaz', 'rus'],
      stages: [
        {
          id: 'namangan',
          name: 'Namangan, O\'zbekiston',
          role: 'Boshlang\'ich Nuqta',
          time: '0-kun',
          icon: '🏛️',
          color: '#10B981',
          coords: [480, 360],
          desc: 'Meva va qishloq xo\'jaligi mahsulotlarini shok sovutish (+2...+4°C) va refrijerator tirlariga yuklash.',
          tags: ['Shok Sovutish', 'TIR Carnet', 'Refrijerator'],
          documents: ['CMR', 'TIR Carnet', 'Karantin ruxsati']
        },
        {
          id: 'tashkent',
          name: 'Toshkent, O\'zbekiston',
          role: 'Bojxona Rasmiylashtiruvi',
          time: '+1 kun',
          icon: '🏢',
          color: '#38BDF8',
          coords: [430, 320],
          desc: 'TSOYaEAT tizimida shartnoma ro\'yxatdan o\'tkazilishi, ST-1 sertifikati (MDH hududida 0% nol stavkali bojxona).',
          tags: ['ST-1 Sertifikat', 'MDH 0% Boj', 'TSOYaEAT'],
          documents: ['ST-1 Formasi', 'BYuD', 'Xavfsizlik sertifikati']
        },
        {
          id: 'ozinki',
          name: 'Qozog\'iston — Rossiya Chegarasi (O\'zinki)',
          role: 'Chegara Tranzit Punkti',
          time: '+3 kun (2,100 km)',
          icon: '🛂',
          color: '#F59E0B',
          coords: [320, 210],
          desc: 'Evroosiyo Iqtisodiy Ittifoqi (EOII) tranzit nazorati va fitosanitariya xulosalarini tasdiqlash.',
          tags: ['Tranzit Yo\'lagi', 'Fito Nazorat', 'EOII Chegarasi'],
          documents: ['Tranzit nazorati', 'Veterinariya/Fitosanitariya']
        },
        {
          id: 'dest-russia',
          name: 'Rossiya (Moskva / Fudsiti)',
          role: 'Yakuniy Ulkan Bozor',
          time: '+5 — 7 kun (3,450 km)',
          icon: '🎯',
          color: '#38BDF8',
          coords: [180, 160],
          desc: '"Fudsiti" va yirik ulgurji logistika taqsimot markazlariga to\'g\'ridan-to\'g\'ri yetkazib berish.',
          tags: ['Fudsiti Moskva', 'Tezkor Savdo', 'Refrijerator'],
          documents: ['Tijorat Fakturasi', 'Tushirish akti']
        }
      ]
    },
    {
      id: 'eu',
      name: 'Yevropa Ittifoqi (Frankfurt / Duisburg)',
      flag: '🇪🇺',
      transportMode: 'Multimodal (Kema + Avto TIR)',
      vehicleIcon: '🚢',
      totalDistance: '5,420 km',
      totalTime: '12 — 16 kun',
      corridorName: 'GSP+ Yevropa Ittifoqi Imtiyozli Koridori',
      routeCountryIds: ['uzb', 'kaz', 'aze', 'eu'],
      stages: [
        {
          id: 'namangan',
          name: 'Namangan, O\'zbekiston',
          role: 'Boshlang\'ich Nuqta',
          time: '0-kun',
          icon: '🏛️',
          color: '#10B981',
          coords: [480, 360],
          desc: 'OEKO-TEX va GlobalG.A.P. xalqaro sifat sertifikatlari talablari bo\'yicha mahsulot tayyorlash.',
          tags: ['OEKO-TEX Standart', 'GlobalG.A.P.', 'Euro-pallet'],
          documents: ['OEKO-TEX pasporti', 'Eksport hisob-faktura']
        },
        {
          id: 'tashkent',
          name: 'Toshkent, O\'zbekiston',
          role: 'GSP+ & REX Rasmiylashtiruv',
          time: '+1 kun',
          icon: '🏢',
          color: '#38BDF8',
          coords: [430, 320],
          desc: 'Yevropa Ittifoqining GSP+ preferensiyalar tizimi (REX kodi) orqali 0% bojsiz eksport deklaratsiyasi.',
          tags: ['GSP+ REX', 'EUR.1 Formasi', '0% Nol Boj'],
          documents: ['REX Ro\'yxati', 'EUR.1', 'BYuD']
        },
        {
          id: 'caspian',
          name: 'Kaspiy / Aktau — Boku Porti',
          role: 'Multimodal Dengiz Tranziti',
          time: '+5 kun',
          icon: '🚢',
          color: '#F59E0B',
          coords: [280, 280],
          desc: 'Transkaspiy xalqaro transport yo\'nalishi (O\'rta Koridor / TITR) fider kemalari orqali vagon va tirlar o\'tishi.',
          tags: ['Kema Paromi', 'TITR Koridor', 'Multimodal'],
          documents: ['Dengiz Konosamenti (Bill of Lading)', 'Port hujjati']
        },
        {
          id: 'dest-eu',
          name: 'Germaniya (Frankfurt / Duisburg)',
          role: 'Yakuniy GSP+ Bozori',
          time: '+12 — 16 kun (5,420 km)',
          icon: '🎯',
          color: '#10B981',
          coords: [100, 220],
          desc: 'Duisburg quruq porti va Yevropa Ittifoqi supermarketlariga to\'g\'ridan-to\'g\'ri 0% bojsiz yetkazib berish.',
          tags: ['Yevropa Markazi', '0% Nol Boj', 'GSP+ Muvaffaqiyat'],
          documents: ['Yevropa T1 tranzit hujjati', 'Yevro bojxona xulosasi']
        }
      ]
    },
    {
      id: 'turkey',
      name: 'Turkiya (Istanbul / Mersin)',
      flag: '🇹🇷',
      transportMode: 'BTQ Temiryo\'l & Avto',
      vehicleIcon: '🚆',
      totalDistance: '3,850 km',
      totalTime: '7 — 10 kun',
      corridorName: 'O\'rta Koridor & O\'rta Yer Dengizi',
      routeCountryIds: ['uzb', 'tkm', 'aze', 'tur'],
      stages: [
        {
          id: 'namangan',
          name: 'Namangan, O\'zbekiston',
          role: 'Boshlang\'ich Nuqta',
          time: '0-kun',
          icon: '🏛️',
          color: '#10B981',
          coords: [480, 360],
          desc: 'Sanoat kalava iplari, quritilgan meva va mis katodlarini eksportga yuklash.',
          tags: ['Sanoat Iplari', 'Mis Eksporti', 'Standard Partiya'],
          documents: ['CMR', 'Spetsifikatsiya', 'TIR Carnet']
        },
        {
          id: 'tashkent',
          name: 'Toshkent, O\'zbekiston',
          role: 'Bojxona & TSOYaEAT',
          time: '+1 kun',
          icon: '🏢',
          color: '#38BDF8',
          coords: [430, 320],
          desc: 'Turkiya bilan preferensial savdo bitimlari bo\'yicha pasaytirilgan bojxona deklaratsiyasi.',
          tags: ['Preferensial Savdo', 'Elektron BYuD'],
          documents: ['Kelib chiqish sertifikati', 'Bojxona yuk deklaratsiyasi']
        },
        {
          id: 'baku',
          name: 'Boku (Alat porti), Ozarbayjon',
          role: 'Kavkaz Logistika Darvozasi',
          time: '+4 kun',
          icon: '🛂',
          color: '#F59E0B',
          coords: [280, 340],
          desc: 'Boku-Tbilisi-Qars (BTQ) xalqaro temiryo\'li orqali tezyurar yuk poyezdlariga o\'tish.',
          tags: ['BTQ Temiryo\'l', 'Kavkaz Darvozasi', 'Konteyner'],
          documents: ['Tranzit protokoli', 'Kavkaz tranzit guvohnomasi']
        },
        {
          id: 'dest-turkey',
          name: 'Turkiya (Istanbul)',
          role: 'Yakuniy Bozor & Dengiz Porti',
          time: '+7 — 10 kun (3,850 km)',
          icon: '🎯',
          color: '#F59E0B',
          coords: [150, 360],
          desc: 'Marmara va O\'rta yer dengizi portlari orqali global bozorlarga chiqish imkoniyati.',
          tags: ['O\'rta Yer Dengizi', 'Turkiya Bozori', 'Port Logistikasi'],
          documents: ['Marmara port hujjati', 'Tijorat yakuniy akti']
        }
      ]
    }
  ];

  // Active state
  const [activeRouteId, setActiveRouteId] = useState<string>('china');
  const [selectedStageId, setSelectedStageId] = useState<string>('namangan');
  const [hoveredStage, setHoveredStage] = useState<StageData | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<CountryInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvas animation refs
  const pathRef = useRef<SVGPathElement | null>(null);
  const photonRef = useRef<SVGCircleElement | null>(null);
  const vehicleGroupRef = useRef<SVGGElement | null>(null);
  const trailerRef = useRef<SVGCircleElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentRoute = routesData.find((r) => r.id === activeRouteId) || routesData[0];
  const selectedStage = currentRoute.stages.find((s) => s.id === selectedStageId) || currentRoute.stages[0];

  // Generate smooth SVG Bezier path
  const generatePathD = (stages: StageData[]) => {
    if (stages.length < 2) return '';
    let d = `M ${stages[0].coords[0]} ${stages[0].coords[1]}`;
    for (let i = 0; i < stages.length - 1; i++) {
      const p1 = stages[i].coords;
      const p2 = stages[i + 1].coords;
      const midX = (p1[0] + p2[0]) / 2;
      const midY = (p1[1] + p2[1]) / 2;
      const curveOffset = (p2[0] - p1[0]) * 0.15;
      d += ` Q ${midX} ${midY - curveOffset}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  };

  const pathDString = generatePathD(currentRoute.stages);

  // 60FPS Photon & Vehicle Pulse Animation along the SVG path
  useEffect(() => {
    if (!pathRef.current || !photonRef.current) return;

    const path = pathRef.current;
    const photon = photonRef.current;
    const trailer = trailerRef.current;
    const vehicleGroup = vehicleGroupRef.current;

    let progress = 0;
    const speed = 0.0016;

    const animate = () => {
      try {
        const totalLength = path.getTotalLength();
        if (totalLength > 0) {
          progress = (progress + speed) % 1;
          const currentPoint = path.getPointAtLength(progress * totalLength);
          photon.setAttribute('cx', currentPoint.x.toString());
          photon.setAttribute('cy', currentPoint.y.toString());

          if (vehicleGroup) {
            vehicleGroup.setAttribute('transform', `translate(${currentPoint.x - 12}, ${currentPoint.y - 12})`);
          }

          if (trailer) {
            const trailDist = Math.max(0, (progress * totalLength) - 18);
            const trailPoint = path.getPointAtLength(trailDist);
            trailer.setAttribute('cx', trailPoint.x.toString());
            trailer.setAttribute('cy', trailPoint.y.toString());
          }
        }
      } catch {
        // Path might be updating
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activeRouteId, pathDString]);

  // Handle stage selection
  const handleSelectStage = (stageId: string) => {
    soundEffects.playClick(850);
    setSelectedStageId(stageId);
  };

  // Switch destination route
  const handleSelectRoute = (routeId: string) => {
    soundEffects.playClick(920);
    setActiveRouteId(routeId);
    const newRoute = routesData.find(r => r.id === routeId);
    if (newRoute && newRoute.stages.length > 0) {
      setSelectedStageId(newRoute.stages[0].id);
    }
  };

  const handleAskAIAboutRoute = () => {
    if (!onSendToChat) return;
    const prompt = `Namangandan "${currentRoute.name}" yo'nalishi bo'yicha to'liq tashqi iqtisodiy logistika tahlili kerak: Toshkent bojxonasi, ${currentRoute.stages[2]?.name} orqali tranzit, talab qilinadigan hujjatlar (${selectedStage.documents?.join(', ')}), 20 tonna yuk uchun umumiy transport xarajati va tavsiya etiladigan INCOTERMS sharti qanday?`;
    onSendToChat(prompt);
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#061528] via-[#040e1b] to-[#02070e] border-2 border-red-500/40 shadow-2xl overflow-hidden backdrop-blur-xl">
      
      {/* Top Academic Header Bar */}
      <div className="p-4 sm:p-5 border-b border-red-500/30 bg-gradient-to-r from-[#091f38]/95 via-[#0e2747]/90 to-[#061528]/95 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 via-amber-500 to-[#1e3e62] p-0.5 flex items-center justify-center shadow-lg shadow-red-500/25 border border-red-400">
            <div className="w-full h-full bg-[#061528] rounded-[10px] flex items-center justify-center text-red-400 font-black text-sm">
              <Compass className="w-5 h-5 text-red-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-black text-red-400 uppercase bg-red-950/80 px-2 py-0.5 rounded border border-red-500/50 flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                Belgilangan Davlatlar (Qizil Chiziq)
              </span>
              <span className="text-[10px] text-cyan-300 font-bold hidden sm:inline">
                Real Relyef & Dengiz Havzalari
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>Namangan</span>
              <span className="text-red-400 font-mono">⟷</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-200">
                {currentRoute.name}
              </span>
            </h2>
          </div>
        </div>

        {/* Destination Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-[#061528]/90 p-1 rounded-xl border border-red-500/30 overflow-x-auto max-w-full">
          {routesData.map((route) => (
            <button
              key={route.id}
              onClick={() => handleSelectRoute(route.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
                activeRouteId === route.id
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white border border-red-400 shadow-md shadow-red-600/30 font-black ring-1 ring-red-300'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{route.flag}</span>
              <span>{route.name.split('(')[0].trim()}</span>
            </button>
          ))}

          {/* Standalone HTML Link */}
          <a
            href="/logistics-route-map.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 transition shrink-0"
            title="Yangi oynada alohida HTML sifatida ochish"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">To'liq Ekran</span>
          </a>
        </div>
      </div>

      {/* Main Interactive Grid: SVG Canvas + Stage Timeline & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
        
        {/* SVG Route Map Area (8 cols on desktop) */}
        <div className="lg:col-span-8 relative bg-[#040e1b] p-1 sm:p-3 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-red-500/25">
          
          {/* Subtle Grid & Coordinates Watermark */}
          <div className="absolute bottom-3 left-4 pointer-events-none text-[10px] font-mono text-slate-400 space-y-0.5 z-10 hidden sm:block bg-[#061528]/85 p-2 rounded-lg border border-white/10 backdrop-blur-md">
            <div className="text-red-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              BELGILANGAN HUDUD: {currentRoute.corridorName}
            </div>
            <div>ORIGIN: NAMANGAN AGRO-LOGISTIKA TERMINALI (LAT 40.99° N / LON 71.67° E)</div>
            <div className="text-cyan-300 font-semibold">QIZIL CHIZIQLI DAVLATLAR: {currentRoute.routeCountryIds.map(id => countries.find(c => c.id === id)?.name).join(' ➔ ')}</div>
          </div>

          {/* Floating Hover Tooltip for Stages or Countries */}
          {hoveredStage && (
            <div
              className="absolute z-30 pointer-events-none bg-[#061528]/95 border-2 border-red-500 rounded-xl px-3 py-2 text-xs text-white shadow-2xl -translate-x-1/2 -translate-y-full mb-3 backdrop-blur-md"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            >
              <div className="font-extrabold flex items-center gap-1.5 text-amber-300">
                <span>{hoveredStage.icon}</span>
                <span>{hoveredStage.name}</span>
              </div>
              <div className="text-[10px] text-red-300 font-mono mt-0.5 font-bold">{hoveredStage.time}</div>
            </div>
          )}

          {hoveredCountry && !hoveredStage && (
            <div
              className="absolute z-30 pointer-events-none bg-[#061528]/95 border-2 border-red-500/80 rounded-xl px-3.5 py-2 text-xs text-white shadow-2xl -translate-x-1/2 -translate-y-full mb-3 max-w-xs backdrop-blur-md"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            >
              <div className="font-black flex items-center gap-1.5 text-red-400">
                <span>{hoveredCountry.flag}</span>
                <span>{hoveredCountry.name}</span>
                {currentRoute.routeCountryIds.includes(hoveredCountry.id) && (
                  <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-extrabold ml-auto">
                    MARSHRUT BO'YICHA BELGILANGAN
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-300 mt-1 leading-snug">{hoveredCountry.info}</div>
            </div>
          )}

          {/* REAL GEOGRAPHIC MAP SVG CANVAS */}
          <svg 
            viewBox="0 0 920 540" 
            className="w-full h-full max-h-[550px] select-none rounded-xl"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
          >
            <defs>
              {/* Deep Ocean Bathymetric Gradient Background */}
              <radialGradient id="realOceanGradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#0c2543" />
                <stop offset="45%" stopColor="#071b33" />
                <stop offset="85%" stopColor="#041021" />
                <stop offset="100%" stopColor="#020813" />
              </radialGradient>

              {/* Landmass Shading Pattern */}
              <linearGradient id="landmassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#152b45" />
                <stop offset="50%" stopColor="#11243b" />
                <stop offset="100%" stopColor="#0d1b2d" />
              </linearGradient>

              {/* Marked Route Red Glow Filter */}
              <filter id="redBorderGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gold gradient for transit corridor line */}
              <linearGradient id="reactGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#F59E0B" stopOpacity="1" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* REAL MAP LAYER 0: Ocean Base Texture with Bathymetry */}
            <rect width="920" height="540" fill="url(#realOceanGradient)" rx="12" />

            {/* Latitude and Longitude Geographic Graticule Grid */}
            <g className="pointer-events-none opacity-20">
              {/* Parallels (Latitudes) */}
              <line x1="0" y1="110" x2="920" y2="110" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" />
              <text x="12" y="106" fill="#38bdf8" fontSize="8" fontFamily="monospace">60° N</text>

              <line x1="0" y1="210" x2="920" y2="210" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" />
              <text x="12" y="206" fill="#38bdf8" fontSize="8" fontFamily="monospace">50° N</text>

              <line x1="0" y1="330" x2="920" y2="330" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 3" />
              <text x="12" y="326" fill="#38bdf8" fontSize="8" fontFamily="monospace">40° N (Markaziy Osiyo)</text>

              <line x1="0" y1="450" x2="920" y2="450" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" />
              <text x="12" y="446" fill="#38bdf8" fontSize="8" fontFamily="monospace">30° N</text>

              {/* Meridians (Longitudes) */}
              <line x1="120" y1="0" x2="120" y2="540" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" />
              <text x="124" y="530" fill="#38bdf8" fontSize="8" fontFamily="monospace">30° E</text>

              <line x1="280" y1="0" x2="280" y2="540" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" />
              <text x="284" y="530" fill="#38bdf8" fontSize="8" fontFamily="monospace">50° E</text>

              <line x1="480" y1="0" x2="480" y2="540" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 3" />
              <text x="484" y="530" fill="#38bdf8" fontSize="8" fontFamily="monospace">70° E (Namangan)</text>

              <line x1="680" y1="0" x2="680" y2="540" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" />
              <text x="684" y="530" fill="#38bdf8" fontSize="8" fontFamily="monospace">90° E</text>

              <line x1="860" y1="0" x2="860" y2="540" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" />
              <text x="864" y="530" fill="#38bdf8" fontSize="8" fontFamily="monospace">110° E</text>
            </g>

            {/* REAL MAP LAYER 1: Deep Ocean Waters, Seas & Gulfs */}
            {waterBodies.map((water) => (
              <g key={water.id} className="pointer-events-none">
                <path
                  d={water.path}
                  fill="#061c33"
                  stroke="#0ea5e9"
                  strokeWidth="1.6"
                  opacity="0.8"
                />
                <text
                  x={water.labelCoords[0]}
                  y={water.labelCoords[1]}
                  fill="#38bdf8"
                  fontSize="9"
                  fontFamily="sans-serif"
                  fontWeight="700"
                  fontStyle="italic"
                  textAnchor="middle"
                  opacity="0.9"
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.9))' }}
                >
                  {water.name}
                </text>
              </g>
            ))}

            {/* REAL MAP LAYER 2: Mountain Elevation Ridges Relief */}
            {mountainRanges.map((mtn, idx) => (
              <g key={idx} className="pointer-events-none opacity-60">
                <path
                  d={mtn.path}
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="2.5"
                  strokeDasharray="2 3"
                />
                <text
                  x={mtn.label[0]}
                  y={mtn.label[1]}
                  fill="#f6d06d"
                  fontSize="7.5"
                  fontFamily="sans-serif"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  ▲ {mtn.name}
                </text>
              </g>
            ))}

            {/* REAL MAP LAYER 3: Eurasian Countries (BELGILANGAN DAVLATLAR QIZIL CHIZIQ BILAN!) */}
            {countries.map((country) => {
              const isMarkedCountry = currentRoute.routeCountryIds.includes(country.id);
              const isHovered = hoveredCountry?.id === country.id;

              return (
                <g 
                  key={country.id}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  {/* Country Area Contour - CHEGARASI QIZIL, FON QIZIL BO'LMASIN */}
                  <path
                    d={country.path}
                    fill={isHovered ? 'rgba(30, 62, 98, 0.55)' : 'rgba(17, 36, 59, 0.70)'}
                    /* VA BELGILANGAN DAVLATLAR QIZIL CHIZIQ BILAN BELGILANSIN, FON QIZIL EMAS */
                    stroke={
                      isMarkedCountry 
                        ? '#EF4444' 
                        : (isHovered ? '#60a5fa' : 'rgba(70, 115, 170, 0.45)')
                    }
                    strokeWidth={
                      isMarkedCountry 
                        ? (country.id === 'uzb' ? 3.8 : 3.0) 
                        : 1.2
                    }
                    filter={isMarkedCountry ? 'url(#redBorderGlow)' : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Red Corridor Active Pulsing Boundary for marked countries */}
                  {isMarkedCountry && (
                    <path
                      d={country.path}
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth="1.8"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                      opacity="0.9"
                    />
                  )}

                  {/* Country Flag & Label Badge */}
                  <g className="pointer-events-none">
                    {/* Background badge for label */}
                    <rect
                      x={country.labelCoords[0] - (isMarkedCountry ? 46 : 38)}
                      y={country.labelCoords[1] - 11}
                      width={isMarkedCountry ? 92 : 76}
                      height="18"
                      rx="6"
                      fill="#07172B"
                      stroke={isMarkedCountry ? '#EF4444' : '#334D6E'}
                      strokeWidth={isMarkedCountry ? '1.8' : '1'}
                      opacity="0.92"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
                    />
                    <text
                      x={country.labelCoords[0]}
                      y={country.labelCoords[1] + 2}
                      fill={isMarkedCountry ? '#FCA5A5' : '#ffffff'}
                      fontSize={isMarkedCountry ? '10.5' : '9.5'}
                      fontWeight={isMarkedCountry ? '900' : '700'}
                      textAnchor="middle"
                    >
                      {country.flag} {country.name}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* REAL MAP LAYER 4: Surrounding Regional Trade Hubs */}
            {regionalHubs.map((hub, idx) => (
              <g key={idx} className="pointer-events-none opacity-85">
                <circle
                  cx={hub.coords[0]}
                  cy={hub.coords[1]}
                  r="3.2"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <text
                  x={hub.coords[0]}
                  y={hub.coords[1] + 11}
                  fill="#e2e8f0"
                  fontSize="8.5"
                  fontWeight="700"
                  textAnchor="middle"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))' }}
                >
                  {hub.name}
                </text>
              </g>
            ))}

            {/* REAL MAP LAYER 5: Static Corridor Backdrop Track Line */}
            <path
              d={pathDString}
              fill="none"
              stroke="rgba(0, 0, 0, 0.7)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={pathDString}
              fill="none"
              stroke="rgba(239, 68, 68, 0.45)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* REAL MAP LAYER 6: Animated Active Glowing Dashed Path */}
            <path
              ref={pathRef}
              d={pathDString}
              fill="none"
              stroke="url(#reactGoldGradient)"
              strokeWidth="4.5"
              strokeDasharray="9 7"
              strokeLinecap="round"
              className="animate-dash"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))'
              }}
            />

            {/* REAL MAP LAYER 7: Pulse / Moving Photon Particles */}
            <circle
              ref={trailerRef}
              r="4.5"
              fill="#EF4444"
              opacity="0.8"
            />
            <circle
              ref={photonRef}
              r="7.5"
              fill="#FFFFFF"
              style={{
                filter: 'drop-shadow(0 0 8px #FFFFFF) drop-shadow(0 0 16px #EF4444)'
              }}
            />

            {/* REAL MAP LAYER 8: Moving Vehicle Marker along the path */}
            <g ref={vehicleGroupRef} className="pointer-events-none">
              <circle cx="12" cy="12" r="13" fill="#991B1B" stroke="#FFFFFF" strokeWidth="2" opacity="0.95" style={{ filter: 'drop-shadow(0 0 8px #EF4444)' }} />
              <text x="12" y="16.5" textAnchor="middle" fontSize="12">
                {currentRoute.vehicleIcon}
              </text>
            </g>

            {/* REAL MAP LAYER 9: Stage Marker Nodes (Namangan, Tashkent, Khorgos, Destination) */}
            {currentRoute.stages.map((stage) => {
              const [x, y] = stage.coords;
              const isSelected = stage.id === selectedStageId;

              return (
                <g
                  key={stage.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => handleSelectStage(stage.id)}
                  onMouseEnter={() => setHoveredStage(stage)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  {/* Outer Pulsing Halo */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 38 : 24}
                    fill={isSelected ? '#EF4444' : stage.color}
                    stroke={isSelected ? '#EF4444' : stage.color}
                    opacity={isSelected ? 0.6 : 0.25}
                    className={isSelected ? 'animate-ping-slow' : ''}
                  />

                  {/* Core Inner Node Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill="#061528"
                    stroke={isSelected ? '#EF4444' : stage.color}
                    strokeWidth={isSelected ? 4 : 2.8}
                    style={{
                      filter: isSelected ? 'drop-shadow(0 0 14px #EF4444)' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.9))'
                    }}
                  />

                  {/* Stage Icon in Center */}
                  <text
                    x={x}
                    y={y + 4.5}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#ffffff"
                    pointerEvents="none"
                  >
                    {stage.icon}
                  </text>

                  {/* Stage Name Label */}
                  <text
                    x={x}
                    y={y - 23}
                    textAnchor="middle"
                    fontSize="12.5"
                    fontWeight="900"
                    fill="#ffffff"
                    pointerEvents="none"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,1))' }}
                  >
                    {stage.name.split(',')[0]}
                  </text>

                  {/* Time Sublabel */}
                  <text
                    x={x}
                    y={y + 28}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="monospace"
                    fill="#FDE047"
                    pointerEvents="none"
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,1))' }}
                  >
                    {stage.time.split('(')[0].trim()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Stage Timeline & Inspector Panel (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#061528]/90 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-red-500/30 pb-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-red-400" />
                Marshrut Bosqichlari
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300">
                {currentRoute.totalDistance} • {currentRoute.totalTime}
              </span>
            </div>

            {/* Stages Timeline List */}
            <div className="space-y-2 relative before:absolute before:top-3 before:bottom-3 before:left-4 before:w-[2px] before:bg-gradient-to-b before:from-[#10B981] before:via-[#38BDF8] before:to-[#EF4444] before:opacity-60">
              {currentRoute.stages.map((stage) => {
                const isSelected = stage.id === selectedStageId;
                return (
                  <div
                    key={stage.id}
                    onClick={() => handleSelectStage(stage.id)}
                    className={`relative rounded-xl p-2.5 pl-9 transition-all duration-150 cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-950/80 to-[#0e2747] border-red-500 shadow-lg shadow-black/50 ring-2 ring-red-500/60'
                        : 'bg-[#040e1b]/80 border-white/5 hover:border-red-500/30 hover:bg-[#061528]'
                    }`}
                  >
                    {/* Icon circle marker on timeline */}
                    <div 
                      className={`absolute left-2.5 top-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                        isSelected 
                          ? 'bg-red-500 text-white font-bold border-white shadow-md' 
                          : 'bg-[#040e1b] text-slate-300 border-red-500/50'
                      }`}
                    >
                      {stage.icon}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white line-clamp-1">{stage.name}</span>
                      <span className="text-[10px] font-mono text-amber-300 shrink-0 font-bold">{stage.time.split('(')[0]}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{stage.role}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Stage Detail Inspector Box */}
          <div className="rounded-xl bg-gradient-to-br from-[#040e1b] to-[#0e2747] border-2 border-red-500/60 p-3.5 shadow-xl space-y-2.5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-red-500/20">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/60 flex items-center justify-center text-sm shrink-0">
                {selectedStage.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-white truncate">
                  {selectedStage.name}
                </h4>
                <p className="text-[10px] font-mono text-red-300 truncate font-semibold">
                  {selectedStage.role}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedStage.desc}
            </p>

            {/* Document Badges */}
            {selectedStage.documents && selectedStage.documents.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-red-300 font-semibold block flex items-center gap-1">
                  <FileText className="w-3 h-3 text-red-400" />
                  Kerakli Bojxona / Tranzit Hujjatlari:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedStage.documents.map((doc, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-red-950/80 text-red-200 border border-red-500/40 font-bold">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button: Ask AI Consultant */}
            <button
              onClick={handleAskAIAboutRoute}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition-all duration-150 active:scale-95 cursor-pointer border border-red-400/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ushbu Marshrutni AI bilan Hisoblash</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Bottom Academic Footnote Bar */}
      <div className="px-4 py-3 bg-[#040e1b] border-t border-red-500/25 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4 text-slate-300 text-[11px] flex-wrap">
          <span className="flex items-center gap-1.5 text-red-400 font-extrabold">
            <span className="w-3.5 h-1 bg-red-500 rounded-full shadow-sm shadow-red-500"></span>
            Qizil Chiziq: Marshrut Bo'yicha Belgilangan Davlatlar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            Namangan (Eksport Boshlang'ich)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
            Toshkent (BYuD & Fito)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            Xorgos / Chegara Bojxonalari
          </span>
        </div>

        <span className="text-[10px] text-slate-400 italic">
          O'zbekiston Tashqi Savdo va Logistika Standartlari (INCOTERMS 2020) asosida.
        </span>
      </div>

      {/* Internal CSS for SVG Dash Animation */}
      <style>{`
        @keyframes dashMove {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        .animate-dash {
          animation: dashMove 22s linear infinite;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 20s linear infinite;
        }
        @keyframes pingSlow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }
        .animate-ping-slow {
          animation: pingSlow 2.5s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};
