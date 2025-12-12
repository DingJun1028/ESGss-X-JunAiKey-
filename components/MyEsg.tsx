
import React, { useState, useRef } from 'react';
import { 
  CheckSquare, Crown, Users, ArrowRight, Sparkles, 
  ListTodo, Plus, ShieldCheck, Upload, Loader2, Image as ImageIcon, Trash2,
  Radio, FolderOpen, FileText, Hexagon, PenTool, StickyNote, Target, Grid, X, Layout, Maximize2, Minimize2, Edit3, Save, Link2, Share2, Search, FileCheck
} from 'lucide-react';
import { Language, Quest, QuestRarity, View, NoteItem, WidgetType, AppFile } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { verifyQuestImage } from '../services/ai-service';
import { UniversalPageHeader } from './UniversalPageHeader';

interface MyEsgProps {
  language: Language;
  onNavigate: (view: View) => void;
}

// ... (NoteEditor component unchanged, keep existing code) ...
// Re-adding NoteEditor for context
const NoteEditor: React.FC<{
    note: NoteItem;
    onUpdate: (id: string, content: string, title?: string, tags?: string[]) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
    isZh: boolean;
}> = ({ note, onUpdate, onDelete, onClose, isZh }) => {
    const [content, setContent] = useState(note.content);
    const [title, setTitle] = useState(note.title);
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const { saveIntelligence } = useCompany();
    const { addToast } = useToast();

    const handleSave = () => {
        onUpdate(note.id, content, title);
        onClose();
    };

    const handleAiAction = (action: 'expand' | 'shorten' | 'refine' | 'format') => {
        setIsAiProcessing(true);
        setTimeout(() => {
            let newContent = content;
            if (action === 'expand') newContent += "\n\n[AI Expanded]: Additional context provided based on your input...";
            if (action === 'shorten') newContent = "[Summary]: " + content.substring(0, 50) + "...";
            if (action === 'refine') newContent = content.replace(/\s+/g, ' ').trim();
            if (action === 'format') newContent = `## ${title}\n\n* ${content.replace(/\n/g, '\n* ')}`;
            
            setContent(newContent);
            setIsAiProcessing(false);
            addToast('success', isZh ? 'AI 處理完成' : 'AI Processing Complete', 'Universal Agent');
        }, 1500);
    };

    const handleSaveToIntel = () => {
        saveIntelligence({
            id: `intel-${Date.now()}`,
            type: 'note',
            title: title,
            source: 'Universal Notes',
            date: new Date().toISOString(),
            summary: content.substring(0, 100),
            tags: ['User Note', 'Saved'],
            isRead: true
        });
        addToast('success', isZh ? '已儲存至萬能智庫' : 'Saved to Universal Intelligence', 'System');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-transparent border-none outline-none text-lg font-bold text-white w-full"
                        placeholder="Note Title"
                    />
                    <div className="flex gap-2">
                        <button onClick={handleSaveToIntel} className="p-2 hover:bg-white/10 rounded-lg text-celestial-purple" title="Save to Intelligence">
                            <BrainCircuitIcon className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                <div className="p-2 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar bg-black/20">
                    <button onClick={() => handleAiAction('expand')} disabled={isAiProcessing} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-celestial-blue transition-colors whitespace-nowrap">
                        <Maximize2 className="w-3 h-3" /> {isZh ? '擴寫' : 'Expand'}
                    </button>
                    <button onClick={() => handleAiAction('shorten')} disabled={isAiProcessing} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-amber-400 transition-colors whitespace-nowrap">
                        <Minimize2 className="w-3 h-3" /> {isZh ? '精簡' : 'Shorten'}
                    </button>
                    <button onClick={() => handleAiAction('refine')} disabled={isAiProcessing} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-emerald-400 transition-colors whitespace-nowrap">
                        <Sparkles className="w-3 h-3" /> {isZh ? '潤飾' : 'Refine'}
                    </button>
                    <button onClick={() => handleAiAction('format')} disabled={isAiProcessing} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-purple-400 transition-colors whitespace-nowrap">
                        <Layout className="w-3 h-3" /> {isZh ? '自動排版' : 'Auto-Format'}
                    </button>
                    {isAiProcessing && <Loader2 className="w-4 h-4 text-white animate-spin ml-2" />}
                </div>

                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 bg-slate-900 p-6 text-gray-300 resize-none outline-none leading-relaxed custom-scrollbar font-mono text-sm"
                    placeholder="Start typing..."
                />

                <div className="p-4 border-t border-white/10 flex justify-between items-center bg-white/5 rounded-b-2xl">
                    <button onClick={() => onDelete(note.id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> {isZh ? '刪除' : 'Delete'}
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-celestial-gold text-black font-bold rounded-lg hover:bg-amber-400 transition-colors flex items-center gap-2">
                        <Save className="w-4 h-4" /> {isZh ? '儲存' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const BrainCircuitIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-1.364"/><path d="M17.97 16.636A4 4 0 0 1 16 18"/></svg>
);

export const MyEsg: React.FC<MyEsgProps> = ({ language, onNavigate }) => {
  const { 
    quests, updateQuestStatus, completeQuest,
    myIntelligence, universalNotes, addNote, updateNote, deleteNote,
    files, addFile, removeFile,
    palaceWidgets, addPalaceWidget, removePalaceWidget
  } = useCompany();
  
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';
  
  // Refs & Local State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const complianceFileInputRef = useRef<HTMLInputElement>(null);
  const questFileInputRef = useRef<HTMLInputElement>(null);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'palace' | 'library' | 'notes'>('palace');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isWidgetCatalogOpen, setIsWidgetCatalogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // Compliance Form State
  const [complianceForm, setComplianceForm] = useState({
      standard: 'ISO 14064-1',
      certId: '',
      issuer: ''
  });

  // Universal Tag Data
  const pageData = {
      title: { zh: 'ESG 永恆宮殿', en: 'ESG Eternal Palace' },
      desc: { zh: '您專屬的永續資產、收藏與成長軌跡', en: 'Your personal sustainability assets, collections, and growth trajectory.' },
      tag: { zh: '使用者中樞', en: 'User Nexus' }
  };

  const handleQuickNote = () => {
      if(!newNoteInput.trim()) return;
      addNote(newNoteInput, ['Quick Note']);
      setNewNoteInput('');
      addToast('success', isZh ? '筆記已寫入萬能筆記本' : 'Note added to Universal Notebook', 'System');
  };

  const getRarityStyles = (rarity: QuestRarity) => {
      switch(rarity) {
          case 'Common': return 'border-white/10 bg-white/5';
          case 'Rare': return 'border-blue-500/30 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
          case 'Epic': return 'border-purple-500/30 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.15)]';
          case 'Legendary': return 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      }
  };

  const handleQuestClick = (quest: Quest) => {
      if (quest.status === 'completed' || quest.status === 'verifying') return;
      if (quest.requirement === 'image_upload') {
          setActiveQuestId(quest.id);
          questFileInputRef.current?.click();
      } else {
          completeQuest(quest.id, quest.xp);
          addToast('reward', isZh ? `完成任務！+${quest.xp} XP` : `Quest Complete! +${quest.xp} XP`, 'System');
      }
  };

  const handleQuestFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && activeQuestId) {
          const questId = activeQuestId;
          const quest = quests.find(q => q.id === questId);
          if (!quest) return;
          const file = e.target.files[0];
          addFile(file, 'MyEsg_Quest');
          updateQuestStatus(questId, 'verifying');
          addToast('info', isZh ? 'JunAiKey 視覺引擎正在分析...' : 'JunAiKey Vision analyzing...', 'Verification');
          const verification = await verifyQuestImage(quest.title, quest.desc, file, language);
          if (verification.success) {
               completeQuest(questId, quest.xp);
               addToast('success', verification.reason, 'AI Verified');
               addToast('reward', `+${quest.xp} XP`, 'Quest Complete');
          } else {
               updateQuestStatus(questId, 'active');
               addToast('error', verification.reason, 'Verification Failed');
          }
      }
      if (questFileInputRef.current) questFileInputRef.current.value = '';
      setActiveQuestId(null);
  };

  const handleGeneralFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          addFile(file, 'MyEsg_Upload');
          addToast('success', isZh ? '檔案已上傳至全域系統' : 'File uploaded to Universal System', 'File Center');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleComplianceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // In a real app, this would attach metadata to the file entry in Context
          addFile(file, 'Compliance_Filling'); 
          addToast('success', isZh ? '合規文件已上傳並建立關聯' : 'Compliance document uploaded and linked', 'Compliance Bot');
          // Reset form visualization (simulated)
          setComplianceForm({ standard: 'ISO 14064-1', certId: '', issuer: '' });
      }
      if (complianceFileInputRef.current) complianceFileInputRef.current.value = '';
  };

  const handleAddWidget = (type: WidgetType, title: string, gridSize: any = 'medium') => {
      addPalaceWidget({ type, title, gridSize });
      setIsWidgetCatalogOpen(false);
  };

  // ... (Renderers for widgets remain same, removed for brevity) ...
  const renderQuestWidget = () => (
      <div className="glass-panel p-6 rounded-2xl border-white/10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-celestial-gold" />
                  {isZh ? '每日修煉' : 'Daily Quests'}
              </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {quests.map(quest => (
                  <div key={quest.id} onClick={() => handleQuestClick(quest)} className={`relative p-3 rounded-xl border transition-all cursor-pointer group flex items-center gap-3 overflow-hidden ${getRarityStyles(quest.rarity)} ${quest.status === 'completed' ? 'opacity-50 grayscale' : 'hover:scale-[1.01]'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${quest.status === 'completed' ? 'bg-emerald-500 border-emerald-400' : 'bg-black/30 border-white/20'}`}>
                          {quest.status === 'completed' ? <CheckSquare className="w-4 h-4 text-white" /> : <Target className="w-4 h-4 text-gray-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold truncate ${quest.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>{quest.title}</h4>
                      </div>
                      <div className="text-xs font-mono font-bold text-celestial-gold">+{quest.xp}</div>
                  </div>
              ))}
          </div>
          <input type="file" ref={questFileInputRef} className="hidden" accept="image/*" onChange={handleQuestFileUpload} />
      </div>
  );

  const renderIntelWidget = () => (
      <div className="glass-panel p-6 rounded-2xl border-white/10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-celestial-purple animate-pulse" />
                  {isZh ? '我的情報' : 'My Intelligence'}
              </h3>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
              {myIntelligence.length === 0 ? <div className="text-center py-8 text-gray-500 text-[10px]">No Intel.</div> : 
                  myIntelligence.slice(0,5).map(item => (
                      <div key={item.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-celestial-purple/30 transition-all group">
                          <h4 className="text-xs font-bold text-white mb-1 truncate">{item.title}</h4>
                          <div className="flex justify-between items-center mt-1">
                              <span className="text-[9px] text-celestial-purple bg-celestial-purple/10 px-1.5 py-0.5 rounded">{item.type}</span>
                              <span className="text-[9px] text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                      </div>
                  ))
              }
          </div>
      </div>
  );

  const renderQuickNoteWidget = () => (
      <div className="glass-panel p-6 rounded-2xl border-white/10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-emerald-400" />
                  {isZh ? '快速筆記' : 'Quick Note'}
              </h3>
          </div>
          <div className="flex-1 bg-white/5 rounded-xl p-2 mb-2">
              <textarea 
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder={isZh ? "記錄靈感..." : "Capture idea..."}
                  className="w-full h-full bg-transparent border-none outline-none text-xs text-white resize-none"
              />
          </div>
          <button onClick={handleQuickNote} className="w-full py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-500/30 transition-all">
              {isZh ? '儲存' : 'Save'}
          </button>
      </div>
  );

  return (
    <div className="space-y-6 pb-24">
        {editingNote && (
            <NoteEditor 
                note={editingNote} 
                onClose={() => setEditingNote(null)} 
                onUpdate={updateNote} 
                onDelete={deleteNote}
                isZh={isZh}
            />
        )}

        <UniversalPageHeader 
            icon={Crown}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
            {[
                { id: 'palace', icon: Hexagon, zh: '宮殿總覽', en: 'Palace Overview' },
                { id: 'library', icon: FolderOpen, zh: '資產與檔案', en: 'Assets & Files' },
                { id: 'notes', icon: StickyNote, zh: '萬能筆記', en: 'Universal Notes' },
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'text-celestial-gold border-b-2 border-celestial-gold' : 'text-gray-500 hover:text-white'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    {isZh ? tab.zh : tab.en} 
                    <span className="text-[10px] font-light opacity-60 ml-1 font-sans">
                        {isZh ? tab.en : tab.zh}
                    </span>
                </button>
            ))}
        </div>

        {/* === TAB: PALACE OVERVIEW (Customizable Grid) === */}
        {activeTab === 'palace' && (
            <div className="animate-fade-in relative">
                {/* Customization Toggle */}
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isEditMode ? 'bg-celestial-gold text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <Grid className="w-3 h-3" />
                        {isZh ? (isEditMode ? '完成編輯' : '自訂版面') : (isEditMode ? 'Done' : 'Customize')}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Hero Banner (Fixed) */}
                    <div className="md:col-span-12 relative w-full h-64 rounded-2xl overflow-hidden group cursor-pointer border border-celestial-gold/30 shadow-2xl shadow-amber-900/20" onClick={() => onNavigate(View.ACADEMY)}>
                        <div className="absolute inset-0">
                            <img src="https://thumbs4.imagebam.com/12/1d/de/ME18KXOE_t.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Berkeley Course" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                        </div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-center max-w-xl relative z-10">
                            <div className="flex gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-celestial-gold text-black text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                    <Crown className="w-3 h-3" /> Featured Collection
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                                Berkeley x TSISDA <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold to-amber-200">International Strategy</span>
                            </h2>
                            <button className="w-fit px-4 py-2 bg-celestial-gold hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-all flex items-center gap-2 group/btn shadow-lg mt-4">
                                {isZh ? '繼續學習' : 'Continue Learning'}
                                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Widgets */}
                    {palaceWidgets.map((widget) => {
                        const colSpan = widget.gridSize === 'medium' ? 'md:col-span-6' : widget.gridSize === 'large' ? 'md:col-span-8' : 'md:col-span-3';
                        let content = null;
                        if (widget.type === 'quest_list') content = renderQuestWidget();
                        else if (widget.type === 'intel_feed') content = renderIntelWidget();
                        else if (widget.type === 'quick_note') content = renderQuickNoteWidget();
                        else content = <div className="p-4 border border-dashed border-white/10 rounded-xl text-center text-gray-500 text-xs">Unknown Widget</div>;

                        return (
                            <div key={widget.id} className={`${colSpan} relative group h-[300px]`}>
                                {content}
                                {isEditMode && (
                                    <button 
                                        onClick={() => removePalaceWidget(widget.id)}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg z-20 hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {isEditMode && (
                        <button 
                            onClick={() => setIsWidgetCatalogOpen(true)}
                            className="md:col-span-3 h-[300px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                        >
                            <Plus className="w-8 h-8 mb-2" />
                            <span className="text-xs font-bold">{isZh ? '新增小工具' : 'Add Widget'}</span>
                        </button>
                    )}
                </div>

                {/* Widget Catalog Modal */}
                {isWidgetCatalogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">{isZh ? '選擇小工具' : 'Select Widget'}</h3>
                                <button onClick={() => setIsWidgetCatalogOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => handleAddWidget('quest_list', 'Quests', 'medium')} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-celestial-gold transition-all text-left">
                                    <ShieldCheck className="w-6 h-6 text-celestial-gold mb-2" />
                                    <div className="text-sm font-bold text-white">Quests</div>
                                    <div className="text-xs text-gray-500">Medium</div>
                                </button>
                                <button onClick={() => handleAddWidget('intel_feed', 'Intel', 'medium')} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-celestial-purple transition-all text-left">
                                    <Radio className="w-6 h-6 text-celestial-purple mb-2" />
                                    <div className="text-sm font-bold text-white">Intel Feed</div>
                                    <div className="text-xs text-gray-500">Medium</div>
                                </button>
                                <button onClick={() => handleAddWidget('quick_note', 'Notes', 'small')} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-400 transition-all text-left">
                                    <PenTool className="w-6 h-6 text-emerald-400 mb-2" />
                                    <div className="text-sm font-bold text-white">Quick Note</div>
                                    <div className="text-xs text-gray-500">Small</div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* === TAB: LIBRARY (Files & Assets) === */}
        {activeTab === 'library' && (
            <div className="animate-fade-in space-y-6">
                
                {/* NEW: Compliance Filing Section */}
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-900/10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-emerald-400" />
                            {isZh ? '法遵合規申報專區' : 'Compliance Filing Zone'}
                        </h3>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">Official</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">{isZh ? '合規標準' : 'Standard'}</label>
                            <select 
                                value={complianceForm.standard}
                                onChange={(e) => setComplianceForm({...complianceForm, standard: e.target.value})}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            >
                                <option>ISO 14064-1</option>
                                <option>ISO 50001</option>
                                <option>PAS 2060</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">{isZh ? '證書編號' : 'Certificate ID'}</label>
                            <input 
                                value={complianceForm.certId}
                                onChange={(e) => setComplianceForm({...complianceForm, certId: e.target.value})}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                                placeholder="e.g. TW-2024-001"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">{isZh ? '頒發機構' : 'Issuer'}</label>
                            <input 
                                value={complianceForm.issuer}
                                onChange={(e) => setComplianceForm({...complianceForm, issuer: e.target.value})}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                                placeholder="e.g. BSI, SGS"
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => complianceFileInputRef.current?.click()}
                        className="w-full py-3 border border-dashed border-emerald-500/30 rounded-xl text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2"
                    >
                        <Upload className="w-4 h-4" /> {isZh ? '上傳合規證明文件' : 'Upload Proof Document'}
                    </button>
                    <input type="file" ref={complianceFileInputRef} className="hidden" onChange={handleComplianceUpload} />
                </div>

                <div className="glass-panel p-6 rounded-2xl border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <FolderOpen className="w-5 h-5 text-celestial-blue" />
                            {isZh ? '全域檔案中心' : 'Universal File Center'}
                        </h3>
                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-celestial-blue hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
                            <Upload className="w-4 h-4" /> {isZh ? '上傳一般檔案' : 'Upload File'}
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleGeneralFileUpload} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {files.length === 0 && (
                            <div className="col-span-full text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                                <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">{isZh ? '尚無檔案' : 'No files found'}</p>
                            </div>
                        )}
                        {files.map(file => (
                            <div key={file.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-4 group hover:border-celestial-blue/30 transition-all hover:bg-white/10">
                                <div className={`p-3 rounded-xl ${file.status === 'scanning' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-gray-300'}`}>
                                    {file.status === 'scanning' ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-sm mb-1 truncate">{file.name}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                        <span>{file.size}</span>
                                        <span>•</span>
                                        <span className="text-celestial-blue">{file.sourceModule}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {file.tags.map(tag => (
                                            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-black/30 rounded text-gray-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => removeFile(file.id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* === TAB: UNIVERSAL NOTES 2.0 === */}
        {activeTab === 'notes' && (
            <div className="animate-fade-in space-y-6">
                <div className="glass-panel p-6 rounded-2xl border-white/10 min-h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <PenTool className="w-5 h-5 text-celestial-gold" />
                            {isZh ? '萬能筆記本 2.0' : 'Universal Notebook 2.0'}
                        </h3>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                                <input placeholder={isZh ? "AI 語意搜尋..." : "AI Semantic Search..."} className="bg-slate-900/50 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-celestial-gold/50" />
                            </div>
                            <button 
                                onClick={() => addNote("", [], "")} // Empty note triggers logic
                                className="px-4 py-1.5 bg-celestial-gold text-black text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-3 h-3" /> {isZh ? '新增' : 'New'}
                            </button>
                        </div>
                    </div>
                    
                    {/* Notes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 content-start">
                        {universalNotes.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500 text-sm">
                                {isZh ? '筆記本是空的' : 'Notebook is empty'}
                            </div>
                        )}
                        {universalNotes.map(note => (
                            <div key={note.id} className="p-4 bg-yellow-100/5 border border-yellow-100/10 rounded-xl relative group hover:bg-yellow-100/10 transition-all flex flex-col h-48 cursor-pointer hover:border-celestial-gold/30" onClick={() => setEditingNote(note)}>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white text-sm truncate pr-2">{note.title}</h4>
                                    {note.backlinks && note.backlinks.length > 0 && (
                                        <Link2 className="w-3 h-3 text-celestial-blue" />
                                    )}
                                </div>
                                <div className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap flex-1 overflow-hidden line-clamp-5 mb-2 opacity-80">
                                    {note.content}
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-white/5 mt-auto">
                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                    <div className="flex gap-1">
                                        {note.tags.map(t => (
                                            <span key={t} className="px-1.5 py-0.5 bg-white/5 rounded text-gray-400">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
