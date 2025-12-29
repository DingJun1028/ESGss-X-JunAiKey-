import React, { useState, useEffect } from 'react';
import { View, Language } from './types';

// --- 靜態導入所有組件 ---
import { Layout } from './components/Layout';
import { LoginScreen } from './components/LoginScreen';
import { MyEsg } from './components/MyEsg';
import { ToastProvider } from './contexts/ToastContext';
import { CompanyProvider } from './components/providers/CompanyProvider';
import { UniversalAgentProvider } from './contexts/UniversalAgentContext';
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { OnboardingSystem } from './components/OnboardingSystem';
import { NeuralNexus } from './components/NeuralNexus';

// 分頁組件
import { Dashboard } from './components/Dashboard';
import { ResearchHub } from './components/ResearchHub';
import { Academy } from './components/Academy';
import { Diagnostics } from './components/Diagnostics';
import { StrategyHub } from './components/StrategyHub';
import { ReportGen } from './components/ReportGen';
import { CarbonAsset } from './components/CarbonAsset';
import { TalentPassport } from './components/TalentPassport';
import { IntegrationHub } from './components/IntegrationHub';
import { CultureBot } from './components/CultureBot';
import { FinanceSim } from './components/FinanceSim';
import { AuditTrail } from './components/AuditTrail';
import { GoodwillCoin } from './components/GoodwillCoin';
import { UniversalRestoration, CardGameArenaView, Gamification } from './components/Gamification';
import { Settings } from './components/Settings';
import { YangBoZone } from './components/YangBoZone';
import { AdanZone } from './components/AdanZone';
import { BusinessIntel } from './components/BusinessIntel';
import { HealthCheck } from './components/HealthCheck';
import { UniversalTools } from './components/UniversalTools';
import { UniversalSystem } from './components/UniversalSystem';
import { ThinkTank } from './components/ThinkTank';
import { PartnerPortal } from './components/PartnerPortal';
import { AboutUs } from './components/AboutUs';
import { ApiZone } from './components/ApiZone';
import UniversalBackend from './components/UniversalBackend';
import { AlumniZone } from './components/AlumniZone';
import { GoodwillLibrary } from './components/GoodwillLibrary';
import { UserJournal } from './components/UserJournal';
import { AgentArena } from './components/AgentArena';
import { AgentTraining } from './components/AgentTraining';
import { ProxyMarketplace } from './components/ProxyMarketplace';
import { DigitalSoulForge } from './components/DigitalSoulForge';
import { RegenerativeModel } from './components/RegenerativeModel';
import { PersonalVault } from './components/PersonalVault';
import { AffiliateZone } from './components/AffiliateNexus'; // Fix: 應為 AffiliateZone 但依照結構可直接匯入

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.MY_ESG);
  const [language, setLanguage] = useState<Language>('zh-TW');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleToggleLanguage = () => {
    const newLang = language === 'zh-TW' ? 'en-US' : 'zh-TW';
    setLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };
  
  return (
    <ToastProvider>
      <UniversalAgentProvider>
        {!isLoggedIn ? (
          <ErrorBoundary>
             <LoginScreen onLogin={() => setIsLoggedIn(true)} language={language} />
          </ErrorBoundary>
        ) : (
          <CompanyProvider>
            <OnboardingSystem />
            <NeuralNexus />
            <Layout 
              currentView={currentView} 
              onNavigate={setCurrentView}
              language={language}
              onToggleLanguage={handleToggleLanguage}
            >
              <ErrorBoundary>
                {(() => {
                  switch (currentView) {
                    case View.MY_ESG: return <MyEsg language={language} onNavigate={setCurrentView} />;
                    case View.VAULT: return <PersonalVault language={language} />;
                    case View.DASHBOARD: return <Dashboard language={language} />;
                    case View.RESTORATION: return <UniversalRestoration language={language} />;
                    case View.CARD_GAME_ARENA: return <CardGameArenaView language={language} />;
                    case View.USER_JOURNAL: return <UserJournal language={language} />;
                    case View.PARTNER_PORTAL: return <PartnerPortal language={language} />;
                    case View.ABOUT_US: return <AboutUs language={language} />;
                    case View.API_ZONE: return <ApiZone language={language} />;
                    case View.UNIVERSAL_BACKEND: return <UniversalBackend language={language} />;
                    case View.RESEARCH_HUB: return <ResearchHub language={language} />;
                    case View.ACADEMY: return <Academy language={language} />;
                    case View.DIAGNOSTICS: return <Diagnostics language={language} />;
                    case View.STRATEGY: return <StrategyHub language={language} onNavigate={setCurrentView} />;
                    case View.REPORT: return <ReportGen language={language} />;
                    case View.CARBON: return <CarbonAsset language={language} />;
                    case View.TALENT: return <TalentPassport language={language} />;
                    case View.INTEGRATION: return <IntegrationHub language={language} />;
                    case View.CULTURE: return <CultureBot language={language} />;
                    case View.FINANCE: return <FinanceSim language={language} />;
                    case View.AUDIT: return <AuditTrail language={language} />;
                    case View.GOODWILL: return <GoodwillCoin language={language} />;
                    case View.SETTINGS: return <Settings language={language} />;
                    case View.YANG_BO: return <YangBoZone language={language} />;
                    case View.ADAN_ZONE: return <AdanZone language={language} />;
                    case View.BUSINESS_INTEL: return <BusinessIntel language={language} />;
                    case View.HEALTH_CHECK: return <HealthCheck language={language} onNavigate={setCurrentView} />;
                    case View.UNIVERSAL_TOOLS: return <UniversalTools language={language} />;
                    case View.UNIVERSAL_SYSTEM: return <UniversalSystem language={language} />;
                    case View.THINK_TANK: return <ThinkTank language={language} />;
                    case View.ALUMNI_ZONE: return <AlumniZone language={language} />;
                    case View.LIBRARY: return <GoodwillLibrary language={language} onNavigate={setCurrentView} />;
                    case View.SOUL_FORGE: return <DigitalSoulForge language={language} />;
                    case View.AGENT_ARENA: return <AgentArena language={language} onNavigate={setCurrentView} />;
                    case View.AGENT_TRAINING: return <AgentTraining language={language} />;
                    case View.PROXY_MARKET: return <ProxyMarketplace language={language} />;
                    case View.PALACE: return <Gamification language={language} />;
                    case View.REGENERATIVE: return <RegenerativeModel language={language} />;
                    case View.AFFILIATE: return <AffiliateZone language={language} />;
                    default: return <MyEsg language={language} onNavigate={setCurrentView} />;
                  }
                })()}
              </ErrorBoundary>
            </Layout>
          </CompanyProvider>
        )}
        <ToastContainer />
      </UniversalAgentProvider>
    </ToastProvider>
  );
};

export default App;
