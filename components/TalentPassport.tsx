
import React, { useState } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { 
    UserCheck, Award, Star, Fingerprint, BrainCircuit, Sparkles, 
    GraduationCap, CheckCircle, Target, ArrowUpRight, BookOpen, 
    Zap, Briefcase, Microscope, Lightbulb, ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface TalentPassportProps {
  language: Language;
}

interface SkillGalaxyProps extends InjectedProxyProps {
    data: any[];
    isZh: boolean;
}

const SkillGalaxyBase: React.FC<SkillGalaxyProps> = ({ data, isZh, adaptiveTraits, isAgentActive, trackInteraction }) => {
    const isLearning = adaptiveTraits?.includes('learning') || isAgentActive;
    const isEvolved = adaptiveTraits?.includes('evolution');

    return (
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group min-h-[400px] flex flex-col">
            <div className={`absolute inset-0 bg-gradient-to-br from-celestial-purple/5 via-transparent to-celestial-blue/5 transition-opacity duration-1000 ${isLearning ? 'opacity-100' : 'opacity-20'}`} />
            
            <div className="absolute top-6 right-6 z-20">
                <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all duration-500
                    ${isLearning ? 'text-celestial-purple bg-celestial-purple/10 border-celestial-purple/30' : 'text-gray-400 bg-white/5 border-white/10'}
                `}>
                    <BrainCircuit className={`w-3 h-3 ${isLearning ? 'animate-pulse' : ''}`} />
                    {isZh ? 'AI 學習路徑優化中' : 'Optimizing Learning Path...'}
                </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-6 relative z-10 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-celestial-blue" />
                {isZh ? '技能星系 (Skill Galaxy)' : 'Skill Galaxy'}
            </h3>
            
            <div className="relative z-10 flex-1 min-h-[300px] w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar 
                            name={isZh ? "我的技能" : "My Skills"} 
                            dataKey="A" 
                            stroke="#10b981" 
                            strokeWidth={2} 
                            fill="#10b981" 
                            fillOpacity={isEvolved ? 0.5 : 0.3} 
                        />
                        <Radar 
                            name={isZh ? "目標產業要求" : "Industry Gap"} 
                            dataKey="B" 
                            stroke="#8b5cf6" 
                            strokeWidth={2} 
                            fill="#8b5cf6" 
                            fillOpacity={0.1} 
                        />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const SkillGalaxyAgent = withUniversalProxy(SkillGalaxyBase);

export const TalentPassport: React.FC<TalentPassportProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { userName, userRole } = useCompany();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'skills' | 'training' | 'analysis'>('skills');

  const pageData = {
      title: { zh: '人才護照與職涯導航', en: 'Talent Passport & Career Nav' },
      desc: { zh: '基於 AI 的能力評估與產業職訓路徑建議', en: 'AI-based ability analysis and industry training roadmap.' },
      tag: { zh: '人才核心', en: 'Talent Core' }
  };

  const skillData = [
    { subject: isZh ? '碳管理' : 'Carbon Mgmt', A: 120, B: 110 },
    { subject: isZh ? '法規遵循' : 'Compliance', A: 98, B: 130 },
    { subject: isZh ? '數據分析' : 'Data Analytics', A: 86, B: 130 },
    { subject: isZh ? '循環經濟' : 'Circular Eco', A: 99, B: 100 },
    { subject: isZh ? '社會影響' : 'Social Impact', A: 85, B: 90 },
    { subject: isZh ? '綠色金融' : 'Green Finance', A: 65, B: 115 },
  ];

  const industryTraining = [
      { id: 't1', title: 'ISO 14064 溫室氣體盤查主導查驗員', provider: 'SGS / BSI', duration: '5 Days', reward: 'Specialist Cert', price: 'GWC 2500' },
      { id: 't2', title: 'ESG 永續報告書編製實務 (GRI/SASB)', provider: 'Sustainability Foundation', duration: '3 Days', reward: 'Reporter Cert', price: 'GWC 1800' },
      { id: 't3', title: 'IFRS 永續揭露準則深度解析', provider: 'Financial Research Institute', duration: '2 Days', reward: 'Compliance Cert', price: 'GWC 1200' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <UniversalPageHeader 
          icon={Fingerprint}
          title={pageData.title}
          description={pageData.desc}
          language={language}
          tag={pageData.tag}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-celestial-emerald to-celestial-blue p-1 mb-6">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="User" className="w-full h-full rounded-full bg-slate-900 border-4 border-slate-900 object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{userName}</h3>
                <p className="text-sm text-celestial-purple mb-6 font-medium">{userRole}</p>
                
                <div className="grid grid-cols-2 gap-4 w-full border-t border-white/5 pt-6">
                    <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase font-black mb-1">Rank</div>
                        <div className="text-lg font-bold text-white">Advanced</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase font-black mb-1">Impact</div>
                        <div className="text-lg font-bold text-emerald-400">Top 5%</div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-celestial-gold/20 bg-celestial-gold/5">
                <h4 className="text-xs font-black text-celestial-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Recommended Next Steps
                </h4>
                <div className="space-y-3">
                    <button className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-left text-xs text-gray-300 flex justify-between items-center transition-all group">
                        <span>{isZh ? '完成 GRI 認證課程' : 'Complete GRI Cert'}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                    <button className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-left text-xs text-gray-300 flex justify-between items-center transition-all group">
                        <span>{isZh ? '參與綠色金融研討會' : 'Join Green Finance Forum'}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl shrink-0">
                {[
                    { id: 'skills', label: isZh ? '技能星系' : 'Skill Galaxy', icon: Target },
                    { id: 'analysis', label: isZh ? 'AI 能力分析' : 'AI Analysis', icon: Lightbulb },
                    { id: 'training', label: isZh ? '產業職訓資料' : 'Industry Training', icon: BookOpen },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 min-h-[400px]">
                {activeTab === 'skills' && <SkillGalaxyAgent id="SkillGalaxy" label="Skill Map" data={skillData} isZh={isZh} />}
                
                {activeTab === 'analysis' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/40">
                            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Microscope className="w-5 h-5 text-celestial-purple" />
                                {isZh ? '關鍵落差識別' : 'Key Gap Identification'}
                            </h4>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                                    <div className="text-xs font-bold text-rose-400 mb-1">Critical Gap: Green Finance</div>
                                    <p className="text-[11px] text-gray-400 leading-relaxed">
                                        Your profile lacks "Green Investment Evaluation" skills required for Tier 1 Enterprise CSO roles. 
                                        Industry benchmark: 85% | You: 65%
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="text-xs font-bold text-emerald-400 mb-1">Strength: Carbon Management</div>
                                    <p className="text-[11px] text-gray-400 leading-relaxed">
                                        Highly competitive. Your deep knowledge in ISO 14064 puts you in the top 3% of candidates for Technology sector.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl border border-celestial-gold/30 bg-celestial-gold/5">
                            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <ArrowUpRight className="w-5 h-5 text-celestial-gold" />
                                {isZh ? '演化路徑建議' : 'Evolution Path'}
                            </h4>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white">1</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white">Master CDP Reporting</div>
                                        <p className="text-[10px] text-gray-500 mt-1">Expected XP: +1200 | Value: High</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 opacity-50">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white">2</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white">Supply Chain Logic Analysis</div>
                                        <p className="text-[10px] text-gray-500 mt-1">Lock: Complete Cert L2</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'training' && (
                    <div className="space-y-4 animate-fade-in">
                        {industryTraining.map(item => (
                            <div key={item.id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-celestial-blue/40 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-celestial-blue/10 text-celestial-blue rounded-xl group-hover:bg-celestial-blue group-hover:text-black transition-colors">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-celestial-blue transition-colors">{item.title}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span>{item.provider}</span>
                                            <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                            <span>{item.duration}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{item.reward}</div>
                                        <div className="text-sm font-mono text-gray-300">{item.price}</div>
                                    </div>
                                    <button 
                                        onClick={() => addToast('success', 'Enrolled in training path.', 'Academy')}
                                        className="flex-1 md:flex-none py-2 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
                                    >
                                        Enroll
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
