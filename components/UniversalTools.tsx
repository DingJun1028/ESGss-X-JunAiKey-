
import React, { useRef, useEffect } from 'react';
import { Language } from '../types';
import { 
    Brain, Search, BookOpen, Link, Zap, RefreshCw, Globe, Box, 
    PenTool, FlaskConical, Gavel, Rocket, Flame, Shield, TrendingDown, Dna,
    Terminal, Cpu, Activity, Command, Hexagon, Fingerprint, Layers
} from 'lucide-react';
import { useUniversalAgent, AvatarFace } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';

interface UniversalToolsProps {
  language: Language;
}

const AVATAR_CONFIG = {
    MIRROR: {
        label: { en: 'Mirror', zh: '鏡之相' },
        color: 'text-pink-400',
        borderColor: 'border-pink-500/50',
        glow: 'shadow-pink-500/50',
        bg: 'bg-pink-500/10'
    },
    EXPERT: {
        label: { en: 'Expert', zh: '相之相' },
        color: 'text-celestial-gold',
        borderColor: 'border-celestial-gold/50',
        glow: 'shadow-amber-500/50',
        bg: 'bg-amber-500/10'
    },
    VOID: {
        label: { en: 'Void', zh: '無之相' },
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/50',
        glow: 'shadow-emerald-500/50',
        bg: 'bg-emerald-500/10'
    }
};

