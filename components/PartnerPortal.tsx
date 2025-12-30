
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
    Globe, ShieldCheck, Zap, ArrowRight, MessageSquare, 
    ExternalLink, Building, Info, Newspaper, Target, Heart,
    Compass, Microscope, Mountain, Activity, Users, Radio,
    Sparkles, Calendar, Award, Star, Library, BookOpen, Fingerprint, Cpu,
    /* Fix: Removed non-existent Waveform import from lucide-react */
    Link as LinkIcon, Database, CheckCircle, Flame
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';

export const PartnerPortal: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [activePartner, setActivePartner] = useState<'esgss' | 'samwell' | 'kentrek'>('esgss');
  const [syncPulse, setSyncPulse] = useState(0);

  // 模擬量子語義檢索的脈動效果
  useEffect(() => {
    const timer = setInterval(() => {
        setSyncPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const partners = {
    esgss: {
        id: 'esgss',
        name: isZh ? '善向永續 (ESGss)' : 'ESG Sunshine',
        tagline: isZh ? '創價型永續轉型的領導者' : 'Leader in Value-Creating ESG',
        mission: isZh ? '透過 AIOS 與王道思維，將 ESG 從「成本負擔」轉化為企業的「競爭優勢」。' : 'Transforming ESG from cost to competitive edge via AIOS.',
        vision: isZh ? '建立一個數據與價值共生的全球永續作業系統，實現組織的再生治理。' : 'Building a global sustainability OS for regenerative governance.',
        officialSite: 'https://www.esgsunshine.com/',
        flagship: {
            title: isZh ? 'Berkeley × TSISDA 國際雙證班' : 'Berkeley × TSISDA Global Cert',
            desc: isZh ? '整合 Berkeley Haas IBI 頂尖策略思維與台灣實務轉型實作。' : 'Integrating Berkeley Haas IBI logic with Taiwan execution.',
            link: 'https://www.esgsunshine.com/courses/berkeley-tsisda'
        },
        features: [
            { title: isZh ? 'AIOS 智慧中樞' : 'AIOS Kernel', desc: isZh ? '自動化合規與創價模擬引擎' : 'Automated compliance & value engine' },
            { title: isZh ? '王道思維框架' : 'Wangdao Logic', desc: isZh ? '對標全球 500 強企業永續案例' : 'Benchmarking Global Fortune 500' }
        ],
        news: [
            { date: '2025.03', title: isZh ? 'JunAiKey v16.1 聯盟協定正式發布' : 'JunAiKey v16.1 Affiliate Protocol Live' },
            { date: '2025.02', title: isZh ? '啟動 2025 永續轉型領袖培育計畫' : '2025 ESG Leader Program Launched' }
        ],
        ingestion: { status: 'Synced', last: '5m ago', tokens: '450k', reliability: 99.8, frequency: '0.5Hz' },
        icon: Star,
        color: 'text-celestial-gold',
        bg: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30'
    },
    samwell: {
        id: 'samwell',
        name: isZh ? '山衛科技 (Samwell)' : 'Samwell Testing',
        tagline: isZh ? '工業安全與環境監測的精準守護者' : 'Precision Guardian of Industry Safety',
        mission: isZh ? '引領精密測試與監測技術，確保工業生產與環境共存的極致安全。' : 'Leading precision monitoring to ensure extreme safety and harmony.',
        vision: isZh ? '讓每一筆量測數據，都成為守護地球與人類安全的堅實後盾。' : 'Every measurement data becomes a shield for Earth & Humanity.',
        officialSite: 'https://www.samwells.com/h/Index?key=icm3',
        flagship: {
            title: isZh ? 'AE 聲發射早期預警監測系統' : 'AE Early Warning System',
            desc: isZh ? '利用量子級別的震動分析，在微小裂紋產生時即發出警報，預防環境災難。' : 'Quantum-level vibration analysis to prevent environmental disasters.',
            link: 'https://www.samwells.com/h/Index?key=icm3'
        },
        features: [
            { title: isZh ? '精密環境監測' : 'Eco Monitoring', desc: isZh ? '30 年環境應力測試與分析實戰經驗' : '30 years of stress testing expertise' },
            { title: isZh ? '工業安全 4.0' : 'Safety 4.0', desc: isZh ? '整合 IoT 與 AI 的自動巡檢方案' : 'IoT & AI integrated auto-inspection' }
        ],
        news: [
            { date: '2025.02', title: isZh ? '引進全新量子能譜分析儀，強化材料溯源' : 'New Quantum spectral analyzer for traceability' },
            { date: '2025.01', title: isZh ? '成功協助石化園區完成大型 ESG 環境風險盤查' : 'ESG risk audit completed for Petro-Park' }
        ],
        ingestion: { status: 'Ingesting', last: 'Active', tokens: '1.2M', reliability: 98.4, frequency: '2.4Hz' },
        icon: Microscope,
        color: 'text-celestial-blue',
        bg: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30'
    },
    kentrek: {
        id: 'kentrek',
        name: isZh ? '墾趣 (KenTrek)' : 'KenTrek Outdoor',
        tagline: isZh ? '無痕山林與永續戶外生活的倡議者' : 'Advocate of LNT & Sustainable Outdoor',
        mission: isZh ? '讓每趟大自然冒險，都成為對地球的溫柔呵護，推廣永續戶外探索。' : 'Making every nature adventure a gentle care for the Earth.',
        vision: isZh ? '連結戶外熱情與環境責任，打造台灣獨特的永續探索文化。' : 'Bridging outdoor passion and eco-responsibility in Taiwan.',
        officialSite: 'https://www.freetimegears.com.tw/ec/',
        flagship: {
            title: isZh ? '墾趣永續學院 (LNT Academy)' : 'KenTrek LNT Academy',
            desc: isZh ? '培育具備無痕山林 (Leave No Trace) 精神的領袖，推廣循環裝備共享。' : 'Cultivating LNT leaders and promoting circular gear economy.',
            link: 'https://www.freetimegears.com.tw/ec/'
        },
        features: [
            { title: isZh ? '無痕山林教育' : 'LNT Education', desc: isZh ? '系統化培育戶外永續公民意識' : 'Systematic outdoor eco-citizenship' },
            { title: isZh ? '循環裝備服務' : 'Circular Gear', desc: isZh ? '延長裝備生命週期，減少戶外廢棄物' : 'Reducing waste via equipment lifecycle mgmt' }
        ],
        news: [
            { date: '2025.03', title: isZh ? '2025 墾趣永續營地計畫正式開放報名' : 'KenTrek Sustainability Camp 2025 Open' },
            { date: '2025.02', title: isZh ? '「循環背包」回收再生計畫獲得 ESG 創新獎' : 'Circular Backpack Project wins Innovation Award' }
        ],
        ingestion: { status: 'Linked', last: '1h ago', tokens: '28k', reliability: 100, frequency: '0.1Hz' },
        icon: Mountain,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30'
    }
  };

  const partner = partners[activePartner];

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden pb-24 lg:pb-0">
        <UniversalPageHeader 
            icon={Globe}
            title={{ zh: '生態夥伴矩陣', en: 'Ecosystem Partner Matrix' }}
            description={{ zh: '連結跨界領航者：善向 × 山衛 × 墾趣，共創永續文明生態系', en: 'Connecting Visionaries: ESGss × Samwell × KenTrek' }}
            language={language}
            tag={{ zh: '生態核心 v16.1', en: 'ECO_SYSTEM_V16.1' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-y-auto lg:overflow-hidden no-scrollbar">
            {/* 左側：導航節點 (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="glass-bento p-6 flex flex-col bg-slate-900/60 border-white/5 shadow-2xl shrink-0 rounded-[2.5rem]">
                    <h3 className="zh-main text-lg text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-500" />
                        {isZh ? '合作節點' : 'Partner Nodes'}
                    </h3>
                    <div className="space-y-3">
                        {Object.values(partners).map((p) => (
                            <button 
                                key={p.id}
                                onClick={() => setActivePartner(p.id as any)}
                                className={`w-full p-5 rounded-[2rem] border transition-all flex items-center gap-4 text-left group relative overflow-hidden
                                    ${activePartner === p.id ? `${p.borderColor} bg-white/10 shadow-2xl scale-[1.02]` : 'bg-white/5 border-white/5 hover:border-white/20'}
                                `}
                            >
                                <div className={`p-3 rounded-2xl bg-black/40 border transition-all ${activePartner === p.id ? `${p.borderColor} ${p.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'border-white/10 text-gray-600'}`}>
                                    <p.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`zh-main text-base truncate ${activePartner === p.id ? 'text-white' : 'text-gray-400'}`}>{p.name}</div>
                                    <div className="text-[9px] font-mono text-gray-500 mt-0.5 uppercase tracking-tighter">{p.id}_LINK_ACTIVE</div>
                                </div>
                                {activePartner === p.id && <Zap className={`w-4 h-4 ${p.color} animate-pulse`} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AIOS Ingestion Monitoring (依照白皮書 4.0 章節) */}
                <div className="glass-bento p-8 flex-1 bg-slate-950 border-emerald-500/20 relative overflow-hidden flex flex-col shadow-xl min-h-[350px] rounded-[2.5rem]">
                    <div className="absolute -right-10 -bottom-10 opacity-5"><Database className="w-40 h-40 text-emerald-400" /></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="zh-main text-xs text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <LinkIcon className="w-3 h-3" /> AIOS_KNOWLEDGE_SYNC
                            </h4>
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-mono text-emerald-500">{partner.ingestion.frequency}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-6 flex-1">
                            {/* Quantum Sync Waveform (Visual simulation) */}
                            <div className="h-20 bg-black/40 rounded-2xl border border-white/5 flex items-end justify-between px-4 pb-4 overflow-hidden relative">
                                <div className="absolute top-2 left-4 text-[7px] font-black text-gray-600 uppercase tracking-widest">Semantic_Ingestion_Pulse</div>
                                {[...Array(30)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="w-1 bg-emerald-500 rounded-full transition-all duration-300"
                                        style={{ 
                                            height: `${20 + Math.sin((syncPulse + i) * 0.3) * 30 + Math.random() * 20}%`,
                                            opacity: 0.2 + (i / 30) * 0.5
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Reliability</div>
                                    <div className="text-2xl font-mono font-bold text-emerald-400">{partner.ingestion.reliability}%</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Ingested</div>
                                    <div className="text-2xl font-mono font-bold text-white">{partner.ingestion.tokens}</div>
                                </div>
                            </div>

                            <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-500 uppercase font-black">Sync_Protocol_A11</span>
                                    <span className="text-emerald-500 font-bold uppercase">{partner.ingestion.status}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 animate-pulse" style={{ width: `${partner.ingestion.reliability}%` }} />
                                </div>
                                <div className="flex justify-between text-[8px] font-mono text-gray-600">
                                    <span>LAST_TX: {partner.ingestion.last}</span>
                                    <span>HASH: 0x{Math.random().toString(16).substr(2, 6).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右側：夥伴數位孿生與戰略報告 (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 glass-bento p-10 bg-slate-900/40 relative overflow-y-auto no-scrollbar shadow-2xl border-white/5 rounded-[3.5rem]">
                    
                    {/* Header: Identity & Narrative */}
                    <div className="flex flex-col xl:flex-row justify-between items-start gap-8 mb-16 border-b border-white/5 pb-12">
                        <div className="space-y-6 flex-1">
                            <div className="flex items-center gap-6">
                                <div className={`p-6 rounded-[2.5rem] ${partner.bg} ${partner.color} shadow-2xl animate-prism-pulse shrink-0 border border-white/10`}>
                                    <partner.icon className="w-16 h-16" />
                                </div>
                                <div>
                                    <h2 className="zh-main text-5xl text-white tracking-tighter">{partner.name}</h2>
                                    <p className={`text-sm font-bold uppercase tracking-[0.4em] mt-2 ${partner.color}`}>{partner.tagline}</p>
                                </div>
                            </div>
                            <div className="p-8 bg-white/[0.02] rounded-[3rem] border border-white/5 shadow-inner">
                                <p className="text-2xl text-gray-200 font-light leading-relaxed italic max-w-3xl">
                                    "{partner.mission}"
                                </p>
                            </div>
                        </div>
                        <div className="w-full xl:w-72 space-y-4 shrink-0">
                            <a 
                                href={partner.officialSite} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-celestial-gold transition-all shadow-2xl shadow-white/10 active:scale-95"
                            >
                                <Globe className="w-5 h-5" /> {isZh ? '造訪官方入口' : 'Official Portal'}
                            </a>
                            <button className="w-full py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                                <MessageSquare className="w-5 h-5" /> {isZh ? '發起戰略對話' : 'Strategic Inquiry'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Latest Intelligence */}
                        <div className="space-y-10">
                            <h4 className="flex items-center gap-4 zh-main text-2xl text-white uppercase tracking-widest border-l-4 border-celestial-gold pl-6">
                                <Activity className="w-8 h-8 text-celestial-gold" />
                                {isZh ? '最新情報脈動' : 'Latest Intelligence'}
                            </h4>
                            <div className="space-y-6">
                                {partner.news.map((item, i) => (
                                    <div key={i} className="p-6 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-celestial-gold/30 transition-all group cursor-pointer relative overflow-hidden">
                                        <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 mb-2">
                                            <Calendar className="w-3 h-3" />
                                            {item.date}
                                        </div>
                                        <h5 className="zh-main text-lg text-gray-200 group-hover:text-white transition-colors leading-tight">{item.title}</h5>
                                        <ArrowRight className="absolute bottom-6 right-6 w-4 h-4 text-gray-800 group-hover:text-celestial-gold group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="p-8 bg-gradient-to-br from-white/5 to-transparent rounded-[3rem] border border-white/10 shadow-inner">
                                <h5 className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-[0.3em] flex items-center gap-2">
                                    <Target className="w-3 h-3" /> FUTURE_VISION_MANIFESTO
                                </h5>
                                <p className="text-sm text-gray-400 leading-relaxed font-light">{partner.vision}</p>
                            </div>
                        </div>

                        {/* Flagship & Digital Assets */}
                        <div className="space-y-10">
                            <h4 className="flex items-center gap-4 zh-main text-2xl text-white uppercase tracking-widest border-l-4 border-celestial-purple pl-6">
                                <Sparkles className="w-8 h-8 text-celestial-purple" />
                                {isZh ? '旗艦方案與聖物' : 'Flagships & Relics'}
                            </h4>
                            
                            {/* Flagship Card */}
                            <div className="p-10 bg-gradient-to-br from-celestial-purple/20 via-slate-900 to-black rounded-[3.5rem] border border-celestial-purple/30 relative overflow-hidden group/flag shadow-2xl">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/flag:opacity-10 transition-opacity"><Award className="w-48 h-48" /></div>
                                <div className="uni-mini bg-celestial-purple text-white mb-6 uppercase tracking-widest border-none px-3 py-1 shadow-lg">HIGHLY_RECOMMENDED</div>
                                <h5 className="zh-main text-3xl text-white mb-6 leading-tight">{partner.flagship.title}</h5>
                                <p className="text-base text-gray-400 leading-relaxed mb-10 font-light">
                                    {partner.flagship.desc}
                                </p>
                                <button 
                                    onClick={() => window.open(partner.flagship.link, '_blank')}
                                    className="flex items-center gap-4 text-sm font-black text-celestial-purple group-hover/flag:translate-x-3 transition-transform uppercase tracking-widest"
                                >
                                    {isZh ? '立即開啟轉型路徑' : 'OPEN REGEN PATHWAY'} <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {partner.features.map((f, i) => (
                                    <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] transition-all group flex flex-col justify-between">
                                        <div>
                                            <div className="text-xs font-black text-white uppercase mb-4 flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:animate-pulse shadow-[0_0_12px_#10b981]" />
                                                {f.title}
                                            </div>
                                            <p className="text-[11px] text-gray-400 leading-relaxed font-light">{f.desc}</p>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <Flame className="w-4 h-4 text-gray-800 group-hover:text-celestial-gold transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
