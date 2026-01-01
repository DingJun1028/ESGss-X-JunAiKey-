
import React, { useState, useEffect, useRef } from 'react';
import { Language, QuantumNode, UniversalKnowledgeNode } from '../types';
import { 
    Microscope, Search, Scan, Loader2, Layout, Activity, Sparkles, Hash, 
    FileJson, Database, Cpu, Globe, ArrowRight, ShieldCheck, List, FileText, Table, 
    ChevronDown, Info, Zap, X, Terminal, Filter, Box
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { performDeepDocAnalysis } from '../services/ai-service';
import { universalIntelligence } from '../services/evolutionEngine';

export const ResearchHub: React.FC<{ language: Language, setGlobalAnalysisResult?: (result: any) => void }> = ({ language, setGlobalAnalysisResult }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'deepdoc' | 'retrieval' | 'agent'>('deepdoc');
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [allNodes, setAllNodes] = useState<UniversalKnowledgeNode[]>([]);
  const [nodeSearch, setNodeSearch] = useState('');
  const [suggestions, setSuggestions] = useState<QuantumNode[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      setAllNodes(universalIntelligence.getAllNodes());
      const sub = universalIntelligence.reflex$.subscribe(() => setAllNodes(universalIntelligence.getAllNodes()));
      return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
      if (inputQuery.trim().length > 1) {
          const keywords = inputQuery.split(/\s+/).filter(k => k.length > 1);
          const nodes = universalIntelligence.retrieveContextualNodes({ keywords });
          setSuggestions(nodes);
          setShowSuggestions(nodes.length > 0);
      } else {
          setSuggestions([]);
          setShowSuggestions(false);
      }
  }, [inputQuery]);

  const handleRunDeepDoc = async (overrideQuery?: string) => {
      const query = overrideQuery || inputQuery;
      if (!query.trim()) return;
      setIsAnalyzing(true); setShowSuggestions(false);
      addToast('info', isZh ? '啟動 RAGFlow DeepDoc 解析...' : 'Starting RAGFlow DeepDoc...', 'RAGFlow');
      try {
          const result = await performDeepDocAnalysis(`執行企業永續文檔結構化分析：${query}`, language);
          setAnalysisResult(result);
          setGlobalAnalysisResult?.(result);
          addToast('success', isZh ? '文檔深度解析完成' : 'DeepDoc Parse complete', 'Kernel');
      } catch (e) { addToast('error', 'Parsing Fault', 'Error'); }
      finally { setIsAnalyzing(false); }
  };

  return (
    <div className="h-full flex flex-col space-y-2 animate-fade-in overflow-hidden">
        <div className="shrink-0 pb-1 border-b border-white/5">
            <UniversalPageHeader 
                icon={Microscope}
                title={{ zh: 'RAGFlow 智慧研究中心', en: 'RAGFlow Research Hub' }}
                description={{ zh: '基於 DeepDoc 深度佈局分析與多路召回引擎', en: 'DeepDoc Layout Analysis & Hybrid Retrieval' }}
                language={language}
                tag={{ zh: 'RAG 引擎 v0.23', en: 'RAG_ENGINE_v0.23' }}
            />
        </div>

        {/* 檢索終端佈局 - 移除所有外層捲動 */}
        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden pb-4">
            
            {/* 左側：解析與結果主控台 (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-3 min-h-0 overflow-hidden">
                <div className="glass-bento p-6 flex flex-col bg-slate-900/40 relative overflow-hidden shadow-2xl flex-1 rounded-[2.5rem]">
                    <div className="flex gap-3 mb-6 shrink-0 relative z-30">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-celestial-blue" />
                            <input 
                                value={inputQuery}
                                onChange={e => setInputQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleRunDeepDoc()}
                                className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 pl-12 text-xs text-white focus:border-celestial-blue outline-none transition-all placeholder:text-gray-800"
                                placeholder={isZh ? "輸入企業網址、PDF 或查詢..." : "Enter URL, PDF or query..."}
                            />
                            {showSuggestions && (
                                <div ref={suggestionRef} className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-50 max-h-48 overflow-y-auto no-scrollbar">
                                    {suggestions.map((s, i) => (
                                        <button key={i} onClick={() => { setInputQuery(s.atom); setShowSuggestions(false); handleRunDeepDoc(s.atom); }} className="w-full p-4 text-left hover:bg-white/5 transition-all flex gap-3 items-center">
                                            <Hash className="w-3 h-3 text-celestial-gold" />
                                            <span className="text-[10px] text-gray-300 truncate">{s.atom}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => handleRunDeepDoc()} disabled={isAnalyzing || !inputQuery} className="px-8 bg-celestial-blue text-white font-black rounded-xl flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest">
                            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />} RUN
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar pr-1 relative">
                        {analysisResult ? (
                            <div className="animate-fade-in space-y-4 pb-10">
                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl relative overflow-hidden">
                                    <div className="text-[9px] font-black text-celestial-gold uppercase mb-2">Context_Summary</div>
                                    <p className="text-gray-300 leading-relaxed italic text-base">"{analysisResult.summary}"</p>
                                </div>
                                <div className="space-y-2">
                                    {analysisResult.chunks.map((chunk: any, i: number) => (
                                        <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-celestial-blue/30 transition-all flex gap-4">
                                            <div className={`p-2.5 rounded-xl bg-white/5 h-fit ${chunk.tag === 'Table' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                                {chunk.tag === 'Table' ? <Table className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[8px] font-mono text-gray-700">CH_{i+1} • {chunk.tag}</span>
                                                    <span className="text-[8px] font-mono text-emerald-400 font-bold">RECALL: {(chunk.score * 100).toFixed(0)}%</span>
                                                </div>
                                                <p className="text-[11px] text-gray-400 font-light leading-relaxed line-clamp-3">{chunk.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : isAnalyzing ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-80 gap-4">
                                <Activity className="w-12 h-12 text-celestial-blue animate-pulse" />
                                <p className="zh-main text-white text-base animate-pulse">DeepDoc 佈局解析中 (L15.9)...</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 text-center grayscale">
                                <Database className="w-24 h-24 mb-6" />
                                <h4 className="zh-main text-2xl uppercase tracking-widest text-white leading-none">Awaiting Data Influx</h4>
                                <p className="text-gray-500 mt-2 font-light italic text-sm">"Knowledge is power; context is divine."</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 右側：RAG 效能與節點瀏覽器 (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
                <div className="glass-bento p-6 bg-slate-950 border-white/10 rounded-3xl shadow-2xl shrink-0">
                    <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2 relative z-10"><Activity className="w-3 h-3 text-emerald-500" /> ENGINE_VITALS</h4>
                    <div className="space-y-3 relative z-10">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col">
                            <div className="text-[8px] text-gray-600 uppercase font-black mb-1">Hybrid_Recall</div>
                            <div className="text-2xl font-mono font-bold text-emerald-400">99.4%</div>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col">
                            <div className="text-[8px] text-gray-600 uppercase font-black mb-1">Parsing_Lat</div>
                            <div className="text-2xl font-mono font-bold text-celestial-blue">1.2s</div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-6 flex-1 bg-slate-900/60 border-white/5 rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 shrink-0"><Database className="w-3 h-3" /> KNOWLEDGE_NODES</h4>
                    <input 
                        value={nodeSearch} onChange={e => setNodeSearch(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[9px] text-white focus:border-celestial-gold outline-none mb-3 shrink-0 uppercase tracking-widest"
                        placeholder="FILTER_NODES..."
                    />
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                        {allNodes.filter(n => n.label.text.toLowerCase().includes(nodeSearch.toLowerCase())).map(node => (
                            <button key={node.id} className="w-full p-2.5 bg-white/5 border border-white/5 rounded-xl hover:border-celestial-gold/30 hover:bg-white/10 transition-all text-left flex items-center gap-3 group">
                                <Hash className="w-3 h-3 text-gray-600 group-hover:text-celestial-gold transition-colors shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <div className="text-[9px] font-bold text-gray-400 group-hover:text-white transition-colors truncate uppercase">{node.label.text}</div>
                                    <div className="text-[7px] text-gray-700 font-mono">ID: {node.id}</div>
                                </div>
                                <ArrowRight className="w-2.5 h-2.5 text-gray-800 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
