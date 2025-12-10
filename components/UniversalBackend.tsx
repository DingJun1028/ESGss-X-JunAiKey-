
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Database, ShieldCheck, Zap, Activity, BrainCircuit, Code, Terminal, Play, Loader2, Sparkles, AlertTriangle, Layers, Lock, Unlock, Network, Box, RefreshCw, Send, CheckCircle, Cpu, GitMerge, Infinity as InfinityIcon } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { universalIntelligence } from '../services/evolutionEngine';
import { 
    BilingualMatrixEngine, 
    BridgingEngine, 
    QuantumEvolutionLoop, 
    SelfDefinitionField, 
    ZeroOneInfinityEngine,
    LifecycleStage
} from '../services/quantum-canon';

interface UniversalBackendProps {
  language: Language;
}

// ----------------------------------------------------------------------
// Agent: Core Node (Consciousness)
// ----------------------------------------------------------------------
interface CoreNodeProps extends InjectedProxyProps {
    isActive: boolean;
}

const CoreNodeBase: React.FC<CoreNodeProps> = ({ isActive, adaptiveTraits, isAgentActive }) => {
    return (
        <div className={`relative w-32 h-32 rounded-full flex items-center justify-center border-2 transition-all duration-1000
            ${isActive ? 'border-celestial-gold bg-celestial-gold/10 shadow-[0_0_50px_rgba(251,191,36,0.4)]' : 'border-slate-700 bg-slate-900'}
        `}>
            <div className={`absolute inset-0 rounded-full border border-celestial-gold/30 animate-[spin_10s_linear_infinite]`} />
            <div className={`absolute inset-4 rounded-full border border-celestial-gold/20 animate-[spin_5s_linear_infinite_reverse]`} />
            <BrainCircuit className={`w-12 h-12 ${isActive ? 'text-celestial-gold' : 'text-slate-600'} transition-colors duration-500`} />
            
            {/* Thinking Pulse */}
            {isAgentActive && (
                <div className="absolute inset-0 bg-celestial-gold/5 blur-xl rounded-full animate-pulse" />
            )}
        </div>
    );
};

const CoreNode = withUniversalProxy(CoreNodeBase);

