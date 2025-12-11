
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalCrystal } from './UniversalCrystal';
import { Sparkles, Activity, Layers, ArrowUpRight } from 'lucide-react';

interface GamificationProps {
  language: Language;
}

export const Gamification: React.FC<GamificationProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { crystals, restoreCrystal, collectCrystalFragment } = useCompany();
  const { addToast } = useToast();
  
  // Simulate finding a fragment on mount (for demo purposes)
  useEffect(() => {
      const timer = setTimeout(() => {
          const randomCrystal = crystals[Math.floor(Math.random() * crystals.length)];
          if (randomCrystal.state === 'Fragmented') {
              collectCrystalFragment(randomCrystal.id);
              addToast('reward', isZh ? `發現 ${randomCrystal.name} 的記憶碎片！` : `Found fragment for ${randomCrystal.name}!`, 'System Discovery');
          }
      }, 3000);
      return () => clearTimeout(timer);
  }, []);

  const handleRestore = (id: string, name: string) => {
      restoreCrystal(id);
      addToast('success', isZh ? `核心 ${name} 修復完成！功能已解鎖。` : `Core ${name} Restored! Features unlocked.`, 'System Restoration');
  };

  const handleCrystalClick = (id: string) => {
      // Placeholder for detailed crystal view
      addToast('info', isZh ? '正在分析晶體結構...' : 'Analyzing crystal lattice...', 'System');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 relative min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div>
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-celestial-gold to-white mb-2 flex items-center gap-3">
                    {isZh ? '萬能核心修復計畫' : 'Universal Core Restoration'}
                    <Sparkles className="w-8 h-8 text-celestial-gold animate-spin-slow" />
                </h2>
                <p className="text-gray-400 text-lg">
                    {isZh ? '收集記憶碎片，重塑 JunAiKey 的完美型態 (Zero Hallucination)。' : 'Collect fragments to restore JunAiKey to its perfect form.'}
                </p>
            </div>
            
            <div className="flex gap-4">
                <div className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{isZh ? '核心完整度' : 'Core Integrity'}</div>
                    <div className="text-xl font-bold text-emerald-400">
                        {Math.round(crystals.reduce((acc, c) => acc + c.integrity, 0) / crystals.length)}%
                    </div>
                </div>
                <div className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{isZh ? '修復進度' : 'Restoration'}</div>
                    <div className="text-xl font-bold text-celestial-gold">
                        {crystals.filter(c => c.state === 'Restored' || c.state === 'Perfected').length} / {crystals.length}
                    </div>
                </div>
            </div>
        </div>

        {/* The Monolith (Crystal Grid) */}
        <div className="relative">
            {/* Connecting Lines Background */}
            <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full opacity-20">
                    <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="80%" y1="50%" x2="50%" y2="50%" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
                    <circle cx="50%" cy="50%" r="100" fill="none" stroke="#fbbf24" strokeWidth="1" className="animate-pulse" />
                </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 justify-items-center relative z-10">
                {crystals.map((crystal, idx) => (
                    <div key={crystal.id} className={`transform transition-all duration-700 hover:-translate-y-4`} style={{ animationDelay: `${idx * 200}ms` }}>
                        <UniversalCrystal 
                            crystal={crystal}
                            onRestore={() => handleRestore(crystal.id, crystal.name)}
                            onClick={() => handleCrystalClick(crystal.id)}
                        />
                        {/* Connecting Line to next (visual only) */}
                        {idx < crystals.length - 1 && (
                            <div className="hidden xl:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/10" />
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Info Panel */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    {isZh ? '自他覺零幻覺機制 (Zero Hallucination)' : 'Self-Awareness Protocol'}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                    {isZh 
                        ? 'JunAiKey 核心具備自我監控能力。當「核心完整度」低於 70% 時，AI 輸出可能出現幻覺。系統將自動鎖定高風險功能，直到您透過「稽核 (Audit)」或「外部驗證 (Oracle)」修復水晶。' 
                        : 'JunAiKey monitors its own integrity. If Core Integrity drops below 70%, AI output may hallucinate. High-risk features will lock until you stabilize the crystal via Audit or Oracle verification.'}
                </p>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">Active Monitoring</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">Auto-Correction</span>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-celestial-purple" />
                    {isZh ? '如何收集碎片？' : 'How to Collect Fragments?'}
                </h3>
                <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-celestial-gold/20 flex items-center justify-center text-celestial-gold font-bold">1</div>
                        <span>{isZh ? '完成每日 ESG 任務 (Daily Quests)' : 'Complete Daily ESG Quests'}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-celestial-purple/20 flex items-center justify-center text-celestial-purple font-bold">2</div>
                        <span>{isZh ? '上傳並驗證真實數據 (Data Verification)' : 'Upload & Verify Real Data'}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-celestial-blue/20 flex items-center justify-center text-celestial-blue font-bold">3</div>
                        <span>{isZh ? '在學院中取得證書 (Certification)' : 'Earn Certificates in Academy'}</span>
                    </li>
                </ul>
                <button className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all">
                    {isZh ? '前往任務中心' : 'Go to Quest Hub'} <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
  );
};