const MATRIX_KEYS = [
    { id: 'awaken', icon: Brain, label: { en: 'Awaken', zh: '喚醒' }, quadrant: 1, desc: 'Deep Context' },
    { id: 'inspect', icon: Search, label: { en: 'Inspect', zh: '透視' }, quadrant: 1, desc: 'Code Analysis' },
    { id: 'scripture', icon: BookOpen, label: { en: 'Scripture', zh: '聖典' }, quadrant: 1, desc: 'Knowledge Base' },
    { id: 'connect', icon: Link, label: { en: 'Connect', zh: '連結' }, quadrant: 1, desc: 'Graph Link' },
    { id: 'summon', icon: Zap, label: { en: 'Summon', zh: '召喚' }, quadrant: 2, desc: 'API Call' },
    { id: 'transmute', icon: RefreshCw, label: { en: 'Transmute', zh: '轉化' }, quadrant: 2, desc: 'Format Convert' },
    { id: 'bridge', icon: Globe, label: { en: 'Bridge', zh: '橋接' }, quadrant: 2, desc: 'Protocol Adapt' },
    { id: 'encase', icon: Box, label: { en: 'Encase', zh: '封裝' }, quadrant: 2, desc: 'Dockerize' },
    { id: 'manifest', icon: PenTool, label: { en: 'Manifest', zh: '顯化' }, quadrant: 3, desc: 'Generate' },
    { id: 'trial', icon: FlaskConical, label: { en: 'Trial', zh: '試煉' }, quadrant: 3, desc: 'Unit Test' },
    { id: 'judge', icon: Gavel, label: { en: 'Judge', zh: '審判' }, quadrant: 3, desc: 'Review' },
    { id: 'ascend', icon: Rocket, label: { en: 'Ascend', zh: '飛昇' }, quadrant: 3, desc: 'Deploy' },
    { id: 'purify', icon: Flame, label: { en: 'Purify', zh: '淨化' }, quadrant: 4, desc: 'Refactor' },
    { id: 'ward', icon: Shield, label: { en: 'Ward', zh: '結界' }, quadrant: 4, desc: 'Security' },
    { id: 'entropy', icon: TrendingDown, label: { en: 'Entropy', zh: '熵減' }, quadrant: 4, desc: 'Optimize' },
    { id: 'evolve', icon: Dna, label: { en: 'Evolve', zh: '進化' }, quadrant: 4, desc: 'Self-Update' },
];

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { 
      activeFace, setActiveFace, logs, isProcessing, 
      activeKeyId, executeMatrixProtocol, subAgentsActive 
  } = useUniversalAgent();
  
  const faceConfig = AVATAR_CONFIG[activeFace];
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getQuadrantStyle = (q: number) => {
      switch(q) {
          case 1: return 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]';
          case 2: return 'border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]';
          case 3: return 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]';
          case 4: return 'border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]';
          default: return '';
      }
  };

  return (
    <div className="space-y-6 pb-24">
        <UniversalPageHeader 
            icon={Command}
            title={{ zh: '萬能工具矩陣', en: 'Universal Tool Matrix' }}
            description={{ zh: '16 宮格 AIOS 核心指令集', en: '16-Grid AIOS Kernel Command Set' }}
            language={isZh ? 'zh-TW' : 'en-US'}
            tag={{ zh: '系統控制', en: 'System Control' }}
        />

        <div className="h-full flex flex-col md:flex-row gap-6 animate-fade-in relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-20" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay -z-10" />
            
            {/* Left Panel: Status & Agent Visualization */}
            <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
                {/* Avatar Core Control */}
                <div className={`p-6 rounded-2xl border ${faceConfig.borderColor} bg-slate-900/80 backdrop-blur-md relative overflow-hidden shadow-lg transition-all duration-500`}>
                    <div className={`absolute top-0 right-0 p-4 opacity-20`}>
                        <Fingerprint className={`w-32 h-32 ${faceConfig.color}`} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            {isZh ? '核心人格' : 'Core Persona'}
                        </h2>
                        <div className="flex gap-2 mb-6">
                            {(['MIRROR', 'EXPERT', 'VOID'] as AvatarFace[]).map(face => (
                                <button
                                    key={face}
                                    onClick={() => setActiveFace(face)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border
                                        ${activeFace === face 
                                            ? `${AVATAR_CONFIG[face].bg} ${AVATAR_CONFIG[face].color} ${AVATAR_CONFIG[face].borderColor}` 
                                            : 'bg-white/5 text-gray-500 border-transparent hover:bg-white/10'}
                                    `}
                                >
                                    {isZh ? AVATAR_CONFIG[face].label.zh : AVATAR_CONFIG[face].label.en}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400">System Status</div>
                            <div className={`text-xs font-bold ${isProcessing ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`}>
                                {isProcessing ? 'PROCESSING' : 'ONLINE'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Agent Visualizer (The "36" View) */}
                <div className="flex-1 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col overflow-hidden relative min-h-[300px]">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-celestial-blue" />
                        {isZh ? '子代理進程 (Sub-Agents)' : 'Sub-Agent Processes'}
                    </h3>
                    
                    <div className="flex-1 relative">
                        {/* Visual representation of the agents working */}
                        <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                            {subAgentsActive.length === 0 && !isProcessing && (
                                <div className="flex-1 flex items-center justify-center text-gray-600 text-xs text-center opacity-50">
                                    <div>
                                        <Activity className="w-8 h-8 mx-auto mb-2" />
                                        Waiting for Matrix Command...
                                    </div>
                                </div>
                            )}
                            {subAgentsActive.map((agent, i) => (
                                <div key={`${agent}-${i}`} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 animate-fade-in">
                                    <div className="w-1.5 h-1.5 rounded-full bg-celestial-gold animate-pulse" />
                                    <span className="text-xs font-mono text-celestial-gold flex-1">{agent}</span>
                                    <span className="text-[10px] text-gray-500">Active</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Panel: The Matrix */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="glass-panel p-8 rounded-3xl border border-white/10 flex-1 relative flex flex-col justify-center items-center bg-slate-900/50 min-h-[500px]">
                    <div className="absolute top-4 left-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {isZh ? '萬能覺醒矩陣 v4.0' : 'Universal Awakening Matrix v4.0'}
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl relative z-10">
                        {MATRIX_KEYS.map((key) => {
                            const isActive = activeKeyId === key.id;
                            return (
                                <button
                                    key={key.id}
                                    onClick={() => executeMatrixProtocol(key.id, isZh ? key.label.zh : key.label.en)}
                                    disabled={isProcessing}
                                    className={`
                                        relative aspect-square flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 group overflow-hidden
                                        ${getQuadrantStyle(key.quadrant)}
                                        ${isActive ? 'scale-95 ring-2 ring-white/50 brightness-125' : ''}
                                        ${isProcessing && !isActive ? 'opacity-30 blur-[1px]' : 'opacity-100'}
                                    `}
                                >
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-br from-white/20 to-transparent`} />
                                    <key.icon className={`w-8 h-8 mb-3 transition-transform duration-500 ${isActive ? 'scale-125 animate-bounce' : 'group-hover:scale-110'}`} />
                                    <span className="text-sm font-bold tracking-wide">{isZh ? key.label.zh : key.label.en}</span>
                                    <span className="text-[9px] opacity-60 mt-1 font-mono">{key.desc}</span>
                                    
                                    {isActive && (
                                        <div className="absolute inset-0 border-2 border-white/50 rounded-2xl animate-ping" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Panel: Terminal Output */}
            <div className="w-full md:w-80 glass-panel p-0 rounded-2xl border border-white/10 flex flex-col overflow-hidden bg-black/80 max-h-[600px]">
                <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-300">SYSTEM.LOG</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/20" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                        <div className="w-2 h-2 rounded-full bg-green-500/20" />
                    </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-2">
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-2 animate-fade-in">
                            <span className="text-gray-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}]</span>
                            <div className={`break-words ${
                                log.type === 'error' ? 'text-red-400' : 
                                log.type === 'success' ? 'text-emerald-400' : 
                                log.type === 'thinking' ? 'text-celestial-purple' : 
                                'text-gray-300'
                            }`}>
                                <span className="opacity-50 mr-1">{log.source}:</span>
                                {log.message}
                            </div>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                    {isProcessing && (
                        <div className="flex gap-2 animate-pulse text-gray-500">
                            <span>_</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
