
import React, { useState, useRef } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { generateReportChapter, auditReportContent } from '../services/ai-service';
import { Language, ReportSection } from '../types';
import { REPORT_STRUCTURE } from '../constants';
import { FileText, Sparkles, Download, Loader2, Save, ChevronRight, BookOpen, ShieldCheck, CheckCircle, Info } from 'lucide-react';
import { marked } from 'marked';
import { useToast } from '../contexts/ToastContext';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { LockedFeature } from './LockedFeature';
import { SubscriptionModal } from './SubscriptionModal';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ReportGenProps {
  language: Language;
}

// ----------------------------------------------------------------------
// Agent: Chapter Node (The Scribe)
// ----------------------------------------------------------------------
interface ChapterNodeProps extends InjectedProxyProps {
    section: ReportSection; // Actually a sub-section
    isActive: boolean;
    hasContent: boolean;
    onClick: () => void;
}

const ChapterNodeBase: React.FC<ChapterNodeProps> = ({ 
    section, isActive, hasContent, onClick, 
    adaptiveTraits, trackInteraction, isAgentActive 
}) => {
    
    // Agent Traits
    const isOptimized = adaptiveTraits?.includes('optimization'); // AI Content Generated
    const isEvolved = adaptiveTraits?.includes('evolution'); // High Interaction
    
    return (
        <button 
            onClick={() => { onClick(); trackInteraction?.('click'); }}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 group relative
                ${isActive ? 'bg-celestial-emerald/10 text-celestial-emerald font-medium' : 'text-gray-500 hover:text-gray-300'}
            `}
        >
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 
                ${hasContent ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-gray-700'}
                ${isOptimized ? 'animate-pulse scale-125' : ''}
            `} />
            
            <span className="truncate flex-1">{section.title}</span>
            
            {/* Agent Status Icon */}
            {isAgentActive && (
                <Sparkles className="w-3 h-3 text-celestial-gold animate-spin-slow" />
            )}
            
            {/* Completion Check */}
            {hasContent && isEvolved && (
                <CheckCircle className="w-3 h-3 text-emerald-500 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </button>
    );
};

const ChapterAgent = withUniversalProxy(ChapterNodeBase);


// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const ReportGen: React.FC<ReportGenProps> = ({ language }) => {
  const { companyName, esgScores, totalScore, carbonCredits, budget, tier } = useCompany();
  const { addToast } = useToast();
  
  const [activeSectionId, setActiveSectionId] = useState<string>('1.01');
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const isZh = language === 'zh-TW';

  const getActiveSectionData = (): ReportSection | undefined => {
    for (const chapter of REPORT_STRUCTURE) {
        if (chapter.id === activeSectionId) return chapter;
        if (chapter.subSections) {
            const sub = chapter.subSections.find(s => s.id === activeSectionId);
            if (sub) return sub;
        }
    }
    return undefined;
  };
  
  const getParentChapter = (subId: string): ReportSection | undefined => {
      return REPORT_STRUCTURE.find(c => c.subSections?.some(s => s.id === subId));
  };

  const activeSection = getActiveSectionData();
  const parentChapter = activeSectionId ? getParentChapter(activeSectionId) : undefined;

  const handleGenerateSection = async () => {
    if (tier === 'Free') {
        setShowSubModal(true);
        return;
    }
    if (!activeSection) return;
    setIsGenerating(true);
    try {
      const contextData = {
        company: companyName, scores: esgScores, overall_esg_score: totalScore,
        carbon_credits_inventory: carbonCredits, financial_budget_remaining: budget,
        reporting_year: new Date().getFullYear(),
      };
      const content = await generateReportChapter(activeSection.title, activeSection.template || "", activeSection.example || "", contextData, language);
      setGeneratedContent(prev => ({ ...prev, [activeSection.id]: content }));
      addToast('success', isZh ? '草稿生成完成' : 'Draft generated', 'AI Reporter');
    } catch (error) { addToast('error', 'Failed', 'Error'); } finally { setIsGenerating(false); }
  };

  const handleAuditSection = async () => {
      if (tier === 'Free') {
          setShowSubModal(true);
          return;
      }
      const content = generatedContent[activeSectionId];
      if (!content || !activeSection) return;
      
      setIsAuditing(true);
      setAuditResult(null);
      addToast('info', isZh ? '正在進行合規性稽核 (GRI Standards)...' : 'Auditing against GRI Standards...', 'AI Auditor');
      
      try {
          const result = await auditReportContent(activeSection.title, content, activeSection.griStandards || 'GRI Universal', language);
          setAuditResult(result);
      } catch (e) {
          addToast('error', 'Audit failed', 'Error');
      } finally {
          setIsAuditing(false);
      }
  };

  const handleExportPDF = () => {
      if (!reportRef.current) return;
      setIsExporting(true);
      const element = reportRef.current;
      const opt = { 
          margin: 10, 
          filename: `Report_${new Date().getFullYear()}.pdf`, 
          image: { type: 'jpeg' as const, quality: 0.98 }, 
          html2canvas: { scale: 2 }, 
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const } 
      };
      html2pdf().set(opt).from(element).save().then(() => { setIsExporting(false); addToast('success', 'PDF Downloaded.', 'System'); });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in gap-4">
        <SubscriptionModal isOpen={showSubModal} onClose={() => setShowSubModal(false)} language={language} />
        
        <div className="flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-celestial-purple/10 rounded-xl border border-celestial-purple/20">
                    <FileText className="w-6 h-6 text-celestial-purple" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{isZh ? '永續報告書編撰平台' : 'Sustainability Report Builder'}</h2>
                    <p className="text-gray-400 text-sm">{isZh ? 'GRI Standards 2021 合規指引' : 'GRI Standards 2021 Compliance'}</p>
                </div>
            </div>
            <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all disabled:opacity-50">
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} <span>Export PDF</span>
            </button>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            <div className="col-span-3 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/10">
                <div className="p-4 border-b border-white/10 bg-white/5"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{isZh ? '目錄' : 'Contents'}</span></div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {REPORT_STRUCTURE.map((chapter) => (
                        <div key={chapter.id} className="mb-2">
                            <button onClick={() => setActiveSectionId(chapter.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSectionId === chapter.id ? 'bg-celestial-purple/20 text-white' : 'text-gray-400 hover:text-white'}`}>
                                <span className="truncate">{chapter.title}</span>
                            </button>
                            {chapter.subSections && (
                                <div className="ml-2 mt-1 space-y-1 border-l border-white/10 pl-2">
                                    {chapter.subSections.map(sub => (
                                        <ChapterAgent 
                                            key={sub.id}
                                            id={sub.id} // Agent ID
                                            label={sub.title}
                                            section={sub}
                                            isActive={activeSectionId === sub.id}
                                            hasContent={!!generatedContent[sub.id]}
                                            onClick={() => setActiveSectionId(sub.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-span-9 flex flex-col gap-6 h-full min-h-0">
                {/* Guidelines Panel */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60 shrink-0 max-h-[35%] overflow-y-auto custom-scrollbar relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                        {activeSection?.griStandards && <span className="text-[10px] px-2 py-1 bg-celestial-gold/10 text-celestial-gold border border-celestial-gold/20 rounded-full">{activeSection.griStandards}</span>}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{activeSection?.title}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-gray-300">
                        {parentChapter && (
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 mb-1 text-emerald-400 font-bold uppercase tracking-wider">
                                    <BookOpen className="w-3 h-3" /> Writing Guidelines
                                </div>
                                <p>{parentChapter.guidelines || "No specific guidelines."}</p>
                            </div>
                        )}
                        {parentChapter && (
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 mb-1 text-celestial-purple font-bold uppercase tracking-wider">
                                    <Info className="w-3 h-3" /> Guiding Principles
                                </div>
                                <p>{parentChapter.principles || "Follow standard GRI principles."}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 glass-panel rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col min-h-0 relative">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <span className="text-sm font-medium text-white">{isZh ? '內容編輯器' : 'Editor'}</span>
                        <div className="flex gap-2">
                            <button onClick={handleGenerateSection} disabled={isGenerating || !activeSection} className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-celestial-purple to-celestial-blue hover:opacity-90 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50">
                                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} {isZh ? 'AI 撰寫' : 'AI Write'}
                            </button>
                            <button onClick={handleAuditSection} disabled={isAuditing || !generatedContent[activeSectionId]} className="flex items-center gap-2 px-3 py-1.5 bg-celestial-gold/20 hover:bg-celestial-gold/30 text-celestial-gold rounded-lg text-xs font-bold transition-all disabled:opacity-50 border border-celestial-gold/30">
                                {isAuditing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />} {isZh ? '合規稽核' : 'Audit'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/30" ref={reportRef}>
                            <LockedFeature featureName="Smart Report Editor" minTier="Free">
                                {generatedContent[activeSectionId] ? (
                                    <div className="markdown-content text-gray-300 leading-relaxed space-y-4 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: marked.parse(generatedContent[activeSectionId]) as string }} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-60">
                                        <FileText className="w-16 h-16 mb-4" />
                                        <p>{isZh ? '尚無內容' : 'No content'}</p>
                                        <p className="text-xs mt-2">Click AI Write to draft this section.</p>
                                    </div>
                                )}
                            </LockedFeature>
                        </div>
                        
                        {/* Audit Result Panel */}
                        {auditResult && (
                            <div className="w-80 border-l border-white/10 bg-slate-900/90 overflow-y-auto custom-scrollbar p-4 animate-fade-in">
                                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Audit Report
                                </h4>
                                <div className="markdown-content text-xs text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: marked.parse(auditResult) as string }} />
                                <button onClick={() => setAuditResult(null)} className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-400">Close</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
