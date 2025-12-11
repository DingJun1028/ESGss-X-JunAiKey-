
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Language } from '../types';
import { 
    Wrench, Book, Calendar as CalendarIcon, StickyNote, Database, Search, 
    ArrowRight, Check, X, Link as LinkIcon, RefreshCw, ChevronLeft, ChevronRight, 
    Plus, Trash2, Edit2, Save, Share, Copy, Download, Wand2, ClipboardList, Bot, Zap, Clock,
    BrainCircuit, FileUp, Cpu, Layers, Terminal, Activity, Sparkles, Fingerprint, Coins, Lock, Network, Share2,
    Play, CheckCircle, Eye, Dna, Microscope, Scale, BarChart3, ShieldCheck, Target, MessageSquare, AlertTriangle, Compass,
    Server, Wifi, Globe, PenTool, Layout, Box, User, Heart, Code, FileText, Users, Map as MapIcon, Bug as BugIcon, Folder as FolderIcon, Calculator as CalculatorIcon, DollarSign as DollarSignIcon, Crown as CrownIcon
} from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { GLOBAL_GLOSSARY } from '../constants';

interface UniversalToolsProps {
  language: Language;
}

// === THOUSAND FACES AVATAR CORE ===
type AvatarFace = 'MIRROR' | 'EXPERT' | 'VOID';

const AVATAR_CONFIG = {
    MIRROR: {
        label: { en: 'Mirror Aspect', zh: '鏡之相' },
        desc: { en: 'Empathy & Guidance', zh: '極致共感' },
        color: 'text-pink-400',
        bg: 'bg-pink-500/10 border-pink-500/30',
        icon: User
    },
    EXPERT: {
        label: { en: 'Expert Aspect', zh: '相之相' },
        desc: { en: 'Authority & Strategy', zh: '領域權威' },
        color: 'text-celestial-gold',
        bg: 'bg-celestial-gold/10 border-celestial-gold/30',
        icon: CrownIcon
    },
    VOID: {
        label: { en: 'Void Aspect', zh: '無之相' },
        desc: { en: 'Pure Logic & Code', zh: '無形執行' },
        color: 'text-emerald-400',
        bg: 'bg-black/80 border-emerald-500/30 font-mono',
        icon: Terminal
    }
};

