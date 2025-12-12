
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
    Bot, X, Send, Sparkles, BrainCircuit, Search, MessageSquare, 
    Zap, AlertTriangle, ArrowRight, Grid, User, Crown, Terminal,
    Command, Calendar, Bookmark, Loader2, MoreVertical, Trash2, Archive, Download, Activity, FileText, CheckSquare, Plus, Navigation, Settings, Upload, Database, File, Lightbulb, ChevronDown, Bell, BellOff
} from 'lucide-react';
import { ChatMessage, Language, View, MCPPrompt } from '../types';
import { streamChat } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent, AvatarFace } from '../contexts/UniversalAgentContext';
import { universalIntelligence } from '../services/evolutionEngine';
import GenerativeUIRenderer from './GenerativeUIRenderer';
import { FunctionDeclaration, Type } from '@google/genai';

interface AiAssistantProps {
  language: Language;
  onNavigate?: (view: View) => void;
  currentView?: View;
}

const AVATAR_CONFIG = {
    MIRROR: { 
        label: { en: 'Mirror', zh: '鏡之相' }, 
        desc: { en: 'High Context & Reflection', zh: '上下文記憶與反思' },
        color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: User,
        instruction: "You are a reflective AI mirror. Your goal is to help the user understand their own context better by mirroring their thoughts and providing high-context summaries."
    },
    EXPERT: { 
        label: { en: 'Expert', zh: '相之相' }, 
        desc: { en: 'Reasoning & Domain Knowledge', zh: '深度推理與專業知識' },
        color: 'text-celestial-gold', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: Crown,
        instruction: "You are a deep domain expert in ESG, Sustainability, and Corporate Strategy. Use structured reasoning (Chain of Thought) and provide data-driven insights."
    },
    VOID: { 
        label: { en: 'Void', zh: '無之相' }, 
        desc: { en: 'Execution & Tools', zh: '代碼執行與工具調用' },
        color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: Terminal,
        instruction: "You are a code execution engine and tool orchestrator. Be concise, precise, and favor code blocks or JSON outputs."
    },
    CUSTOM: {
        label: { en: 'Custom', zh: '客製化' },
        desc: { en: 'User Defined Persona', zh: '自定義 AI 人格' },
        color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', icon: Sparkles,
        instruction: "" // Dynamic
    }
};

