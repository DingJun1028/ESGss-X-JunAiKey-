
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Target, Plus, Search, Filter, ArrowRight, Loader2, Sparkles, 
    CheckCircle2, Activity, Globe, Heart, ShieldCheck, 
    Zap, Trash2, Calendar, Users, BarChart3, Info, Wand2, X, MoreVertical,
    TrendingUp, DollarSign, PieChart, Layout, Box, Gift, ChevronRight,
    PlayCircle, Save, FileText, Share2
} from 'lucide-react';
import { Language, ImpactProject } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { generateProjectTheoryOfChange } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';

// RPG-style Progress Bar
const ImpactProgressBar: React.FC<{ progress: number, color?: string }> = ({ progress, color = "bg-emerald-500" }) => (
    <div className="w-full">
        <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase text-gray-500 tracking-tighter">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800/50 rounded-full border border-white/5 overflow-hidden">
            <div 
                className={`h-full ${color} shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-1000`} 
                style={{ width: `${progress}%` }} 
            />
        </div>
    </div>
);

// SROI Component
const SroiIndicator: React.FC<{ value: number }> = ({ value }) => (
    <div className="p-4 bg-gradient-to-br from-celestial-gold/20 to-transparent border border-celestial-gold/30 rounded-2xl flex items-center justify-between shadow-xl">
        <div>
            <div className="text-[9px] font-black text-celestial-gold uppercase tracking-widest mb-1">Real-time SROI</div>
            <div className="text-3xl font-mono font-black text-white tracking-tighter">1:{value.toFixed(1)}</div>
        </div>
        <div className="p-3 bg-black/40 rounded-xl">
            <TrendingUp className="w-6 h-6 text-celestial-gold" />
        </div>
    </div>
);

