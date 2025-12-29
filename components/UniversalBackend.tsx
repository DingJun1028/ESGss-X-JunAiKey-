
import React, { useEffect, useState, useRef } from 'react';
import { universalIntelligence, SystemVital, MCPRegistryItem } from '../services/evolutionEngine';
import { 
    Activity, Database, Cpu, Network, Zap, Server, BrainCircuit, MemoryStick, 
    HardDrive, Box, ShieldCheck, FileText, CheckCircle, TrendingUp, History, 
    Search, Loader2, Sparkles, AlertCircle, ArrowUpRight, Share2, Terminal, Code2, ShieldAlert,
    FastForward, Layers, Layout
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
    rose: 'text-rose-400 border-rose-500/20 bg-rose-500',
    blue: 'text-blue-400 border-blue-500/20 bg-blue-500',
    gold: 'text-celestial-gold border-amber-500/20 bg-amber-500',
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900/40 border ${colorMap[color].split(' ')[1]} p-6 rounded-2xl hover:bg-slate-800/40 transition-all duration-500 group`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-slate-950 ${colorMap[color].split(' ')[0]}`}>
          {icon}
        </div>
        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1 font-sans">{value}</div>
      <div className="text-xs text-slate-500">{subtext}</div>
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
      desc: { zh: '整合 RAGFlow 引擎：文檔佈局解析與 Agentic Workflow 監控', en: 'RAGFlow Integration: Layout Parsing & Agentic Workflow Monitoring' },
      tag: { zh: 'KERNEL V16.1', en: 'KERNEL V16.1' }
  };

  if (!vitals) return <div className="flex h-screen items-center justify-center text-cyan-500 font-mono animate-pulse">AIOS Kernel Initializing...</div>;

  return (
    <div className="relative w-full min-h-screen bg-[#020617] overflow-hidden font-mono text-cyan-400 selection:bg-cyan-500/30 flex flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="px-8 pt-8 shrink-0 z-10">
          <UniversalPageHeader icon={BrainCircuit} title={pageData.title} description={pageData.desc} language={language} tag={pageData.tag} />
      </div>

      <div className="flex gap-4 border-b border-white/10 px-8 py-4 z-10 shrink-0">
          <button onClick={() => setActiveTab('monitor')} className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'monitor' ? 'text-celestial-gold border-b-2 border-celestial-gold' : 'text-gray-500 hover:text-white'}`}><Activity className="w-4 h-4" /> {isZh ? '核心監控' : 'Monitor'}</button>
          <button onClick={() => setActiveTab('ragflow')} className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'ragflow' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}><Database className="w-4 h-4" /> {isZh ? 'RAGFlow 引擎' : 'RAGFlow'}</button>
          <button onClick={() => setActiveTab('registry')} className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'registry' ? 'text-celestial-purple border-b-2 border-celestial-purple' : 'text-gray-500 hover:text-white'}`}><HardDrive className="w-4 h-4" /> {isZh ? '組件狀態' : 'Services'}</button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10">
        {activeTab === 'monitor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="w-full space-y-4">
                        <MetricCard icon={<Cpu className="w-5 h-5" />} label={isZh ? "上下文視窗" : "Context Window"} value={`${vitals.contextLoad.toFixed(1)}%`} subtext={isZh ? "Token 使用量" : "Token Usage"} color="cyan" progress={vitals.contextLoad} />
                        <MetricCard icon={<Database className="w-5 h-5" />} label={isZh ? "向量庫飽和度" : "Vector Saturation"} value="42.1%" subtext={isZh ? "Infinity 引擎狀態" : "Infinity Engine Status"} color="gold" progress={42.1} />
                    </div>
                </div>
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/60 flex flex-col h-[600px] overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><Share2 className="w-4 h-4" /> Neural Synapse Stream (Agentic Trace)</h3>
                            <div className="text-[10px] text-emerald-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE_REFLEX_BUS</div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 font-mono text-[10px]">
                            {reflexes.map((r) => (
                                <div key={r.id} className="p-2 bg-white/[0.02] border border-white/5 rounded-lg animate-fade-in flex gap-3">
                                    <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                                    <span className={`font-bold ${r.type === 'EVOLUTION' ? 'text-emerald-400' : 'text-celestial-purple'}`}>{r.type}</span>
                                    <span className="text-white">&lt;{r.source}&gt;</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in w-full max-w-7xl mx-auto">
                <MetricCard icon={<Layout className="w-5 h-5" />} label="DeepDoc Parse" value="Active" subtext="MinerU + Docling Engine" color="blue" />
                <MetricCard icon={<FastForward className="w-5 h-5" />} label="Retrieval Speed" value="142ms" subtext="Hybrid Search (KW+Vec)" color="emerald" />
                <MetricCard icon={<HardDrive className="w-5 h-5" />} label="Doc Engine" value="Infinity" subtext="High-performance Vector DB" color="purple" />
                
                <div className="col-span-full glass-panel p-8 rounded-[3rem] border border-white/5 bg-slate-900/60">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><Layers className="w-6 h-6 text-celestial-gold" /> RAGFlow Env Configuration</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { k: 'MEM_LIMIT', v: '16 GB', s: 'System Limit' },
                            { k: 'SVR_HTTP_PORT', v: '9380', s: 'API Gateway' },
                            { k: 'DOC_ENGINE', v: 'infinity', s: 'Vector Backend' },
                            { k: 'TEI_MODEL', v: 'Qwen-Emb-0.6B', s: 'Active Model' },
                        ].map((spec, i) => (
                            <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <div className="text-[9px] text-gray-500 font-black uppercase mb-1">{spec.k}</div>
                                <div className="text-xl font-bold text-white">{spec.v}</div>
                                <div className="text-[8px] text-celestial-blue">{spec.s}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'registry' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                 {[
                     { name: 'Elasticsearch', status: 'Healthy', port: '1200', version: '8.11.3' },
                     { name: 'Infinity', status: 'Active', port: '9000', version: 'v1.0' },
                     { name: 'MySQL', status: 'Healthy', port: '5455', version: '8.0' },
                     { name: 'MinIO', status: 'Healthy', port: '9001', version: 'Latest' },
                     { name: 'Redis', status: 'Healthy', port: '6379', version: '6+' },
                     { name: 'Kibana', status: 'Standby', port: '6601', version: '8.11.3' }
                 ].map(svc => (
                     <div key={svc.name} className="p-6 bg-slate-900/60 rounded-2xl border border-white/10 flex flex-col gap-4 group hover:border-celestial-gold/50 transition-all">
                         <div className="flex justify-between items-center">
                             <h4 className="text-white font-bold text-lg">{svc.name}</h4>
                             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                 <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> {svc.status}
                             </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                             <div>
                                 <div className="text-[9px] text-gray-500 uppercase font-black">Port</div>
                                 <div className="text-sm font-mono text-gray-300">{svc.port}</div>
                             </div>
                             <div>
                                 <div className="text-[9px] text-gray-500 uppercase font-black">Version</div>
                                 <div className="text-sm font-mono text-gray-300">{svc.version}</div>
                             </div>
                         </div>
                     </div>
                 ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default UniversalBackend;
