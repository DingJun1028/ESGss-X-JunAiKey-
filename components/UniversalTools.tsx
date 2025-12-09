
import React, { useState } from 'react';
import { Language } from '../types';
import { 
    Wrench, Book, Calendar as CalendarIcon, StickyNote, Database, Search, 
    ArrowRight, Check, X, Link as LinkIcon, RefreshCw, ChevronLeft, ChevronRight, 
    Plus, Trash2, Edit2, Save, Share, Copy, Download, Wand2, ClipboardList, Bot, Zap, Clock
} from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';

interface UniversalToolsProps {
  language: Language;
}

const GLOSSARY = [
    { term: 'Scope 1', def: 'Direct emissions from owned or controlled sources.' },
    { term: 'Scope 2', def: 'Indirect emissions from the generation of purchased energy.' },
    { term: 'Scope 3', def: 'All other indirect emissions that occur in the value chain.' },
    { term: 'CBAM', def: 'Carbon Border Adjustment Mechanism (EU carbon tariff).' },
];

const INTEGRATIONS = [
    { id: 'sap', name: 'SAP S/4HANA', status: 'connected', type: 'ERP' },
    { id: 'salesforce', name: 'Salesforce Net Zero', status: 'connected', type: 'CRM' },
];

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { universalNotes, addNote, updateNote, deleteNote } = useCompany();
  
  const [activeTool, setActiveTool] = useState<'notes' | 'library' | 'calendar' | 'integration' | 'ai'>('ai'); // Default to AI tools for visibility
  const [searchTerm, setSearchTerm] = useState('');
  
  // Note CRUD State
  const [noteInput, setNoteInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');

  const tools = [
      { id: 'ai', icon: Bot, label: isZh ? 'AI 工具箱' : 'AI Tools', color: 'bg-celestial-purple/20 text-celestial-purple border-celestial-purple/30' },
      { id: 'notes', icon: StickyNote, label: isZh ? '筆記' : 'Notes', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      { id: 'library', icon: Book, label: isZh ? '智庫' : 'Library', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      { id: 'calendar', icon: CalendarIcon, label: isZh ? '日曆' : 'Calendar', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      { id: 'integration', icon: Database, label: isZh ? '集成' : 'Connect', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  ];

  const handleConnect = (id: string) => {
      addToast('info', isZh ? '正在建立安全連線...' : 'Establishing secure handshake...', 'Integration');
      setTimeout(() => {
          addToast('success', isZh ? '連線成功' : 'Connection Established', 'System');
      }, 1500);
  };

  const handleAddNote = () => {
      if(!noteInput.trim()) return;
      addNote(noteInput, ['Manual']);
      setNoteInput('');
      addToast('success', isZh ? '筆記已儲存' : 'Note saved', 'System');
  };

  const handleImportFromClipboard = async () => {
      try {
          const text = await navigator.clipboard.readText();
          if (text) {
              addNote(text, ['Imported']);
              addToast('success', isZh ? '已從剪貼簿匯入' : 'Imported from Clipboard', 'Shortcuts');
          } else {
              addToast('info', isZh ? '剪貼簿為空' : 'Clipboard empty', 'System');
          }
      } catch (err) {
          addToast('error', isZh ? '無法存取剪貼簿' : 'Clipboard access denied', 'Error');
      }
  };

  const handleShareList = () => {
      const notesText = universalNotes.map(n => `- ${n.content}`).join('\n');
      if (navigator.share) {
          navigator.share({
              title: 'ESGss Notes',
              text: notesText
          }).catch(console.error);
      } else {
          navigator.clipboard.writeText(notesText);
          addToast('success', isZh ? '清單已複製' : 'List copied to clipboard', 'Share');
      }
  };

  const handleUpdateNote = (id: string) => {
      if(!editInput.trim()) return;
      updateNote(id, editInput);
      setEditingNoteId(null);
      addToast('success', 'Note updated', 'System');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 h-full flex flex-col">
        {/* Header Area */}
        <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{isZh ? '萬能工作專區' : 'Universal Workspace'}</h2>
                    <p className="text-gray-400 text-sm">{isZh ? '您的個人化永續生產力中心' : 'Your personalized sustainability productivity hub'}</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* Left Rail - Tools Widget (Compact) */}
            <div className="lg:w-20 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible shrink-0 pb-2">
                {tools.map((tool: any) => (
                    <button 
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id as any)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border w-20 h-20 shrink-0 ${activeTool === tool.id ? `${tool.color} shadow-lg scale-105` : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                        <tool.icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">{tool.label}</span>
                    </button>
                ))}
            </div>

            {/* Right Side - Usable Workspace */}
            <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden relative bg-slate-900/50">
                
                {activeTool === 'notes' && (
                    <div className="flex flex-col h-full">
                        {/* Apple Shortcuts-style Action Bar */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex gap-3 overflow-x-auto no-scrollbar items-center">
                            <button onClick={handleImportFromClipboard} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/30 hover:bg-blue-500/30 transition-all whitespace-nowrap">
                                <ClipboardList className="w-3.5 h-3.5" />
                                {isZh ? '貼上' : 'Paste'}
                            </button>
                            <button onClick={handleShareList} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-all whitespace-nowrap">
                                <Share className="w-3.5 h-3.5" />
                                {isZh ? '分享清單' : 'Share List'}
                            </button>
                            <div className="w-[1px] h-6 bg-white/10 mx-1" />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{isZh ? '快速筆記' : 'Quick Note'}</span>
                        </div>

                        {/* Input Area - Always usable */}
                        <div className="p-4 shrink-0">
                            <div className="flex gap-2 relative group">
                                <input 
                                    type="text"
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                    placeholder={isZh ? "輸入想法，按 Enter 儲存..." : "Type a note, press Enter to save..."}
                                    className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-500/50 transition-all text-sm shadow-inner"
                                />
                                <button 
                                    onClick={handleAddNote} 
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-500/80 hover:bg-yellow-500 text-black rounded-lg transition-all opacity-0 group-focus-within:opacity-100"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notes List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-3">
                            {universalNotes.length === 0 ? (
                                <div className="text-center text-gray-500 py-12 flex flex-col items-center">
                                    <StickyNote className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-sm">{isZh ? '這裡空空如也，開始記錄吧！' : 'Workspace empty. Start typing!'}</p>
                                </div>
                            ) : (
                                universalNotes.map(note => (
                                    <div key={note.id} className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all flex justify-between items-start gap-4">
                                        {editingNoteId === note.id ? (
                                            <div className="flex-1 flex gap-2">
                                                <input 
                                                    value={editInput}
                                                    onChange={e => setEditInput(e.target.value)}
                                                    className="flex-1 bg-black/30 text-white px-3 py-2 rounded-lg border border-white/20 outline-none focus:border-yellow-500/50"
                                                    autoFocus
                                                />
                                                <button onClick={() => handleUpdateNote(note.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"><Check className="w-4 h-4" /></button>
                                                <button onClick={() => setEditingNoteId(null)} className="p-2 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20"><X className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">{note.content}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="text-[10px] text-gray-500 font-mono">{new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                        {note.tags?.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-gray-400 uppercase">{t}</span>)}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingNoteId(note.id); setEditInput(note.content); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => deleteNote(note.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTool === 'ai' && (
                    <div className="flex flex-col h-full animate-fade-in p-6 overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-6">{isZh ? 'Gemini AI 工具箱' : 'Gemini AI Toolkit'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-celestial-purple/50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Wand2 className="w-5 h-5"/></div>
                                    <h4 className="font-bold text-white">通用任務執行器 (Task Executor)</h4>
                                </div>
                                <p className="text-xs text-gray-400">{isZh ? '自動化日常流程，提升 ESG 研究效率。' : 'Universal task executor for automating routines.'}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-celestial-purple/50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-celestial-purple/20 rounded-lg text-celestial-purple"><Bot className="w-5 h-5"/></div>
                                    <h4 className="font-bold text-white">聊天機器人 (Chat Bot)</h4>
                                </div>
                                <p className="text-xs text-gray-400">{isZh ? '具備上下文感知的智能對話助手，隨時待命。' : 'Context-aware intelligent conversation assistant.'}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-celestial-purple/50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-celestial-gold/20 rounded-lg text-celestial-gold"><Zap className="w-5 h-5"/></div>
                                    <h4 className="font-bold text-white">思考模式 (Thinking Mode)</h4>
                                </div>
                                <p className="text-xs text-gray-400">{isZh ? '啟動深度推理 (CoT)，解決複雜邏輯與策略問題。' : 'Activate deep reasoning for complex logic problems.'}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-celestial-purple/50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Clock className="w-5 h-5"/></div>
                                    <h4 className="font-bold text-white">低延遲回應器 (Low Latency)</h4>
                                </div>
                                <p className="text-xs text-gray-400">{isZh ? '使用 Flash 模型進行極速回應，減少等待時間。' : 'High-speed response using Flash models.'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTool === 'library' && (
                    <div className="flex flex-col h-full animate-fade-in p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{isZh ? '永續術語庫' : 'Glossary'}</h3>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={isZh ? "搜尋..." : "Search..."}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar flex-1">
                            {GLOSSARY.filter(g => g.term.toLowerCase().includes(searchTerm.toLowerCase())).map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                                    <h4 className="font-bold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">{item.term}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">{item.def}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Simplified Placeholders for other tools */}
                {activeTool === 'calendar' && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Calendar View</p>
                        </div>
                    </div>
                )}
                {activeTool === 'integration' && (
                    <div className="flex flex-col h-full animate-fade-in p-6">
                         <h3 className="text-xl font-bold text-white mb-6">{isZh ? '數據連接器' : 'Connectors'}</h3>
                         <div className="space-y-3">
                            {INTEGRATIONS.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Database className="w-5 h-5 text-purple-400" />
                                        <span className="font-bold text-sm text-white">{app.name}</span>
                                    </div>
                                    <button onClick={() => handleConnect(app.id)} className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white border border-white/10 transition-all">
                                        {isZh ? '重連' : 'Reconnect'}
                                    </button>
                                </div>
                            ))}
                         </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
