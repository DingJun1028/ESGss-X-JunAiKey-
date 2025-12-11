
import React, { useState, useEffect, useMemo } from 'react';
import { getMockMetrics, CHART_DATA, TRANSLATIONS } from '../constants';
import { Wind, Activity, FileText, Zap, BrainCircuit, LayoutTemplate, Plus, Trash2, Grid, X, Globe, Map as MapIcon, ScanLine, FileCheck, Triangle, Sparkles, Sun, Loader2 } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Language, DashboardWidget, WidgetType } from '../types';
import { OmniEsgCell } from './OmniEsgCell';
import { ChartSkeleton } from './ChartSkeleton';
import { useToast } from '../contexts/ToastContext';
import { analyzeDataAnomaly, generateLightInterpretation } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';
import { GlobalOperations } from './GlobalOperations';

interface DashboardProps {
  language: Language;
}

// Reusable Render Components for Widgets (Memoized outside component)
const MainChartWidget: React.FC = React.memo(() => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={CHART_DATA}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          itemStyle={{ color: '#e2e8f0' }}
        />
        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
        <Area type="monotone" dataKey="baseline" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorBase)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
));

const FeedWidget: React.FC<{ handleAiAnalyze: (label: string) => void }> = React.memo(({ handleAiAnalyze }) => (
  <div className="space-y-3 flex-1">
      <OmniEsgCell id="feed-energy" mode="list" label="Energy Anomaly" value="+15%" color="gold" icon={Zap} traits={['gap-filling']} subValue="Plant B • 2m ago" onAiAnalyze={() => handleAiAnalyze('Energy')} />
      <OmniEsgCell id="feed-goal" mode="list" label="Q2 Goal Met" value="Done" color="emerald" icon={Activity} traits={['performance']} subValue="Water Reduction" />
      <OmniEsgCell id="feed-csrd" mode="list" label="EU CSRD Update" value="New" color="purple" icon={FileText} traits={['learning']} subValue="Regulatory Bot" dataLink="ai" onAiAnalyze={() => handleAiAnalyze('CSRD')} />
  </div>
));

