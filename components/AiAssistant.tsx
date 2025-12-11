
import React, { useState, useRef, useEffect } from 'react';
import { 
    Bot, X, Send, Sparkles, BrainCircuit, Search, Mic, MessageSquare, 
    Zap, AlertTriangle, ArrowRight, Grid, User, Crown, Terminal,
    Slash, Command
} from 'lucide-react';
import { ChatMessage, Language, View, ProactiveInsight, MCPPrompt } from '../types';
import { streamChat } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent, AvatarFace } from '../contexts/UniversalAgentContext';
import { universalIntelligence } from '../services/evolutionEngine';
import { marked } from 'marked';
import GenerativeUIRenderer from './GenerativeUIRenderer';
import { ApprovalCard } from './minimal/ApprovalCard';

interface AiAssistantProps {
  language: Language;
  onNavigate?: (view: View) => void;
  currentView?: View;
}

const AVATAR_CONFIG = {
    MIRROR: { label: { en: 'Mirror', zh: '鏡之相' }, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: User },
    EXPERT: { label: { en: 'Expert', zh: '相之相' }, color: 'text-celestial-gold', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: Crown },
    VOID: { label: { en: 'Void', zh: '無之相' }, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: Terminal }
};

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate, currentView }) => {
  const { activeFace, setActiveFace, isProcessing: isMatrixProcessing } = useUniversalAgent();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'secretary' | 'matrix'>('secretary');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Slash Command State
  const [showPrompts, setShowPrompts] = useState(false);
  const [availablePrompts, setAvailablePrompts] = useState<MCPPrompt[]>([]);

  // Insights State
  const [insights, setInsights] = useState<ProactiveInsight[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const { addToast } = useToast();
  const { userName, companyName, esgScores } = useCompany();
  const isZh = language === 'zh-TW';
  const faceConfig = AVATAR_CONFIG[activeFace];

  // Auto-scroll
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load MCP Prompts
  useEffect(() => {
      setAvailablePrompts(universalIntelligence.getAllPrompts());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInput(val);
      if (val === '/') {
          setShowPrompts(true);
      } else if (!val.startsWith('/')) {
          setShowPrompts(false);
      }
  };

  const selectPrompt = (prompt: MCPPrompt) => {
      setInput(`/${prompt.name} `);
      setShowPrompts(false);
      // Focus back to input would be ideal here
  };

  const handleToolApproval = async (msgId: string, decision: 'approve' | 'reject') => {
      setMessages(prev => prev.map(m => {
          if (m.id === msgId && m.toolCall) {
              return { ...m, toolCall: { ...m.toolCall, status: decision === 'approve' ? 'approved' : 'rejected' } };
          }
          return m;
      }));

      const msg = messages.find(m => m.id === msgId);
      if (msg && msg.toolCall) {
          if (decision === 'approve') {
              addToast('info', `Executing ${msg.toolCall.name}...`, 'AIOS Kernel');
              // Simulate async execution
              setTimeout(() => {
                  setMessages(prev => [...prev, {
                      id: Date.now().toString(),
                      role: 'tool',
                      text: `[System] Tool ${msg.toolCall!.name} executed successfully. Output: OK.`,
                      timestamp: new Date()
                  }]);
                  // Update card status to completed
                  setMessages(prev => prev.map(m => m.id === msgId && m.toolCall ? { ...m, toolCall: { ...m.toolCall, status: 'completed' } } : m));
              }, 1500);
          } else {
              addToast('warning', 'Tool execution rejected by user.', 'HITL');
          }
      }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    // 1. Process Slash Commands
    if (input.startsWith('/')) {
        const cmd = input.split(' ')[0].substring(1);
        const args = input.substring(cmd.length + 2);
        // Mock prompt template expansion
        const promptTemplate = availablePrompts.find(p => p.name === cmd);
        if (promptTemplate) {
            setInput(`${promptTemplate.description} (Context: ${args})`);
            // Let it fall through to normal chat with expanded prompt
        }
    }

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input; // Capture for closure
    setInput('');
    setIsTyping(true);
    
    try {
        // 2. Simulated Kernel Logic for Tool Calling (AIOS)
        // If user asks to "send email", we trigger a mock tool call
        if (currentInput.toLowerCase().includes('send email') || currentInput.toLowerCase().includes('report')) {
            setTimeout(() => {
                const toolMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    text: '',
                    timestamp: new Date(),
                    toolCall: {
                        id: 'call-' + Math.random().toString(36).substr(2,9),
                        name: currentInput.toLowerCase().includes('email') ? 'send_email' : 'generate_report',
                        args: currentInput.toLowerCase().includes('email') ? { to: 'boss@corp.com', body: 'Draft' } : { section: 'Scope 3' },
                        requiresApproval: true,
                        status: 'pending'
                    }
                };
                setMessages(prev => [...prev, toolMsg]);
                setIsTyping(false);
            }, 1000);
            return;
        }

        // 3. Simulated Generative UI Trigger (Token Usage Analysis)
        if (currentInput.toLowerCase().includes('token') && currentInput.toLowerCase().includes('analy')) {
             setTimeout(() => {
                const jsonUi = `
根據目前的監控數據，Token 使用率在過去一小時內呈現波動上升趨勢。
\`\`\`json_ui
{
  "type": "chart",
  "chartType": "area",
  "title": "Token Usage Trend (Last Hour)",
  "description": "Real-time context window saturation analysis",
  "data": [
    {"name": "10:00", "value": 20},
    {"name": "10:15", "value": 45},
    {"name": "10:30", "value": 30},
    {"name": "10:45", "value": 85},
    {"name": "11:00", "value": 60}
  ],
  "config": {
    "xKey": "name",
    "dataKeys": [
      {"key": "value", "color": "#06b6d4", "name": "Tokens (k)"}
    ]
  }
}
\`\`\`
建議您檢查 Agent #4 的遞迴邏輯，可能存在記憶體洩漏風險。
`;
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: jsonUi, timestamp: new Date() }]);
                setIsTyping(false);
             }, 1500);
             return;
        }

        // 4. Standard Chat Stream
        const systemState = { view: currentView, user: userName };
        const fullPrompt = `[System: ${JSON.stringify(systemState)}] User: ${currentInput}`;
        const stream = streamChat(fullPrompt, language);
        
        const modelMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: new Date() }]);
        
        let fullText = '';
        let isFirst = true;
        for await (const chunk of stream) {
            if (isFirst) { setIsTyping(false); isFirst = false; }
            fullText += chunk;
            setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg));
        }
    } catch(e) { setIsTyping(false); addToast('error', 'Connection Failed', 'Error'); }
  };

  const startVoice = () => addToast('info', 'Voice not implemented in this snippet', 'System');

  return (
    <>
      {/* Floating Button */}
      {!isChatOpen && (
        <div className="fixed bottom-10 right-10 z-50">
            <button onClick={() => setIsChatOpen(true)} className="w-16 h-16 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center hover:scale-105 transition-all shadow-xl">
                <Bot className="w-8 h-8 text-white" />
            </button>
        </div>
      )}

      {isChatOpen && (
        <div className={`fixed bottom-6 right-6 z-50 h-[650px] w-[90vw] md:w-[450px] flex flex-col rounded-3xl glass-panel overflow-hidden animate-fade-in border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/95`}>
             {/* Header */}
             <div className="p-4 bg-white/5 border-b border-white/10 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveFace(activeFace === 'MIRROR' ? 'EXPERT' : activeFace === 'EXPERT' ? 'VOID' : 'MIRROR')} className={`p-2 rounded-xl border transition-all ${faceConfig.bg} ${faceConfig.border} ${faceConfig.color}`}>
                            {React.createElement(faceConfig.icon, { className: "w-5 h-5" })}
                        </button>
                        <div>
                            <div className={`text-xs font-bold ${faceConfig.color}`}>{isZh ? faceConfig.label.zh : faceConfig.label.en}</div>
                            <div className="text-[10px] text-gray-400">AIOS Kernel v15.0</div>
                        </div>
                    </div>
                    <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-white"/></button>
                </div>
                <div className="flex p-1 bg-black/20 rounded-lg">
                    {[{ id: 'secretary', icon: BrainCircuit, label: 'Secretary' }, { id: 'chat', icon: MessageSquare, label: 'Chat' }, { id: 'matrix', icon: Grid, label: 'Matrix' }].map(tab => (
                        <button key={tab.id} onClick={() => setActiveMode(tab.id as any)} className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all ${activeMode === tab.id ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                        </button>
                    ))}
                </div>
             </div>

             {/* Mode: Chat (Generative UI) */}
             {activeMode === 'chat' && (
                 <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                                <Bot className="w-12 h-12 text-gray-600" />
                                <div className="text-center text-xs text-gray-400">
                                    <p>Try slash commands:</p>
                                    <div className="flex gap-2 justify-center mt-2">
                                        <code className="bg-white/10 px-2 py-1 rounded">/summarize</code>
                                        <code className="bg-white/10 px-2 py-1 rounded">/code-review</code>
                                    </div>
                                    <p className="mt-4">Or ask:</p>
                                    <div className="flex gap-2 justify-center mt-2">
                                        <code className="bg-white/10 px-2 py-1 rounded cursor-pointer hover:bg-white/20" onClick={() => setInput("Analyze system token usage")}>Analyze system token usage</code>
                                    </div>
                                </div>
                            </div>
                        )}
                        {messages.map(m => (
                            <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                {m.toolCall ? (
                                    // Render Approval Card for HITL
                                    <ApprovalCard 
                                        toolName={m.toolCall.name}
                                        args={m.toolCall.args}
                                        status={m.toolCall.status}
                                        onApprove={() => handleToolApproval(m.id, 'approve')}
                                        onReject={() => handleToolApproval(m.id, 'reject')}
                                    />
                                ) : (
                                    <div className={`p-3 rounded-xl text-sm max-w-[95%] ${m.role === 'user' ? 'bg-celestial-purple/20' : 'bg-white/5 w-full'}`}>
                                        {m.role === 'model' ? <GenerativeUIRenderer content={m.text} /> : m.text}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && <div className="text-xs text-gray-500 animate-pulse ml-2">Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-white/5 relative">
                        {showPrompts && (
                            <div className="absolute bottom-full left-0 w-full bg-slate-900 border border-white/10 rounded-t-xl overflow-hidden shadow-xl mb-1">
                                <div className="text-[10px] font-bold text-gray-500 px-3 py-2 bg-black/20">AVAILABLE COMMANDS</div>
                                {availablePrompts.map(p => (
                                    <button 
                                        key={p.name} 
                                        onClick={() => selectPrompt(p)}
                                        className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-xs text-gray-300"
                                    >
                                        <Command className="w-3 h-3" />
                                        <span className="font-bold text-white">/{p.name}</span>
                                        <span className="text-gray-500">- {p.description}</span>
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
                            <button onClick={handleSend} className="p-2 bg-celestial-emerald rounded-xl text-white"><Send className="w-5 h-5"/></button>
                        </div>
                    </div>
                 </>
             )}

             {/* Mode: Secretary */}
             {activeMode === 'secretary' && (
                 <div className="flex-1 p-4 flex items-center justify-center text-gray-500 text-sm">
                     <p>Secretary Mode: Managing schedules and briefings.</p>
                 </div>
             )}
             
             {/* Mode: Matrix */}
             {activeMode === 'matrix' && (
                 <div className="flex-1 p-4 flex items-center justify-center text-gray-500 text-sm">
                     <p>Matrix Mode: Visualizing neural pathways.</p>
                 </div>
             )}
        </div>
      )}
    </>
  );
};
