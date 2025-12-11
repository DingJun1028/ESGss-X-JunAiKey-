
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  DashboardWidget, AuditLogEntry, EsgCard, Quest, ToDoItem, NoteItem, BookmarkItem, 
  UserTier, CarbonData, MasteryLevel, Badge, WidgetType, AppFile, IntelligenceItem
} from '../../types';
import { universalIntelligence } from '../../services/evolutionEngine';

// Initial Mock Data
const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'Upload Electricity Bill', desc: 'Upload PDF invoice for HQ.', type: 'Daily', rarity: 'Common', xp: 100, status: 'active', requirement: 'image_upload' },
  { id: 'q2', title: 'Supplier Engagement', desc: 'Send survey to Tier 1 suppliers.', type: 'Weekly', rarity: 'Rare', xp: 300, status: 'active', requirement: 'manual' },
  { id: 'q3', title: 'Carbon Neutral Day', desc: 'Achieve net zero emissions for 24h.', type: 'Challenge', rarity: 'Legendary', xp: 1000, status: 'active', requirement: 'manual' }
];

interface CompanyContextType {
  userName: string;
  setUserName: (name: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  tier: UserTier;
  upgradeTier: (tier: UserTier) => void;
  
  xp: number;
  level: number;
  awardXp: (amount: number) => void;
  
  goodwillBalance: number;
  updateGoodwillBalance: (amount: number) => void;
  
  esgScores: { environmental: number; social: number; governance: number };
  updateEsgScore: (category: 'environmental' | 'social' | 'governance', val: number) => void;
  totalScore: number;
  
  carbonData: CarbonData;
  updateCarbonData: (data: Partial<CarbonData>) => void;
  
  budget: number;
  setBudget: (val: number) => void;
  carbonCredits: number;
  setCarbonCredits: (val: number) => void;
  
  quests: Quest[];
  updateQuestStatus: (id: string, status: 'active' | 'verifying' | 'completed') => void;
  completeQuest: (id: string, xpReward: number) => void;
  
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, details: string) => void;
  
  collectedCards: string[];
  unlockCard: (id: string) => void;
  purifiedCards: string[];
  purifyCard: (id: string) => void;
  cardMastery: Record<string, MasteryLevel>;
  updateCardMastery: (id: string, level: MasteryLevel) => void;
  
