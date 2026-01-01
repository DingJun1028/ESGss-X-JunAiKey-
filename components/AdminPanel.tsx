import React, { useState, useEffect, useMemo } from 'react';
import { 
    ShieldCheck, Activity, Zap, TrendingDown, Target, Award, Clock, 
    BarChart3, Layers, Globe, Server, Cpu, Database, Fingerprint, 
    RefreshCw, Gavel, Crown, Info, AlertTriangle, Eye, Flame, 
    ArrowUpRight, Gauge, Terminal, Settings, Mail, Send, Sparkles, Loader2,
    ShieldAlert, SearchCode, ClipboardList
} from 'lucide-react';
import { Language, OperationalKpi, TaskStatus } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';

export const AdminPanel: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { addToast } = useToast();
    const { agentTasks, updateAgentTaskStatus } = useCompany();
    const [vitals, setVitals] = useState<SystemVital | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [activeTab, setActiveTab] = useState<'vitals' | 'incidents'>('vitals');

    useEffect(() => {
        const sub = universalIntelligence.vitals$.subscribe(v => {
            setVitals(v);
            setHistory(prev => {
                const next = [...prev, {
                    time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
                    entropy: (1 - v.entropy) * 100,
                    sync: v.kpis.integrity.apiSyncRate,
                    latency: v.kpis.integrity.responseDelay
                }].slice(-20);
                return next;
            });
        });
        return () => sub.unsubscribe();
    }, []);

    const incidentTasks = useMemo(() => 
        agentTasks.filter(t => t.title.includes('Investigate') || t.title.includes('Anomaly')), 
    [agentTasks]);

    const handleAwakeningBroadcast = () => {
        setIsBroadcasting(true);
        addToast('info', isZh ? '正在彙整 2026 戰略共鳴廣播...' : 'Consolidating 2026 Strategic Broadcast...', 'Orchestrator');
        
        setTimeout(() => {
            setIsBroadcasting(false);
            addToast('reward', isZh ? '2026 覺醒廣播已發送至全體節點' : 'Awakening broadcast sent to all nodes.', 'System');
        }, 3000);
    };

    const kpiData = useMemo(() => {
        if (!vitals) return [];
        return [
            { name: isZh ? '運作熵減' : 'Ops Entropy', value: 92, color: '#10b981' },
            { name: isZh ? '全知精準' : 'Data Sanctity', value: vitals.kpis.sanctity.ocrAccuracy, color: '#fbbf24' },
            { name: isZh ? '代理活躍' : 'Agent Resonance', value: 85, color: '#8b5cf6' },
            { name: isZh ? '架構穩定' : 'Structural Integrity', value: vitals.kpis.integrity.apiSyncRate, color: '#3b82f6' }
        ];
    }, [vitals, isZh]);

    if (!vitals) return null;

    return (
        <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
            <UniversalPageHeader 
                icon={Crown}
                title={{ zh: '2026 策略長上帝視角：管理終端', en: '2026 CSO God-Eye Control Panel' }}
                description={{ zh: '實時監控 2026 第一週「熵減行動」全域 KPI 與代理人效能', en: 'Real-time KPI monitoring for 2026 Week 1 Entropy Reduction Mission.' }}
                language={language}
                tag={{ zh: '管理內核 v1.0', en: 'ADMIN_CORE_V1.0' }}
            />

            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-fit backdrop-blur-xl shrink-0">
                <button onClick={() => setActiveTab('vitals')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'vitals' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>SYSTEM_VITALS</button>
                <button onClick={() => setActiveTab('incidents')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'incidents' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>INCIDENT_CENTER</button>
            </div>

            {activeTab === 'vitals' ? (
                <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
                    {/* 1. 核心效能大表 (8/12) */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 min-h-0">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                            <div className="p-6 bg-slate-900/60 border border-emerald-500/20 rounded-3xl shadow-xl group hover:border-emerald-500/40 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Op_Hours_Saved</span>
                                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="text-4xl font-mono font-black text-white">{vitals.kpis.efficiency.hoursSaved}h</div>
                                <div className="text-[10px] text-gray-500 mt-1">vs 2025 W52: +12%</div>
                            </div>
                            <div className="p-6 bg-slate-900/60 border border-celestial-gold/20 rounded-3xl shadow-xl group hover:border-celestial-gold/40 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[9px] font-black text-celestial-gold uppercase tracking-widest">OCR_Accuracy</span>
                                    <ShieldCheck className="w-4 h-4 text-celestial-gold" />
                                </div>
                                <div className="text-4xl font-mono font-black text-white">{vitals.kpis.sanctity.ocrAccuracy}%</div>
                                <div className="text-[10px] text-gray-500 mt-1">Zero Hallucination Target</div>
                            </div>
                            <div className="p-6 bg-slate-900/60 border border-purple-500/20 rounded-3xl shadow-xl group hover:border-purple-500/40 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Auto_Intervene</span>
                                    <Zap className="w-4 h-4 text-purple-400" />
                                </div>
                                <div className="text-4xl font-mono font-black text-white">{vitals.kpis.resonance.autoInterventions}</div>
                                <div className="text-[10px] text-gray-500 mt-1">Autonomous Fixes Applied</div>
                            </div>
                            <div className="p-6 bg-slate-950 border border-blue-500/30 rounded-3xl shadow-xl group hover:border-blue-500/50 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Sync_Integrity</span>
                                    <Activity className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="text-4xl font-mono font-black text-white">{vitals.kpis.integrity.apiSyncRate}%</div>
                                <div className="text-[10px] text-gray-500 mt-1">Flowlu Bus Locked</div>
                            </div>
                        </div>

                        <div className="flex-1 glass-bento bg-slate-900/40 border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.03)_0%,transparent_70%)] pointer-events-none" />
                            <div className="flex justify-between items-center mb-10 shrink-0 relative z-10">
                                <h3 className="zh-main text-2xl text-white uppercase tracking-tighter">超立方演進動態 (Temporal KPI Pulse)</h3>
                                <button 
                                    onClick={handleAwakeningBroadcast}
                                    disabled={isBroadcasting}
                                    className="px-8 py-3 bg-celestial-gold text-black font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px] flex items-center gap-2"
                                >
                                    {isBroadcasting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4" />}
                                    SEND_AWAKENING_BROADCAST
                                </button>
                            </div>
                            <div className="flex-1 min-h-0 w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <AreaChart data={history}>
                                        <defs>
                                            <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorSync" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                        <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                                        <YAxis domain={[0, 100]} hide />
                                        <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }} />
                                        <Area type="monotone" dataKey="entropy" stroke="#10b981" fill="url(#colorEntropy)" strokeWidth={3} isAnimationActive={false} />
                                        <Area type="monotone" dataKey="sync" stroke="#3b82f6" fill="url(#colorSync)" strokeWidth={2} isAnimationActive={false} strokeDasharray="5 5" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* 2. 維度診斷與神聖契約 (4/12) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                        <div className="glass-bento p-8 bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl shrink-0 flex flex-col items-center text-center relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Settings className="w-48 h-48 text-white" /></div>
                             <div className="p-5 rounded-3xl bg-celestial-gold/10 border border-celestial-gold/20 mb-6 relative z-10">
                                <Gauge className="w-12 h-12 text-celestial-gold animate-neural-pulse" />
                             </div>
                             <h4 className="zh-main text-2xl text-white mb-2 relative z-10">系統負熵穩定度</h4>
                             <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-10 relative z-10">NEGATIVE_ENTROPY_INDEX: {(1 - vitals.entropy).toFixed(4)}</p>
                             
                             <div className="w-full space-y-6 relative z-10 text-left">
                                {kpiData.map((kpi, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{kpi.name}</span>
                                            <span className="text-xs font-mono font-bold text-white">{kpi.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full transition-all duration-1000" style={{ width: `${kpi.value}%`, backgroundColor: kpi.color }} />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="glass-bento p-8 flex-1 bg-slate-900/60 border-white/5 rounded-[3rem] shadow-xl flex flex-col min-h-0 overflow-hidden relative">
                             <div className="flex justify-between items-center mb-6 shrink-0">
                                <h4 className="zh-main text-[11px] text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-3"><Terminal className="w-4 h-4" /> SACRED_LOG_TERMINAL</h4>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                             </div>
                             <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] text-gray-600 space-y-2 pr-2">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-emerald-500 font-black">[10:00:01] </span>
                                    內核啟動：2026 戰略共鳴廣播已加載。
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-blue-500 font-black">[10:05:22] </span>
                                    神聖契約：Flowlu API 握手成功，同步頻率 0.5Hz。
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-6 min-h-0 animate-fade-in">
                    <div className="p-10 bg-rose-500/10 border-2 border-rose-500/30 rounded-[3rem] flex items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.05]"><ShieldAlert className="w-64 h-64 text-rose-500" /></div>
                         <div className="flex items-center gap-10 relative z-10">
                            <div className="p-6 bg-rose-500 text-white rounded-[2rem] shadow-[0_0_40px_rgba(244,63,94,0.3)] animate-pulse">
                                <ShieldAlert className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="zh-main text-4xl text-white tracking-tighter uppercase mb-2">事件應變中心 (Incident Center)</h3>
                                <p className="text-lg text-gray-500 font-light italic">"Monitoring high-entropy logical contradictions & forensic shards."</p>
                            </div>
                         </div>
                         <div className="text-right relative z-10">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Open_Investigations</div>
                            <div className="text-5xl font-mono font-black text-rose-500">{incidentTasks.filter(t => t.status !== 'COMPLETED').length}</div>
                         </div>
                    </div>

                    <div className="flex-1 glass-bento bg-slate-900/40 border-white/5 rounded-[3rem] p-1 shadow-2xl flex flex-col min-h-0 overflow-hidden relative">
                         <div className="p-8 border-b border-white/5 bg-slate-900/40 flex justify-between items-center shrink-0 rounded-t-[3rem]">
                             <div className="flex items-center gap-3">
                                 <ClipboardList className="w-5 h-5 text-gray-500" />
                                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Forensic_Task_Queue</span>
                             </div>
                             <div className="uni-mini bg-rose-500/20 text-rose-400 border-none px-2 py-0.5">AUTO_PILOT: ON</div>
                         </div>
                         <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-4">
                            {incidentTasks.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 grayscale">
                                    <ShieldCheck className="w-32 h-32 text-emerald-500 mb-6" />
                                    <p className="zh-main text-2xl uppercase tracking-widest text-emerald-500">Zero Critical Anomalies</p>
                                </div>
                            ) : incidentTasks.map(task => (
                                <div key={task.id} className="p-6 bg-black/60 border border-white/5 rounded-[2.2rem] hover:border-rose-500/30 transition-all flex justify-between items-center group shadow-xl">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-rose-500/10 transition-all`}>
                                            <SearchCode className="w-8 h-8 text-rose-500" />
                                        </div>
                                        <div>
                                            <h4 className="zh-main text-xl text-white truncate max-w-xl group-hover:text-rose-400 transition-colors">{task.title}</h4>
                                            <p className="text-[11px] text-gray-500 mt-1 italic max-w-lg line-clamp-2">"{task.description}"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-700 uppercase font-black">Investigator</div>
                                            <div className="text-xs text-celestial-gold font-mono uppercase tracking-tighter">JAK_FORENSIC</div>
                                        </div>
                                        {task.status !== 'COMPLETED' ? (
                                            <button onClick={() => updateAgentTaskStatus(task.id, TaskStatus.COMPLETED)} className="px-8 py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95">SANCTIFY</button>
                                        ) : (
                                            <div className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black rounded-xl uppercase">RESOLVED</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};
