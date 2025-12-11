
import React, { useState } from 'react';
import { Language } from '../types';
import { Info, Globe, ArrowRight, ShieldCheck, Zap, Users, Target, DollarSign, Server, Map as MapIcon, List, Layers, Cpu, Lock, FileText, Download, Share2 } from 'lucide-react';
import { LogoIcon } from './Layout';
import { useToast } from '../contexts/ToastContext';

interface AboutUsProps {
  language: Language;
}

export const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'vision' | 'monetization' | 'tech' | 'roadmap' | 'action'>('vision');

  const handleDownloadPDF = () => {
      addToast('success', isZh ? '正在下載白皮書 PDF...' : 'Downloading Whitepaper PDF...', 'System');
      // Simulate download delay
      setTimeout(() => {
          const link = document.createElement('a');
          link.href = '#'; // In a real app, this would be the file URL
          link.setAttribute('download', 'ESG_Sunshine_Whitepaper_v13.2.pdf');
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
          addToast('success', isZh ? '下載完成' : 'Download Complete', 'System');
      }, 1500);
  };

  const tabs = [
      { id: 'vision', label: isZh ? '產品願景' : 'Vision', icon: Target },
      { id: 'monetization', label: isZh ? '變現策略' : 'Monetization', icon: DollarSign },
      { id: 'tech', label: isZh ? '技術架構' : 'Tech Stack', icon: Server },
      { id: 'roadmap', label: isZh ? '發展路線' : 'Roadmap', icon: MapIcon },
      { id: 'action', label: isZh ? '行動建議' : 'Action Plan', icon: List },
  ];

  const renderContent = () => {
      switch (activeTab) {
          case 'vision':
              return (
                  <div className="space-y-8 animate-fade-in">
                      <div className="text-center space-y-4">
                          <h3 className="text-2xl font-bold text-white">{isZh ? '黃金三角：資本、政策、知識' : 'The Golden Triangle: Capital, Policy, Knowledge'}</h3>
                          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
                              {isZh 
                                ? 'ESGss 致力於構建「創價型 ESG」生態系。我們不只是合規工具，而是透過 AI 與區塊鏈，將企業的永續投入轉化為可量化的競爭力護城河。' 
                                : 'ESGss builds a "Value-Creating ESG" ecosystem. Beyond compliance, we use AI & Blockchain to transform sustainability efforts into quantifiable competitive moats.'}
                          </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="glass-panel p-6 rounded-2xl border-t-2 border-emerald-400 bg-emerald-900/10">
                              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                              <h4 className="font-bold text-white mb-2">{isZh ? '防禦 (Defense)' : 'Defense'}</h4>
                              <p className="text-sm text-gray-400">{isZh ? '核心：報告書、數據治理、合規。目標：降低風險。' : 'Core: Reporting, Data Gov, Compliance. Goal: Risk Reduction.'}</p>
                          </div>
                          <div className="glass-panel p-6 rounded-2xl border-t-2 border-celestial-gold bg-amber-900/10">
                              <Zap className="w-8 h-8 text-celestial-gold mb-4" />
                              <h4 className="font-bold text-white mb-2">{isZh ? '進攻 (Offense)' : 'Offense'}</h4>
                              <p className="text-sm text-gray-400">{isZh ? '核心：商業價值、創新、影響力。目標：創造商機。' : 'Core: Business Value, Innovation, Impact. Goal: Create Opportunity.'}</p>
                          </div>
                          <div className="glass-panel p-6 rounded-2xl border-t-2 border-celestial-purple bg-purple-900/10">
                              <Users className="w-8 h-8 text-celestial-purple mb-4" />
                              <h4 className="font-bold text-white mb-2">{isZh ? '賦能 (Empowerment)' : 'Empowerment'}</h4>
                              <p className="text-sm text-gray-400">{isZh ? '讓「善」成為新時代的生產力。連結柏克萊頂尖學術與矽谷創新實踐。' : 'Making "Good" the new productivity. Bridging Berkeley academics with Silicon Valley innovation.'}</p>
                          </div>
                      </div>
                  </div>
              );
          case 'monetization':
              return (
                  <div className="space-y-8 animate-fade-in">
                      <div className="glass-panel p-8 rounded-2xl border border-celestial-gold/30">
                          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                              <DollarSign className="w-6 h-6 text-celestial-gold" />
                              {isZh ? '輕資產、智財驅動 (Asset-Light, IP-Driven)' : 'Asset-Light, IP-Driven Model'}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                      <h4 className="font-bold text-white text-lg mb-1">SaaS 訂閱制 (Freemium)</h4>
                                      <p className="text-sm text-gray-400">
                                          透過分層訂閱 (Starter, Pro, Enterprise) 提供 AI 決策支援與報告生成服務。
                                      </p>
                                  </div>
                                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                      <h4 className="font-bold text-white text-lg mb-1">API 流量變現</h4>
                                      <p className="text-sm text-gray-400">
                                          開放 JunAiKey 引擎 API，賦能第三方 ERP/CRM 系統，按 Token 使用量計費。
                                      </p>
                                  </div>
                              </div>
                              <div className="space-y-4">
                                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                      <h4 className="font-bold text-white text-lg mb-1">平台手續費 (Marketplace)</h4>
                                      <p className="text-sm text-gray-400">
                                          善向幣 (GWC) 交易、碳權媒合、專家諮詢預約的手續費抽成。
                                      </p>
                                  </div>
                                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                      <h4 className="font-bold text-white text-lg mb-1">教育與認證 (Education)</h4>
                                      <p className="text-sm text-gray-400">
                                          與 Berkeley 等機構合作發行區塊鏈證書，打造亞洲永續人才庫。
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case 'tech':
              return (
                  <div className="space-y-8 animate-fade-in">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="glass-panel p-6 rounded-2xl border border-white/10">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                  <Cpu className="w-5 h-5 text-celestial-purple" />
                                  {isZh ? '核心技術棧' : 'Core Tech Stack'}
                              </h3>
                              <ul className="space-y-3">
                                  <li className="flex items-start gap-3">
                                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-bold font-mono">Frontend</span>
                                      <span className="text-sm text-gray-300">React 19, TypeScript, Tailwind CSS (Glassmorphism UI)</span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-bold font-mono">AI Engine</span>
                                      <span className="text-sm text-gray-300">Google Gemini 3 Pro (Reasoning), Gemini 2.5 Flash (Vision)</span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-bold font-mono">State</span>
                                      <span className="text-sm text-gray-300">Universal Intelligence Engine (Custom Observable Store)</span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                      <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs font-bold font-mono">Backend</span>
                                      <span className="text-sm text-gray-300">NoCodeBackend (NCB) / Supabase / Node.js Edge Functions</span>
                                  </li>
                              </ul>
                          </div>
                          <div className="glass-panel p-6 rounded-2xl border border-white/10">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                  <Lock className="w-5 h-5 text-emerald-400" />
                                  {isZh ? '安全與隱私' : 'Security & Privacy'}
                              </h3>
                              <ul className="space-y-3 text-sm text-gray-300">
                                  <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> SOC2 Type II 準則設計</li>
                                  <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> 端對端加密 (E2EE) 數據傳輸</li>
                                  <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> RBAC 基於角色的存取控制</li>
                                  <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> AI 護欄 (Guardrails) 防止 PII 外洩</li>
                              </ul>
                          </div>
                      </div>
                  </div>
              );
          case 'roadmap':
              return (
                  <div className="space-y-6 animate-fade-in relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                      
                      {[
                          { phase: 'Phase I', title: '基礎建設期 (2025)', desc: '目標：春季班滿班 (30人)、系統 MVP 上線、儀表板與報告模組發布。', status: 'active' },
                          { phase: 'Phase II', title: '擴張與獲利期 (2026)', desc: '目標：實現獲利 600 萬、SaaS 訂閱制推廣、印度人才計畫落地。', status: 'pending' },
                          { phase: 'Phase III', title: '資本化期 (2027)', desc: '目標：年營收突破 1 億、啟動興櫃/IPO 輔導、成為亞洲永續領導品牌。', status: 'pending' }
                      ].map((item, idx) => (
                          <div key={idx} className="relative pl-12">
                              <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 transform -translate-x-1/2 ${item.status === 'done' ? 'bg-emerald-500 border-emerald-500' : item.status === 'active' ? 'bg-celestial-gold border-celestial-gold animate-pulse' : 'bg-slate-900 border-gray-600'}`} />
                              <div className={`p-4 rounded-xl border transition-all ${item.status === 'active' ? 'bg-white/10 border-celestial-gold/50' : 'bg-white/5 border-white/5'}`}>
                                  <div className="flex justify-between mb-1">
                                      <span className={`text-xs font-bold uppercase tracking-wider ${item.status === 'active' ? 'text-celestial-gold' : 'text-gray-500'}`}>{item.phase}</span>
                                      {item.status === 'active' && <span className="text-[10px] bg-celestial-gold text-black px-2 py-0.5 rounded font-bold">CURRENT</span>}
                                  </div>
                                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                                  <p className="text-sm text-gray-300">{item.desc}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              );
          case 'action':
              return (
                  <div className="glass-panel p-8 rounded-2xl border border-white/10 animate-fade-in bg-slate-900/50">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                          <List className="w-6 h-6 text-celestial-emerald" />
                          {isZh ? '下一步行動建議' : 'Next Steps'}
                      </h3>
                      <div className="space-y-4">
                          <div className="flex gap-4 items-start p-4 bg-slate-900/80 rounded-xl border border-white/10 hover:border-celestial-emerald/50 transition-all cursor-pointer group">
                              <div className="w-10 h-10 rounded-full bg-celestial-emerald/20 text-celestial-emerald flex items-center justify-center shrink-0 font-bold text-lg group-hover:scale-110 transition-transform">1</div>
                              <div>
                                  <h4 className="font-bold text-white text-lg">啟動全方位健檢</h4>
                                  <p className="text-sm text-gray-400 mt-1">使用 <span className="text-white font-bold">Health Check</span> 模組盤點企業目前的 ESG 數據成熟度與風險缺口。</p>
                              </div>
                          </div>
                          <div className="flex gap-4 items-start p-4 bg-slate-900/80 rounded-xl border border-white/10 hover:border-celestial-purple/50 transition-all cursor-pointer group">
                              <div className="w-10 h-10 rounded-full bg-celestial-purple/20 text-celestial-purple flex items-center justify-center shrink-0 font-bold text-lg group-hover:scale-110 transition-transform">2</div>
                              <div>
                                  <h4 className="font-bold text-white text-lg">對接數據源</h4>
                                  <p className="text-sm text-gray-400 mt-1">前往 <span className="text-white font-bold">API Zone</span> 或 <span className="text-white font-bold">Integration Hub</span>，將現有的 ERP/電費單數據導入系統。</p>
                              </div>
                          </div>
                          <div className="flex gap-4 items-start p-4 bg-slate-900/80 rounded-xl border border-white/10 hover:border-celestial-gold/50 transition-all cursor-pointer group">
                              <div className="w-10 h-10 rounded-full bg-celestial-gold/20 text-celestial-gold flex items-center justify-center shrink-0 font-bold text-lg group-hover:scale-110 transition-transform">3</div>
                              <div>
                                  <h4 className="font-bold text-white text-lg">賦能團隊</h4>
                                  <p className="text-sm text-gray-400 mt-1">邀請員工加入 <span className="text-white font-bold">Academy</span>，透過遊戲化機制提升全員永續意識。</p>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
        {/* Header - Invitation Style */}
        <div className="glass-panel p-8 rounded-3xl border border-celestial-gold/30 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden text-center">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-celestial-emerald via-celestial-gold to-celestial-purple" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-celestial-gold/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 mb-6 relative">
                    <div className="absolute inset-0 bg-celestial-gold/20 blur-xl rounded-full animate-pulse" />
                    <LogoIcon className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                </div>
                
                <div className="space-y-2 mb-6">
                    <span className="text-celestial-gold font-bold tracking-[0.2em] text-xs uppercase">Investment Opportunity</span>
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        {isZh ? '給投資者以及永續夥伴 的邀請函' : 'Invitation to Investors & Partners'}
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg font-light">
                        ESG Sunshine x JunAiKey
                    </p>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-6 py-3 bg-celestial-gold hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 group"
                    >
                        <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        {isZh ? '下載完整白皮書 PDF' : 'Download Whitepaper PDF'}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10">
                        <Share2 className="w-5 h-5" />
                        {isZh ? '分享' : 'Share'}
                    </button>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-white/10 pb-4 sticky top-0 z-20 bg-celestial-900/80 backdrop-blur-md pt-4">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeTab === tab.id 
                            ? 'bg-white text-black shadow-lg shadow-white/10' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
            {renderContent()}
        </div>

        {/* Footer */}
        <div className="text-center pt-12 border-t border-white/5 text-gray-500 text-xs flex flex-col items-center gap-2">
            <div className="w-8 h-8 opacity-50">
                <LogoIcon className="w-full h-full grayscale" />
            </div>
            <p>&copy; 2025 ESGss Corp. All rights reserved.</p>
            <p className="font-mono text-[10px]">Documentation v13.2.0 | Generated by JunAiKey System Architect</p>
        </div>
    </div>
  );
};
