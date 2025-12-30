
import React, { useState } from 'react';
import { Language } from '../types';
import { 
    Microscope, Search, Scan, Loader2, Layout, Activity, Sparkles, Hash, 
    FileJson, Database, Cpu, Globe, ArrowRight, ShieldCheck, List, FileText, Table, 
    ChevronDown, Info, Zap
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { performDeepDocAnalysis } from '../services/ai-service';

export const ResearchHub: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'deepdoc' | 'retrieval' | 'agent'>('deepdoc');
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleRunDeepDoc = async () => {
      if (!inputQuery.trim()) return;
      setIsAnalyzing(true);
      addToast('info', isZh ? '啟動 RAGFlow DeepDoc 佈局分析引擎...' : 'Starting RAGFlow DeepDoc Engine...', 'RAGFlow Core');
      
      try {
          const result = await performDeepDocAnalysis(`執行企業永續文檔結構化分析：${inputQuery}`, language);
          setAnalysisResult(result);
          addToast('success', isZh ? '文檔深度解析完成，切片與索引已同步至 Infinity' : 'DeepDoc Parse complete, indexed to Infinity', 'Kernel');
      } catch (e) {
          addToast('error', 'RAG Engine Interrupted during parsing.', 'Error');
      } finally {
          setIsAnalyzing(false);
      }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-12 overflow-hidden">
        <UniversalPageHeader 
            icon={Microscope}
            title={{ zh: 'RAGFlow 智慧研究中心', en: 'RAGFlow Research Hub' }}
            description={{ zh: '基於 DeepDoc：深度佈局分析、語義切片與多路召回 (Infinity Engine)', en: 'DeepDoc Layout Analysis, Chunking & Hybrid Retrieval' }}
            language={language}
            tag={{ zh: 'RAG 引擎 v0.23', en: 'RAG_ENGINE_v0.23' }}
        />

        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-white/5 w-fit backdrop-blur-xl shrink-0">
            {[
                { id: 'deepdoc', label: isZh ? 'DeepDoc 解析' : 'DeepDoc Parse', icon: Layout },
                { id: 'retrieval', label: isZh ? '混合檢索' : 'Hybrid Retrieval', icon: Globe },
                { id: 'agent', label: isZh ? 'Agent 工作流' : 'Agentic Workflow', icon: Activity },
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
                                value={inputQuery}
                                onChange={e => setInputQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleRunDeepDoc()}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 pl-12 text-white focus:ring-1 focus:ring-celestial-blue outline-none transition-all placeholder:text-gray-600"
                                placeholder={isZh ? "輸入企業網址、PDF 內容或知識查詢..." : "Enter URL, PDF content or query..."}
                            />
                        </div>
                        <button 
                            onClick={handleRunDeepDoc}
                            disabled={isAnalyzing || !inputQuery}
                            className="px-10 bg-celestial-blue text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50 shadow-xl shadow-blue-900/20"
                        >
                            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
                            {isZh ? '啟動 DeepDoc' : 'RUN_DEEPDOC'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                        {analysisResult ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-20 h-20 text-emerald-400" /></div>
                                    <div className="text-[10px] font-black text-celestial-gold uppercase mb-2 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> Semantic_Context_Summary
                                    </div>
                                    <p className="text-gray-200 leading-relaxed italic text-lg">"{analysisResult.summary}"</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-2">
                                        <List className="w-4 h-4" /> Identified Chunks (RAGFlow Cluster)
                                    </h4>
                                    {analysisResult.chunks.map((chunk: any, i: number) => (
                                        <div key={i} className="p-5 bg-black/40 border border-white/5 rounded-[2rem] group hover:border-celestial-blue/40 transition-all flex gap-5">
                                            <div className="shrink-0 flex flex-col items-center">
                                                <div className={`p-3 rounded-2xl bg-white/5 ${chunk.tag === 'Table' ? 'text-blue-400' : chunk.tag === 'Header' ? 'text-purple-400' : 'text-emerald-400'}`}>
                                                    {chunk.tag === 'Table' ? <Table className="w-6 h-6" /> : chunk.tag === 'Header' ? <Info className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                                </div>
                                                <span className="text-[8px] font-mono text-gray-600 mt-2 uppercase">IDX_{i+1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-mono text-gray-400">CHUNK_{chunk.id || 'N/A'}</span>
                                                        <span className={`text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 uppercase font-black`}>{chunk.tag}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] text-emerald-400 font-bold uppercase">Recall_Score:</span>
                                                        <span className="text-xs font-mono text-emerald-400 font-bold">{(chunk.score * 100).toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400 font-light leading-relaxed">{chunk.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : isAnalyzing ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-80">
                                <div className="relative">
                                    <Activity className="w-20 h-20 text-celestial-blue animate-pulse" />
                                    <div className="absolute inset-0 border-2 border-dashed border-celestial-blue/30 rounded-full animate-[spin_4s_linear_infinite]" />
                                </div>
                                <div className="text-center">
                                    <p className="zh-main text-white text-xl mb-1">DeepDoc 佈局解析中...</p>
                                    <p className="en-sub !opacity-100 text-blue-400 font-black">Executing OCR & Structural Decomposition</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 text-center grayscale">
                                <Database className="w-32 h-32 mb-8" />
                                <h4 className="zh-main text-3xl uppercase tracking-widest text-white">Awaiting Knowledge Influx</h4>
                                <p className="text-lg text-gray-400 mt-2 font-light italic">"Data is the entropy, context is the light."</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 右側：RAG 效能指標 */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-8 bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Cpu className="w-32 h-32 text-white" /></div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                        <Activity className="w-4 h-4" /> RAG_ENGINE_VITALS
                    </h4>
                    <div className="space-y-6 relative z-10">
                        <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5">
                            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-black mb-2">Hybrid_Recall (BM25+Dense)</div>
                            <div className="text-3xl font-mono font-bold text-emerald-400">99.42%</div>
                        </div>
                        <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5">
                            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-black mb-2">DeepDoc_Parsing_Latency</div>
                            <div className="text-3xl font-mono font-bold text-celestial-blue">1.2s/page</div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 bg-slate-900/60 border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <FileJson className="w-4 h-4" /> ENGINE_EVENT_STREAM
                    </h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 font-mono text-[9px] text-gray-600">
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                            <div className="text-emerald-500">[SYSTEM_OK] infinity:9000</div>
                            <div className="text-gray-400">> Syncing knowledge shards to Vector Core</div>
                            <div className="text-gray-400">> Mode: Multi-path Hybrid Search Enabled</div>
                        </div>
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                            <div className="text-emerald-500">[SYSTEM_OK] es01:1200</div>
                            <div className="text-gray-400">> Full-text BM25 index healthy</div>
                        </div>
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                            <div className="text-blue-400">[SERVICE_INFO] tei:6380</div>
                            <div className="text-gray-400">> Qwen3-Embedding inference active</div>
                        </div>
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                            <div className="text-gray-500">[IDLE] minio:9001</div>
                            <div className="text-gray-400">> Object storage heartbeat stable</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
