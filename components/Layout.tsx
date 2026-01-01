
import React, { useState, useEffect } from 'react';
import { View, Language } from '../types';
import { 
  Home, Layers, Bot, FileText, Network, GraduationCap, 
  ChevronRight, Zap, Command, Star, Coins,
  Globe, Briefcase, Stethoscope, Database, Activity, 
  Settings, Binary, ListTodo, StickyNote, DollarSign, Map as MapIcon, Workflow, Share2, Compass, ArrowRight, ChevronUp, ChevronDown, Target,
  Crown, Wallet, Users
} from 'lucide-react';
import { AiAssistant } from './AiAssistant';
import { CommandPalette } from './CommandPalette';
import { useCompany } from './providers/CompanyProvider';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
  language: Language;
  onToggleLanguage: () => void;
}

export const LogoIcon = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center overflow-hidden rounded-md transition-all duration-500 ${className}`}>
    <img src="https://thumbs4.imagebam.com/a0/c1/da/ME18W0T0_t.PNG" alt="Logo" className="w-full h-full object-contain" />
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children, language, onToggleLanguage }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { userName, level, goodwillBalance } = useCompany();
  const isZh = language === 'zh-TW';

  const navSectors = [
    { title: 'CMD', items: [
      { id: View.MY_ESG, icon: Home, label: isZh ? '北極星' : 'Cockpit' },
      { id: View.HYPERCUBE_LAB, icon: Binary, label: isZh ? 'AI 實驗室' : 'AI Lab' },
      { id: View.FINANCE, icon: DollarSign, label: isZh ? '財務' : 'Finance' },
      { id: View.CARBON_WALLET, icon: Wallet, label: isZh ? '碳錢包' : 'Wallet' },
      { id: View.FLOWLU_INTEGRATION, icon: Network, label: isZh ? 'Flowlu 集成' : 'Flowlu' },
      { id: View.SUPPLIER_CRM, icon: Users, label: isZh ? '供應商 CRM' : 'Suppliers' },
      { id: View.BUSINESS_INTEL, icon: Globe, label: isZh ? 'AMICE' : 'AMICE' },
      { id: View.ECOSYSTEM_RADAR, icon: Target, label: isZh ? '生態雷達' : 'Radar' },
      { id: View.RESEARCH_HUB, icon: Database, label: isZh ? 'RAG' : 'RAG' },
      { id: View.UNIVERSAL_NOTES, icon: StickyNote, label: isZh ? '筆記' : 'Notes' },
      { id: View.AGENT_TASKS, icon: ListTodo, label: isZh ? '任務' : 'Tasks' },
    ]},
    { title: 'SYS', items: [
      { id: View.ACADEMY, icon: GraduationCap, label: isZh ? '學院' : 'Academy' },
      { id: View.HEALTH_CHECK, icon: Stethoscope, label: isZh ? '健檢' : 'Health' },
      { id: View.ADMIN_PANEL, icon: Crown, label: isZh ? '管理端' : 'Admin' },
      { id: View.SETTINGS, icon: Settings, label: isZh ? '設定' : 'Config' },
    ]}
  ];

  return (
    <div className="flex h-screen w-screen bg-[#020617] text-white overflow-hidden select-none font-sans">
        {/* 側邊導航 */}
        <aside className={`flex flex-col flex-shrink-0 transition-all duration-500 border-r border-white/5 bg-slate-950/80 backdrop-blur-3xl z-[160] ${isSidebarCollapsed ? 'w-[64px]' : 'w-[200px]'}`}>
            <div className="h-14 flex items-center justify-center border-b border-white/5">
                <LogoIcon className="w-7 h-7" />
            </div>
            <nav className="flex-1 overflow-y-auto no-scrollbar py-6">
                {navSectors.map((sector, idx) => (
                    <div key={idx} className="mb-6">
                        {sector.items.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => onNavigate(item.id)} 
                                className={`w-full flex items-center justify-center transition-all duration-300 py-3 relative group ${currentView === item.id ? 'text-white' : 'text-gray-600 hover:text-white'}`}
                            >
                                {currentView === item.id && <div className="absolute left-0 w-1 h-6 bg-celestial-gold shadow-[0_0_15px_#fbbf24]" />}
                                <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-celestial-gold' : 'group-hover:scale-110'}`} />
                                {!isSidebarCollapsed && <span className="ml-4 text-xs font-black uppercase truncate tracking-widest">{item.label}</span>}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>
            <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="h-14 border-t border-white/5 flex items-center justify-center text-gray-700 hover:text-white transition-all">
                <ChevronRight className={`w-4 h-4 transition-transform ${!isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
        </aside>

        {/* 主內容區 */}
        <main className="flex-1 flex flex-col min-w-0 bg-black relative">
            <header className="h-14 border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl flex items-center justify-between px-6 shrink-0 z-[150]">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-lg">
                        <Zap className="w-3.5 h-3.5 text-celestial-gold animate-pulse" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">v16.1_LIVE</span>
                    </div>
                    <div className="flex gap-6 font-mono">
                        <div className="flex flex-col">
                            <span className="text-[7px] text-gray-700 uppercase font-black tracking-tighter">Resonance_LV</span>
                            <span className="text-xs font-bold text-white">LV.{level}</span>
                        </div>
                        <div className="flex flex-col border-l border-white/5 pl-6">
                            <span className="text-[7px] text-gray-700 uppercase font-black tracking-tighter">Balance_GWC</span>
                            <span className="text-xs font-bold text-celestial-gold">{goodwillBalance.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => setIsCommandOpen(true)} className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-500 hover:text-white shadow-xl transition-all">
                        <Command className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 p-1 pr-3 bg-white/5 border border-white/10 rounded-xl">
                        <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${level}`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase">{userName}</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 relative overflow-hidden bg-[#020617]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,23,42,0.6)_0%,rgba(2,6,23,1)_100%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
                <div className="relative z-10 h-full p-6 flex flex-col">
                    <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col min-h-0">
                        {children}
                    </div>
                </div>
            </div>

            <footer className="h-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-[50]">
                <div className="flex items-center gap-4 text-[8px] font-mono text-gray-700 uppercase tracking-widest">
                    <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" /> KERNEL_STABLE</div>
                    <span>MARKET_SYNC: 1.2Hz</span>
                </div>
                <div className="text-[8px] font-mono text-gray-800 uppercase tracking-tighter">© 2026 JUNAIKEY_WEALTH_MANIFEST</div>
            </footer>
        </main>

        <AiAssistant language={language} onNavigate={onNavigate} currentView={currentView} />
        <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onNavigate={onNavigate} language={language} toggleLanguage={onToggleLanguage} />
    </div>
  );
};
