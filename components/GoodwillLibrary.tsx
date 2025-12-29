import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Language, View, QuantumNode } from '../types';
import { 
    BookOpen, Calendar, Users, Database, Search, ArrowRight, Heart, 
    Share2, Star, Download, ExternalLink, Library, FileText, 
    BarChart2, Lightbulb, GraduationCap, MessageSquare, X, Send, 
    Loader2, Sparkles, Book as BookIcon, ShieldCheck, Filter, Hash, GitBranch, Terminal, Eye, BrainCircuit
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence } from '../services/evolutionEngine';
import { streamChat } from '../services/ai-service';
import { marked } from 'marked';

// [萬能標籤節點] 輔助組件
const UniNode: React.FC<{ label: string, en: string, icon: any, color?: string }> = ({ label, en, icon: Icon, color = "text-white" }) => (
    <div className="uni-node border border-white/5 bg-black/40">
        <div className={`p-1.5 rounded bg-white/5 ${color}`}><Icon className="w-3 h-3" /></div>
        <div className="flex flex-col">
            <span className="zh-main text-[10px] leading-none">{label}</span>
            <span className="en-sub">{en}</span>
        </div>
    </div>
);

interface ChatMessage {
    role: 'user' | 'assistant';
    text: string;
    sources?: QuantumNode[];
    isRetrieving?: boolean;
}

interface GoodwillLibraryProps {
  language: Language;
  onNavigate?: (view: View) => void;
}

const BOOK_RAG_DATA: Record<string, { atom: string, vector: string[] }[]> = {
    "Net Positive": [
        { atom: "Net Positive 定義：一家公司如果能改善它所影響的每個人、每個規模的福祉，它就是『淨正向』的公司。", vector: ["definition", "impact"] }
    ],
    "Speed & Scale": [
        { atom: "2050 淨零計畫：電氣化一切、清理電網、修復食物系統、保護自然、清理工業。", vector: ["plan", "net zero"] }
    ]
};

export const GoodwillLibrary: React.FC<GoodwillLibraryProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'books' | 'club' | 'repo' | 'reports'>('reports');
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [chatBook, setChatBook] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
      Object.entries(BOOK_RAG_DATA).forEach(([bookTitle, chunks]) => {
          universalIntelligence.injectQuantumNodes(chunks, `Book_${bookTitle.replace(/\s/g, '_')}`);
      });
  }, []);

  const pageData = {
      title: { zh: '善向圖書館', en: 'Goodwill Library' },
      desc: { zh: '知識共享與社群共學的中心', en: 'Hub for Knowledge Sharing and Community Learning' },
      tag: { zh: '知識核心', en: 'KNOWLEDGE_CORE' }
  };

  const enterpriseReports = [
      { id: 'r1', company: 'TSMC 台積電', year: '2023', sector: 'Semiconductor', score: 'AA', highlight: 'Water Management', color: 'bg-emerald-600' },
      { id: 'r2', company: 'Delta 台達電', year: '2023', sector: 'Electronics', score: 'AAA', highlight: 'Energy Efficiency', color: 'bg-blue-600' },
  ];

  const filteredReports = enterpriseReports.filter(r => r.company.includes(reportSearchQuery));

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in pb-12 overflow-hidden">
        <UniversalPageHeader 
            icon={Library}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
            
            {/* 左側：內容展示 (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-3 min-h-0">
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl">
                    {[
                        { id: 'reports', label: isZh ? '企業永續年鑑' : 'Yearbook', icon: FileText },
                        { id: 'books', label: isZh ? '經典好書' : 'Books', icon: BookOpen },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pr-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredReports.map(report => (
                        <div key={report.id} className="glass-bento flex flex-col group hover:bg-white/5 transition-all border-white/5">
                            <div className={`h-24 ${report.color} relative p-4 flex flex-col justify-between overflow-hidden shrink-0`}>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                                <div className="relative z-10 flex justify-between">
                                    <span className="en-sub bg-black/40 px-2 py-0.5 rounded text-white">{report.year}_REPORT</span>
                                    <span className="zh-main text-white text-xl">{report.score}</span>
                                </div>
                                <h3 className="zh-main text-lg text-white relative z-10">{report.company}</h3>
                            </div>
                            <div className="p-3 space-y-4">
                                <div className="space-y-1">
                                    <span className="en-sub opacity-40">Highlight_Value</span>
                                    <div className="zh-main text-[11px] text-emerald-400 flex items-center gap-2"><Star className="w-3 h-3 fill-current"/> {report.highlight}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button className="en-sub bg-white/5 py-1 rounded hover:bg-celestial-gold hover:text-black transition-all">Analyze</button>
                                    <button className="en-sub bg-white/5 py-1 rounded hover:bg-celestial-purple transition-all">Summary</button>
                                    <button className="en-sub bg-white/5 py-1 rounded hover:bg-emerald-500 transition-all">Standard</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 右側：搜尋與過濾 (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0">
                <div className="glass-bento p-5 flex flex-col bg-slate-900/40">
                    <UniNode label="進階檢索" en="Deep_Search" icon={Search} color="text-celestial-gold" />
                    <div className="mt-4 space-y-4">
                        <div className="relative">
                            <input 
                                value={reportSearchQuery}
                                onChange={e => setReportSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white focus:ring-1 focus:ring-celestial-gold outline-none"
                                placeholder={isZh ? "輸入企業關鍵字..." : "Company keyword..."}
                            />
                        </div>
                        <div className="space-y-2">
                            <h5 className="en-sub opacity-40">Sector_Filter</h5>
                            <div className="flex flex-wrap gap-1.5">
                                {['Tech', 'Finance', 'Energy', 'Steel'].map(s => (
                                    <button key={s} className="en-sub px-2 py-1 bg-white/5 rounded-md hover:border-white/20 border border-transparent">{s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-5 flex-1 flex flex-col bg-slate-900/40 border-white/5">
                    <UniNode label="原子知識軌跡" en="Atomic_Knowledge_Trail" icon={GitBranch} color="text-celestial-purple" />
                    <div className="mt-4 space-y-2 overflow-y-auto no-scrollbar">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-3 bg-black/20 border border-white/5 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="uni-mini bg-slate-800 text-gray-500">K_{i}02</span>
                                    <div className="en-sub text-emerald-500 font-bold">LATEST</div>
                                </div>
                                <h5 className="zh-main text-[11px] text-gray-200">2024 IFRS S1/S2 揭露邏輯</h5>
                                <span className="en-sub opacity-30 mt-1 block">Vectorized_Node_Relay</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};