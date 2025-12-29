
import React, { useState } from 'react';
import { Language } from '../types';
import { 
    Microscope, Search, Scan, Loader2, Layout, Activity, Sparkles, Hash, 
    FileJson, Database, Cpu, Globe, ArrowRight, ShieldCheck, List
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { performDeepDocAnalysis } from '../services/ai-service';

export const ResearchHub: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'deepdoc' | 'retrieval'>('deepdoc');
  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleRunDeepDoc = async () => {
      if (!inputUrl.trim()) return;
      setIsAnalyzing(true);
      addToast('info', isZh ? '啟動 DeepDoc 佈局分析引擎...' : 'Starting DeepDoc Layout Engine...', 'RAGFlow Core');
      
      try {
          // 模擬從 URL 抓取內容並解析
          const result = await performDeepDocAnalysis(`分析此目標之永續競爭力與合規現況：${inputUrl}`, language);
          setAnalysisResult(result);
          addToast('success', isZh ? '文檔深度解析完成，已識別語義切片' : 'Analysis complete, chunks identified', 'Kernel');
      } catch (e) {
          addToast('error', 'DeepDoc Analysis Interrupted', 'Error');
      } finally {
          setIsAnalyzing(false);
      }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-12 overflow-hidden">
        <UniversalPageHeader 
            icon={Microscope}
            title={{ zh: 'DeepDoc 智慧研究中心', en: 'DeepDoc Research Hub' }}
            description={{ zh: '基於 RAGFlow 內核：深度佈局分析、語義切片與混合檢索', en: 'Deep Layout Analysis, Semantic Chunking & Hybrid Retrieval' }}
            language={language}
            tag={{ zh: 'RAG 引擎 v16.1', en: 'RAG_ENGINE_V16.1' }}
        />

        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-white/5 w-fit backdrop-blur-xl shrink-0">
            {[
                { id: 'deepdoc', label: isZh ? 'DeepDoc 解析' : 'DeepDoc Parse', icon: Layout },
                { id: 'retrieval', label: isZh ? '混合檢索' : 'Hybrid Retrieval', icon: Globe },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            {/* 左側：解析主控台 */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0">
                <div className="glass-bento p-8 flex flex-col bg-slate-900/40 relative overflow-hidden shadow-2xl flex-1 rounded-[3rem]">
                    <div className="flex gap-4 mb-8 shrink-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                value={inputUrl}
                                onChange={e => setInputUrl(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-1 focus:ring-celestial-blue outline-none"
                                placeholder={isZh ? "輸入企業網址、報告標題或知識點..." : "Enter URL, report title or topic..."}
                            />
                        </div>
                        <button 
                            onClick={handleRunDeepDoc}
                            disabled={isAnalyzing || !inputUrl}
                            className="px-10 bg-celestial-blue text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
                            {isZh ? '啟動分析' : 'RUN_ANALYSIS'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                        {analysisResult ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl">
                                    <div className="text-[10px] font-black text-celestial-gold uppercase mb-2">Executive_Summary</div>
                                    <p className="text-gray-200 leading-relaxed italic">"{analysisResult.summary}"</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <Hash className="w-4 h-4" /> Semantic Chunks Identified
                                    </h4>
                                    {analysisResult.chunks.map((chunk: any, i: number) => (
                                        <div key={i} className="p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-celestial-blue/30 transition-all">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono text-gray-600">ID: {chunk.id}</span>
                                                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10 uppercase">{chunk.tag}</span>
                                                </div>
                                                <span className="text-[10px] text-emerald-400 font-bold">RELEVANCE: {(chunk.score * 100).toFixed(0)}%</span>
                                            </div>
                                            <p className="text-sm text-gray-400 font-light leading-relaxed">{chunk.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : isAnalyzing ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                                <Activity className="w-12 h-12 text-celestial-blue animate-pulse" />
                                <p className="en-sub">Parsing layout structures...</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 text-center grayscale">
                                <Database className="w-32 h-32 mb-8" />
                                <h4 className="zh-main text-3xl uppercase tracking-widest text-white">Awaiting Ingestion</h4>
                                <p className="text-lg text-gray-400 mt-2 font-light italic">"Quality in, quality out. DeepDoc logic active."</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 右側：RAG 效能指標 */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-8 bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Cpu className="w-32 h-32" /></div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                        <Activity className="w-4 h-4" /> ENGINE_VITALS
                    </h4>
                    <div className="space-y-6 relative z-10">
                        <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-black mb-2">Recall_Accuracy</div>
                            <div className="text-3xl font-mono font-bold text-emerald-400">99.4%</div>
                        </div>
                        <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-black mb-2">Retrieval_Latency</div>
                            <div className="text-3xl font-mono font-bold text-celestial-blue">142ms</div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 bg-slate-900/60 border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <FileJson className="w-4 h-4" /> AGENTIC_TRACES
                    </h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 font-mono text-[9px] text-gray-600">
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                            <div className="text-emerald-500">[2025.03.10 14:10:02] SYNC_OK</div>
                            <div className="text-gray-400">> Fetched raw content from endpoint</div>
                            <div className="text-gray-400">> Applied Layout-Aware Chunking (DeepDoc)</div>
                            <div className="text-blue-400">> Vectorized to Infinity Engine</div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                            <div className="text-emerald-500">[2025.03.10 14:10:05] INDEX_READY</div>
                            <div className="text-gray-400">> Knowledge Base Updated</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
