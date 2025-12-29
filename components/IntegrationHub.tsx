
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Network, Database, Server, Wifi, RefreshCw, CheckCircle, Activity, Loader2, Zap, Calendar, Box, Layers } from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { universalIntelligence } from '../services/evolutionEngine';
import { UniversalPageHeader } from './UniversalPageHeader';

interface IntegrationHubProps {
  language: Language;
}

/* Added: Defined CentralHubAgent component */
interface CentralHubProps extends InjectedProxyProps {
    isRefreshing: boolean;
    onClick: () => void;
}

const CentralHubBase: React.FC<CentralHubProps> = ({ isRefreshing, onClick, adaptiveTraits, isAgentActive, trackInteraction }) => {
    return (
        <div 
            onClick={() => { onClick(); trackInteraction?.('click'); }}
            className={`relative z-10 w-24 h-24 rounded-full bg-slate-950 border-2 flex items-center justify-center cursor-pointer transition-all duration-700
                ${isRefreshing ? 'border-celestial-emerald scale-110 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'border-white/20 hover:border-white/40'}
                ${isAgentActive ? 'shadow-[0_0_20px_rgba(139,92,246,0.3)]' : ''}
            `}
        >
            <div className={`absolute inset-0 rounded-full border border-dashed border-celestial-blue/30 animate-[spin_10s_linear_infinite] ${isRefreshing ? 'opacity-100' : 'opacity-0'}`} />
            <Database className={`w-8 h-8 ${isRefreshing ? 'text-celestial-emerald animate-pulse' : 'text-white'}`} />
            <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enterprise Data Lake</div>
        </div>
    );
};

const CentralHubAgent = withUniversalProxy(CentralHubBase);

/* Added: Defined PipelineAgent component */
interface PipelineAgentProps extends InjectedProxyProps {
    pipe: any;
    index: number;
    total: number;
    isRefreshing: boolean;
}

const PipelineAgentBase: React.FC<PipelineAgentProps> = ({ pipe, index, total, isRefreshing, adaptiveTraits, isAgentActive, trackInteraction }) => {
    const angle = (index / total) * 360;
    const radius = 140;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    const Icons = { Wifi, Database, Calendar, Server, Network, Box };
    const Icon = (Icons as any)[pipe.type] || Server;

    return (
        <div 
            className="absolute transition-all duration-1000"
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            <div 
                className={`w-12 h-12 rounded-xl bg-slate-900 border flex items-center justify-center relative group/pipe cursor-help
                    ${pipe.status === 'active' ? 'border-white/10' : 'border-amber-500/50 bg-amber-500/5'}
                    ${isRefreshing ? 'animate-bounce' : ''}
                `}
                onMouseEnter={() => trackInteraction?.('hover')}
            >
                <Icon className={`w-5 h-5 ${pipe.status === 'active' ? 'text-gray-400 group-hover/pipe:text-white' : 'text-amber-400'}`} />
                
                {/* Connector Line */}
                <div 
                    className={`absolute origin-left h-[1px] bg-gradient-to-r from-white/10 to-transparent pointer-events-none transition-all duration-700
                        ${isRefreshing ? 'opacity-100 from-celestial-emerald/40' : 'opacity-0'}
                    `}
                    style={{ 
                        width: `${radius}px`, 
                        left: '50%', 
                        top: '50%', 
                        transform: `rotate(${angle + 180}deg)` 
                    }} 
                />
            </div>
        </div>
    );
};

const PipelineAgent = withUniversalProxy(PipelineAgentBase);

