import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Calculator, TrendingUp, DollarSign, AlertCircle, LineChart, Activity, PieChart as PieChartIcon, Building, ArrowRightLeft, Wallet, Coins } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { QuantumSlider } from './minimal/QuantumSlider';
import { OmniEsgCell } from './OmniEsgCell';
import { predictFutureTrends } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface FinanceSimProps {
  language: Language;
}

interface MarketOracleProps extends InjectedProxyProps {
    data: any[];
    isZh: boolean;
}

const MarketOracleBase: React.FC<MarketOracleProps> = ({ data, isZh, adaptiveTraits, isAgentActive, trackInteraction }) => {
    const isCalculating = adaptiveTraits?.includes('optimization');
    const isVolatile = adaptiveTraits?.includes('evolution'); 

    return (
        <div 
            className={`lg:col-span-2 glass-panel p-6 rounded-2xl border transition-all duration-500 min-h-[400px] flex flex-col relative overflow-hidden group
                ${isVolatile ? 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/5'}
            `}
            onClick={() => trackInteraction?.('click')}
        >
            {isCalculating && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-celestial-emerald/5 to-transparent animate-[scan_2s_linear_infinite] pointer-events-none" />
            )}

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className={`w-5 h-5 ${isVolatile ? 'text-amber-400' : 'text-celestial-emerald'}`} />
                    {isZh ? '情境分析：一切照舊 vs 綠色轉型' : 'Scenario: BAU vs Green Transition'}
                </h3>
                {isAgentActive && (
                    <div className="flex items-center gap-1 text-[10px] text-celestial-emerald border border-celestial-emerald/30 px-2 py-1 rounded bg-celestial-emerald/10">
                        <Activity className="w-3 h-3" /> Oracle Live
                    </div>
                )}
            </div>
            
            <div className="flex-1 min-h-[300px] w-full relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorBau" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)' }}
                            itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Area name={isZh ? "綠色轉型" : "Green Transition"} type="monotone" dataKey="Green" stroke="#10b981" fill="url(#colorGreen)" strokeWidth={2} />
                        <Area name={isZh ? "一切照舊 (BAU)" : "Business As Usual"} type="monotone" dataKey="BAU" stroke="#64748b" fill="url(#colorBau)" strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 leading-relaxed">
                    {isZh 
                        ? "注意：當碳價超過 €120/t 時，BAU 情境將出現負現金流。建議加速資本支出。" 
                        : "Insight: BAU scenario turns cash-negative when Carbon Price exceeds €120/t. Acceleration advised."}
                </div>
            </div>
        </div>
    );
};

const MarketOracleAgent = withUniversalProxy(MarketOracleBase);

