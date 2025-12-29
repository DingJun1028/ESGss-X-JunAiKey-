
import React, { useState, useRef } from 'react';
import { Language, AppFile } from '../types';
import { 
    Users, Briefcase, GraduationCap, ArrowRight, MessageSquare, 
    UserPlus, Settings, BarChart, Activity, CheckCircle, Search, 
    Filter, FileUp, X, Plus, Layout, Palette, Save, Trash2, 
    FileText, Image as ImageIcon, Sparkles, Globe, Target, RefreshCw
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { OmniEsgCell } from './OmniEsgCell';

interface AlumniZoneProps {
  language: Language;
}

export const AlumniZone: React.FC<AlumniZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { userRole, addFile, files, removeFile } = useCompany();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'network' | 'collaboration' | 'partners'>('network');
  const [showCanvas, setShowCanvas] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  const [proposalData, setProposalData] = useState({ title: '', desc: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive role for view logic
  const currentRole = ['Admin', 'Partner', 'Agent', 'Parent'].includes(userRole) ? userRole : 'Student';

  const pageData = {
      title: { zh: '校友與合作夥伴專區', en: 'Alumni & Partner Zone' },
      desc: { zh: '連結永續生態系，共創價值', en: 'Connect with the ecosystem, co-create value' },
      tag: { zh: '生態核心', en: 'Eco Core' }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          addFile(file, 'Collaboration');
          addToast('success', isZh ? '檔案已成功上傳至提案附件' : 'File uploaded to proposal attachments', 'Upload');
      }
  };

  const submitProposal = () => {
      addToast('reward', isZh ? '提案已提交！我們將在 3 個工作天內回覆。' : 'Proposal submitted! We will respond within 3 working days.', 'Success');
      setShowApplyForm(false);
      setProposalData({ title: '', desc: '' });
  };

  // --- Sub-Component: Canvas Manager ---
  const CanvasManager = () => {
      const [layout, setLayout] = useState('Standard');
      return (
          <div className="fixed inset-0 z-[150] bg-slate-950 flex flex-col animate-fade-in">
              <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                      <div className="p-2 bg-celestial-emerald/20 rounded-lg text-celestial-emerald">
                          <Palette className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{isZh ? '合作夥伴畫布空間' : 'Partner Canvas Space'}</h3>
                  </div>
                  <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white border border-white/10 transition-all">
                          <Save className="w-4 h-4" /> {isZh ? '儲存草稿' : 'Save Draft'}
                      </button>
                      <button onClick={() => setShowCanvas(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400">
                          <X className="w-6 h-6" />
                      </button>
                  </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                  {/* Sidebar Tools */}
                  <div className="w-72 border-r border-white/10 bg-slate-900/30 p-6 space-y-8 overflow-y-auto custom-scrollbar">
                      <div>
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{isZh ? '佈局模板' : 'Layout Presets'}</h4>
                          <div className="grid grid-cols-2 gap-2">
                              {['Standard', 'Dynamic', 'Grid', 'Focused'].map(p => (
                                  <button 
                                    key={p} 
                                    onClick={() => setLayout(p)}
                                    className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${layout === p ? 'bg-celestial-emerald/10 border-celestial-emerald text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}
                                  >
                                      <Layout className="w-5 h-5" />
                                      <span className="text-[10px] font-bold">{p}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{isZh ? '可用組件' : 'Available Widgets'}</h4>
                          <div className="space-y-2">
                              {['Carbon Widget', 'Risk Radar', 'Value Matrix', 'Social Feed'].map(w => (
                                  <div key={w} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-gray-300 flex justify-between items-center group cursor-grab">
                                      {w}
                                      <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Main Preview Board */}
                  <div className="flex-1 p-10 bg-black/40 relative overflow-y-auto custom-scrollbar">
                      <div className="max-w-5xl mx-auto space-y-8">
                          <div className="flex justify-between items-end border-b border-white/5 pb-6">
                              <div>
                                  <div className="text-[10px] text-celestial-emerald font-black uppercase tracking-widest mb-1">Canvas Preview</div>
                                  <h2 className="text-4xl font-bold text-white">Sustainability Ecosystem v1.0</h2>
                              </div>
                              <div className="flex gap-4">
                                  <div className="text-right">
                                      <div className="text-[10px] text-gray-500 font-bold uppercase">Alignment</div>
                                      <div className="text-xl font-mono text-emerald-400">92.4%</div>
                                  </div>
                              </div>
                          </div>

                          <div className="grid grid-cols-12 gap-6 h-[600px]">
                              <div className="col-span-8 bg-slate-900/60 rounded-3xl border border-white/5 p-8 relative flex items-center justify-center border-dashed">
                                  <Sparkles className="w-12 h-12 text-gray-800 opacity-20" />
                                  <p className="text-xs text-gray-600 uppercase font-black tracking-widest absolute">Main Visualization Area</p>
                              </div>
                              <div className="col-span-4 flex flex-col gap-6">
                                  <div className="bg-slate-900/60 rounded-3xl border border-white/5 flex-1 p-6">
                                      <div className="text-[10px] text-gray-500 font-black uppercase mb-4">Live Metrics</div>
                                      <div className="space-y-3">
                                          <OmniEsgCell mode="list" label="Network Health" value="Stable" color="emerald" />
                                          <OmniEsgCell mode="list" label="GWC Flow" value="12.5k" color="gold" />
                                      </div>
                                  </div>
                                  <div className="bg-slate-900/60 rounded-3xl border border-white/5 flex-1 p-6">
                                      <div className="text-[10px] text-gray-500 font-black uppercase mb-4">Optimization Suggestions</div>
                                      <div className="text-xs text-gray-400 italic">"Increase diversity of social tokens to improve ecosystem resilience."</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const CollaborationTab = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Handshake className="w-6 h-6 text-celestial-emerald" />
                    {isZh ? '異業合作機會' : 'Cross-Industry Collaboration'}
                </h3>
                <button 
                    onClick={() => setShowApplyForm(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-celestial-emerald text-black font-black rounded-xl hover:scale-105 transition-all text-xs uppercase tracking-widest"
                >
                    <Plus className="w-4 h-4" /> {isZh ? '發起新提案' : 'New Proposal'}
                </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">{isZh ? '推薦專案' : 'Open Projects'}</h4>
                  <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Open</span>
                              <span className="text-xs text-gray-500">Taoyuan, TW</span>
                          </div>
                          <h5 className="font-bold text-white mb-1">SME Carbon Inventory 2.0</h5>
                          <p className="text-sm text-gray-400 mb-4">Seeking partners to implement IoT monitoring for specialized textile plants.</p>
                          <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-800" />
                              <span className="text-[10px] text-gray-500 font-bold uppercase">Partner: EcoSync</span>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">{isZh ? '進行中的協作' : 'Active Collaborations'}</h4>
                  <div className="p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                      <MessageSquare className="w-10 h-10 mx-auto mb-4 opacity-20" />
                      <p className="text-sm">{isZh ? '尚無活躍中的協作對話' : 'No active collaborative dialogues'}</p>
                  </div>
              </div>
          </div>

          {/* Proposal Application Form (Modal) */}
          {showApplyForm && (
              <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                  <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/20 bg-slate-900 overflow-hidden shadow-2xl">
                      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                          <div className="flex items-center gap-3">
                              <Briefcase className="w-5 h-5 text-celestial-emerald" />
                              <h4 className="text-lg font-bold text-white">{isZh ? '提交異業合作提案' : 'Submit Collaboration Proposal'}</h4>
                          </div>
                          <button onClick={() => setShowApplyForm(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                              <X className="w-5 h-5" />
                          </button>
                      </div>
                      
                      <div className="p-8 space-y-6">
                          <div className="space-y-2">
                              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{isZh ? '提案標題' : 'Proposal Title'}</label>
                              <input 
                                  value={proposalData.title}
                                  onChange={(e) => setProposalData({...proposalData, title: e.target.value})}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-celestial-emerald outline-none transition-all"
                                  placeholder={isZh ? "例如：偏鄉太陽能教育專案" : "e.g., Rural Solar Education Project"}
                              />
                          </div>

                          <div className="space-y-2">
                              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{isZh ? '合作詳情與目標' : 'Details & Goals'}</label>
                              <textarea 
                                  rows={4}
                                  value={proposalData.desc}
                                  onChange={(e) => setProposalData({...proposalData, desc: e.target.value})}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-celestial-emerald outline-none transition-all resize-none"
                                  placeholder={isZh ? "請簡述合作內容、預期影響力與資源需求..." : "Briefly describe the collaboration, expected impact..."}
                              />
                          </div>

                          <div className="space-y-3">
                              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{isZh ? '附件上傳 (企劃書/報價)' : 'Attachments (Proposal/Quotes)'}</label>
                              <div 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-celestial-emerald/50 hover:bg-white/5 transition-all group"
                              >
                                  <FileUp className="w-10 h-10 text-gray-500 group-hover:text-celestial-emerald transition-colors mb-3" />
                                  <span className="text-sm font-bold text-gray-400">{isZh ? '點擊或拖入檔案上傳' : 'Click or drag files to upload'}</span>
                                  <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-tighter">Support PDF, DOCX, XLSX (Max 10MB)</p>
                                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                              </div>
                              
                              {/* Attached Files List */}
                              {files.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-4">
                                      {files.map(file => (
                                          <div key={file.id} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[10px] text-gray-300">
                                              <FileText className="w-3 h-3 text-celestial-emerald" />
                                              {file.name}
                                              <button onClick={() => removeFile(file.id)} className="ml-1 text-gray-600 hover:text-rose-400"><X className="w-2.5 h-2.5" /></button>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      </div>

                      <div className="p-6 bg-black/40 border-t border-white/10 flex justify-end gap-3">
                          <button onClick={() => setShowApplyForm(false)} className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">{isZh ? '取消' : 'Cancel'}</button>
                          <button 
                            onClick={submitProposal}
                            disabled={!proposalData.title || !proposalData.desc}
                            className="px-8 py-2 bg-celestial-emerald text-black font-black rounded-xl hover:scale-105 transition-all text-xs uppercase tracking-widest disabled:opacity-30"
                          >
                            {isZh ? '提交提案' : 'Submit Proposal'}
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const PartnerZoneTab = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-6 h-6 text-celestial-gold" />
                    {isZh ? '合作夥伴名錄' : 'Partner Directory'}
              </h3>
              <div className="flex gap-2">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input className="bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-celestial-gold outline-none w-64" placeholder={isZh ? "搜尋合作夥伴..." : "Search partners..."} />
                  </div>
                  <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white border border-white/5"><Filter className="w-4 h-4" /></button>
              </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                  { name: 'EcoTech Solutions', cat: 'IoT & Monitoring', icon: Activity, color: 'text-cyan-400' },
                  { name: 'PureFlow Logistics', cat: 'Circular Supply Chain', icon: RefreshCw, color: 'text-emerald-400' },
                  { name: 'Impact Capital', cat: 'Green Investment', icon: BarChart, color: 'text-amber-400' },
              ].map((p, i) => (
                  <div key={i} className="glass-panel p-8 rounded-[2.5rem] border border-white/10 hover:border-celestial-gold/30 transition-all flex flex-col items-center text-center group">
                      <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                          <p.icon className={`w-10 h-10 ${p.color}`} />
                      </div>
                      <h4 aria-label="Section Title" className="text-lg font-bold text-white mb-1">{p.name}</h4>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">{p.cat}</p>
                      <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white border border-white/10 transition-all w-full flex items-center justify-center gap-2 group-hover:border-white/30">
                          {isZh ? '建立連結' : 'Connect'} <ArrowRight className="w-3 h-3" />
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );

  // Role-Based Content Rendering
  const renderContent = () => {
      if (currentRole === 'Partner') {
          return (
              <>
                  <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-celestial-emerald/10 to-transparent border border-celestial-emerald/30 flex items-center justify-between animate-fade-in shadow-xl shadow-emerald-950/20">
                      <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-celestial-emerald/20 rounded-2xl flex items-center justify-center">
                             <Briefcase className="w-6 h-6 text-celestial-emerald" />
                          </div>
                          <div>
                            <span className="text-lg text-emerald-100 font-bold block">{isZh ? '歡迎回來，合作夥伴' : 'Welcome back, Partner'}</span>
                            <span className="text-xs text-gray-400">Manage your institutional presence in the ecosystem.</span>
                          </div>
                      </div>
                      <button 
                        onClick={() => setShowCanvas(true)} 
                        className="px-6 py-3 bg-celestial-emerald text-black font-black rounded-xl hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                      >
                          {isZh ? '管理畫布' : 'Manage Canvas'}
                      </button>
                  </div>
                  {activeTab === 'partners' ? <PartnerZoneTab /> : <CollaborationTab />} 
              </>
          );
      }

      if (currentRole === 'Admin') {
          return (
              <div className="space-y-6 animate-fade-in">
                  <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-red-500/20 rounded-2xl border border-red-500/30">
                            <Settings className="w-10 h-10 text-red-400" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{isZh ? '行政管理中控台' : 'Admin Dashboard'}</h3>
                            <p className="text-sm text-gray-400">{isZh ? '管理課程進度、學員名單與系統公告。' : 'Manage courses, student lists, and announcements.'}</p>
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <button className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">Audit Logs</button>
                         <button className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">User Permissions</button>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Students', value: '1,245', icon: Users, color: 'emerald' },
                        { label: 'Active Courses', value: '12', icon: GraduationCap, color: 'blue' },
                        { label: 'Pending Apps', value: '8', icon: FileUp, color: 'gold' },
                        { label: 'Revenue (GWC)', value: '850k', icon: Activity, color: 'purple' }
                      ].map(stat => (
                        <div key={stat.label} className="glass-panel p-6 rounded-3xl border-white/10 flex flex-col justify-between h-32">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</span>
                                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                            </div>
                            <div className="text-3xl font-bold text-white font-mono">{stat.value}</div>
                        </div>
                      ))}
                  </div>
              </div>
          );
      }

      if (currentRole === 'Agent') {
          return (
              <div className="space-y-6 animate-fade-in">
                  <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                            <BarChart className="w-10 h-10 text-blue-400" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{isZh ? '代理商業務中心' : 'Agent Sales Center'}</h3>
                            <p className="text-sm text-gray-400">{isZh ? '追蹤推廣成效與佣金結算。' : 'Track promotion performance and commissions.'}</p>
                         </div>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/10">
                        <h4 className="text-lg font-bold text-white mb-6">Commission Overview</h4>
                        <div className="h-64 flex items-center justify-center border border-white/5 rounded-2xl bg-black/20">
                             <BarChart className="w-12 h-12 text-gray-800 opacity-20" />
                             <p className="text-[10px] text-gray-600 uppercase font-black absolute">Analytics Engine Initializing</p>
                        </div>
                    </div>
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex flex-col">
                        <h4 className="font-bold text-white mb-6">Referral Performance</h4>
                        <div className="space-y-4 flex-1">
                            <div className="p-4 bg-white/5 rounded-xl flex justify-between items-center border border-white/5">
                                <span className="text-sm text-gray-300">ESG Strategy Q3</span>
                                <span className="text-xs text-emerald-400 font-mono font-bold">14 Clicks</span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl flex justify-between items-center border border-white/5">
                                <span className="text-sm text-gray-300">Net Zero Masterclass</span>
                                <span className="text-xs text-emerald-400 font-mono font-bold">28 Clicks</span>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
          );
      }

      if (currentRole === 'Parent') {
          return (
              <div className="space-y-6 animate-fade-in">
                  <div className="p-8 bg-purple-500/10 border border-purple-500/20 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                            <Users className="w-10 h-10 text-purple-400" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{isZh ? '家長監護看板' : 'Parent Dashboard'}</h3>
                            <p className="text-sm text-gray-400">{isZh ? '查看孩子的學習進度與證書成就。' : "View your child's learning progress and achievements."}</p>
                         </div>
                      </div>
                  </div>
                  <div className="glass-panel p-8 rounded-[2.5rem] border-white/10">
                      <h4 className="text-xl font-bold text-white mb-8">{isZh ? '學習動態' : 'Learning Activity'}</h4>
                      <div className="space-y-4">
                          <div className="flex items-center gap-5 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                              <CheckCircle className="w-8 h-8 text-emerald-400" />
                              <div>
                                 <div className="text-sm font-bold text-white">Completed: Carbon Footprint Basics</div>
                                 <div className="text-xs text-gray-500">Certificate Issued on 2024.05.12</div>
                              </div>
                          </div>
                          <div className="flex items-center gap-5 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20">
                              <Activity className="w-8 h-8 text-amber-400" />
                              <div>
                                 <div className="text-sm font-bold text-white">In Progress: SDG Leadership Module</div>
                                 <div className="text-xs text-gray-500">Next Lesson: Global Equity (45% Complete)</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      // Default Student View
      if (activeTab === 'collaboration') return <CollaborationTab />;
      if (activeTab === 'partners') return <PartnerZoneTab />;

      return (
          <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-celestial-gold/10 to-transparent border border-celestial-gold/20 mb-2 flex items-center gap-5">
                  <div className="p-3 bg-celestial-gold/20 rounded-2xl text-celestial-gold">
                      <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                      <span className="text-lg text-celestial-gold font-bold block">{isZh ? '學員/顧問專屬視角' : 'Student/Consultant View'}</span>
                      <span className="text-xs text-gray-500">Connect with fellow alumni and access exclusive professional resources.</span>
                  </div>
              </div>
              
              <div className="glass-panel p-12 rounded-[3.5rem] border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)]" />
                  <Users className="w-20 h-20 text-gray-800 mb-8 group-hover:text-white group-hover:scale-110 transition-all duration-700" />
                  <h3 className="text-3xl font-bold text-white mb-3">{isZh ? '全球校友網絡' : 'Global Alumni Network'}</h3>
                  <p className="text-gray-400 max-w-md mb-10 leading-relaxed">{isZh ? '連結來自全球的永續領袖與實踐者，共享專案與洞察。' : 'Connect with sustainability leaders and practitioners globally to share projects and insights.'}</p>
                  <button className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/10 uppercase tracking-widest text-xs">
                      {isZh ? '進入人脈矩陣' : 'Enter Connection Matrix'}
                  </button>
              </div>
          </div>
      );
  };

  const Handshake = Briefcase; // Mock alias

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative">
        <UniversalPageHeader 
            icon={Users}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* Tab Navigation */}
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl">
            {[
                { id: 'network', label: isZh ? '人脈網絡' : 'Network', icon: Users },
                { id: 'collaboration', label: isZh ? '異業合作' : 'Collaboration', icon: Briefcase },
                { id: 'partners', label: isZh ? '生態夥伴' : 'Partners', icon: Globe },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {renderContent()}

        {showCanvas && <CanvasManager />}
    </div>
  );
};
