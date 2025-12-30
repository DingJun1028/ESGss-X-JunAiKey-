
import React, { useEffect, useState, useRef } from 'react';
import { universalIntelligence, SystemVital, MCPRegistryItem } from '../services/evolutionEngine';
import { 
    Activity, Database, Cpu, Network, Zap, Server, BrainCircuit, MemoryStick, 
    HardDrive, Box, ShieldCheck, FileText, CheckCircle, TrendingUp, History, 
    Search, Loader2, Sparkles, AlertCircle, ArrowUpRight, Share2, Terminal, Code2, ShieldAlert,
    FastForward, Layers, Layout, Globe, Settings, Cpu as Processor
} from 'lucide-react';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { Language } from '../types';

interface UniversalBackendProps {
    language: Language;
}

const MetricCard = React.memo(({ icon, label, value, subtext, color, progress }: any) => {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500',
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500',
    purple: 'text-purple-400 border-purple-500/20 bg-purple-500',
    rose: 'text-rose-400 border-red-500/20 bg-red-500',
    blue: 'text-blue-400 border-blue-500/20 bg-blue-500',
    gold: 'text-celestial-gold border-amber-500/20 bg-amber-500',
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900/40 border ${colorMap[color].split(' ')[1]} p-6 rounded-2xl hover:bg-slate-800/40 transition-all duration-500 group shadow-lg`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-slate-950 ${colorMap[color].split(' ')[0]}`}>
          {icon}
        </div>
        <span className="text-xs font-black uppercase text-slate-500 tracking-widest">{label}</span>
      </div>
      <div className="text-3xl font-black text-white mb-1 font-mono tracking-tighter">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{subtext}</div>
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${colorMap[color].split(' ')[2]}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
    </div>
  );
});

