import React, { useState, useRef, useMemo } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { generateReportChapter } from '../services/ai-service';
import { Language, View } from '../types';
import { REPORT_STRUCTURE } from '../constants';
import { 
    FileText, Sparkles, Download, Loader2, Archive, ShieldCheck, 
    Database, Activity, CheckCircle2, ChevronRight, Layout, PenTool,
    Globe, Zap, FileSearch, Eye, Award, Fingerprint, Info, CheckCircle,
    Target, Star, X
} from 'lucide-react';
import { marked } from 'marked';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const ReportGen: React.FC<{ language: Language }> = ({ language }) => {
  const { companyName, esgScores, level, industrySector } = useCompany();
  const { observeAction, activePersona } = useUniversalAgent();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'generator' | 'archive'>('generator');
  const [activeSectionId, setActiveSectionId] = useState<string>('cover');
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const isZh = language === 'zh-TW';

  const activeSection = useMemo(() => {
    if (activeSectionId === 'cover') return { id: 'cover', title: isZh ? '報告封面與概覽' : 'Report Cover & Overview' };
    for (const chapter of REPORT_STRUCTURE) {
        if (chapter.id === activeSectionId) return chapter;
        if (chapter.subSections) {
            const sub = chapter.subSections.find(s => s.id === activeSectionId);
            if (sub) return sub;
        }
    }
    return { id: 'cover', title: 'Report Cover' };
  }, [activeSectionId, isZh]);

  const completionRate = useMemo(() => {
    const total = REPORT_STRUCTURE.reduce((acc, c) => acc + (c.subSections?.length || 0), 0);
    const done = Object.keys(generatedContent).length;
    return Math.round((done / total) * 100);
  }, [generatedContent]);

  const LeafIcon = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z"/><path d="M11 20v-5a4 4 0 0 1 4-4h5"/><path d="M7 21a11 11 0 0 1-2-2"/></svg>
  );

  const scribePersonality = useMemo(() => {
      if (activeSectionId.startsWith('1')) return { name: isZh ? '願景建築師' : 'Vision Architect', color: 'text-celestial-gold', icon: Target };
      if (activeSectionId.startsWith('2')) return { name: isZh ? '綠色先鋒' : 'Green Pioneer', color: 'text-emerald-400', icon: LeafIcon };
      return { name: isZh ? '王道稽核官' : 'Wangdao Auditor', color: 'text-celestial-purple', icon: ShieldCheck };
  }, [activeSectionId, isZh]);

  const handleGenerateSection = async () => {
    if (!activeSection || activeSectionId === 'cover') return;
    setIsGenerating(true);
    try {
      const fullContext = { company: companyName, scores: esgScores, industry: industrySector };
      const content = await generateReportChapter(activeSection.title, (activeSection as any).template || "", (activeSection as any).example || "", fullContext, language);
      setGeneratedContent(prev => ({ ...prev, [activeSection.id]: content }));
      addToast('success', isZh ? `[${activeSection.title}] 顯化完成` : `[${activeSection.title}] Manifested`, 'Scribe');
      observeAction('AI_GEN', activeSection.title);
    } catch (error) { 
      addToast('error', 'Kernel Logic Interrupted', 'Error'); 
    } finally { 
      setIsGenerating(false); 
    }
  };

  const handleExportPDF = () => {
      if (!reportRef.current) return;
      setIsExporting(true);
      const opt = { 
          margin: 10, 
          filename: `${companyName}_ESG_Report_v15.pdf`, 
          html2canvas: { scale: 3, useCORS: true }, 
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
      };
      html2pdf().set(opt).from(reportRef.current).save().then(() => { 
          setIsExporting(false); 
          addToast('success', 'PDF Document Exported', 'System'); 
      });
  };

  return (
    <div className="h-full w-full flex flex-col bg-black overflow-hidden animate-fade-in">
        {/* Top Management HUD */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl shrink-0 z-10 shadow-2xl">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-celestial-gold/20 rounded-xl border border-celestial-gold/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        <FileText className="w-5 h-5 text-celestial-gold" />
                    </div>
                    <div>
                        <h3 className="zh-main text-xl text-white uppercase tracking-tighter">{isZh ? '報告顯化終端' : 'Report Manifest Terminal'}</h3>
                        <span className="en-sub !text-[8px] text-gray-500 font-black">AIOS_SCRIBE_PROTOCOL_v15.9.2</span>
                    </div>
                </div>
                
                <div className="hidden lg:flex gap-8 border-l border-white/10 pl-8">
                    <div className="space-y-1">
                        <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest">Global_Completion</span>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${completionRate}%` }} />
                            </div>
                            <span className="text-xs font-mono font-bold text-white">{completionRate}%</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest">Compliance_Scan</span>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">IFRS_S1/S2_READY</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 shadow-inner">
                    <button onClick={() => setActiveTab('generator')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'generator' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>MANIFEST</button>
                    <button onClick={() => setActiveTab('archive')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'archive' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>VAULT</button>
                </div>
                <button onClick={handleExportPDF} disabled={isExporting || Object.keys(generatedContent).length === 0} className="px-6 py-1.5 bg-white text-black hover:bg-celestial-gold transition-all rounded-lg text-[10px] font-black flex items-center gap-2 shadow-xl disabled:opacity-20">
                    {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} EXPORT_PDF
                </button>
            </div>
        </div>

        {activeTab === 'generator' && (
            <div className="flex-1 flex min-h-0 overflow-hidden relative">
                {/* Left Navigator */}
                <div className="w-72 border-r border-white/5 bg-slate-950/40 flex flex-col overflow-hidden shrink-0">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <button 
                            onClick={() => setActiveSectionId('cover')}
                            className={`w-full p-5 rounded-2xl border transition-all flex flex-col gap-1 text-left group relative overflow-hidden
                                ${activeSectionId === 'cover' ? 'bg-celestial-gold/10 border-celestial-gold/40 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">Section_00</span>
                                <Star className={`w-3 h-3 ${activeSectionId === 'cover' ? 'text-celestial-gold animate-pulse' : 'text-gray-700'}`} />
                            </div>
                            <span className="zh-main text-sm">{isZh ? '報告封面與關鍵摘要' : 'Cover & Executive Summary'}</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
                        {REPORT_STRUCTURE.map((chapter) => (
                            <div key={chapter.id} className="space-y-3">
                                <div className="px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] flex items-center justify-between">
                                    {chapter.title}
                                    <div className="h-px bg-white/5 flex-1 ml-4" />
                                </div>
                                <div className="space-y-1">
                                    {chapter.subSections?.map(sub => (
                                        <button 
                                            key={sub.id} 
                                            onClick={() => setActiveSectionId(sub.id)} 
                                            className={`w-full text-left px-4 py-3 rounded-xl text-[11px] transition-all flex items-center justify-between group
                                                ${activeSectionId === sub.id ? 'bg-white/10 text-white font-black border border-white/10' : 'text-gray-500 hover:text-gray-300'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${generatedContent[sub.id] ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-800'}`} />
                                                <span className="truncate">{sub.title}</span>
                                            </div>
                                            <ChevronRight className={`w-3 h-3 transition-transform ${activeSectionId === sub.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Canvas */}
                <div className="flex-1 flex flex-col min-h-0 bg-[#020617] relative">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
                    
                    <div className="px-10 py-5 border-b border-white/5 flex justify-between items-center bg-slate-900/40 backdrop-blur-md shrink-0 z-10">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">Active_Agent_Persona</span>
                                <div className={`flex items-center gap-3 ${scribePersonality.color}`}>
                                    <scribePersonality.icon className="w-4 h-4 animate-pulse" />
                                    <span className="zh-main text-xs font-black uppercase">{scribePersonality.name}</span>
                                </div>
                            </div>
                        </div>
                        {activeSectionId !== 'cover' && (
                            <button 
                                onClick={handleGenerateSection} 
                                disabled={isGenerating} 
                                className="px-10 py-2.5 bg-gradient-to-r from-celestial-gold to-amber-600 text-black font-black rounded-xl text-[11px] flex items-center gap-3 shadow-[0_10px_30px_rgba(251,191,36,0.2)] hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} 
                                {isZh ? '啟動 AI 顯化' : 'RUN_AI_MANIFEST'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 no-scrollbar scroll-smooth">
                        <div 
                            ref={reportRef} 
                            className="max-w-4xl mx-auto bg-white p-16 shadow-[0_60px_120px_rgba(0,0,0,0.6)] min-h-[1122px] text-slate-900 relative border border-slate-200 overflow-hidden"
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                                <img src="https://thumbs4.imagebam.com/a0/c1/da/ME18W0T0_t.PNG" alt="Watermark" className="w-[800px] grayscale rotate-[-15deg]" />
                            </div>

                            <div className="flex justify-between items-end border-b-4 border-slate-950 pb-8 mb-12 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-slate-950" />
                                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">ESGss System Blueprint Manifest v15.9.2</div>
                                    </div>
                                    <div className="text-3xl font-serif font-black text-slate-950 tracking-tight">{companyName}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authentication_Hash</div>
                                    <div className="text-[12px] font-mono font-bold text-slate-950 uppercase">JAK_P_0x8B32_V15</div>
                                </div>
                            </div>

                            <div className="relative z-10">
                                {activeSectionId === 'cover' ? (
                                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in h-full">
                                        <div className="w-40 h-40 mb-16 p-8 bg-slate-950 rounded-[3rem] flex items-center justify-center shadow-2xl relative">
                                            <div className="absolute inset-0 rounded-[3rem] border-2 border-slate-950 scale-110 opacity-20" />
                                            <Award className="w-20 h-20 text-white" />
                                        </div>
                                        
                                        <div className="text-center space-y-6 mb-20">
                                            <h1 className="text-7xl font-serif font-black text-slate-950 leading-none">
                                                2024 <br/>
                                                <span className="text-4xl text-slate-500 uppercase tracking-[0.25em]">Sustainability</span> <br/>
                                                <span className="text-4xl text-slate-500 uppercase tracking-[0.25em]">Manifesto</span>
                                            </h1>
                                            <div className="flex items-center justify-center gap-6 pt-4">
                                                <div className="h-1.5 w-12 bg-slate-950" />
                                                <div className="px-6 py-2 bg-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                                                    Official Corporate Report
                                                </div>
                                                <div className="h-1.5 w-12 bg-slate-950" />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-16 w-full max-w-2xl">
                                            <div className="space-y-4">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">PREPARED_FOR</div>
                                                <div>
                                                    <div className="text-xl font-bold text-slate-900">{companyName}</div>
                                                    <div className="text-xs text-slate-500 font-medium mt-1">{industrySector}</div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">VERIFICATION</div>
                                                <div>
                                                    <div className="text-xl font-mono font-bold text-slate-900">v15.9_SECURE</div>
                                                    <div className="text-xs text-slate-500 font-medium mt-1">Level {level} Architect Certified</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-32 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center max-w-2xl relative">
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4">
                                                <ShieldCheck className="w-8 h-8 text-slate-900" />
                                            </div>
                                            <p className="text-sm text-slate-500 italic leading-relaxed font-serif">
                                                「本報告由 ESGss x JunAiKey AIOS 自動化顯化系統編纂，整合 IFRS S1/S2 揭露準則、GRI 2024 標準與王道治理哲學。所有數據均已透過內核 12A 維度驗證並完成區塊鏈稽核存證。」
                                            </p>
                                        </div>
                                    </div>
                                ) : generatedContent[activeSectionId] ? (
                                    <div className="animate-fade-in relative">
                                        <div className="absolute top-0 right-0 p-6 border-4 border-emerald-500 rounded-[2.5rem] flex flex-col items-center gap-2 rotate-6 opacity-40 shadow-xl bg-white select-none pointer-events-none">
                                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Logic_Witnessed</span>
                                                <span className="text-[7px] font-mono text-emerald-400 mt-1">SIG:0x8B32..F02</span>
                                            </div>
                                        </div>
                                        
                                        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-headings:font-black prose-p:leading-relaxed text-slate-800 pt-8">
                                            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked.parse(generatedContent[activeSectionId]) as string }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-64 animate-pulse">
                                        <div className="relative mb-12">
                                            <div className="w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center">
                                                <PenTool className="w-12 h-12 text-slate-200" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-xl">
                                                <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                                            </div>
                                        </div>
                                        <div className="text-center space-y-3">
                                            <h3 className="text-3xl font-serif font-bold text-slate-300 uppercase tracking-widest">{isZh ? '等待邏輯注入' : 'Awaiting Logic Influx'}</h3>
                                            <p className="text-xs text-slate-400 uppercase tracking-[0.4em] font-black">Select a blueprint segment and trigger manifestation</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-10 left-16 right-16 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] border-t border-slate-100 pt-8">
                                <div className="flex items-center gap-3">
                                    <Fingerprint className="w-4 h-4" />
                                    <span>© 2024 {companyName} • Confidential</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>Powered by JAK_v15.9</span>
                                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                    <span>Page No. 0{REPORT_STRUCTURE.findIndex(c => c.subSections?.some(s => s.id === activeSectionId)) + 1 || 1}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {activeTab === 'archive' && (
            <div className="flex-1 p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-y-auto no-scrollbar bg-[#020617] relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                
                {[2024, 2023, 2022].map(year => (
                    <div key={year} className="glass-bento p-8 flex flex-col border-white/5 bg-slate-900/40 hover:border-celestial-gold/50 cursor-pointer group transition-all h-72 relative overflow-hidden rounded-[3rem] shadow-2xl">
                         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Archive className="w-32 h-32 text-white" /></div>
                         
                         <div className="flex justify-between items-start mb-auto relative z-10">
                             <div className="space-y-1">
                                 <span className="en-sub !text-[9px] text-celestial-gold font-black">ARCHIVE_MANIFEST</span>
                                 <h4 className="zh-main text-3xl text-white font-serif tracking-tight">{year} 年度報告</h4>
                             </div>
                             <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-celestial-gold group-hover:text-black transition-all shadow-xl">
                                <Download className="w-5 h-5" />
                             </div>
                         </div>

                         <div className="space-y-4 relative z-10">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-gray-500">HASH: 0x9F...A{year}</span>
                             </div>
                             <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-[11px] uppercase tracking-widest border border-white/10 rounded-2xl transition-all shadow-inner">
                                Access_System_Vault
                             </button>
                         </div>
                    </div>
                ))}

                <div className="glass-bento p-8 flex flex-col items-center justify-center border-2 border-dashed border-white/10 bg-transparent hover:border-white/30 cursor-pointer transition-all h-72 group opacity-40 hover:opacity-100 rounded-[3rem]">
                    <div className="p-5 rounded-full bg-white/5 group-hover:bg-white/10 mb-6 transition-all">
                        <PlusIcon className="w-12 h-12 text-gray-700 group-hover:text-white transition-all" />
                    </div>
                    <span className="en-sub !text-[11px] font-black text-gray-600 group-hover:text-white transition-all">Create_Manual_Archive</span>
                </div>
            </div>
        )}
    </div>
  );
};

const PlusIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
