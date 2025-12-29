
import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { 
    BrainCircuit, Upload, FileText, Trash2, CheckCircle, 
    Loader2, MessageSquare, Database, 
    Sparkles, RefreshCw, Layers, ShieldCheck, History, Search,
    Zap, ArrowRight, Brain, Download, Share2, Library, Swords, FileUp, Users, TrendingUp, CheckCircle2
} from 'lucide-react';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { EsgCardAlbum } from './EsgCardAlbum';
import { useToast } from '../contexts/ToastContext';
import { BUILTIN_KNOWLEDGE_REPOS } from '../constants';

interface AgentTrainingProps {
  language: Language;
}

export const AgentTraining: React.FC<AgentTrainingProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { 
    activePersona, availablePersonas, switchPersona, 
    trainingLogs, addTrainingSession, exportNeuralState, importNeuralState,
    isProcessing, expMultiplier, updatePersonaKnowledge
  } = useUniversalAgent();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'selection' | 'album'>('selection');
  const [isTraining, setIsTraining] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const startTraining = () => {
      setIsTraining(true);
      // 模擬深度計算過程
      setTimeout(() => {
          setIsTraining(false);
          const gainedExp = 200;
          addTrainingSession({
              agentId: activePersona.id,
              timestamp: Date.now(),
              sessionType: isZh ? '深度邏輯微調' : 'Deep Logic Tuning',
              gainedExp: gainedExp,
              statChanges: { INT: 2, STRAT: 1 },
              newKnowledge: [isZh ? 'ESG 雙重重大性原則深度解析' : 'Deep dive into ESG Double Materiality']
          });
      }, 3000);
  };

  const handleExport = () => {
      const data = exportNeuralState(activePersona.id);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activePersona.name}_v15_state.neural`;
      a.click();
      addToast('success', isZh ? '代理人能力已封裝匯出' : 'Agent state exported.', 'Neural Sync');
  };

  const handleImportClick = () => importInputRef.current?.click();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
          const content = event.target?.result as string;
          importNeuralState(activePersona.id, content);
      };
      reader.readAsText(file);
      // 清除 input 以便下次觸發
      e.target.value = '';
  };

  const toggleRepo = (repoId: string) => {
    const currentRepos = activePersona.knowledgeRepoIds || [];
    const newRepos = currentRepos.includes(repoId)
        ? currentRepos.filter(id => id !== repoId)
        : [...currentRepos, repoId];
    updatePersonaKnowledge(activePersona.id, newRepos);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 max-w-7xl mx-auto">
        <UniversalPageHeader 
            icon={BrainCircuit}
            title={{ zh: '代理人修煉與卡冊', en: 'Agent Training & Album' }}
            description={{ zh: '選擇數位分身進行修煉，或在萬能卡冊中合成、分解與交易技能卡片。', en: 'Train your AI twin or synthesize, decompose and trade skill cards.' }}
            language={language}
            tag={{ zh: '神經演進', en: 'NEURAL_EVO' }}
        />

        {/* Tab Navigation */}
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl mb-6">
            <button onClick={() => setActiveTab('selection')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'selection' ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                <Users className="w-4 h-4" /> {isZh ? '人格修煉' : 'Persona Training'}
            </button>
            <button onClick={() => setActiveTab('album')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'album' ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                <Library className="w-4 h-4" /> {isZh ? '萬能卡冊' : 'Omni Card Album'}
            </button>
        </div>

        {activeTab === 'selection' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Agent Selector Side */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/40">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">{isZh ? '選擇修煉目標' : 'Select Target'}</h4>
                        <div className="space-y-3">
                            {availablePersonas.map(p => (
                                <button 
                                    key={p.id}
                                    onClick={() => switchPersona(p.id)}
                                    className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all
                                        ${activePersona.id === p.id ? `bg-white/10 border-white/30 shadow-xl` : 'bg-white/5 border-white/5 hover:bg-white/10'}
                                    `}
                                >
                                    <div className={`p-2 rounded-lg bg-black/40 border border-white/10`}>
                                        <Brain className={`w-5 h-5 ${activePersona.id === p.id ? 'text-celestial-gold' : 'text-gray-500'}`} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="text-xs font-bold text-white">{p.name}</div>
                                        <div className="text-[10px] text-gray-500">Lv.{p.level} {p.archetype}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Knowledge Customization Section */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/40">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">{isZh ? '自定義知識庫' : 'Knowledge Base'}</h4>
                        <div className="space-y-2">
                            {BUILTIN_KNOWLEDGE_REPOS.map(repo => {
                                const isSelected = (activePersona.knowledgeRepoIds || []).includes(repo.id);
                                return (
                                    <button
                                        key={repo.id}
                                        onClick={() => toggleRepo(repo.id)}
                                        className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${isSelected ? 'bg-celestial-gold/10 border-celestial-gold/50 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                                    >
                                        <Database className="w-3.5 h-3.5 shrink-0" />
                                        <div className="text-left flex-1 min-w-0">
                                            <div className="text-[10px] font-bold truncate">{repo.name}</div>
                                        </div>
                                        {isSelected && <CheckCircle2 className="w-3 h-3 text-celestial-gold" />}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="mt-4 text-[9px] text-gray-600 leading-relaxed italic">
                            {isZh ? '* 此設定將影響 AI 助手的回答來源與精準度。' : '* Affects AI assistant grounding and source accuracy.'}
                        </p>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/40">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">{isZh ? '能力導入與導出' : 'Import / Export'}</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleExport} className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 flex flex-col items-center gap-2 group">
                                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> {isZh ? '能力導出' : 'Export'}
                            </button>
                            <button onClick={handleImportClick} className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 flex flex-col items-center gap-2 group">
                                <FileUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> {isZh ? '能力導入' : 'Import'}
                            </button>
                            <input type="file" ref={importInputRef} className="hidden" accept=".json,.neural" onChange={handleImportFile} />
                        </div>
                    </div>
                </div>

                {/* Training Console */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-8 rounded-[3rem] border border-white/10 bg-slate-950/80 flex flex-col relative overflow-hidden h-full min-h-[600px]">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <Brain className="w-64 h-64" />
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-6">
                            <div>
                                <h3 className="text-3xl font-black text-white mb-2">{activePersona.name} <span className="text-celestial-gold opacity-50">/ 修煉矩陣</span></h3>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs text-gray-400 font-mono">ID: {activePersona.id}</div>
                                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black border border-emerald-500/30 flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        XP BOOST: {expMultiplier.toFixed(1)}x
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={startTraining}
                                disabled={isTraining}
                                className="px-8 py-4 bg-gradient-to-r from-celestial-gold to-amber-600 text-black font-black rounded-2xl shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-3"
                            >
                                {isTraining ? <Loader2 className="w-5 h-5 animate-spin" /> : <Swords className="w-5 h-5" />}
                                {isZh ? '啟動深度修煉' : 'Initiate Training'}
                            </button>
                        </div>

                        {/* Stats Visualization */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
                            {Object.entries(activePersona.attributes).map(([key, attr]: [string, any]) => (
                                <div key={key} className="p-5 bg-white/5 rounded-2xl border border-white/5 text-center group hover:border-white/20 transition-all">
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-1 group-hover:text-gray-300">{attr.label}</div>
                                    <div className="text-3xl font-mono font-bold text-white mb-2">{attr.value}</div>
                                    <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                                        <div className="h-full bg-celestial-emerald" style={{ width: `${(attr.value/attr.max)*100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 space-y-4 relative z-10 flex flex-col min-h-0">
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <History className="w-4 h-4" /> {isZh ? '修煉與知識庫日誌' : 'Neural Knowledge Logs'}
                            </h4>
                            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                                {trainingLogs.filter(l => l.agentId === activePersona.id).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-30">
                                        <Database className="w-12 h-12 mb-4" />
                                        <p className="text-sm font-bold uppercase tracking-tighter">Waiting for initial training pulse...</p>
                                    </div>
                                ) : trainingLogs.filter(l => l.agentId === activePersona.id).map(log => (
                                    <div key={log.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/5 animate-fade-in">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${log.isCriticalInsight ? 'bg-celestial-gold/20' : 'bg-white/5'}`}>
                                                {log.isCriticalInsight ? <Sparkles className="w-4 h-4 text-celestial-gold" /> : <Zap className="w-4 h-4 text-emerald-500" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                                    {log.sessionType}
                                                    {log.isCriticalInsight && <span className="text-[8px] px-1.5 py-0.5 bg-celestial-gold text-black rounded font-black">CRITICAL_INSIGHT</span>}
                                                </div>
                                                <div className="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-emerald-400 text-xs font-bold">+{log.gainedExp} EXP</div>
                                            <div className="text-[9px] text-gray-600 font-mono">WITNESS_HASH: {log.id.substring(0,8)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'album' && <EsgCardAlbum language={language} />}
    </div>
  );
};