const UniversalBackend: React.FC<UniversalBackendProps> = ({ language }) => {
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  const [activeTab, setActiveTab] = useState<'monitor' | 'ragflow' | 'registry'>('monitor');
  const [reflexes, setReflexes] = useState<any[]>([]);
  const isZh = language === 'zh-TW';
  const reflexEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sub1 = universalIntelligence.vitals$.subscribe(setVitals);
    const sub3 = universalIntelligence.reflex$.subscribe(reflex => {
        setReflexes(prev => [...prev, { ...reflex, id: Date.now() }].slice(-50));
    });
    return () => { sub1.unsubscribe(); sub3.unsubscribe(); };
  }, []);

  useEffect(() => {
      reflexEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reflexes]);

  const pageData = {
      title: { zh: 'AIOS 萬能核心中樞', en: 'AIOS Nexus Core' },
      desc: { zh: 'RAGFlow v0.23 全棧整合：內核參數監控與 Docker 組件矩陣', en: 'RAGFlow v0.23 Integration: Kernel Vitals & Docker Matrix' },
      tag: { zh: '核心版本 v16.1', en: 'KERNEL_V16.1' }
  };

  if (!vitals) return <div className="flex h-screen items-center justify-center text-cyan-500 font-mono animate-pulse">AIOS Kernel Handshaking...</div>;

  return (
    <div className="relative w-full min-h-screen bg-[#020617] overflow-hidden font-mono text-cyan-400 selection:bg-cyan-500/30 flex flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="px-8 pt-8 shrink-0 z-10">
          <UniversalPageHeader icon={BrainCircuit} title={pageData.title} description={pageData.desc} language={language} tag={pageData.tag} />
      </div>

      <div className="flex gap-4 border-b border-white/10 px-8 py-4 z-10 shrink-0">
          {[
              { id: 'monitor', label: isZh ? '全域監控' : 'Monitor', icon: Activity },
              { id: 'ragflow', label: isZh ? 'RAG 參數' : 'RAG Params', icon: Database },
              { id: 'registry', label: isZh ? '組件狀態' : 'Registry', icon: HardDrive }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === tab.id ? 'text-celestial-gold border-celestial-gold' : 'text-gray-500 border-transparent hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
          ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10 no-scrollbar">
        {activeTab === 'monitor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <MetricCard icon={<Processor className="w-5 h-5" />} label={isZh ? "量子同步率" : "Neural Sync"} value="98.4%" subtext={isZh ? "跨模態一致性" : "Consistency"} color="cyan" progress={98.4} />
                    <MetricCard icon={<Database className="w-5 h-5" />} label={isZh ? "向量庫飽和度" : "Vector Saturation"} value="42.1%" subtext={isZh ? "Infinity Engine" : "Infinity Engine"} color="gold" progress={42.1} />
                    <MetricCard icon={<Zap className="w-5 h-5" />} label={isZh ? "響應延遲" : "Latency"} value="12ms" subtext={isZh ? "核心神經傳導" : "Reflex Delay"} color="emerald" progress={12} />
                </div>
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 bg-black/60 flex flex-col h-[600px] overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><Share2 className="w-4 h-4" /> Neural Trace Stream (Agentic Reflex)</h3>
                            <div className="text-[10px] text-emerald-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE_REFLEX_BUS</div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 font-mono text-[10px]">
                            {reflexes.length === 0 && <div className="text-gray-800 italic">Waiting for kernel signals...</div>}
                            {reflexes.map((r) => (
                                <div key={r.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl animate-fade-in flex gap-4 hover:bg-white/[0.05] transition-colors">
                                    <span className="text-gray-700 shrink-0">[{new Date(r.id).toLocaleTimeString()}]</span>
                                    <span className={`font-black uppercase shrink-0 ${r.type === 'EVOLUTION' ? 'text-emerald-400' : 'text-celestial-purple'}`}>{r.type}</span>
                                    <span className="text-white shrink-0">&lt;{r.source}&gt;</span>
                                    <span className="text-gray-400 truncate flex-1">{JSON.stringify(r.payload)}</span>
                                </div>
                            ))}
                            <div ref={reflexEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'ragflow' && (
            <div className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <MetricCard icon={<Layout className="w-5 h-5" />} label="Parsing Logic" value="DeepDoc" subtext="Layout-Aware Splitting" color="blue" />
                    <MetricCard icon={<Database className="w-5 h-5" />} label="Search Mode" value="Hybrid" subtext="BM25 + Vector Search" color="emerald" />
                    <MetricCard icon={<Processor className="w-5 h-5" />} label="Embedding Core" value="TEI" subtext="Port 6380 (Qwen-0.6B)" color="purple" />
                </div>
                
                <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 bg-slate-900/60 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Settings className="w-32 h-32 text-white" /></div>
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 tracking-widest uppercase"><Settings className="w-6 h-6 text-celestial-gold" /> Environment Parameters Matrix (.env)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { k: 'MEM_LIMIT', v: '16 GB', s: 'Server Memory Cap' },
                            { k: 'DOC_ENGINE', v: 'infinity', s: 'Vector Store Backend' },
                            { k: 'SVR_HTTP_PORT', v: '9380', s: 'Kernel API Entry' },
                            { k: 'ES_PORT', v: '1200', s: 'Full-text Search Port' },
                            { k: 'TEI_MODEL', v: 'Qwen3-Emb', s: 'Embedding Model' },
                            { k: 'MYSQL_PORT', v: '5455', s: 'Metadata Storage' },
                            { k: 'MINIO_PORT', v: '9001', s: 'Object Storage' },
                            { k: 'REDIS_PORT', v: '6379', s: 'Cache Layer' },
                        ].map((spec, i) => (
                            <div key={i} className="p-5 bg-black/40 rounded-3xl border border-white/5 group hover:border-celestial-gold transition-all">
                                <div className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest">{spec.k}</div>
                                <div className="text-2xl font-mono font-bold text-white tracking-tighter">{spec.v}</div>
                                <div className="text-[9px] text-celestial-blue font-bold uppercase mt-1">{spec.s}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'registry' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                 {[
                     { name: 'Elasticsearch (es01)', status: 'Healthy', port: '1200', version: '8.11.3', load: '12%' },
                     { name: 'Infinity (infinity)', status: 'Active', port: '9000', version: 'v1.0-RC', load: '8%' },
                     { name: 'MySQL (mysql)', status: 'Healthy', port: '5455', version: '8.0', load: '15%' },
                     { name: 'MinIO (minio)', status: 'Healthy', port: '9001', version: 'Latest', load: '2%' },
                     { name: 'Redis (redis)', status: 'Healthy', port: '6379', version: '6.2+', load: '4%' },
                     { name: 'TEI Service (tei)', status: 'Healthy', port: '6380', version: 'Qwen3-0.6B', load: '45%' },
                     { name: 'RAGFlow Server', status: 'Online', port: '9380', version: 'v0.23', load: '32%' }
                 ].map(svc => (
                     <div key={svc.name} className="p-8 bg-slate-900/60 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 group hover:border-celestial-gold/50 transition-all shadow-xl relative overflow-hidden">
                         <div className="flex justify-between items-center relative z-10">
                             <h4 className="text-white font-black text-lg tracking-tight">{svc.name}</h4>
                             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20 shadow-lg">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {svc.status}
                             </div>
                         </div>
                         <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6 relative z-10">
                             <div>
                                 <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">TCP_PORT</div>
                                 <div className="text-base font-mono text-gray-300 font-bold">{svc.port}</div>
                             </div>
                             <div>
                                 <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">CPU_LOAD</div>
                                 <div className="text-base font-mono text-emerald-500 font-bold">{svc.load}</div>
                             </div>
                         </div>
                         <div className="text-[10px] text-gray-700 font-mono uppercase tracking-widest">ImageTag: {svc.version}</div>
                     </div>
                 ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default UniversalBackend;