// === 36 HEAVENLY AGENTS (MATRIX v4.0) ===
// Grouped by Layer for UI rendering
const AGENT_MATRIX = [
    // --- LAYER 1: CORE (The Brain) ---
    { id: '01', name: { en: 'Data Insight', zh: '數據洞察代理' }, layer: 'CORE', icon: Microscope, desc: 'Trend Identification' },
    { id: '09', name: { en: 'Strategy Rec.', zh: '策略建議代理' }, layer: 'CORE', icon: Compass, desc: 'Strategic Actions' },
    { id: '10', name: { en: 'Evolution Wheel', zh: '無限進化輪' }, layer: 'CORE', icon: Dna, desc: 'Self-Optimization' },
    { id: '26', name: { en: 'Scenario Sim', zh: '情境模擬代理' }, layer: 'CORE', icon: BrainCircuit, desc: 'Future Prediction' },
    { id: '30', name: { en: 'Knowledge Graph', zh: '知識圖譜編織者' }, layer: 'CORE', icon: Network, desc: 'Relationship Discovery' },
    
    // --- LAYER 2: ACTION (The Hands) ---
    { id: '03', name: { en: 'Report Gen', zh: '報告生成代理' }, layer: 'ACTION', icon: FileUp, desc: 'Multi-modal Output' },
    { id: '04', name: { en: 'Goal Tracking', zh: '目標追蹤代理' }, layer: 'ACTION', icon: Target, desc: 'KPI Monitoring' },
    { id: '16', name: { en: 'Code Review', zh: '代碼審查代理' }, layer: 'ACTION', icon: Code, desc: 'Quality Control' },
    { id: '17', name: { en: 'API Connector', zh: 'API 串接代理' }, layer: 'ACTION', icon: LinkIcon, desc: 'Integration Hub' },
    { id: '19', name: { en: 'Deployment Ops', zh: '部署運維代理' }, layer: 'ACTION', icon: Server, desc: 'CI/CD Management' },
    { id: '20', name: { en: 'Tech Debt', zh: '技術債清算代理' }, layer: 'ACTION', icon: Trash2, desc: 'Refactoring' },

    // --- LAYER 3: SENSE (The Input) ---
    { id: '02', name: { en: 'Benchmark', zh: '同業基準代理' }, layer: 'SENSE', icon: Scale, desc: 'Competitor Analysis' },
    { id: '12', name: { en: 'Messenger', zh: '信使聯絡代理' }, layer: 'SENSE', icon: MessageSquare, desc: 'Communication Hub' },
    { id: '31', name: { en: 'IoT Sensory', zh: '萬物感知代理' }, layer: 'SENSE', icon: Wifi, desc: 'Physical Data Input' },
    
    // --- LAYER 4: SHIELD (The Defense) ---
    { id: '07', name: { en: 'Compliance', zh: '合規支援代理' }, layer: 'SHIELD', icon: ShieldCheck, desc: 'Regulatory Check' },
    { id: '08', name: { en: 'Risk Assess', zh: '風險評估代理' }, layer: 'SHIELD', icon: AlertTriangle, desc: 'Risk Identification' },
    { id: '18', name: { en: 'Vuln Hunter', zh: '漏洞獵人代理' }, layer: 'SHIELD', icon: BugIcon, desc: 'Security Testing' },
    { id: '32', name: { en: 'Legal Contract', zh: '法務締約代理' }, layer: 'SHIELD', icon: FileText, desc: 'Smart Contracts' },
    { id: '33', name: { en: 'Crisis Cmd', zh: '危機指揮代理' }, layer: 'SHIELD', icon: Zap, desc: 'Disaster Recovery' },
    { id: '34', name: { en: 'Privacy Shield', zh: '隱私屏障代理' }, layer: 'SHIELD', icon: Lock, desc: 'PII Protection' },

    // --- LAYER 5: SPIRIT (The Value) ---
    { id: '35', name: { en: 'Value Exch', zh: '價值交換代理' }, layer: 'SPIRIT', icon: Coins, desc: 'Web3 & Carbon Credit' },
    { id: '36', name: { en: 'Navigator', zh: '導航領航代理' }, layer: 'SPIRIT', icon: MapIcon, desc: 'User Onboarding' },
    { id: '25', name: { en: 'Social Impact', zh: '社會影響力代理' }, layer: 'SPIRIT', icon: Heart, desc: 'SROI Calculation' },
    { id: '28', name: { en: 'Exp Guardian', zh: '體驗守護代理' }, layer: 'SPIRIT', icon:  Layout, desc: 'UX Optimization' },
    { id: '29', name: { en: 'Brand Keep', zh: '品牌一致性代理' }, layer: 'SPIRIT', icon: CheckCircle, desc: 'Tone & Manner' },

    // --- LAYER 6: INTELLIGENCE & ADMIN (The Support) ---
    { id: '05', name: { en: 'Omni-Oracle', zh: '智能問答代理' }, layer: 'ADMIN', icon: Bot, desc: 'Expert QA' },
    { id: '06', name: { en: 'Holo-Viz', zh: '視覺化代理' }, layer: 'ADMIN', icon: BarChart3, desc: 'Data Viz' },
    { id: '11', name: { en: 'Meeting Forge', zh: '會議鑄造代理' }, layer: 'ADMIN', icon: Users, desc: 'Agenda & Minutes' },
    { id: '13', name: { en: 'Resource Disp', zh: '資源調度代理' }, layer: 'ADMIN', icon: Layers, desc: 'Budget & Compute' },
    { id: '14', name: { en: 'Doc Archive', zh: '文檔歸檔代理' }, layer: 'ADMIN', icon: FolderIcon, desc: 'Knowledge Index' },
    { id: '15', name: { en: 'Schedule Guard', zh: '日程守護代理' }, layer: 'ADMIN', icon: CalendarIcon, desc: 'Time Management' },
    { id: '21', name: { en: 'Carbon Calc', zh: '碳足跡計算代理' }, layer: 'ADMIN', icon: CalculatorIcon, desc: 'Emission Metrics' },
    { id: '22', name: { en: 'Green Fin', zh: '綠色金融代理' }, layer: 'ADMIN', icon: DollarSignIcon, desc: 'ROI Analysis' },
    { id: '23', name: { en: 'Stakeholder', zh: '利害關係人代理' }, layer: 'ADMIN', icon: User, desc: 'Sentiment Analysis' },
    { id: '24', name: { en: 'Supply Audit', zh: '供應鏈稽核代理' }, layer: 'ADMIN', icon: Search, desc: 'Vendor Check' },
    { id: '27', name: { en: 'Localization', zh: '內容在地化代理' }, layer: 'ADMIN', icon: Globe, desc: 'Cultural Adapt' },
];

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { universalNotes, addNote, deleteNote, isAiToolsUnlocked, unlockAiTools, goodwillBalance, updateGoodwillBalance, awardXp } = useCompany(); 
  
  const [activeFace, setActiveFace] = useState<AvatarFace>('MIRROR');
  const [activeAgentId, setActiveAgentId] = useState<string>('01');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
      `[SYSTEM] JunAiKey Matrix v4.0 Initialized.`,
      `[SYSTEM] 36 Agents Loaded. Status: ONLINE.`,
      `[SYSTEM] Thousand Faces Core: ATTACHED.`
  ]);

  const activeAgent = AGENT_MATRIX.find(a => a.id === activeAgentId) || AGENT_MATRIX[0];
  const faceConfig = AVATAR_CONFIG[activeFace];

  const handleFaceSwitch = (face: AvatarFace) => {
      setActiveFace(face);
      let logMsg = '';
      if (face === 'MIRROR') logMsg = isZh ? '切換至：鏡之相 (共感模式)' : 'Switched to: Mirror Aspect';
      if (face === 'EXPERT') logMsg = isZh ? '切換至：相之相 (專家模式)' : 'Switched to: Expert Aspect';
      if (face === 'VOID') logMsg = isZh ? '切換至：無之相 (執行模式)' : 'Switched to: Void Aspect';
      
      addToast('info', logMsg, 'Thousand Faces Core');
      setTerminalLogs(prev => [...prev, `[AVATAR] Mode shift: ${face}`, `[CORE] Re-calibrating interaction weights...`]);
  };

  const handleAgentClick = (agentId: string) => {
      setActiveAgentId(agentId);
      const agent = AGENT_MATRIX.find(a => a.id === agentId);
      setTerminalLogs(prev => [...prev, `[MATRIX] Activated Node #${agentId}: ${agent?.name.en}`]);
  };

  const renderVoidView = () => (
      <div className="bg-black font-mono text-xs p-4 h-full overflow-y-auto text-emerald-400 custom-scrollbar rounded-xl border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          <div className="mb-4 text-emerald-600 opacity-50 border-b border-emerald-900 pb-2">
              // VOID ASPECT TERMINAL // DIRECT_LINK: ESTABLISHED
          </div>
          {terminalLogs.map((log, i) => (
              <div key={i} className="mb-1">
                  <span className="text-gray-600">{new Date().toLocaleTimeString()}</span> {log}
              </div>
          ))}
          <div className="mt-2 animate-pulse">_</div>
      </div>
  );

  const renderMirrorView = () => (
      <div className="flex flex-col h-full bg-slate-900/50 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-pink-500/20 flex items-center justify-center border-2 border-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-float">
                  {React.createElement(activeAgent.icon, { className: "w-10 h-10 text-pink-300" })}
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                      {isZh ? `嗨！我是${activeAgent.name.zh}` : `Hi! I'm ${activeAgent.name.en}`}
                  </h3>
                  <p className="text-pink-200 text-sm max-w-md mx-auto leading-relaxed">
                      {isZh 
                        ? `我準備好協助您進行「${activeAgent.desc}」。我們從哪裡開始呢？` 
                        : `I'm ready to assist you with ${activeAgent.desc}. Where should we start?`}
                  </p>
              </div>
              <button className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-lg transition-all flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {isZh ? '開始對話' : 'Start Chat'}
              </button>
          </div>
      </div>
  );

  const renderExpertView = () => (
      <div className="flex flex-col h-full bg-slate-900/80 rounded-xl p-6 border border-celestial-gold/20 relative">
          <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-celestial-gold/10 rounded-lg border border-celestial-gold/30">
                      {React.createElement(activeAgent.icon, { className: "w-8 h-8 text-celestial-gold" })}
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-white">{isZh ? activeAgent.name.zh : activeAgent.name.en}</h3>
                      <div className="flex items-center gap-2 text-xs text-celestial-gold font-mono mt-1">
                          <Activity className="w-3 h-3 animate-pulse" />
                          STATUS: ACTIVE | ID: #{activeAgent.id}
                      </div>
                  </div>
              </div>
              <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Layer</div>
                  <div className="text-sm font-bold text-white">{activeAgent.layer}</div>
              </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <div className="text-xs text-gray-400 mb-1">Efficiency</div>
                  <div className="text-xl font-mono text-emerald-400">98.4%</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <div className="text-xs text-gray-400 mb-1">Tasks Pending</div>
                  <div className="text-xl font-mono text-celestial-gold">0</div>
              </div>
          </div>

          <div className="flex-1 bg-black/30 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-y-auto">
              <div className="mb-2 text-celestial-gold">> Initializing Expert Protocol...</div>
              <div className="mb-2">> Linking to Universal Memory... OK.</div>
              <div className="mb-2">> Ready for complex instructions.</div>
          </div>
          
          <div className="mt-4 flex gap-3">
              <button className="flex-1 py-2 bg-celestial-gold text-black font-bold rounded hover:bg-amber-400 transition-colors">
                  {isZh ? '執行任務' : 'Execute Task'}
              </button>
              <button className="flex-1 py-2 bg-white/10 text-white font-bold rounded hover:bg-white/20 transition-colors">
                  {isZh ? '查看報告' : 'View Report'}
              </button>
          </div>
      </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-24 h-full flex flex-col">
        {/* Header Area with Thousand Faces Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20 text-white">
                    <BrainCircuit className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {isZh ? 'JunAiKey 萬能代理矩陣 v4.0' : 'JunAiKey Agent Matrix v4.0'}
                    </h2>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] border border-emerald-500/30">36 AGENTS ONLINE</span>
                        {isZh ? '全域覆蓋，萬能互聯' : 'Full Spectrum Coverage'}
                    </p>
                </div>
            </div>

            {/* Avatar Core Toggle */}
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                {(['MIRROR', 'EXPERT', 'VOID'] as AvatarFace[]).map(face => {
                    const cfg = AVATAR_CONFIG[face];
                    const isActive = activeFace === face;
                    return (
                        <button
                            key={face}
                            onClick={() => handleFaceSwitch(face)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                                ${isActive ? `${cfg.bg} ${cfg.color} shadow-lg` : 'text-gray-500 hover:text-gray-300'}
                            `}
                        >
                            <cfg.icon className="w-4 h-4" />
                            <span className="hidden md:inline">{isZh ? cfg.label.zh : cfg.label.en}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* Left: The Matrix Grid (36 Agents) */}
            <div className="lg:w-2/3 glass-panel p-6 rounded-2xl border border-white/10 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {AGENT_MATRIX.map((agent) => {
                        const isActive = activeAgentId === agent.id;
                        return (
                            <button
                                key={agent.id}
                                onClick={() => handleAgentClick(agent.id)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 group relative overflow-hidden
                                    ${isActive 
                                        ? `bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-105 z-10` 
                                        : 'bg-slate-900/40 border-white/5 hover:bg-white/5 hover:border-white/20'}
                                `}
                            >
                                <div className={`text-[9px] font-mono mb-2 uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                    #{agent.id}
                                </div>
                                <div className={`p-2 rounded-full mb-2 transition-colors ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-gray-400 group-hover:text-white'}`}>
                                    {React.createElement(agent.icon, { className: "w-5 h-5" })}
                                </div>
                                <div className="text-center">
                                    <div className={`text-[10px] font-bold leading-tight ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                        {isZh ? agent.name.zh : agent.name.en}
                                    </div>
                                    <div className="text-[8px] text-gray-600 mt-1 scale-90">{agent.layer}</div>
                                </div>
                                
                                {/* Universal Memory Link Indicator */}
                                {isActive && (
                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]" title="Memory Linked" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right: Active Avatar View */}
            <div className="lg:w-1/3 flex flex-col h-full min-h-[400px]">
                <div className={`flex-1 rounded-2xl transition-all duration-500 ${activeFace === 'VOID' ? 'p-0' : 'p-1'}`}>
                    {activeFace === 'MIRROR' && renderMirrorView()}
                    {activeFace === 'EXPERT' && renderExpertView()}
                    {activeFace === 'VOID' && renderVoidView()}
                </div>
                
                {/* Active Agent Footer Info */}
                <div className="mt-4 glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <BrainCircuit className="w-4 h-4 text-emerald-400" />
                        {isZh ? '萬能永憶：已連結' : 'Universal Memory: Linked'}
                    </div>
                    <div className="text-[10px] font-mono text-gray-600">
                        LATENCY: 12ms
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
