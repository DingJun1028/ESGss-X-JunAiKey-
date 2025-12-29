import React, { useState } from 'react';
import { Language, View } from '../types';
import { Stethoscope, CheckSquare, Search, Loader2, Sparkles, Eye, ShieldAlert, TrendingUp, Microscope, ListChecks } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

// Fix: Updated HealthCheckProps to include onNavigate
export const HealthCheck: React.FC<{ language: Language, onNavigate?: (view: View) => void }> = ({ language, onNavigate }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'holistic' | 'pro'>('holistic');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="h-full w-full flex flex-col bg-black animate-fade-in overflow-hidden text-[15px]">
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            {/* Header: Tight version */}
            <div className="p-6 border-b border-white/5 bg-slate-900/20 backdrop-blur-xl flex justify-between items-end">
                <div className="space-y-1">
                    <div className="uni-mini mb-1">PROTOCOL_v15.9.1</div>
                    <h3 className="zh-main text-white uppercase tracking-tighter">
                        ESG 萬能健檢：<span className="text-celestial-blue">外部足跡解析</span>
                    </h3>
                </div>
                <div className="flex bg-black/40 p-1 rounded-md border border-white/10">
                    <button onClick={() => setActiveTab('holistic')} className={`px-4 py-1 rounded text-[11px] font-bold transition-all ${activeTab === 'holistic' ? 'bg-celestial-blue text-white' : 'text-gray-500'}`}>STEP 0</button>
                    <button onClick={() => setActiveTab('pro')} className={`px-4 py-1 rounded text-[11px] font-bold transition-all ${activeTab === 'pro' ? 'bg-celestial-blue text-white' : 'text-gray-500'}`}>PRO</button>
                </div>
            </div>

            <div className="p-4 grid grid-cols-12 gap-2 h-full">
                {activeTab === 'holistic' && (
                    <>
                        <div className="col-span-12 lg:col-span-7 glass-bento p-5 border-celestial-blue/20 bg-gradient-to-br from-celestial-blue/5 to-transparent">
                            <h4 className="zh-main text-white mb-4">外部足跡掃描項目 (Step 0)</h4>
                            <div className="space-y-1.5">
                                {[
                                    { t: "官網永續敘事掃描", d: "分析組織願景與對外承諾契合度。" },
                                    { t: "全球媒體情緒監測", d: "提取公眾對企業 ESG 表現反饋。" },
                                    { t: "供應鏈地圖對標", d: "自動查找上游供應商碳洩漏風險。" }
                                ].map((item, i) => (
                                    <div key={i} className="p-3 bg-black/40 rounded-lg border border-white/5 hover:border-celestial-blue/40 transition-all group">
                                        <div className="zh-main text-[13px] text-white group-hover:text-celestial-blue">{item.t}</div>
                                        <div className="text-[11px] text-gray-500">{item.d}</div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 w-full py-3 bg-celestial-blue text-white font-black rounded-lg text-[12px] uppercase shadow-xl flex items-center justify-center gap-3">
                                <Search className="w-4 h-4" /> Start AI Scan
                            </button>
                        </div>

                        <div className="col-span-12 lg:col-span-5 flex flex-col gap-2">
                            <div className="glass-bento p-4 flex flex-col justify-center border-white/10">
                                <h4 className="en-sub !text-[9px] mb-4">Output_Matrix</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: "合規缺口", icon: ShieldAlert, color: "blue" },
                                        { label: "品牌鏡像", icon: TrendingUp, color: "emerald" },
                                        { label: "利害雷達", icon: Users, color: "purple" },
                                        { label: "建議清單", icon: ListChecks, color: "gold" }
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-lg text-center group cursor-help">
                                            <item.icon className="w-5 h-5 mx-auto mb-2 text-gray-600 group-hover:text-white" />
                                            <div className="zh-main text-[11px] text-gray-400 group-hover:text-white">{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};
const Users = (props: any) => <TrendingUp {...props} />;