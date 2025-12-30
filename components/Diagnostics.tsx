
import React, { useState, useEffect, useRef } from 'react';
import { 
    Activity, ShieldCheck, Zap, Layers, Binary, 
    RefreshCw, Loader2, Check, Gavel, Cpu, HardDrive, Terminal, Code,
    AlertTriangle, Search, FileSearch, ShieldAlert, Sparkles, Wand2,
    Database, Network, Fingerprint, TrendingDown, ChevronRight,
    CheckCircle
} from 'lucide-react';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, 
    PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip 
} from 'recharts';
import { Language, DimensionProtocol, UnitTestResult } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';

export const Diagnostics: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [dimensions, setDimensions] = useState<DimensionProtocol[]>([]);
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  const [syncRate, setSyncRate] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [unitTests, setUnitTests] = useState<UnitTestResult[]>([]);
  const [anomalies, setAnomalies] = useState<{id: string, type: 'critical'|'warning', title: string, desc: string, fix: string}[]>([]);
  const [showReport, setShowReport] = useState(false);
  
  useEffect(() => {
      const sub1 = universalIntelligence.dimensions$.subscribe(setDimensions);
      const sub2 = universalIntelligence.syncRate$.subscribe(setSyncRate);
      const sub3 = universalIntelligence.unitTests$.subscribe(setUnitTests);
      const sub4 = universalIntelligence.vitals$.subscribe(setVitals);
      return () => { 
        sub1.unsubscribe(); sub2.unsubscribe(); sub3.unsubscribe(); sub4.unsubscribe();
      };
  }, []);

  const scanSequence = [
    { label: isZh ? '初始化 12A 權能維度' : 'Initializing 12A Dimensions', icon: Layers },
    { label: isZh ? '執行向量一致性對標 (RAGFlow)' : 'Vector Consistency Check', icon: Database },
    { label: isZh ? '稽核軌跡 SHA-256 完整性核驗' : 'Audit Trail Hash Verification', icon: ShieldCheck },
    { label: isZh ? '神經反射總線效能壓力測試' : 'Neural Reflex Stress Test', icon: Activity }
  ];

  const handleStartFullScan = async () => {
      setIsScanning(true);
      setShowReport(false);
      setAnomalies([]);
      setScanStep(0);
      addToast('info', isZh ? '啟動全系統深度診斷掃描...' : 'Initiating Deep System Diagnostic...', 'Kernel');

      for (let i = 0; i < scanSequence.length; i++) {
          setScanStep(i);
          universalIntelligence.broadcastNeuralSignal('Diagnostics', 'DATA_COLLISION', 0.8);
          await new Promise(r => setTimeout(r, 1000));
      }

      setAnomalies([
          { 
              id: 'ERR_082', 
              type: 'critical', 
              title: isZh ? '邏輯熵值過高' : 'Logical Entropy Drift',
              desc: isZh ? '維度 A5 偵測到邏輯隨機性超出閾值。' : 'Dimension A5 detected randomness exceeding threshold.',
              fix: isZh ? '執行「內核摺疊」重置隨機性種子。' : 'Execute Kernel Folding to reset seed.'
          },
          { 
              id: 'WRN_421', 
              type: 'warning', 
              title: isZh ? '向量庫索引延遲' : 'Vector Index Latency',
              desc: isZh ? 'Infinity 引擎解析出現毫秒級阻塞。' : 'Infinity Engine reporting ms blockage.',
              fix: isZh ? '重新分配 Tensor 資源池。' : 'Reallocate Tensor pool.'
          }
      ]);
      setIsScanning(false);
      setShowReport(true);
      universalIntelligence.runSystemWitness();
      addToast('warning', isZh ? '診斷完成，偵測到異常。' : 'Scan complete. Anomalies found.', 'Security');
  };

  const radarData = vitals ? [
      { subject: isZh ? '完整性' : 'Integrity', A: vitals.integrityScore, fullMark: 100 },
      { subject: isZh ? '負熵值' : 'Entropy', A: (1 - vitals.entropy) * 100, fullMark: 100 },
      { subject: isZh ? '感知' : 'Sense', A: vitals.trinity.perception, fullMark: 100 },
      { subject: isZh ? '認知' : 'Think', A: vitals.trinity.cognition, fullMark: 100 },
      { subject: isZh ? '行動' : 'Action', A: vitals.trinity.action, fullMark: 100 },
  ] : [];

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-12 overflow-hidden">
        <UniversalPageHeader 
            icon={Binary}
            title={{ zh: '系統診斷與邏輯見證', en: 'Diagnostics & Logic Witness' }}
            description={{ zh: '全域異常監控與內核健康評估：確保 AIOS 的 100% 邏輯完整性', en: 'Global Anomaly Monitoring & Kernel Health Assessment' }}
            language={language}
            tag={{ zh: '架構核心 v16.1', en: 'ARCH_CORE_V16.1' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0 overflow-hidden">
                <div className="glass-bento p-8 bg-slate-900/60 border-white/5 relative overflow-hidden flex flex-col shadow-2xl rounded-[3rem] flex-1">
                    {isScanning && <div className="scan-overlay opacity-20" />}
                    <div className="flex justify-between items-center mb-10 shrink-0 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-celestial-blue/20 rounded-2xl text-celestial-blue border border-celestial-blue/30"><Search className={`w-7 h-7 ${isScanning ? 'animate-pulse' : ''}`} /></div>
                            <div>
                                <h3 className="zh-main text-2xl text-white">{isZh ? '內核狀態掃描' : 'Kernel Status Scan'}</h3>
                                <div className="flex items-center gap-2 mt-1"><div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-celestial-blue animate-ping' : 'bg-emerald-500'}`} /><span className="en-sub !text-[8px] text-gray-500 font-black uppercase">{isScanning ? 'SCAN_IN_PROGRESS' : 'SYSTEM_READY'}</span></div>
                            </div>
                        </div>
                        <button onClick={handleStartFullScan} disabled={isScanning} className="px-10 py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-celestial-gold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 uppercase tracking-widest text-xs">
                            {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />} {isZh ? '啟動全系統掃描' : 'BOOT_SCAN'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pr-2">
                        {isScanning ? (
                            <div className="space-y-12 py-10 flex flex-col items-center">
                                <div className="relative">
                                    <div className="w-48 h-48 rounded-full border-4 border-white/5 flex items-center justify-center"><div className="w-40 h-40 rounded-full border-2 border-dashed border-celestial-blue/30 animate-[spin_8s_linear_infinite]" /></div>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col"><span className="text-4xl font-mono font-bold text-white">{(scanStep + 1) * 25}%</span><span className="text-[8px] text-gray-500 font-black uppercase">Analyzing...</span></div>
                                </div>
                                <div className="w-full max-w-md space-y-4">
                                    {scanSequence.map((step, i) => (
                                        <div key={i} className={`flex items-center gap-5 p-4 rounded-2xl border transition-all duration-500 ${scanStep >= i ? 'bg-white/5 border-white/10' : 'opacity-20'}`}>
                                            <step.icon className={`w-5 h-5 ${scanStep === i ? 'text-celestial-blue animate-bounce' : scanStep > i ? 'text-emerald-500' : 'text-gray-600'}`} />
                                            <span className={`zh-main text-sm ${scanStep === i ? 'text-white' : 'text-gray-400'}`}>{step.label}</span>
                                            {scanStep > i && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : showReport ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5">
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-rose-500" /> ANOMALY_DETECTION_REPORT</h4>
                                    <div className="space-y-4">
                                        {anomalies.map((ano) => (
                                            <div key={ano.id} className={`p-6 rounded-[2rem] border relative overflow-hidden group transition-all hover:scale-[1.01] ${ano.type === 'critical' ? 'bg-rose-500/5 border-rose-500/30' : 'bg-amber-500/5 border-amber-500/30'}`}>
                                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><ShieldAlert className="w-16 h-16" /></div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${ano.type === 'critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-black'}`}>{ano.type}</span>
                                                        <h5 className="zh-main text-lg text-white">{ano.title}</h5>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-6 font-light leading-relaxed">{ano.desc}</p>
                                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex items-start gap-4">
                                                    <Wand2 className="w-5 h-5 text-celestial-gold shrink-0 mt-0.5" />
                                                    <div className="text-[11px] text-gray-300 italic"><b className="text-white not-italic uppercase text-[8px] block mb-1">AI_Correction_Protocol:</b> {ano.fix}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center pb-6"><button onClick={() => setShowReport(false)} className="text-gray-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Acknowledge & Close Report</button></div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale py-20"><Fingerprint className="w-32 h-32 text-white mb-8" /><h4 className="zh-main text-3xl uppercase tracking-widest text-white">System ID Required</h4><p className="text-lg text-gray-400 mt-2 font-light italic">"Run scan to align logical dimensions."</p></div>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-8 bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Cpu className="w-32 h-32 text-white" /></div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Activity className="w-4 h-4" /> KERNEL_VITALS_VISUALIZER</h4>
                    
                    <div className="h-64 w-full relative z-10">
                        {/* Fix: Added minWidth={0} to ResponsiveContainer to avoid width -1 warning */}
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Vitals" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} animationBegin={0} animationDuration={1500} />
                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4 relative z-10 mt-6">
                        <div className="p-4 bg-white/[0.02] rounded-[1.5rem] border border-white/5 flex flex-col gap-1">
                            <div className="flex justify-between text-[8px] text-gray-500 uppercase font-black">Neural_Sync_Rate</div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-mono font-bold text-emerald-400">{syncRate}%</div>
                                <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden mb-2"><div className="h-full bg-emerald-500 animate-pulse" style={{ width: `${syncRate}%` }} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 bg-slate-900/40 border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3"><Terminal className="w-4 h-4" /> 12A_DIMENSION_STATUS</h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-3 gap-2 pr-2">
                        {dimensions.map(dim => (
                            <div key={dim.id} className="p-3 rounded-xl bg-black/40 border border-white/5 hover:border-celestial-blue/30 transition-all flex flex-col gap-2">
                                <div className="flex justify-between items-center"><span className="text-[8px] font-mono text-gray-600 font-black">{dim.id}</span><div className={`w-1.5 h-1.5 rounded-full ${dim.integrity > 95 ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : dim.integrity > 85 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'}`} /></div>
                                <div className="text-[10px] font-bold text-white truncate">{dim.name}</div>
                                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-current opacity-40" style={{ width: `${dim.integrity}%`, color: dim.integrity > 95 ? '#10b981' : '#fbbf24' }} /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
