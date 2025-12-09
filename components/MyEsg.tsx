
import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckSquare, Calendar, Newspaper, Star, Crown, Users, ArrowRight, Sparkles, 
  ListTodo, Plus, Clock, ShieldCheck, Upload, Loader2, Image as ImageIcon, Trash2,
  Bot, TrendingUp, AlertTriangle, Zap, CheckCircle, Target, Radio, Bookmark
} from 'lucide-react';
import { Language, Quest, QuestRarity, View } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { verifyQuestImage } from '../services/ai-service';
import { DAILY_BRIEFING_TEMPLATES } from '../constants';

interface MyEsgProps {
  language: Language;
  onNavigate: (view: View) => void;
}

// Daily Briefing Modal Component
const DailyBriefingModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    language: Language; 
    userName: string;
}> = ({ isOpen, onClose, language, userName }) => {
    const isZh = language === 'zh-TW';
    const template = DAILY_BRIEFING_TEMPLATES[language];
    const [displayedText, setDisplayedText] = useState('');
    const [showInsights, setShowInsights] = useState(false);

    // Typewriter Effect
    useEffect(() => {
        if (isOpen) {
            let i = 0;
            const fullText = template.intro;
            setDisplayedText('');
            setShowInsights(false);
            
            const timer = setInterval(() => {
                if (i < fullText.length) {
                    setDisplayedText(prev => prev + fullText.charAt(i));
                    i++;
                } else {
                    clearInterval(timer);
                    setTimeout(() => setShowInsights(true), 500);
                }
            }, 30); // Speed of typing

            return () => clearInterval(timer);
        }
    }, [isOpen, template.intro]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative group">
                {/* AI Glow Background */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-celestial-purple/10 via-transparent to-celestial-emerald/10 pointer-events-none" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-celestial-gold/10 rounded-full blur-3xl animate-pulse" />

                <div className="relative z-10 p-8">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-lg shadow-purple-500/20">
                            <Bot className="w-8 h-8 text-celestial-purple" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                {template.greeting}, {userName}
                            </h2>
                            <div className="text-sm text-gray-400 font-mono flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                JunAiKey Intelligence Feed
                            </div>
                        </div>
                    </div>

                    {/* AI Message Area - STRICT SINGLE LINE */}
                    <div className="min-h-[40px] text-gray-300 text-lg leading-relaxed mb-8 font-light flex items-center">
                        <div className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
                            {displayedText}
                        </div>
                        <span className="inline-block w-1.5 h-5 ml-1 bg-celestial-purple animate-pulse align-middle flex-shrink-0" />
                    </div>

                    {/* Insights Grid */}
                    {showInsights && (
                        <div className="space-y-4 animate-fade-in">
                            {template.insights.map((insight, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all cursor-default group/item"
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                >
                                    <div className={`mt-1 p-1.5 rounded-lg ${
                                        insight.type === 'risk' ? 'bg-red-500/10 text-red-400' : 
                                        insight.type === 'opportunity' ? 'bg-emerald-500/10 text-emerald-400' : 
                                        'bg-amber-500/10 text-amber-400'
                                    }`}>
                                        {insight.type === 'risk' ? <AlertTriangle className="w-4 h-4" /> : 
                                         insight.type === 'opportunity' ? <TrendingUp className="w-4 h-4" /> : 
                                         <Zap className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70 flex justify-between">
                                            <span className={
                                                insight.type === 'risk' ? 'text-red-400' : 
                                                insight.type === 'opportunity' ? 'text-emerald-400' : 
                                                'text-amber-400'
                                            }>
                                                {isZh ? (insight.type === 'risk' ? '風險警示' : insight.type === 'opportunity' ? '機會訊號' : '異常偵測') : insight.type.toUpperCase()}
                                            </span>
                                            <span className="text-gray-500 font-mono">0{idx + 1}</span>
                                        </div>
                                        <p className="text-sm text-gray-200 group-hover/item:text-white transition-colors">{insight.text}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-center">
                                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {isZh ? '最後更新: 3 分鐘前' : 'Last updated: 3m ago'}
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {template.button}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const MyEsg: React.FC<MyEsgProps> = ({ language, onNavigate }) => {
  const { 
    userName, collectedCards, 
    quests, updateQuestStatus, completeQuest,
    todos, addTodo, toggleTodo, deleteTodo,
    lastBriefingDate, markBriefingRead,
    toggleBookmark, bookmarks
  } = useCompany();
  
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTodo, setNewTodo] = useState('');
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  useEffect(() => {
      const today = new Date().toDateString();
      if (lastBriefingDate !== today) {
          const timer = setTimeout(() => setShowBriefing(true), 1000);
          return () => clearTimeout(timer);
      }
  }, [lastBriefingDate]);

  const handleCloseBriefing = () => {
      setShowBriefing(false);
      markBriefingRead();
      addToast('success', isZh ? '情報已同步至策略中樞' : 'Insights synced to Strategy Hub', 'JunAiKey');
  };

  const handleAddTodo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodo.trim()) return;
      addTodo(newTodo);
      setNewTodo('');
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
          fileInputRef.current?.click();
      } else {
          completeQuest(quest.id, quest.xp);
          addToast('reward', isZh ? `完成任務！+${quest.xp} XP` : `Quest Complete! +${quest.xp} XP`, 'System');
      }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && activeQuestId) {
          const questId = activeQuestId;
          const quest = quests.find(q => q.id === questId);
          if (!quest) return;
          const file = e.target.files[0];
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
      if (fileInputRef.current) fileInputRef.current.value = '';
      setActiveQuestId(null);
  };

  const intelligence = [
      { id: 'intel-1', type: 'podcast', title: isZh ? '楊博的 ESG 創價實驗室 EP.24' : "Yang Bo's ESG Lab EP.24", meta: '15 min' },
      { id: 'intel-2', type: 'course', title: isZh ? '最新課程：供應鏈碳管理' : 'New Course: Supply Chain Carbon', meta: 'Academy' },
      { id: 'intel-3', type: 'news', title: isZh ? '歐盟碳邊境稅最新動態' : 'EU CBAM Latest Updates', meta: '2h ago' }
  ];
  
  const handleBookmark = (item: any) => {
      toggleBookmark({ id: item.id, type: item.type, title: item.title });
      const isAdded = !bookmarks.some(b => b.id === item.id);
      addToast(isAdded ? 'success' : 'info', isAdded ? 'Added to My Collection' : 'Removed from My Collection', 'Bookmark');
  };

  const handleStarCourseClick = () => {
      // Navigate to Academy which defaults to Star Course tab
      onNavigate(View.ACADEMY);
      // Also open the external link as requested
      window.open('https://www.esgsunshine.com/courses/berkeley-tsisda', '_blank');
  };

  const calendarItems = [
    { id: 1, title: 'Net Zero Summit', time: '09:00 AM', type: 'Event', date: 25 },
    { id: 2, title: 'ESG Committee Mtg', time: '02:00 PM', type: 'Meeting', date: 25 },
  ];
  const weekDays = [
      { day: 'Mon', date: 23 },
      { day: 'Tue', date: 24 },
      { day: 'Wed', date: 25, active: true },
      { day: 'Thu', date: 26 },
      { day: 'Fri', date: 27 },
  ];

  const DrYangReportCard = () => (
      <div className="col-span-1 md:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden group border-celestial-gold/30">
          <div className="absolute inset-0 bg-gradient-to-r from-celestial-gold/10 via-transparent to-transparent opacity-50" />
          <div className="absolute right-0 top-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-12 h-12 text-celestial-gold/20 animate-spin-slow" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                  <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-celestial-gold text-black text-xs font-bold rounded flex items-center gap-1">
                          <Crown className="w-3 h-3" /> Exclusive
                      </span>
                      <span className="text-xs text-celestial-gold">{isZh ? '每週更新' : 'Weekly Update'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                      {isZh ? '來自楊博的永續觀察報告' : 'Sustainability Insights from Dr. Yang'}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                      {isZh 
                        ? '本週深度解析：CBAM 正式上路後的供應鏈衝擊與應對策略。為何企業需要立即啟動雙重重大性評估？' 
                        : 'Deep Dive this week: Supply chain impacts of CBAM implementation and strategies. Why double materiality assessment is urgent.'}
                  </p>
              </div>
              <button className="flex items-center gap-2 text-sm text-celestial-gold font-bold hover:underline">
                  {isZh ? '閱讀完整報告' : 'Read Full Report'} <ArrowRight className="w-4 h-4" />
              </button>
          </div>
      </div>
  );

  return (
    <>
        <DailyBriefingModal 
            isOpen={showBriefing} 
            onClose={handleCloseBriefing} 
            language={language}
            userName={userName}
        />

        <div className="space-y-6 animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-4 border-b border-white/5">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    {isZh ? `早安，${userName}` : `Good morning, ${userName}`}
                </h1>
                <p className="text-gray-400 flex items-center gap-2">
                    {isZh ? '準備好開始今天的永續旅程了嗎？' : 'Ready to start your sustainability journey today?'}
                    <span className="px-2 py-0.5 bg-celestial-emerald/10 text-celestial-emerald text-xs rounded-full border border-celestial-emerald/20">
                        ESG Score: 88.4
                    </span>
                </p>
            </div>
            <div className="flex gap-3">
                <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Current Title</div>
                    <div className="text-sm font-bold text-celestial-purple flex items-center justify-end gap-1">
                        <Crown className="w-3 h-3" />
                        {isZh ? '永續先鋒 (Sustainability Pioneer)' : 'Sustainability Pioneer'}
                    </div>
                </div>
            </div>
        </div>

        {/* Star Course Headline Banner */}
        <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden group cursor-pointer border border-celestial-gold/30 shadow-2xl shadow-amber-900/20 mb-2" onClick={handleStarCourseClick}>
            <div className="absolute inset-0">
                <img src="https://thumbs4.imagebam.com/12/1d/de/ME18KXOE_t.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Berkeley Course" />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            </div>
            <div className="absolute inset-0 p-8 flex flex-col justify-center max-w-2xl relative z-10">
                <div className="flex gap-2 mb-3">
                     <span className="px-3 py-1 bg-celestial-gold text-black text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <Crown className="w-3 h-3" /> Headline
                    </span>
                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-md border border-white/20">
                        Limited Time
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    Berkeley x TSISDA <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold to-amber-200">International ESG Strategy Program</span>
                </h2>
                <p className="text-gray-300 mb-6 text-sm md:text-base line-clamp-2 max-w-xl">
                    {isZh 
                        ? '全球唯一整合 Berkeley Haas IBI 八大機構智慧與台灣永續實務。五合一訓練：策略 × 合規 × 創新 × 創價 × 顧問。立即報名雙證班。' 
                        : 'The only global program integrating Berkeley Haas IBI wisdom with Taiwan\'s practical ESG implementation. 5-in-1 Strategy Training. Register for Dual Certification.'}
                </p>
                <button className="w-fit px-6 py-3 bg-celestial-gold hover:bg-amber-400 text-black font-bold rounded-xl transition-all flex items-center gap-2 group/btn shadow-lg">
                    {isZh ? '立即查看' : 'View Now'}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="md:col-span-2 glass-panel p-0 rounded-2xl border-white/10 flex flex-col overflow-hidden relative">
                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center relative z-10">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-celestial-gold" />
                        {isZh ? '我的任務 (My Quests)' : 'My Quests'}
                    </h3>
                    <div className="flex gap-2">
                        <span className="text-[10px] px-2 py-1 bg-white/10 rounded text-gray-300 border border-white/5 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {isZh ? '系統指派' : 'System Assigned'}
                        </span>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 max-h-[300px] bg-slate-900/40">
                    {quests.map(quest => (
                        <div 
                            key={quest.id} 
                            onClick={() => handleQuestClick(quest)}
                            className={`
                                relative p-3 rounded-xl border transition-all cursor-pointer group flex items-center gap-4 overflow-hidden
                                ${getRarityStyles(quest.rarity)}
                                ${quest.status === 'completed' ? 'opacity-50 grayscale' : 'hover:scale-[1.01] hover:shadow-lg'}
                            `}
                        >
                            {quest.rarity === 'Legendary' && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent animate-pulse pointer-events-none" />}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                                quest.status === 'completed' ? 'bg-emerald-500 border-emerald-400' :
                                quest.status === 'verifying' ? 'bg-blue-500 border-blue-400 animate-pulse' :
                                'bg-black/30 border-white/20'
                            }`}>
                                {quest.status === 'completed' ? <CheckSquare className="w-5 h-5 text-white" /> :
                                quest.status === 'verifying' ? <Loader2 className="w-5 h-5 text-white animate-spin" /> :
                                quest.requirement === 'image_upload' ? <ImageIcon className="w-5 h-5 text-gray-300" /> :
                                <Target className="w-5 h-5 text-gray-300" />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-1.5 rounded-sm border 
                                        ${quest.rarity === 'Legendary' ? 'text-amber-400 border-amber-500/30' : 
                                        quest.rarity === 'Epic' ? 'text-purple-400 border-purple-500/30' : 
                                        quest.rarity === 'Rare' ? 'text-blue-400 border-blue-500/30' : 'text-gray-400 border-gray-600'}
                                    `}>
                                        {quest.type}
                                    </span>
                                    <h4 className={`text-sm font-bold truncate ${quest.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                                        {quest.title}
                                    </h4>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{quest.desc}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-sm font-mono font-bold text-celestial-gold">+{quest.xp} XP</div>
                                {quest.requirement === 'image_upload' && quest.status === 'active' && (
                                    <div className="text-[10px] text-blue-400 flex items-center justify-end gap-1 mt-1">
                                        <Upload className="w-3 h-3" /> {isZh ? '需上傳' : 'Upload'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>

            <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Radio className="w-5 h-5 text-red-400 animate-pulse" />
                        {isZh ? '最新情報' : 'Latest Intel'}
                    </h3>
                </div>
                <div className="flex-1 space-y-3">
                    {intelligence.map(item => (
                        <div key={item.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-celestial-purple/30 transition-all group flex gap-3">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                        item.type === 'podcast' ? 'bg-purple-500/20 text-purple-300' :
                                        item.type === 'course' ? 'bg-blue-500/20 text-blue-300' :
                                        'bg-gray-500/20 text-gray-300'
                                    }`}>
                                        {item.type}
                                    </span>
                                    <span className="text-[10px] text-gray-500">{item.meta}</span>
                                </div>
                                <h4 className="text-sm font-medium text-white group-hover:text-celestial-purple transition-colors leading-snug">
                                    {item.title}
                                </h4>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleBookmark(item); }}
                                className={`self-start p-1 rounded hover:bg-white/10 ${bookmarks.some(b => b.id === item.id) ? 'text-celestial-gold' : 'text-gray-600 hover:text-celestial-gold'}`}
                            >
                                <Star className={`w-4 h-4 ${bookmarks.some(b => b.id === item.id) ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <ListTodo className="w-5 h-5 text-emerald-400" />
                        {isZh ? '我的待辦 (To-Do)' : 'My To-Do'}
                    </h3>
                    <div className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                        {todos.filter(t => t.done).length}/{todos.length}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 max-h-[200px]">
                    {todos.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => toggleTodo(task.id)}>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500 hover:border-emerald-400'}`}>
                                    {task.done && <CheckSquare className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`text-sm truncate ${task.done ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                                    {task.text}
                                </span>
                            </div>
                            <button onClick={() => deleteTodo(task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddTodo} className="mt-4 pt-3 border-t border-white/10 relative">
                    <input 
                        type="text" 
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder={isZh ? "新增個人記事..." : "Add note..."}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:border-celestial-emerald/50"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors">
                        <Plus className="w-3 h-3" />
                    </button>
                </form>
            </div>

            <DrYangReportCard />

            <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-400" />
                    {isZh ? '我的日曆 (Calendar)' : 'My Calendar'}
                </h3>
                <div className="flex justify-between mb-4 pb-2 border-b border-white/5">
                    {weekDays.map((d, i) => (
                        <div key={i} className={`flex flex-col items-center p-1.5 rounded-lg ${d.active ? 'bg-red-500/20 text-white border border-red-500/40' : 'text-gray-500 hover:bg-white/5'}`}>
                            <span className="text-[9px] uppercase tracking-wide">{d.day}</span>
                            <span className={`text-xs font-bold ${d.active ? 'text-red-400' : ''}`}>{d.date}</span>
                        </div>
                    ))}
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar max-h-[150px]">
                    {calendarItems.map(ev => (
                        <div key={ev.id} className="flex gap-3 items-center p-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                            <div className={`w-1 h-full min-h-[2rem] rounded-full ${ev.date === 25 ? 'bg-red-400' : 'bg-gray-600'}`} />
                            <div className="flex-1">
                                <div className="text-sm font-medium text-white group-hover:text-red-300 transition-colors">{ev.title}</div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{ev.time}</span>
                                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px]">{ev.type}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-white/10 bg-gradient-to-b from-slate-800/50 to-transparent">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-celestial-gold" />
                    {isZh ? '我的收藏' : 'My Collection'}
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {bookmarks.length === 0 ? (
                        <span className="text-xs text-gray-500 block text-center py-4">No bookmarks yet.</span>
                    ) : (
                        bookmarks.map((b) => (
                            <div key={b.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-celestial-gold/30 group cursor-pointer">
                                <Star className="w-3 h-3 text-celestial-gold fill-current" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">{b.title}</div>
                                    <div className="text-[9px] text-gray-500">{b.type.toUpperCase()} • {new Date(b.addedAt).toLocaleDateString()}</div>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); toggleBookmark(b); }}
                                    className="p-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    </div>
    </>
  );
};
