
import React, { useState, useEffect } from 'react';
import { 
    Cpu, Globe, Zap, Settings, ShieldCheck, Database, 
    Link, Plus, Trash2, RefreshCw, Info, Terminal, 
    ArrowRight, Loader2, Code, Box, Radio, ExternalLink, BookOpen,
    Github, Sparkles, Workflow
} from 'lucide-react';
import { Language, McpServer } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence } from '../services/evolutionEngine';
import { useToast } from '../contexts/ToastContext';

export const McpConfig: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [servers, setServers] = useState<McpServer[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const sub = universalIntelligence.mcpServers$.subscribe(setServers);
    return () => sub.unsubscribe();
  }, []);

  const handleAddServer = () => {
    if (!newUrl.trim() || !newName.trim()) return;
    const id = newName.toLowerCase().replace(/\s+/g, '-');
    universalIntelligence.addMcpServer({
        id,
        name: newName,
        url: newUrl,
        transport: 'streamable_http'
    });
    setNewUrl('');
    setNewName('');
    addToast('info', isZh ? '正在建立 MCP 握手協定...' : 'Establishing MCP Handshake...', 'Nexus');
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Globe}
            title={{ zh: 'MCP 內容協議管理', en: 'MCP Context Protocol' }}
            description={{ zh: '管理模型內容協議：連結外部工具、資源與即時上下文', en: 'Managing Model Context Protocols: Linking tools, resources & real-time context.' }}
            language={language}
            tag={{ zh: '通訊內核 v1.0', en: 'MCP_NEXUS_V1.0' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            {/* Left: Server Registration (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                <div className="glass-bento p-8 bg-slate-900/60 border-white/5 rounded-[2.5rem] shadow-2xl shrink-0">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <Plus className="w-5 h-5 text-emerald-500" />
                        {isZh ? '註冊新 MCP 伺服器' : 'Register New MCP'}
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Server Designation</label>
                            <input 
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="e.g. GitHub_Context"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Endpoint URL (SSE/HTTP)</label>
                            <input 
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="https://mcp.provider.com/sse"
                            />
                        </div>
                        <button 
                            onClick={handleAddServer}
                            disabled={!newUrl || !newName}
                            className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-emerald-500 transition-all disabled:opacity-30 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                        >
                            <Link className="w-4 h-4" />
                            AUTHORIZE_NEXUS
                        </button>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 bg-slate-950 border-white/10 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Info className="w-4 h-4" /> INTEGRATION_INDEX</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                                <span className="text-xs font-bold text-white">OpenAI Direct API</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                Universal integration with OpenAI's large language models. Access advanced reasoning and embedding capabilities directly via MCP.
                            </p>
                            <a 
                                href="https://platform.openai.com/docs/api-reference" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-xl text-[10px] flex items-center justify-center gap-2 border border-emerald-500/30 transition-all"
                            >
                                <ExternalLink className="w-3 h-3" /> OpenAI API Documentation
                            </a>
                        </div>

                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <Workflow className="w-5 h-5 text-purple-400" />
                                <span className="text-xs font-bold text-white">AgenticFlow API</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                Orchestrate autonomous agent workflows and manage context chains through the AgenticFlow protocol.
                            </p>
                            <a 
                                href="https://docs.agenticflow.ai" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold rounded-xl text-[10px] flex items-center justify-center gap-2 border border-purple-500/30 transition-all"
                            >
                                <ExternalLink className="w-3 h-3" /> AgenticFlow Documentation
                            </a>
                        </div>

                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <Github className="w-5 h-5 text-white" />
                                <span className="text-xs font-bold text-white">GitHub API Nexus</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                Direct integration with GitHub REST API via MCP. Allows agents to search code and fetch repository documentation for RAG.
                            </p>
                            <a 
                                href="https://docs.github.com/en/rest" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold rounded-xl text-[10px] flex items-center justify-center gap-2 border border-indigo-500/30 transition-all"
                            >
                                <ExternalLink className="w-3 h-3" /> GitHub API Documentation
                            </a>
                        </div>
                        
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
                            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Spec</h5>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                                    <div className="text-[8px] text-gray-600 font-black uppercase">Transport</div>
                                    <div className="text-[10px] text-emerald-400 font-mono">SSE / HTTP</div>
                                </div>
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                                    <div className="text-[8px] text-gray-600 font-black uppercase">Direct</div>
                                    <div className="text-[10px] text-blue-400 font-mono">True</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Active Servers & Tools (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                <div className="flex-1 glass-bento p-8 bg-slate-900/40 border-white/5 rounded-[3rem] shadow-2xl flex flex-col min-h-0 overflow-hidden">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div className="flex