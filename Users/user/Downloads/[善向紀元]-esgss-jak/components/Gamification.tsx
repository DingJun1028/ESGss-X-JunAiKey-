
import React, { useState, useEffect } from 'react';
// Fix: Removed CrystalType which is not exported by ../types
import { Language, View, VocationType, UserTitle, Badge } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalCrystal } from './UniversalCrystal';
import { 
    Sparkles, Activity, Layers, ArrowUpRight, Swords, Dna, Package, Shield, 
    Zap, FlaskConical, Plus, Hexagon, Library, History, Archive, ScrollText, 
    Trophy, Sun, Award, Globe, Search, PenTool, User, Calendar, Star,
    CheckCircle, Users, ArrowRight
} from 'lucide-react';
import { getEsgCards, VOCATIONS } from '../constants';
import { UniversalCard } from './UniversalCard';
import { UniversalPageHeader } from './UniversalPageHeader';

interface GamificationProps {
  language: Language;
}

// Sub-Component: Vocation Card
const VocationCard: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { vocation, activeTitle, awardXp } = useCompany();
    const config = VOCATIONS[vocation.type];

    const Icon = {
        Architect: Hexagon,
        Alchemist: FlaskConical,
        Scribe: PenTool,
        Envoy: Globe,
        Seeker: Search,
        Guardian: Shield
    }[vocation.type];

    return (
        <div className={`glass-panel p-6 rounded-2xl border border-${config.color}-500/30 bg-${config.color}-500/5 relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700`}>
                <Icon className={`w-32 h-32 text-${config.color}-500`} />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl bg-${config.color}-500/20 text-${config.color}-400`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Vocation Rank</div>
                        <div className="text-2xl font-bold text-white">Lv.{vocation.level}</div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{isZh ? config.label : vocation.type}</h3>
                <p className="text-xs text-gray-400 mb-6">{isZh ? config.desc : config.desc}</p>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                        <span>Resonance</span>
                        <span>{vocation.exp} / {vocation.nextLevelExp}</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                        <div className={`h-full bg-${config.color}-500 transition-all duration-1000`} style={{ width: `${(vocation.exp/vocation.nextLevelExp)*100}%` }} />
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {vocation.perks.map(perk => (
                        <span key={perk} className={`px-2 py-0.5 rounded bg-${config.color}-500/10 text-${config.color}-400 text-[10px] font-bold border border-${config.color}-500/20`}>
                            {perk}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Sub-Component: Activity Pulse (Heatmap)
const ActivityPulse: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { activityPulse } = useCompany();
    
    // Create 35 squares (5 weeks)
    const squares = Array.from({ length: 35 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (34 - i));
        const dateStr = date.toISOString().split('T')[0];
        const record = activityPulse.find(p => p.date === dateStr);
        return { date: dateStr, intensity: record?.intensity || 0 };
    });

    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h4 aria-label="Section Title" className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-celestial-emerald" />
                {isZh ? '神經反射脈動 (Activity Pulse)' : 'Activity Pulse'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
                {squares.map((s, i) => (
                    <div 
                        key={i} 
                        title={s.date}
                        className={`w-4 h-4 rounded-sm transition-colors duration-500
                            ${s.intensity === 0 ? 'bg-white/5' : 
                              s.intensity === 1 ? 'bg-emerald-900' :
                              s.intensity === 2 ? 'bg-emerald-700' :
                              s.intensity === 3 ? 'bg-emerald-500' : 'bg-celestial-gold shadow-[0_0_8px_rgba(251,191,36,0.4)]'}
                        `}
                    />
                ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] text-gray-500">
                <span>Last 35 days</span>
                <div className="flex items-center gap-1">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white/5 rounded-sm" />
                        <div className="w-2 h-2 bg-emerald-900 rounded-sm" />
                        <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
                        <div className="w-2 h-2 bg-celestial-gold rounded-sm" />
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};

// Sub-Component: Eternal Palace
const EternalPalace: React.FC<{ isZh: boolean }> = ({ isZh }) => {
    const { journal, collectedCards, badges, events, activeTitle, ownedTitles, setActiveTitle, socialFrequency } = useCompany();
    const cards = getEsgCards(isZh ? 'zh-TW' : 'en-US');
    const myDeck = cards.filter(c => collectedCards.includes(c.id));

    const [activeSection, setActiveSection] = useState<'ark' | 'corridor' | 'vocation' | 'events'>('vocation');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Palace Nav */}
            <div className="flex justify-center mb-10">
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
                    {[
                        { id: 'vocation', label: isZh ? '職業與靈魂' : 'Vocation', icon: User },
                        { id: 'ark', label: isZh ? '收藏聖櫃' : 'Ark', icon: Archive },
                        { id: 'events', label: isZh ? '官方活動' : 'Events', icon: Calendar },
                        { id: 'corridor', label: isZh ? '回憶長廊' : 'Memory', icon: History },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeSection === tab.id ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vocation & Identity Tab */}
            {activeSection === 'vocation' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <VocationCard isZh={isZh} />
                            <ActivityPulse isZh={isZh} />
                        </div>

                        {/* Title Selection */}
                        <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-slate-900/50">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Award className="w-6 h-6 text-celestial-gold" />
                                {isZh ? '稱號聖殿 (Acquired Titles)' : 'Sanctuary of Titles'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ownedTitles.map(title => (
                                    <button 
                                        key={title.id}
                                        onClick={() => setActiveTitle(title.id)}
                                        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group
                                            ${activeTitle?.id === title.id ? 'border-celestial-gold bg-celestial-gold/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}
                                        `}
                                    >
                                        <div className="flex justify-between items-center relative z-10">
                                            <span className={`font-bold ${activeTitle?.id === title.id ? 'text-celestial-gold' : 'text-white'}`}>{title.text}</span>
                                            {activeTitle?.id === title.id && <CheckCircle className="w-4 h-4 text-celestial-gold" />}
                                        </div>
                                        {title.bonusEffect && <div className="text-[10px] text-gray-500 mt-2 italic relative z-10">{title.bonusEffect}</div>}
                                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-black/40 text-[8px] font-bold text-gray-500 uppercase tracking-widest">{title.rarity}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Social Interaction Level */}
                        <div className="glass-panel p-6 rounded-2xl border border-celestial-purple/30 bg-celestial-purple/5">
                            <h4 aria-label="Section Title" className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-celestial-purple" />
                                {isZh ? '社群活躍度' : 'Social Intensity'}
                            </h4>
                            <div className="text-4xl font-bold text-white mb-2 font-mono">{socialFrequency}%</div>
                            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-celestial-purple to-pink-500 animate-pulse" style={{ width: `${socialFrequency}%` }} />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
                                {isZh ? '基於參與論壇、課程共學與禮物贈送頻率計算。' : 'Based on forum activity, group learning, and gift frequency.'}
                            </p>
                        </div>

                        {/* Medals Wall */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/50">
                            <h4 aria-label="Section Title" className="text-sm font-bold text-white mb-6">{isZh ? '成就勳章' : 'Medals'}</h4>
                            <div className="grid grid-cols-3 gap-4">
                                {badges.map(badge => (
                                    <div 
                                        key={badge.id} 
                                        className={`flex flex-col items-center gap-2 transition-all ${badge.unlockedAt ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-90'}`}
                                        title={badge.description}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 
                                            ${badge.category === 'Milestone' ? 'border-emerald-500 bg-emerald-500/10' : 
                                              badge.category === 'Social' ? 'border-pink-500 bg-pink-500/10' : 'border-celestial-gold bg-celestial-gold/10'}
                                        `}>
                                            <Trophy className={`w-6 h-6 ${badge.category === 'Milestone' ? 'text-emerald-400' : badge.category === 'Social' ? 'text-pink-400' : 'text-celestial-gold'}`} />
                                        </div>
                                        <span className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-tighter truncate w-full">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ark of Collection */}
            {activeSection === 'ark' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
                    <div className="relative w-64 h-96 rounded-2xl bg-gradient-to-br from-celestial-gold/20 to-transparent border border-celestial-gold/50 flex flex-col items-center justify-center p-6 text-center cursor-pointer group hover:scale-105 transition-transform">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                        <div className="w-24 h-24 rounded-full bg-celestial-gold/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-pulse">
                            <Sun className="w-12 h-12 text-celestial-gold" />
                        </div>
                        <h4 aria-label="Section Title" className="text-xl font-bold text-white mb-2">{isZh ? '光之聖典' : 'Light Scripture'}</h4>
                        <p className="text-xs text-gray-300">{isZh ? 'ESGss 技術規格白皮書與創世智慧。' : 'The Genesis Wisdom & Technical Whitepaper.'}</p>
                        <div className="mt-4 px-3 py-1 bg-celestial-gold text-black text-[10px] font-bold rounded-full uppercase">LEGENDARY ITEM</div>
                    </div>

                    {myDeck.map(card => (
                        <div key={card.id} className="transform hover:scale-105 transition-transform duration-300">
                            <UniversalCard card={card} isLocked={false} isSealed={false} masteryLevel="Novice" onClick={() => {}} onKnowledgeInteraction={() => {}} onPurifyRequest={() => {}} />
                        </div>
                    ))}
                </div>
            )}

            {/* Events Tab */}
            {activeSection === 'events' && (
                <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
                    {events.map(event => (
                        <div key={event.id} className={`p-6 rounded-3xl border flex items-center justify-between transition-all 
                            ${event.status === 'Participating' ? 'border-celestial-blue bg-celestial-blue/5' : 'border-white/5 bg-white/5'}
                        `}>
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border 
                                    ${event.status === 'Completed' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5'}
                                `}>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{event.date.split('-')[1]}</span>
                                    <span className="text-xl font-bold text-white">{event.date.split('-')[2]}</span>
                                </div>
                                <div>
                                    <h4 aria-label="Section Title" className="text-lg font-bold text-white mb-1">{event.title}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">{event.date}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${event.status === 'Completed' ? 'text-emerald-400 bg-emerald-400/10' : 'text-celestial-blue bg-celestial-blue/10'}`}>{event.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-celestial-gold">+{event.xpReward} XP</div>
                                <button className="mt-2 text-xs text-white hover:underline flex items-center gap-1">{isZh ? '活動詳情' : 'Details'} <ArrowRight className="w-3 h-3"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Memory Corridor */}
            {activeSection === 'corridor' && (
                <div className="relative border-l-2 border-white/10 ml-6 space-y-8 py-4 animate-fade-in">
                    {journal.map((entry, i) => (
                        <div key={entry.id} className="relative pl-8 group">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all z-10 ${entry.type === 'milestone' ? 'bg-celestial-gold border-celestial-gold' : 'bg-slate-900 border-white/20'}`} />
                            <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                                <div className="text-xs text-gray-500 mb-1">{new Date(entry.timestamp).toLocaleString()}</div>
                                <h4 aria-label="Section Title" className={`font-bold ${entry.type === 'milestone' ? 'text-celestial-gold' : 'text-white'}`}>{entry.title}</h4>
                                <p className="text-sm text-gray-400 mt-1">{entry.impact}</p>
                                <div className="mt-2 flex gap-2">
                                    {entry.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded border border-white/5 text-gray-400">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Gamification: React.FC<GamificationProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  return <EternalPalace isZh={isZh} />;
};

export const UniversalRestoration: React.FC<{ language: Language }> = ({ language }) => (
    <div className="p-8">
        <h2 className="text-white">Under Construction</h2>
    </div>
);

export const CardGameArenaView: React.FC<{ language: Language }> = ({ language }) => (
    <div className="p-8">
        <h2 className="text-white">Arena Placeholder</h2>
    </div>
);
