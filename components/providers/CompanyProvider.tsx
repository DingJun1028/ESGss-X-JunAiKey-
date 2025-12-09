
import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserTier, AuditLogEntry, EsgCard, Badge, CarbonData, Quest, ToDoItem, NoteItem, BookmarkItem, DashboardWidget, MasteryLevel, QuestRarity } from '../../types';

interface CompanyContextType {
  // Profile
  userName: string;
  setUserName: (name: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  tier: UserTier;
  upgradeTier: (tier: UserTier) => void;
  
  // Game Mechanics
  xp: number;
  level: number;
  awardXp: (amount: number) => void;
  goodwillBalance: number;
  updateGoodwillBalance: (amount: number) => void;
  
  // Simulation Data
  carbonData: CarbonData;
  updateCarbonData: (data: Partial<CarbonData>) => void;
  esgScores: { environmental: number; social: number; governance: number };
  updateEsgScore: (category: 'environmental' | 'social' | 'governance', value: number) => void;
  totalScore: number;
  budget: number;
  setBudget: (amount: number) => void;
  carbonCredits: number;
  setCarbonCredits: (amount: number) => void;
  
  // Cards & Collection
  collectedCards: string[];
  unlockCard: (cardId: string) => void;
  purifiedCards: string[];
  purifyCard: (cardId: string) => void;
  cardMastery: Record<string, MasteryLevel>;
  updateCardMastery: (cardId: string, level: MasteryLevel) => void;
  
  // Quests & Tasks
  quests: Quest[];
  updateQuestStatus: (id: string, status: Quest['status']) => void;
  completeQuest: (id: string, rewardXp: number) => void;
  todos: ToDoItem[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  
  // Universal Tools
  universalNotes: NoteItem[];
  addNote: (content: string, tags?: string[], source?: 'manual' | 'voice' | 'ai') => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  bookmarks: BookmarkItem[];
  toggleBookmark: (item: Partial<BookmarkItem>) => void;
  
  // System
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, details: string) => void;
  lastBriefingDate: string;
  markBriefingRead: () => void;
  latestEvent: string;
  customWidgets: DashboardWidget[];
  addCustomWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  removeCustomWidget: (id: string) => void;
  resetData: () => void;
  checkBadges: () => Badge[];
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState('DingJun Hong');
  const [userRole, setUserRole] = useState('Chief Strategy Officer');
  const [companyName, setCompanyName] = useState('TechFlow Industries');
  const [tier, setTier] = useState<UserTier>('Free');
  
  const [xp, setXp] = useState(1250);
  const [level, setLevel] = useState(2);
  const [goodwillBalance, setGoodwillBalance] = useState(2450);
  
  const [carbonData, setCarbonData] = useState<CarbonData>({
    fuelConsumption: 1200,
    electricityConsumption: 4500,
    scope1: 420.5,
    scope2: 380.2,
    scope3: 1250.0,
    lastUpdated: Date.now()
  });
  
  const [esgScores, setEsgScores] = useState({ environmental: 72, social: 65, governance: 80 });
  const [budget, setBudget] = useState(500000); // USD
  const [carbonCredits, setCarbonCredits] = useState(500); // tCO2e
  
  const [collectedCards, setCollectedCards] = useState<string[]>(['card-e1-001', 'card-g2-001']);
  const [purifiedCards, setPurifiedCards] = useState<string[]>(['card-e1-001']);
  const [cardMastery, setCardMastery] = useState<Record<string, MasteryLevel>>({ 'card-e1-001': 'Apprentice' });
  
  const [quests, setQuests] = useState<Quest[]>([
      { id: 'q1', title: 'Upload Utility Bill', desc: 'Scan your latest electricity invoice.', type: 'Daily', rarity: 'Common', xp: 100, status: 'active', requirement: 'image_upload' },
      { id: 'q2', title: 'Scope 1 Audit', desc: 'Verify stationary combustion sources.', type: 'Weekly', rarity: 'Rare', xp: 300, status: 'active', requirement: 'manual' },
      { id: 'q3', title: 'Supplier Engagement', desc: 'Send code of conduct to 5 suppliers.', type: 'Challenge', rarity: 'Epic', xp: 1000, status: 'active', requirement: 'manual' }
  ]);
  
  const [todos, setTodos] = useState<ToDoItem[]>([
      { id: 1, text: 'Review Q3 Carbon Report', done: false },
      { id: 2, text: 'Approve Solar Panel Budget', done: true }
  ]);
  
  const [universalNotes, setUniversalNotes] = useState<NoteItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [lastBriefingDate, setLastBriefingDate] = useState('never');
  const [latestEvent, setLatestEvent] = useState('System Initialized');
  const [customWidgets, setCustomWidgets] = useState<DashboardWidget[]>([]);

  // Computed
  const totalScore = parseFloat(((esgScores.environmental + esgScores.social + esgScores.governance) / 3).toFixed(1));

  // Actions
  const awardXp = useCallback((amount: number) => {
      setXp(prev => {
          const newXp = prev + amount;
          const newLevel = Math.floor(newXp / 1000) + 1;
          if (newLevel > level) {
              setLevel(newLevel);
          }
          return newXp;
      });
  }, [level]);

  const updateGoodwillBalance = useCallback((amount: number) => setGoodwillBalance(prev => prev + amount), []);
  
  const updateCarbonData = useCallback((data: Partial<CarbonData>) => {
      setCarbonData(prev => ({ ...prev, ...data, lastUpdated: Date.now() }));
  }, []);

  const updateEsgScore = useCallback((category: 'environmental' | 'social' | 'governance', value: number) => {
      setEsgScores(prev => ({ ...prev, [category]: value }));
  }, []);

  const unlockCard = useCallback((cardId: string) => {
      setCollectedCards(prev => {
          if (!prev.includes(cardId)) {
              setCardMastery(curr => ({ ...curr, [cardId]: 'Novice' }));
              return [...prev, cardId];
          }
          return prev;
      });
  }, []);

  const purifyCard = useCallback((cardId: string) => {
      setPurifiedCards(prev => !prev.includes(cardId) ? [...prev, cardId] : prev);
      setCardMastery(prev => prev[cardId] ? prev : { ...prev, [cardId]: 'Novice' });
  }, []);

  const updateCardMastery = useCallback((cardId: string, level: MasteryLevel) => {
      setCardMastery(prev => ({ ...prev, [cardId]: level }));
  }, []);

  const updateQuestStatus = useCallback((id: string, status: Quest['status']) => {
      setQuests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  }, []);

  const completeQuest = useCallback((id: string, rewardXp: number) => {
      setQuests(prev => prev.map(q => q.id === id ? { ...q, status: 'completed' } : q));
      awardXp(rewardXp);
  }, [awardXp]);

  const addTodo = useCallback((text: string) => {
      setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  }, []);

  const toggleTodo = useCallback((id: number) => {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const deleteTodo = useCallback((id: number) => {
      setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const addNote = useCallback((content: string, tags: string[] = [], source: 'manual' | 'voice' | 'ai' = 'manual') => {
      const newNote: NoteItem = {
          id: Date.now().toString(),
          content,
          tags,
          createdAt: Date.now(),
          source
      };
      setUniversalNotes(prev => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, content: string) => {
      setUniversalNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
      setUniversalNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleBookmark = useCallback((item: Partial<BookmarkItem>) => {
      setBookmarks(prev => {
          if (prev.some(b => b.id === item.id)) {
              return prev.filter(b => b.id !== item.id);
          }
          return [...prev, { ...item, addedAt: Date.now() } as BookmarkItem];
      });
  }, []);

  const addAuditLog = useCallback((action: string, details: string) => {
      const newLog: AuditLogEntry = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          action,
          user: userName,
          details,
          hash: '0x' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
          verified: true
      };
      setAuditLogs(prev => [newLog, ...prev]);
  }, [userName]);

  const markBriefingRead = useCallback(() => {
      setLastBriefingDate(new Date().toDateString());
  }, []);

  const addCustomWidget = useCallback((widget: Omit<DashboardWidget, 'id'>) => {
      setCustomWidgets(prev => [...prev, { ...widget, id: `w-${Date.now()}` }]);
  }, []);

  const removeCustomWidget = useCallback((id: string) => {
      setCustomWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  const resetData = useCallback(() => {
      setXp(0);
      setLevel(1);
      setCollectedCards(['card-e1-001']);
      setPurifiedCards(['card-e1-001']);
      setCardMastery({ 'card-e1-001': 'Novice' });
      setTodos([]);
      setUniversalNotes([]);
      setBookmarks([]);
      addAuditLog('System Reset', 'User performed factory reset.');
  }, [addAuditLog]);

  const checkBadges = useCallback(() => {
      return [];
  }, []);

  const upgradeTier = useCallback((newTier: UserTier) => {
      setTier(newTier);
  }, []);

  return (
    <CompanyContext.Provider value={{
      userName, setUserName,
      userRole, setUserRole,
      companyName, setCompanyName,
      tier, upgradeTier,
      xp, level, awardXp,
      goodwillBalance, updateGoodwillBalance,
      carbonData, updateCarbonData,
      esgScores, updateEsgScore, totalScore,
      budget, setBudget,
      carbonCredits, setCarbonCredits,
      collectedCards, unlockCard,
      purifiedCards, purifyCard,
      cardMastery, updateCardMastery,
      quests, updateQuestStatus, completeQuest,
      todos, addTodo, toggleTodo, deleteTodo,
      universalNotes, addNote, updateNote, deleteNote,
      bookmarks, toggleBookmark,
      auditLogs, addAuditLog,
      lastBriefingDate, markBriefingRead,
      latestEvent,
      customWidgets, addCustomWidget, removeCustomWidget,
      resetData, checkBadges
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
