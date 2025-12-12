
import React, { useState } from 'react';
import { Language } from '../types';
import { 
    Users, BookOpen, GraduationCap, Video, Calendar, FileText, 
    MessageSquare, Settings, Award, Plus, Layout, UserPlus, 
    Briefcase, Activity, CheckCircle, ExternalLink, RefreshCw,
    PlayCircle, Upload, PenTool, BarChart, DollarSign
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { OmniEsgCell } from './OmniEsgCell';
import { UniversalPageHeader } from './UniversalPageHeader';

interface AlumniZoneProps {
  language: Language;
}

type UserRole = 'Admin' | 'Agent' | 'Consultant' | 'Student' | 'Parent';

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

export const AlumniZone: React.FC<AlumniZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  
  // State for Role Switching
  const [currentRole, setCurrentRole] = useState<UserRole>('Student');
  const [activeTab, setActiveTab] = useState('courses');
  const [isSyncing, setIsSyncing] = useState(false);

  const pageData = {
      title: { zh: '校友專區 & LMS', en: 'Alumni & LMS Zone' },
      desc: { zh: '全方位學習管理：課前、課中、課後一站式服務', en: 'Comprehensive Learning Management: Pre, In, Post-class services' },
      tag: { zh: '學習核心', en: 'LMS Core' }
  };

  // Toggle Role Function
  const handleRoleSwitch = (role: UserRole) => {
      setCurrentRole(role);
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

  // --- RENDER SECTIONS ---

  // 1. Role Selector (Top Bar)
  const RoleSelector = () => (
      <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 mb-6 overflow-x-auto no-scrollbar">
          {(['Admin', 'Agent', 'Consultant', 'Student', 'Parent'] as UserRole[]).map(role => (
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
                    (role === 'Admin' ? '行政管理' : role === 'Agent' ? '代理/業務' : role === 'Consultant' ? '顧問/講師' : role === 'Student' ? '學員' : '家長') 
                    : role}
              </button>
          ))}
      </div>
  );

  // 2. Lifecycle Dashboard (Pre/In/Post)
  const LifecycleDashboard = () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-blue-500 bg-blue-900/10">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-white text-lg">{isZh ? '課前準備 (Pre-Class)' : 'Pre-Class'}</h4>
                  <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> {isZh ? '註冊與繳費確認' : 'Registration & Payment'}</li>
                  <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> {isZh ? '加入 Google Classroom' : 'Join Google Classroom'}</li>
                  <li className="flex gap-2 items-center"><Activity className="w-4 h-4 text-amber-400 animate-pulse" /> {isZh ? '預習教材下載' : 'Material Download'}</li>
              </ul>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-celestial-gold bg-amber-900/10">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-white text-lg">{isZh ? '課中互動 (In-Class)' : 'In-Class'}</h4>
                  <Video className="w-5 h-5 text-celestial-gold" />
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2 items-center"><PlayCircle className="w-4 h-4 text-celestial-gold" /> {isZh ? '直播教室連結' : 'Live Stream Link'}</li>
                  <li className="flex gap-2 items-center"><MessageSquare className="w-4 h-4 text-celestial-gold" /> {isZh ? '即時 Q&A 互動' : 'Real-time Q&A'}</li>
                  <li className="flex gap-2 items-center"><PenTool className="w-4 h-4 text-gray-500" /> {isZh ? '線上簽到' : 'Attendance Check'}</li>
              </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-celestial-purple bg-purple-900/10">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-white text-lg">{isZh ? '課後延伸 (Post-Class)' : 'Post-Class'}</h4>
                  <Award className="w-5 h-5 text-celestial-purple" />
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2 items-center"><Upload className="w-4 h-4 text-gray-500" /> {isZh ? '作業上傳' : 'Homework Upload'}</li>
                  <li className="flex gap-2 items-center"><BarChart className="w-4 h-4 text-gray-500" /> {isZh ? '滿意度調查' : 'Survey'}</li>
                  <li className="flex gap-2 items-center"><Users className="w-4 h-4 text-celestial-purple" /> {isZh ? '校友網絡交流' : 'Alumni Networking'}</li>
              </ul>
          </div>
      </div>
  );

  // 3. Main Content Views based on Role
  const renderContent = () => {
      switch (currentRole) {
          case 'Student':
              return (
                  <div className="space-y-6">
                      <LifecycleDashboard />
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
                                      <div className="flex items-center gap-4">
                                          {course.platform === 'Google' && (
                                              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20 flex items-center gap-1">
                                                  <ExternalLink className="w-3 h-3" /> Google Class
                                              </span>
                                          )}
                                          <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                              <div className="h-full bg-celestial-blue" style={{ width: `${course.progress}%` }} />
                                          </div>
                                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors">
                                              {isZh ? '進入教室' : 'Enter'}
                                          </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              );

          case 'Admin':
              return (
                  <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="glass-panel p-6 rounded-2xl border border-white/10">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                  <Layout className="w-5 h-5 text-celestial-purple" />
                                  {isZh ? '課程建構器 (Course Builder)' : 'Course Builder'}
                              </h3>
                              <div className="space-y-3">
                                  <button className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                      <Plus className="w-4 h-4" /> {isZh ? '新增課程模組' : 'Add Module'}
                                  </button>
                                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                                      <span className="text-sm text-gray-300">Module 1: Carbon Basics</span>
                                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Published</span>
                                  </div>
                                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                                      <span className="text-sm text-gray-300">Module 2: SBTi Strategy</span>
                                      <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">Draft</span>
                                  </div>
                              </div>
                          </div>

                          <div className="glass-panel p-6 rounded-2xl border border-white/10">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                  <RefreshCw className="w-5 h-5 text-green-400" />
                                  {isZh ? 'LMS 整合 (Integration)' : 'LMS Integration'}
                              </h3>
                              <div className="space-y-4">
                                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center font-bold text-white text-xs">G</div>
                                          <div>
                                              <div className="text-sm font-bold text-white">Google Classroom</div>
                                              <div className="text-xs text-gray-400">{isZh ? '同步學生與作業' : 'Sync rosters & assignments'}</div>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={handleGoogleSync}
                                          disabled={isSyncing}
                                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50"
                                      >
                                          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              );

          case 'Agent':
              return (
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                          <Briefcase className="w-6 h-6 text-celestial-gold" />
                          {isZh ? '代理商/業務 CRM' : 'Agent CRM'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <OmniEsgCell mode="list" label={isZh ? '本月招生' : 'Students Enrolled'} value="12" color="emerald" icon={UserPlus} />
                          <OmniEsgCell mode="list" label={isZh ? '預估佣金' : 'Est. Commission'} value="$4,800" color="gold" icon={DollarSign} />
                          <OmniEsgCell mode="list" label={isZh ? '完課率' : 'Completion Rate'} value="92%" color="purple" icon={Activity} />
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-gray-300">
                              <thead className="text-xs uppercase text-gray-500 border-b border-white/10">
                                  <tr>
                                      <th className="py-3">{isZh ? '學員姓名' : 'Student Name'}</th>
                                      <th className="py-3">{isZh ? '課程' : 'Course'}</th>
                                      <th className="py-3">{isZh ? '狀態' : 'Status'}</th>
                                      <th className="py-3 text-right">{isZh ? '操作' : 'Action'}</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                  <tr>
                                      <td className="py-3">Alice Chen</td>
                                      <td>ISO 14064</td>
                                      <td><span className="text-emerald-400">Active</span></td>
                                      <td className="text-right"><button className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20">Contact</button></td>
                                  </tr>
                                  <tr>
                                      <td className="py-3">Bob Lin</td>
                                      <td>ESG Strategy</td>
                                      <td><span className="text-amber-400">Pending Payment</span></td>
                                      <td className="text-right"><button className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20">Remind</button></td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              );

          case 'Consultant':
              return (
                  <div className="space-y-6">
                      <div className="glass-panel p-6 rounded-2xl border border-white/10">
                          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                              <GraduationCap className="w-6 h-6 text-celestial-purple" />
                              {isZh ? '顧問教學中心' : 'Teaching Center'}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                  <h4 className="font-bold text-white mb-2">{isZh ? '待批改作業' : 'Pending Grading'}</h4>
                                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg mb-2">
                                      <span className="text-sm text-gray-300">Assignment 3: Carbon Calculation</span>
                                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">5 pending</span>
                                  </div>
                                  <button className="w-full py-2 bg-celestial-purple/20 text-celestial-purple rounded-lg text-xs font-bold hover:bg-celestial-purple/30 transition-all">
                                      {isZh ? '前往批改' : 'Go to Grading'}
                                  </button>
                              </div>
                              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                  <h4 className="font-bold text-white mb-2">{isZh ? '學員提問' : 'Student Q&A'}</h4>
                                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg mb-2">
                                      <span className="text-sm text-gray-300">Q: Scope 3 Category 1 boundary?</span>
                                      <span className="text-xs text-gray-500">2h ago</span>
                                  </div>
                                  <button className="w-full py-2 bg-celestial-blue/20 text-celestial-blue rounded-lg text-xs font-bold hover:bg-celestial-blue/30 transition-all">
                                      {isZh ? '回覆問題' : 'Reply'}
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              );

          case 'Parent':
              return (
                  <div className="space-y-6">
                      <div className="glass-panel p-6 rounded-2xl border border-white/10">
                          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                              <Activity className="w-6 h-6 text-emerald-400" />
                              {isZh ? '家長監控面板' : 'Parent Dashboard'}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <OmniEsgCell mode="card" label={isZh ? '出席率' : 'Attendance'} value="100%" color="emerald" icon={CheckCircle} />
                              <OmniEsgCell mode="card" label={isZh ? '作業完成度' : 'Homework Completion'} value="8/10" color="blue" icon={FileText} />
                          </div>
                          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
                              <h4 className="font-bold text-white mb-2">{isZh ? '最新評語' : 'Latest Feedback'}</h4>
                              <p className="text-sm text-gray-300 italic">"Excellent understanding of ESG frameworks. Needs to focus more on quantitative calculation." - Dr. Yang</p>
                          </div>
                      </div>
                  </div>
              );
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Users}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <RoleSelector />
        
        {renderContent()}
    </div>
  );
};
