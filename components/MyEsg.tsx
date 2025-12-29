
import React, { useState, useMemo } from 'react';
import { 
    Target, User, Zap, Activity, ArrowRight, Star, GraduationCap, 
    Coins, ShieldCheck, Sparkles, Hexagon, Bell, Trophy, 
    History, Hammer, Heart, Eye, Gem, Flame, Cpu, Shield, Lock, Plus, FileText,
    Camera, MapPin, Compass, Briefcase, Box, Leaf, CheckCircle, Library,
    BookOpen, Search, Code, Workflow, Droplets, Utensils, Bike, Share2, Info, ShoppingBag, Loader2, CheckCircle2
} from 'lucide-react';
import { Language, View, LifeEsgQuest, LifeCategory, PersonaAttributes } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { useToast } from '../contexts/ToastContext';

export const MyEsg: React.FC<{ language: Language; onNavigate: (view: View) => void }> = ({ language, onNavigate }) => {
  const { userName, level, activeTitle, goodwillBalance, awardXp, updateGoodwillBalance, addJournalEntry } = useCompany();
  const { soul, cardInventory, traits, updateTraits } = useUniversalAgent();
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';

  // 生活 ESG 進化數據庫
  const [lifeQuests, setLifeQuests] = useState<LifeEsgQuest[]>([
    { 
        id: 'l1', category: 'NetZero', title: '低碳交通實踐', enTitle: 'Eco Transport', 
        impactDesc: isZh ? '減少約 2.5kg CO2e 排放' : 'Saved 2.5kg CO2e', 
        xpReward: 120, gwcReward: 50, traitBonus: { trait: 'pragmatism', value: 2 },
        status: 'ready', icon: Bike 
    },
    { 
        id: 'l2', category: 'NetZero', title: '自備餐具減塑', enTitle: 'Zero Waste', 
        impactDesc: isZh ? '減少 3 件拋棄式塑料' : 'Reduced 3 plastic items', 
        xpReward: 80, gwcReward: 30, traitBonus: { trait: 'stability', value: 1 },
        status: 'ready', icon: Utensils 
    },
    { 
        id: 'l3', category: 'Altruism', title: '永續知識傳播', enTitle: 'Insight Sharing', 
        impactDesc: isZh ? '擴散王道思維影響力' : 'Spreading Wangdao Wisdom', 
        xpReward: 200, gwcReward: 100, traitBonus: { trait: 'altruism', value: 3 },
        status: 'ready', icon: Share2 
    },
    { 
        id: 'l4', category: 'Governance', title: '數位無紙化辦公', enTitle: 'Paperless Office', 
        impactDesc: isZh ? '減少 50 張 A4 紙張耗用' : 'Saved 50 A4 sheets', 
        xpReward: 150, gwcReward: 60, traitBonus: { trait: 'stability', value: 2 },
        status: 'completed', icon: FileText, verifiedHash: '0x8B...F32'
    },
    { 
        id: 'l5', category: 'Innovation', title: 'Berkeley 雙證班試煉', enTitle: 'Elite Training', 
        impactDesc: isZh ? '解鎖 Berkeley 策略視野' : 'Unlocking Berkeley Strategy', 
        xpReward: 500, gwcReward: 200, traitBonus: { trait: 'innovation', value: 5 },
        status: 'ready', icon: GraduationCap 
    },
    { 
        id: 'l6', category: 'Altruism', title: '在地永續採購', enTitle: 'Local Sourcing', 
        impactDesc: isZh ? '支持在地小農與減碳里程' : 'Support local eco-farmers', 
        xpReward: 100, gwcReward: 40, traitBonus: { trait: 'altruism', value: 2 },
        status: 'ready', icon: ShoppingBag 
    }
  ]);

  const [filter, setFilter] = useState<LifeCategory | 'All'>('All');
  const [isVerifyingId, setIsVerifyingId] = useState<string | null>(null);

  const filteredQuests = useMemo(() => 
    lifeQuests.filter(q => filter === 'All' || q.category === filter),
    [lifeQuests, filter]
  );

  const handleVerifyAction = async (quest: LifeEsgQuest) => {
      setIsVerifyingId(quest.id);
      addToast('info', isZh ? `AI 正在見證行動：${quest.title}...` : `AI Witnessing: ${quest.title}...`, 'Kernel');
      
      // 模擬 AI 影像辨識與邏輯核驗
      await new Promise(r => setTimeout(r, 2500));
      
      const newHash = '0x' + Math.random().toString(16).substr(2, 8).toUpperCase();
      
      setLifeQuests(prev => prev.map(q => 
          q.id === quest.id ? { ...q, status: 'completed', verifiedHash: newHash } : q
      ));

      // 系統性獎勵
      awardXp(quest.xpReward);
      updateGoodwillBalance(quest.gwcReward);
      // [Fix] Cast trait key to string to avoid implicit conversion error.
      updateTraits({ [quest.traitBonus.trait as string]: traits[quest.traitBonus.trait] + quest.traitBonus.value });
      
      addJournalEntry(
          isZh ? `完成生活 ESG 行動：${quest.title}` : `Completed Life ESG: ${quest.title}`,
          isZh ? `見證簽章: ${newHash} | 影響: ${quest.impactDesc}` : `Witness: ${newHash} | Impact: ${quest.impactDesc}`,
          quest.xpReward,
          'action',
          ['LifeESG', quest.category]
      );

      setIsVerifyingId(null);
      addToast('reward', isZh ? `見證成功！+${quest.xpReward} XP, +${quest.traitBonus.value} ${quest.traitBonus.trait}` : `Witness Success!`, 'Evolution');
  };

  const categories: { id: LifeCategory | 'All', label: string, icon: any }[] = [
      { id: 'All', label: isZh ? '全部' : 'All', icon: Box },
      { id: 'NetZero', label: isZh ? '淨零' : 'NetZero', icon: Leaf },
      { id: 'Altruism', label: isZh ? '利他' : 'Altruism', icon: Heart },
      { id: 'Governance', label: isZh ? '治理' : 'Governance', icon: ShieldCheck },
      { id: 'Innovation', label: isZh ? '創新' : 'Innovation', icon: Zap }
  ];

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
        {/* 頂部數據帶 */}
        <div className="shrink-0 flex justify-between items-end px-2">
            <UniversalPageHeader 
                icon={User}
                title={{ zh: '個人北極星專區', en: 'Personal Cockpit' }}
                description={{ zh: '超立方體演進：我的戰情、聖物、紀元與生活鍛造', en: 'Intelligence, Relics, Eras & Life Forge' }}
                language={language}
                tag={{ zh: '內核 v15.9', en: 'KERNEL_V15.9' }}
            />
            <div className="flex gap-4 mb-3">
                <button onClick={() => onNavigate(View.LIBRARY)} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-3 transition-all group shadow-xl">
                    <Library className="w-5 h-5 text-celestial-gold group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{isZh ? '善向圖書館' : 'Library'}</span>
                </button>
                <button onClick={() => onNavigate(View.PALACE)} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-3 transition-all group shadow-xl">
                    <Trophy className="w-5 h-5 text-celestial-gold group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{isZh ? '進入宮殿' : 'Eternal Palace'}</span>
                </button>
            </div>
        </div>

        {/* 核心內容佈局 */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            
            {/* 區塊 1：我的戰情快報 (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0">
                <div className="flex-1 glass-bento p-8 flex flex-col bg-slate-900/60 relative overflow-hidden shadow-2xl">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-pink-500/20 rounded-2xl text-pink-400">
                                <Bell className="w-7 h-7 animate-bounce" />
                             </div>
                             <div>
                                <span className="zh-main text-2xl text-white">我的戰情快報</span>
                                <div className="en-sub !mt-0 text-pink-500 opacity-100 font-black">INTEL_BRIEFING_v15.9</div>
                             </div>
                        </div>
                        <span className="uni-mini bg-pink-500 text-white border-none shadow-[0_0_15px_rgba(236,72,153,0.4)] animate-pulse">LIVE</span>
                    </div>
                    
                    <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2 relative">
                        {[
                            { time: '14:22', title: '供應商排放異常偵測', desc: '偵測到 A9 區域 Scope 3 數據偏移 12.4%，建議啟動 AIMS 調節。', type: 'danger' },
                            { time: '11:05', title: '歐盟碳價今日收盤', desc: '今日收盤 €92.5/t，高於 30 日平均。自動調整財務模擬參數。', type: 'info' },
                            { time: '09:00', title: '全檢報告分析進度', desc: 'AI 正透過外部足跡解析您的企業形象鏡像，預計 10 分鐘後完成。', type: 'success' },
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[2.5rem] hover:border-white/10 transition-all cursor-crosshair group relative overflow-hidden">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-mono text-gray-500 group-hover:text-pink-400 transition-colors">T_{item.time}</span>
                                    <div className={`w-2 h-2 rounded-full ${item.type === 'danger' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : item.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`} />
                                </div>
                                <h5 className="zh-main text-lg text-white mb-2 leading-tight">{item.title}</h5>
                                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 區塊 2：已裝備聖物 (4/12) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 min-h-0">
                <div className="flex-1 glass-bento p-8 flex flex-col bg-slate-900/60 relative overflow-hidden shadow-2xl border-celestial-blue/20">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-celestial-blue/20 rounded-2xl text-celestial-blue">
                                <Gem className="w-7 h-7" />
                             </div>
                             <div>
                                <span className="zh-main text-xl text-white">已裝備聖物</span>
                                <div className="en-sub !mt-0">RELIC_ACTIVE</div>
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-8">
                        <div className="p-8 bg-gradient-to-br from-celestial-gold/20 via-slate-900 to-black border-2 border-celestial-gold/40 rounded-[3rem] flex flex-col items-center text-center group cursor-pointer hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(251,191,36,0.1)] relative overflow-hidden">
                            <div className="w-20 h-20 rounded-full bg-black border border-celestial-gold flex items-center justify-center mb-6 shadow-xl relative z-10">
                                <div className="text-3xl font-black text-celestial-gold">智</div>
                            </div>
                            <h4 className="zh-main text-lg text-white mb-2">ESG 萬能智庫</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed mb-6">已整合楊博專家智庫<br/>RAG 推理效能 +25%</p>
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                                    <div className="text-[8px] text-gray-500 uppercase font-black">INT</div>
                                    <div className="text-sm font-mono text-emerald-400 font-bold">99</div>
                                </div>
                                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                                    <div className="text-[8px] text-gray-500 uppercase font-black">STRAT</div>
                                    <div className="text-sm font-mono text-celestial-blue font-bold">85</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-celestial-blue/10 border border-celestial-blue/30 rounded-[2.5rem] flex items-center gap-4">
                        <Activity className="w-6 h-6 text-celestial-blue animate-pulse" />
                        <span className="text-xs text-white font-bold">AIMS 自動監測：穩定運行中</span>
                    </div>
                </div>
            </div>

            {/* 區塊 3：生活 ESG 鍛造矩陣 (5/12) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 min-h-0">
                <div className="flex-1 glass-bento p-8 flex flex-col bg-slate-900/60 border-celestial-purple/30 relative overflow-hidden shadow-2xl">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-celestial-purple/20 rounded-2xl text-celestial-purple">
                                <Hammer className="w-7 h-7" />
                             </div>
                             <div>
                                <span className="zh-main text-2xl text-white">生活永續鍛造矩陣</span>
                                <div className="en-sub !mt-0 text-celestial-purple opacity-100 font-black">LIFE_ESG_FORGE_CANVAS</div>
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-gray-500">IMPACT_SCORE:</span>
                            <span className="text-xl font-mono text-celestial-purple font-black">2,480</span>
                        </div>
                    </div>

                    {/* 分類過濾器 */}
                    <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar shrink-0">
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 border whitespace-nowrap
                                    ${filter === cat.id ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}
                                `}
                            >
                                <cat.icon className="w-3 h-3" />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* 行動網格 */}
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
                        {filteredQuests.map((quest) => (
                            <div key={quest.id} className={`p-5 rounded-[2.5rem] border flex items-center justify-between group transition-all relative overflow-hidden ${
                                quest.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 opacity-70' :
                                quest.status === 'locked' ? 'bg-black/20 border-white/5 opacity-30 cursor-not-allowed' :
                                'bg-white/5 border-white/10 hover:border-celestial-purple/50'
                            }`}>
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl transition-all duration-500 ${
                                        quest.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-gray-500 group-hover:scale-110'
                                    }`}>
                                        <quest.icon className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-base font-bold truncate ${quest.status === 'completed' ? 'text-emerald-100' : 'text-gray-200'}`}>{quest.title}</span>
                                            {quest.verifiedHash && (
                                                <div className="flex items-center gap-1 text-[8px] font-mono text-emerald-500/60 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                                                    <ShieldCheck className="w-2.5 h-2.5" /> {quest.verifiedHash}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{quest.impactDesc}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-[9px] text-celestial-purple font-black">+{quest.traitBonus.value} {quest.traitBonus.trait.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    {quest.status === 'ready' && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleVerifyAction(quest); }}
                                            disabled={isVerifyingId === quest.id}
                                            className="px-6 py-3 bg-celestial-purple text-white rounded-2xl text-[10px] font-black transition-all flex items-center gap-3 border border-celestial-purple/30 shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
                                        >
                                            {isVerifyingId === quest.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Camera className="w-4 h-4" />
                                            )}
                                            {isVerifyingId === quest.id ? 'VERIFYING' : 'WITNESS'}
                                        </button>
                                    )}
                                    {quest.status === 'completed' && (
                                        <div className="flex flex-col items-center">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-fade-in" />
                                            <span className="text-[8px] text-emerald-500 font-mono mt-1 font-black">SUCCESS</span>
                                        </div>
                                    )}
                                </div>

                                {isVerifyingId === quest.id && (
                                    <div className="absolute inset-0 bg-celestial-purple/5 animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 生活影響力總結 */}
                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center shrink-0">
                         <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-gray-500 font-black uppercase">Carbon_Saved</span>
                                <span className="text-base font-mono font-bold text-emerald-400">145.2kg</span>
                            </div>
                            <div className="flex flex-col border-l border-white/10 pl-4">
                                <span className="text-[9px] text-gray-500 font-black uppercase">GWC_Earned</span>
                                <span className="text-base font-mono font-bold text-celestial-gold">850</span>
                            </div>
                         </div>
                         <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3 group cursor-pointer hover:bg-white/10 transition-all">
                             <span className="text-[10px] font-black text-gray-400 group-hover:text-white transition-colors">FULL_IMPACT_REPORT</span>
                             <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
