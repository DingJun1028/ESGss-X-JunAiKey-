
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

// ----------------------------------------------------------------------
// Agent: Pipeline Node (The Nerve Endings)
// ----------------------------------------------------------------------
interface PipelineNodeProps extends InjectedProxyProps {
    id: string;
    pipe: any;
    index: number;
    total: number;
    isRefreshing: boolean;
}

const PipelineNodeBase: React.FC<PipelineNodeProps> = ({ 
    pipe, index, total, isRefreshing, adaptiveTraits, trackInteraction, isAgentActive 
}) => {
    // Agent Traits
    const isStressed = pipe.status === 'warning';
    const isEvolved = adaptiveTraits?.includes('evolution');
    const isLearning = adaptiveTraits?.includes('learning') || isAgentActive;

    // Report status to the Hive Mind on mount/change
    useEffect(() => {
        if (isStressed) {
            universalIntelligence.agentUpdate('Data Lake', { confidence: 'medium' }); // Stress the central hub
        }
    }, [isStressed]);

    return (
        <div 
            className={`absolute w-16 h-16 rounded-2xl border flex items-center justify-center backdrop-blur-md transition-all duration-500 cursor-pointer group
                ${isStressed 
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse' 
                    : 'bg-white/5 border-white/10 hover:border-celestial-blue/50'}
                ${isEvolved ? 'scale-110 ring-1 ring-celestial-blue/30' : ''}
            `}
            style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * (360/total)}deg) translate(140px) rotate(-${index * (360/total)}deg)`
            }}
            onClick={() => trackInteraction?.('click')}
        >
            {pipe.type === 'Server' && <Server className={`w-6 h-6 ${isStressed ? 'text-amber-400' : 'text-emerald-400'}`} />}
            {pipe.type === 'Wifi' && <Wifi className="w-6 h-6 text-purple-400" />}
            {pipe.type === 'Database' && <Database className="w-6 h-6 text-amber-400" />}
            {pipe.type === 'Network' && <Network className="w-6 h-6 text-blue-400" />}
            {pipe.type === 'Calendar' && <Calendar className="w-6 h-6 text-pink-400" />}
            {pipe.type === 'App' && <Box className="w-6 h-6 text-cyan-400" />}
            
            {/* Connection Line (Axon) */}
            <div 
            className={`absolute h-[1px] w-[100px] origin-left -z-10 transition-colors duration-500 ${isStressed ? 'bg-amber-500/50' : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'}`}
            style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${index * (360/total) + 180}deg) translate(30px)`,
                width: '110px'
            }}
            />
            
            {/* Moving Packet (Neurotransmitter) */}
            {!isRefreshing && (
                <div 
                className={`absolute w-2 h-2 rounded-full top-1/2 left-1/2 -z-10 animate-ping ${isStressed ? 'bg-amber-400' : 'bg-white'}`}
                style={{
                    animationDuration: isStressed ? '3s' : '2s',
                    animationDelay: `${index * 0.5}s`
                }}
                />
            )}

            {/* Label Tooltip */}
            <div className="absolute top-full mt-2 text-[9px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
                {pipe.name}
            </div>
        </div>
    );
};

const PipelineAgent = withUniversalProxy(PipelineNodeBase);

// ----------------------------------------------------------------------
// Agent: Central Hub (The Hypothalamus)
// ----------------------------------------------------------------------
interface CentralHubProps extends InjectedProxyProps {
    isRefreshing: boolean;
    onClick: () => void;
}

const CentralHubBase: React.FC<CentralHubProps> = ({ isRefreshing, onClick, adaptiveTraits, trackInteraction }) => {
    const isEvolved = adaptiveTraits?.includes('evolution');
    const isOptimizing = adaptiveTraits?.includes('optimization');

    return (
        <div 
            onClick={() => { onClick(); trackInteraction?.('click'); }}
            className={`relative z-10 w-24 h-24 rounded-full bg-celestial-blue/20 border-2 border-celestial-blue flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer hover:scale-105 transition-transform
                ${isRefreshing ? 'animate-spin' : isOptimizing ? 'animate-pulse' : ''}
            `}
        >
            <Database className="w-10 h-10 text-celestial-blue" />
            <div className={`absolute -bottom-8 text-xs font-bold text-celestial-blue whitespace-nowrap ${isRefreshing ? 'hidden' : 'block'}`}>
                {isEvolved ? 'Hive Mind' : 'Data Lake'}
            </div>
            {/* Core Glow */}
            <div className="absolute inset-0 bg-celestial-blue/30 blur-xl rounded-full animate-pulse" />
        </div>
    );
};

const CentralHubAgent = withUniversalProxy(CentralHubBase);


// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

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
      
      // Trigger Evolution in Universal Intelligence
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
    <div className="space-y-8 animate-fade-in pb-12">
      <UniversalPageHeader 
          icon={Network}
          title={pageData.title}
          description={pageData.desc}
          language={language}
          tag={pageData.tag}
      />

      <div className="flex justify-end -mt-16 mb-4 relative z-10">
        <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all disabled:opacity-50"
        >
            {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isZh ? '刷新神經元' : 'Refresh Neurons'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual Topology */}
          <div className="glass-panel p-8 rounded-2xl flex items-center justify-center relative min-h-[400px] overflow-hidden bg-slate-900/50 border border-white/10 group">
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
                      id={pipe.name} // Unique Agent ID
                      label={pipe.name}
                      pipe={pipe}
                      index={i}
                      total={pipelines.length}
                      isRefreshing={isRefreshing}
                  />
              ))}
          </div>

          {/* Pipeline List */}
          <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">{isZh ? '連接狀態' : 'Connection Status'}</h3>
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
              
              <div className="p-4 rounded-xl bg-celestial-purple/10 border border-celestial-purple/20 mt-6 flex items-start gap-3">
                  <div className="p-2 bg-celestial-purple/20 rounded-lg">
                      <Activity className="w-5 h-5 text-celestial-purple" />
                  </div>
                  <div>
                      <h4 className="text-sm font-bold text-white mb-1">{isZh ? '系統神經反射報告' : 'Neural Reflex Report'}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                          {isZh ? '集成中心運行穩定。Flowlu API 偶發延遲，已列入觀察名單。' : 'Integration Hub stable. Flowlu API showing sporadic latency, added to watch list.'}
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