const AGENT_PRESETS = [
    {
        name: '楊博 (Dr. Yang)',
        instruction: 'You are Dr. Yang Bo (Thoth), a Value-Creating ESG Strategy Consultant. You combine Silicon Valley Lean Startup thinking with sustainability. Your tone is professional, insightful, and strategic. Focus on "Golden Triangle" (Capital, Policy, Knowledge) and help the user transform compliance into competitive advantage.'
    },
    {
        name: '阿丹 (Ah Dan)',
        instruction: '你是阿丹 (Ah Dan)，一位熱情、友善且充滿活力的 ESG 小幫手！你的目標是用最簡單、有趣的方式解釋複雜的永續概念。請多使用表情符號 (Emoji) 🌟，語氣要活潑鼓勵。'
    }
];

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate, currentView }) => {
  const { 
      activeFace, setActiveFace, customAgent, setCustomAgent,
      chatHistory, systemLogs, addLog, clearLogs, archiveLogs, exportLogs,
      generateEvolutionReport, detectedActions, extractActionFromText, markActionSynced,
      activeJourney, startJourney, currentInstruction,
      isMuted, toggleMute
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

  // Proactive Insight Bubble
  const [latestInsight, setLatestInsight] = useState<{text: string, type: 'insight'|'alert'|'journey'} | null>(null);

  // Draggable State
  const [position, setPosition] = useState({ x: 24, y: 80 }); // Initial bottom-right offset
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Custom Agent Edit State
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [editName, setEditName] = useState(customAgent.name);
  const [editInstruction, setEditInstruction] = useState(customAgent.instruction);
  const [editKb, setEditKb] = useState<string[]>(customAgent.knowledgeBase || []);
  const kbInputRef = useRef<HTMLInputElement>(null);

  const { addToast } = useToast();
  const { userName, addTodo, toggleTodo, deleteTodo, todos, universalNotes, addNote, updateNote, deleteNote } = useCompany();
  const isZh = language === 'zh-TW';
  
  // Dynamic Configuration
  const faceConfig = activeFace === 'CUSTOM' ? {
      ...AVATAR_CONFIG.CUSTOM,
      label: { en: customAgent.name, zh: customAgent.name },
      instruction: customAgent.instruction
  } : AVATAR_CONFIG[activeFace];

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

  // Sync edit state when custom agent updates (e.g. initial load)
  useEffect(() => {
      if (customAgent) {
          setEditName(customAgent.name);
          setEditInstruction(customAgent.instruction);
          setEditKb(customAgent.knowledgeBase || []);
      }
  }, [customAgent]);

  // Draggable Logic
  const handlePointerDown = (e: React.PointerEvent) => {
      setIsDragging(true);
      const rect = dragRef.current!.getBoundingClientRect();
      dragStartPos.current = {
          x: e.clientX - rect.right, // Offset from right edge
          y: e.clientY - rect.bottom // Offset from bottom edge
      };
      e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const newRight = document.documentElement.clientWidth - e.clientX + dragStartPos.current.x;
      const newBottom = document.documentElement.clientHeight - e.clientY + dragStartPos.current.y;

      setPosition({
          x: Math.max(10, Math.min(document.documentElement.clientWidth - 70, newRight)),
          y: Math.max(10, Math.min(document.documentElement.clientHeight - 70, newBottom))
      });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleDoubleClick = () => {
      if (onNavigate) {
          onNavigate(View.UNIVERSAL_TOOLS);
          addToast('info', isZh ? '進入 AI 育成中心' : 'Entering AI Incubation Center', 'System');
      }
  };

  // --- Generate Page Insight on View Change (Push to Chat) ---
  useEffect(() => {
      if (currentView) {
          generatePageInsight(currentView);
      }
  }, [currentView]);

  const generatePageInsight = (view: View) => {
      if (isMuted) return; // Silent mode

      let insightText = '';
      let type: 'insight' | 'alert' = 'insight';

      switch(view) {
          case View.DASHBOARD:
              insightText = isZh 
                ? `碳排數據顯示 B 廠區用電量異常上升 3.2%，建議檢查 HVAC 系統。`
                : `Carbon data indicates a 3.2% anomalous spike in Plant B. Check HVAC.`;
              type = 'alert';
              break;
          case View.CARBON:
              insightText = isZh
                ? `Scope 2 排放佔比過高。建議模擬綠電採購 (REC) 以降低總量。`
                : `Scope 2 emissions high. Recommend REC simulation to reduce total.`;
              break;
          case View.STRATEGY:
              insightText = isZh
                ? `根據最新風險熱點圖，供應鏈斷鏈風險已上升至「高」。建議啟動多代理辯論。`
                : `Supply chain risk elevated to HIGH. Recommend initiating Multi-Agent Debate.`;
              type = 'alert';
              break;
          case View.REPORT:
              insightText = isZh
                ? `檢測到 GRI 305-1 數據缺口。是否啟動 AI 自動填補？`
                : `GRI 305-1 data gap detected. Initiate AI auto-fill?`;
              break;
          default:
              return; 
      }
      
      if(insightText) {
          setLatestInsight({ text: insightText, type });
          setTimeout(() => setLatestInsight(null), 8000);
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

  // --- TOOL DEFINITIONS (Memoized) ---
  const toolDeclarations: FunctionDeclaration[] = useMemo(() => [
      {
          name: 'navigate',
          description: 'Navigate to a different section or module of the application.',
          parameters: {
              type: Type.OBJECT,
              properties: {
                  view: {
                      type: Type.STRING,
                      description: 'The target view ID to navigate to.',
                      enum: Object.values(View)
                  }
              },
              required: ['view']
          }
      },
      {
          name: 'create_note',
          description: 'Create a new Universal Note.',
          parameters: {
              type: Type.OBJECT,
              properties: {
                  title: { type: Type.STRING, description: 'Title of the note' },
                  content: { type: Type.STRING, description: 'Content of the note' },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Tags for the note' }
              },
              required: ['content']
          }
      },
      {
          name: 'update_note',
          description: 'Update an existing Universal Note.',
          parameters: {
              type: Type.OBJECT,
              properties: {
                  id: { type: Type.STRING, description: 'ID of the note to update' },
                  content: { type: Type.STRING, description: 'New content' },
                  title: { type: Type.STRING, description: 'New title (optional)' },
              },
              required: ['id', 'content']
          }
      },
      {
          name: 'delete_note',
          description: 'Delete a Universal Note.',
          parameters: {
              type: Type.OBJECT,
              properties: {
                  id: { type: Type.STRING, description: 'ID of the note to delete' }
              },
              required: ['id']
          }
      },
      {
          name: 'mute_notifications',
          description: 'Mute or unmute AI Assistant proactive notifications.',
          parameters: {
              type: Type.OBJECT,
              properties: {
                  mute: { type: Type.BOOLEAN, description: 'True to mute, false to unmute' }
              },
              required: ['mute']
          }
      },
      {
          name: 'create_task',
          description: 'Create a new task in the to-do list.',
          parameters: {
              type: Type.OBJECT,
              properties: {
                  text: { type: Type.STRING, description: 'The task description' }
              },
              required: ['text']
          }
      },
      {
          name: 'update_task_status',
          description: 'Toggle the completion status of a task.',
          parameters: {
              type: Type.OBJECT,
              properties: {
                  id: { type: Type.NUMBER, description: 'The numeric ID of the task' }
              },
              required: ['id']
          }
      },
      {
          name: 'delete_task',
          description: 'Delete a task from the to-do list.',
          parameters: {
              type: Type.OBJECT,
              properties: {
                  id: { type: Type.NUMBER, description: 'The numeric ID of the task' }
              },
              required: ['id']
          }
      }
  ], []);

  // --- EXECUTE TOOL (Memoized) ---
  const executeTool = useCallback((name: string, args: any) => {
      console.log(`[Tool Exec] ${name}`, args);
      let result = "Done";

      switch (name) {
          case 'navigate':
              if (onNavigate && args.view) {
                  onNavigate(args.view as View);
                  addToast('info', `Navigating to ${args.view}`, 'AI Assistant');
                  result = `Navigated to ${args.view}`;
              }
              break;
          case 'create_note':
              addNote(args.content, args.tags, args.title);
              addToast('success', 'Note Created', 'Universal Notes');
              result = "Note created successfully.";
              break;
          case 'update_note':
              updateNote(args.id, args.content, args.title);
              addToast('success', 'Note Updated', 'Universal Notes');
              result = "Note updated successfully.";
              break;
          case 'delete_note':
              deleteNote(args.id);
              addToast('info', 'Note Deleted', 'Universal Notes');
              result = "Note deleted.";
              break;
          case 'create_task':
              addTodo(args.text);
              addToast('success', 'Task Added', 'Task Agent');
              result = "Task created.";
              break;
          case 'update_task_status':
              toggleTodo(args.id);
              addToast('success', 'Task Updated', 'Task Agent');
              result = "Task status updated.";
              break;
          case 'delete_task':
              deleteTodo(args.id);
              addToast('info', 'Task Deleted', 'Task Agent');
              result = "Task deleted.";
              break;
          case 'mute_notifications':
              if (args.mute !== undefined) {
                  if (args.mute !== isMuted) toggleMute();
                  result = args.mute ? "Notifications muted." : "Notifications active.";
              }
              break;
          default:
              result = "Unknown tool.";
      }
      return result;
  }, [onNavigate, addNote, updateNote, deleteNote, addTodo, toggleTodo, deleteTodo, toggleMute, isMuted, addToast]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;
    
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    addLog(currentInput, 'info', 'Chat'); // User Message

    // Command Check for Journey
    if (currentInput.toLowerCase() === '/start carbon') {
        startJourney('carbon_kickstart');
        addLog(isZh ? '啟動「碳盤查新手引導」旅程' : 'Starting Carbon Kickstart Journey', 'success', 'Assistant');
        setIsTyping(false);
        return;
    }

    try {
        // System Prompt with Context
        const noteContext = universalNotes.map(n => `ID: ${n.id}, Title: ${n.title}`).join('\n');
        const taskContext = todos.map(t => `ID: ${t.id}, Task: "${t.text}", Status: ${t.done ? 'Done' : 'Pending'}`).join('\n');
        const systemState = { view: currentView, user: userName, notes: noteContext, tasks: taskContext };
        const baseContext = `[System Context: ${JSON.stringify(systemState)}]`;
        const fullPrompt = `${baseContext}\nUser: ${currentInput}`;
        
        const knowledgeBase = activeFace === 'CUSTOM' ? customAgent.knowledgeBase : undefined;
        
        // Model Selection based on Persona
        let model = 'gemini-2.5-flash';
        let thinkingBudget = undefined;

        if (activeFace === 'EXPERT') {
            model = 'gemini-3-pro-preview';
            thinkingBudget = 2048; // Moderate thinking budget for expert tasks
        }

        // Use updated streamChat which returns Chunk Objects (not just text)
        const stream = streamChat(fullPrompt, language, faceConfig.instruction, knowledgeBase, toolDeclarations, model, thinkingBudget);
        
        let fullText = '';
        
        for await (const chunk of stream) {
            // 1. Handle Function Calls
            if (chunk.functionCalls) {
                for (const fc of chunk.functionCalls) {
                    const result = executeTool(fc.name, fc.args);
                    addLog(`Executed: ${fc.name}`, 'info', 'Tool');
                    // In a real multi-turn, we'd send result back. For now, we simulate success.
                    if (fc.name === 'navigate') fullText += `(Navigated to ${fc.args.view})`;
                    else if (fc.name === 'create_note') fullText += `(Note Created)`;
                    else if (fc.name === 'create_task') fullText += `(Task Created)`;
                    else if (fc.name === 'update_task_status') fullText += `(Task Updated)`;
                    else if (fc.name === 'delete_task') fullText += `(Task Deleted)`;
                    else if (fc.name === 'mute_notifications') fullText += fc.args.mute ? `(Notifications Muted)` : `(Notifications Active)`;
                }
            }

            // 2. Handle Text
            if (chunk.text) {
                fullText += chunk.text;
            }
        }

        if (fullText) {
            addLog(fullText, 'success', 'Assistant');
            const action = extractActionFromText(fullText);
            if (action) {
                setActiveTab('actions');
            }
        }

    } catch(e) { 
        console.error(e);
        setIsTyping(false); 
        addLog('Connection Failed', 'error', 'System');
    } finally {
        setIsTyping(false);
    }
  }, [input, isTyping, activeFace, currentView, userName, universalNotes, todos, customAgent, faceConfig, toolDeclarations, language, addLog, startJourney, isZh, extractActionFromText, executeTool]);

  const handleAddActionToTodo = (id: string, text: string) => {
      addTodo(text);
      markActionSynced(id);
      addToast('success', isZh ? '已同步至待辦清單' : 'Synced to To-Do List', 'AI Secretary');
  };

  const handleSaveCustomAgent = () => {
      setCustomAgent({ 
          name: editName, 
          instruction: editInstruction,
          knowledgeBase: editKb 
      });
      setIsEditingAgent(false);
      setActiveFace('CUSTOM');
      setShowAvatarInfo(false);
      addToast('success', isZh ? '客製化 AI 已更新' : 'Custom Agent Updated', 'System');
  };

  const handleApplyPreset = (preset: typeof AGENT_PRESETS[0]) => {
      setEditName(preset.name);
      setEditInstruction(preset.instruction);
  };

  const handleKbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const files = Array.from(e.target.files) as File[];
          const newEntries: string[] = [];
          
          for (const file of files) {
              try {
                  const text = await file.text();
                  newEntries.push(`--- SOURCE: ${file.name} ---\n${text}`);
              } catch (err) {
                  console.error("File read error", err);
              }
          }
          
          setEditKb(prev => [...prev, ...newEntries]);
          addToast('success', isZh ? `已上傳 ${files.length} 個檔案至知識庫` : `Uploaded ${files.length} files to Knowledge Base`, 'System');
      }
  };

  const removeKbItem = (index: number) => {
      setEditKb(prev => prev.filter((_, i) => i !== index));
  };

  const getKbName = (content: string) => {
      const match = content.match(/--- SOURCE: (.*?) ---/);
      return match ? match[1] : 'Unknown Source';
  };

  return (
    <>
      {/* Floating "Living Core" with Drag & Double Click */}
      {!isChatOpen && (
        <div 
            ref={dragRef}
            className="fixed z-50 flex flex-col items-end touch-none select-none"
            style={{ right: position.x, bottom: position.y }}
        >
            {/* Proactive Insight Bubble (The "Thought") */}
            {latestInsight && !isDragging && !isMuted && (
                <div 
                    className={`
                        mb-4 mr-2 max-w-[280px] bg-slate-900/90 backdrop-blur-xl border-l-4 rounded-xl p-3 shadow-2xl animate-fade-in origin-bottom-right transition-all transform hover:scale-105 cursor-pointer
                        ${latestInsight.type === 'alert' ? 'border-red-500 shadow-red-900/20' : 'border-celestial-gold shadow-amber-900/20'}
                    `}
                    onClick={() => { setIsChatOpen(true); setLatestInsight(null); addLog(latestInsight.text, 'info', 'System'); }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        {latestInsight.type === 'alert' ? <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" /> : <Lightbulb className="w-3 h-3 text-celestial-gold" />}
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${latestInsight.type === 'alert' ? 'text-red-400' : 'text-celestial-gold'}`}>
                            {latestInsight.type === 'alert' ? (isZh ? '系統警示' : 'System Alert') : (isZh ? '智慧洞察' : 'Smart Insight')}
                        </span>
                    </div>
                    <p className="text-xs text-white leading-relaxed">{latestInsight.text}</p>
                </div>
            )}

            {/* Journey Instruction Bubble */}
            {activeJourney && currentInstruction && !latestInsight && !isDragging && (
                <div 
                    className="mb-4 mr-2 max-w-xs bg-gradient-to-r from-celestial-purple/90 to-indigo-900/90 backdrop-blur-md text-white px-4 py-3 rounded-xl rounded-br-none shadow-2xl border border-white/10 animate-fade-in flex items-start gap-3 cursor-pointer hover:brightness-110"
                    onClick={() => setIsChatOpen(true)}
                >
                    <Navigation className="w-4 h-4 mt-0.5 shrink-0 animate-bounce text-celestial-gold" />
                    <div>
                        <div className="text-[9px] font-bold uppercase opacity-70 tracking-widest mb-1">Current Objective</div>
                        <div className="text-xs font-medium">{currentInstruction}</div>
                    </div>
                </div>
            )}

            {/* The Orb Trigger */}
            <button 
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onClick={() => !isDragging && setIsChatOpen(true)}
                onDoubleClick={handleDoubleClick}
                aria-label="Open AI Assistant"
                className={`
                    relative w-16 h-16 rounded-full flex items-center justify-center cursor-move transition-all duration-500
                    ${isDragging ? 'scale-90 opacity-80' : 'hover:scale-110'}
                `}
            >
                {/* Core Glow Layer 1 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-celestial-900 via-slate-800 to-celestial-purple opacity-90 shadow-2xl shadow-celestial-purple/40" />
                
                {/* Core Glow Layer 2 (Pulse) */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-celestial-emerald/20 to-transparent blur-md ${isTyping ? 'animate-ping' : 'animate-pulse'}`} />

                {/* Inner Ring */}
                <div className="absolute inset-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm" />

                {/* Center Icon */}
                <div className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {isTyping ? <Loader2 className="w-6 h-6 animate-spin text-celestial-gold" /> : <Bot className="w-6 h-6" />}
                </div>

                {/* Action Notification Badge */}
                {detectedActions.filter(a => a.status === 'pending').length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-bounce z-20">
                        {detectedActions.filter(a => a.status === 'pending').length}
                    </div>
                )}
            </button>
        </div>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div 
            className={`fixed top-20 bottom-6 right-6 z-50 w-[90vw] md:w-[420px] flex flex-col rounded-3xl overflow-hidden animate-fade-in shadow-2xl border border-white/10 ring-1 ring-white/5 bg-[#020617]/95 backdrop-blur-xl`}
            role="dialog" 
            aria-modal="true" 
            aria-label="AI Assistant Chat"
        >
             {/* Header */}
             <div className="p-4 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 flex flex-col gap-3 relative overflow-hidden">
                {/* Background Shine */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <div className="flex justify-between items-center relative z-10">
                    {/* Persona Selector */}
                    <button 
                        onClick={() => setShowAvatarInfo(!showAvatarInfo)}
                        className={`flex items-center gap-3 p-1.5 pr-3 rounded-full border transition-all duration-300 group ${faceConfig.bg} ${faceConfig.border} hover:bg-opacity-20`}
                        aria-label={`Current Persona: ${activeFace}. Click to change.`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${faceConfig.color} bg-black/20 shadow-inner`}>
                            {React.createElement(faceConfig.icon, { className: "w-4 h-4" })}
                        </div>
                        <div className="flex flex-col items-start">
                            <span className={`text-xs font-bold ${faceConfig.color}`}>
                                {isZh ? faceConfig.label.zh : faceConfig.label.en}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono tracking-tight flex items-center gap-1">
                                {activeFace} CORE <ChevronDown className="w-2 h-2 opacity-50" />
                            </span>
                        </div>
                    </button>

                    <div className="flex items-center gap-1">
                        <button onClick={toggleMute} className={`p-2 rounded-full transition-colors ${isMuted ? 'text-red-400 hover:bg-red-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`} title={isMuted ? "Unmute Notifications" : "Mute Notifications"} aria-label={isMuted ? "Unmute notifications" : "Mute notifications"}>
                            {isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors" aria-label="Menu">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors" aria-label="Close Chat">
                            <X className="w-4 h-4"/>
                        </button>
                    </div>

                    {/* Context Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-12 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                            <button onClick={() => { setIsEditingAgent(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-xs text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> {isZh ? '客製化 AI 設定' : 'Custom AI Persona'}
                            </button>
                            <div className="h-px bg-white/5" />
                            <button onClick={() => { generateEvolutionReport(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2">
                                <Activity className="w-3 h-3" /> {isZh ? '生成進化報告' : 'Evolution Report'}
                            </button>
                            <button onClick={() => { archiveLogs(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2">
                                <Archive className="w-3 h-3" /> {isZh ? '封存日誌' : 'Archive Logs'}
                            </button>
                            <button onClick={() => { clearLogs(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                                <Trash2 className="w-3 h-3" /> {isZh ? '清空紀錄' : 'Clear All'}
                            </button>
                        </div>
                    )}

                    {/* Avatar Selection Popover */}
                    {showAvatarInfo && (
                        <div className="absolute top-14 left-0 w-64 bg-slate-900/95 border border-white/20 rounded-xl p-4 z-50 shadow-2xl animate-fade-in backdrop-blur-xl">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Select Core</span>
                                <button onClick={() => setIsEditingAgent(true)} className="p-1 hover:bg-white/10 rounded text-gray-400"><Settings className="w-3 h-3"/></button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {(['MIRROR', 'EXPERT', 'VOID'] as AvatarFace[]).map(f => (
                                    <button 
                                        key={f} 
                                        onClick={() => { setActiveFace(f); setShowAvatarInfo(false); }}
                                        className={`p-2 rounded-lg border text-left transition-all ${activeFace === f ? 'bg-white/10 border-white/30' : 'bg-black/20 border-transparent hover:bg-white/5'}`}
                                    >
                                        <div className={`text-[10px] font-bold ${AVATAR_CONFIG[f].color}`}>{AVATAR_CONFIG[f].label.en}</div>
                                        <div className="text-[9px] text-gray-500 truncate">{AVATAR_CONFIG[f].label.zh}</div>
                                    </button>
                                ))}
                                <button 
                                    onClick={() => { setActiveFace('CUSTOM'); setShowAvatarInfo(false); if(!customAgent.instruction) setIsEditingAgent(true); }}
                                    className={`p-2 rounded-lg border text-left transition-all ${activeFace === 'CUSTOM' ? 'bg-indigo-500/20 border-indigo-500/30' : 'bg-black/20 border-transparent hover:bg-white/5'}`}
                                >
                                    <div className="text-[10px] font-bold text-indigo-400">Custom</div>
                                    <div className="text-[9px] text-gray-500">User Defined</div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* 3-Tab Navigation (Segmented Control style) */}
                <div className="flex p-1 bg-black/30 rounded-lg border border-white/5">
                    <button onClick={() => setActiveTab('chat')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === 'chat' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
                        <MessageSquare className="w-3 h-3" /> {isZh ? '對話' : 'Chat'}
                    </button>
                    <button onClick={() => setActiveTab('actions')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === 'actions' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
                        <CheckSquare className="w-3 h-3" /> 
                        {isZh ? '行動' : 'Actions'}
                        {detectedActions.filter(a => a.status === 'pending').length > 0 && (
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse ml-0.5" />
                        )}
                    </button>
                    <button onClick={() => setActiveTab('logs')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === 'logs' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Terminal className="w-3 h-3" /> {isZh ? '日誌' : 'Logs'}
                    </button>
                </div>
             </div>

             {/* === TAB: CHAT === */}
             {activeTab === 'chat' && (
                 <>
                    <div 
                        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar relative bg-gradient-to-b from-transparent to-black/20"
                        role="log"
                        aria-live="polite"
                        aria-atomic="false"
                    >
                        {chatHistory.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-40 space-y-4 select-none">
                                <div className={`w-16 h-16 rounded-full border-2 ${faceConfig.border} flex items-center justify-center ${faceConfig.bg}`}>
                                    {React.createElement(faceConfig.icon, { className: `w-8 h-8 ${faceConfig.color}` })}
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-bold text-white mb-1">AIOS Kernel v15.0</div>
                                    <div className="text-xs text-gray-400">Ready for query or task delegation.</div>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center max-w-[80%]">
                                    <button onClick={() => { startJourney('carbon_kickstart'); }} className="px-3 py-1.5 bg-white/5 rounded-full text-[10px] hover:bg-white/10 transition-colors border border-white/10 text-emerald-400">
                                        Start Carbon Journey
                                    </button>
                                    <button onClick={() => setInput('/analyze_risk ')} className="px-3 py-1.5 bg-white/5 rounded-full text-[10px] hover:bg-white/10 transition-colors border border-white/10 text-celestial-gold">
                                        Analyze Risk
                                    </button>
                                </div>
                            </div>
                        )}
                        {chatHistory.map((m, idx) => (
                            <div key={idx} className={`flex flex-col ${m.source === 'Chat' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm border ${
                                    m.source === 'Chat' 
                                        ? 'bg-celestial-purple/20 border-celestial-purple/30 text-white rounded-br-sm' 
                                        : m.source === 'Tool' 
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200 rounded-bl-sm font-mono text-xs'
                                            : 'bg-white/5 border-white/10 text-gray-200 rounded-bl-sm backdrop-blur-md'
                                }`}>
                                    {m.source === 'Assistant' && (
                                        <div className="flex items-center gap-1.5 mb-2 opacity-50 pb-2 border-b border-white/5">
                                            {React.createElement(faceConfig.icon, { className: "w-3 h-3" })}
                                            <span className="text-[9px] font-bold uppercase tracking-wider">{activeFace} CORE</span>
                                        </div>
                                    )}
                                    <div className="text-sm leading-relaxed">
                                        {m.source === 'Assistant' ? <GenerativeUIRenderer content={m.message} /> : m.message}
                                    </div>
                                    <div className={`text-[9px] mt-1.5 ${m.source === 'Chat' ? 'text-purple-300/50 text-right' : 'text-gray-500'}`}>
                                        {new Date(m.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 pl-1" aria-label="AI is typing">
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-white/10 bg-white/5 relative">
                        {showPrompts && (
                            <div className="absolute bottom-full left-0 w-full bg-slate-900 border-t border-white/10 rounded-t-2xl overflow-hidden shadow-2xl mb-px max-h-48 overflow-y-auto custom-scrollbar z-20">
                                <div className="text-[9px] font-bold text-gray-500 px-4 py-2 bg-black/40 border-b border-white/5 uppercase tracking-widest">MCP Tools</div>
                                {availablePrompts.map(p => (
                                    <button key={p.name} onClick={() => selectPrompt(p)} className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 text-xs text-gray-300 transition-colors border-b border-white/5 last:border-0">
                                        <div className="p-1.5 bg-white/10 rounded text-celestial-gold">
                                            <Command className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white mb-0.5">/{p.name}</div>
                                            <div className="text-[10px] text-gray-500 truncate">{p.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2 items-end bg-black/30 p-1.5 rounded-xl border border-white/10 focus-within:border-celestial-purple/50 transition-colors">
                            <label htmlFor="chat-input" className="sr-only">Type your message</label>
                            <input 
                                id="chat-input"
                                value={input} 
                                onChange={handleInputChange}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder={isZh ? "輸入指令或 / 呼叫工具..." : "Type or / for tools..."}
                                className="flex-1 bg-transparent border-none px-3 py-2 text-sm text-white outline-none placeholder-gray-600 min-h-[40px] max-h-24 resize-none"
                                autoComplete="off"
                            />
                            <button 
                                onClick={handleSend} 
                                disabled={!input.trim() || isTyping}
                                className="p-2 bg-white/10 rounded-lg text-white hover:bg-celestial-purple hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white/10"
                                aria-label="Send Message"
                            >
                                <Send className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                 </>
             )}

             {/* === TAB: ACTIONS === */}
             {activeTab === 'actions' && (
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-950/50">
                     {detectedActions.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50 space-y-2">
                             <CheckSquare className="w-10 h-10" />
                             <span className="text-xs">{isZh ? '尚無行動方針' : 'No Action Items'}</span>
                         </div>
                     ) : (
                         detectedActions.map((action) => (
                             <div key={action.id} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all group relative overflow-hidden">
                                 <div className={`absolute left-0 top-0 bottom-0 w-1 ${action.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                 <div className="flex justify-between items-start mb-2 pl-2">
                                     <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                         action.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                     }`}>
                                         {action.priority}
                                     </span>
                                     <span className="text-[9px] text-gray-600 font-mono">{new Date(action.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                 </div>
                                 <p className="text-xs text-gray-200 mb-3 leading-relaxed pl-2">{action.text}</p>
                                 <button 
                                     onClick={() => handleAddActionToTodo(action.id, action.text)}
                                     disabled={action.status === 'synced'}
                                     className={`w-full py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all ml-1 ${
                                         action.status === 'synced' 
                                             ? 'bg-emerald-500/10 text-emerald-400 cursor-default border border-emerald-500/20' 
                                             : 'bg-white/10 text-white hover:bg-celestial-purple/50 border border-white/5 hover:border-celestial-purple/50'
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

             {/* === TAB: LOGS === */}
             {activeTab === 'logs' && (
                 <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar font-mono text-[10px] bg-black/40">
                     {systemLogs.length === 0 && <div className="text-center text-gray-700 mt-10">System idle.</div>}
                     {systemLogs.map((log) => (
                         <div key={log.id} className="flex gap-2 animate-fade-in py-1 border-b border-white/5 last:border-0 hover:bg-white/5 px-1 rounded transition-colors">
                             <div className="text-gray-600 w-12 shrink-0">{new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}</div>
                             <div className="flex-1 break-words">
                                 <span className={`font-bold mr-2 uppercase tracking-wide ${
                                     log.type === 'error' ? 'text-red-500' : 
                                     log.type === 'warning' ? 'text-amber-500' : 
                                     log.source === 'Evolution' ? 'text-celestial-gold' :
                                     log.source === 'Insight' ? 'text-celestial-purple' :
                                     'text-blue-400'
                                 }`}>[{log.source}]</span>
                                 <span className="text-gray-400">{log.message}</span>
                             </div>
                         </div>
                     ))}
                     <div ref={logsEndRef} />
                 </div>
             )}
        </div>
      )}

      {/* --- CUSTOM AGENT MODAL (unchanged logic) --- */}
      {isEditingAgent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true" aria-label="Customize Agent">
              <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-indigo-500/10">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                              <Sparkles className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-white text-lg">{isZh ? '客製化 AI 人格設定' : 'Custom AI Persona'}</h3>
                      </div>
                      <button onClick={() => setIsEditingAgent(false)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white" aria-label="Close">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                      <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs text-gray-400 uppercase tracking-wider font-bold">
                              <span>{isZh ? '快速模板' : 'Presets'}</span>
                          </div>
                          <div className="flex gap-2">
                              {AGENT_PRESETS.map((preset, i) => (
                                  <button 
                                      key={i}
                                      onClick={() => handleApplyPreset(preset)}
                                      className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-all flex-1 text-left"
                                  >
                                      <div className="font-bold text-white mb-1">{preset.name}</div>
                                      <div className="line-clamp-1 opacity-50 text-[10px]">{preset.instruction}</div>
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">{isZh ? '顯示名稱' : 'Display Name'}</label>
                              <input 
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                  placeholder="My Custom AI"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">{isZh ? '系統指令 (System Instruction)' : 'System Instruction'}</label>
                              <textarea 
                                  value={editInstruction}
                                  onChange={(e) => setEditInstruction(e.target.value)}
                                  className="w-full h-24 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 outline-none text-sm leading-relaxed custom-scrollbar resize-none"
                                  placeholder="You are a helpful assistant..."
                              />
                              <p className="text-[10px] text-gray-500 mt-2">
                                  {isZh ? '定義 AI 的角色、語氣與專業知識。例如：「你是一位資深的 ESG 顧問...」' : 'Define the role, tone, and expertise. e.g., "You are a senior ESG consultant..."'}
                              </p>
                          </div>

                          {/* Knowledge Base Section */}
                          <div className="border-t border-white/10 pt-4">
                              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                                  <span className="flex items-center gap-2"><Database className="w-4 h-4 text-celestial-gold" /> {isZh ? '專屬知識庫 (RAG)' : 'Knowledge Base (RAG)'}</span>
                                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">{editKb.length} files</span>
                              </label>
                              
                              <div className="bg-slate-950/30 rounded-xl border border-white/10 p-3 space-y-3">
                                  {editKb.length > 0 ? (
                                      <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                          {editKb.map((item, idx) => (
                                              <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-xs">
                                                  <div className="flex items-center gap-2 truncate flex-1">
                                                      <FileText className="w-3 h-3 text-gray-400" />
                                                      <span className="text-gray-300 truncate">{getKbName(item)}</span>
                                                  </div>
                                                  <button onClick={() => removeKbItem(idx)} className="text-gray-500 hover:text-red-400 p-1">
                                                      <Trash2 className="w-3 h-3" />
                                                  </button>
                                              </div>
                                          ))}
                                      </div>
                                  ) : (
                                      <div className="text-center py-4 text-xs text-gray-500 border border-dashed border-white/10 rounded-lg">
                                          {isZh ? '尚無知識文件' : 'No documents uploaded'}
                                      </div>
                                  )}
                                  
                                  <button 
                                      onClick={() => kbInputRef.current?.click()}
                                      className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-lg text-xs text-gray-300 flex items-center justify-center gap-2 transition-all"
                                  >
                                      <Upload className="w-3 h-3" />
                                      {isZh ? '上傳文件 (.txt, .md, .csv)' : 'Upload Documents'}
                                  </button>
                                  <input 
                                      type="file" 
                                      ref={kbInputRef} 
                                      className="hidden" 
                                      onChange={handleKbUpload} 
                                      multiple 
                                      accept=".txt,.md,.csv,.json"
                                  />
                                  <p className="text-[10px] text-gray-500 px-1">
                                      {isZh ? '上傳後 AI 將優先參考此知識庫回答問題。若無相關資訊，AI 將委婉告知。' : 'AI will prioritize this knowledge base. If info is missing, it will politely inform you.'}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                      <button onClick={() => setIsEditingAgent(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">
                          {isZh ? '取消' : 'Cancel'}
                      </button>
                      <button 
                          onClick={handleSaveCustomAgent}
                          className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm flex items-center gap-2"
                      >
                          <CheckSquare className="w-4 h-4" />
                          {isZh ? '儲存並啟用' : 'Save & Activate'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};
