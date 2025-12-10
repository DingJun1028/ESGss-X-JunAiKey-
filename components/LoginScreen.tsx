
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ToggleLeft, ToggleRight, ArrowRight, BrainCircuit, Activity } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-celestial-900 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-celestial-purple/20 rounded-full blur-[150px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-celestial-emerald/20 rounded-full blur-[150px] animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* System Status Indicators */}
      <div className="absolute top-8 left-8 flex gap-4 text-[10px] font-mono text-celestial-emerald opacity-60">
          <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 animate-pulse" />
              SYSTEM STATUS: ALL GREEN
          </div>
          <div className="hidden md:block">OS: Good Era Omni-OS v4.0</div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="glass-panel p-8 rounded-3xl border-t border-white/20 shadow-2xl shadow-celestial-purple/20 backdrop-blur-xl bg-slate-900/40">
          
          <div className="flex flex-col items-center mb-8">
            {/* Immersive Logo Area */}
            <div className="relative w-32 h-32 mb-6 animate-float">
               {/* Ambient Glow Layers */}
               <div className="absolute inset-0 bg-celestial-gold/30 blur-[50px] rounded-full opacity-60" />
               <div className="absolute inset-0 bg-celestial-emerald/20 blur-[30px] rounded-full translate-x-2 translate-y-2 opacity-50" />
               
               {/* Logo with Depth */}
               <div className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] filter brightness-110">
                  <LogoIcon className="w-full h-full" />
               </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-center flex flex-col gap-1 drop-shadow-lg">
              <span>ESGss</span>
              <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-celestial-emerald to-celestial-gold tracking-widest font-medium">
                善向永續 JunAiKey
              </span>
            </h1>
            <p className="text-[10px] text-celestial-purple/80 mt-2 font-mono uppercase tracking-[0.2em] text-center w-full">
              Powered by 善向紀元 (Good Era)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {!isDevMode && (
              <>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-celestial-emerald transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isZh ? "企業信箱" : "Enterprise Email"}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-celestial-emerald/50 focus:ring-1 focus:ring-celestial-emerald/50 transition-all hover:bg-slate-950/70"
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-celestial-purple transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isZh ? "密碼" : "Password"}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-celestial-purple/50 focus:ring-1 focus:ring-celestial-purple/50 transition-all hover:bg-slate-950/70"
                    required
                  />
                </div>
              </>
            )}

            {isDevMode && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-400 mb-1">{isZh ? "開發者模式已啟用" : "Developer Mode Enabled"}</h4>
                  <p className="text-xs text-gray-400">
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-celestial-emerald to-celestial-purple text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isZh ? "進入系統" : "Enter System"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-celestial-emerald" />
              {isZh ? "萬能智庫 已連結" : "Universal Intelligence Connected"}
            </span>
            <button 
              onClick={toggleDevMode}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors group"
            >
              {isDevMode ? <ToggleRight className="w-8 h-8 text-celestial-emerald" /> : <ToggleLeft className="w-8 h-8 group-hover:text-gray-300" />}
              <span>DevMode</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
