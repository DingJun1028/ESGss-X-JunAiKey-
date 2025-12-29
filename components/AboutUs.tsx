import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
    Info, Target, FileCode, Binary, GitCommit, ShieldCheck, 
    Zap, BrainCircuit, Network, 
    Download, Share2,
    Settings, BarChart, Activity, ShieldAlert, Code,
    Layers, Cpu, Server, Lock, Globe, Database, Cpu as Processor,
    Terminal, ChevronRight, Sparkles, TrendingUp, CpuIcon,
    Fingerprint, Workflow, History
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';

export const AboutUs: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'vision' | 'whitepaper' | 'tech' | 'roadmap'>('whitepaper');
  const [logLines, setLogLines] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // 模擬實時神經反射日誌 (提升含金量視覺感)
  useEffect(() => {
    const logs = [
      "[KERNEL] Initializing AIOS v15.2...",
      "[AUTH] Authority Forging Handshake: SUCCESS",
      "[SYNC] Neural Bus Synapse 0xBF32 Connected",
      "[RAG] Atomic Knowledge Vector Indexing...",
      "[LOGIC] Chain-of-Thought Reasoning Active",
      "[DB] Connecting to Decentralized Ledger...",
      "[AGENT] Navigation Swarm Reporting 98% Integrity",
      "[SEC] Zero-Hallucination Guardrails: LOCKED",
      "[TENSOR] Allocating 128k Context Window...",
      "[UI] Optical Exclusive Layer Rendering..."
    ];
    let i = 0;
    const timer = setInterval(() => {
      setLogLines(prev => [...prev, logs[i % logs.length]].slice(-12));
      i++;
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logLines]);

  const handleDownloadPDF = () => {
      addToast('info', isZh ? '正在從 AIOS 內核編譯技術白皮書...' : 'Compiling Technical Whitepaper...', 'System');
      setTimeout(() => {
          addToast('success', isZh ? '下載完成：JunAiKey_Manifesto_v15.pdf' : 'Download Complete', 'System');
      }, 1500);
  };

  const TechParam = ({ label, val, color = "emerald", desc }: { label: string, val: string, color?: string, desc?: string }) => (
      <div 
        className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex flex-col justify-center hover:bg-white/10 transition-all group cursor-help relative"
        title={desc}
      >
          <div className="text-[10px] text-gray-500 uppercase font-black mb-2 group-hover:text-gray-300 transition-colors flex justify-between">
            {label}
            <Info className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center justify-between">
              <div className={`text-lg font-mono font-bold text-${color}-400`}>{val}</div>
              <div className="h-1.5 w-16 bg-black/40 rounded-full overflow-hidden shrink-0">
                  <div className={`h-full bg-${color}-500 shadow-[0_0_8px_rgba(0,0,0,0.5)]`} style={{ width: '75%' }} />
              </div>
          </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        {/* 頁頭數據帶 - 空間壓縮優化 */}
        <div className="shrink-0 flex justify-between items-center px-2">
            <div className="transform scale-95 origin-left">
                <UniversalPageHeader 
                    icon={FileCode}
                    title={{ zh: '專案完全技術規格', en: 'Technical Manifesto' }}
                    description={{ zh: 'JunAiKey AIOS：全景架構與三元一體技術深度報告', en: 'Deep Technical Architecture & Trinity Framework' }}
                    language={language}
                    tag={{ zh: '內核版本 v15.2', en: 'KERNEL_V15' }}
                />
            </div>
            
            <div className="flex bg-slate-900/50 p-1.5 backdrop-blur-xl border border-white/10 rounded-xl">
                {[
                    { id: 'whitepaper', label: isZh ? '技術規格' : 'Spec', icon: FileCode },
                    { id: 'tech', label: isZh ? '三元架構' : 'Trinity', icon: Binary },
                    { id: 'vision', label: isZh ? '核心哲學' : 'Philosophy', icon: Target },
                    { id: 'roadmap', label: isZh ? '演進路徑' : 'Roadmap', icon: GitCommit },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-2xl' : 'text-gray-400 hover:text-white'}`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* 核心內容矩陣 - 撐滿全景 (1.618 : 1) */}
        <div className="flex-1 grid grid-cols-12 gap-5 min-h-0 overflow-hidden">
            
            {/* 左側：核心文檔內容 */}
            <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar glass-bento p-10 border-white/5 bg-slate-900/20 rounded-[2.5rem] relative">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                        <Code className="w-80 h-80" />
                    </div>

                    {activeTab === 'whitepaper' && (
                        <div className="space-y-12 animate-fade-in w-full">
                            <div className="border-l-8 border-celestial-gold pl-8 space-y-3">
                                <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">JunAiKey_OS Kernel Manifesto</h3>
                                <p className="text-gray-400 text-base font-light">基於邊緣計算與量子語義檢索的分層架構揭露</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4 group hover:bg-white/[0.05] transition-all">
                                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl w-fit"><Server className="w-6 h-6" /></div>
                                    <h4 className="font-black text-white uppercase tracking-widest text-sm">數據通訊層 (Protocol)</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">採用 gRPC 與 Protobuf 的二進制通訊協定，實現毫秒級數據摺疊與同步，支持全球 500+ 端點並發。</p>
                                </div>
                                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4 group hover:bg-white/[0.05] transition-all">
                                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl w-fit"><BrainCircuit className="w-6 h-6" /></div>
                                    <h4 className="font-black text-white uppercase tracking-widest text-sm">智慧推理層 (Reasoning)</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">內建 Atomic RAG 引擎，透過 1536 維向量空間對標 GRI/SASB 標準，確保 AI 回答具備 99% 邏輯見證度。</p>
                                </div>
                                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4 group hover:bg-white/[0.05] transition-all">
                                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit"><ShieldCheck className="w-6 h-6" /></div>
                                    <h4 className="font-black text-white uppercase tracking-widest text-sm">安全驗證層 (Trust)</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">所有決策軌跡均通過 SHA-256 雜湊處理並寫入區塊鏈稽核鏈，實現不可篡改的數位信任足跡。</p>
                                </div>
                            </div>

                            <section className="space-y-6">
                                <h4 className="flex items-center gap-3 text-sm font-black text-celestial-gold uppercase tracking-[0.3em]"><Layers className="w-5 h-5"/> 核心封裝技術 (Module Specs)</h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-5 p-6 bg-black/20 rounded-3xl border border-white/5">
                                        <div className="px-3 py-1 bg-white/10 text-white font-mono text-[9px] rounded-lg mt-1">MODULE_A9</div>
                                        <div className="flex-1">
                                            <h5 className="text-sm font-bold text-white mb-2 uppercase">動態代理人協調器 (Agent Orchestrator)</h5>
                                            <p className="text-xs text-gray-500 leading-relaxed">自動化任務分解引擎，能根據任務權重動態分配 CPU 與 Token 資源，支援多代理辯論模式 (CoT) 產出最優解。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-5 p-6 bg-black/20 rounded-3xl border border-white/5">
                                        <div className="px-3 py-1 bg-white/10 text-white font-mono text-[9px] rounded-lg mt-1">SECURE_L15</div>
                                        <div className="flex-1">
                                            <h5 className="text-sm font-bold text-white mb-2 uppercase">零幻覺邏輯斷言 (Zero-Hallucination Guardrails)</h5>
                                            <p className="text-xs text-gray-500 leading-relaxed">基於 12 個維度的見證協定，在輸出前強制進行事實檢核，偏差值超過 0.05 則自動觸發自我校正機制。</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="pt-8 border-t border-white/5 flex gap-5">
                                <button onClick={handleDownloadPDF} className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-2xl text-xs uppercase hover:scale-105 transition-all shadow-2xl shadow-white/5"><Download className="w-5 h-5"/> Compile_Whitepaper_PDF</button>
                                <button className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white font-bold rounded-2xl text-sm uppercase border border-white/10 hover:bg-white/10 transition-all"><Share2 className="w-5 h-5"/> Share_Architecture</button>
                            </section>
                        </div>
                    )}

                    {activeTab === 'tech' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in h-full">
                            {[
                                { title: '感知層 (Perception)', icon: BrainCircuit, color: 'cyan', desc: '負責從系統內部狀態和外部環境中收集信息。採用 RxJS 神經匯流排，捕捉全球碳排、能源與社會輿情之瞬時變動。' },
                                { title: '認知層 (Cognition)', icon: Network, color: 'amber', desc: '系統的思考中樞。利用 Gemini 3 Pro 深層推理能力，進行情境模擬與價值預測，將數據轉化為具體的商模洞察。' },
                                { title: '行動層 (Action)', icon: Zap, color: 'purple', desc: '閉環進化的執行終端。根據決策自動生成報告、觸發 Webhook 或調整系統配置，將意圖轉化為現實世界的影響力。' }
                            ].map((item, i) => (
                                <div key={i} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6 hover:bg-white/[0.08] transition-all group">
                                    <div className={`p-5 bg-${item.color}-500/20 rounded-[1.8rem] w-fit group-hover:scale-110 transition-transform`}><item.icon className={`w-10 h-10 text-${item.color}-400`} /></div>
                                    <h4 className="text-xl font-black text-white">{item.title}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                                    <div className="pt-4 flex gap-2">
                                        {[1, 2, 3].map(dot => <div key={dot} className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500/30 group-hover:bg-${item.color}-500 transition-colors duration-500`} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'vision' && (
                        <div className="space-y-10 animate-fade-in">
                            <div className="text-center py-16">
                                <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold via-white to-celestial-emerald tracking-tighter uppercase mb-6">萬能 MECE # 極限性能晉級</h3>
                                <p className="text-xl text-gray-400 italic font-light">「萬物歸宗，撥亂反正，同體一心，無差無別。」</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { zh: '萬物歸宗', en: 'SOURCE_UNITY', desc: '數據溯源機制' },
                                    { zh: '撥亂反正', en: 'ENTROPY_REDUCTION', desc: '雜訊過濾算法' },
                                    { zh: '同體一心', en: 'NEURAL_SYNC', desc: '全局狀態管理' },
                                    { zh: '無縫接軌', en: 'SEAMLESS_IO', desc: 'API 自適應層' },
                                    { zh: '缺口補齊', en: 'GAP_FILLING', desc: '缺失值 AI 推理' },
                                    { zh: '自主通典', en: 'AUTONOMOUS_CODEX', desc: '智慧合規知識庫' },
                                    { zh: '永續進化', en: 'DYNAMIC_EVO', desc: '自我修復能力' },
                                    { zh: '極簡光學', en: 'OPTICAL_UX', desc: '視覺語義對齊' }
                                ].map(v => (
                                    <div key={v.en} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center group hover:border-celestial-gold transition-all cursor-crosshair">
                                        <div className="text-xs font-black text-white mb-1 uppercase tracking-widest">{v.zh}</div>
                                        <div className="text-[7px] text-gray-500 font-mono mb-2">{v.en}</div>
                                        <div className="text-[8px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">{v.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'roadmap' && (
                        <div className="space-y-12 animate-fade-in h-full relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2 hidden md:block" />
                            
                            {[
                                { v: 'v1.0', name: 'Genesis Project', status: 'Archive', date: '2023.Q1', desc: '基礎碳盤查模組與初步 UI 框架確立。', color: 'slate' },
                                { v: 'v5.0', name: 'Cognitive Layer', status: 'Legacy', date: '2023.Q3', desc: '導入深度學習輔助報告撰寫，實現初步智慧化。', color: 'blue' },
                                { v: 'v12.0', name: 'StarGate Protocol', status: 'Legacy', date: '2024.Q2', desc: '多代理人協作機制啟動，數據同步率突破 85%。', color: 'purple' },
                                { v: 'v15.2', name: 'Singularity Key', status: 'ACTIVE', date: 'NOW', desc: 'JunAiKey 萬能內核覺醒，全面實裝三元一體技術規格。', color: 'gold' },
                                { v: 'v20.0', name: 'Omni-Presence', status: 'Planned', date: '2025.Q4', desc: '全自動化自治決策系統 (Autonomous DAO) 實驗啟動。', color: 'emerald' },
                            ].map((step, i) => (
                                <div key={step.v} className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative z-10`}>
                                    <div className="flex-1 bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-gray-500 uppercase">{step.date}</span>
                                            <span className={`text-[8px] px-2 py-0.5 rounded font-bold bg-${step.color}-500/20 text-${step.color}-400 border border-${step.color}-500/30`}>{step.status}</span>
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-2">{step.name} <span className="text-xs opacity-50 ml-2">{step.v}</span></h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-4 border-slate-900 bg-${step.color}-500 shadow-[0_0_15px_rgba(251,191,36,0.2)] shrink-0 hidden md:block`} />
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 右側：價值補償區與技術監控 */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 min-h-0">
                {/* 參數矩陣 */}
                <div className="glass-bento p-6 flex flex-col bg-slate-950/40 border-white/10 rounded-[2.5rem] shrink-0">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <Processor className="w-5 h-5 text-celestial-purple" />
                            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">內核技術參數矩陣</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <div className="text-[9px] font-mono text-gray-400 bg-black/40 px-2 py-0.5 rounded">TENSOR_LOAD: 42.1%</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <TechParam label="Neural_Sync" val="98.4%" desc="跨模態神經元同步率，確保全系統數據一致性" />
                        <TechParam label="Context_W" val="128k" color="blue" desc="當前處理之上下文視窗長度（Tokens）" />
                        <TechParam label="Reflex_Lat" val="12ms" color="gold" desc="感知到數據變化至執行行動層之反應延遲" />
                        <TechParam label="Entropy_Q" val="0.082" color="purple" desc="系統亂度指數，數值愈低代表邏輯愈嚴謹" />
                        <TechParam label="Auth_LV" val="L15.2" color="rose" desc="當前核心授權等級，解鎖高級辯論與模擬權能" />
                        <TechParam label="Agent_Count" val="42" color="blue" desc="當前背景運行之專業子代理人總數" />
                    </div>
                </div>

                {/* 即時神經反射 (Terminal Log) */}
                <div className="glass-bento p-6 flex-1 flex flex-col bg-slate-900/40 border-white/5 rounded-[2.5rem] min-h-0 overflow-hidden">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Live_Neural_Reflex</span>
                        </div>
                        <Sparkles className="w-4 h-4 text-celestial-gold animate-pulse" />
                    </div>

                    <div className="flex-1 bg-black/40 rounded-3xl border border-dashed border-white/10 flex flex-col p-4 font-mono text-[9px] relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
                        <div className="space-y-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            {logLines.map((line, idx) => (
                                <div key={idx} className={`${line.includes('SUCCESS') || line.includes('OK') ? 'text-emerald-500' : 'text-gray-400'}`}>
                                  {line}
                                </div>
                            ))}
                            <div ref={logEndRef} />
                        </div>
                        {/* 模擬曲線 */}
                        <svg className="absolute bottom-0 left-0 w-full h-24 text-emerald-500/10 fill-current pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <path d="M0,80 Q50,20 100,70 T200,40 T300,90 T400,30 L400,100 L0,100 Z" />
                        </svg>
                    </div>

                    <div className="mt-6 p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3 shrink-0">
                        <div className="flex items-center gap-3 text-xs font-bold text-white">
                            <ShieldAlert className="w-5 h-5 text-amber-500" />
                            <span>Architecture Sync Advice</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed italic border-l-2 border-amber-500/30 pl-3">
                            「當前系統處於 v15.2 核心穩定態。偵測到 A9 維度與數據層同步率偏移，建議強化 WebSocket 握手協定。」
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* 操作底欄 */}
        <div className="shrink-0 flex justify-end gap-4 pb-4">
            <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-black transition-all border border-white/10 uppercase tracking-[0.2em]">取消校準</button>
            <button onClick={() => addToast('success', '核心邏輯已寫入聖典', 'Sync')} className="px-10 py-3 bg-gradient-to-r from-celestial-gold to-amber-500 text-black font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 執行模擬並寫入聖典
            </button>
        </div>
    </div>
  );
};
