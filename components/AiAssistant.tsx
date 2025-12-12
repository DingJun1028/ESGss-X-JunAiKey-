
import React, { useState, useRef, useEffect } from 'react';
import { 
    Bot, X, Send, Sparkles, BrainCircuit, Search, MessageSquare, 
    Zap, AlertTriangle, ArrowRight, Grid, User, Crown, Terminal,
    Command, Calendar, Bookmark, Loader2, MoreVertical, Trash2, Archive, Download, Activity, FileText, CheckSquare, Plus, Navigation
} from 'lucide-react';
import { ChatMessage, Language, View, MCPPrompt } from '../types';
import { streamChat } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent, AvatarFace } from '../contexts/UniversalAgentContext';
import { universalIntelligence } from '../services/evolutionEngine';
import GenerativeUIRenderer from './GenerativeUIRenderer';

interface AiAssistantProps {
  language: Language;
  onNavigate?: (view: View) => void;
  currentView?: View;
}

const AVATAR_CONFIG = {
    MIRROR: { 
        label: { en: 'Mirror', zh: '鏡之相' }, 
        desc: { en: 'High Context & Reflection', zh: '上下文記憶與反思' },
        color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: User 
    },
    EXPERT: { 
        label: { en: 'Expert', zh: '相之相' }, 
        desc: { en: 'Reasoning & Domain Knowledge', zh: '深度推理與專業知識' },
        color: 'text-celestial-gold', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: Crown 
    },
    VOID: { 
        label: { en: 'Void', zh: '無之相' }, 
        desc: { en: 'Execution & Tools', zh: '代碼執行與工具調用' },
        color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: Terminal 
    }
};

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate, currentView }) => {
  const { 
      activeFace, setActiveFace, 
      chatHistory, systemLogs, addLog, clearLogs, archiveLogs, exportLogs,
      generateEvolutionReport, detectedActions, extractActionFromText, markActionSynced,
      activeJourney, startJourney, currentInstruction
  } = useUniversalAgent();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'actions' | 'logs'>('chat');
  const [input, setInput] = useState('');
  
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAvatarInfo, setShowAvatarInfo] = useState(false);
  
  const [showPrompts, setShowPrompts] = useState(false);
  const [availablePrompts, setAvailablePrompts] = useState<MCPPrompt[]>([]);

  const { addToast } = useToast();
  const { userName, addTodo } = useCompany();
  const isZh = language === 'zh-TW';
  const faceConfig = AVATAR_CONFIG[activeFace];

  // Auto-scroll
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatOpen, activeTab]);

  useEffect(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [systemLogs, isChatOpen, activeTab]);

  // Load MCP Prompts
  useEffect(() => {
      setAvailablePrompts(universalIntelligence.getAllPrompts());
  }, []);

  // --- Generate Page Insight on View Change (Push to Chat) ---
  useEffect(() => {
      if (currentView) {
          generatePageInsight(currentView);
      }
  }, [currentView]);

  const generatePageInsight = (view: View) => {
      let insightText = '';
      switch(view) {
          case View.DASHBOARD:
              insightText = isZh 
                ? `[儀表板洞察] 碳排數據顯示 B 廠區用電量異常上升 3.2%，建議檢查 HVAC 系統。`
                : `[Dashboard Insight] Carbon data indicates a 3.2% anomalous spike in Plant B. Check HVAC.`;
              break;
          case View.CARBON:
              insightText = isZh
                ? `[碳資產洞察] Scope 2 排放佔比過高。建議模擬綠電採購 (REC) 以降低總量。`
                : `[Carbon Insight] Scope 2 emissions high. Recommend REC simulation to reduce total.`;
              break;
          case View.STRATEGY:
              insightText = isZh
                ? `[策略洞察] 根據最新風險熱點圖，供應鏈斷鏈風險已上升至「高」。建議啟動多代理辯論。`
                : `[Strategy Insight] Supply chain risk elevated to HIGH. Recommend initiating Multi-Agent Debate.`;
              break;
          default:
              return; 
      }
      
      if(insightText) {
          const lastMsg = chatHistory[chatHistory.length - 1];
          if (!lastMsg || lastMsg.message !== insightText) {
              addLog(insightText, 'info', 'Assistant');
              const action = extractActionFromText(insightText);
          }
      }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInput(val);
      if (val === '/') setShowPrompts(true);
      else if (!val.startsWith('/')) setShowPrompts(false);
  };

  const selectPrompt = (prompt: MCPPrompt) => {
      setInput(`/${prompt.name} `);
      setShowPrompts(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    // Command Check for Journey
    if (input.toLowerCase() === '/start carbon') {
        startJourney('carbon_kickstart');
        addLog(isZh ? '啟動「碳盤查新手引導」旅程' : 'Starting Carbon Kickstart Journey', 'success', 'Assistant');
        setInput('');
        return;
    }

    const lowerInput = input.toLowerCase();
    const isSecretaryRequest = lowerInput.includes('schedule') || lowerInput.includes('remind') || lowerInput.includes('calendar') || lowerInput.includes('安排') || lowerInput.includes('提醒');

    addLog(input, 'info', 'Chat'); // Add to Chat History
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    
    try {
        if (isSecretaryRequest) {
            // Simulated Secretary Response
            await new Promise(r => setTimeout(r, 1000));
            const secretaryResponse = isZh 
                ? `已為您安排："${currentInput}"。並已同步至行事曆與行動方針。`
                : `Scheduled: "${currentInput}". Synced to calendar and action plan.`;
            
            addLog(secretaryResponse, 'success', 'Assistant');
            extractActionFromText(currentInput); // Auto extract action
            
            setIsTyping(false);
            return;
        }

        // Standard Chat
        const systemState = { view: currentView, user: userName };
        const fullPrompt = `[System: ${JSON.stringify(systemState)}] User: ${currentInput}`;
        const stream = streamChat(fullPrompt, language);
        
        let fullText = '';
        let isFirst = true;
        for await (const chunk of stream) {
            if (isFirst) { setIsTyping(false); isFirst = false; }
            fullText += chunk;
        }
        addLog(fullText, 'success', 'Assistant');
        
        // Analyze response for Actions
        const action = extractActionFromText(fullText);
        if (action) {
            setActiveTab('actions'); // Attention guidance
        }

    } catch(e) { 
        setIsTyping(false); 
        addLog('Connection Failed', 'error', 'System');
    }
  };

  const handleAddActionToTodo = (id: string, text: string) => {
      addTodo(text);
      markActionSynced(id);
      addToast('success', isZh ? '已同步至待辦清單' : 'Synced to To-Do List', 'AI Secretary');
  };

  return (
    <>
      {/* Floating Button */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
            {/* Journey Prompt Bubble */}
            {activeJourney && currentInstruction && (
                <div className="bg-celestial-purple/90 backdrop-blur-md text-white px-4 py-2 rounded-l-xl rounded-tr-xl shadow-lg border border-celestial-purple/30 animate-fade-in max-w-xs text-sm mb-2 flex items-start gap-2">
                    <Navigation className="w-4 h-4 mt-0.5 shrink-0 animate-pulse" />
                    <div>
                        <div className="text-[10px] font-bold uppercase opacity-70 tracking-wider">Current Objective</div>
                        {currentInstruction}
                    </div>
                </div>
            )}

            <button onClick={() => setIsChatOpen(true)} className="w-16 h-16 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center hover:scale-105 transition-all shadow-xl group relative">
                <div className="absolute inset-0 bg-celestial-purple/20 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
                <Bot className="w-8 h-8 text-white relative z-10" />
                {detectedActions.filter(a => a.status === 'pending').length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                        {detectedActions.filter(a => a.status === 'pending').length}
                    </div>
                )}
            </button>
        </div>
      )}

      {isChatOpen && (
        <div className={`fixed top-20 bottom-6 right-6 z-50 w-[90vw] md:w-[450px] flex flex-col rounded-3xl glass-panel overflow-hidden animate-fade-in border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/95`}>
             {/* Header */}
             <div className="p-4 bg-white/5 border-b border-white/10 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 relative">
                        <button 
                            onClick={() => setShowAvatarInfo(!showAvatarInfo)}
                            className={`p-2 rounded-xl border transition-all ${faceConfig.bg} ${faceConfig.border} ${faceConfig.color}`}
                        >
                            {React.createElement(faceConfig.icon, { className: "w-5 h-5" })}
                        </button>
                        
                        {showAvatarInfo && (
                            <div className="absolute top-12 left-0 w-64 bg-slate-800 border border-white/20 rounded-xl p-3 z-50 shadow-xl animate-fade-in">
                                <h4 className={`text-sm font-bold ${faceConfig.color} mb-1`}>
                                    {isZh ? faceConfig.label.zh : faceConfig.label.en}
                                </h4>
                                <p className="text-xs text-gray-300">{isZh ? faceConfig.desc.zh : faceConfig.desc.en}</p>
                                <div className="mt-2 flex gap-1">
                                    {(['MIRROR', 'EXPERT', 'VOID'] as AvatarFace[]).map(f => (
                                        <button 
                                            key={f} 
                                            onClick={() => { setActiveFace(f); setShowAvatarInfo(false); }}
                                            className={`text-[10px] px-2 py-1 rounded border ${activeFace === f ? 'bg-white/20 border-white' : 'bg-black/20 border-transparent text-gray-500'}`}
                                        >
                                            {f[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <div className={`text-xs font-bold ${faceConfig.color} cursor-pointer`} onClick={() => setShowAvatarInfo(!showAvatarInfo)}>
                                {isZh ? faceConfig.label.zh : faceConfig.label.en}
                            </div>
                            <div className="text-[10px] text-gray-400">AIOS Kernel v15.0</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="relative">
                            <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                    <button onClick={() => { generateEvolutionReport(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> {isZh ? '生成進化報告' : 'Evolution Report'}
                                    </button>
                                    <button onClick={() => { archiveLogs(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2">
                                        <Archive className="w-4 h-4" /> {isZh ? '封存日誌' : 'Archive Logs'}
                                    </button>
                                    <div className="h-px bg-white/10" />
                                    <button onClick={() => { clearLogs(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" /> {isZh ? '清空紀錄' : 'Clear All'}
                                    </button>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                    </div>
                </div>
                
                {/* 3-Tab Navigation */}
                <div className="flex p-1 bg-black/20 rounded-lg">
                    <button onClick={() => setActiveTab('chat')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                        <MessageSquare className="w-3.5 h-3.5" /> {isZh ? '對話' : 'Chat'}
                    </button>
                    <button onClick={() => setActiveTab('actions')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'actions' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                        <CheckSquare className="w-3.5 h-3.5" /> 
                        {isZh ? '行動' : 'Actions'}
                        {detectedActions.filter(a => a.status === 'pending').length > 0 && (
                            <span className="w-4 h-4 bg-emerald-500 rounded-full text-[9px] flex items-center justify-center text-black">
                                {detectedActions.filter(a => a.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setActiveTab('logs')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'logs' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                        <Terminal className="w-3.5 h-3.5" /> {isZh ? '日誌' : 'Logs'}
                    </button>
                </div>
             </div>

             {/* === TAB: CHAT === */}
             {activeTab === 'chat' && (
                 <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
                        {chatHistory.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-30 space-y-4">
                                <Bot className="w-12 h-12" />
                                <span className="text-xs">How can I help you today?</span>
                                <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                                    <button onClick={() => { startJourney('carbon_kickstart'); }} className="px-3 py-1 bg-white/5 rounded-full text-[10px] hover:bg-white/10 transition-colors border border-white/10">
                                        Start Carbon Journey
                                    </button>
                                </div>
                            </div>
                        )}
                        {chatHistory.map((m, idx) => (
                            <div key={idx} className={`flex flex-col ${m.source === 'Chat' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-3 rounded-xl text-sm max-w-[95%] shadow-lg border ${
                                    m.source === 'Chat' ? 'bg-celestial-purple/20 border-celestial-purple/30 text-white rounded-br-none' : 
                                    'bg-white/5 border-white/10 text-gray-200 w-full rounded-bl-none'
                                }`}>
                                    <div className="flex justify-between items-center mb-1 opacity-50 text-[10px]">
                                        <span className="font-bold uppercase tracking-wider">{m.source}</span>
                                        <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    {m.source === 'Assistant' ? <GenerativeUIRenderer content={m.message} /> : m.message}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-xs text-gray-500 animate-pulse ml-2 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-white/10 bg-white/5 relative">
                        {showPrompts && (
                            <div className="absolute bottom-full left-0 w-full bg-slate-900 border border-white/10 rounded-t-xl overflow-hidden shadow-xl mb-1 max-h-48 overflow-y-auto custom-scrollbar">
                                <div className="text-[10px] font-bold text-gray-500 px-3 py-2 bg-black/20">TOOLS & COMMANDS</div>
                                {availablePrompts.map(p => (
                                    <button key={p.name} onClick={() => selectPrompt(p)} className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-xs text-gray-300">
                                        <Command className="w-3 h-3" />
                                        <span className="font-bold text-white">/{p.name}</span>
                                        <span className="text-gray-500 truncate">- {p.description}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input 
                                value={input} 
                                onChange={handleInputChange}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder={isZh ? "輸入指令或 / 呼叫工具..." : "Type or / for tools..."}
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-celestial-emerald"
                            />
                            <button onClick={handleSend} className="p-2 bg-celestial-emerald rounded-xl text-white hover:bg-emerald-600 transition-colors"><Send className="w-5 h-5"/></button>
                        </div>
                    </div>
                 </>
             )}

             {/* === TAB: ACTIONS (New) === */}
             {activeTab === 'actions' && (
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-950/30">
                     {detectedActions.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                             <CheckSquare className="w-12 h-12 mb-2" />
                             <span className="text-xs">{isZh ? '尚無行動方針' : 'No Action Items'}</span>
                         </div>
                     ) : (
                         detectedActions.map((action) => (
                             <div key={action.id} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                         action.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                     }`}>
                                         {action.priority}
                                     </span>
                                     <span className="text-[10px] text-gray-500">{new Date(action.timestamp).toLocaleTimeString()}</span>
                                 </div>
                                 <p className="text-sm text-gray-200 mb-3 leading-relaxed">{action.text}</p>
                                 <button 
                                     onClick={() => handleAddActionToTodo(action.id, action.text)}
                                     disabled={action.status === 'synced'}
                                     className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                         action.status === 'synced' 
                                             ? 'bg-emerald-500/10 text-emerald-400 cursor-default' 
                                             : 'bg-white/10 text-white hover:bg-celestial-purple/50'
                                     }`}
                                 >
                                     {action.status === 'synced' ? (
                                         <><CheckSquare className="w-3 h-3" /> {isZh ? '已同步' : 'Synced'}</>
                                     ) : (
                                         <><Plus className="w-3 h-3" /> {isZh ? '加入待辦' : 'Add to To-Do'}</>
                                     )}
                                 </button>
                             </div>
                         ))
                     )}
                 </div>
             )}

             {/* === TAB: LOGS (Updated) === */}
             {activeTab === 'logs' && (
                 <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar font-mono text-xs">
                     {systemLogs.length === 0 && <div className="text-center text-gray-600 mt-10">No system logs yet.</div>}
                     {systemLogs.map((log) => (
                         <div key={log.id} className="flex gap-2 animate-fade-in border-l-2 border-white/10 pl-2 py-1 hover:bg-white/5 rounded-r transition-colors">
                             <div className="text-gray-500 w-16 shrink-0">{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}</div>
                             <div className="flex-1 break-words">
                                 <span className={`font-bold mr-2 text-[10px] uppercase tracking-wider ${
                                     log.type === 'error' ? 'text-red-400' : 
                                     log.type === 'warning' ? 'text-amber-400' : 
                                     log.source === 'Evolution' ? 'text-celestial-gold' :
                                     log.source === 'Insight' ? 'text-celestial-purple' :
                                     'text-celestial-blue'
                                 }`}>[{log.source}]</span>
                                 <span className="text-gray-300">{log.message}</span>
                             </div>
                         </div>
                     ))}
                     <div ref={logsEndRef} />
                 </div>
             )}
        </div>
      )}
    </>
  );
};