export const ImpactProjects: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { awardXp, goodwillBalance, updateGoodwillBalance } = useCompany();
  
  const [projects, setProjects] = useState<ImpactProject[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showForge, setShowForge] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({ title: '', desc: '' });
  const [aiProposal, setAiProposal] = useState<Partial<ImpactProject> | null>(null);

  const selectedProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);

  const filteredProjects = projects.filter(p => {
      if (activeTab === 'all') return true;
      if (activeTab === 'active') return p.status === 'active';
      if (activeTab === 'completed') return p.status === 'completed';
      return true;
  });

  const handleStartForge = () => {
      setWizardStep(1);
      setWizardData({ title: '', desc: '' });
      setAiProposal(null);
      setShowForge(true);
  };

  const handleRunAiGen = async () => {
      if (!wizardData.title || !wizardData.desc) return;
      setIsAiProcessing(true);
      addToast('info', isZh ? 'AI 正在編寫變革理論...' : 'AI Manifesting Theory of Change...', 'Kernel');
      
      try {
          const result = await generateProjectTheoryOfChange(wizardData.title, wizardData.desc, language);
          setAiProposal(result);
          setWizardStep(2);
          addToast('success', isZh ? '提案藍圖已生成' : 'Proposal Blueprint Generated', 'System');
      } catch (e) {
          addToast('error', 'Forge Connection Interrupted', 'System');
      } finally {
          setIsAiProcessing(false);
      }
  };

  const handleConfirmProject = () => {
      if (!aiProposal) return;
      const newProject: ImpactProject = {
          id: `ip-${Date.now()}`,
          title: wizardData.title,
          description: wizardData.desc,
          status: 'active',
          progress: 5,
          impactXP: 0,
          sdgs: aiProposal.sdgs || [1],
          logicModel: aiProposal.logicModel || { inputs: [], activities: [], outputs: [], outcomes: [], impact: '' },
          financials: { budget: 100000, spent: 0, revenue_projected: 150000 },
          impactMetrics: aiProposal.impactMetrics || [],
          sroi: 0
      };
      
      setProjects([newProject, ...projects]);
      setShowForge(false);
      awardXp(500);
      addToast('reward', isZh ? '新影響力專案已啟動！獲得 500 XP' : 'New Impact Project Active! +500 XP', 'Evolution');
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Target}
            title={{ zh: '影響力專案管理 (IPMS)', en: 'Impact Project System' }}
            description={{ zh: '從提案到顯化：管理具備社會價值與財務回報的創價專案', en: 'Manifesting social value and financial returns through IPMS.' }}
            language={language}
            tag={{ zh: '專案核心 v1.0', en: 'IMPACT_CORE_v1.0' }}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl shadow-xl">
                {[
                    { id: 'all', label: isZh ? '全部' : 'All' },
                    { id: 'active', label: isZh ? '進行中' : 'Active' },
                    { id: 'completed', label: isZh ? '已結案' : 'Completed' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setSelectedProjectId(null); }}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        {tab.label.toUpperCase()}
                    </button>
                ))}
            </div>
            <button 
                onClick={handleStartForge}
                className="px-10 py-3.5 bg-gradient-to-r from-celestial-emerald to-emerald-600 text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95 uppercase tracking-widest text-[11px]"
            >
                <Plus className="w-5 h-5" /> {isZh ? '啟動新創價專案' : 'FORGE NEW PROJECT'}
            </button>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            {/* Left: Project Feed (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0 overflow-y-auto no-scrollbar">
                {filteredProjects.length === 0 ? (
                    <div className="flex-1 glass-bento border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center opacity-30 grayscale rounded-[3rem]">
                        <Box className="w-20 h-20 mb-6" />
                        <p className="zh-main text-lg uppercase tracking-widest">No Projects Found</p>
                        <p className="text-xs mt-2 italic">Initiate your first project to start earning Impact XP.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProjects.map(project => (
                            <div 
                                key={project.id} 
                                onClick={() => setSelectedProjectId(project.id)}
                                className={`glass-bento p-8 bg-slate-900/40 border-white/5 rounded-[3rem] group transition-all cursor-pointer relative overflow-hidden shadow-2xl
                                    ${selectedProjectId === project.id ? 'border-celestial-emerald/40 bg-emerald-500/[0.03] scale-[1.02]' : 'hover:border-white/20'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${selectedProjectId === project.id ? 'text-emerald-400' : 'text-gray-500'} group-hover:text-emerald-400 transition-colors`}>
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{project.status}</div>
                                            <h3 className="zh-main text-xl text-white truncate max-w-[180px]">{project.title}</h3>
                                        </div>
                                    </div>
                                    <div className="uni-mini bg-black/40 text-emerald-500 border-emerald-500/20">XP: {project.impactXP}</div>
                                </div>
                                <ImpactProgressBar progress={project.progress} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Detailed Dashboard & Theory of Change (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 overflow-hidden">
                {selectedProject ? (
                    <div className="flex-1 glass-bento bg-slate-950/40 border-white/5 rounded-[3rem] p-10 flex flex-col overflow-y-auto no-scrollbar shadow-2xl animate-slide-up">
                        {/* Header Info */}
                        <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-10 shrink-0">
                            <div className="space-y-4 max-w-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-emerald-500 text-black text-[9px] font-black rounded uppercase tracking-widest">ACTIVE_STRATEGY</div>
                                    <div className="flex gap-1">
                                        {selectedProject.sdgs.map(s => (
                                            <span key={s} className="w-6 h-6 rounded bg-black border border-white/10 flex items-center justify-center text-[9px] font-bold text-white shadow-lg">S{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <h2 className="zh-main text-4xl text-white leading-tight">{selectedProject.title}</h2>
                                <p className="text-gray-400 leading-relaxed font-light">{selectedProject.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <SroiIndicator value={1 + Math.random() * 5} />
                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white border border-white/5 transition-all"><Share2 className="w-5 h-5"/></button>
                                    <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-rose-400 border border-white/5 transition-all"><Trash2 className="w-5 h-5"/></button>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Logic Model / ToC */}
                            <div className="space-y-8">
                                <h4 className="flex items-center gap-4 zh-main text-xl text-white uppercase tracking-widest border-l-4 border-celestial-emerald pl-6">
                                    <Layout className="w-6 h-6 text-celestial-emerald" />
                                    {isZh ? '變革理論與邏輯模型' : 'Theory of Change'}
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Inputs', data: selectedProject.logicModel.inputs, icon: Box },
                                        { label: 'Activities', data: selectedProject.logicModel.activities, icon: Activity },
                                        { label: 'Outputs', data: selectedProject.logicModel.outputs, icon: Target }
                                    ].map(block => (
                                        <div key={block.label} className="p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-white/20 transition-all">
                                            <div className="flex items-center gap-3 mb-4">
                                                <block.icon className="w-4 h-4 text-gray-500" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{block.label}</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {block.data.map((item, i) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-3">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-500/50 mt-1.5 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Impact KPIs & XP Track */}
                            <div className="space-y-8">
                                <h4 className="flex items-center gap-4 zh-main text-xl text-white uppercase tracking-widest border-l-4 border-celestial-gold pl-6">
                                    <TrendingUp className="w-6 h-6 text-celestial-gold" />
                                    {isZh ? '影響力績效與成長' : 'Impact KPIs'}
                                </h4>
                                <div className="space-y-4">
                                    {selectedProject.impactMetrics.map((kpi, i) => (
                                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="zh-main text-sm text-white group-hover:text-celestial-gold transition-colors">{kpi.label}</span>
                                                <div className="text-right">
                                                    <div className="text-xs font-mono font-bold text-white">{kpi.current} / {kpi.target} <span className="text-[8px] text-gray-600">{kpi.unit}</span></div>
                                                </div>
                                            </div>
                                            <ImpactProgressBar progress={(kpi.current / kpi.target) * 100} color="bg-celestial-gold" />
                                            <div className="mt-4 flex justify-between items-center text-[9px] font-mono text-gray-600">
                                                <span>Proxy_Val: ${kpi.proxy_value}/unit</span>
                                                <span className="text-emerald-500 font-bold uppercase tracking-widest">In Sync</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Resource Allocation */}
                                <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[3rem] border border-indigo-500/20 shadow-inner">
                                    <h5 className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-[0.3em] flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" /> BUDGET_UTILIZATION
                                    </h5>
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="text-3xl font-mono font-bold text-white">${(selectedProject.financials.spent / 1000).toFixed(1)}k</div>
                                        <div className="text-[10px] text-gray-500 uppercase">Total: ${(selectedProject.financials.budget / 1000).toFixed(1)}k</div>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${(selectedProject.financials.spent / selectedProject.financials.budget) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row gap-6">
                            <button className="flex-1 py-5 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-3 hover:bg-celestial-emerald hover:text-white transition-all shadow-xl uppercase tracking-widest text-xs">
                                <PlayCircle className="w-5 h-5" /> Execute Milestone
                            </button>
                            <button className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-3xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                                <FileText className="w-5 h-5" /> Generate SROI Report
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 select-none grayscale">
                        <Target className="w-48 h-48 text-gray-600 mb-8 animate-pulse" />
                        <h3 className="zh-main text-4xl text-white uppercase tracking-[0.2em] mb-4">Select Project Shard</h3>
                        <p className="text-gray-500 text-lg max-w-sm font-light italic">"Choose an active manifest from the hub to access its full logic matrix."</p>
                    </div>
                )}
            </div>
        </div>

        {/* AI Forge Wizard (Modal) */}
        {showForge && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
                <div className="w-full max-w-4xl glass-bento bg-slate-900 border-white/10 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden h-[85vh]">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-48 h-48" /></div>
                    <button onClick={() => setShowForge(false)} className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-2xl text-gray-500 transition-all z-[700]"><X className="w-6 h-6"/></button>
                    
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        {/* Wizard Header */}
                        <div className="p-12 pb-0 shrink-0">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="p-4 rounded-3xl bg-celestial-emerald/20 text-celestial-emerald border border-celestial-emerald/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                    <Sparkles className={`w-8 h-8 ${isAiProcessing ? 'animate-spin' : 'animate-pulse'}`} />
                                </div>
                                <div>
                                    <h3 className="zh-main text-4xl text-white tracking-tighter">創價專案顯化精靈</h3>
                                    <p className="text-gray-500 uppercase tracking-[0.3em] font-black text-[10px] mt-1">Impact_Manifestation_Wizard_v1.0</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-12">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${wizardStep === s ? 'bg-celestial-emerald border-celestial-emerald text-black shadow-lg scale-110' : wizardStep > s ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-black/40 border-white/10 text-gray-700'}`}>
                                            {wizardStep > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                        </div>
                                        <div className={`h-0.5 w-12 rounded-full transition-all ${wizardStep > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wizard Body */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-12 pt-0">
                            {wizardStep === 1 && (
                                <div className="space-y-10 animate-fade-in">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Visionary Title</label>
                                        <input 
                                            value={wizardData.title}
                                            onChange={e => setWizardData({...wizardData, title: e.target.value})}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-2xl text-white focus:border-celestial-emerald outline-none transition-all placeholder:text-gray-700"
                                            placeholder="Enter project name..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">The "What" & "Why"</label>
                                        <textarea 
                                            value={wizardData.desc}
                                            rows={5}
                                            onChange={e => setWizardData({...wizardData, desc: e.target.value})}
                                            className="w-full bg-black/40 border border-white/10 rounded-3xl px-8 py-6 text-lg text-white focus:border-celestial-emerald outline-none transition-all resize-none placeholder:text-gray-700 leading-relaxed"
                                            placeholder="Describe the social problem you solve and how it creates profit..."
                                        />
                                    </div>
                                    <button 
                                        onClick={handleRunAiGen}
                                        disabled={isAiProcessing || !wizardData.title || !wizardData.desc}
                                        className="w-full py-6 bg-white text-black font-black rounded-3xl shadow-2xl hover:bg-celestial-emerald hover:text-white transition-all disabled:opacity-30 uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3"
                                    >
                                        {isAiProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                                        GENERATE_STRATEGY_BLUEPRINT
                                    </button>
                                </div>
                            )}

                            {wizardStep === 2 && aiProposal && (
                                <div className="space-y-10 animate-slide-up">
                                    <div className="p-8 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-[3rem] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck className="w-16 h-16 text-emerald-400" /></div>
                                        <h4 className="text-[10px] font-black text-celestial-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" /> AI_Generated_Theory_of_Change
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-4">
                                                <div className="text-[9px] font-black text-gray-500 uppercase">Impact_Narrative</div>
                                                <p className="text-gray-200 italic leading-relaxed text-sm">"{aiProposal.logicModel?.impact}"</p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="text-[9px] font-black text-gray-500 uppercase">Linked_SDGs</div>
                                                <div className="flex gap-2">
                                                    {aiProposal.sdgs?.map(s => (
                                                        <div key={s} className="px-4 py-2 bg-black border border-white/10 rounded-xl text-xs font-bold text-white">SDG {s}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="text-[9px] font-black text-gray-500 uppercase">Monetary_Impact_Proxies (SROI)</div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                {aiProposal.impactMetrics?.map((m, i) => (
                                                    <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                                        <div className="text-[10px] font-bold text-white mb-1 truncate">{m.label}</div>
                                                        <div className="text-xs text-emerald-400 font-mono font-bold">${m.proxy_value}/unit</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 pb-10">
                                        <button onClick={() => setWizardStep(1)} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-3xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs">Back</button>
                                        <button 
                                            onClick={handleConfirmProject}
                                            className="flex-1 py-5 bg-white text-black font-black rounded-3xl shadow-2xl hover:bg-celestial-emerald hover:text-white transition-all uppercase tracking-widest text-xs"
                                        >
                                            MANIFEST_PROJECT_ENTITY
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
