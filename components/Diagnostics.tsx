import React, { useState, useEffect } from 'react';
import { getMockHealth, TRANSLATIONS } from '../constants';
import { ShieldCheck, Activity, Server, AlertTriangle, Zap } from 'lucide-react';
import { Language } from '../types';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';

interface DiagnosticsProps {
  language: Language;
}

export const Diagnostics: React.FC<DiagnosticsProps> = ({ language }) => {
  const t = TRANSLATIONS[language].diagnostics;
  const healthData = getMockHealth(language);
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Diagnostics Check
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleFixAttempt = (module: string) => {
      addToast('warning', `Attempting self-healing protocol for ${module}...`, 'System Diagnostics');
      setTimeout(() => {
          addToast('success', `${module} optimized and running efficiently.`, 'Self-Healing Complete');
      }, 2000);
  }

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-celestial-emerald/10 rounded-xl border border-celestial-emerald/20">
                 <Zap className="w-8 h-8 text-celestial-emerald" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">{t.title}</h2>
                <p className="text-gray-400">{t.subtitle}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Module Health - Refactored to OmniEsgCell */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-celestial-emerald" />
                    {t.moduleHealth}
                </h3>
                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <OmniEsgCell key={i} mode="list" loading={true} />
                        ))
                    ) : (
                        healthData.map((item, idx) => (
                            <OmniEsgCell 
                                key={idx}
                                mode="list"
                                label={item.module}
                                value={item.status}
                                subValue={`${item.latency}ms latency`}
                                icon={Server}
                                color={item.status === 'Healthy' ? 'emerald' : 'gold'}
                                confidence={item.status === 'Healthy' ? 'high' : 'medium'}
                                // Trait: Optimization for healthy modules (breathing glow), Gap-filling for warning modules
                                traits={item.status === 'Healthy' ? ['optimization', 'performance'] : ['gap-filling']}
                                dataLink="live"
                                verified={true}
                                onAiAnalyze={() => handleFixAttempt(item.module)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Security & Stats - Refactored to OmniEsgCell */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col">
                 <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-celestial-purple" />
                    {t.security}
                </h3>
                <div className="grid grid-cols-2 gap-4 flex-1">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                             <OmniEsgCell key={i} mode="cell" loading={true} />
                        ))
                    ) : (
                        <>
                            <OmniEsgCell 
                                mode="cell" 
                                label={t.uptime} 
                                value="99.99%" 
                                color="emerald" 
                                traits={['optimization', 'seamless']} 
                                verified={true}
                            />
                            <OmniEsgCell 
                                mode="cell" 
                                label={t.audit} 
                                value="Passed" 
                                color="purple" 
                                traits={['bridging']}
                                verified={true} 
                            />
                            <OmniEsgCell 
                                mode="cell" 
                                label={t.alerts} 
                                value="0 Active" 
                                color="blue" 
                                traits={['seamless']} 
                            />
                            <OmniEsgCell 
                                mode="cell" 
                                label={t.version} 
                                value="v12.0.4" 
                                color="slate" 
                                subValue="Stable"
                            />
                        </>
                    )}
                </div>
                
                {isLoading ? (
                     <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3 animate-pulse">
                        <div className="w-5 h-5 bg-white/10 rounded shrink-0" />
                        <div className="space-y-2 w-full">
                            <div className="h-4 w-1/3 bg-white/10 rounded" />
                            <div className="h-3 w-3/4 bg-white/10 rounded" />
                        </div>
                     </div>
                ) : (
                    <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                            <div className="text-sm font-medium text-amber-400">{t.maintenance}</div>
                            <div className="text-xs text-gray-400 mt-1">
                                Data Verification Engine update scheduled for 03:00 UTC. No downtime expected.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};