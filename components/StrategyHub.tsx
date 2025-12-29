import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Language, View } from '../types';
import { 
    Zap, BrainCircuit, X, Loader2, ShieldCheck, Activity, ChevronRight, 
    Layers, Crown, Sliders, Briefcase, Layout, TrendingUp, BarChart, 
    Search, PenTool, Globe, Target, FlaskConical, PieChart, Info, Users,
    Dna, Terminal, Sparkles, AlertCircle, FileSearch, ArrowRight, Gauge,
    Download, RefreshCw, MessageSquare
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { streamChat } from '../services/ai-service';
import { marked } from 'marked';

export const StrategyHub: React.FC<{ language: Language, onNavigate: (view: View) => void }> = ({ language, onNavigate }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { observeAction } = useUniversalAgent();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<{id: number, text: string, status: 'pending' | 'done'}[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const advisoryTools = [
    { id: 'pos', name: isZh ? '市場地位分析' : 'Market Positioning', icon: Target, cat: 'STRAT' },
    { id: 'biz', name: isZh ? '商業模式評估' : 'Business Model', icon: Briefcase, cat: 'SYNTH' },
    { id: 'comp', name: isZh ? '競爭者策略' : 'Competitor Analysis', icon: Search, cat: 'INTEL' },
    { id: 'risk', name: isZh ? '趨勢風險雷達' : 'Risk Radar', icon: Activity, cat: 'TRUST' },
    { id: 'swot', name: isZh ? 'SWOT 深度解析' : 'SWOT Analysis', icon: Layout, cat: 'CORE' },
    { id: 'jour', name: isZh ? '顧客旅程分析' : 'Customer Journey', icon: Activity, cat: 'SOCIAL' },
    { id: 'cul', name: isZh ? '組織文化分析' : 'Culture Analysis', icon: Users, cat: 'ALTRU' },
    { id: 'narr', name: isZh ? '文明敘事對齊' : 'Civ Narrative', icon: PenTool, cat: 'LIGHT' },
  ];

  const handleToolExecute = async (tool: any) => {
    setSelectedTool(tool.id);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    const steps = [
        { id: 1, text: isZh ? "初始化 12A 認知維度..." : "Initializing 12A Cognition...", status: 'pending' as const },
        { id: 2, text: isZh ? "對標全球 500 強最佳實踐..." : "Benchmarking Fortune 500...", status: 'pending' as const },
        { id: 3, text: isZh ? "執行王道利他模擬演算法..." : "Executing Wangdao Altruism sim...", status: 'pending' as const },
    ];
    setThinkingSteps(steps);
    
    addToast('info', isZh ? `正在啟動 [${tool.name}] 深度分析...` : `Initiating [${tool.name}] analysis...`, 'Advisory');
    
    try {
        // Step 1 Finish
        await new Promise(r => setTimeout(r, 800));
        setThinkingSteps(prev => prev.map(s => s.id === 1 ? {...s, status: 'done'} : s));
        
        const prompt = `你現在是 ESGss 首席顧問。請針對「${tool.name}」模組，為當前企業提供深度策略建議。請展現你的推理過程。語系：${isZh ? '繁體中文' : 'English'}`;
        const stream = streamChat(prompt, language, "你是一位國際頂尖的 ESG 戰略顧問，擅長運用各種商管工具產出具備利他精神的建議。", [], [], 'gemini-3-pro-preview');
        
        let fullRes = '';
        for await (const chunk of stream) {
            if (fullRes === '') {
                setThinkingSteps(prev => prev.map(s => s.id === 2 ? {...s, status: 'done'} : s));
            }
            fullRes += chunk.text || '';
            setAnalysisResult(fullRes);
            outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
        }
        
        setThinkingSteps(prev => prev.map(s => s.id === 3 ? {...s, status: 'done'} : s));
        observeAction('ADVISORY_EXEC', tool.name);
    } catch (e) {
        addToast('error', 'Kernel Logic Interrupted', 'Error');
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Briefcase}
            title={{ zh: '整合顧問實驗室', en: 'Integrated Advisory Lab' }}
            description={{ zh: 'AI × 專業商管工具：產出具備「王道利他」精神的企業永續建議', en: 'AI × Consulting Tools: Manifesting Wangdao-driven Sustainability' }}
            language={language}
            tag={{ zh: '顧問內核 v16.0', en: 'ADVISORY_V16.0' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
            {/* Left: Tools Grid (3/12) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 overflow-hidden">
                <div className="glass-bento p-6 flex flex-col bg-slate-900/60 border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden h-full">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                         <h3 className="zh-main text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Toolcase
                        </h3>
                        <div className="uni-mini bg-slate-800 text-gray-500 uppercase text-[8px]">Ready</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                        {advisoryTools.map(tool => (
                            <button 
                                key={tool.id}
                                onClick={() => handleToolExecute(tool)}
                                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group relative overflow-hidden
                                    ${selectedTool === tool.id ? 'bg-celestial-gold/10 border-celestial-gold/40 text-white' : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-500'}
                                `}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`p-2 rounded-xl transition-all ${selectedTool === tool.id ? 'bg-celestial-gold text-black shadow-lg' : 'bg-black/40 text-gray-700'}`}>
                                        <tool.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[12px] font-black uppercase tracking-tight text-left leading-tight">{tool.name}</span>
                                </div>
                                <ChevronRight className={`w-3 h-3 transition-all ${selectedTool === tool.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Advisor Terminal (9/12) */}
            <div className="col-span-12 lg:col-span-9 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 glass-bento bg-[#020617] border-white/5 rounded-[3rem] relative overflow-hidden flex flex-col shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.03)_0%,_transparent_70%)] pointer-events-none" />
                    
                    <div className="p-6 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center shrink-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-celestial-purple/20 rounded-2xl border border-celestial-purple/30 text-celestial-purple shadow-lg">
                                <Terminal className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="zh-main text-base text-white tracking-widest uppercase">Advisor Terminal</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="en-sub !text-[7px] text-emerald-500 font-black tracking-widest uppercase">Cognitive_Engine_v16</span>
                                </div>
                            </div>
                        </div>
                        {selectedTool && (
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-gray-400 border border-white/5 transition-all flex items-center gap-2">
                                    <Download className="w-3.5 h-3.5" /> Export_Insights
                                </button>
                            </div>
                        )}
                    </div>

                    <div ref={outputRef} className="flex-1 p-10 overflow-y-auto no-scrollbar relative z-0">
                        {isAnalyzing && (
                            <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5 animate-fade-in">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-celestial-gold" /> Thinking_Chain_Active
                                </h4>
                                <div className="space-y-4">
                                    {thinkingSteps.map((step) => (
                                        <div key={step.id} className="flex items-center gap-4 transition-all">
                                            <div className={`w-2 h-2 rounded-full ${step.status === 'done' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-800 animate-pulse'}`} />
                                            <span className={`text-[11px] font-mono uppercase tracking-widest ${step.status === 'done' ? 'text-gray-300' : 'text-gray-600'}`}>{step.text}</span>
                                            {step.status === 'done' && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {analysisResult ? (
                            <div className="animate-fade-in max-w-4xl">
                                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:leading-relaxed text-gray-200">
                                    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked.parse(analysisResult) as string }} />
                                </div>
                            </div>
                        ) : !isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-10 select-none grayscale">
                                <BrainCircuit className="w-48 h-48 text-gray-600 mb-8 animate-pulse" />
                                <h3 className="zh-main text-5xl text-white uppercase tracking-[0.2em] mb-4">Awaiting Advisory Signal</h3>
                                <p className="text-gray-500 text-lg max-w-md font-light italic">「萬物歸宗，撥亂反正：選擇一個分析模組以啟動內核推理。」</p>
                            </div>
                        )}
                    </div>

                    {/* Bottom HUD decoration */}
                    <div className="p-4 border-t border-white/5 bg-slate-950/40 flex justify-between items-center shrink-0 z-10">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase">
                                <Activity className="w-3 h-3" /> System_Vital: Stable
                            </div>
                            <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase">
                                <Dna className="w-3 h-3" /> Logic_Sync: 99.8%
                            </div>
                        </div>
                        <span className="text-[9px] font-mono text-gray-700">TENSOR_CLUSTER_A9_READY</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
