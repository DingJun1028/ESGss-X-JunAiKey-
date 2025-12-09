
import React, { useState } from 'react';
import { X, Check, Star, Zap, ShieldCheck, Crown } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { Language } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, language }) => {
  const { tier, upgradeTier } = useCompany();
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = (targetTier: 'Pro' | 'Enterprise') => {
      setProcessing(true);
      setTimeout(() => {
          upgradeTier(targetTier);
          addToast('success', isZh ? `歡迎加入 ${targetTier} 會員！` : `Welcome to ${targetTier}!`, 'Upgrade Successful');
          setProcessing(false);
          onClose();
      }, 1500);
  };

  const features = [
      { name: isZh ? 'AI 深度推理 (CoT)' : 'AI Deep Reasoning (CoT)', free: false, pro: true, ent: true },
      { name: isZh ? '無限報告生成' : 'Unlimited Report Gen', free: false, pro: true, ent: true },
      { name: isZh ? '內部碳定價模擬' : 'Shadow Carbon Pricing', free: false, pro: true, ent: true },
      { name: isZh ? '供應鏈合規稽核' : 'Supply Chain Audit', free: false, pro: true, ent: true },
      { name: isZh ? '客製化儀表板' : 'Custom Dashboard', free: true, pro: true, ent: true },
      { name: isZh ? 'API 整合服務' : 'API Integration', free: false, pro: false, ent: true },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white z-20">
                <X className="w-5 h-5" />
            </button>

            {/* Sidebar / Header */}
            <div className="p-8 md:w-1/3 bg-gradient-to-br from-celestial-purple/20 via-slate-900 to-slate-900 flex flex-col justify-center border-r border-white/10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-celestial-gold to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-6">
                    <Crown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{isZh ? '升級您的影響力' : 'Upgrade Your Impact'}</h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                    {isZh 
                        ? '解鎖 JunAiKey 的完全潛能。從 AI 深度推理到自動化合規報告，掌握永續轉型的每一刻。' 
                        : 'Unlock the full potential of JunAiKey. From deep AI reasoning to automated compliance reporting.'}
                </p>
                <div className="flex items-center gap-2 text-xs text-celestial-gold font-bold uppercase tracking-wider">
                    <Star className="w-4 h-4 fill-current" />
                    Trusted by 500+ Enterprises
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="p-8 md:w-2/3 bg-slate-900 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                    {/* Free Tier */}
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col opacity-50 hover:opacity-100 transition-opacity">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-white">Starter</h3>
                            <div className="text-2xl font-bold text-gray-400 mt-2">$0</div>
                        </div>
                        <ul className="space-y-3 flex-1">
                            <li className="flex items-center gap-2 text-xs text-gray-300"><Check className="w-3 h-3 text-emerald-500"/> Basic Dashboard</li>
                            <li className="flex items-center gap-2 text-xs text-gray-300"><Check className="w-3 h-3 text-emerald-500"/> Public Research</li>
                        </ul>
                        <button className="mt-6 w-full py-2 rounded-xl border border-white/10 text-gray-400 text-xs font-bold cursor-default">Current Plan</button>
                    </div>

                    {/* Pro Tier (Featured) */}
                    <div className="p-6 rounded-2xl border border-celestial-gold/50 bg-gradient-to-b from-celestial-gold/10 to-transparent flex flex-col relative transform scale-105 shadow-xl shadow-amber-900/20 z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-celestial-gold text-black text-[10px] font-bold px-3 py-1 rounded-b-lg">RECOMMENDED</div>
                        <div className="mb-4 mt-2">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                Pro <Zap className="w-4 h-4 text-celestial-gold fill-current"/>
                            </h3>
                            <div className="text-3xl font-bold text-white mt-2">$49<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                        </div>
                        <ul className="space-y-3 flex-1">
                            {features.filter(f => f.pro).map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs text-white">
                                    <div className="p-0.5 rounded-full bg-celestial-gold text-black"><Check className="w-2 h-2"/></div>
                                    {f.name}
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => handleUpgrade('Pro')}
                            disabled={processing || tier === 'Pro'}
                            className="mt-6 w-full py-3 rounded-xl bg-celestial-gold hover:bg-amber-400 text-black font-bold text-sm transition-all shadow-lg hover:shadow-amber-500/25 disabled:opacity-50"
                        >
                            {processing ? 'Processing...' : (tier === 'Pro' ? 'Active' : (isZh ? '立即升級' : 'Upgrade Now'))}
                        </button>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="p-6 rounded-2xl border border-celestial-purple/30 bg-celestial-purple/5 flex flex-col">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-white">Enterprise</h3>
                            <div className="text-2xl font-bold text-white mt-2">Custom</div>
                        </div>
                        <ul className="space-y-3 flex-1">
                            <li className="flex items-center gap-2 text-xs text-gray-300"><Check className="w-3 h-3 text-purple-400"/> All Pro Features</li>
                            <li className="flex items-center gap-2 text-xs text-gray-300"><Check className="w-3 h-3 text-purple-400"/> Dedicated API</li>
                            <li className="flex items-center gap-2 text-xs text-gray-300"><Check className="w-3 h-3 text-purple-400"/> SLA Support</li>
                        </ul>
                        <button 
                            onClick={() => window.open('mailto:sales@esgss.com')}
                            className="mt-6 w-full py-2 rounded-xl border border-celestial-purple/50 text-celestial-purple hover:bg-celestial-purple/10 text-xs font-bold transition-all"
                        >
                            {isZh ? '聯絡我們' : 'Contact Sales'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
