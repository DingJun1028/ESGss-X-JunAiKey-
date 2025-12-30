import React, { useState, useEffect, useRef } from 'react';
import { 
    Workflow, Zap, Play, Settings, Database, Terminal, 
    ArrowRight, Loader2, CheckCircle, Code, ShieldCheck,
    Cpu, Activity, RefreshCw, X, AlertTriangle, Globe,
    Network, ShieldAlert, Scan, FileSearch
} from 'lucide-react';
import { Language, McpRunActionOutput } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { runMcpAction } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';

type NodeMode = 'text_gen' | 'api_call' | 'agentic_flow' | 'ocr_extraction';

export const WorkflowLab: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  
  const [isRunning, setIsRunning] = useState(false);
  const [activeMode, setActiveMode] = useState<NodeMode>('text_gen');
  const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'success' | 'error' | 'warning' }[]>([]);
  const [result, setResult] = useState<any>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Hardcoded node configurations as requested
  const textGenNode = {
    id: "mcp_run_action_01",
    action: "text-generation",
    input_params: {
      prompt: "Write a product description for wireless headphones",
      max_length: 150
    }
  };

  const apiCallNode = {
    id: "api_call_01",
    action: "api_call",
    input_params: {
      url: "SIM_FAIL", // Forcing a failure to show retries in the demo
      method: "GET",
      timeout: 2,
      response_type: "json"
    }
  };

  const agenticFlowNode = {
      id: "agentic_flow_exec_01",
      action: "api_call",
      input_params: {
          url: "https://api.agenticflow.ai/workflows/execute",
          method: "POST",
          headers: {
              "Authorization": "Bearer AGENT_EYE_0x8B32_V16"
          },
          body: {
              workflow_id: "impact_manifest_v1",
              parameters: {
                  threshold: 0.85,
                  callback_url: "https://esgss.jak.ai/webhooks/impact"
              }
          },
          response_type: "json",
          timeout: 10
      }
  };

  const ocrNode = {
      id: "ocr_deepdoc_01",
      action: "ocr_extraction",
      input_params: {
          file_url: "https://assets.jak.ai/manifesto_v15.pdf"
      }
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString([], { hour12: false }), msg, type }]);
  };

  const handleExecute = async () => {
    setIsRunning(true);
    setResult(null);
    setLogs([]);
    
    const node = activeMode === 'text_gen' ? textGenNode : 
                 activeMode === 'api_call' ? apiCallNode : 
                 activeMode === 'agentic_flow' ? agenticFlowNode : ocrNode;
    
    addLog(`Initializing Workflow Kernel v1.2...`, "info");
    addLog(`Establishing handshake via Direct API connection...`, "info");
    addLog(`Resolving Connection Strategy: [Exponential_Backoff]`, "info");
    
    await new Promise(r => setTimeout(r, 800));
    addLog(`Executing Node: [${node.action}]`, "info");
    
    try {
        const output: McpRunActionOutput = await runMcpAction(
            node.action, 
            node.input_params, 
            language,
            (msg, type) => addLog(msg, type === 'warning' ? 'warning' : type === 'error' ? 'error' : 'info')
        );
        
        if (output.success) {
            addLog("Node execution sequence completed.", "success");
            setResult(output.result);
            addToast('success', isZh ? '工作流執行完成' : 'Workflow Executed', 'AgenticFlow');
        } else {
            addLog(`Node Terminal Error: ${output.error}`, "error");
            addToast('error', isZh ? '工作流中斷' : 'Workflow Interrupted', 'Critical');
        }
    } catch (e: any) {
        addLog(`Kernel Fault: ${e.message}`, "error");
    } finally {
        setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Workflow}
            title={{ zh: 'AgenticFlow 工作流實驗室', en: 'AgenticFlow Workflow Lab' }}
            description={{ zh: '節點式自動化：具備 OCR 提取、API 調用與超時處理的實裝', en: 'Node-based Automation: OCR extraction, API calls and timeout logic.' }}
            language={language}
            tag={{ zh: '工作流核心 v1.1', en: 'WF_CORE_V1.1' }}
        />

        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-fit backdrop-blur-xl mb-1 shrink-0 overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setActiveMode('text_gen')} 
                className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeMode === 'text_gen' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
                TEXT_GEN
            </button>
            <button 
                onClick={() => setActiveMode('api_call')} 
                className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeMode === 'api_call' ? 'bg-celestial-emerald text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
                RESILIENCE_TEST
            </button>
            <button 
                onClick={() => setActiveMode('agentic_flow')} 
                className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeMode === 'agentic_flow' ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
                AGENTIC_EXEC
            </button>
            <button 
                onClick={() => setActiveMode('ocr_extraction')} 
                className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeMode === 'ocr_extraction' ? 'bg-celestial-blue text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
                OCR_SCAN
            </button>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 min-h-0">
                <div className="flex-1 glass-bento bg-slate-950/80 border-white/5 relative overflow-hidden flex flex-col rounded-[3rem] shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                    
                    <div className="p-6 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl"><Activity className="w-4 h-4" /></div>
                            <span className="zh-main text-sm text-white uppercase tracking-widest">
                                Active_Canvas: {
                                    activeMode === 'agentic_flow' ? 'AgenticFlow_Post_Call' : 
                                    activeMode === 'ocr_extraction' ? 'DeepDoc_OCR_v1.0' : 
                                    activeMode === 'text_gen' ? 'MCP_Run_Action_v1.0' :
                                    'Resilience_Test_v1.2'
                                }
                            </span>
                        </div>
                        <button 
                            onClick={handleExecute}
                            disabled={isRunning}
                            className="px-8 py-2 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-30"
                        >
                            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                            RUN_WORKFLOW
                        </button>
                    </div>

                    <div className="flex-1 p-12 flex items-center justify-center relative overflow-hidden">
                        <div className="relative group">
                            <div className={`absolute -inset-1 bg-gradient-to-r ${
                                activeMode === 'agentic_flow' ? 'from-purple-500 to-indigo-500' : 
                                activeMode === 'ocr_extraction' ? 'from-blue-500 to-cyan-500' : 
                                'from-emerald-500 to-blue-500'
                            } rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200`}></div>
                            <div className="relative w-80 bg-slate-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            activeMode === 'text_gen' ? 'bg-celestial-blue/20 text-celestial-blue' : 
                                            activeMode === 'agentic_flow' ? 'bg-celestial-purple/20 text-celestial-purple' : 
                                            activeMode === 'ocr_extraction' ? 'bg-celestial-blue/20 text-celestial-blue' :
                                            'bg-emerald-500/20 text-emerald-400'
                                        }`}>
                                            {activeMode === 'text_gen' ? <Cpu className="w-5 h-5" /> : 
                                             activeMode === 'agentic_flow' ? <Network className="w-5 h-5" /> : 
                                             activeMode === 'ocr_extraction' ? <Scan className="w-5 h-5" /> :
                                             <Globe className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                                                {activeMode === 'agentic_flow' ? 'POST workflows/execute' : 
                                                 activeMode === 'text_gen' ? 'mcp_run_action' : 
                                                 activeMode === 'ocr_extraction' ? 'ocr_extraction' :
                                                 'api_call'}
                                            </div>
                                            <div className="text-sm font-bold text-white">
                                                {activeMode === 'agentic_flow' ? 'AgenticFlow Exec' : 
                                                 activeMode === 'text_gen' ? 'Text Generation' : 
                                                 activeMode === 'ocr_extraction' ? 'DeepDoc OCR' :
                                                 'Network Request'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-blue-500'}`} />
                                </div>
                                <div className="space-y-3">
                                    {activeMode === 'agentic_flow' ? (
                                        <>
                                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-1">
                                                <div className="text-[8px] text-gray-600 font-black uppercase">Headers</div>
                                                <div className="text-[9px] text-gray-400 font-mono">Authorization: Bearer ••••••</div>
                                            </div>
                                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-1">
                                                <div className="text-[8px] text-gray-600 font-black uppercase">Body (JSON)</div>
                                                <div className="text-[9px] text-emerald-400 font-mono">workflow_id: "impact_v1"</div>
                                            </div>
                                        </>
                                    ) : activeMode === 'ocr_extraction' ? (
                                        <>
                                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-1">
                                                <div className="text-[8px] text-gray-600 font-black uppercase">File_URL</div>
                                                <div className="text-[9px] text-blue-400 font-mono truncate">".../manifesto_v15.pdf"</div>
                                            </div>
                                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-1">
                                                <div className="text-[8px] text-gray-600 font-black uppercase">Vision_Core</div>
                                                <div className="text-[10px] text-emerald-400 font-mono">DeepDoc V3.1</div>
                                            </div>
                                        </>
                                    ) : activeMode === 'text_gen' ? (
                                        <>
                                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-1">
                                                <div className="text-[8px] text-gray-600 font-black uppercase">Prompt</div>
                                                <div className="text-[9px] text-white font-mono truncate">"Write product desc for wireless headphones"</div>
                                            </div>
                                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-1">
                                                <div className="text-[8px] text-gray-600 font-black uppercase">Max_Tokens</div>
                                                <div className="text-[10px] text-emerald-400 font-mono">150</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-1">
                                                <div className="text-[8px] text-gray-600 font-black uppercase">Endpoint</div>
                                                <div className="text-[10px] text-amber-400 font-mono truncate">"SIM_FAIL (Triggering Retries)"</div>
                                            </div>
                                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex justify-between items-center">
                                                <div>
                                                    <div className="text-[8px] text-gray-600 font-black uppercase">Retry_Policy</div>
                                                    <div className="text-[10px] text-gray-300">Exponential + Jitter</div>
                                                </div>
                                                <ShieldCheck className="w-4 h-4 text-emerald-500/40" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="text-[8px] font-mono text-gray-600">ID: {
                                        activeMode === 'text_gen' ? textGenNode.id : 
                                        activeMode === 'agentic_flow' ? agenticFlowNode.id : 
                                        activeMode === 'ocr_extraction' ? ocrNode.id :
                                        apiCallNode.id
                                    }</div>
                                    <Activity className="w-3.5 h-3.5 text-blue-500/40" />
                                </div>
                            </div>
                            
                            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent to-white/10" />
                            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-20 h-0.5 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>
                    </div>

                    {result && (
                        <div className="h-64 border-t border-white/5 bg-slate-900/60 p-8 flex flex-col gap-4 animate-slide-up">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Code className="w-4 h-4" /> Result_Payload
                                </h4>
                                <span className="text-[8px] font-mono text-emerald-500">TYPE: {typeof result === 'string' ? 'STRING' : 'JSON'}</span>
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar bg-black/40 rounded-2xl border border-white/5 p-6 text-gray-200 text-sm leading-relaxed font-light italic shadow-inner">
                                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                <div className="glass-bento p-6 flex flex-col bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl h-[450px] overflow-hidden shrink-0">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Terminal className="w-4 h-4" /> EXECUTION_CONSOLE</h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 font-mono text-[10px] pr-2">
                        {logs.length === 0 && <div className="text-gray-800 italic">Standby. Awaiting trigger signal...</div>}
                        {logs.map((l, i) => (
                            <div key={i} className={`flex gap-3 pb-1 border-b border-white/[0.02] ${l.type === 'error' ? 'text-rose-400 bg-rose-500/5' : l.type === 'warning' ? 'text-amber-400' : l.type === 'success' ? 'text-emerald-400' : 'text-gray-500'}`}>
                                <span className="shrink-0 opacity-40">[{l.time}]</span>
                                <span className="flex-1 flex items-center gap-2">
                                    {l.type === 'warning' && <AlertTriangle className="w-3 h-3" />}
                                    {l.msg}
                                </span>
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 bg-slate-900/40 border border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3"><Database className="w-4 h-4" /> NODE_SPECIFICATION</h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                            <div className="text-[9px] font-black text-blue-400 uppercase">Direct_API_Access</div>
                            <div className="text-[10px] text-gray-400 leading-relaxed">
                                Nodes are executed via the direct API connection method to ensure zero-latency handshakes and full context preservation.
                            </div>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                            <div className="text-[9px] font-black text-celestial-purple uppercase">AgenticFlow_Handshake</div>
                            <div className="text-[10px] text-gray-400 leading-relaxed">
                                Requires a valid JWT bearer token in the headers. Workflow triggers are asynchronous via the task queue.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};