
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { 
    Users, BookOpen, GraduationCap, Video, Calendar, FileText, 
    MessageSquare, Settings, Award, Plus, Layout, UserPlus, 
    Briefcase, Activity, CheckCircle, ExternalLink, RefreshCw,
    PlayCircle, Upload, PenTool, BarChart, DollarSign, Handshake, 
    Megaphone, Wand2, Image as ImageIcon, Type, Move, Save, 
    LayoutTemplate, MousePointer2, X, ChevronRight, ZoomIn, ZoomOut, Grid as GridIcon, Layers, Sparkles
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { OmniEsgCell } from './OmniEsgCell';
import { UniversalPageHeader } from './UniversalPageHeader';
import { streamChat } from '../services/ai-service';

interface AlumniZoneProps {
  language: Language;
}

type UserRole = 'Admin' | 'Agent' | 'Consultant' | 'Student' | 'Parent' | 'Partner';

// Simulated Course Data
interface MockCourse {
    id: string;
    title: string;
    instructor: string;
    status: 'Pre' | 'Live' | 'Post';
    progress: number;
    nextSession: string;
    students: number;
    platform: 'Google' | 'Zoom' | 'Custom';
}

const MOCK_COURSES: MockCourse[] = [
    { id: 'c1', title: 'Corporate Carbon Management (ISO 14064)', instructor: 'Dr. Yang', status: 'Live', progress: 45, nextSession: 'Tomorrow, 14:00', students: 32, platform: 'Google' },
    { id: 'c2', title: 'ESG Strategic Leadership', instructor: 'Prof. Lee', status: 'Pre', progress: 0, nextSession: 'June 15, 09:00', students: 18, platform: 'Custom' },
    { id: 'c3', title: 'Supply Chain Auditing Workshop', instructor: 'Consultant Sarah', status: 'Post', progress: 100, nextSession: '-', students: 25, platform: 'Zoom' },
];

// --- AI CANVAS TYPES & COMPONENT ---
interface CanvasElement {
    id: string;
    type: 'text' | 'image' | 'shape';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    style?: any;
}

const PartnerCanvas: React.FC<{ isZh: boolean, onClose: () => void }> = ({ isZh, onClose }) => {
    const { addToast } = useToast();
    // Centered initial elements for the new Artboard layout
    const [elements, setElements] = useState<CanvasElement[]>([
        { id: 'el-1', type: 'text', content: isZh ? '在此輸入您的品牌標語...' : 'Insert Brand Slogan Here...', x: 150, y: 200, width: 300, height: 60, style: { fontSize: '24px', fontWeight: 'bold', color: '#fbbf24', textAlign: 'center' } }
    ]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [zoom, setZoom] = useState(100);
    const [showGrid, setShowGrid] = useState(true);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("id", id);
    };

    const handleDrop = (e: React.DragEvent) => {
        const id = e.dataTransfer.getData("id");
        // Simple drop logic relative to container for demo
        // In a real app, we'd calculate offset relative to the artboard div
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / (zoom / 100);
        const y = (e.clientY - rect.top) / (zoom / 100);

        setElements(prev => prev.map(el => el.id === id ? { ...el, x: x - el.width / 2, y: y - el.height / 2 } : el));
    };

    const handleAiGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        addToast('info', isZh ? 'AI 正在設計您的畫布內容...' : 'AI designing your canvas content...', 'AI Designer');

        // Simulate AI Generation
        setTimeout(() => {
            const newElements: CanvasElement[] = [
                { id: `gen-title-${Date.now()}`, type: 'text', content: prompt.toUpperCase(), x: 100, y: 100, width: 400, height: 50, style: { fontSize: '32px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
                { id: `gen-sub-${Date.now()}`, type: 'text', content: "Sustainable Innovation Partner", x: 150, y: 160, width: 300, height: 30, style: { fontSize: '16px', color: '#10b981', textAlign: 'center' } },
                { id: `gen-img-${Date.now()}`, type: 'image', content: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', x: 50, y: 220, width: 500, height: 300, style: { borderRadius: '12px', objectFit: 'cover' } },
                { id: `gen-badge-${Date.now()}`, type: 'shape', content: 'Verified Partner', x: 400, y: 480, width: 120, height: 40, style: { backgroundColor: '#8b5cf6', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' } }
            ];
            setElements(newElements); // Replace for cleaner demo
            setIsGenerating(false);
            addToast('success', isZh ? '內容生成完畢' : 'Content Generated', 'AI Canvas');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="h-16 border-b border-white/10 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-celestial-purple/20 rounded-lg text-celestial-purple">
                        <LayoutTemplate className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{isZh ? '合作夥伴 AI 品牌畫布' : 'Partner AI Brand Canvas'}</h3>
                        <p className="text-[10px] text-gray-400">{isZh ? '打造符合 ESGss 風格的行銷素材' : 'Create ESGss-aligned marketing assets'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/10">
                        <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1.5 hover:bg-white/10 rounded text-gray-400"><ZoomOut className="w-4 h-4"/></button>
                        <span className="text-xs font-mono w-12 text-center text-gray-300">{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1.5 hover:bg-white/10 rounded text-gray-400"><ZoomIn className="w-4 h-4"/></button>
                    </div>
                    <button 
                        onClick={() => setShowGrid(!showGrid)} 
                        className={`p-2 rounded-lg border transition-colors ${showGrid ? 'bg-celestial-purple/20 text-celestial-purple border-celestial-purple/30' : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5'}`}
                        title="Toggle Grid"
                    >
                        <GridIcon className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 mx-2" />
                    <button onClick={() => addToast('success', 'Saved to Cloud', 'System')} className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
                        <Save className="w-4 h-4" /> {isZh ? '保存設計' : 'Save Design'}
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Tools Sidebar */}
                <div className="w-64 bg-slate-900 border-r border-white/10 p-4 flex flex-col gap-6 z-10">
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Wand2 className="w-3 h-3" /> {isZh ? 'AI 生成器' : 'AI Generator'}
                        </h4>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={isZh ? "描述您的品牌與需求..." : "Describe your brand..."}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-xs text-white mb-3 h-24 focus:outline-none focus:border-celestial-purple/50 resize-none"
                        />
                        <button 
                            onClick={handleAiGenerate}
                            disabled={isGenerating}
                            className="w-full py-2 bg-gradient-to-r from-celestial-purple to-blue-500 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            {isZh ? '一鍵生成素材' : 'Generate Assets'}
                        </button>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{isZh ? '組件工具箱' : 'Toolbox'}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20">
                                <Type className="w-5 h-5" />
                                <span className="text-[10px]">Text</span>
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20">
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-[10px]">Image</span>
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20">
                                <Layout className="w-5 h-5" />
                                <span className="text-[10px]">Layout</span>
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20">
                                <MousePointer2 className="w-5 h-5" />
                                <span className="text-[10px]">Select</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Canvas Area - The "Artboard" */}
                <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center p-8">
                    {/* Workspace Background */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]" />
                    
                    {/* The Artboard */}
                    <div 
                        className={`relative bg-white shadow-2xl transition-transform duration-200 ease-out ${showGrid ? 'bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:20px_20px]' : ''}`}
                        style={{ 
                            width: '600px', 
                            height: '800px', 
                            transform: `scale(${zoom / 100})`,
                            backgroundColor: '#1e293b', // Slate 800
                            boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {/* Artboard Content */}
                        {elements.map(el => (
                            <div
                                key={el.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, el.id)}
                                onClick={() => setSelectedId(el.id)}
                                className={`absolute cursor-move group ${selectedId === el.id ? 'ring-2 ring-celestial-purple ring-offset-2 ring-offset-slate-800' : 'hover:ring-1 hover:ring-white/30'}`}
                                style={{ 
                                    left: el.x, 
                                    top: el.y, 
                                    width: el.width, 
                                    height: el.height,
                                    ...el.style 
                                }}
                            >
                                {el.type === 'text' && (
                                    <div className="w-full h-full flex items-center justify-center">{el.content}</div>
                                )}
                                {el.type === 'image' && (
                                    <img src={el.content} alt="" className="w-full h-full object-cover" />
                                )}
                                {el.type === 'shape' && (
                                    <div className="w-full h-full flex items-center justify-center font-bold shadow-lg">
                                        {el.content}
                                    </div>
                                )}
                                {/* Resize Handles (Visual) */}
                                {selectedId === el.id && (
                                    <>
                                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-celestial-purple" />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-celestial-purple" />
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-celestial-purple" />
                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-celestial-purple" />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Properties Panel (Layers & Settings) */}
                <div className="w-64 bg-slate-900 border-l border-white/10 p-4 z-10">
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Settings className="w-3 h-3" /> {isZh ? '屬性' : 'Properties'}
                        </h4>
                        {selectedId ? (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Position X / Y</label>
                                    <div className="flex gap-2">
                                        <input type="number" className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white text-center" placeholder="X" />
                                        <input type="number" className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white text-center" placeholder="Y" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Opacity</label>
                                    <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-gray-600 text-center py-4 bg-white/5 rounded-lg border border-dashed border-white/10">Select an element</div>
                        )}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Layers className="w-3 h-3" /> {isZh ? '圖層' : 'Layers'}
                        </h4>
                        <div className="space-y-1">
                            {elements.slice().reverse().map((el, i) => (
                                <div 
                                    key={el.id} 
                                    className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer ${selectedId === el.id ? 'bg-celestial-purple/20 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                                    onClick={() => setSelectedId(el.id)}
                                >
                                    {el.type === 'text' ? <Type className="w-3 h-3" /> : el.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <Layout className="w-3 h-3" />}
                                    <span className="truncate">{el.content}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AlumniZone: React.FC<AlumniZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  
  // State for Role Switching & Tabs
  const [currentRole, setCurrentRole] = useState<UserRole>('Student');
  const [activeTab, setActiveTab] = useState('courses'); // courses, collaboration, partners
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Collaboration State
  const [collabForm, setCollabForm] = useState({ company: '', contact: '', proposal: '' });
  const [collabFile, setCollabFile] = useState<File | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageData = {
      title: { zh: '校友專區 & LMS', en: 'Alumni & LMS Zone' },
      desc: { zh: '全方位學習管理與異業合作生態系', en: 'Comprehensive LMS & Cross-Industry Ecosystem' },
      tag: { zh: '生態核心', en: 'Eco Core' }
  };

  // Toggle Role Function
  const handleRoleSwitch = (role: UserRole) => {
      setCurrentRole(role);
      // Reset view to default for the role
      if (role === 'Partner') setActiveTab('partners'); 
      else setActiveTab('courses');
      addToast('info', isZh ? `切換視角至：${role}` : `Switched view to: ${role}`, 'Role Manager');
  };

  // Google Sync Simulation
  const handleGoogleSync = () => {
      setIsSyncing(true);
      setTimeout(() => {
          setIsSyncing(false);
          addToast('success', isZh ? 'Google Classroom 同步完成' : 'Google Classroom Synced', 'System');
      }, 1500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setCollabFile(e.target.files[0]);
          addToast('success', isZh ? '檔案已選取' : 'File Selected', 'System');
      }
  };

  const handleApplyCollab = (e: React.FormEvent) => {
      e.preventDefault();
      addToast('success', isZh ? '申請已提交！請等待審核。' : 'Application submitted! Pending review.', 'Collaboration');
      setCollabForm({ company: '', contact: '', proposal: '' });
      setCollabFile(null);
  };

  // --- RENDER SECTIONS ---

  // 1. Role Selector (Top Bar)
  const RoleSelector = () => (
      <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 mb-6 overflow-x-auto no-scrollbar">
          {(['Admin', 'Agent', 'Consultant', 'Student', 'Parent', 'Partner'] as UserRole[]).map(role => (
              <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                      ${currentRole === role 
                          ? 'bg-celestial-purple text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
              >
                  {isZh ? 
                    (role === 'Admin' ? '行政管理' : role === 'Agent' ? '代理/業務' : role === 'Consultant' ? '顧問/講師' : role === 'Student' ? '學員' : role === 'Parent' ? '家長' : '合作夥伴') 
                    : role}
              </button>
          ))}
      </div>
  );

  // 2. Collaboration Tab (New)
  const CollaborationTab = () => (
      <div className="space-y-8 animate-fade-in">
          {/* Hero / Process Flow */}
          <div className="glass-panel p-8 rounded-2xl border-t-4 border-t-celestial-gold bg-gradient-to-b from-amber-900/10 to-transparent">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Handshake className="w-6 h-6 text-celestial-gold" />
                  {isZh ? '異業合作申請流程' : 'Partnership Application Process'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                      { step: 1, title: isZh ? '提交申請' : 'Submit App', desc: isZh ? '填寫企業資料與提案' : 'Fill details & proposal' },
                      { step: 2, title: isZh ? 'AI 初審' : 'AI Review', desc: isZh ? '系統自動評估適配度' : 'Auto-match compatibility' },
                      { step: 3, title: isZh ? '官方審核' : 'Official Review', desc: isZh ? '專人對接與簽約' : 'Contract & Onboarding' },
                      { step: 4, title: isZh ? '上架專區' : 'Launch', desc: isZh ? '解鎖 AI 畫布與專區展示' : 'Unlock Canvas & Exposure' },
                  ].map((s, i) => (
                      <div key={i} className="relative p-4 bg-white/5 rounded-xl border border-white/5 text-center group hover:bg-white/10 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-celestial-gold/20 text-celestial-gold flex items-center justify-center font-bold mx-auto mb-3 border border-celestial-gold/30">
                              {s.step}
                          </div>
                          <h4 className="font-bold text-white mb-1">{s.title}</h4>
                          <p className="text-xs text-gray-400">{s.desc}</p>
                          {i < 3 && <ChevronRight className="absolute top-1/2 -right-3 w-6 h-6 text-gray-600 hidden md:block" />}
                      </div>
                  ))}
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Rules & Norms */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-celestial-blue" />
                      {isZh ? '合作規範' : 'Collaboration Norms'}
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{isZh ? '企業需具備基本的 ESG 承諾或永續相關業務。' : 'Must demonstrate ESG commitment or sustainability business.'}</span>
                      </li>
                      <li className="flex gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{isZh ? '同意使用 ESGss 平台工具進行數據交換與成果展示。' : 'Agree to use ESGss tools for data exchange and showcase.'}</span>
                      </li>
                      <li className="flex gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{isZh ? '遵守品牌共同行銷規範，使用 AI 畫布統一視覺風格。' : 'Adhere to co-marketing guidelines via AI Canvas.'}</span>
                      </li>
                  </ul>
              </div>

              {/* Application Form */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-celestial-purple" />
                      {isZh ? '我要申請' : 'Apply Now'}
                  </h4>
                  <form onSubmit={handleApplyCollab} className="space-y-4">
                      <div>
                          <input 
                              type="text" 
                              placeholder={isZh ? "企業名稱" : "Company Name"}
                              value={collabForm.company}
                              onChange={e => setCollabForm({...collabForm, company: e.target.value})}
                              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-gold/50"
                              required
                          />
                      </div>
                      <div>
                          <input 
                              type="text" 
                              placeholder={isZh ? "聯絡人與 Email" : "Contact Person & Email"}
                              value={collabForm.contact}
                              onChange={e => setCollabForm({...collabForm, contact: e.target.value})}
                              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-gold/50"
                              required
                          />
                      </div>
                      <div>
                          <textarea 
                              placeholder={isZh ? "合作提案簡述..." : "Proposal Summary..."}
                              value={collabForm.proposal}
                              onChange={e => setCollabForm({...collabForm, proposal: e.target.value})}
                              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-gold/50 h-24 resize-none"
                              required
                          />
                      </div>
                      
                      {/* File Upload Section */}
                      <div className="border border-dashed border-white/20 rounded-lg p-4 bg-white/5 text-center">
                          <input 
                              type="file" 
                              ref={fileInputRef}
                              onChange={handleFileSelect}
                              className="hidden"
                              accept=".pdf,.ppt,.pptx,.doc,.docx"
                          />
                          <div 
                              className="flex flex-col items-center justify-center cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                          >
                              {collabFile ? (
                                  <>
                                      <FileText className="w-6 h-6 text-emerald-400 mb-2" />
                                      <span className="text-sm text-emerald-300 font-bold break-all">{collabFile.name}</span>
                                      <span className="text-xs text-gray-500 mt-1">{(collabFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                  </>
                              ) : (
                                  <>
                                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                      <span className="text-sm text-gray-300 font-bold">{isZh ? '上傳提案簡報 / Logo' : 'Upload Pitch Deck / Logo'}</span>
                                      <span className="text-xs text-gray-500 mt-1">PDF, PPT, DOC (Max 10MB)</span>
                                  </>
                              )}
                          </div>
                      </div>

                      <button type="submit" className="w-full py-2 bg-celestial-gold text-black font-bold rounded-lg hover:bg-amber-400 transition-colors">
                          {isZh ? '提交申請' : 'Submit Application'}
                      </button>
                  </form>
              </div>
          </div>
      </div>
  );

  // 3. Partner Zone Tab (New)
  const PartnerZoneTab = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                  {isZh ? '生態系夥伴專區' : 'Ecosystem Partners'}
              </h3>
              <button 
                  onClick={() => setShowCanvas(true)}
                  className="px-4 py-2 bg-gradient-to-r from-celestial-purple to-indigo-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
              >
                  <LayoutTemplate className="w-4 h-4" />
                  {isZh ? '開啟品牌 AI 畫布' : 'Open Brand AI Canvas'}
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                  <div key={i} className="glass-panel rounded-2xl overflow-hidden group border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer">
                      <div className="h-32 bg-slate-800 relative">
                          {/* Placeholder Banner */}
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-50" />
                          <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-xl border-4 border-slate-900 flex items-center justify-center text-black font-bold text-xs shadow-lg">
                              LOGO
                          </div>
                      </div>
                      <div className="pt-8 p-6">
                          <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-white text-lg">GreenTech Solutions {i}</h4>
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded border border-emerald-500/20 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                              {isZh ? '專注於提供企業級 IoT 碳排放監測硬體與解決方案。' : 'Specializing in enterprise IoT carbon monitoring hardware solutions.'}
                          </p>
                          <div className="flex gap-2">
                              <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white transition-colors">
                                  {isZh ? '查看詳情' : 'View Profile'}
                              </button>
                              <button className="p-2 bg-celestial-gold/10 hover:bg-celestial-gold/20 text-celestial-gold rounded-lg transition-colors">
                                  <ExternalLink className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  // 4. Sub-Navigation for Alumni/Partner view
  const SubNav = () => (
      <div className="flex border-b border-white/10 mb-6 gap-6">
          <button 
              onClick={() => setActiveTab('courses')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'courses' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
              {isZh ? '課程學習' : 'Courses'}
          </button>
          <button 
              onClick={() => setActiveTab('collaboration')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'collaboration' ? 'border-celestial-gold text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
              {isZh ? '異業合作' : 'Collaboration'}
          </button>
          <button 
              onClick={() => setActiveTab('partners')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'partners' ? 'border-emerald-400 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
              {isZh ? '夥伴專區' : 'Partner Zone'}
          </button>
      </div>
  );

  // 5. Main Content Logic
  const renderContent = () => {
      // Role-specific overrides or defaults
      if (currentRole === 'Partner') {
          return (
              <>
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm text-emerald-100 font-bold">{isZh ? '歡迎回來，合作夥伴' : 'Welcome back, Partner'}</span>
                      </div>
                      <button onClick={() => setShowCanvas(true)} className="text-xs text-white underline hover:text-emerald-300">
                          {isZh ? '管理我的畫布' : 'Manage My Canvas'}
                      </button>
                  </div>
                  {activeTab === 'partners' ? <PartnerZoneTab /> : <CollaborationTab />} 
                  {/* Partners see Partner Zone by default, can check collab rules */}
              </>
          );
      }

      // Default Student/Alumni View
      if (activeTab === 'collaboration') return <CollaborationTab />;
      if (activeTab === 'partners') return <PartnerZoneTab />;

      // Fallback to original Course View (Simplified from original file for brevity in this delta)
      return (
          <div className="space-y-6">
              {/* Lifecycle Dashboard (kept from original) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-blue-500 bg-blue-900/10">
                      <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-white text-lg">{isZh ? '課前準備' : 'Pre-Class'}</h4>
                          <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <ul className="space-y-3 text-sm text-gray-300">
                          <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> {isZh ? '註冊確認' : 'Registration'}</li>
                          <li className="flex gap-2 items-center"><Activity className="w-4 h-4 text-amber-400 animate-pulse" /> {isZh ? '預習教材' : 'Materials'}</li>
                      </ul>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-celestial-gold bg-amber-900/10">
                      <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-white text-lg">{isZh ? '課中互動' : 'In-Class'}</h4>
                          <Video className="w-5 h-5 text-celestial-gold" />
                      </div>
                      <ul className="space-y-3 text-sm text-gray-300">
                          <li className="flex gap-2 items-center"><PlayCircle className="w-4 h-4 text-celestial-gold" /> {isZh ? '直播教室' : 'Live Room'}</li>
                      </ul>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-celestial-purple bg-purple-900/10">
                      <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-white text-lg">{isZh ? '課後延伸' : 'Post-Class'}</h4>
                          <Award className="w-5 h-5 text-celestial-purple" />
                      </div>
                      <ul className="space-y-3 text-sm text-gray-300">
                          <li className="flex gap-2 items-center"><Users className="w-4 h-4 text-celestial-purple" /> {isZh ? '校友網絡' : 'Alumni'}</li>
                      </ul>
                  </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-celestial-blue" />
                      {isZh ? '我的課程' : 'My Courses'}
                  </h3>
                  <div className="space-y-4">
                      {MOCK_COURSES.map(course => (
                          <div key={course.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between hover:border-celestial-blue/30 transition-all group">
                              <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-lg ${course.status === 'Live' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-gray-400'}`}>
                                      {course.status === 'Live' ? <Video className="w-5 h-5 animate-pulse" /> : <BookOpen className="w-5 h-5" />}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-white">{course.title}</h4>
                                      <div className="text-xs text-gray-400 flex gap-2 mt-1">
                                          <span>{course.instructor}</span>
                                          <span>•</span>
                                          <span>Next: {course.nextSession}</span>
                                      </div>
                                  </div>
                              </div>
                              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors">
                                  {isZh ? '進入' : 'Enter'}
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <>
        {showCanvas && <PartnerCanvas isZh={isZh} onClose={() => setShowCanvas(false)} />}
        
        <div className="space-y-8 animate-fade-in pb-12">
            <UniversalPageHeader 
                icon={Users}
                title={pageData.title}
                description={pageData.desc}
                language={language}
                tag={pageData.tag}
            />

            <RoleSelector />
            <SubNav />
            
            {renderContent()}
        </div>
    </>
  );
};
