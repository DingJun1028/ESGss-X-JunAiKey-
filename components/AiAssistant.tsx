
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
    Bot, X, Send, Sparkles, BrainCircuit, Search, Mic, MessageSquare, Book, 
    StickyNote, Tag, CheckSquare, Server, Star, Layers, Eye, Lightbulb, 
    TrendingUp, ClipboardCheck, ArrowRight, Zap, AlertTriangle
} from 'lucide-react';
import { ChatMessage, Language, View, ProactiveInsight } from '../types';
import { streamChat } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { marked } from 'marked';
import { universalIntelligence } from '../services/evolutionEngine';
import { ChatVisualizer } from './minimal/ChatVisualizer'; // Import Visualizer

interface AiAssistantProps {
  language: Language;
  onNavigate?: (view: View) => void;
  currentView?: View; // New Prop for Context Awareness
}

interface AgentStep {
    text: string;
    icon: React.ElementType;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate, currentView }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Physics State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDragClick = useRef(false);
  
  // Interaction Logic State
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const clickCount = useRef(0);
  const singleClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AI Logic State
  const [activeMode, setActiveMode] = useState<'chat' | 'secretary'>('secretary');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null);
  const [neuralPulse, setNeuralPulse] = useState(false);
  
  // Secretary Mode State
  const [insights, setInsights] = useState<ProactiveInsight[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const { addToast } = useToast();
  // Get full company context for injection
  const companyContext = useCompany(); 
  const { 
      userName, addNote, companyName, esgScores, 
      carbonData, budget, carbonCredits, collectedCards,
      quests
  } = companyContext;
  
  const STORAGE_KEY = 'esgss_universal_memory_v1';
  const isZh = language === 'zh-TW';

  // --- Voice Control Logic ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = isZh ? 'zh-TW' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            processVoiceInput(transcriptText);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech Error", event.error);
            setIsListening(false);
        };
    }
  }, [language]);

  const processVoiceInput = (text: string) => {
      const lowerCmd = text.toLowerCase();
      let isCommand = false;

      if (onNavigate) {
          if (lowerCmd.includes('dashboard') || lowerCmd.includes('儀表板')) {
              onNavigate(View.DASHBOARD);
              isCommand = true;
          } else if (lowerCmd.includes('report') || lowerCmd.includes('報告')) {
              onNavigate(View.REPORT);
              isCommand = true;
          } else if (lowerCmd.includes('carbon') || lowerCmd.includes('碳')) {
              onNavigate(View.CARBON);
              isCommand = true;
          }
      }

      if (isCommand) {
          addToast('success', isZh ? `執行指令: ${text}` : `Executing: ${text}`, 'JunAiKey Voice');
      } else {
          // If not navigation, treat as chat input
          setIsChatOpen(true);
          setInput(text);
          // Auto-send could be added here, but safer to let user confirm
      }
  };

  const startVoice = () => {
      try {
          recognitionRef.current?.start();
          setIsListening(true);
          addToast('info', isZh ? '正在聆聽...' : 'Listening...', 'JunAiKey');
      } catch (e) {
          console.warn("Speech API Error", e);
          setIsListening(true);
          setTimeout(() => setIsListening(false), 2000); // Mock
      }
  };

  // --- Proactive Secretary Logic ---
  const generateInsights = () => {
      setIsScanning(true);
      
      setTimeout(() => {
          const newInsights: ProactiveInsight[] = [];
          
          // 1. Next Best Action (Based on ESG Scores & Budget)
          if (esgScores.environmental < 70 && budget > 10000) {
              newInsights.push({
                  id: 'act-env-boost',
                  type: 'next_step',
                  title: isZh ? '提升環境評分' : 'Boost Env Score',
                  description: isZh ? '您的環境分數落後。建議啟動「供應鏈碳盤查」專案。' : 'Env score lagging. Initiate Supplier Carbon Audit.',
                  actionLabel: isZh ? '前往碳資產' : 'Go to Carbon',
                  targetView: View.CARBON,
                  confidence: 92,
                  impact: 'high'
              });
          }

          if (quests.filter(q => q.status === 'active').length > 2) {
              newInsights.push({
                  id: 'act-clear-quests',
                  type: 'next_step',
                  title: isZh ? '清理待辦任務' : 'Clear Active Quests',
                  description: isZh ? '您有 3+ 個活躍任務未完成。建議優先處理「上傳電費單」。' : '3+ active quests pending. Prioritize "Upload Bill".',
                  actionLabel: isZh ? '查看任務' : 'View Quests',
                  targetView: View.MY_ESG,
                  confidence: 85,
                  impact: 'medium'
              });
          }

          // 2. Optimization (Efficiency)
          if (carbonCredits < 500) {
              newInsights.push({
                  id: 'opt-credits',
                  type: 'optimization',
                  title: isZh ? '碳權庫存預警' : 'Low Carbon Credits',
                  description: isZh ? '碳權庫存低於安全水位。建議現在以市價 $25 補進，預測下月將漲至 $30。' : 'Credits low. Buy now at $25; forecasted to hit $30 next month.',
                  actionLabel: isZh ? '前往交易' : 'Go to Market',
                  targetView: View.GOODWILL,
                  confidence: 88,
                  impact: 'high'
              });
          }

          // 3. Preparation Protocol (Context Aware)
          if (currentView === View.REPORT) {
              newInsights.push({
                  id: 'prep-report',
                  type: 'preparation',
                  title: isZh ? 'GRI 報告準備清單' : 'GRI Report Prep',
                  description: isZh ? '偵測到您正在編輯報告。請確認已備妥：1. 範疇一二數據 2. 利害關係人問卷結果。' : 'Detected report editing. Ensure you have: 1. Scope 1/2 Data 2. Stakeholder Survey Results.',
                  confidence: 95,
                  impact: 'medium'
              });
          }
          
          if (currentView === View.CARBON) {
               newInsights.push({
                  id: 'prep-audit',
                  type: 'optimization',
                  title: isZh ? '數據異常偵測' : 'Anomaly Detected',
                  description: isZh ? 'B 廠區電力數據波動異常 (+15%)。建議檢查 IoT 連線或手動校正。' : 'Plant B power spike (+15%). Check IoT or manual override.',
                  confidence: 78,
                  impact: 'high'
              });
          }

          setInsights(newInsights);
          setIsScanning(false);
      }, 1200); // Simulate processing time
  };

  useEffect(() => {
      if (isChatOpen && activeMode === 'secretary') {
          generateInsights();
      }
  }, [isChatOpen, activeMode, currentView, esgScores]); // Re-scan on view change or score change

  // --- Interaction Handlers ---
  const handlePointerDown = (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      isDragClick.current = false;
      isLongPress.current = false;
      dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      (e.target as Element).setPointerCapture(e.pointerId);

      longPressTimer.current = setTimeout(() => {
          isLongPress.current = true;
          startVoice();
      }, 800); 
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
          isDragClick.current = true;
          if (longPressTimer.current) clearTimeout(longPressTimer.current);
      }
      setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture(e.pointerId);
      if (longPressTimer.current) clearTimeout(longPressTimer.current);

      if (!isDragClick.current && !isLongPress.current) {
          clickCount.current += 1;
          if (clickCount.current === 1) {
              singleClickTimer.current = setTimeout(() => {
                  clickCount.current = 0;
                  if (!isMenuOpen) {
                      setIsChatOpen(prev => !prev);
                  } else {
                      setIsMenuOpen(false);
                  }
              }, 250);
          } else if (clickCount.current === 2) {
              if (singleClickTimer.current) clearTimeout(singleClickTimer.current);
              clickCount.current = 0;
              setIsChatOpen(false);
              setIsMenuOpen(prev => !prev);
          }
      }
  };

  const handleToolClick = (toolName: string, targetView?: View) => {
      addToast('info', isZh ? `正在開啟 ${toolName}...` : `Accessing ${toolName}...`, 'JunAiKey Toolset');
      setIsMenuOpen(false);
      
      if (targetView && onNavigate) {
          onNavigate(targetView);
      } else if (toolName === 'Chat') {
          setIsChatOpen(true);
      }
  };

  const handleInsightAction = (insight: ProactiveInsight) => {
      if (insight.targetView && onNavigate) {
          onNavigate(insight.targetView);
          addToast('success', isZh ? `正在執行：${insight.title}` : `Executing: ${insight.title}`, 'AI Secretary');
          setIsChatOpen(false); // Close window to let user work
      } else {
          addToast('info', isZh ? '已標記為處理中' : 'Marked as In Progress', 'System');
      }
  };

  // --- AI Chat Logic ---
  useEffect(() => {
    const savedMemory = localStorage.getItem(STORAGE_KEY);
    if (savedMemory) {
      try {
        const parsed = JSON.parse(savedMemory);
        const hydratedMessages = parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(hydratedMessages);
      } catch (e) { console.error("Failed to load Memory", e); }
    } else {
        const greeting = language === 'zh-TW' ? "您好。我是 JunAiKey。" : "Greetings. I am JunAiKey.";
        setMessages([{ id: 'welcome', role: 'model', text: greeting, timestamp: new Date() }]);
    }
    const unsubscribe = universalIntelligence.subscribeGlobal(() => { setNeuralPulse(true); setTimeout(() => setNeuralPulse(false), 200); });
    return () => unsubscribe();
  }, []);

  useEffect(() => { if (messages.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    try {
        setCurrentStep({ text: "Analyzing Context...", icon: BrainCircuit });
        
        // --- Context Injection ---
        const systemState = {
            currentView: currentView || 'Unknown',
            user: userName,
            company: companyName,
            metrics: {
                scores: esgScores,
                carbon: carbonData,
                budget: budget
            }
        };
        
        const contextHeader = `
        [System Context]
        User is currently viewing: ${currentView}
        Company State: ${JSON.stringify(systemState)}
        
        Instruction: Provide a concise, helpful response. You can generate charts or tables if the user asks for comparisons or analysis. Use JSON_UI format for visuals.
        `;

        const fullPrompt = `${contextHeader}\n\nUser Query: ${input}`;

        const stream = streamChat(fullPrompt, language);
        const modelMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: new Date() }]);
        
        let fullText = '';
        let isFirst = true;
        for await (const chunk of stream) {
            if (isFirst) { setIsTyping(false); setCurrentStep(null); isFirst = false; }
            fullText += chunk;
            setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg));
        }
    } catch(e) { setIsTyping(false); setCurrentStep(null); addToast('error', 'Connection Failed', 'Error'); }
  };

  const satellites = [
      { id: 'album', icon: Layers, label: isZh ? '萬能卡冊' : 'Universal Card Album', angle: 270, action: () => handleToolClick('Universal Card Album', View.CARD_GAME) },
      { id: 'notes', icon: StickyNote, label: isZh ? '萬能筆記' : 'Universal Notes', angle: 315, action: () => handleToolClick('Universal Notes', View.UNIVERSAL_TOOLS) },
      { id: 'intel', icon: BrainCircuit, label: isZh ? '萬能智庫' : 'Universal Intelligence', angle: 0, action: () => handleToolClick('Universal Intelligence', View.RESEARCH_HUB) },
      { id: 'tagging', icon: Tag, label: isZh ? '萬能標籤' : 'Universal Tagging', angle: 45, action: () => handleToolClick('Universal Tagging', View.UNIVERSAL_TOOLS) },
      { id: 'todo', icon: CheckSquare, label: isZh ? '萬能待辦' : 'Universal To-Do', angle: 90, action: () => handleToolClick('Universal To-Do', View.MY_ESG) },
      { id: 'backend', icon: Server, label: isZh ? '萬能後台' : 'Universal Backend', angle: 135, action: () => handleToolClick('Universal Backend', View.API_ZONE) },
      { id: 'fav', icon: Star, label: isZh ? '萬能收藏' : 'Universal Favorites', angle: 180, action: () => handleToolClick('Universal Favorites', View.MY_ESG) },
      { id: 'chat', icon: MessageSquare, label: isZh ? 'AI 對話' : 'Chat', angle: 225, action: () => handleToolClick('Chat') },
  ];

  return (
    <>
      {!isChatOpen && (
        <div 
            className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-50 touch-none"
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'pointer'
            }}
        >
            <div className={`absolute inset-0 transition-all duration-500 ease-out ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}>
                {satellites.map((sat) => {
                    const radius = 80;
                    const rad = (sat.angle * Math.PI) / 180;
                    const x = Math.cos(rad) * radius;
                    const y = Math.sin(rad) * radius;
                    
                    return (
                        <button 
                            key={sat.id}
                            onClick={sat.action}
                            className="absolute w-10 h-10 rounded-full bg-slate-900/90 border border-white/20 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:border-celestial-emerald hover:text-celestial-emerald transition-all backdrop-blur-md group"
                            style={{ 
                                top: '50%', left: '50%', 
                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` 
                            }}
                            title={sat.label}
                        >
                            <sat.icon className="w-4 h-4" />
                        </button>
                    );
                })}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full border border-white/5 animate-spin-slow pointer-events-none" />
            </div>

            <div 
                ref={buttonRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    ${isMenuOpen ? 'scale-90' : 'hover:scale-105'}
                    ${isListening ? 'scale-110 ring-4 ring-celestial-gold/30' : ''}
                `}
                title="Single: AI Secretary | Double: Universal Tools | Hold: Voice"
            >
                <div className="absolute inset-0 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50 mix-blend-overlay" />
                <div className={`absolute inset-0 rounded-full bg-radial-gradient from-celestial-emerald/40 to-transparent blur-xl transition-opacity duration-1000 ${neuralPulse || isMenuOpen || isListening ? 'opacity-100 scale-125' : 'opacity-40 scale-100 animate-pulse'}`} />

                <div className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {isMenuOpen ? <X className="w-8 h-8" /> : (isListening ? <Mic className="w-8 h-8 animate-bounce text-celestial-gold" /> : <Bot className="w-8 h-8 md:w-10 md:h-10" />)}
                </div>
            </div>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[450px] h-[650px] max-h-[85vh] flex flex-col rounded-3xl glass-panel overflow-hidden animate-fade-in border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/90">
             
             {/* Header */}
             <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setActiveMode('secretary')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeMode === 'secretary' ? 'bg-celestial-purple text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <BrainCircuit className="w-3.5 h-3.5" />
                        {isZh ? '秘書 (Secretary)' : 'Secretary'}
                    </button>
                    <button 
                        onClick={() => setActiveMode('chat')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeMode === 'chat' ? 'bg-celestial-blue text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {isZh ? '對話 (Chat)' : 'Chat'}
                    </button>
                </div>
                <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-white"/></button>
             </div>

             {/* Mode: Secretary */}
             {activeMode === 'secretary' && (
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-slate-900/50 to-slate-950/80">
                     <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2 text-xs text-gray-400">
                             <Eye className="w-3 h-3 text-celestial-emerald" />
                             {isZh ? '正在監控: ' : 'Observing: '}<span className="text-white font-bold">{currentView}</span>
                         </div>
                         <button onClick={generateInsights} className="text-[10px] text-celestial-purple hover:text-white flex items-center gap-1 transition-colors">
                             <Sparkles className="w-3 h-3" /> Refresh
                         </button>
                     </div>

                     {isScanning ? (
                         <div className="flex flex-col items-center justify-center h-40 space-y-3 opacity-70">
                             <div className="w-12 h-12 rounded-full border-4 border-celestial-purple/20 border-t-celestial-purple animate-spin" />
                             <p className="text-xs text-gray-400 animate-pulse">{isZh ? 'JunAiKey 正在分析情境...' : 'JunAiKey is analyzing context...'}</p>
                         </div>
                     ) : (
                         <>
                            {insights.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-xs">{isZh ? '目前系統運行平穩，無緊急建議。' : 'System nominal. No urgent insights.'}</p>
                                </div>
                            ) : (
                                insights.map((insight) => (
                                    <div 
                                        key={insight.id} 
                                        className={`p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.02] group
                                            ${insight.type === 'next_step' ? 'bg-celestial-purple/10 border-celestial-purple/30' : 
                                              insight.type === 'optimization' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                                              'bg-blue-500/10 border-blue-500/30'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${
                                                    insight.type === 'next_step' ? 'bg-celestial-purple/20 text-celestial-purple' : 
                                                    insight.type === 'optimization' ? 'bg-emerald-500/20 text-emerald-400' : 
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                    {insight.type === 'next_step' ? <TrendingUp className="w-4 h-4" /> : 
                                                     insight.type === 'optimization' ? <Zap className="w-4 h-4" /> : 
                                                     <ClipboardCheck className="w-4 h-4" />}
                                                </div>
                                                <span className={`text-xs font-bold uppercase tracking-wider ${
                                                    insight.type === 'next_step' ? 'text-celestial-purple' : 
                                                    insight.type === 'optimization' ? 'text-emerald-400' : 
                                                    'text-blue-400'
                                                }`}>
                                                    {isZh ? (insight.type === 'next_step' ? '下一步行動' : insight.type === 'optimization' ? '效率優化' : '準備清單') : 
                                                    insight.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono bg-black/20 px-1.5 py-0.5 rounded">
                                                <AlertTriangle className={`w-3 h-3 ${insight.impact === 'high' ? 'text-red-400' : 'text-gray-600'}`} />
                                                {insight.confidence}%
                                            </div>
                                        </div>
                                        
                                        <h4 className="text-sm font-bold text-white mb-1">{insight.title}</h4>
                                        <p className="text-xs text-gray-300 leading-relaxed mb-4">{insight.description}</p>
                                        
                                        {insight.actionLabel && (
                                            <button 
                                                onClick={() => handleInsightAction(insight)}
                                                className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all
                                                    ${insight.type === 'next_step' ? 'bg-celestial-purple hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 
                                                      insight.type === 'optimization' ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 
                                                      'bg-white/10 hover:bg-white/20 text-white border border-white/10'}
                                                `}
                                            >
                                                {insight.actionLabel}
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                         </>
                     )}
                 </div>
             )}

             {/* Mode: Chat */}
             {activeMode === 'chat' && (
                 <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map(m => (
                            <div key={m.id} className={`p-3 rounded-xl text-sm ${m.role==='user'?'bg-celestial-purple/20 ml-auto max-w-[85%]':'bg-white/5 mr-auto max-w-[90%]'}`}>
                                {/* Use ChatVisualizer instead of simple Markdown renderer */}
                                {m.role === 'model' ? (
                                    <ChatVisualizer content={m.text} />
                                ) : (
                                    <div dangerouslySetInnerHTML={{__html: marked.parse(m.text) as string}} className="markdown-content text-gray-200" />
                                )}
                            </div>
                        ))}
                        {currentStep && (
                            <div className="flex items-center gap-2 text-xs text-celestial-emerald animate-pulse bg-celestial-emerald/10 p-2 rounded-lg self-start">
                                {React.createElement(currentStep.icon, { className: "w-3 h-3" })}
                                <span>{currentStep.text}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                        <input 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder={isZh ? "詢問 JunAiKey..." : "Ask JunAiKey..."}
                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-celestial-emerald"
                        />
                        <button onClick={handleSend} className="p-2 bg-celestial-emerald rounded-xl text-white"><Send className="w-5 h-5"/></button>
                    </div>
                 </>
             )}
        </div>
      )}
    </>
  );
};