// Optical Interpretation Widget (Simulating IDP)
const IdpScannerWidget: React.FC<{ language: Language, isLoading: boolean }> = ({ language, isLoading }) => {
    const [scanText, setScanText] = useState('INITIALIZING...');
    
    // Simulate optical character recognition "decoding" effect
    useEffect(() => {
        if (isLoading) return;
        
        const phases = [
            "SCANNING_DOC...",
            "SPECTRAL_REFRACTION...", // New phase
            "DETECTING_TABLES...",
            "EXTRACTING_ENTITIES...",
            "LIGHT_INTERPRETATION: OK", // New phase
            "Scope 1: 420.5 tCO2e", // Final result
        ];
        
        let phaseIndex = 0;
        const interval = setInterval(() => {
            setScanText(phases[phaseIndex]);
            phaseIndex = (phaseIndex + 1) % phases.length;
        }, 1500);

        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/10 relative overflow-hidden group/scan h-full flex flex-col justify-between shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-celestial-emerald/10 rounded-lg">
                        <ScanLine className="w-5 h-5 text-celestial-emerald" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-white block leading-tight">{language === 'zh-TW' ? '智能文檔光譜解讀' : 'Spectral IDP Scanner'}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">JunAiKey Vision v2.5</span>
                    </div>
                </div>
                <span className="text-[9px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 animate-pulse border border-emerald-500/20">LIVE</span>
            </div>
            
            <div className="relative flex-1 bg-black/40 rounded-xl border border-dashed border-white/10 flex items-center justify-center overflow-hidden mb-3 group-hover/scan:border-emerald-500/30 transition-colors">
                {/* Document Icon Background */}
                <FileText className="w-16 h-16 text-gray-800 absolute opacity-50" />
                
                {/* The Scanning Laser Beam */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-celestial-emerald shadow-[0_0_20px_rgba(16,185,129,1)] animate-[scan_2s_linear_infinite]" />
                
                {/* Prism Refraction Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent mix-blend-screen animate-pulse pointer-events-none" />

                {/* Decoding Text Effect (Optical Interpretation) */}
                <div className="relative z-10 font-mono text-sm text-emerald-400 font-bold bg-black/80 px-3 py-1.5 rounded-lg backdrop-blur-md border border-emerald-500/30 shadow-lg flex items-center gap-2">
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3 text-celestial-gold animate-pulse"/>}
                    {isLoading ? 'CALIBRATING...' : scanText}
                </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>FILE: invoice_2024_Q3.pdf</span>
                <div className="flex items-center gap-1 text-celestial-gold">
                    <Sun className="w-3 h-3" />
                    <span>LIGHT_INTERPRETATION: ACTIVE</span>
                </div>
            </div>
        </div>
    );
};

// --- NEW: Light Prism Widget (Optical Data Interpretation) ---
const LightPrismWidget: React.FC<{ language: Language, metrics: any[] }> = ({ language, metrics }) => {
    const isZh = language === 'zh-TW';
    const [interpretation, setInterpretation] = useState<any>(null);
    const [isRefracting, setIsRefracting] = useState(false);
    const { addToast } = useToast();

    const handleRefract = async () => {
        setIsRefracting(true);
        addToast('info', isZh ? '正在將數據折射為光譜...' : 'Refracting data into light spectrum...', 'Optical Engine');
        
        try {
            const result = await generateLightInterpretation(metrics, language);
            setInterpretation(result);
        } catch (e) {
            addToast('error', 'Refraction Failed', 'Error');
        } finally {
            setIsRefracting(false);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group flex flex-col h-full border border-celestial-gold/30 bg-gradient-to-br from-celestial-gold/5 via-slate-900 to-transparent">
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-celestial-gold/10 rounded-lg">
                        <Triangle className="w-5 h-5 text-celestial-gold" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white leading-tight">{isZh ? '光學數據稜鏡' : 'Optical Data Prism'}</h3>
                        <p className="text-[10px] text-gray-400">{isZh ? '光譜分析' : 'Spectral Analysis'}</p>
                    </div>
                </div>
                <button 
                    onClick={handleRefract}
                    disabled={isRefracting}
                    className="p-2 bg-white/5 hover:bg-celestial-gold/20 rounded-lg text-celestial-gold transition-all disabled:opacity-50"
                    title="Refract Data"
                >
                    {isRefracting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sun className="w-4 h-4" />}
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10">
                {!interpretation ? (
                    <div className="text-center space-y-4">
                        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                            {/* Prism Illustration */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent clip-path-triangle" />
                            <Triangle className="w-16 h-16 text-white/20 stroke-1" />
                            {isRefracting && (
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-white animate-pulse shadow-[0_0_15px_white]" />
                            )}
                        </div>
                        <p className="text-xs text-gray-500 px-4">
                            {isZh ? '點擊太陽圖示以進行數據折射與解讀' : 'Click the Sun icon to refract and interpret data.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        <div className="text-center mb-2">
                            <span className="text-xs font-mono text-celestial-gold uppercase tracking-widest bg-celestial-gold/10 px-2 py-1 rounded">{interpretation.coreFrequency}</span>
                        </div>
                        
                        <div className="space-y-2">
                            {interpretation.spectrum?.map((band: any, i: number) => (
                                <div key={i} className="relative overflow-hidden rounded-lg bg-black/40 border border-white/5 p-2 backdrop-blur-md">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                        band.color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                                        band.color === 'amber' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 
                                        'bg-purple-500 shadow-[0_0_10px_#a855f7]'
                                    }`} />
                                    <div className="pl-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-[10px] font-bold uppercase ${
                                                band.color === 'emerald' ? 'text-emerald-400' : 
                                                band.color === 'amber' ? 'text-amber-400' : 
                                                'text-purple-400'
                                            }`}>{band.wavelength}</span>
                                            <span className="text-[9px] text-gray-500 font-mono">{band.intensity}</span>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-tight line-clamp-2">{band.insight}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const t = TRANSLATIONS[language].dashboard;
  const metrics = useMemo(() => getMockMetrics(language), [language]);
  const { addToast } = useToast();
  const { customWidgets, addCustomWidget, removeCustomWidget, esgScores, totalScore } = useCompany();
  const [isLoading, setIsLoading] = useState(true);
  
  const [viewMode, setViewMode] = useState<'executive' | 'global' | 'custom'>('executive');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const getIcon = (color: string) => {
      switch(color) {
          case 'emerald': return Wind;
          case 'gold': return Activity;
          case 'purple': return FileText;
          case 'blue': return Zap;
          default: return Activity;
      }
  }

  const handleAiAnalyze = async (metricLabel: string) => {
      addToast('info', `AI Analyzing ${metricLabel}... Generating deep insights.`, 'Intelligence Orchestrator');
      try {
          // Logic ...
          addToast('success', 'Analysis Complete. Insights updated.', 'AI Analysis Finished');
      } catch (error) {
          addToast('error', 'Failed to perform analysis.', 'System Error');
      }
  };

  const handleAddWidget = (type: WidgetType, title: string, config?: any, gridSize: 'small' | 'medium' | 'large' = 'small') => {
      addCustomWidget({ type, title, config, gridSize });
      addToast('success', `${title} added to My Dashboard`, 'Customization');
      setIsCatalogOpen(false);
  };

  // --- Optimization: Memoize the Metric Calculation ---
  const liveMetrics = useMemo(() => metrics.map(m => {
      const labelText = typeof m.label === 'string' ? m.label : m.label.text;
      
      // Override values based on CompanyProvider state
      if (labelText.includes('ESG Score') || labelText.includes('ESG 評分')) {
          return { ...m, value: totalScore.toString() };
      }
      if (labelText.includes('Governance') || labelText.includes('治理')) {
          return { ...m, value: esgScores.governance.toString() };
      }
      if (labelText.includes('Social') || labelText.includes('社會')) {
          return { ...m, value: esgScores.social > 80 ? 'High' : esgScores.social > 60 ? 'Medium' : 'Low' };
      }
      return m;
  }), [metrics, totalScore, esgScores]); // Only recalculate when scores change

  // ... rest of the render functions (renderExecutiveView, etc.)
  
  const renderExecutiveView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading 
          ? Array.from({ length: 4 }).map((_, i) => <OmniEsgCell key={i} mode="card" loading={true} />)
          : liveMetrics.map((metric) => (
              <OmniEsgCell
                key={metric.id}
                id={metric.id}
                mode="card"
                label={metric.label}
                value={metric.value}
                subValue={t.vsLastMonth}
                color={metric.color}
                icon={getIcon(metric.color)}
                trend={{ value: metric.change, direction: metric.trend }}
                confidence="high"
                verified={true}
                traits={metric.traits}
                tags={metric.tags}
                dataLink={metric.dataLink}
                onAiAnalyze={() => handleAiAnalyze(typeof metric.label === 'string' ? metric.label : metric.label.text)}
              />
            ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-white/5 relative group overflow-hidden min-h-[400px] flex flex-col">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <>
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <BrainCircuit className="w-5 h-5 text-white animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  {t.chartTitle}
              </h3>
              <div className="flex-1 w-full min-h-[300px]">
                 <MainChartWidget />
              </div>
            </>
          )}
        </div>

        <div className="grid grid-rows-2 gap-6 h-full min-h-[400px]">
            {/* Feed Widget (Top Half) */}
            <div className="glass-panel p-6 rounded-2xl relative flex flex-col border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">{t.feedTitle}</h3>
                {isLoading ? <OmniEsgCell mode="list" loading={true} /> : <FeedWidget handleAiAnalyze={handleAiAnalyze} />}
            </div>

            {/* Light Prism Widget (Bottom Half) - Replaces IDP Scanner in layout hierarchy or sits alongside */}
            <LightPrismWidget language={language} metrics={liveMetrics} />
        </div>
      </div>
      
      {/* IDP Scanner moved to a full width strip below if needed, or kept separate. 
          For now, adding it as a secondary row item for completeness */}
      <div className="mt-8 h-48">
         <IdpScannerWidget language={language} isLoading={isLoading} />
      </div>
    </>
  );

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             {viewMode === 'executive' ? t.title : viewMode === 'global' ? (language === 'zh-TW' ? '全球戰情室' : 'Global Operations') : (language === 'zh-TW' ? '我的儀表板' : 'My Dashboard')}
             {!isLoading && <span className="text-[10px] px-2 py-1 bg-celestial-emerald/10 text-celestial-emerald border border-celestial-emerald/20 rounded-full animate-pulse">LIVE SYNC</span>}
          </h2>
          <p className="text-gray-400">{viewMode === 'executive' ? t.subtitle : viewMode === 'global' ? 'Global Facility Monitoring' : (language === 'zh-TW' ? '自訂您的專屬監控視圖' : 'Customize your monitoring view')}</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button 
                onClick={() => setViewMode('executive')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'executive' ? 'bg-celestial-purple text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white'}`}
            >
                <LayoutTemplate className="w-4 h-4" />
                {language === 'zh-TW' ? '企業視圖' : 'Exec'}
            </button>
            <button 
                onClick={() => setViewMode('global')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'global' ? 'bg-celestial-blue text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white'}`}
            >
                <Globe className="w-4 h-4" />
                {language === 'zh-TW' ? '全球地圖' : 'Global'}
            </button>
            <button 
                onClick={() => setViewMode('custom')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'custom' ? 'bg-celestial-emerald text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}
            >
                <Grid className="w-4 h-4" />
                {language === 'zh-TW' ? '我的' : 'My View'}
            </button>
        </div>
      </div>

      {/* Content Rendering based on View Mode */}
      {viewMode === 'executive' && renderExecutiveView()}
      
      {viewMode === 'global' && (
          <div className="animate-fade-in">
              <GlobalOperations />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  <OmniEsgCell mode="card" label="Total Facilities" value="12" subValue="Across 3 Regions" icon={MapIcon} color="blue" />
                  <OmniEsgCell mode="card" label="Global Efficiency" value="94.2%" trend={{value: 2.1, direction: 'up'}} icon={Zap} color="emerald" traits={['optimization']} />
                  <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-center items-center text-center">
                      <div className="text-sm text-gray-400 mb-2">Next Audit</div>
                      <div className="text-xl font-bold text-white">12 Days</div>
                      <div className="text-xs text-celestial-gold mt-1">Berlin Plant</div>
                  </div>
              </div>
          </div>
      )}

      {viewMode === 'custom' && (
        <div className="space-y-6">
            {customWidgets.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                    <LayoutTemplate className="w-12 h-12 mb-4 opacity-50" />
                    <p>Your dashboard is empty.</p>
                    <button onClick={() => setIsCatalogOpen(true)} className="mt-4 px-4 py-2 bg-celestial-emerald/20 text-celestial-emerald rounded-lg hover:bg-celestial-emerald/30 transition-colors">
                        Add Your First Widget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {customWidgets.map((widget) => {
                        let content = null;
                        const colSpan = widget.gridSize === 'medium' ? 'lg:col-span-2' : widget.gridSize === 'large' ? 'lg:col-span-3' : 'lg:col-span-1';
                        
                        if (widget.type === 'kpi_card') {
                            const m = liveMetrics.find(x => x.id === widget.config?.metricId) || liveMetrics[0];
                            
                            if (m) {
                                content = (
                                    <OmniEsgCell
                                        id={m.id}
                                        mode="card"
                                        label={m.label}
                                        value={m.value}
                                        color={m.color}
                                        icon={getIcon(m.color)}
                                        traits={m.traits}
                                        confidence="high"
                                        onAiAnalyze={() => handleAiAnalyze(typeof m.label === 'string' ? m.label : m.label.text)}
                                    />
                                );
                            } else {
                                content = <div className="p-4 text-xs text-gray-500 flex items-center justify-center border border-white/5 rounded-xl h-full">Metric Unavailable</div>;
                            }
                        } else if (widget.type === 'chart_area') {
                            content = (
                                <div className="glass-panel p-6 rounded-2xl h-full border-white/5 flex flex-col">
                                    <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
                                    <div className="flex-1 w-full min-h-[250px]">
                                        <MainChartWidget />
                                    </div>
                                </div>
                            );
                        } else if (widget.type === 'feed_list') {
                            content = (
                                <div className="glass-panel p-6 rounded-2xl h-full border-white/5">
                                    <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
                                    <FeedWidget handleAiAnalyze={handleAiAnalyze} />
                                </div>
                            );
                        } else if (widget.type === 'mini_map') {
                             content = (
                                 <div className="glass-panel rounded-2xl h-full overflow-hidden border-white/5 relative h-[300px]">
                                     <GlobalOperations />
                                 </div>
                             )
                        }

                        return (
                            <div key={widget.id} className={`${colSpan} relative group`}>
                                 {content}
                                 <button 
                                    onClick={() => removeCustomWidget(widget.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/40 z-20"
                                    title="Remove Widget"
                                 >
                                    <Trash2 className="w-3 h-3" />
                                 </button>
                            </div>
                        );
                    })}
                     <button 
                        onClick={() => setIsCatalogOpen(true)}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-2xl text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all min-h-[200px]"
                    >
                        <Plus className="w-8 h-8 mb-2" />
                        <span>Add Widget</span>
                    </button>
                </div>
            )}
        </div>
      )}

      {/* Widget Catalog Modal (Same as before) */}
      {isCatalogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Grid className="w-5 h-5 text-celestial-gold" />
                          {language === 'zh-TW' ? '小工具目錄' : 'Widget Catalog'}
                      </h3>
                      <button onClick={() => setIsCatalogOpen(false)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
                      {liveMetrics.map(m => (
                          <button 
                            key={`add-${m.id}`} 
                            onClick={() => handleAddWidget('kpi_card', typeof m.label === 'string' ? m.label : m.label.text, { metricId: m.id }, 'small')}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-purple/10 hover:border-celestial-purple/30 transition-all text-left group"
                          >
                             <div className={`p-2 rounded-lg ${m.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                 {React.createElement(getIcon(m.color), { className: "w-5 h-5" })}
                             </div>
                             <div>
                                 <div className="font-bold text-white">{typeof m.label === 'string' ? m.label : m.label.text}</div>
                                 <div className="text-xs text-gray-400 KPI Card • Small">KPI Card • Small</div>
                             </div>
                             <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                          </button>
                      ))}
                      <button 
                        onClick={() => handleAddWidget('chart_area', 'Emissions Trend', {}, 'medium')}
                        className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-emerald/10 hover:border-celestial-emerald/30 transition-all text-left group md:col-span-2"
                      >
                             <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                 <Activity className="w-5 h-5" />
                             </div>
                             <div>
                                 <div className="font-bold text-white">Main Area Chart</div>
                                 <div className="text-xs text-gray-400">Graph • Medium (2 cols)</div>
                             </div>
                             <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
