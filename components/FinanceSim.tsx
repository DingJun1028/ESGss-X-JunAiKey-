
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Language, FinancialEntry } from '../types';
import { 
    Calculator, TrendingUp, DollarSign, AlertCircle, LineChart, Activity, 
    PieChart as PieChartIcon, Building, ArrowRightLeft, Wallet, Coins, 
    FileUp, Check, X, Info, Download, Trash2, List, Filter, ArrowUpRight, ArrowDownLeft,
    /* Added CheckCircle to imports to fix error on line 304 */
    Settings, Sparkles, Zap, Loader2, ShieldCheck, Crown, CheckCircle
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Legend, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { QuantumSlider } from './minimal/QuantumSlider';
import { OmniEsgCell } from './OmniEsgCell';
/* Fix: Removed unused predictFutureTrends import. */
import { runMcpAction } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface FinanceSimProps {
  language: Language;
}

const CsvImportView: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { addToast } = useToast();
    const { addFinancialEntries, expenses, incomes } = useCompany();
    const [parsedData, setParsedData] = useState<FinancialEntry[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const parseCsv = (text: string): FinancialEntry[] => {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) return [];
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        const dataLines = lines.slice(1);
        const dateIdx = headers.indexOf('date');
        const descIdx = headers.indexOf('description') !== -1 ? headers.indexOf('description') : headers.indexOf('desc');
        const amountIdx = headers.indexOf('amount');
        const catIdx = headers.indexOf('category');
        const typeIdx = headers.indexOf('type');
        if (dateIdx === -1 || amountIdx === -1 || typeIdx === -1) {
            throw new Error(isZh ? 'CSV 缺少必要標題：Date, Amount, Type' : 'CSV missing required headers: Date, Amount, Type');
        }
        return dataLines.map((line, i) => {
            const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            const cleanCols = cols.map(c => c.trim().replace(/^"|"$/g, ''));
            return {
                id: `csv-${Date.now()}-${i}`,
                date: cleanCols[dateIdx] || new Date().toISOString().split('T')[0],
                description: descIdx !== -1 ? cleanCols[descIdx] : 'CSV Import',
                amount: parseFloat(cleanCols[amountIdx]?.replace(/[$,]/g, '')) || 0,
                category: catIdx !== -1 ? cleanCols[catIdx] : 'Uncategorized',
                type: (cleanCols[typeIdx]?.toLowerCase().includes('inc') ? 'income' : 'expense') as 'income' | 'expense'
            };
        });
    };

    const handleFile = (file: File) => {
        if (!file.name.endsWith('.csv')) {
            addToast('error', isZh ? '僅支援 CSV 檔案' : 'Only CSV files supported', 'Invalid Format');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const entries = parseCsv(text);
                if (entries.length === 0) throw new Error(isZh ? '檔案中無有效數據' : 'No valid data in file');
                setParsedData(entries);
                addToast('info', isZh ? `解析成功：${entries.length} 筆資料` : `Parsed ${entries.length} records successfully`, 'CSV Import');
            } catch (err: any) {
                addToast('error', err.message || 'CSV Parsing Failed', 'Error');
            }
        };
        reader.readAsText(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div 
                className={`border-2 border-dashed rounded-[2.5rem] p-12 transition-all flex flex-col items-center justify-center text-center
                    ${isDragging ? 'border-celestial-gold bg-celestial-gold/5 scale-[1.01]' : 'border-white/10 bg-slate-900/40 hover:border-white/30'}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
            >
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                    <FileUp className={`w-10 h-10 ${isDragging ? 'text-celestial-gold animate-bounce' : 'text-gray-500'}`} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{isZh ? '匯入財務大數據 (CSV)' : 'Import Financial Big Data (CSV)'}</h3>
                <p className="text-sm text-gray-400 max-w-md mb-8 leading-relaxed">
                    {isZh ? '拖曳 CSV 檔案至此。系統將自動對標 Date, Description, Amount, Category, Type 字段並注入內核。' : 'Drag & drop a CSV file. System will auto-map Date, Description, Amount, Category, Type fields and inject into kernel.'}
                </p>
                <input 
                    type="file" 
                    id="csv-upload" 
                    className="hidden" 
                    accept=".csv" 
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
                />
                <label 
                    htmlFor="csv-upload" 
                    className="px-12 py-4 bg-white text-black font-black rounded-2xl hover:bg-celestial-gold transition-all cursor-pointer shadow-2xl active:scale-95 uppercase tracking-widest text-xs"
                >
                    {isZh ? '選擇本地檔案' : 'SELECT LOCAL FILE'}
                </label>
            </div>
            {parsedData.length > 0 && (
                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-slate-950/80 animate-slide-up shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Activity className="w-32 h-32" /></div>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                            <h4 className="zh-main text-2xl text-white tracking-tight">{isZh ? '解析預覽' : 'Parsing Preview'}</h4>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{parsedData.length} RECORDS IDENTIFIED</span>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setParsedData([])} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase border border-white/5">{isZh ? '取消' : 'CANCEL'}</button>
                            <button onClick={() => { addFinancialEntries(parsedData); setParsedData([]); addToast('success', isZh ? '數據已注入系統核心' : 'Data injected into system kernel', 'Success'); }} className="px-8 py-2.5 bg-emerald-500 text-black font-black rounded-xl text-[10px] tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20"><Check className="w-4 h-4" /> {isZh ? '確認匯入核心' : 'CONFIRM INJECTION'}</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto max-h-[400px] no-scrollbar rounded-2xl border border-white/5 bg-black/40">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 text-[9px] uppercase font-black text-gray-500 tracking-widest sticky top-0 z-20 backdrop-blur-md">
                                <tr>
                                    <th className="p-4 pl-8">Date</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 text-right pr-8">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-white/5 font-mono">
                                {parsedData.map((entry, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4 pl-8 text-gray-500">{entry.date}</td>
                                        <td className="p-4 text-white group-hover:text-celestial-gold transition-colors">{entry.description}</td>
                                        <td className="p-4 text-gray-600">{entry.category}</td>
                                        <td className="p-4"><span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${entry.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{entry.type}</span></td>
                                        <td className={`p-4 text-right pr-8 font-bold ${entry.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>{entry.type === 'income' ? '+' : '-'}${entry.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const TransactionList: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { expenses, incomes } = useCompany();
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const allTransactions = useMemo(() => {
        const combined = [...expenses, ...incomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (filterType === 'all') return combined;
        return combined.filter(t => t.type === filterType);
    }, [expenses, incomes, filterType]);
    if (expenses.length === 0 && incomes.length === 0) return null;
    return (
        <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-slate-900/40 shadow-2xl animate-fade-in overflow-hidden flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-celestial-purple/20 rounded-2xl text-celestial-purple border border-celestial-purple/30 shadow-lg"><List className="w-6 h-6" /></div>
                    <div>
                        <h4 className="zh-main text-xl text-white uppercase tracking-tight">{isZh ? '財務交易歷史軌跡' : 'Financial Ledger Trace'}</h4>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">PERSISTED_IN_CORE_MEMORY</span>
                    </div>
                </div>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
                    {['all', 'income', 'expense'].map(t => (
                        <button key={t} onClick={() => setFilterType(t as any)} className={`px-6 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterType === t ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>{t}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar rounded-2xl border border-white/5 min-h-[300px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-[9px] uppercase font-black text-gray-500 tracking-widest sticky top-0 z-20 backdrop-blur-md">
                        <tr>
                            <th className="p-4 pl-8">Timestamp</th>
                            <th className="p-4">Entity/Desc</th>
                            <th className="p-4">Type</th>
                            <th className="p-4 text-right pr-8">Quantum_Val</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-white/5 font-mono">
                        {allTransactions.map((t, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4 pl-8 text-gray-500">{t.date}</td>
                                <td className="p-4"><div className="text-white group-hover:text-celestial-gold transition-colors">{t.description}</div><div className="text-[8px] text-gray-600 uppercase font-black mt-1 tracking-tighter">{t.category}</div></td>
                                <td className="p-4"><div className={`flex items-center gap-2 ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>{t.type === 'income' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}<span className="text-[9px] font-black uppercase tracking-widest">{t.type}</span></div></td>
                                <td className={`p-4 text-right pr-8 font-bold text-base tracking-tighter ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const FinanceSim: React.FC<FinanceSimProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { carbonData, esgScores } = useCompany(); 
  const [activeTab, setActiveTab] = useState<'roi' | 'shadow' | 'import' | 'accelerator'>('roi');
  const [carbonPrice, setCarbonPrice] = useState(85); 
  const [investment, setInvestment] = useState(5); 
  const [timeHorizon, setTimeHorizon] = useState(5); 
  const [efficiency, setEfficiency] = useState(15); 
  const [data, setData] = useState<any[]>([]);

  // Action 09 States
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [financialCert, setFinancialCert] = useState<any>(null);

  useEffect(() => {
    const newData = [];
    const baseRevenue = 100; 
    const currentCarbon = (carbonData.scope1 + carbonData.scope2) / 1000; 
    for (let i = 0; i <= timeHorizon; i++) {
      const year = 2024 + i;
      const carbonTaxLoad = (currentCarbon * carbonPrice * 0.05 * i); 
      const bauCost = carbonTaxLoad; 
      const bau = baseRevenue + (i * 2) - bauCost;
      const investCost = i === 0 ? investment * 2 : 0; 
      const efficiencyGain = (efficiency * 0.5 * i);
      const greenTax = (carbonTaxLoad * 0.4); 
      const green = baseRevenue + (i * 3) + efficiencyGain - greenTax - investCost;
      newData.push({ year: year.toString(), BAU: parseFloat(bau.toFixed(1)), Green: parseFloat(green.toFixed(1)) });
    }
    setData(newData);
  }, [carbonPrice, investment, timeHorizon, efficiency, carbonData]);

  const handleFinancialAccelerator = async () => {
      setIsAccelerating(true);
      setFinancialCert(null);
      addToast('info', isZh ? '正在執行 [金融符文對接] 序列...' : 'Initiating [Financial Rune Sync]...', 'CSO Agent');
      
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
          addToast('error', 'Financial reasoning sequence interrupted.', 'Fault');
      } finally {
          setIsAccelerating(false);
      }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden pb-12">
      <UniversalPageHeader icon={Calculator} title={{ zh: '財務模擬與金融符文', en: 'Finance & Financial Runes' }} description={{ zh: '去碳化投資回報與影響力利差對標中心', en: 'ROI Forecast & Impact-Based Interest Adjustment.' }} language={language} tag={{ zh: '金融內核 v16.1', en: 'FINANCE_v16.1' }} />

      <div className="flex justify-center -mt-8 mb-4 relative z-10 shrink-0">
          <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 flex backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
              {[
                  { id: 'roi', icon: LineChart, label: isZh ? 'ROI 預測' : 'ROI Forecast', color: 'bg-celestial-emerald' },
                  { id: 'accelerator', icon: Crown, label: isZh ? '金融加速器' : 'Accelerator', color: 'bg-celestial-gold text-black' },
                  { id: 'shadow', icon: Coins, label: isZh ? '影子價格' : 'Shadow Price', color: 'bg-celestial-purple' },
                  { id: 'import', icon: FileUp, label: isZh ? '數據匯入' : 'Data Ingestion', color: 'bg-white text-black' },
              ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-3 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${activeTab === t.id ? `${t.color} shadow-2xl scale-[1.05]` : 'text-gray-500 hover:text-white'}`}>
                      <t.icon className="w-4 h-4" /> {t.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
        {activeTab === 'accelerator' ? (
            <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
                <div className="p-12 rounded-[4rem] bg-gradient-to-br from-celestial-gold/20 via-slate-950 to-black border-2 border-celestial-gold/30 shadow-[0_0_80px_rgba(251,191,36,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5"><Crown className="w-80 h-80 text-celestial-gold" /></div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                        <div className="space-y-6 flex-1">
                            <h3 className="zh-main text-5xl text-white tracking-tighter">動作 09：金融加速器 (#神聖契約)</h3>
                            <p className="text-gray-400 text-lg leading-relaxed font-light italic max-w-2xl">
                                「將您的永續陰德轉化為實質金流。點擊啟動，與全球 20 家綠色金融銀行對標利率減免。」
                            </p>
                            <div className="flex gap-4">
                                <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold uppercase flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Data Integrity: 99.8%
                                </div>
                                <div className="px-5 py-2 bg-celestial-gold/10 border border-celestial-gold/30 rounded-xl text-celestial-gold text-xs font-bold uppercase flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Impact Pool Ready
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={handleFinancialAccelerator}
                            disabled={isAccelerating}
                            className="px-20 py-8 bg-celestial-gold text-black font-black rounded-[2.5rem] shadow-[0_30px_60px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.4em] text-sm flex flex-col items-center gap-2 group"
                        >
                            {isAccelerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current group-hover:animate-pulse" />}
                            <span>ACTIVATE_FINANCE_RUNE</span>
                        </button>
                    </div>
                </div>

                {financialCert && (
                    <div className="grid grid-cols-12 gap-8 animate-slide-up">
                        <div className="col-span-12 lg:col-span-8 glass-bento p-12 bg-slate-900 border-celestial-gold/20 rounded-[4rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.05)_0%,transparent_70%)] pointer-events-none" />
                            <h4 className="text-[10px] font-black text-celestial-gold uppercase tracking-[0.5em] mb-10 border-b border-white/5 pb-4">PROOF_OF_IMPACT_CERTIFICATE</h4>
                            <div className="grid grid-cols-2 gap-12 mb-12">
                                <div>
                                    <div className="text-[9px] text-gray-600 uppercase font-black mb-1">Interest_Rate_Discount</div>
                                    <div className="text-6xl font-mono font-black text-emerald-400">-{financialCert.bpsDiscount} <span className="text-xl">bps</span></div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] text-gray-600 uppercase font-black mb-1">Annual_Cost_Efficiency</div>
                                    <div className="text-6xl font-mono font-black text-white">${financialCert.estimatedAnnualSaving.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 space-y-4">
                                <div className="flex items-center gap-3 text-emerald-400 font-bold uppercase text-[10px]">
                                    <ShieldCheck className="w-4 h-4" /> AI_Reasoning_Justification
                                </div>
                                <p className="text-gray-300 leading-relaxed italic text-sm">"{financialCert.justification}"</p>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                            <div className="glass-bento p-10 bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl flex flex-col justify-center text-center relative overflow-hidden flex-1">
                                 <div className="absolute top-0 right-0 p-8 opacity-5"><Coins className="w-32 h-32 text-celestial-gold" /></div>
                                 <div className="text-[9px] text-gray-500 uppercase font-black mb-4">PoI_Blockchain_Hash</div>
                                 <div className="text-xs font-mono text-celestial-gold break-all bg-black/40 p-4 rounded-2xl border border-white/5">{financialCert.poiHash}</div>
                                 <button className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white font-black uppercase hover:bg-white/10 transition-all">Verify_On_Chain</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) : activeTab === 'import' ? (
            <div className="space-y-8 animate-fade-in"><CsvImportView language={language} /><TransactionList language={language} /></div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="glass-panel p-8 rounded-[3rem] space-y-10 border border-white/5 h-full bg-slate-900/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Activity className="w-48 h-48" /></div>
                    <div className="flex items-center gap-3 mb-2 p-4 bg-white/5 rounded-2xl border border-white/5 relative z-10">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><DollarSign className="w-5 h-5" /></div>
                        <div>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block">Linked_Emissions</span>
                            <span className="text-xl font-mono font-bold text-white">{(carbonData.scope1 + carbonData.scope2).toFixed(1)} <span className="text-gray-500 text-xs">tCO2e</span></span>
                        </div>
                    </div>
                    <div className="space-y-2 relative z-10">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1 mb-6 flex items-center gap-2"><Settings className="w-3.5 h-3.5" /> Simulation_Parameters</h3>
                        <div className="space-y-8">
                            <QuantumSlider label={activeTab === 'roi' ? (isZh ? '外部碳稅' : 'External Carbon Tax') : (isZh ? '內部影子價格' : 'Internal Shadow Price')} value={carbonPrice} min={0} max={300} unit="$/t" color={activeTab === 'roi' ? 'gold' : 'purple'} onChange={setCarbonPrice} />
                            {activeTab === 'roi' && (
                                <>
                                    <QuantumSlider label={isZh ? '綠色投資額' : 'Green Investment'} value={investment} min={0} max={50} unit="M$" color="emerald" onChange={setInvestment} />
                                    <QuantumSlider label={isZh ? '時間範疇 (年)' : 'Time Horizon'} value={timeHorizon} min={1} max={15} unit="Yrs" color="blue" onChange={setTimeHorizon} />
                                    <QuantumSlider label={isZh ? '預期能效提升 (%)' : 'Efficiency Gain'} value={efficiency} min={0} max={50} unit="%" color="purple" onChange={setEfficiency} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 h-full flex flex-col gap-6">
                    {activeTab === 'roi' ? <MarketOracleAgent id="MarketOracle" label="ROI Forecast" data={data} isZh={isZh} /> : <ShadowPricingView price={carbonPrice} emissions={carbonData.scope1 + carbonData.scope2} isZh={isZh} />}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

interface MarketOracleProps extends InjectedProxyProps { data: any[]; isZh: boolean; }
const MarketOracleBase: React.FC<MarketOracleProps> = ({ data, isZh, adaptiveTraits, isAgentActive, trackInteraction }) => {
    const isCalculating = adaptiveTraits?.includes('optimization');
    return (
        <div className={`lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col relative overflow-hidden group shadow-2xl border-white/5`}>
            <div className="flex justify-between items-center mb-8 relative z-10 shrink-0">
                <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-lg"><TrendingUp className="w-6 h-6" /></div>
                    {isZh ? '情境分析：一切照舊 vs 綠色轉型' : 'Scenario: BAU vs Green Transition'}
                </h3>
            </div>
            <div className="flex-1 min-h-[350px] w-full relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorBau" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/><stop offset="95%" stopColor="#64748b" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="year" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                        <Area name={isZh ? "綠色轉型" : "Green Transition"} type="monotone" dataKey="Green" stroke="#10b981" fill="url(#colorGreen)" strokeWidth={3} />
                        <Area name={isZh ? "一切照舊 (BAU)" : "Business As Usual"} type="monotone" dataKey="BAU" stroke="#64748b" fill="url(#colorBau)" strokeDasharray="5 5" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
const MarketOracleAgent = withUniversalProxy(MarketOracleBase);

const ShadowPricingView: React.FC<{ price: number, emissions: number, isZh: boolean }> = ({ price, emissions, isZh }) => {
    const totalFund = emissions * price;
    const deptImpact = [ { name: isZh ? '製造部' : 'Manufacturing', value: totalFund * 0.6, color: '#ef4444' }, { name: isZh ? '物流部' : 'Logistics', value: totalFund * 0.25, color: '#f59e0b' }, { name: isZh ? '行政部' : 'Admin', value: totalFund * 0.15, color: '#10b981' } ];
    return (
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="glass-panel p-8 rounded-[3rem] border border-white/5 flex flex-col min-h-[400px] shadow-2xl bg-slate-900/40 overflow-hidden relative">
                <h3 className="text-xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-tight relative z-10"><div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400 border border-purple-500/30"><Building className="w-6 h-6" /></div>{isZh ? '部門內部碳費衝擊' : 'Departmental Impact'}</h3>
                <div className="flex-1 w-full min-h-[300px] relative overflow-hidden z-10">
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <PieChart>
                            <Pie data={deptImpact} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">{deptImpact.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.color} /> ))}</Pie>
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '16px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="glass-panel p-10 rounded-[3rem] border border-emerald-500/20 bg-emerald-900/10 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-2xl">
                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-8 relative z-10 shadow-2xl animate-neural-pulse"><Wallet className="w-10 h-10 text-emerald-400" /></div>
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-3 relative z-10">{isZh ? '可籌集綠色轉型基金' : 'ESTIMATED_REGEN_FUND'}</div>
                    <div className="text-6xl font-mono font-black text-white mb-3 relative z-10 tracking-tighter">${totalFund.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
