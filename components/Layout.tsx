import React, { useState, useEffect, useRef } from 'react';
import { View, Language } from '../types';
import { 
  Home, Layers, Bot, Leaf, FileText, Network, BookOpen, GraduationCap, Crown, Hammer, Coins, Library,
  ChevronLeft, ChevronRight, Zap, ShieldCheck, Command, Info, User, Star, Heart, Target, TrendingUp,
  Globe, Briefcase, Stethoscope, Database, Activity, Trophy, Shield, Fingerprint, Sparkles, Box, Users, Archive, Menu, Share2, Compass, X, Gem, ArrowRight
} from 'lucide-react';
import { AiAssistant } from './AiAssistant';
import { CommandPalette } from './CommandPalette';
import { OnboardingTour } from './OnboardingTour';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
  language: Language;
  onToggleLanguage: () => void;
}

export const LogoIcon = ({ className, id }: { className?: string; id?: string }) => (
  <div id={id} className={`flex items-center justify-center overflow-hidden rounded-md transition-all duration-500 ${className}`}>
    <img 
        src="https://thumbs4.imagebam.com/a0/c1/da/ME18W0T0_t.PNG" 
        alt="ESGss JAK Official Logo" 
        className="w-full h-full object-contain"
    />
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children, language, onToggleLanguage }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showVaultBrief, setShowVaultBrief] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);
  
  const { userName, xp, level, goodwillBalance, activeTitle } = useCompany();
  const { soul, forgedSouls, cardInventory } = useUniversalAgent();
  const isZh = language === 'zh-TW';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vaultRef.current && !vaultRef.current.contains(event.target as Node)) {
        setShowVaultBrief(false);
      }
    };
    if (showVaultBrief) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVaultBrief]);

  const navSectors = [
    { title: 'CMD', items: [
      { id: View.MY_ESG, icon: Home, label: isZh ? '北極星' : 'Cockpit' },
      { id: View.BUSINESS_INTEL, icon: Globe, label: isZh ? 'AMICE' : 'AMICE' },
      { id: View.STRATEGY, icon: Layers, label: isZh ? '顧問' : 'Advisory' },
      { id: View.THINK_TANK, icon: Archive, label: isZh ? '智庫' : 'Tank' },
    ]},
    { title: 'ECO', items: [
      { id: View.PARTNER_PORTAL, icon: Compass, label: isZh ? '生態' : 'Ecosystem' },
      { id: View.AFFILIATE, icon: Share2, label: isZh ? '聯盟' : 'Affiliate' },
      { id: View.ACADEMY, icon: GraduationCap, label: isZh ? '學院' : 'Academy' },
    ]},
    { title: 'SYS', items: [
      { id: View.REPORT, icon: FileText, label: isZh ? '報告' : 'Report' },
      { id: View.YANG_BO, icon: Crown, label: isZh ? '楊博' : 'CEO' },
      { id: View.HEALTH_CHECK, icon: Stethoscope, label: isZh ? '健檢' : 'Health' },
    ]}
  ];

  const allNavItems = navSectors.flatMap(s => s.items);

  const scrollMenu = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amt = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#020617] text-white overflow-hidden select-none">
        {/* PC Sidebar */}
        {!isMobile && (
          <aside className={`flex flex-col flex-shrink-0 transition-all duration-500 border-r border-white/5 bg-slate-950/95 backdrop-blur-3xl z-[160] ${isSidebarCollapsed ? 'w-[52px]' : 'w-[180px]'}`}>
              <div className={`flex items-center h-[var(--header-h)] shrink-0 ${isSidebarCollapsed ? 'justify-center' : 'px-4 gap-3'}`}>
                  <LogoIcon id="system-logo-pc" className="w-7 h-7" />
                  {!isSidebarCollapsed && <span className="font-black text-[14px] tracking-tighter uppercase whitespace-nowrap">ESGss <span className="text-celestial-gold">JAK</span></span>}
              </div>
              <nav className="flex-1 overflow-y-auto no-scrollbar py-4">
                  {navSectors.map((sector, idx) => (
                      <div key={idx} className="mb-6">
                          {!isSidebarCollapsed && <div className="px-4 mb-2 text-[9px] font-black text-gray-600 tracking-[0.3em] uppercase">{sector.title}</div>}
                          {sector.items.map(item => (
                              <button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full flex items-center transition-all duration-300 relative group ${isSidebarCollapsed ? 'justify-center py-3' : 'px-4 py-2.5 gap-4'} ${currentView === item.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                  {currentView === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-celestial-gold shadow-[0_0_15px_#fbbf24]" />}
                                  <item.icon className={`shrink-0 w-5 h-5 ${currentView === item.id ? 'text-celestial-gold scale-110' : 'group-hover:scale-110'}`} />
                                  {!isSidebarCollapsed && <span className={`text-[13px] font-bold truncate ${currentView === item.id ? 'text-white' : ''}`}>{item.label}</span>}
                              </button>
                          ))}
                      </div>
                  ))}
              </nav>
              <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="py-4 flex justify-center border-t border-white/5 text-gray-700 hover:text-white transition-colors">
                  <ChevronRight className={`w-5 h-5 transition-transform duration-500 ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
              </button>
          </aside>
        )}

        <main className="flex-1 flex flex-col min-w-0 h-screen relative">
            <header className="h-[var(--header-h)] border-b border-white/5 flex items-center justify-between px-4 bg-slate-900/40 backdrop-blur-2xl shrink-0 z-[150]">
                <div className="flex items-center gap-3">
                    {isMobile && <LogoIcon id="system-logo-mobile" className="w-6 h-6" />}
                    <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                        <Zap className="w-3 h-3 text-celestial-gold animate-pulse" />
                        <span className="text-[9px] font-black text-white tracking-[0.2em] uppercase">JAK_v16</span>
                    </div>
                    {!isMobile && (
                      <button 
                        onClick={() => onNavigate(View.VAULT)} 
                        className="ml-2 flex items-center gap-2 px-3 py-1 bg-celestial-gold/10 border border-celestial-gold/20 rounded-lg text-celestial-gold hover:bg-celestial-gold hover:text-black transition-all group shadow-xl"
                      >
                        <Crown className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-wider">{isZh ? '個人寶庫' : 'Vault'}</span>
                      </button>
                    )}
                </div>

                <div className="hidden xl:flex items-center gap-8">
                    {[
                        { label: 'GWC', val: goodwillBalance, icon: Coins, color: 'text-celestial-gold' },
                        { label: 'LEVEL', val: level, icon: Star, color: 'text-emerald-500' }
                    ].map((hud, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <hud.icon className={`w-3 h-3 ${hud.color}`} /> 
                            <span className="text-[11px] font-mono font-bold text-white uppercase tracking-tighter">{hud.label}: {hud.val}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 items-center relative">
                    <button onClick={() => setIsCommandOpen(true)} className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500 hover:text-white transition-all"><Command className="w-4 h-4" /></button>
                    <div 
                      className={`w-8 h-8 rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:border-celestial-gold transition-all shadow-xl relative ${showVaultBrief ? 'ring-2 ring-celestial-gold scale-110' : ''}`} 
                      onClick={() => setShowVaultBrief(!showVaultBrief)}
                    >
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=masculine_${xp}`} className="w-full h-full object-cover" alt="Avatar" />
                        {showVaultBrief && <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in"><X className="w-3 h-3 text-white" /></div>}
                    </div>

                    {/* Floating Vault Briefing Menu */}
                    {showVaultBrief && (
                      <div 
                        ref={vaultRef}
                        className="absolute right-0 top-12 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-[250] overflow-hidden animate-slide-up backdrop-blur-3xl ring-1 ring-white/10"
                      >
                        <div className="p-5 bg-gradient-to-br from-white/10 to-transparent border-b border-white/5 flex flex-col items-center text-center">
                          <div className="w-14 h-14 rounded-full border-2 border-celestial-gold p-0.5 mb-2 shadow-2xl relative">
                            <div className="absolute inset-0 bg-celestial-gold/20 blur-xl animate-pulse rounded-full" />
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=masculine_${xp}`} className="w-full h-full rounded-full bg-slate-900 relative z-10" alt="" />
                          </div>
                          <div className="zh-main text-base text-white">{userName}</div>
                          <div className="text-[10px] font-black text-celestial-gold uppercase tracking-widest mt-0.5">{activeTitle?.text || 'Novice Architect'}</div>
                        </div>
                        
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                             <div className="p-3 bg-black/60 rounded-xl border border-white/5 flex flex-col items-center">
                               <Coins className="w-4 h-4 text-celestial-gold mb-1" />
                               <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Balance</span>
                               <span className="text-sm font-mono font-bold text-white">{goodwillBalance}</span>
                             </div>
                             <div className="p-3 bg-black/60 rounded-xl border border-white/5 flex flex-col items-center">
                               <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
                               <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Level</span>
                               <span className="text-sm font-mono font-bold text-white">{level}</span>
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase text-gray-600 tracking-widest px-1">
                              <span>Asset Inventory</span>
                              <span className="text-white">Active</span>
                            </div>
                            <div className="flex gap-1">
                               <div className="flex-1 p-2 bg-white/5 rounded-lg flex items-center justify-center gap-2 border border-white/5 hover:bg-white/10 transition-colors">
                                  <Gem className="w-3 h-3 text-purple-400" />
                                  <span className="text-[10px] text-white font-bold">{forgedSouls.length}</span>
                               </div>
                               <div className="flex-1 p-2 bg-white/5 rounded-lg flex items-center justify-center gap-2 border border-white/5 hover:bg-white/10 transition-colors">
                                  <Box className="w-3 h-3 text-blue-400" />
                                  <span className="text-[10px] text-white font-bold">{cardInventory.length}</span>
                               </div>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => { setShowVaultBrief(false); onNavigate(View.VAULT); }}
                          className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-celestial-gold transition-all"
                        >
                          {isZh ? '進入個人寶庫' : 'OPEN VAULT'} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-hidden relative bg-black main-content-area">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.8)_0%,rgba(2,6,23,1)_100%)] pointer-events-none" />
                <div className="relative z-10 p-2 lg:p-4 min-h-full">
                    {children}
                </div>
            </div>

            {isMobile && (
              <div className="fixed bottom-4 left-4 right-4 z-[200] flex items-center gap-2">
                <button onClick={() => scrollMenu('left')} className="p-3 glass-liquid rounded-2xl text-white active:scale-90 transition-transform"><ChevronLeft className="w-5 h-5"/></button>
                <div className="flex-1 glass-liquid rounded-[2rem] overflow-hidden p-1 flex items-center relative">
                  <div ref={scrollRef} className="flex-1 flex overflow-x-auto no-scrollbar gap-2 px-2 scroll-smooth">
                    {allNavItems.map(item => (
                      <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex flex-col items-center justify-center min-w-[72px] h-16 rounded-2xl transition-all ${currentView === item.id ? 'bg-white/20 text-celestial-gold shadow-lg' : 'text-gray-400'}`}>
                        <item.icon className="w-5 h-5 mb-1" />
                        <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => scrollMenu('right')} className="p-3 glass-liquid rounded-2xl text-white active:scale-90 transition-transform"><ChevronRight className="w-5 h-5"/></button>
              </div>
            )}

            {!isMobile && (
              <footer className="h-[var(--footer-h)] border-t border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-[50]">
                  <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-3">
                      <span>KERNEL_OK</span>
                      <div className="w-px h-2 bg-white/10" />
                      <span>ORCHESTRATOR_ACTIVE: {currentView}</span>
                  </div>
                  <div className="text-[9px] font-mono text-gray-700 uppercase">© 2025 JAK_V16_RWD</div>
              </footer>
            )}
        </main>

        <AiAssistant language={language} onNavigate={onNavigate} currentView={currentView} isMobile={isMobile} />
        <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onNavigate={onNavigate} language={language} toggleLanguage={onToggleLanguage} />
        <OnboardingTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} language={language} />
    </div>
  );
};