
import React, { useState, useEffect, useMemo } from 'react';
import { Language, FinancialEntry } from '../types';
import { 
    Calculator, TrendingUp, DollarSign, AlertCircle, LineChart, Activity, 
    Zap, Loader2, Crown, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Flame
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Legend
} from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';
import { runMcpAction } from '../services/ai-service';

export const FinanceSim: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { esgScores } = useCompany();
  
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [financialCert, setFinancialCert] = useState<any>(null);

  const handleFinancialAccelerator = async () => {
      setIsAccelerating(true);
      setFinancialCert(null);
      addToast('info', isZh ? '啟動 [動作 09：金融加速器]：對標綠色利差...' : 'Activating [Action 09: Financial Accelerator]...', 'CSO Agent');
      
      try {
          const res = await runMcpAction('forge_financial_certificate', {
              esgMetrics: { 
                  compliance: 94.5, 
                  reduction: 12.8, 
                  governance: esgScores.governance 
              },
              loanData: { principal: 5000000, currentRate: 4.2 }
          }, language);

          if (res.success) {
              setFinancialCert(res.result);
              addToast('reward', isZh ? `金融符文生效：預計年省 ${res.result.estimatedAnnualSaving.toLocaleString()} USD` : `Rune Active: Saving ${res.result.estimatedAnnualSaving.toLocaleString()} USD/yr`, 'Sacred Contract');
          }
      } catch (e) {
          addToast('error', 'Financial reasoning failed.', 'Fault');
      } finally {
          setIsAccelerating(false);
      }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden pb-12 p-6 bg-slate-50 text-slate-800">
      <UniversalPageHeader 
        icon={Calculator} 
        title={{ zh: '財務模擬與金融符文', en: 'Finance & Financial Runes' }} 
        description={{ zh: '去碳化投資回報與影響力利差對標中心', en: 'ROI Forecast & Impact-Based Interest Adjustment.' }} 
        language={language} 
        tag={{ zh: '金融內核 v16.1', en: 'FINANCE_v16.1' }} 
      />

      <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
        <div className="max-w-6xl mx-auto space-y-10">
            {/* 1. 金融加速器面板 */}
            <div className="p-12 rounded-[4rem] bg-slate-900 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(251,191,36,0.1)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform"><Crown className="w-80 h-80 text-amber-500" /></div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                    <div className="space-y-6 flex-1 text-white">
                        <h3 className="zh-main text-5xl tracking-tighter">動作 09：金融加速器</h3>
                        <p className="text-slate-400 text-lg leading-relaxed font-light italic max-w-2xl">
                            「將您的永續陰德轉化為實質金流。對標全球 20 家綠色金融銀行，自動爭取利率減免。」
                        </p>
                        <div className="flex gap-4">
                            <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold uppercase flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Data Integrity: 99.8%
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleFinancialAccelerator}
                        disabled={isAccelerating}
                        className="px-20 py-8 bg-amber-500 text-black font-black rounded-[2.5rem] shadow-[0_30px_60px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.4em] text-sm flex flex-col items-center gap-2"
                    >
                        {isAccelerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                        <span>ACTIVATE_FINANCE_RUNE</span>
                    </button>
                </div>
            </div>

            {/* 2. 顯化證書 */}
            {financialCert && (
                <div className="grid grid-cols-12 gap-8 animate-slide-up">
                    <div className="col-span-12 lg:col-span-8 bg-white border border-slate-100 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><ShieldCheck className="w-64 h-64 text-emerald-500" /></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10 border-b border-slate-50 pb-4">PROOF_OF_IMPACT_CERTIFICATE</h4>
                        <div className="grid grid-cols-2 gap-12 mb-12">
                            <div>
                                <div className="text-[9px] text-slate-400 uppercase font-black mb-1">Interest_Rate_Discount</div>
                                <div className="text-7xl font-mono font-black text-emerald-500">-{financialCert.bpsDiscount} <span className="text-xl">bps</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] text-slate-400 uppercase font-black mb-1">Annual_Cost_Efficiency</div>
                                <div className="text-7xl font-mono font-black text-slate-800">${financialCert.estimatedAnnualSaving.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4">
                            <div className="flex items-center gap-3 text-emerald-600 font-bold uppercase text-[10px]">
                                <Sparkles className="w-4 h-4" /> AI_Reasoning_Justification
                            </div>
                            <p className="text-slate-600 leading-relaxed italic text-sm">"{financialCert.justification}"</p>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl flex flex-col justify-center text-center relative overflow-hidden flex-1 text-white">
                             <div className="absolute top-0 right-0 p-8 opacity-5"><DollarSign className="w-32 h-32 text-amber-500" /></div>
                             <div className="text-[9px] text-slate-500 uppercase font-black mb-4">PoI_Blockchain_Hash</div>
                             <div className="text-xs font-mono text-amber-500 break-all bg-black/40 p-4 rounded-2xl border border-white/5">{financialCert.poiHash}</div>
                             <button className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white font-black uppercase hover:bg-white/10 transition-all">Verify_On_Chain</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