  todos: ToDoItem[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  
  universalNotes: NoteItem[];
  addNote: (content: string, tags?: string[]) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  
  bookmarks: BookmarkItem[];
  toggleBookmark: (item: { id: string; type: 'article' | 'video' | 'news'; title: string; link?: string }) => void;
  
  // Universal File System
  files: AppFile[];
  addFile: (file: File, sourceModule: string) => void;
  removeFile: (id: string) => void;

  // Universal Intelligence System (My Intelligence)
  myIntelligence: IntelligenceItem[];
  saveIntelligence: (item: IntelligenceItem) => void;
  
  lastBriefingDate: string;
  markBriefingRead: () => void;
  latestEvent: string;
  setLatestEvent: (event: string) => void;
  
  customWidgets: DashboardWidget[];
  addCustomWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full' }) => void;
  removeCustomWidget: (id: string) => void;
  
  checkBadges: () => Badge[];
  resetData: () => void;

  // New: Cross-Module Intelligence
  intelligenceBrief: any;
  setIntelligenceBrief: (data: any) => void;

  // Unlock Status
  isAiToolsUnlocked: boolean;
  unlockAiTools: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User Profile
  const [userName, setUserName] = useState('DingJun Hong');
  const [userRole, setUserRole] = useState('CSO');
  const [companyName, setCompanyName] = useState('TechFlow Industries');
  const [tier, setTier] = useState<UserTier>('Free');
  
  // Gamification
  const [xp, setXp] = useState(1250);
  const [goodwillBalance, setGoodwillBalance] = useState(2450);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  
  // ESG Metrics
  const [esgScores, setEsgScores] = useState({ environmental: 72, social: 85, governance: 68 });
  const [carbonData, setCarbonData] = useState<CarbonData>({ 
    fuelConsumption: 15000, 
    electricityConsumption: 45000, 
    scope1: 420.5, 
    scope2: 380.2, 
    scope3: 1200.0, 
    lastUpdated: Date.now() 
  });
  
  // Assets
  const [budget, setBudget] = useState(500000);
  const [carbonCredits, setCarbonCredits] = useState(1500);
  const [isAiToolsUnlocked, setIsAiToolsUnlocked] = useState(false);
  
  // Collections
  const [collectedCards, setCollectedCards] = useState<string[]>(['card-legend-001', 'card-e1-001']);
  const [purifiedCards, setPurifiedCards] = useState<string[]>(['card-legend-001']);
  const [cardMastery, setCardMastery] = useState<Record<string, MasteryLevel>>({ 'card-legend-001': 'Master' });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  // Productivity & Files
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [universalNotes, setUniversalNotes] = useState<NoteItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [files, setFiles] = useState<AppFile[]>([]);
  
  // Intelligence System
  const [myIntelligence, setMyIntelligence] = useState<IntelligenceItem[]>([
      { id: 'intel-def-1', type: 'news', title: 'EU CBAM Updates', source: 'System Feed', date: new Date().toISOString(), summary: 'Latest regulatory changes.', tags: ['Compliance'], isRead: false },
      { id: 'intel-def-2', type: 'report', title: 'Yang Bo Analysis EP.24', source: 'Yang Bo Zone', date: new Date().toISOString(), summary: 'Strategic insights for Q3.', tags: ['Strategy'], isRead: false }
  ]);

  // System
  const [lastBriefingDate, setLastBriefingDate] = useState('never');
  const [latestEvent, setLatestEvent] = useState('System Initialized');
  const [customWidgets, setCustomWidgets] = useState<DashboardWidget[]>([
    { id: 'w1', type: 'kpi_card', title: 'ESG Score', config: { metricId: '3' }, gridSize: 'small' }
  ]);
  
  // Cross-Module State
  const [intelligenceBrief, setIntelligenceBrief] = useState<any>(null);

  // Computed
  const level = Math.floor(xp / 1000) + 1;
  const totalScore = parseFloat(((esgScores.environmental + esgScores.social + esgScores.governance) / 3).toFixed(1));

  // Persistence (Load)
  useEffect(() => {
    const saved = localStorage.getItem('esgss_state_v3');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserName(data.userName || 'DingJun Hong');
        setUserRole(data.userRole || 'CSO');
        setCompanyName(data.companyName || 'TechFlow');
        setTier(data.tier || 'Free');
        setXp(data.xp || 1250);
        setGoodwillBalance(data.goodwillBalance || 2450);
        setEsgScores(data.esgScores || { environmental: 72, social: 85, governance: 68 });
        setCarbonData(data.carbonData || { fuelConsumption: 0, electricityConsumption: 0, scope1: 0, scope2: 0, scope3: 0, lastUpdated: Date.now() });
        setBudget(data.budget || 500000);
        setCarbonCredits(data.carbonCredits || 1500);
        setCollectedCards(data.collectedCards || []);
        setPurifiedCards(data.purifiedCards || []);
        setCardMastery(data.cardMastery || {});
        setAuditLogs(data.auditLogs || []);
        setTodos(data.todos || []);
        setUniversalNotes(data.universalNotes || []);
        setBookmarks(data.bookmarks || []);
        setFiles(data.files || []);
        setMyIntelligence(data.myIntelligence || []);
        setLastBriefingDate(data.lastBriefingDate || 'never');
        setCustomWidgets(data.customWidgets || []);
        setIsAiToolsUnlocked(data.isAiToolsUnlocked || false);
      } catch (e) { console.error("Failed to load state", e); }
    }
  }, []);

  // Persistence (Save)
  useEffect(() => {
    const state = {
      userName, userRole, companyName, tier, xp, goodwillBalance, esgScores, carbonData,
      budget, carbonCredits, collectedCards, purifiedCards, cardMastery, auditLogs,
      todos, universalNotes, bookmarks, files, myIntelligence, lastBriefingDate, customWidgets,
      isAiToolsUnlocked
    };
    localStorage.setItem('esgss_state_v3', JSON.stringify(state));
  }, [userName, userRole, companyName, tier, xp, goodwillBalance, esgScores, carbonData, budget, carbonCredits, collectedCards, purifiedCards, cardMastery, auditLogs, todos, universalNotes, bookmarks, files, myIntelligence, lastBriefingDate, customWidgets, isAiToolsUnlocked]);

  // Actions
  const upgradeTier = (newTier: UserTier) => setTier(newTier);
  const awardXp = (amount: number) => setXp(prev => prev + amount);
  const updateGoodwillBalance = (amount: number) => setGoodwillBalance(prev => prev + amount);
  
  const updateEsgScore = (cat: 'environmental' | 'social' | 'governance', val: number) => {
    setEsgScores(prev => ({ ...prev, [cat]: val }));
  };
  
  const updateCarbonData = (data: Partial<CarbonData>) => {
    setCarbonData(prev => ({ ...prev, ...data, lastUpdated: Date.now() }));
  };
  
  const updateQuestStatus = (id: string, status: 'active' | 'verifying' | 'completed') => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };
  
  const completeQuest = (id: string, reward: number) => {
    updateQuestStatus(id, 'completed');
    awardXp(reward);
  };
  
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      action,
      user: userName,
      details,
      hash: '0x' + Math.random().toString(16).substr(2, 64), // Simulated Hash
      verified: true
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };
  
  const unlockCard = (id: string) => {
    if (!collectedCards.includes(id)) {
      setCollectedCards(prev => [...prev, id]);
    }
  };
  
  const purifyCard = (id: string) => {
    if (!purifiedCards.includes(id)) {
      setPurifiedCards(prev => [...prev, id]);
    }
  };
  
  const updateCardMastery = (id: string, level: MasteryLevel) => {
    setCardMastery(prev => ({ ...prev, [id]: level }));
  };
  
  const addTodo = (text: string) => {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  };
  
  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  
  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };
  
  const addNote = (content: string, tags: string[] = []) => {
    setUniversalNotes(prev => [{ id: Date.now().toString(), content, tags, createdAt: Date.now(), source: 'manual' }, ...prev]);
  };
  
  const updateNote = (id: string, content: string) => {
    setUniversalNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n));
  };
  
  const deleteNote = (id: string) => {
    setUniversalNotes(prev => prev.filter(n => n.id !== id));
  };
  
  const toggleBookmark = (item: { id: string; type: 'article' | 'video' | 'news'; title: string; link?: string }) => {
    if (bookmarks.some(b => b.id === item.id)) {
      setBookmarks(prev => prev.filter(b => b.id !== item.id));
    } else {
      setBookmarks(prev => [{ ...item, addedAt: Date.now() }, ...prev]);
    }
  };

  // --- Universal File System Logic ---
  const addFile = (file: File, sourceModule: string) => {
      // 1. Initial Entry (Scanning state)
      const newFile: AppFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          type: file.type.split('/')[1] || 'unknown',
          size: (file.size / 1024).toFixed(1) + ' KB',
          uploadDate: Date.now(),
          sourceModule,
          status: 'scanning',
          tags: ['Incoming'],
          confidence: 0
      };
      
      setFiles(prev => [newFile, ...prev]);
      
      // 2. Simulate AI Processing (The "Inside Out" Gap Filling)
      setTimeout(() => {
          setFiles(prev => prev.map(f => {
              if (f.id === newFile.id) {
                  // Logic: Gap Filling based on Source
                  const autoTags = ['Processed'];
                  let summary = 'AI has indexed this file.';
                  
                  if (sourceModule === 'ResearchHub') {
                      autoTags.push('Research');
                      summary = 'Contains regulatory keywords.';
                  } else if (sourceModule === 'UniversalTools') {
                      autoTags.push('Knowledge');
                      summary = 'Added to Neural Network training set.';
                  } else {
                      autoTags.push('Operations');
                  }

                  return {
                      ...f,
                      status: 'processed',
                      tags: [...f.tags, ...autoTags],
                      aiSummary: summary,
                      confidence: 95
                  };
              }
              return f;
          }));
          addAuditLog('File System', `Processed ${file.name} from ${sourceModule}. Gap-filling complete.`);
      }, 2500);
  };

  const removeFile = (id: string) => {
      setFiles(prev => prev.filter(f => f.id !== id));
  };

  // --- Intelligence System Logic ---
  const saveIntelligence = (item: IntelligenceItem) => {
      setMyIntelligence(prev => [item, ...prev]);
      // Trigger Evolution: Report to Universal Brain
      universalIntelligence.recordInteraction({
          componentId: 'Intel_Ingestion',
          eventType: 'ai-trigger',
          timestamp: Date.now(),
          payload: { title: item.title, type: item.type }
      });
      addAuditLog('Intelligence System', `Saved intelligence: ${item.title}`);
  };
  
  const markBriefingRead = () => setLastBriefingDate(new Date().toDateString());
  
  const addCustomWidget = (widget: Partial<DashboardWidget>) => {
    const newWidget: DashboardWidget = {
      id: `w-${Date.now()}`,
      type: widget.type || 'kpi_card',
      title: widget.title || 'New Widget',
      config: widget.config || {},
      gridSize: widget.gridSize || 'small'
    };
    setCustomWidgets(prev => [...prev, newWidget]);
  };
  
  const removeCustomWidget = (id: string) => {
    setCustomWidgets(prev => prev.filter(w => w.id !== id));
  };
  
  const checkBadges = (): Badge[] => {
    // Simplified logic
    return [];
  };
  
  const resetData = () => {
    localStorage.removeItem('esgss_state_v3');
    window.location.reload();
  };

  const unlockAiTools = () => {
      setIsAiToolsUnlocked(true);
  };

  return (
    <CompanyContext.Provider value={{
      userName, setUserName, userRole, setUserRole, companyName, setCompanyName, tier, upgradeTier,
      xp, level, awardXp, goodwillBalance, updateGoodwillBalance, esgScores, updateEsgScore, totalScore,
      carbonData, updateCarbonData, budget, setBudget, carbonCredits, setCarbonCredits,
      quests, updateQuestStatus, completeQuest, auditLogs, addAuditLog,
      collectedCards, unlockCard, purifiedCards, purifyCard, cardMastery, updateCardMastery,
      todos, addTodo, toggleTodo, deleteTodo, universalNotes, addNote, updateNote, deleteNote,
      bookmarks, toggleBookmark, lastBriefingDate, markBriefingRead, latestEvent, setLatestEvent,
      customWidgets, addCustomWidget, removeCustomWidget, checkBadges, resetData,
      intelligenceBrief, setIntelligenceBrief,
      files, addFile, removeFile,
      myIntelligence, saveIntelligence,
      isAiToolsUnlocked, unlockAiTools
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
