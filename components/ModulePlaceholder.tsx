
import React, { useState, useEffect } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { LucideIcon, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  language: Language;
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ title, description, icon: Icon, language }) => {
  const [isInitializing, setIsInitializing] = useState(true);

  // Simulate Module Initialization
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsInitializing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-celestial-purple/10 border border-celestial-purple/30">
           <Icon className="w-8 h-8 text-celestial-purple" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-dashed border-white/10 bg-white/5 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {/* Background Animation & Grid */}
        <div className="absolute inset-0 pointer-events-none">
           {/* Grid Pattern */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
           {/* Pulsing Orb */}
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-celestial-emerald/10 rounded-full blur-3xl transition-all duration-1000 ${isInitializing ? 'animate-pulse scale-110' : 'scale-100'}`} />
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center justify-center gap-3">
                {isInitializing && <Loader2 className="w-5 h-5 animate-spin text-celestial-emerald" />}
                {language === 'zh-TW' ? '模組構建中' : 'Module Under Construction'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
               {language === 'zh-TW' 
                 ? 'Intelligence Orchestrator 正在初始化此模組的數據連結與 AI 代理。以下是即將部署的「Omni-Component (萬能元件)」預覽。' 
                 : 'Intelligence Orchestrator is initializing data links and AI agents for this module. Below is a preview of the "Omni-Component" to be deployed.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
                <OmniEsgCell 
                    mode="cell"
                    label="Active Data Stream" 
                    value="24.8 TB" 
                    confidence="high" 
                    loading={isInitializing}
                />
                <OmniEsgCell 
                    mode="cell"
                    label="AI Insight Gen" 
                    value="Active" 
                    confidence="medium" 
                    loading={isInitializing}
                    dataLink="ai"
                />
            </div>
        </div>
      </div>
    </div>
  );
};
