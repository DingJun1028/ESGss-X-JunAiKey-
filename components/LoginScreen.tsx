
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ToggleLeft, ToggleRight, ArrowRight, BrainCircuit, Activity, Eye, Cpu, Database, PenTool, Network, Server, Zap, CheckCircle2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { LogoIcon } from './Layout';

interface LoginScreenProps {
  onLogin: () => void;
  language: 'zh-TW' | 'en-US';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language }) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const isZh = language === 'zh-TW';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating Supabase Auth Delay
    setTimeout(() => {
      setLoading(false);
      const welcomeTitle = isZh ? '登入成功' : 'Login Successful';
      const welcomeMsg = isZh ? '歡迎來到 ESGss 善向永續系統。' : 'Welcome to ESGss Sustainability System.';
      addToast('success', welcomeMsg, welcomeTitle);
      onLogin();
    }, 1500);
  };

  const toggleDevMode = () => {
      const newState = !isDevMode;
      setIsDevMode(newState);
      if (newState) {
          addToast('warning', isZh ? '開發者模式已啟用：略過驗證' : 'Dev Mode Enabled: Auth Bypassed', 'System');
      }
  };

  // README Data Visualization Config (Bilingual)
  const cores = [
      { 
        id: 'perception', 
        name: isZh ? '感知核心 (Perception)' : 'Perception Core', 
        icon: Eye, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', 
        desc: isZh ? '光譜掃描與視覺' : 'Spectral Scan & Vision' 
      },
      { 
        id: 'cognition', 
        name: isZh ? '認知核心 (Cognition)' : 'Cognition Core', 
        icon: BrainCircuit, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', 
        desc: isZh ? '推理與模擬' : 'Reasoning & Simulation' 
      },
      { 
        id: 'memory', 
        name: isZh ? '記憶核心 (Memory)' : 'Memory Core', 
        icon: Database, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', 
        desc: isZh ? '量子晶格與 RAG' : 'Quantum Lattice & RAG' 
      },
      { 
        id: 'expression', 
        name: isZh ? '表達核心 (Expression)' : 'Expression Core', 
        icon: PenTool, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10', 
        desc: isZh ? '生成式 UI 與報告' : 'GenUI & Report Gen' 
      },
      { 
        id: 'nexus', 
        name: isZh ? '連結核心 (Nexus)' : 'Nexus Core', 
        icon: Network, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', 
        desc: isZh ? '編排與 API 網關' : 'Orchestration & API' 
      },
  ];

  return (
    <div className="min-h-screen bg-celestial-900 flex relative overflow-hidden font-sans">
      
      {/* === LEFT SIDE: LOGIN FORM === */}
      <div className="w-full lg:w-[45%] xl:w-[40%] relative z-20 flex flex-col justify-center p-8 md:p-12 border-r border-white/5 bg-slate-900/80 backdrop-blur-xl shadow-2xl h-screen">
          
          {/* Background Ambience Left */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-celestial-purple/10 rounded-full blur-[120px] animate-blob" />
             <div className="absolute top-[20%] right-0 w-[50%] h-[50%] bg-celestial-emerald/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          </div>

          <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col justify-center h-full max-h-[800px]">
            <div className="flex flex-col items-center mb-8">
                {/* Logo */}
                <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 bg-celestial-gold/20 blur-[40px] rounded-full opacity-60" />
                    <LogoIcon className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                </div>

                <h1 className="text-2xl font-bold text-white tracking-tight text-center">
                    ESGss <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-emerald to-celestial-gold">JunAiKey</span>
                </h1>
                
                <h2 className="text-lg text-gray-200 mt-1 font-bold tracking-wide text-center">
                    善向永續 萬能系統
                </h2>
                
                <p className="text-[9px] text-gray-500 mt-2 font-mono uppercase tracking-[0.2em]">
                    ENTERPRISE OMNI-OS V1.0
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                {!isDevMode && (
                <>
                    <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-celestial-emerald transition-colors" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isZh ? "企業信箱" : "Enterprise Email"}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-celestial-emerald/50 focus:ring-1 focus:ring-celestial-emerald/50 transition-all hover:bg-black/60"
                        required
                    />
                    </div>
                    <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-celestial-purple transition-colors" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isZh ? "密碼" : "Password"}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-celestial-purple/50 focus:ring-1 focus:ring-celestial-purple/50 transition-all hover:bg-black/60"
                        required
                    />
                    </div>
                </>
                )}

                {isDevMode && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                    <h4 className="text-xs font-bold text-amber-400 mb-0.5">{isZh ? "開發者模式已啟用" : "Developer Mode Enabled"}</h4>
                    <p className="text-[10px] text-gray-400">
                        {isZh 
                        ? "Auth 驗證已繞過。將以「CSO 管理員」權限登入系統。" 
                        : "Auth bypassed. Logging in with 'CSO Admin' privileges."}
                    </p>
                    </div>
                </div>
                )}

                <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-celestial-emerald to-celestial-purple text-white text-sm font-bold tracking-wide shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                    {isZh ? "進入系統" : "Initialize System"}
                    <ArrowRight className="w-4 h-4" />
                    </>
                )}
                </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                {/* Updated Footer Text */}
                <span className="text-[10px] text-gray-500 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"/>
                        系統運作正常
                    </div>
                    <span className="text-celestial-gold/80 font-medium">
                        [以終為始 。善向永續]
                    </span>
                </span>
                
                <button 
                onClick={toggleDevMode}
                className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors group shrink-0"
                >
                {isDevMode ? <ToggleRight className="w-6 h-6 text-celestial-emerald" /> : <ToggleLeft className="w-6 h-6 group-hover:text-gray-300" />}
                <span className="group-hover:underline hidden sm:inline">DevMode</span>
                </button>
            </div>
          </div>
      </div>

      {/* === RIGHT SIDE: SYSTEM MANIFEST (SINGLE PAGE VIEW) === */}
      <div className="hidden lg:flex flex-1 relative bg-[#020617] overflow-hidden flex-col items-center justify-center">
          {/* Cyberpunk Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
          
          <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col justify-center h-full">
              
              {/* Header Info - Compact Row */}
              <div className="mb-6 w-full">
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                          <h2 className="text-3xl font-bold text-white tracking-tight leading-none">
                              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold to-amber-500">Universal Core</span>
                          </h2>
                          <span className="text-lg text-gray-400 font-bold mt-1">
                              {isZh ? '萬能核心架構 (Architecture)' : 'Architecture'}
                          </span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                           <span className="px-2 py-0.5 bg-celestial-purple/20 text-celestial-purple border border-celestial-purple/30 rounded text-[10px] font-mono font-bold">
                                v15.0
                           </span>
                           <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                                <Activity className="w-3 h-3 animate-pulse" /> ONLINE
                           </span>
                      </div>
                  </div>

                  <p className="text-gray-400 text-xs font-light truncate opacity-80 max-w-full">
                      {isZh 
                        ? '"Component as Agent" (元件即代理)。JunAiKey 不僅是 SaaS，更是運行於 AIOS 之上的智慧有機體。' 
                        : '"Component as Agent". JunAiKey is not just a SaaS, it is an intelligent organism running on AIOS.'}
                  </p>
              </div>

              {/* Universal Cores Grid - Readable */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
                  {/* Hero Card */}
                  <div className="col-span-1 xl:col-span-2 p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Cpu className="w-20 h-20 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                          <BrainCircuit className="w-5 h-5 text-celestial-gold" />
                          {isZh ? 'AIOS 核心 + MCP 協定' : 'AIOS Kernel + MCP Protocol'}
                      </h3>
                      <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                          {isZh 
                            ? '採用 **Model Context Protocol (MCP)** 標準化神經連結，將系統解構為獨立的「萬能元件核心」。由 **JunAiKey Kernel** 進行即時組裝。'
                            : 'Standardizing neural connections via MCP, deconstructing system into "Universal Component Cores". Orchestrated by JunAiKey Kernel.'}
                      </p>
                  </div>

                  {/* Core Cards */}
                  {cores.map((core, i) => (
                      <div key={core.id} className={`p-3.5 rounded-lg border bg-black/40 backdrop-blur-sm flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:bg-black/60 group cursor-default ${core.border}`}>
                          <div className={`p-2.5 rounded-md ${core.bg} ${core.color} group-hover:scale-110 transition-transform shrink-0`}>
                              <core.icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                              <h4 className={`text-xs font-bold ${core.color} mb-1 truncate`}>{core.name}</h4>
                              <p className="text-[10px] text-gray-400 font-mono truncate">{core.desc}</p>
                          </div>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <CheckCircle2 className={`w-4 h-4 ${core.color}`} />
                          </div>
                      </div>
                  ))}
              </div>

              {/* Footer Tech Stack */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-gray-600 font-mono">
                  <div className="flex gap-4">
                      <span>Powered by Gemini 3 Pro</span>
                      <span>•</span>
                      <span>NoCodeBackend</span>
                      <span>•</span>
                      <span>Zero Hallucination</span>
                  </div>
                  <div>
                      DESIGN_SYSTEM: SINGULARITY
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};
