import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'uz' | 'en' | 'ru';
export type AppCurrency = 'USD' | 'UZS' | 'EUR';

interface AppSettingsContextType {
  language: AppLanguage;
  currency: AppCurrency;
  setLanguage: (lang: AppLanguage) => void;
  setCurrency: (curr: AppCurrency) => void;
  formatPrice: (usdPrice: number | string) => string;
  formatVolumeUSD: (usdVolumeM: number) => string;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

// Real-world exchange baseline: 1 USD = 12,850 UZS, 1 EUR = 1.09 USD (~14,000 UZS)
const RATES = {
  USD: 1,
  UZS: 12850,
  EUR: 0.92,
};

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('tradezone_lang') as AppLanguage) || 'uz';
  });

  const [currency, setCurrencyState] = useState<AppCurrency>(() => {
    return (localStorage.getItem('tradezone_currency') as AppCurrency) || 'USD';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('tradezone_lang', lang);
  };

  const setCurrency = (curr: AppCurrency) => {
    setCurrencyState(curr);
    localStorage.setItem('tradezone_currency', curr);
  };

  // Convert USD price to current selected currency
  const formatPrice = (usdPrice: number | string): string => {
    const num = typeof usdPrice === 'number' ? usdPrice : parseFloat(usdPrice.replace(/[^0-9.]/g, '')) || 0;
    if (currency === 'UZS') {
      const uzs = Math.round(num * RATES.UZS);
      return `${uzs.toLocaleString('uz-UZ')} so'm`;
    } else if (currency === 'EUR') {
      const eur = (num * RATES.EUR).toFixed(2);
      return `€${eur}`;
    }
    return `$${num.toFixed(2)}`;
  };

  // Format large volume (e.g. 142.5 million USD)
  const formatVolumeUSD = (usdVolumeM: number): string => {
    if (currency === 'UZS') {
      const uzsTrillion = ((usdVolumeM * 12850) / 1000).toFixed(1);
      return `${uzsTrillion} trln so'm`;
    } else if (currency === 'EUR') {
      const eurM = (usdVolumeM * 0.92).toFixed(1);
      return `€${eurM}M`;
    }
    return `$${usdVolumeM.toFixed(1)}M`;
  };

  return (
    <AppSettingsContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        setCurrency,
        formatPrice,
        formatVolumeUSD,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
