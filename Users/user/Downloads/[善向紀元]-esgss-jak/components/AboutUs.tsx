
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
    Info, Target, FileCode, Binary, GitCommit, ShieldCheck, 
    Zap, BrainCircuit, Network, Download, Share2,
    Settings, BarChart, Activity, ShieldAlert, Code,
    Layers, Cpu, Server, Lock, Globe, Database,
    Terminal, ChevronRight, Sparkles, TrendingUp,
    Fingerprint, Workflow, History, ArrowRight,
    Award, Box, Compass, Flame, Leaf, Rocket,
    Search, Heart, Crown, ExternalLink
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { marked } from 'marked';

export const AboutUs: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'vision' | 'whitepaper' | 'tech' | 'roadmap'>('whitepaper');
  const [logLines, setLogLines] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // 📜 2026 ESGss JunAiKey 完整技術規範書 (The Great Compendium)
  const whitepaperContent = `
# 📜 2026 ESGss JunAiKey 完整技術規範書
**版本**：V2.0 (2026-Q1 啟動版)  
**監製**：策略長 Jun 洪鼎竣 (CSO, ESG Sunshine 善向永續)  
**核心哲學**：以神聖代碼契約鑄造永恆架構，在熵增的混沌中開闢秩序之路。

---

## 一、 系統四大支柱 (The Four Pillars)
| 支柱 | 實踐方案 | 核心價值 (SMART) | 智能標籤 |
| :--- | :--- | :--- | :--- |
| **聖典審查** | RAG 萬能智庫 | 實現 95% 以上的 ESG 法規召回率與精準對標。 | \`#記憶聖所\` |
| **契約鑄造** | API 符文系統 | 完成 Flowlu、綠色金融與碳交易市場的無縫集成。 | \`#神聖契約\` |
| **神使架構** | 代理網絡 (Agents) | 每日自動處理 50+ 供應商數據採集與分析任務。 | \`#光之羽翼\` |
| **進化引擎** | 熵減煉金 (#Entropy) | 每週自動識別並修復 10% 的系統技術債與數據缺口。 | \`#原罪煉金\` |

---

## 二、 技術核心架構 (Technical Architecture)

### 1. 數據提純與 MRV 引擎
系統採用「多模態數據採集」與「RAG 知識共鳴」雙軌機制。
* **感知層**：透過 **動作 05 (OCR)** 採集原始單據，利用多模態模型進行本質提純。
* **認知層**：將提純數據注入 **Vector Knowledge Sanctuary**，實現多租戶隔離。
* **演算層**：執行碳排核算物理公式：$E = \\sum (AD_i \\times EF_i \\times GWP_i)$。

---

## 三、 428 浮動功能鍵界面 (The 428 Interface)

### 1. 極致美學 UI 規範
* **佈局**：Bento Box (便當盒) 網格，高資訊密度與極簡導航的平衡。
* **視覺**：Glassmorphism (玻璃擬態)，blur(20px)，配合動態光學脈衝。
* **交互**：4 種核心模式、2 種動態能量狀態監控、8 組快速動作。

### 2. ⚡ 奧義八式：快速動作
1. **🌬️ 供應商排查**：自動生成並發送具備審計專業度的 GRI 合規郵件。
2. **⚖️ 合規 GAP 分析**：即時對標 GRI/SASB，顯示紅綠燈狀態與修復建議。
3. **🌿 即時減碳演算**：將活動數據提純為具備文明價值的「碳減量資產」。
4. **📝 永續長週報**：一鍵聚合 Flowlu 數據，顯化董事會級別的戰略摘要。

---

## 四、 2026 進化路線圖 (Roadmap)

### Q1：生態化與金融化 (#SacredContract)
* **量子隔離**：建立多租戶級別的數據主權保護協議。
* **金融符文**：碳減量數據自動轉化為銀行利率優化利差。

### Q2：資產化與群體化 (#OriginalSinAlchemy)
* **國際碳權交易**：連結 ACX 等交易所，實現減碳數據的直接變現。
* **群體智慧進化**：跨供應商 ROI 博弈優化，AI 自動學習最優路徑。
`;

  useEffect(() => {
    const logs = [
      "[KERNEL] 2026 Q1 Evolution Protocol: ACTIVE",
      "[AUTH] CSO Authority Witnessed: SUCCESS",
      "[MANIFEST] Compendium v2.0 Ingested",
      "[SYNC] International Carbon Nexus: HANDSHAKE",
      "[RAG] Global Standards Indexing (GRI 2024)...",
      "[LOGIC] Value Creation Logic Matrix: ALIGNED",
      "[SEC] Tenant Data Shards Protected: TRUE",
      "[FINANCE] Rate Discount Oracle Online",
    ];
    let i = 0;
    const timer = setInterval(() => {
      setLogLines(prev => [...prev, logs[i % logs.length]].slice(-15));
      i++;
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const handleCompile = () => {
      addToast('reward', isZh ? '正在編譯《2026 萬能聖典》...' : 'Compiling 2026 Great Compendium...', 'System');
  };

  const TechParam = ({ label, val, color = "emerald" }: { label: string, val: string, color?: string }) => (
      <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex flex-col justify-center hover:bg-white/10 transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
          <div className="text-[9px] text-gray-500 uppercase font-black mb-1 group-hover:text-gray-300 transition-colors flex justify-between">
            {label}
            <div className={`w-1 h-1 rounded-full bg-${color}-400 animate-pulse`} />
          </div>
          <div className={`text-base font-mono font-bold text-${color}-400`}>{val}</div>
      </div>
  );

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <div className="shrink-0 flex flex-col lg:flex-row justify-between items-start lg:items-end px-2 gap-4">
            <UniversalPageHeader 
                icon={FileCode}
                title={{ zh: '2026 萬能技術規範聖典', en: '2026 Technical Compendium' }}
                description={{ zh: 'ESGss 善向永續：全知之眼 · 萬能聖典 v16.1', en: 'The Great Compendium of Value Creation & Regenerative Governance.' }}
                language={language}
                tag={{ zh: '內核版本 v16.1', en: 'KERNEL_V16.1' }}
            />
            <div className="flex bg-slate-900/50 p-1 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                {['whitepaper', 'tech', 'vision', 'roadmap'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-gray-500 hover:text-white'}`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar glass-bento p-10 border-white/5 bg-slate-900/40 rounded-[3.5rem] relative shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                    
                    {activeTab === 'whitepaper' && (
                        <div className="space-y-12 animate-fade-in w-full relative z-10">
                            <div className="border-l-4 border-celestial-gold pl-8">
                                <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">The_Great_Compendium <span className="text-celestial-gold opacity-50">v16.1</span></h3>
                                <div className="flex items-center gap-4 mt-3">
                                    <p className="text-gray-400 text-lg font-light italic">
                                        {isZh ? '「我們不編寫代碼，我們締結神聖架構契約。」' : 'We don’t just write code, we forge sacred architecture.'}
                                    </p>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-sm max-w-none bg-black/40 p-12 rounded-[3rem] border border-white/5 shadow-inner">
                                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked.parse(whitepaperContent) as string }} />
                            </div>

                            <section className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
                                <button onClick={handleCompile} className="flex items-center gap-3 px-10 py-4 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-2xl hover:scale-105 active:scale-95">
                                    <Download className="w-5 h-5"/> Download_Sacred_PDF
                                </button>
                                <button className="flex items-center gap-3 px-10 py-4 bg-white/5 text-white font-bold rounded-2xl text-xs uppercase border border-white/10 hover:bg-white/10 transition-all">
                                    <Share2 className="w-5 h-5"/> Export_Markdown
                                </button>
                            </section>
                        </div>
                    )}

                    {activeTab === 'tech' && (
                        <div className="space-y-10 animate-fade-in">
                            <div className="p-10 bg-black/60 rounded-[3rem] border border-celestial-blue/30 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5"><Cpu className="w-64 h-64 text-celestial-blue" /></div>
                                <h4 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                                    <Terminal className="w-7 h-7 text-celestial-blue" /> AIOS Deep-Logic Integration
                                </h4>
                                <div className="space-y-6 text-gray-300 text-base leading-relaxed">
                                    <p>本系統基於「超立方進化協議」，實現跨代理人的智慧編排。每個組件皆具備自我遙測與邏輯折疊能力，確保 100% MECE 一致性。</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                        {[
                                            { t: "MRV 數位認證", d: "自動化監測、報告與核證流程", icon: ShieldCheck },
                                            { t: "量子隔離架構", d: "多租戶數據實體物理隔離協定", icon: Lock },
                                            { t: "金融符文對接", d: "利差自動對標與金融 API 集成", icon: Zap },
                                            { t: "群體博弈優化", d: "跨產業標竿 ROI 演化路徑建議", icon: BrainCircuit }
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                                                <item.icon className="w-6 h-6 text-celestial-blue shrink-0" />
                                                <div>
                                                    <div className="font-bold text-white text-sm">{item.t}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase">{item.d}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'vision' && (
                        <div className="space-y-12 animate-fade-in flex flex-col items-center text-center py-20">
                            <div className="p-8 bg-celestial-gold/20 rounded-[3rem] border border-celestial-gold/30 animate-float-gentle">
                                <Crown className="w-24 h-24 text-celestial-gold" />
                            </div>
                            <div className="max-w-2xl space-y-6">
                                <h3 className="zh-main text-5xl text-white tracking-tighter">從「負擔」到「數位黃金」</h3>
                                <p className="text-gray-400 text-xl font-light leading-relaxed">
                                    我們正在定義未來企業的「永續利潤」。不只是減少排放，而是透過 JunAiKey 煉金術，將地球的健康轉化為資產負債表上的增長。
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 min-h-0">
                <div className="glass-bento p-8 flex flex-col bg-slate-950 border-white/10 rounded-[3rem] shrink-0 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <Box className="w-5 h-5 text-celestial-purple" />
                            <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Sacred_Contract_Vitals</span>
                        </div>
                        <div className="uni-mini bg-celestial-gold text-black">Master_Auth</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <TechParam label="Core_Integrity" val="99.99%" color="emerald" />
                        <TechParam label="Logic_Sanctity" val="100%" color="purple" />
                        <TechParam label="Auth_Level" val="ARCHITECT" color="gold" />
                        <TechParam label="MECE_Verify" val="PASSED" color="blue" />
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 flex flex-col bg-slate-900/60 border-white/5 rounded-[3rem] min-h-0 overflow-hidden shadow-xl">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Neural_Compendium_Stream</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="flex-1 bg-black/60 rounded-[2rem] border border-dashed border-white/5 flex flex-col p-6 font-mono text-[9px] relative overflow-hidden group shadow-inner">
                        <div className="space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            {logLines.map((line, idx) => (
                                <div key={idx} className={`flex gap-3 ${line.includes('SUCCESS') || line.includes('ALIGNED') ? 'text-emerald-500' : 'text-gray-500'}`}>
                                  <span className="shrink-0 text-gray-800">[{idx.toString().padStart(2, '0')}]</span>
                                  <span className="truncate">{line}</span>
                                </div>
                            ))}
                            <div ref={logEndRef} />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