// ----------------------------------------------------------------------
// Mock Data Generators for GenUI
// ----------------------------------------------------------------------
const generateMockUI = (command: string): any => {
    if (command.includes("table") || command.includes("users")) {
        return {
            type: "table",
            title: "Active Agents Registry",
            columns: ["ID", "Agent Name", "Status", "Last Active", "Tasks"],
            data: [
                { id: "ag-01", name: "Finance Bot", status: "Active", last: "2m ago", tasks: 12 },
                { id: "ag-02", name: "Compliance Guard", status: "Active", last: "1m ago", tasks: 45 },
                { id: "ag-03", name: "Report Writer", status: "Idle", last: "1h ago", tasks: 0 },
            ]
        };
    }
    if (command.includes("chart") || command.includes("carbon")) {
        return {
            type: "chart",
            title: "System Load vs Token Usage",
            metric: "78%",
            status: "Normal"
        };
    }
    return { type: "unknown", message: "Interface not defined in latent space." };
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const UniversalBackend: React.FC<UniversalBackendProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedUI, setGeneratedUI] = useState<any>(null);
  const [guardrailsEnabled, setGuardrailsEnabled] = useState(true);
  const [activeSchema, setActiveSchema] = useState('agent_manifest_v2.json');
  
  // Quantum Canon State
  const [lifecycleStage, setLifecycleStage] = useState<LifecycleStage>('One (MVP)');
  const [evolutionStatus, setEvolutionStatus] = useState('Stable');
  
  // Agents State
  const [agents, setAgents] = useState([
      { id: 'fin', name: 'Finance Agent', role: 'Worker', status: 'active', stress: 10 },
      { id: 'gov', name: 'Governance Guard', role: 'Safety', status: 'active', stress: 5 },
      { id: 'rpg', name: 'Report Generator', role: 'Worker', status: 'idle', stress: 0 },
  ]);

  // Simulate Canon Engines Running
  useEffect(() => {
      const interval = setInterval(() => {
          // Principle 9: Check Lifecycle
          const stage = ZeroOneInfinityEngine.determineStage(Math.floor(Math.random() * 1500), 500);
          setLifecycleStage(stage);

          // Principle 4: Check Evolution
          const evoLoop = new QuantumEvolutionLoop();
          setEvolutionStatus(evoLoop.checkEvolution(Math.floor(Math.random() * 200)));
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  const handleCommandSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!command.trim()) return;
      
      setIsProcessing(true);
      setGeneratedUI(null);
      
      // Principle 5: Self Definition
      const parsed = SelfDefinitionField.parseIntent(command);
      addToast('info', `Intent Parsed: ${parsed.intent} (${parsed.confidence * 100}%)`, 'Quantum Canon');

      // Simulate Chain of Thought
      setTimeout(() => {
          setIsProcessing(false);
          setGeneratedUI(generateMockUI(command.toLowerCase()));
          addToast('success', isZh ? '介面生成完畢' : 'Interface Generated', 'GenUI Engine');
      }, 1500);
  };

  const handleCircuitBreaker = (id: string) => {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'halted' : 'active' } : a));
      addToast('warning', isZh ? `代理狀態已切換: ${id}` : `Agent Toggled: ${id}`, 'Circuit Breaker');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 h-full flex flex-col">
        <div className="flex items-center gap-4 shrink-0">
            <div className="p-3 bg-celestial-gold/10 rounded-xl border border-celestial-gold/20">
                <Database className="w-8 h-8 text-celestial-gold" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    {isZh ? '萬能管理後臺專區' : 'Universal Management Backend Zone'}
                    <span className="text-xs px-2 py-1 bg-celestial-purple/20 text-celestial-purple border border-celestial-purple/30 rounded-full font-mono">GOD MODE</span>
                </h2>
                <p className="text-gray-400">{isZh ? '介面即服務：AI 驅動的自主治理控制平面' : 'Interface as a Service: AI-Driven Autonomous Control Plane'}</p>
            </div>
        </div>

        {/* --- Quantum Canon Status Panel --- */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-2xl border border-white/10 shrink-0">
            <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-3 h-3" /> Principle 1
                </div>
                <div className="font-bold text-white text-xs">Bilingual Matrix</div>
                <div className="text-[10px] text-emerald-400 font-mono">ACTIVE (ZH/EN)</div>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <GitMerge className="w-3 h-3" /> Principle 3
                </div>
                <div className="font-bold text-white text-xs">Bridging Engine</div>
                <div className="text-[10px] text-blue-400 font-mono">Legacy Adapters: ON</div>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" /> Principle 4
                </div>
                <div className="font-bold text-white text-xs">Evolution Loop</div>
                <div className="text-[10px] text-purple-400 font-mono">{evolutionStatus.toUpperCase()}</div>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <InfinityIcon className="w-3 h-3" /> Principle 9
                </div>
                <div className="font-bold text-white text-xs">0-1-Infinity</div>
                <div className="text-[10px] text-celestial-gold font-mono">{lifecycleStage}</div>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
            
            {/* Left Column: Governance & Schema (3 Cols) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                
                {/* Guardrails Panel */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        {isZh ? 'AI 護欄監控 (P6. Consistency)' : 'AI Guardrails (P6)'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-xs text-gray-300">PII Filtering</span>
                            <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${guardrailsEnabled ? 'bg-emerald-500' : 'bg-slate-600'}`} onClick={() => setGuardrailsEnabled(!guardrailsEnabled)}>
                                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${guardrailsEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-xs text-gray-300">Hallucination Check</span>
                            <div className="w-8 h-4 rounded-full bg-emerald-500 p-0.5 opacity-50 cursor-not-allowed">
                                <div className="w-3 h-3 bg-white rounded-full translate-x-4" />
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Intervention Rate</span>
                                <span className="text-emerald-400">0.4%</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[0.4%]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schema Registry */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Code className="w-4 h-4 text-celestial-blue" />
                        {isZh ? '數據契約 (P2. TypeScript)' : 'Schema Registry (P2)'}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                        <select 
                            value={activeSchema} 
                            onChange={(e) => setActiveSchema(e.target.value)}
                            className="bg-black/30 border border-white/10 rounded-lg text-xs text-gray-300 px-2 py-1 outline-none w-full"
                        >
                            <option value="agent_manifest_v2.json">agent_manifest_v2.json</option>
                            <option value="esg_report_schema_v1.avro">esg_report_schema_v1.avro</option>
                            <option value="ui_component_def.proto">ui_component_def.proto</option>
                        </select>
                    </div>

                    <div className="flex-1 bg-slate-950 rounded-xl p-4 overflow-y-auto custom-scrollbar border border-white/5 font-mono text-[10px] text-green-400 leading-relaxed">
                        {`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AgentManifest",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "capabilities": {
      "type": "array",
      "items": { "type": "string" }
    },
    "securityLevel": {
      "enum": ["low", "medium", "critical"]
    }
  },
  "required": ["id", "securityLevel"]
}`}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        Valid Contract (Consistent)
                    </div>
                </div>
            </div>

            {/* Center Column: Consciousness & Orchestrator (5 Cols) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                
                {/* Consciousness Core */}
                <div className="glass-panel p-8 rounded-2xl border border-celestial-gold/20 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-celestial-gold/5 via-slate-900/0 to-slate-900/0 pointer-events-none" />
                    
                    <CoreNode id="JunAiKey_Core" label="JunAiKey" isActive={isProcessing} />
                    
                    <div className="mt-8 grid grid-cols-3 gap-8 w-full">
                        {agents.map((agent, i) => (
                            <div key={agent.id} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => handleCircuitBreaker(agent.id)}>
                                <div className={`relative p-3 rounded-xl border transition-all duration-300 ${agent.status === 'active' ? 'bg-white/5 border-white/10 group-hover:border-white/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                    {agent.status === 'halted' && <Lock className="w-5 h-5 text-red-400 absolute -top-2 -right-2 bg-slate-900 rounded-full p-0.5 border border-red-500/50" />}
                                    <Layers className={`w-6 h-6 ${agent.status === 'active' ? 'text-celestial-blue' : 'text-red-400'}`} />
                                    
                                    {/* Connection Line to Core */}
                                    <div className={`absolute -top-12 left-1/2 w-[1px] h-12 -translate-x-1/2 -z-10 bg-gradient-to-b from-transparent to-white/20 group-hover:to-celestial-gold/50 transition-colors`} />
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-bold text-gray-300">{agent.name}</div>
                                    <div className="text-[10px] text-gray-500">{agent.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Intent Input */}
                <div className="glass-panel p-1 rounded-2xl border border-white/10 bg-slate-900/80">
                    <form onSubmit={handleCommandSubmit} className="relative flex items-center">
                        <div className="absolute left-4 text-celestial-purple animate-pulse">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder={isZh ? "P5. 輸入自然語言指令 (例如: Show User Table)..." : "P5. Enter intent (e.g., Show User Table)..."}
                            className="w-full bg-transparent border-none outline-none py-4 pl-12 pr-12 text-white placeholder-gray-500 font-medium"
                            disabled={isProcessing}
                        />
                        <button 
                            type="submit"
                            disabled={isProcessing || !command}
                            className="absolute right-2 p-2 bg-celestial-purple/20 hover:bg-celestial-purple/40 rounded-xl text-celestial-purple transition-all disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                </div>

                {/* Processing Log (CoT) */}
                {isProcessing && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-celestial-purple space-y-1 animate-fade-in">
                        <div>> Analyzing intent (SelfDefinitionField)...</div>
                        <div className="text-celestial-blue">> Decomposing tasks: [FetchData, GenerateUI, ValidateSchema]...</div>
                        <div className="text-emerald-400">> Routing to Agent: UI_Architect...</div>
                        <div className="animate-pulse">> Generating Component Tree...</div>
                    </div>
                )}
            </div>

            {/* Right Column: GenUI Canvas (4 Cols) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col h-full min-h-[500px]">
                <div className="glass-panel rounded-2xl border border-dashed border-white/20 bg-slate-900/50 flex-1 flex flex-col overflow-hidden relative">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Box className="w-4 h-4 text-celestial-purple" />
                            GenUI Canvas (P7. Simple & Fast)
                        </h3>
                        <span className="text-[9px] px-2 py-1 bg-white/10 rounded text-gray-400">Read-Only Preview</span>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex items-center justify-center">
                        {!generatedUI && !isProcessing && (
                            <div className="text-center text-gray-600">
                                <Terminal className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-xs">Waiting for agent output...</p>
                            </div>
                        )}

                        {generatedUI && generatedUI.type === 'table' && (
                            <div className="w-full animate-fade-in">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-white">{generatedUI.title}</h4>
                                    <button className="text-xs text-celestial-blue hover:underline">Export CSV</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-gray-400">
                                                {generatedUI.columns.map((col: string) => <th key={col} className="p-2">{col}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            {generatedUI.data.map((row: any, i: number) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="p-2 font-mono">{row.id}</td>
                                                    <td className="p-2">{row.name}</td>
                                                    <td className="p-2"><span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">{row.status}</span></td>
                                                    <td className="p-2 text-gray-500">{row.last}</td>
                                                    <td className="p-2">{row.tasks}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* HITL Feedback */}
                                <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-2">
                                    <button className="px-3 py-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">Reject</button>
                                    <button className="px-3 py-1.5 text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20">Approve View</button>
                                </div>
                            </div>
                        )}

                        {generatedUI && generatedUI.type === 'chart' && (
                            <div className="w-full animate-fade-in text-center">
                                <Activity className="w-16 h-16 text-celestial-purple mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-white mb-2">{generatedUI.title}</h4>
                                <div className="text-3xl font-mono text-emerald-400 font-bold mb-1">{generatedUI.metric}</div>
                                <div className="text-xs text-gray-500">System Status: {generatedUI.status}</div>
                            </div>
                        )}
                        
                        {generatedUI && generatedUI.type === 'unknown' && (
                            <div className="text-center text-amber-400 text-xs flex flex-col items-center gap-2">
                                <AlertTriangle className="w-6 h-6" />
                                {generatedUI.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};
