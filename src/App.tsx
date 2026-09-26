/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ExportCatalog } from './components/ExportCatalog';
import { ImportAnalytics } from './components/ImportAnalytics';
import { LogisticsRoadmap } from './components/LogisticsRoadmap';
import { AISmartSearchBar } from './components/AISmartSearchBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { FloatingAIChat } from './components/FloatingAIChat';
import { OnboardingModal } from './components/OnboardingModal';
import { FinancialCalculatorModal } from './components/FinancialCalculatorModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { TradeAdsModal } from './components/TradeAdsModal';
import { DailyMarketAndRates } from './components/DailyMarketAndRates';
import { MainContactFooter } from './components/MainContactFooter';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { 
  INITIAL_EXPORT_PRODUCTS, 
  INITIAL_IMPORT_STATISTICS, 
  INITIAL_USER 
} from './data/tradeDatabase';
import { ExportProduct, ImportStatistic, UserProfile, NavSection } from './types/trade';
import tradezonaBg from './assets/images/tradezona_bg_1790312947166.jpg';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('export');
  
  // User state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('tradezone_user') || localStorage.getItem('tradezona_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Data states
  const [exportProducts] = useState<ExportProduct[]>(INITIAL_EXPORT_PRODUCTS);
  const [importStats] = useState<ImportStatistic[]>(INITIAL_IMPORT_STATISTICS);

  // Search filter across sections
  const [searchFilter, setSearchFilter] = useState('');

  // Modals and Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAdsOpen, setIsAdsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<ExportProduct | null>(null);
  
  // Chat direct prompt triggering
  const [chatPrompt, setChatPrompt] = useState<string | undefined>(undefined);

  // Save user profile on changes
  const handleSaveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('tradezone_user', JSON.stringify(updatedUser));
  };

  // Red Zone count
  const redZoneCount = importStats.filter((s) => s.isRedZone).length;

  // Actions from Export Catalog
  const handleConsultProduct = (product: ExportProduct, mode: 'calculator' | 'certificate' | 'market') => {
    if (mode === 'calculator') {
      const prompt = `10 tonna ${product.title} (TIF TN: ${product.hsCode}) mahsulotini eksport qilishda xarid, qadoqlash, transport va bojxona xarajatlari hamda kutilayotgan sof foydani to'liq hisoblab bering.`;
      setChatPrompt(prompt);
    } else if (mode === 'certificate') {
      const prompt = `${product.title} (TIF TN: ${product.hsCode}) mahsulotini ${product.targetCountries[0]}ga eksport qilish uchun qanday sertifikatlar (Fitosanitariya, ST-1, GlobalG.A.P.) talab etiladi va ularni olish qadamlari qanday?`;
      setChatPrompt(prompt);
    } else {
      setSelectedProductForDetail(product);
    }
  };

  // Action from Import Analytics
  const handleConsultSubstitution = (stat: ImportStatistic) => {
    const prompt = `"${stat.title}" (TIF TN: ${stat.hsCode}) importi keskin oshgani va Qizil Hududda ekani ma'lum bo'ldi. Ushbu mahsulotni O'zbekistonda mahalliy xomashyo asosida ishlab chiqarish bo'yicha ixcham biznes-reja, kerakli uskunalar va kutilayotgan o'zini oqlash muddatini tuzib bering.`;
    setChatPrompt(prompt);
  };

  // Action from Tech Imports inside Import Analytics
  const handleConsultTech = (tech: ImportStatistic, mode: 'calculator' | 'assembly' | 'customs') => {
    if (mode === 'calculator') {
      const prompt = `Xitoy/Vetnamdan 1,000 dona "${tech.title}" (TIF TN: ${tech.hsCode}) import qilishda transport, 12% QQS va jami bojxona xarajatlarini hisoblab bering.`;
      setChatPrompt(prompt);
    } else if (mode === 'assembly') {
      const prompt = `"${tech.title}" (TIF TN: ${tech.hsCode}) bo'yicha O'zbekistonda SKD (yirik uzelli) yig'uv liniyasini ochish, kerakli lokal komponentlar va davlat imtiyozlari haqida biznes tahlil bering.`;
      setChatPrompt(prompt);
    } else {
      const prompt = `"${tech.title}" (TIF TN: ${tech.hsCode}) uchun O'zbekistonga olib kirishdagi barcha sertifikatlar, UZIMEI va standartlashtirish talablari qanday?`;
      setChatPrompt(prompt);
    }
  };

  return (
    <AppSettingsProvider>
      <div 
        className="min-h-screen text-slate-100 flex flex-col font-sans pb-28 relative bg-slate-950"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.82), rgba(3, 7, 18, 0.88), rgba(2, 6, 23, 0.94)), url(${tradezonaBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Top Navbar */}
        <Navbar
          user={user}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          redZoneCount={redZoneCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          
          {/* AI-Powered Smart Product Search Bar */}
          <div className="pt-2 pb-2">
            <AISmartSearchBar
              onSelectProductForChat={(prompt) => setChatPrompt(prompt)}
              onFilterCatalog={(query) => setSearchFilter(query)}
            />
          </div>

          {/* Section View Switching */}
          {activeSection === 'export' && (
            <ExportCatalog
              products={exportProducts}
              onConsultProduct={handleConsultProduct}
              onOpenProductDetail={(prod) => setSelectedProductForDetail(prod)}
              externalSearchFilter={searchFilter}
            />
          )}

          {(activeSection === 'import' || (activeSection as any) === 'tech') && (
            <ImportAnalytics
              statistics={importStats}
              onConsultSubstitution={handleConsultSubstitution}
              onConsultTech={handleConsultTech}
              externalSearchFilter={searchFilter}
            />
          )}

          {activeSection === 'rates' && (
            <DailyMarketAndRates
              onSendToChat={(prompt) => setChatPrompt(prompt)}
              onOpenCalculatorWithRate={() => setIsCalculatorOpen(true)}
            />
          )}

          {activeSection === 'logistics' && (
            <LogisticsRoadmap
              onSendToChat={(prompt) => setChatPrompt(prompt)}
              externalSearchFilter={searchFilter}
            />
          )}

          {/* ASOSIY SAHIFA OXIRIGA BOG'LANISH VA ALOQA MA'LUMOTLARI */}
          <MainContactFooter
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenChatWithPrompt={(prompt) => setChatPrompt(prompt)}
          />

        </main>

        {/* Persistent Floating AI Chat (Docked at bottom) */}
        <FloatingAIChat
          user={user}
          initialPrompt={chatPrompt}
        />

        {/* Top Right Navigation Drawer Menu */}
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onOpenAds={() => setIsAdsOpen(true)}
          onOpenProfile={() => setIsOnboardingOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          user={user}
          redZoneCount={redZoneCount}
        />

        {/* Modals */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          currentUser={user}
          onSaveUser={handleSaveUser}
        />

        <TradeAdsModal
          isOpen={isAdsOpen}
          onClose={() => setIsAdsOpen(false)}
          user={user}
        />

        <FinancialCalculatorModal
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          onSendToChat={(prompt) => setChatPrompt(prompt)}
        />

        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onConsult={(product, mode) => handleConsultProduct(product, mode)}
        />

        <ArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <AboutModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />
      </div>
    </AppSettingsProvider>
  );
}
