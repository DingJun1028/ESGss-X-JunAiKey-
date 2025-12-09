
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, GraduationCap, Search, Settings, Activity, Sun, Bell, Languages,
  Target, UserCheck, Leaf, FileText, Network, Bot, Calculator, ShieldCheck, Coins, Trophy, X, Zap, Star, Home, Radio, Command, Briefcase, Stethoscope, Wrench, Crown, BookOpen, Layers, Heart, Info, Megaphone, Calendar, Lock, Code, Database
} from 'lucide-react';
import { View, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { CommandPalette } from './CommandPalette';
import { AiAssistant } from './AiAssistant';
import { SubscriptionModal } from './SubscriptionModal';
import { OnboardingTour } from './OnboardingTour';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
  children: React.ReactNode;
}

// Updated Logo: Rounded corners with "Embossed Inward" effect
export const LogoIcon = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] border border-white/5 bg-black/20 ${className}`}>
    <img 
      src="https://thumbs4.imagebam.com/7f/89/20/ME18KXN8_t.png" 
      alt="ESGss Logo" 
      className="w-full h-full object-cover opacity-90"
    />
    {/* Inner shadow overlay for stronger emboss effect */}
    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] pointer-events-none" />
  </div>
);

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, icon, label, highlight }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden
      ${active 
        ? 'bg-celestial-purple text-white shadow-lg shadow-purple-500/25' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
      }
      ${highlight ? 'border border-celestial-gold/30' : ''}
    `}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-20" />
    )}
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className={`font-medium text-sm hidden lg:block ${active ? 'font-bold tracking-wide' : ''}`}>
      {label}
    </span>
    {highlight && (
        <span className="hidden lg:block absolute right-2 w-2 h-2 rounded-full bg-celestial-gold animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
    )}
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, language, onToggleLanguage, children }) => {
  const t = TRANSLATIONS[language];
  const { userName, userRole, xp, level, goodwillBalance, latestEvent, totalScore, tier } = useCompany();
  const { notifications, clearNotifications } = useToast();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState<'alerts' | 'events' | 'news'>('alerts');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const currentLevelBaseXp = (level - 1) * 1000;
  const xpProgress = Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / 1000) * 100));
  const isCritical = totalScore < 60;
  const isPro = tier !== 'Free';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-scroll to top when view changes
  useEffect(() => {
    if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  // MECE Organization of Navigation with Card Game Promoted
  const navGroups = [
      {
          title: language === 'zh-TW' ? '核心生態 (Core Ecosystem)' : 'Core Ecosystem',
          items: [
              { id: View.MY_ESG, icon: Home, label: t.nav.myEsg },
              { id: View.CARD_GAME, icon: Trophy, label: t.nav.cardGame, highlight: true }, // Moved to top, renamed
              { id: View.DASHBOARD, icon: LayoutDashboard, label: t.nav.dashboard },
              { id: View.YANG_BO, icon: Crown, label: t.nav.yangBo },
          ]
      },
      {
          title: language === 'zh-TW' ? '智慧運營 (Operations)' : 'Operations',
          items: [
              { id: View.REPORT, icon: FileText, label: t.nav.report },
              { id: View.STRATEGY, icon: Target, label: t.nav.strategy },
              { id: View.CARBON, icon: Leaf, label: t.nav.carbon },
              { id: View.INTEGRATION, icon: Network, label: t.nav.integration },
              { id: View.UNIVERSAL_TOOLS, icon: Wrench, label: t.nav.universalTools },
          ]
      },
      {
          title: language === 'zh-TW' ? '社群與使命 (Community)' : 'Community & Mission',
          items: [
              { id: View.FUNDRAISING, icon: Heart, label: t.nav.fundraising }, // New
              { id: View.ACADEMY, icon: GraduationCap, label: t.nav.academy },
              { id: View.GOODWILL, icon: Coins, label: t.nav.goodwill },
              { id: View.ABOUT_US, icon: Info, label: t.nav.aboutUs }, // New
          ]
      },
      {
          title: language === 'zh-TW' ? '系統基石 (System)' : 'System',
          items: [
              { id: View.UNIVERSAL_BACKEND, icon: Database, label: t.nav.universalBackend }, // New: Highest Priority System Tool
              { id: View.RESEARCH_HUB, icon: Search, label: t.nav.researchHub },
              { id: View.API_ZONE, icon: Code, label: language === 'zh-TW' ? 'API 專區' : 'API Zone' }, // New
              { id: View.SETTINGS, icon: Settings, label: t.nav.settings },
              { id: View.DIAGNOSTICS, icon: Activity, label: t.nav.diagnostics },
          ]
      }
  ];

  // Flatten all items for mobile scrolling menu
  const allNavItems = navGroups.flatMap(group => group.items);

  return (
    <div className={`min-h-screen bg-celestial-900 text-gray-200 relative overflow-hidden font-sans selection:bg-celestial-emerald/30 transition-colors duration-1000 ${isCritical ? 'border-4 border-red-500/20' : ''}`}>
      
      {/* Background Ambience: Aurora Flow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />
        <div 
            className={`absolute top-[-20%] left-[-20%] w-[120%] h-[80%] rounded-[100%] blur-[120px] opacity-30 animate-blob mix-blend-screen transform -rotate-12 ${isCritical ? 'bg-red-900' : 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900'}`} 
            style={{ willChange: 'transform' }}
        />
        <div 
            className={`absolute top-[10%] right-[-20%] w-[120%] h-[70%] rounded-[100%] blur-[100px] opacity-20 animate-blob animation-delay-2000 mix-blend-screen transform rotate-12 ${isCritical ? 'bg-orange-900' : 'bg-gradient-to-l from-emerald-900 via-teal-900 to-cyan-900'}`} 
            style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-150 contrast-200" />
      </div>

      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onNavigate={onNavigate} 
        language={language}
        toggleLanguage={onToggleLanguage}
      />

      <SubscriptionModal 
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        language={language}
      />

      <OnboardingTour language={language} />

      <div className="relative z-10 flex h-screen">
        
        <aside id="sidebar-nav" className="w-20 lg:w-64 hidden md:flex flex-col border-r border-white/5 bg-slate-900/50 backdrop-blur-xl shrink-0">
          {/* Immersive Sidebar Branding */}
          <div className="h-28 shrink-0 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5 gap-3 relative overflow-hidden group cursor-pointer" onClick={() => onNavigate(View.MY_ESG)}>
            <div className="absolute top-1/2 left-8 w-12 h-12 bg-celestial-gold/20 blur-[20px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
               <LogoIcon className="w-12 h-12 shrink-0 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="flex flex-col relative z-10 hidden lg:flex">
                <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                  ESGss
                </span>
                <span className="font-bold text-[10px] text-celestial-emerald tracking-[0.2em] uppercase glow-text-emerald">
                  JunAiKey
                </span>
            </div>
          </div>

          {/* Navigation Items (Grouped MECE) */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 custom-scrollbar">
            {navGroups.map((group, idx) => (
                <div key={idx}>
                    <div className="text-[10px] uppercase text-gray-500 px-4 mb-2 hidden lg:block font-semibold tracking-wider opacity-70">
                        {group.title}
                    </div>
                    <div className="space-y-1">
                        {group.items.map(item => (
                            <NavItem 
                                key={item.id}
                                active={currentView === item.id} 
                                onClick={() => onNavigate(item.id)} 
                                icon={<item.icon className={`w-5 h-5 ${item.highlight ? 'text-celestial-gold animate-pulse' : ''}`} />} 
                                label={item.label} 
                                highlight={item.highlight}
                            />
                        ))}
                    </div>
                </div>
            ))}
          </nav>

          {/* Subscription CTA in Sidebar */}
          {!isPro && (
              <div className="shrink-0 p-4 border-t border-white/5">
                  {/* Expanded View (Desktop) */}
                  <div className="hidden lg:block p-4 rounded-xl bg-gradient-to-br from-celestial-gold/10 to-amber-600/10 border border-celestial-gold/30 text-center">
                      <div className="text-xs font-bold text-celestial-gold mb-2">Upgrade to Pro</div>
                      <p className="text-[10px] text-gray-400 mb-3">Unlock Reasoning AI & Reports.</p>
                      <button 
                        onClick={() => setIsSubModalOpen(true)}
                        className="w-full py-1.5 bg-celestial-gold text-black text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors"
                      >
                          Upgrade
                      </button>
                  </div>

                  {/* Collapsed View (Tablet) - Lock Icon Only */}
                  <button 
                    onClick={() => setIsSubModalOpen(true)}
                    className="lg:hidden w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-celestial-gold/10 to-amber-600/10 border border-celestial-gold/30 text-celestial-gold hover:bg-celestial-gold hover:text-black transition-all group"
                    title="Upgrade to Pro"
                  >
                      <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
              </div>
          )}
        </aside>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-sm shrink-0 relative z-30">
            <div className="flex items-center gap-4 flex-1">
                <div className="md:hidden flex items-center gap-2 relative">
                     {/* Mobile Header Glow */}
                     <div className="absolute inset-0 bg-celestial-gold/20 blur-xl rounded-full pointer-events-none" />
                     <div className="w-10 h-10 flex items-center justify-center relative z-10">
                        <LogoIcon className="w-full h-full drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                     </div>
                </div>
                
                <div className="hidden lg:flex items-center gap-2 text-xs overflow-hidden max-w-lg bg-black/20 rounded-full px-3 py-1 border border-white/5">
                    <Radio className="w-3 h-3 text-red-400 animate-pulse shrink-0" />
                    <span className="text-gray-500 font-bold shrink-0">LIVE FEED:</span>
                    <div className="animate-[slide-left_15s_linear_infinite] whitespace-nowrap text-gray-300">
                        {latestEvent || "System Normal. Monitoring global sustainability indices..."}
                    </div>
                </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
                <button 
                    onClick={() => setIsCommandOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 text-sm transition-all group"
                >
                    <Search className="w-4 h-4 group-hover:text-white" />
                    <span className="hidden lg:inline">Search...</span>
                    <kbd className="hidden lg:inline-block ml-2 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-500">⌘K</kbd>
                </button>

                <div className="flex items-center gap-3 bg-slate-900/60 border border-white/10 rounded-full pr-4 pl-1 py-1 group hover:border-white/20 transition-all cursor-pointer" onClick={() => onNavigate(View.CARD_GAME)} title="Click to view full profile">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-celestial-purple to-blue-600 flex items-center justify-center font-bold text-xs text-white border-2 border-slate-900 shadow-lg">
                        {level}
                    </div>
                    <div className="flex flex-col w-32">
                        <div className="flex justify-between text-[10px] text-gray-300 font-medium mb-1">
                            <span>Level {level}</span>
                            <span>{Math.floor(xpProgress)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-celestial-purple to-blue-400 relative"
                                style={{ width: `${xpProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 rounded-full px-3 py-1.5 hover:bg-celestial-gold/10 hover:border-celestial-gold/30 transition-all cursor-pointer group" onClick={() => onNavigate(View.GOODWILL)}>
                    <Coins className="w-4 h-4 text-celestial-gold group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-bold text-celestial-gold font-mono">{goodwillBalance.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 ml-4">
                <button 
                  onClick={onToggleLanguage}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm text-gray-300"
                >
                  <Languages className="w-4 h-4" />
                  <span>{language === 'zh-TW' ? 'EN' : '繁中'}</span>
                </button>

                {/* Enhanced Notification Center */}
                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`relative transition-colors ${isNotificationsOpen ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-celestial-gold animate-pulse"></span>
                        )}
                    </button>
                    
                    {isNotificationsOpen && (
                        <div className="fixed inset-x-4 top-20 md:absolute md:right-0 md:top-full md:inset-auto md:w-96 md:mt-4 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50 ring-1 ring-white/10">
                            {/* Tab Header */}
                            <div className="flex border-b border-white/10 bg-white/5">
                                {[
                                    { id: 'alerts', label: language === 'zh-TW' ? '我的通知' : 'My Alerts', icon: Bell },
                                    { id: 'events', label: language === 'zh-TW' ? '最新活動' : 'Latest Events', icon: Calendar },
                                    { id: 'news', label: language === 'zh-TW' ? '最新消息' : 'Latest News', icon: Megaphone }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveNotificationTab(tab.id as any)}
                                        className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 transition-colors relative
                                            ${activeNotificationTab === tab.id ? 'text-white bg-white/5' : 'text-gray-500 hover:text-gray-300'}
                                        `}
                                    >
                                        <tab.icon className="w-3 h-3" />
                                        {tab.label}
                                        {activeNotificationTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-celestial-gold" />}
                                    </button>
                                ))}
                                <button onClick={() => setIsNotificationsOpen(false)} className="px-3 hover:text-white text-gray-500"><X className="w-4 h-4" /></button>
                            </div>

                            <div className="max-h-[350px] overflow-y-auto custom-scrollbar bg-slate-900/90">
                                {activeNotificationTab === 'alerts' && (
                                    <>
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 text-xs">No notifications</div>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`text-xs font-bold flex items-center gap-1 ${n.type === 'success' ? 'text-emerald-400' : n.type === 'warning' ? 'text-amber-400' : n.type === 'error' ? 'text-red-400' : n.type === 'reward' ? 'text-celestial-gold' : 'text-blue-400'}`}>
                                                            {n.type === 'reward' && <Star className="w-3 h-3 fill-current" />}
                                                            {n.title || 'System'}
                                                        </span>
                                                        <span className="text-[9px] text-gray-600">Just now</span>
                                                    </div>
                                                    <p className="text-xs text-gray-300 group-hover:text-white transition-colors leading-relaxed">{n.message}</p>
                                                </div>
                                            ))
                                        )}
                                        {notifications.length > 0 && (
                                            <div className="p-2 bg-white/5 text-center">
                                                <button onClick={clearNotifications} className="text-xs text-gray-400 hover:text-white transition-colors">Clear all</button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeNotificationTab === 'events' && (
                                    <div className="divide-y divide-white/5">
                                        <div className="p-4 hover:bg-white/5 cursor-pointer">
                                            <div className="text-xs font-bold text-celestial-emerald mb-1">Coming Soon</div>
                                            <h4 className="text-sm font-bold text-white">Global Net Zero Summit 2025</h4>
                                            <p className="text-xs text-gray-400 mt-1">Join industry leaders in Taipei. Early bird tickets available.</p>
                                        </div>
                                        <div className="p-4 hover:bg-white/5 cursor-pointer">
                                            <div className="text-xs font-bold text-celestial-blue mb-1">Webinar</div>
                                            <h4 className="text-sm font-bold text-white">How to use AI for Scope 3</h4>
                                            <p className="text-xs text-gray-400 mt-1">Speaker: Dr. Yang. Tomorrow, 2 PM.</p>
                                        </div>
                                    </div>
                                )}

                                {activeNotificationTab === 'news' && (
                                    <div className="divide-y divide-white/5">
                                        <div className="p-4 hover:bg-white/5 cursor-pointer">
                                            <h4 className="text-sm font-bold text-white">EU CBAM Regulation Update</h4>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">New reporting requirements for aluminum and steel sectors effective next month.</p>
                                        </div>
                                        <div className="p-4 hover:bg-white/5 cursor-pointer">
                                            <h4 className="text-sm font-bold text-white">ESG Investment Trends Q3</h4>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">Capital flows shifting towards nature-positive assets according to latest reports.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-white flex items-center justify-end gap-2">
                            {userName}
                            {isPro && <span className="px-1.5 py-0.5 rounded bg-celestial-gold text-black text-[9px] font-bold">PRO</span>}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{userRole}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/20 overflow-hidden cursor-pointer hover:ring-2 hover:ring-celestial-purple transition-all" onClick={() => onNavigate(View.SETTINGS)}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
          </header>

          <main ref={mainRef} className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
            <div className="max-w-7xl mx-auto pb-24">
                {children}
            </div>
          </main>
        </div>

        {/* Mobile Nav - Flat List */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-40">
            <div className="flex items-center overflow-x-auto h-full px-4 gap-6 no-scrollbar snap-x">
                {allNavItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center justify-center min-w-[3rem] snap-center ${currentView === item.id ? 'text-celestial-emerald' : 'text-gray-500'}`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[9px] whitespace-nowrap">{item.label.split(' ')[0]}</span>
                    </button>
                ))}
            </div>
        </div>

      </div>
      
      {/* AI Assistant injected into Layout to always be available, now with context */}
      <AiAssistant language={language} onNavigate={onNavigate} currentView={currentView} />
    </div>
  );
};