export const IntegrationHub: React.FC<IntegrationHubProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { addAuditLog } = useCompany();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pageData = {
      title: { zh: '集成中樞', en: 'Integration Hub' },
      desc: { zh: '整合 Blue CC, Flowlu, Google/Apple Calendar', en: 'Unifying Blue CC, Flowlu, Google/Apple Calendar' },
      tag: { zh: '連結核心', en: 'Nexus Core' }
  };

  const [pipelines, setPipelines] = useState([
    { id: 'pipe-1', name: 'Blue CC (ERP)', status: 'active', latency: '45ms', throughput: '1.2 GB/h', type: 'Database' },
    { id: 'pipe-2', name: 'Siemens IoT', status: 'active', latency: '12ms', throughput: '500 MB/h', type: 'Wifi' },
    { id: 'pipe-3', name: 'Google Calendar', status: 'active', latency: '200ms', throughput: 'Sync', type: 'Calendar' },
    { id: 'pipe-4', name: 'Scope 3 API', status: 'active', latency: '80ms', throughput: '50 MB/h', type: 'Network' },
    { id: 'pipe-5', name: 'Flowlu CRM', status: 'warning', latency: '350ms', throughput: 'Check', type: 'App' },
    { id: 'pipe-6', name: 'Apple iCloud', status: 'active', latency: '60ms', throughput: 'Sync', type: 'Calendar' },
  ]);

  const handleRefresh = () => {
      setIsRefreshing(true);
      addToast('info', isZh ? '正在同步所有外部連接器...' : 'Synchronizing all external connectors...', 'Integration Hub');
      
      universalIntelligence.agentUpdate('Data Lake', { 
          traits: ['optimization', 'performance'], 
          confidence: 'high' 
      });

      setTimeout(() => {
          setIsRefreshing(false);
          setPipelines(prev => prev.map(p => 
              p.id === 'pipe-5' ? { ...p, status: 'active', latency: '45ms' } : p
          ));
          addAuditLog('System Integration', 'Manual ETL Synchronization Triggered. All pipelines healthy.');
          addToast('success', isZh ? '同步完成。Flowlu 連接已修復。' : 'Sync Complete. Flowlu connection fixed.', 'System');
      }, 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in overflow-hidden">
      <div className="shrink-0">
          <UniversalPageHeader 
              icon={Network}
              title={pageData.title}
              description={pageData.desc}
              language={language}
              tag={pageData.tag}
          />
      </div>

      <div className="flex justify-end -mt-16 mb-2 relative z-10 shrink-0">
        <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all disabled:opacity-50"
        >
            {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isZh ? '刷新神經元' : 'Refresh Neurons'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
          {/* Visual Topology - Responsive Height */}
          <div className="glass-panel p-4 rounded-2xl flex items-center justify-center relative overflow-hidden bg-slate-900/50 border border-white/10 group h-full">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-celestial-blue/10 via-slate-900/0 to-slate-900/0 pointer-events-none" />
              
              {/* Central Agent */}
              <CentralHubAgent 
                  id="Data Lake" 
                  label="Data Lake" 
                  isRefreshing={isRefreshing} 
                  onClick={handleRefresh} 
              />

              {/* Satellite Agents */}
              {pipelines.map((pipe, i) => (
                  <PipelineAgent 
                      key={pipe.id}
                      id={pipe.name} 
                      label={pipe.name}
                      pipe={pipe}
                      index={i}
                      total={pipelines.length}
                      isRefreshing={isRefreshing}
                  />
              ))}
          </div>

          {/* Pipeline List - Scrollable */}
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
              <h3 className="text-lg font-semibold text-white mb-2 shrink-0">{isZh ? '連接狀態' : 'Connection Status'}</h3>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                  {pipelines.map((pipe) => (
                      <OmniEsgCell 
                        key={pipe.id}
                        id={`cell-${pipe.id}`}
                        mode="list"
                        label={pipe.name}
                        value={pipe.status === 'active' ? 'Running' : 'Warning'}
                        subValue={`Latency: ${pipe.latency} • ${pipe.throughput}`}
                        color={pipe.status === 'active' ? 'emerald' : 'gold'}
                        icon={pipe.type === 'Wifi' ? Wifi : pipe.type === 'Database' ? Database : pipe.type === 'Calendar' ? Calendar : Server}
                        confidence={pipe.status === 'active' ? 'high' : 'medium'}
                        verified={true}
                        traits={pipe.status === 'active' ? ['seamless', 'bridging'] : ['gap-filling']}
                      />
                  ))}
              </div>
              
              <div className="p-3 rounded-xl bg-celestial-purple/10 border border-celestial-purple/20 mt-4 flex items-start gap-3 shrink-0">
                  <div className="p-2 bg-celestial-purple/20 rounded-lg">
                      <Activity className="w-4 h-4 text-celestial-purple" />
                  </div>
                  <div>
                      <h4 aria-label="Section Title" className="text-xs font-bold text-white mb-1">{isZh ? '系統神經反射報告' : 'Neural Reflex Report'}</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                          {isZh ? '集成中心運行穩定。Flowlu API 偶發延遲，已列入觀察名單。' : 'Integration Hub stable. Flowlu API showing sporadic latency, added to watch list.'}
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
