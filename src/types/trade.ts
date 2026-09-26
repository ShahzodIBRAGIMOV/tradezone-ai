export type UserRole = 'TADBIRKOR' | 'FERMER' | 'LOGISTIKA';

export interface UserProfile {
  id: string;
  fullName: string;
  companyName: string;
  role: UserRole;
  industryFocus: string;
  phoneNumber?: string;
  email?: string;
}

export interface ExportProduct {
  id: string;
  title: string;
  hsCode: string; // TIF TN
  category: 'Qishloq xo\'jaligi' | 'Tekstil va charm' | 'Sanoat va metallurgiya' | 'Kimyo va plastmassa' | 'Oziq-ovqat';
  imageUrl: string;
  description: string;
  unit: string;
  averagePriceUsd: number;
  gspPlusEligible: boolean;
  seasonPeak: string;
  minOrderQty: number;
  targetCountries: string[];
  requiredCerts: string[];
  logisticsModes: string[];
  exportVolume2025: string;
  marketDemand: 'Juda Yuqori' | 'Yuqori' | 'O\'rtacha';
  tariffBenefitInfo: string;
}

export interface ImportStatistic {
  id: string;
  title: string;
  hsCode: string; // TIF TN
  category: string;
  importVolumeUsd: number; // in USD
  importVolumeFormatted: string; // e.g., "$340M"
  annualGrowthPercent: number; // e.g., +38.5%
  originCountries: string[];
  isRedZone: boolean; // 🔴 Qizil hudud: keskin oshgan va mahalliylashtirish zarur
  substitutionFeasibility: 'Yuqori' | 'O\'rtacha' | 'Past';
  localRawMaterial: string;
  estimatedInvestment: string;
  recommendation: string;
  paybackPeriodMonths: number;
  domesticDemandTon: string;
  description?: string;
  imageUrl?: string;
  customsDutyRate?: string;
  localAssemblyPotential?: 'Yuqori' | 'O\'rtacha' | 'Past';
  localComponents?: string;
  brandExamples?: string[];
  keySpecs?: string;
}

export interface CalculationRequest {
  productName: string;
  hsCode?: string;
  volumeTons: number;
  destination: string;
  transportMode: 'Avto TIR (Refrijerator)' | 'Avto TIR (Tent)' | 'Temiryo\'l konteyner' | 'Avia Kargo';
  purchasePricePerKg: number;
  sellingPricePerKg: number;
}

export interface CalculationResult {
  productName: string;
  volumeTons: number;
  destination: string;
  transportMode: string;
  purchaseCost: number;
  packagingCost: number;
  transportCost: number;
  customsCost: number;
  certificationCost: number;
  totalCost: number;
  expectedRevenue: number;
  netProfit: number;
  profitMarginPercent: number;
  roiPercent: number;
  deliveryDays: string;
  aiAdvice: string;
}

export type AIChatPromptCategory = 
  | 'seasonal'     // 1. Mavsumiy tahlil
  | 'certificate'  // 2. Qadam-baqadam sertifikatlar
  | 'calculator'   // 3. Moliyaviy kalkulyator
  | 'substitution';// 4. Import o'rnini bosish konsaltingi

export type NavSection = 'export' | 'import' | 'rates' | 'logistics' | 'calculator' | 'rules' | 'tech';

export interface CbuCurrency {
  id: number;
  Code: string;
  Ccy: string;
  CcyNm_RU: string;
  CcyNm_UZ: string;
  CcyNm_UZC: string;
  CcyNm_EN: string;
  Nominal: string;
  Rate: string;
  Diff: string;
  Date: string;
  flag?: string;
  countryUz?: string;
  symbol?: string;
  isMajorPartner?: boolean;
  iso2?: string;
  flagUrl?: string;
}

export interface BorderCheckpoint {
  name: string;
  country: string;
  type: 'Avtomobil' | 'Temiryo\'l' | 'Dengiz porti' | 'Avia' | 'Avtomobil va Temiryo\'l';
  avgWaitHours: string;
}

export interface TransportOption {
  mode: 'Avtotransport (TIR)' | 'Avto-Refrijerator' | 'Temiryo\'l (Konteyner)' | 'Multimodal (Kema + Poezd)' | 'Avia Kargo';
  durationDays: string;
  costEstimateUsd: number;
  costFormatted: string;
  capacity: string;
  reliability: 'Juda Yuqori' | 'Yuqori' | 'O\'rtacha';
  recommendedFor: string;
}

export interface TradeRoute {
  id: string;
  name: string;
  corridorName: string;
  type: 'export' | 'import' | 'both';
  originCity: string;
  originCountry: string;
  originCoords: [number, number]; // [x, y] in percentage 0..100 for SVG map
  destinationCity: string;
  destinationCountry: string;
  destinationCoords: [number, number];
  distanceKm: number;
  primaryTransportMode: string;
  transitDaysRange: string;
  avgCostPerContainerUsd: number;
  transitCountries: string[];
  borderCheckpoints: BorderCheckpoint[];
  transportOptions: TransportOption[];
  exportCargo: string[];
  importCargo: string[];
  customsDocuments: string[];
  status: 'Faol va tezkor' | 'O\'rtacha yuklangan' | 'Strategik rivojlanayotgan';
  keyAdvantage: string;
  bottlenecks?: string;
  co2SavingsPercent?: number;
}

export interface TechProduct {
  id: string;
  title: string;
  hsCode: string; // TIF TN
  category: 'Smartfonlar va aloqa' | 'Mikrosxemalar va chiplar' | 'Hisoblash texnikasi' | 'Server va tarmoq' | 'Energiya va akkumulyator' | 'Dronlar va robototexnika' | 'Quyosh va yashil texnologiya' | 'Tibbiy yuqori texnologiyalar';
  imageUrl: string;
  description: string;
  importVolumeUsd: number;
  importVolumeFormatted: string; // e.g. "$1.15 Mldr"
  annualGrowthPercent: number; // e.g. +34.2%
  originCountries: string[]; // ["Xitoy (74%)", "Vetnam (18%)", "Hindiston (8%)"]
  customsDutyRate: string; // e.g. "0% (Bojxona boji) + 12% QQS"
  localAssemblyPotential: 'Yuqori' | 'O\'rtacha' | 'Past';
  localComponents: string;
  brandExamples: string[];
  keySpecs: string;
  recommendation: string;
}

export interface AISearchResult {
  query: string;
  productName: string;
  hsCode: string;
  tradeType: 'Eksport' | 'Import' | 'Ikkala yo\'nalish';
  dutyRateUzbekistan: string;
  gspPlusBenefit: string;
  marketOutlook: string;
  keyCertificates: string[];
  recommendedAction: string;
  keyFacts?: string[];
  mainPartners?: string[];
  vatRate?: string;
  isVoiceSearch?: boolean;
}

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  category?: AIChatPromptCategory;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
  calculationData?: CalculationResult;
}

export interface TradeAdvertisement {
  id: string;
  title: string;
  category: string;
  hsCode?: string;
  price: string;
  quantity: string;
  origin: string;
  description: string;
  certificates?: string;
  contactName: string;
  contactPhone: string;
  contactTelegram?: string;
  contactEmail?: string;
  location?: string;
  createdAt: string;
  isOwner?: boolean;
}
