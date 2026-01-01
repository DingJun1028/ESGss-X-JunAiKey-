
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Target, Activity, PieChart, TrendingUp, AlertTriangle, 
    ShieldCheck, Zap, Database, Bell, CheckCircle2, 
    BarChart3, RefreshCw, Sparkles, Fingerprint, Globe, MoreVertical, Settings,
    Cpu, Layers, Search, ChevronRight, Terminal, Flame, Info
} from 'lucide-react';
import { Language, EvolutionLogEntry } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
    PolarRadiusAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Legend, LineChart, Line
} from 'recharts';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';

/**
 * ESG Strategic Panorama (AIMS)
 * The Command Center for real-time data monitoring.
 */
export const Dashboard: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { totalScore, esgScores } = useCompany();
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [evoLogs, setEvoLogs] = useState<EvolutionLogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const subV = universalIntelligence.vitals$.subscribe(v => {
      setVitals(v);
      setVitalsHistory(prev => {
        const timestamp = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
        const newHistory = [...prev, {
          time: timestamp,
          integrity: v.integrityScore,
          entropy: (1 - v.entropy) * 100, 
          load: v.contextLoad * 5
        }];
        return newHistory.slice(-15); 
      });
    });
    
    const subE = universalIntelligence.evolutionLogs$.subscribe(setEvoLogs);
    
    return () => { subV.unsubscribe(); subE.unsubscribe(); };
  }, []);

  useEffect(() => {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [evoLogs]);

  const radarData = useMemo(() => {
    if (!vitals) return [];
    return [
      { subject: isZh ? '完整性' : 'Integrity', A: vitals.integrityScore, fullMark: 100 },
      { subject: isZh ? '負熵' : 'Neg-Entropy', A: (1 - vitals.entropy) * 100, fullMark: 100 },
      { subject: isZh ? '感知' : 'Sense', A: vitals.trinity.perception, fullMark: 100 },
      { subject: isZh ? '認知' : 'Think', A: vitals.trinity.cognition, fullMark: 100 },
      { subject: isZh ? '行動' : 'Action', A: vitals.trinity.action, fullMark: 100 },
      { subject: isZh ? '協同' : 'Synergy', A: vitals.synergyLevel * 100, fullMark: 100 },
    ];
  }, [vitals, isZh]);

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2 relative">
        {/* Evolution Particles Background */}
        {vitals?.isEvolving && (
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <div 
                        key={i} 
                        className="evolution-particle" 
                        style={{ 
                            left: `${Math.random() * 100}%`, 
                            animationDelay: `${Math.random() * 2}s`,
                            background: i % 2 === 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)'
                        }} 
                    />
                ))}
            </div>
        )}

        <div className="shrink-0 pb-1 border-b border-white/5 relative z-10">
            <UniversalPageHeader 
                icon={Database} 
                title={{ zh: 'ESG 戰略一覽全景 (AIMS)', en: 'ESG Strategic Panorama' }} 
                description={{ zh: '內核自動化治理底座：數據映射與邏輯對標', en: 'AIMS Panorama: One-view Data Mapping & Audit' }} 
                language={language} 
                tag={{ zh: '內核 v16.1', en: 'OMNI_VIEW_v16.1' }} 
            />
        </div>

        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden relative z-10">
            
            {/* 左翼：生命徵象與共鳴 (3/12) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0">
                <div className="flex-1 glass-bento p-5 flex flex-col bg-slate-950 border-white/10 relative overflow-hidden rounded-3xl shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none"><Fingerprint className="w-40 h-40 text-white" /></div>
                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 relative z-10">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" /> SYSTEM_VITALS_RADAR
                    </h4>
                    <div className="flex-1 min-h-0 relative z-10">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 8, fontWeight: 900 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar 
                                    name="Vitals" 
                                    dataKey="A" 
                                    stroke="#06b6d4" 
                                    fill="#06b6d4" 
                                    fillOpacity={0.3} 
                                    animationBegin={0} 
                                    animationDuration={1500}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '9px' }}
                                    itemStyle={{ color: '#06b6d4' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="h-1/3 glass-bento p-5 bg-slate-900/60 border-white/5 relative overflow-hidden flex flex-col rounded-3xl shadow-xl">
                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Entropy_Stability</h4>
                    <div className="flex-1 flex flex-col justify-center">
                         <div className="flex justify-between text-[10px] font-mono text-white mb-2">
                             <span>ΔS: {vitals?.entropy.toFixed(4)}</span>
                             {vitals?.isEvolving && <span className="text-celestial-gold animate-pulse">ALCHEMIZING...</span>}
                         </div>
                         <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${vitals?.isEvolving ? 'bg-celestial-gold animate-pulse' : 'bg-emerald-500'}`} style={{ width: `${(1 - (vitals?.entropy || 0)) * 100}%` }} />
                         </div>
                    </div>
                </div>
            </div>

            {/* 中樞：效能動態與進化終端 (6/12) */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-0 overflow-hidden">
                <div className="flex-[1.5] glass-bento p-6 flex flex-col bg-slate-900/40 relative overflow-hidden border-white/10 shadow-2xl rounded-[2.5rem]">
                    <div className="flex justify-between items-center mb-6 shrink-0 relative z-10">
                        <div className="min-w-0">
                            <h3 className="zh-main text-lg text-white tracking-tighter uppercase truncate">內核效能演進 (Kernel Dynamics)</h3>
                            <span className="en-sub !mt-0 text-celestial-purple font-black !text-[8px]">TEMPORAL_V16_LOAD_TRACE</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <div className="uni-mini !bg-emerald-500/10 !text-emerald-400 border-none !text-[7px]">Real-time</div>
                            <div className="uni-mini !bg-blue-500/10 !text-blue-400 border-none !text-[7px]">Verified</div>
                        </div>
                    </div>
                    
                    <div className="flex-1 min-h-0 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
                            <AreaChart data={vitalsHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIntegrity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                <XAxis dataKey="time" stroke="#334155" fontSize={8} tickLine={false} axisLine={false} />
                                <YAxis domain={[0, 100]} stroke="#334155" fontSize={8} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Area name="Integrity" type="monotone" dataKey="integrity" stroke="#06b6d4" fill="url(#colorIntegrity)" strokeWidth={3} isAnimationActive={false}/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 進化引擎日誌終端 */}
                <div className="flex-1 glass-bento p-6 flex flex-col bg-black/80 border-celestial-gold/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden min-h-0">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                         <h4 className="zh-main text-[11px] text-white flex items-center gap-3 uppercase tracking-widest">
                            <Terminal className="w-4 h-4 text-celestial-gold" /> 進化引擎日誌 (Alchemy_Audit)
                         </h4>
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] text-gray-500 space-y-2 pr-2">
                        {evoLogs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 italic">Awaiting autonomous signal...</div>
                        ) : (
                            evoLogs.map(log => (
                                <div key={log.id} className="p-3 bg-white/5 border border-white/5 rounded-xl animate-slide-up group hover:bg-white/10 transition-all">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-emerald-400 font-bold uppercase tracking-widest">[{new Date(log.timestamp).toLocaleTimeString()}] PROTOCOL_AUTO_EVO</span>
                                        <span className="text-[7px] text-gray-700">0x{log.id.split('-').pop()?.toUpperCase()}</span>
                                    </div>
                                    <div className="text-white font-bold mb-1">{log.action}</div>
                                    <div className="text-[8px] text-gray-500 leading-relaxed italic">Reason: {log.details}</div>
                                </div>
                            ))
                        )}
                        <div ref={logEndRef} />
                    </div>
                </div>
            </div>

            {/* 右翼：異常偵測與稽核鏈 (3/12) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0">
                <div className="flex-1 glass-bento p-5 flex flex-col bg-slate-900/60 border-white/5 shadow-xl relative overflow-hidden rounded-[2rem]">
                    <div className="flex justify-between items-center mb-4 shrink-0 relative z-10">
                        <h4 className="zh-main text-[11px] text-white uppercase tracking-widest flex items-center gap-2">
                            <Bell className="w-3.5 h-3.5 text-rose-500 animate-pulse" />實時異常偵測
                        </h4>
                        <span className="text-[7px] font-mono text-gray-700">LIVE_PULSE</span>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1 relative z-10">
                        {[
                            { t: "排放數據偏移", l: "Crit", c: "rose" },
                            { t: "GRI 缺口補完", l: "Warn", c: "amber" },
                            { t: "供應鏈連結", l: "Info", c: "blue" },
                            { t: "資產更新成功", l: "Done", c: "emerald" }
                        ].map((alert, i) => (
                            <div key={i} className="p-3 bg-black/40 border border-white/5 rounded-xl hover:border-white/15 transition-all group">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded bg-${alert.c}-500/10 text-${alert.c}-500 border border-${alert.c}-500/20 uppercase`}>{alert.l}</span>
                                    <span className="text-[7px] text-gray-800 font-mono">0x{Math.random().toString(16).substr(2,4).toUpperCase()}</span>
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors truncate">{alert.t}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-2/5 glass-bento p-5 bg-slate-950 border-emerald-500/10 flex flex-col relative overflow-hidden rounded-[2rem] shadow-2xl">
                    <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none"><ShieldCheck className="w-24 h-24 text-emerald-400" /></div>
                    <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                        <Fingerprint className="w-3 h-3 text-emerald-500" /> AUDIT_CHAIN_TRACE
                    </h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 relative z-10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                                <span className="text-[8px] font-mono text-gray-700 truncate flex-1 ml-2 group-hover:text-gray-400">BLOCK_#5{i}92_VERIFIED</span>
                                <ChevronRight className="w-2.5 h-2.5 text-gray-800" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};
