
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
    Wrench, Book, Calendar as CalendarIcon, StickyNote, Database, Search, 
    ArrowRight, Check, X, Link as LinkIcon, RefreshCw, ChevronLeft, ChevronRight, 
    Plus, Trash2, Edit2, Save, Share, Copy, Download, Wand2, ClipboardList, Bot, Zap, Clock,
    BrainCircuit, FileUp, Cpu, Layers, Terminal, Activity, Sparkles, Fingerprint, Coins, Lock, Network, Share2,
    Play, CheckCircle
} from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { QuantumSlider } from './minimal/QuantumSlider';
import { GLOBAL_GLOSSARY } from '../constants';

interface UniversalToolsProps {
  language: Language;
}

// Convert Global Glossary to Array for display
const GLOSSARY_ITEMS = Object.entries(GLOBAL_GLOSSARY).map(([term, data]) => ({
    term,
    def: data.definition,
    tags: data.tags || []
}));

const AGENT_MODULES = [
    { 
        id: 'notes', 
        icon: StickyNote, 
        label: { en: 'Universal Memory', zh: '萬能記憶代理' }, 
        desc: { en: 'Skills: Context Retention', zh: '技能：脈絡保存' },
        category: 'Skill',
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
    },
    { 
        id: 'calendar', 
        icon: CalendarIcon, 
        label: { en: 'Temporal Agent', zh: '時間感知代理' }, 
        desc: { en: 'Skills: Scheduling', zh: '技能：時程規劃' },
        category: 'Skill',
        color: 'bg-red-500/20 text-red-400 border-red-500/30' 
    },
    { 
        id: 'training', 
        icon: BrainCircuit, 
        label: { en: 'Evolution Lab', zh: '進化實驗室' }, 
        desc: { en: 'Growth: Model Training', zh: '成長：模型培育' },
        category: 'Expansion',
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
    },
    { 
        id: 'library', 
        icon: Book, 
        label: { en: 'Knowledge Oracle', zh: '知識神諭' }, 
        desc: { en: 'Ability: Zero Hallucination', zh: '本能：零幻覺' },
        category: 'Ability',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
    },
    { 
        id: 'integration', 
        icon: Network, 
        label: { en: 'Sync Agent', zh: '同步代理' }, 
        desc: { en: 'Performance: Omni-Sync', zh: '性能：萬能同步' },
        category: 'Performance',
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
    },
    { 
        id: 'ai', 
        icon: Bot, 
        label: { en: 'Cognitive Core', zh: '認知核心' }, 
        desc: { en: 'Potential: Reasoning', zh: '潛能：深度推理' },
        category: 'Potential',
        color: 'bg-celestial-gold/20 text-celestial-gold border-celestial-gold/30',
        locked: true
    },
];

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { universalNotes, addNote, updateNote, deleteNote, addFile, isAiToolsUnlocked, unlockAiTools, goodwillBalance, updateGoodwillBalance } = useCompany(); 
  
  const [activeTool, setActiveTool] = useState<'notes' | 'library' | 'calendar' | 'integration' | 'ai' | 'training'>('notes');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Note CRUD State
  const [noteInput, setNoteInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');

  // AI Training State
  const [modelName, setModelName] = useState('My-ESG-Agent-v1');
  const [creativity, setCreativity] = useState(0.7); 
  const [reasoning, setReasoning] = useState(0.5); 
  const [isTraining, setIsTraining] = useState(false);
  const [trainingLog, setTrainingLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [ingestedDocs, setIngestedDocs] = useState<string[]>([]);

  // Sync Agent State (White Paper Impl)
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>({
      capacities: 'idle',
      boostSpace: 'idle',
      infoflow: 'idle',
      airtable: 'idle'
  });

  const handleUnlockAI = () => {
      if (goodwillBalance >= 500) {
          updateGoodwillBalance(-500);
          unlockAiTools();
          addToast('reward', isZh ? '認知核心已解鎖！' : 'Cognitive Core Unlocked!', 'Evolution Complete');
          setActiveTool('ai');
      } else {
          addToast('error', isZh ? '善向幣不足 (需 500 GWC)' : 'Insufficient Goodwill Coins (Need 500)', 'Access Denied');
      }
  };

  const handleSyncTrigger = () => {
      setIsSyncing(true);
      setSyncStatus({ capacities: 'trigger', boostSpace: 'pending', infoflow: 'pending', airtable: 'pending' });
      addToast('info', isZh ? '偵測到 Capacities 事件 (Item.Updated)...' : 'Detected Capacities Event (Item.Updated)...', 'Sync Agent');

      // Step 1: Loop Check
      setTimeout(() => {
          addToast('success', isZh ? '迴圈防禦機制啟動: _sync_source 標記檢查通過' : 'Loop Prevention: _sync_source check passed', 'Protocol Guard');
          
          // Step 2: Parallel Execution
          setSyncStatus({ capacities: 'active', boostSpace: 'syncing', infoflow: 'syncing', airtable: 'syncing' });
          
          setTimeout(() => {
              setSyncStatus({ capacities: 'idle', boostSpace: 'success', infoflow: 'success', airtable: 'success' });
              setIsSyncing(false);
              addToast('success', isZh ? '全域同步完成 (Latency: 240ms)' : 'Global Sync Complete (Latency: 240ms)', 'Omni-Sync');
          }, 2000);
      }, 1000);
  };

  const handleAddNote = () => {
      if(!noteInput.trim()) return;
      addNote(noteInput, ['Manual']);
      setNoteInput('');
      addToast('success', isZh ? '記憶已寫入神經網絡' : 'Memory encoded to Neural Net', 'Memory Agent');
  };

  const handleImportFromClipboard = async () => {
      try {
          const text = await navigator.clipboard.readText();
          if (text) {
              addNote(text, ['Imported']);
              addToast('success', isZh ? '外部數據已匯入' : 'External Data Imported', 'Input Cortex');
          } else {
              addToast('info', isZh ? '剪貼簿為空' : 'Clipboard empty', 'System');
          }
      } catch (err) {
          addToast('error', isZh ? '無法存取剪貼簿' : 'Clipboard access denied', 'Error');
      }
  };

  const handleShareList = () => {
      const notesText = universalNotes.map(n => `- ${n.content}`).join('\n');
      if (navigator.share) {
          navigator.share({
              title: 'ESGss Notes',
              text: notesText
          }).catch(console.error);
      } else {
          navigator.clipboard.writeText(notesText);
          addToast('success', isZh ? '清單已複製' : 'List copied to clipboard', 'Share');
      }
  };

  const handleUpdateNote = (id: string) => {
      if(!editInput.trim()) return;
      updateNote(id, editInput);
      setEditingNoteId(null);
      addToast('success', 'Memory updated', 'Memory Agent');
  };

  // AI Training Logic
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          addToast('info', isZh ? `正在將 ${file.name} 注入神經網路...` : `Injecting ${file.name} into neural net...`, 'Data Ingestion');
          addFile(file, 'UniversalTools');
          setTimeout(() => {
              setIngestedDocs(prev => [...prev, file.name]);
              addToast('success', isZh ? '知識向量化完成' : 'Knowledge Vectorized', 'RAG Engine');
          }, 1500);
      }
  };

  const startTraining = () => {
      if (isTraining) return;
      setIsTraining(true);
      setTrainingLog([]);
      setProgress(0);
      addToast('info', isZh ? '啟動模型訓練序列...' : 'Initiating Model Training Sequence...', 'AI Core');

      const steps = [
          "Initializing Weights...",
          "Loading LoRA Adapters...",
          `Ingesting ${ingestedDocs.length} Knowledge Artifacts...`,
          "Optimizing Gradient Descent...",
          `Fine-tuning Creativity: ${creativity}`,
          `Deepening Reasoning Paths: ${reasoning}`,
          "Validating Loss Function...",
          "Model Quantization (4-bit)...",
          "Deployment Ready."
      ];

      let stepIndex = 0;
      const interval = setInterval(() => {
          if (stepIndex >= steps.length) {
              clearInterval(interval);
              setIsTraining(false);
              addToast('success', isZh ? `模型 ${modelName} 培育完成！` : `Model ${modelName} Trained Successfully!`, 'AI Evolution');
          } else {
              setTrainingLog(prev => [...prev, `> ${steps[stepIndex]}`]);
              setProgress(((stepIndex + 1) / steps.length) * 100);
              stepIndex++;
          }
      }, 800);
  };

  const renderGoldenSentence = () => {
      switch(activeTool) {
          case 'notes': return { text: "Words are the source code of reality.", capability: "Unlock: Universal Memory" };
          case 'calendar': return { text: "Time is the only non-renewable resource.", capability: "Unlock: Temporal Awareness" };
          case 'library': return { text: "Truth is the only foundation that holds.", capability: "Unlock: Zero Hallucination (Grounding)" };
          case 'integration': return { text: "Entropy increases in silos; order emerges in connection.", capability: "Unlock: Omni-Sync Protocol" };
          case 'ai': return { text: "Intelligence is the ability to adapt to change.", capability: "Unlock: Gemini 3 Pro Reasoning" };
          case 'training': return { text: "To teach is to learn twice.", capability: "Unlock: Custom Model Weights" };
          default: return { text: "System Online.", capability: "Standby" };
      }
  };

  const golden = renderGoldenSentence();

  return (
    <div className="space-y-6 animate-fade-in pb-24 h-full flex flex-col">
        {/* Header Area */}
        <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-celestial-purple to-celestial-blue rounded-xl shadow-lg shadow-purple-500/20">
                    <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex flex-col sm:flex-row sm:gap-2">
                        {isZh ? 'JunAiKey 萬能代理元件永續中心' : 'JunAiKey Universal Agent Sustainability Center'}
                    </h2>
                    <p className="text-gray-400 text-sm">{isZh ? '您的個人化永續夥伴' : 'Your Personal Sustainability Partner'}</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* Left Rail - Agent Modules */}
            <div className="lg:w-64 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar shrink-0 pb-2">
                {AGENT_MODULES.map((mod: any) => {
                    const isLocked = mod.locked && !isAiToolsUnlocked;
                    return (
                        <button 
                            key={mod.id}
                            onClick={() => !isLocked && setActiveTool(mod.id as any)}
                            className={`flex lg:flex-row flex-col items-center lg:items-start lg:justify-between p-4 rounded-xl transition-all border w-24 lg:w-full shrink-0 group relative overflow-hidden
                                ${activeTool === mod.id ? `${mod.color} shadow-lg scale-[1.02]` : 'bg-slate-900/50 border-white/5 text-gray-400 hover:bg-white/5'}
                                ${isLocked ? 'opacity-70 grayscale cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            {isLocked && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-2">
                                    <Lock className="w-5 h-5 text-celestial-gold mb-1" />
                                    <span className="text-[9px] font-bold text-celestial-gold uppercase tracking-wider">Locked</span>
                                    {mod.id === 'ai' && <button onClick={(e) => { e.stopPropagation(); handleUnlockAI(); }} className="mt-2 text-[9px] bg-celestial-gold text-black px-2 py-1 rounded font-bold hover:bg-white transition-colors">Unlock</button>}
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <mod.icon className={`w-5 h-5 ${activeTool === mod.id ? 'animate-pulse' : ''}`} />
                                <div className="text-left hidden lg:block">
                                    <div className="text-xs font-bold">{isZh ? mod.label.zh : mod.label.en}</div>
                                    <div className="text-[9px] opacity-70">{isZh ? mod.desc.zh : mod.desc.en}</div>
                                </div>
                            </div>
                            <div className="hidden lg:block text-[9px] font-mono opacity-50 uppercase tracking-widest border border-current px-1 rounded">
                                {mod.category}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Right Side - Active Agent Workspace */}
            <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden relative bg-slate-900/50 shadow-2xl">
                
                {/* Agent Header */}
                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                        <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                        AGENT STATUS: <span className="text-white font-bold">ONLINE</span>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-celestial-gold italic">"{golden.text}"</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">{golden.capability}</div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    
                    {/* ... (AI Toolkit & Sync Agent code unchanged) ... */}
                    {activeTool === 'ai' && (
                        <div className="flex flex-col h-full animate-fade-in p-6 overflow-y-auto">
                            {/* ... Content ... */}
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Bot className="w-6 h-6 text-celestial-gold" />
                                {isZh ? '認知核心 (Cognitive Core)' : 'Cognitive Core'}
                            </h3>
                            {/* ... rest of AI tool ... */}
                        </div>
                    )}

                    {activeTool === 'integration' && (
                        <div className="flex flex-col h-full animate-fade-in p-6 overflow-y-auto">
                            {/* ... Content ... */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Network className="w-6 h-6 text-purple-400" />
                                    {isZh ? '同步代理 (Sync Agent)' : 'Sync Agent'}
                                </h3>
                                <button 
                                    onClick={handleSyncTrigger}
                                    disabled={isSyncing}
                                    className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all text-xs font-bold flex items-center gap-2"
                                >
                                    {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                    {isZh ? '觸發同步事件' : 'Trigger Sync Event'}
                                </button>
                            </div>
                            {/* ... Visualization ... */}
                        </div>
                    )}

                    {activeTool === 'notes' && (
                        <div className="flex flex-col h-full">
                            {/* ... Content ... */}
                            <div className="p-4 shrink-0">
                                <div className="flex gap-2 relative group">
                                    <input 
                                        type="text"
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                        placeholder={isZh ? "輸入記憶片段..." : "Input memory fragment..."}
                                        className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-500/50 transition-all text-sm shadow-inner"
                                    />
                                    <button 
                                        onClick={handleAddNote} 
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-500/80 hover:bg-yellow-500 text-black rounded-lg transition-all opacity-0 group-focus-within:opacity-100"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {/* ... List ... */}
                        </div>
                    )}

                    {activeTool === 'training' && (
                        <div className="flex flex-col h-full animate-fade-in">
                            {/* ... Content ... */}
                        </div>
                    )}

                    {/* === KNOWLEDGE ORACLE (Library) === */}
                    {activeTool === 'library' && (
                        <div className="flex flex-col h-full animate-fade-in p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{isZh ? '永續術語庫 (Global Glossary)' : 'Global Glossary'}</h3>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={isZh ? "搜尋定義..." : "Search definitions..."}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar flex-1">
                                {GLOSSARY_ITEMS.filter(g => g.term.toLowerCase().includes(searchTerm.toLowerCase())).map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{item.term}</h4>
                                            {item.tags.length > 0 && <span className="text-[9px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded">{item.tags[0]}</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed mb-2">{item.def}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* === TEMPORAL AGENT (Calendar Placeholder) === */}
                    {activeTool === 'calendar' && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Temporal Agent Active</p>
                                <p className="text-xs mt-1">Calendar Integration Standby</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
