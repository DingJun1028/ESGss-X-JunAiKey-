import React, { useState, useEffect } from 'react';
import { 
    Target, Activity, PieChart, TrendingUp, AlertTriangle, ArrowRight, 
    ShieldCheck, Zap, Layers, Cpu, Radio, Database, FileUp, ListChecks,
    History, Bell, CheckCircle2, ChevronRight, BarChart3, Search, RefreshCw, Sparkles,
    Shield, Fingerprint, Globe
} from 'lucide-react';
import { Language, DimensionID } from '../types';
import { DIMENSION_LABELS } from '../constants';
import { useCompany } from './providers/CompanyProvider';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';

export const Dashboard: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { totalScore, activeTitle, companyName } = useCompany();
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  const [activeAimsTab, setActiveAimsTab] = useState<'detection' | 'analytics' | 'governance'>('detection');

  useEffect(() => {
    const sub = universalIntelligence.vitals$.subscribe(setVitals);
    return () => sub.unsubscribe();
  }, []);

  const radarData = (Object.keys(DIMENSION_LABELS) as DimensionID[]).slice(0, 6).map(id => ({
      subject: DIMENSION_LABELS[id][isZh ? 'zh' : 'en'],
      A: 70 + Math.random() * 30,
      fullMark: 100
  }));

  const chartData = [
    { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }, { name: 'Mar', value: 500 }, { name: 'Apr', value: 450 }, { name: 'May', value: 600 }, { name: 'Jun', value: 550 }
  ];

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Database} 
            title={{ zh: 'ESG 資訊管理系統 (AIMS)', en: 'ESG AIMS Control' }} 
            description={{ zh: '即時數據映射與異常偵測：全自動化永續治理底座', en: 'Real-time Data Mapping & Anomaly Detection' }} 
            language={language} 
            tag={{ zh: '數據內核 v16.1', en: 'AIMS_CORE_V16.1' }} 
        />
        
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-white/5 w-fit backdrop-blur-xl shrink-0 shadow-2xl">
            {[
                { id: 'detection', label: isZh ? 'AI 異常偵測' : 'Detection', icon: Zap },
                { id: 'analytics', label: isZh ? '績效指標' : 'Metrics', icon: BarChart3 },
                { id: 'governance', label: isZh ? '治理見證' : 'Governance', icon: ShieldCheck },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveAimsTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAimsTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 min-h-0 overflow-hidden">
                {activeAimsTab === 'detection' && (
                    <div className="flex-1 glass-bento p-8 flex flex-col bg-slate-900/40 relative overflow-hidden shadow-2xl rounded-[3rem]">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03]"><Globe className="w-64 h-64 text-celestial-blue" /></div>
                        
                        <div className="flex justify-between items-center mb-8 shrink-0 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20 animate-pulse">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="zh-main text-xl text-white">實時異常監測 (Live Detection)</h3>
                                    <span className="en-sub !mt-0 text-rose-500 opacity-100 font-black tracking-widest">SCAN_PROTOCOL_ACTIVE</span>
                                </div>
                            </div>
                            <button className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black border border-white/10 transition-all flex items-center gap-2">
                                <RefreshCw className="w-3.5 h-3.5" /> Trigger_Scan
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 relative z-10">
                            {[
                                { title: "排放強度數據異常偏移", level: "Critical", desc: "偵測到本月 Scope 1 數據相較上季度同期異常增加 12.4%。", sugg: "建議檢查 Sector B 之燃料抄表紀錄。", color: "rose" },
                                { title: "缺失關鍵佐證文件：Q3 PPA", level: "Warning", desc: "2024 Q3 綠電購買憑證尚未完成映射。", sugg: "請於 48 小時內完成文件補傳。", color: "amber" },
                            ].map((alert, i) => (
                                <div key={i} className="p-6 bg-black/60 border border-white/5 rounded-[2.5rem] hover:border-white/20 transition-all group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-0.5 rounded-lg bg-${alert.color}-500/20 text-${alert.color}-400 text-[9px] font-black uppercase border border-${alert.color}-500/30`}>{alert.level}</div>
                                            <h4 className="zh-main text-lg text-white group-hover:text-celestial-gold transition-colors">{alert.title}</h4>
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-700">SIG_0x{8+i}B3</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4 font-light leading-relaxed">{alert.desc}</p>
                                    <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex items-start gap-4">
                                        <Sparkles className="w-5 h-5 text-celestial-gold shrink-0 mt-0.5" />
                                        <div className="text-[11px] text-gray-300 italic">
                                            <b className="text-white not-italic uppercase text-[8px] block mb-1">AI_Correction:</b>
                                            {alert.sugg}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeAimsTab === 'analytics' && (
                    <div className="flex-1 glass-bento p-8 flex flex-col bg-slate-900/40 shadow-2xl rounded-[3rem] min-h-[400px] overflow-hidden">
                         <div className="flex justify-between items-center mb-10 shrink-0">
                             <div>
                                <h3 className="zh-main text-2xl text-white">ESG 績效演進分析</h3>
                                <span className="en-sub text-celestial-purple opacity-100 font-black">PERFORMANCE_V16_DYNAMICS</span>
                             </div>
                         </div>
                         <div className="flex-1 min-h-[300px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                         </div>
                    </div>
                )}

                {activeAimsTab === 'governance' && (
                  <div className="flex-1 glass-bento p-8 flex flex-col bg-slate-900/40 shadow-2xl rounded-[3rem] min-h-[400px] overflow-hidden">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                      <div>
                        <h3 className="zh-main text-2xl text-white">治理見證與區塊鏈存證</h3>
                        <span className="en-sub text-emerald-500 opacity-100 font-black">GOVERNANCE_WITNESS_CHAIN</span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                           <div className="flex items-center gap-4">
                             <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
                             <div>
                               <div className="text-sm font-bold text-white uppercase tracking-tight">Entry_Verified_0x{i}F2</div>
                               <div className="text-[10px] text-gray-500 font-mono">Timestamp: {new Date().toLocaleTimeString()}</div>
                             </div>
                           </div>
                           <div className="text-right">
                             <div className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">WITNESSED</div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                <div className="glass-bento p-8 flex flex-col bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden shrink-0 min-h-[420px]">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Fingerprint className="w-56 h-56" /></div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-2 relative z-10">
                        <Activity className="w-4 h-4" /> ENTITY_DNA_VERIFY
                    </h4>
                    <div className="flex-1 min-h-[260px] relative z-10 w-full overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 900 }} />
                                <Radar dataKey="A" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 p-6 bg-white/[0.02] rounded-[2.5rem] border border-white/5 flex items-center justify-between relative z-10 shadow-inner shrink-0">
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Holistic_Mastery</div>
                            <div className="text-4xl font-mono font-bold text-white tracking-tighter">{totalScore}</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-2xl animate-pulse">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 flex flex-col bg-slate-900/60 border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[300px]">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <div className="flex flex-col">
                            <span className="zh-main text-lg text-white tracking-widest uppercase">Action_Relay</span>
                            <span className="en-sub !mt-0.5">Task_Orchestrator</span>
                        </div>
                        <ListChecks className="w-6 h-6 text-celestial-purple" />
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                        {[
                            { task: "更新 Q4 溫室氣體排放量", owner: "DingJun", status: "80%", color: "blue" },
                            { task: "執行供應商 ESG 二次審核", owner: "Linda", status: "Pending", color: "rose" },
                            { task: "完成 2025 淨零路徑校準", owner: "Strategist", status: "Done", color: "emerald" },
                        ].map((t, i) => (
                            <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-celestial-gold transition-all cursor-pointer">
                                <div>
                                    <div className="text-[13px] font-black text-white uppercase tracking-tight group-hover:text-celestial-gold">{t.task}</div>
                                    <div className="text-[10px] text-gray-500 mt-1 font-mono uppercase">Owner: {t.owner}</div>
                                </div>
                                <span className={`text-[10px] font-black uppercase text-${t.color}-400 bg-${t.color}-500/10 px-3 py-1 rounded-lg border border-${t.color}-500/20`}>{t.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};