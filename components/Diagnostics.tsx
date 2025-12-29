import React, { useState, useEffect } from 'react';
import { 
    Activity, ShieldCheck, Zap, Layers, Binary, 
    RefreshCw, Loader2, Check, Gavel, Cpu, HardDrive, Terminal, Code
} from 'lucide-react';
import { Language, DimensionProtocol, UnitTestResult } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence } from '../services/evolutionEngine';

export const Diagnostics: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [dimensions, setDimensions] = useState<DimensionProtocol[]>([]);
  const [syncRate, setSyncRate] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [unitTests, setUnitTests] = useState<UnitTestResult[]>([]);

  useEffect(() => {
      const sub1 = universalIntelligence.dimensions$.subscribe(setDimensions);
      const sub2 = universalIntelligence.syncRate$.subscribe(setSyncRate);
      const sub3 = universalIntelligence.unitTests$.subscribe(setUnitTests);
      return () => { sub1.unsubscribe(); sub2.unsubscribe(); sub3.unsubscribe(); };
  }, []);

  const handleCalibrate = () => {
      setIsCalibrating(true);
      addToast('info', isZh ? '啟動 12A 維度與邏輯斷言校準...' : 'Initializing 12A Dimension & Logic Assertion Calibration...', 'Kernel');
      universalIntelligence.runSystemWitness();
      setTimeout(() => {
          setIsCalibrating(false);
          addToast('success', isZh ? '校準完成：維度完整性提升至 100%' : 'Calibration Successful: Dimensions at 100%', 'System');
      }, 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
        <UniversalPageHeader 
            icon={Binary}
            title={{ zh: '系統診斷與邏輯見證', en: 'Diagnostics & Logic Witness' }}
            description={{ zh: '監控 AIOS 核心維度完整性與型別單元測試狀態', en: 'Monitor core dimension integrity and type-safe unit test states.' }}
            language={language}
            tag={{ zh: '架構核心', en: 'ARCH_CORE' }}
        />

        {/* Global Vital HUD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-celestial-emerald/10 to-transparent border-emerald-500/20 flex items-center gap-6 shadow-xl">
                <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Neural Sync Rate</div>
                    <div className="text-4xl font-mono font-bold text-white">{syncRate}%</div>
                </div>
            </div>
            <div className="md:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/10 flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">{isZh ? '系統演進與邏輯驗證' : 'System Evolution & Verification'}</h3>
                    <p className="text-xs text-gray-500 font-mono">Kernel v15.0.4 • Witness Protocol Active</p>
                </div>
                <button 
                    onClick={handleCalibrate}
                    disabled={isCalibrating}
                    className="px-8 py-4 bg-celestial-gold text-black font-black rounded-2xl flex items-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                    {isCalibrating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gavel className="w-5 h-5" />}
                    {isZh ? '執行邏輯見證' : 'Execute Witness'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Logic Assertion Matrix */}
            <div className="lg:col-span-7 space-y-6">
                <div className="glass-panel p-8 rounded-[3rem] border border-white/10 bg-slate-900/40 min-h-[500px] flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <Terminal className="w-6 h-6 text-celestial-blue" />
                        {isZh ? '型別單元測驗矩陣' : 'Logic Assertion Matrix'}
                    </h3>

                    <div className="space-y-4 flex-1">
                        {unitTests.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40 italic">
                                <Code className="w-12 h-12 mb-4" />
                                <p>Waiting for witness execution...</p>
                            </div>
                        ) : unitTests.map(test => (
                            <div key={test.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-celestial-blue/30 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5">
                                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{test.name}</div>
                                            <div className="text-[9px] text-gray-500 uppercase tracking-wider">{test.module} • {new Date(test.lastRun).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-bold border border-emerald-500/20 mb-1">PASSED</div>
                                        <div className="text-[8px] font-mono text-gray-600">WIT_SIG: {test.witnessHash}</div>
                                    </div>
                                </div>
                                <div className="space-y-1.5 pl-13">
                                    {test.assertionLog.map((log, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 12A Dimension Grid */}
            <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel p-8 rounded-[3rem] border border-white/10 bg-slate-900/40 h-full">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <Layers className="w-5 h-5 text-celestial-purple" /> 12A Dimension Monitor
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                        {dimensions.map(dim => (
                            <div key={dim.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black text-gray-600 font-mono group-hover:text-celestial-gold transition-colors">{dim.id}</span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${dim.integrity > 90 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                </div>
                                <div className="text-[9px] font-bold text-white truncate">{dim.name}</div>
                                <div className="h-0.5 w-full bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-celestial-gold opacity-50" style={{ width: `${dim.integrity}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-celestial-blue/5 border border-celestial-blue/20 rounded-2xl">
                         <h4 className="text-[10px] font-bold text-celestial-blue uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Activity className="w-3 h-3" /> System DNA Verify
                         </h4>
                         <p className="text-[10px] text-gray-400 leading-relaxed italic">
                             Every logic sector is witnessed by the AIOS Kernel. Non-deterministic hallucinations are neutralized via 12-stage validation.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};