import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Zap, Cpu, CheckCircle, Globe, Lock } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';

export const OnboardingSystem: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const { userName } = useCompany();

  // Only run if not seen in this session (sessionStorage)
  useEffect(() => {
      const hasSeen = sessionStorage.getItem('esgss_boot_sequence');
      if (hasSeen) {
          setIsVisible(false);
          return;
      }
      
      // Sequence Logic
      const interval = setInterval(() => {
          setProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setTimeout(() => finishBoot(), 800);
                  return 100;
              }
              // Non-linear progress
              const increment = Math.random() * 15;
              return Math.min(prev + increment, 100);
          });
      }, 300);

      return () => clearInterval(interval);
  }, []);

  // Update text steps based on progress
  useEffect(() => {
      if (progress < 30) setStep(0);
      else if (progress < 60) setStep(1);
      else if (progress < 90) setStep(2);
      else setStep(3);
  }, [progress]);

  const finishBoot = () => {
      setIsVisible(false);
      sessionStorage.setItem('esgss_boot_sequence', 'true');
  };

  if (!isVisible) return null;

  const steps = [
      { text: "INITIALIZING KERNEL...", sub: "Loading Omni-Components", icon: Cpu },
      { text: "ESTABLISHING PROTOCOL v1.1...", sub: "Syncing with StarGate (NCB)", icon: Globe },
      { text: "INJECTING GENESIS SEEDS...", sub: "Simple. Fast. Perfect.", icon: Zap },
      { text: `WELCOME, ${userName?.toUpperCase() || 'COMMANDER'}`, sub: "System Ready", icon: CheckCircle },
  ];

  const CurrentIcon = steps[step].icon;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center cursor-wait">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
        
        {/* Central HUD */}
        <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center">
            
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-celestial-emerald/20 blur-2xl rounded-full animate-pulse" />
                <div className="w-32 h-32 rounded-full border-4 border-celestial-emerald/30 border-t-celestial-emerald animate-spin flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-celestial-purple/30 border-b-celestial-purple animate-[spin_3s_linear_infinite_reverse]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <CurrentIcon className="w-10 h-10 text-white animate-pulse" />
                </div>
            </div>

            <div className="w-full space-y-2 mb-8">
                <div className="flex justify-between text-xs font-mono text-celestial-emerald">
                    <span>JUN_AIKEY_GENESIS_v1.1</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-celestial-emerald to-celestial-purple transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="text-center space-y-2 h-16">
                <h2 className="text-xl font-bold text-white tracking-widest animate-fade-in">
                    {steps[step].text}
                </h2>
                <p className="text-sm text-gray-500 font-mono animate-pulse">
                    {steps[step].sub}
                </p>
            </div>

            {/* Simulated Console Log */}
            <div className="mt-12 w-full h-32 overflow-hidden text-[10px] font-mono text-gray-600 border-t border-white/5 pt-4 text-left opacity-50">
                <p>> Mount: OmniEsgCell... OK</p>
                {progress > 20 && <p>> Link: Gemini 3 Pro... CONNECTED (23ms)</p>}
                {progress > 40 && <p>> Verify: Genesis Seeds... 12 WORDS INJECTED</p>}
                {progress > 60 && <p>> Optimize: React Fiber Tree... DONE</p>}
                {progress > 80 && <p>> Inject: Context Providers... SUCCESS</p>}
                {progress > 95 && <p>> Access Granted.</p>}
            </div>
        </div>
    </div>
  );
};