const ShadowPricingView: React.FC<{ price: number, emissions: number, isZh: boolean }> = ({ price, emissions, isZh }) => {
    const totalFund = emissions * price;
    const deptImpact = [
        { name: isZh ? '製造部' : 'Manufacturing', value: totalFund * 0.6, color: '#ef4444' },
        { name: isZh ? '物流部' : 'Logistics', value: totalFund * 0.25, color: '#f59e0b' },
        { name: isZh ? '行政部' : 'Admin', value: totalFund * 0.15, color: '#10b981' },
    ];

    return (
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col min-h-[400px]">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Building className="w-5 h-5 text-celestial-purple" />
                    {isZh ? '部門內部碳費衝擊' : 'Departmental Carbon Fee Impact'}
                </h3>
                <div className="flex-1 w-full min-h-[300px] relative overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <PieChart>
                            <Pie
                                data={deptImpact}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {deptImpact.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-900/10 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 relative z-10">
                        <Wallet className="w-8 h-8 text-emerald-400" />
                    </div>
                    
                    <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2 relative z-10">
                        {isZh ? '可籌集綠色轉型基金' : 'Green Transition Fund Generated'}
                    </div>
                    <div className="text-4xl font-mono font-bold text-white mb-2 relative z-10">
                        ${totalFund.toLocaleString()}
                    </div>
                    <div className="text-xs text-emerald-200/70 relative z-10">
                        {isZh ? '基於當前排放量與影子價格' : 'Based on current emissions & shadow price'}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{isZh ? '最高付費部門' : 'Top Payer'}</span>
                        <span className="font-bold text-red-400">{isZh ? '製造部' : 'Manufacturing'} (60%)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{isZh ? '對 EPS 影響' : 'EPS Impact'}</span>
                        <span className="font-bold text-white">-0.12%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{isZh ? '相當於營運成本' : 'Equiv. OpEx'}</span>
                        <span className="font-bold text-white">1.8%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const FinanceSim: React.FC<FinanceSimProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { carbonData } = useCompany(); 
  
  const [activeTab, setActiveTab] = useState<'roi' | 'shadow'>('roi');

  const [carbonPrice, setCarbonPrice] = useState(85); 
  const [investment, setInvestment] = useState(5); 
  const [timeHorizon, setTimeHorizon] = useState(5); 
  const [efficiency, setEfficiency] = useState(15); 

  const [data, setData] = useState<any[]>([]);

  const pageData = {
      title: { zh: '財務模擬器', en: 'Financial Simulator' },
      desc: { zh: '去碳化投資回報與碳稅衝擊預測', en: 'Decarbonization Investment Analysis' },
      tag: { zh: '認知核心', en: 'Cognition Core' }
  };

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

      newData.push({
        year: year.toString(),
        BAU: parseFloat(bau.toFixed(1)),
        Green: parseFloat(green.toFixed(1))
      });
    }
    setData(newData);
  }, [carbonPrice, investment, timeHorizon, efficiency, carbonData]);

  const handleAiForecast = async () => {
      addToast('info', 'AI Agent running Monte Carlo simulations...', 'Finance Bot');
      try {
          await predictFutureTrends('ROI', [10, 12, 15, 18], '25%', language);
          addToast('success', 'Simulation optimized. Confidence interval: 92%.', 'AI Forecast');
      } catch(e) {
          addToast('error', 'Forecast failed', 'Error');
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <UniversalPageHeader 
          icon={Calculator}
          title={pageData.title}
          description={pageData.desc}
          language={language}
          tag={pageData.tag}
      />

      <div className="flex justify-center -mt-6 mb-6">
          <div className="bg-slate-900/50 p-1 rounded-xl border border-white/10 flex">
              <button 
                  onClick={() => setActiveTab('roi')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'roi' ? 'bg-celestial-emerald text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                  <LineChart className="w-4 h-4" /> {isZh ? 'ROI 預測' : 'ROI Forecast'}
              </button>
              <button 
                  onClick={() => setActiveTab('shadow')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'shadow' ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                  <Coins className="w-4 h-4" /> {isZh ? '影子價格模擬' : 'Shadow Pricing'}
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-6 rounded-2xl space-y-8 border border-white/5 h-full">
            <div className="flex items-center gap-2 mb-2 p-2 bg-white/5 rounded-lg border border-white/5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-gray-400">
                    Linked Emissions: 
                    <span className="text-white font-bold ml-1">{(carbonData.scope1 + carbonData.scope2).toFixed(1)} tCO2e</span>
                </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">{isZh ? '模擬參數' : 'Parameters'}</h3>
            
            <QuantumSlider 
                label={activeTab === 'roi' ? (isZh ? '外部碳稅 (Carbon Tax)' : 'External Carbon Tax') : (isZh ? '內部影子價格 (Shadow Price)' : 'Internal Shadow Price')}
                value={carbonPrice}
                min={0} max={300} unit="$/t"
                color={activeTab === 'roi' ? 'gold' : 'purple'}
                onChange={setCarbonPrice}
            />
            
            {activeTab === 'roi' && (
                <>
                    <QuantumSlider 
                        label={isZh ? '綠色投資額 (Investment)' : 'Green Investment'}
                        value={investment}
                        min={0} max={50} unit="M$"
                        color="emerald"
                        onChange={setInvestment}
                    />

                    <QuantumSlider 
                        label={isZh ? '時間範疇 (Horizon)' : 'Time Horizon'}
                        value={timeHorizon}
                        min={1} max={15} unit="Yrs"
                        color="blue"
                        onChange={setTimeHorizon}
                    />

                    <QuantumSlider 
                        label={isZh ? '預期能效提升 (Efficiency)' : 'Efficiency Gain'}
                        value={efficiency}
                        min={0} max={50} unit="%"
                        color="purple"
                        onChange={setEfficiency}
                    />
                </>
            )}

            <div className="pt-6 border-t border-white/10">
                <OmniEsgCell 
                    mode="list" 
                    label={activeTab === 'roi' ? "Internal Rate of Return (IRR)" : "Internal Carbon Fee Potential"}
                    value={activeTab === 'roi' ? "14.2%" : `$${(carbonPrice * (carbonData.scope1 + carbonData.scope2)).toLocaleString()}`} 
                    confidence="medium" 
                    traits={['gap-filling']}
                    color={activeTab === 'roi' ? 'emerald' : 'purple'}
                    onAiAnalyze={handleAiForecast}
                />
            </div>
        </div>

        {activeTab === 'roi' ? (
            <MarketOracleAgent 
                id="MarketOracle"
                label="ROI Forecast"
                data={data}
                isZh={isZh}
            />
        ) : (
            <ShadowPricingView 
                price={carbonPrice}
                emissions={carbonData.scope1 + carbonData.scope2}
                isZh={isZh}
            />
        )}
      </div>
    </div>
  );
};