export interface CurrencyMetadata {
  code: string;
  flag: string;
  countryUz: string;
  symbol: string;
  region: 'top' | 'asia' | 'europe' | 'cis' | 'other';
  isMajorPartner: boolean;
  iso2?: string;
  flagUrl?: string;
}

export const CURRENCY_METADATA_MAP: Record<string, CurrencyMetadata> = {
  USD: { code: 'USD', flag: '🇺🇸', countryUz: 'AQSH (Amerika Qo\'shma Shtatlari)', symbol: '$', region: 'top', isMajorPartner: true, iso2: 'us', flagUrl: 'https://flagcdn.com/w640/us.png' },
  EUR: { code: 'EUR', flag: '🇪🇺', countryUz: 'Yevroittifoq (Evrozona)', symbol: '€', region: 'top', isMajorPartner: true, iso2: 'eu', flagUrl: 'https://flagcdn.com/w640/eu.png' },
  RUB: { code: 'RUB', flag: '🇷🇺', countryUz: 'Rossiya Federatsiyasi', symbol: '₽', region: 'top', isMajorPartner: true, iso2: 'ru', flagUrl: 'https://flagcdn.com/w640/ru.png' },
  CNY: { code: 'CNY', flag: '🇨🇳', countryUz: 'Xitoy Xalq Respublikasi', symbol: '¥', region: 'top', isMajorPartner: true, iso2: 'cn', flagUrl: 'https://flagcdn.com/w640/cn.png' },
  KZT: { code: 'KZT', flag: '🇰🇿', countryUz: 'Qozog\'iston Respublikasi', symbol: '₸', region: 'top', isMajorPartner: true, iso2: 'kz', flagUrl: 'https://flagcdn.com/w640/kz.png' },
  TRY: { code: 'TRY', flag: '🇹🇷', countryUz: 'Turkiya Respublikasi', symbol: '₺', region: 'top', isMajorPartner: true, iso2: 'tr', flagUrl: 'https://flagcdn.com/w640/tr.png' },
  AED: { code: 'AED', flag: '🇦🇪', countryUz: 'Birlashgan Arab Amirliklari (Dubay)', symbol: 'د.إ', region: 'top', isMajorPartner: true, iso2: 'ae', flagUrl: 'https://flagcdn.com/w640/ae.png' },
  GBP: { code: 'GBP', flag: '🇬🇧', countryUz: 'Buyuk Britaniya (Angliya)', symbol: '£', region: 'europe', isMajorPartner: true, iso2: 'gb', flagUrl: 'https://flagcdn.com/w640/gb.png' },
  JPY: { code: 'JPY', flag: '🇯🇵', countryUz: 'Yaponiya', symbol: '¥', region: 'asia', isMajorPartner: true, iso2: 'jp', flagUrl: 'https://flagcdn.com/w640/jp.png' },
  KRW: { code: 'KRW', flag: '🇰🇷', countryUz: 'Janubiy Koreya Respublikasi', symbol: '₩', region: 'asia', isMajorPartner: true, iso2: 'kr', flagUrl: 'https://flagcdn.com/w640/kr.png' },
  CHF: { code: 'CHF', flag: '🇨🇭', countryUz: 'Shveysariya Konfederatsiyasi', symbol: 'CHF', region: 'europe', isMajorPartner: true, iso2: 'ch', flagUrl: 'https://flagcdn.com/w640/ch.png' },
  INR: { code: 'INR', flag: '🇮🇳', countryUz: 'Hindiston Respublikasi', symbol: '₹', region: 'asia', isMajorPartner: true, iso2: 'in', flagUrl: 'https://flagcdn.com/w640/in.png' },
  SAR: { code: 'SAR', flag: '🇸🇦', countryUz: 'Saudiya Arabistoni', symbol: '﷼', region: 'asia', isMajorPartner: true, iso2: 'sa', flagUrl: 'https://flagcdn.com/w640/sa.png' },
  CAD: { code: 'CAD', flag: '🇨🇦', countryUz: 'Kanada', symbol: 'C$', region: 'other', isMajorPartner: false, iso2: 'ca', flagUrl: 'https://flagcdn.com/w640/ca.png' },
  AUD: { code: 'AUD', flag: '🇦🇺', countryUz: 'Avstraliya', symbol: 'A$', region: 'other', isMajorPartner: false, iso2: 'au', flagUrl: 'https://flagcdn.com/w640/au.png' },
  PLN: { code: 'PLN', flag: '🇵🇱', countryUz: 'Polsha Respublikasi', symbol: 'zł', region: 'europe', isMajorPartner: true, iso2: 'pl', flagUrl: 'https://flagcdn.com/w640/pl.png' },
  BYN: { code: 'BYN', flag: '🇧🇾', countryUz: 'Belarus Respublikasi', symbol: 'Br', region: 'cis', isMajorPartner: true, iso2: 'by', flagUrl: 'https://flagcdn.com/w640/by.png' },
  KGS: { code: 'KGS', flag: '🇰🇬', countryUz: 'Qirg\'iziston Respublikasi', symbol: 'сом', region: 'cis', isMajorPartner: true, iso2: 'kg', flagUrl: 'https://flagcdn.com/w640/kg.png' },
  TJS: { code: 'TJS', flag: '🇹🇯', countryUz: 'Tojikiston Respublikasi', symbol: 'SM', region: 'cis', isMajorPartner: true, iso2: 'tj', flagUrl: 'https://flagcdn.com/w640/tj.png' },
  TMT: { code: 'TMT', flag: '🇹🇲', countryUz: 'Turkmaniston', symbol: 'TMT', region: 'cis', isMajorPartner: true, iso2: 'tm', flagUrl: 'https://flagcdn.com/w640/tm.png' },
  AZN: { code: 'AZN', flag: '🇦🇿', countryUz: 'Ozarbayjon Respublikasi', symbol: '₼', region: 'cis', isMajorPartner: true, iso2: 'az', flagUrl: 'https://flagcdn.com/w640/az.png' },
  GEL: { code: 'GEL', flag: '🇬🇪', countryUz: 'Gruziya', symbol: '₾', region: 'cis', isMajorPartner: false, iso2: 'ge', flagUrl: 'https://flagcdn.com/w640/ge.png' },
  SGD: { code: 'SGD', flag: '🇸🇬', countryUz: 'Singapur', symbol: 'S$', region: 'asia', isMajorPartner: false, iso2: 'sg', flagUrl: 'https://flagcdn.com/w640/sg.png' },
  MYR: { code: 'MYR', flag: '🇲🇾', countryUz: 'Malayziya', symbol: 'RM', region: 'asia', isMajorPartner: false, iso2: 'my', flagUrl: 'https://flagcdn.com/w640/my.png' },
  QAR: { code: 'QAR', flag: '🇶🇦', countryUz: 'Qatar Davlati', symbol: 'QR', region: 'asia', isMajorPartner: false, iso2: 'qa', flagUrl: 'https://flagcdn.com/w640/qa.png' },
  KWD: { code: 'KWD', flag: '🇰🇼', countryUz: 'Quvayt Davlati', symbol: 'KD', region: 'asia', isMajorPartner: false, iso2: 'kw', flagUrl: 'https://flagcdn.com/w640/kw.png' },
  EGP: { code: 'EGP', flag: '🇪🇬', countryUz: 'Misr Arab Respublikasi', symbol: 'E£', region: 'other', isMajorPartner: false, iso2: 'eg', flagUrl: 'https://flagcdn.com/w640/eg.png' },
  IRR: { code: 'IRR', flag: '🇮🇷', countryUz: 'Eron Islom Respublikasi', symbol: '﷼', region: 'asia', isMajorPartner: true, iso2: 'ir', flagUrl: 'https://flagcdn.com/w640/ir.png' },
  PKR: { code: 'PKR', flag: '🇵🇰', countryUz: 'Pokiston Islom Respublikasi', symbol: '₨', region: 'asia', isMajorPartner: true, iso2: 'pk', flagUrl: 'https://flagcdn.com/w640/pk.png' },
  UAH: { code: 'UAH', flag: '🇺🇦', countryUz: 'Ukraina', symbol: '₴', region: 'europe', isMajorPartner: false, iso2: 'ua', flagUrl: 'https://flagcdn.com/w640/ua.png' },
  HUF: { code: 'HUF', flag: '🇭🇺', countryUz: 'Vengriya', symbol: 'Ft', region: 'europe', isMajorPartner: false, iso2: 'hu', flagUrl: 'https://flagcdn.com/w640/hu.png' },
  CZK: { code: 'CZK', flag: '🇨🇿', countryUz: 'Chexiya Respublikasi', symbol: 'Kč', region: 'europe', isMajorPartner: false, iso2: 'cz', flagUrl: 'https://flagcdn.com/w640/cz.png' },
  SEK: { code: 'SEK', flag: '🇸🇪', countryUz: 'Shvetsiya', symbol: 'kr', region: 'europe', isMajorPartner: false, iso2: 'se', flagUrl: 'https://flagcdn.com/w640/se.png' },
  NOK: { code: 'NOK', flag: '🇳🇴', countryUz: 'Norvegiya', symbol: 'kr', region: 'europe', isMajorPartner: false, iso2: 'no', flagUrl: 'https://flagcdn.com/w640/no.png' },
  DKK: { code: 'DKK', flag: '🇩🇰', countryUz: 'Daniya', symbol: 'kr', region: 'europe', isMajorPartner: false, iso2: 'dk', flagUrl: 'https://flagcdn.com/w640/dk.png' },
  BGN: { code: 'BGN', flag: '🇧🇬', countryUz: 'Bolgariya', symbol: 'лв', region: 'europe', isMajorPartner: false, iso2: 'bg', flagUrl: 'https://flagcdn.com/w640/bg.png' },
  RON: { code: 'RON', flag: '🇷🇴', countryUz: 'Ruminiya', symbol: 'lei', region: 'europe', isMajorPartner: false, iso2: 'ro', flagUrl: 'https://flagcdn.com/w640/ro.png' },
  BRL: { code: 'BRL', flag: '🇧🇷', countryUz: 'Braziliya', symbol: 'R$', region: 'other', isMajorPartner: false, iso2: 'br', flagUrl: 'https://flagcdn.com/w640/br.png' },
  ZAR: { code: 'ZAR', flag: '🇿🇦', countryUz: 'Janubiy Afrika Respublikasi', symbol: 'R', region: 'other', isMajorPartner: false, iso2: 'za', flagUrl: 'https://flagcdn.com/w640/za.png' },
  IDR: { code: 'IDR', flag: '🇮🇩', countryUz: 'Indoneziya', symbol: 'Rp', region: 'asia', isMajorPartner: false, iso2: 'id', flagUrl: 'https://flagcdn.com/w640/id.png' },
  THB: { code: 'THB', flag: '🇹🇭', countryUz: 'Tailand', symbol: '฿', region: 'asia', isMajorPartner: false, iso2: 'th', flagUrl: 'https://flagcdn.com/w640/th.png' },
  VND: { code: 'VND', flag: '🇻🇳', countryUz: 'Vetnam', symbol: '₫', region: 'asia', isMajorPartner: true, iso2: 'vn', flagUrl: 'https://flagcdn.com/w640/vn.png' },
  AMD: { code: 'AMD', flag: '🇦🇲', countryUz: 'Armaniston', symbol: '֏', region: 'cis', isMajorPartner: false, iso2: 'am', flagUrl: 'https://flagcdn.com/w640/am.png' },
  MDL: { code: 'MDL', flag: '🇲🇩', countryUz: 'Moldova', symbol: 'L', region: 'cis', isMajorPartner: false, iso2: 'md', flagUrl: 'https://flagcdn.com/w640/md.png' },
};

export const DEFAULT_CURRENCY_METADATA: CurrencyMetadata = {
  code: 'VAL',
  flag: '🌐',
  countryUz: 'Xalqaro valyuta',
  symbol: '¤',
  region: 'other',
  isMajorPartner: false,
};

export function getCurrencyMeta(code: string): CurrencyMetadata {
  return CURRENCY_METADATA_MAP[code.toUpperCase()] || {
    ...DEFAULT_CURRENCY_METADATA,
    code: code.toUpperCase(),
  };
}

export function getFlagUrl(code: string): string | null {
  const meta = CURRENCY_METADATA_MAP[code.toUpperCase()];
  if (meta?.flagUrl) return meta.flagUrl;
  if (meta?.iso2) return `https://flagcdn.com/w640/${meta.iso2}.png`;
  return null;
}
