
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { 
  DashboardWidget, AuditLogEntry, EsgCard, Quest, ToDoItem, NoteItem, BookmarkItem, 
  UserTier, CarbonData, MasteryLevel, Badge, WidgetType, AppFile, IntelligenceItem,
  UniversalCrystal, UserJournalEntry, ExternalApiKeys, VocationInfo, UserTitle, 
  OfficialEvent, ActivityPulseNode, WebhookConfig, FinancialEntry
} from '../../types';
import { UNIVERSAL_CORES, VOCATIONS, INITIAL_TITLES, INITIAL_BADGES, MOCK_EVENTS } from '../../constants';
import { useToast } from '../../contexts/ToastContext';

interface CompanyContextType {
  userName: string;
  setUserName: (name: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  industrySector: string;
  setIndustrySector: (sector: string) => void;
  externalUrl: string; 
  setExternalUrl: (url: string) => void; 
  crawledIntel: string; 
  setCrawledIntel: (intel: string) => void; 
  tier: UserTier;
  upgradeTier: (tier: UserTier) => void;
  
  xp: number;
  level: number;
  awardXp: (amount: number, reason?: string) => void;
  
  vocation: VocationInfo;
  activeTitle?: UserTitle;
  ownedTitles: UserTitle[];
  setActiveTitle: (id: string) => void;
  
  socialFrequency: number;
  updateSocialFrequency: (delta: number) => void;
  
  badges: Badge[];
  unlockBadge: (id: string) => void;
  
  events: OfficialEvent[];
  updateEventStatus: (id: string, status: OfficialEvent['status']) => void;

  activityPulse: ActivityPulseNode[];
  recordActivity: () => void;

  goodwillBalance: number;
  updateGoodwillBalance: (amount: number) => void;
  goodwillValue: number; // 善向值 (Resonance)
  
  esgScores: { environmental: number; social: number; governance: number };
  updateEsgScore: (category: 'environmental' | 'social' | 'governance', val: number) => void;
  totalScore: number;
  
  carbonData: CarbonData;
  updateCarbonData: (data: Partial<CarbonData>) => void;
  
  budget: number;
  setBudget: (val: number) => void;
  carbonCredits: number;
  setCarbonCredits: (val: number) => void;

  expenses: FinancialEntry[];
  incomes: FinancialEntry[];
  addFinancialEntries: (entries: FinancialEntry[]) => void;
  
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
  addNote: (content: string, tags?: string[], title?: string) => void; 
  updateNote: (id: string, content: string, title?: string, tags?: string[]) => void;
  deleteNote: (id: string) => void;
  
  bookmarks: BookmarkItem[];
  toggleBookmark: (item: { id: string; type: 'article' | 'video' | 'news'; title: string; link?: string }) => void;
  
  files: AppFile[];
  addFile: (file: File, sourceModule: string) => void;
  removeFile: (id: string) => void;

  myIntelligence: IntelligenceItem[];
  saveIntelligence: (item: IntelligenceItem) => void;
  
  lastBriefingDate: string;
  markBriefingRead: () => void;
  latestEvent: string;
  setLatestEvent: (event: string) => void;
  
  customWidgets: DashboardWidget[];
  addCustomWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full'; }) => void;
  removeCustomWidget: (id: string) => void;

  myEsgWidgets: DashboardWidget[];
  addMyEsgWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full'; }) => void;
  removeMyEsgWidget: (id: string) => void;
  updateMyEsgWidgetSize: (id: string, size: 'small' | 'medium' | 'large' | 'full') => void;

  palaceWidgets: DashboardWidget[];
  addPalaceWidget: (widget: { type: WidgetType; title: string; config?: any; gridSize?: 'small' | 'medium' | 'large' | 'full'; }) => void;
  removePalaceWidget: (id: string) => void;
  
  checkBadges: () => Badge[];
  resetData: () => void;

  intelligenceBrief: any;
  setIntelligenceBrief: (data: any) => void;

  isAiToolsUnlocked: boolean;
  unlockAiTools: () => void;

  crystals: UniversalCrystal[];
  collectCrystalFragment: (crystalId: string) => void;
  restoreCrystal: (crystalId: string) => void;

  journal: UserJournalEntry[];
  addJournalEntry: (title: string, impact: string, xp: number, type: 'milestone' | 'action' | 'insight', tags: string[]) => void;

  externalApiKeys: ExternalApiKeys;
  updateExternalApiKeys: (keys: ExternalApiKeys) => void;

  webhooks: WebhookConfig[];
  addWebhook: (webhook: Omit<WebhookConfig, 'id' | 'secret'>) => void;
  deleteWebhook: (id: string) => void;
  updateWebhookStatus: (id: string, update: Partial<WebhookConfig>) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  
  const [userName, setUserName] = useState('Jun_JAK');
  const [userRole, setUserRole] = useState('Architect CEO');
  const [companyName, setCompanyName] = useState('ESGss JAK');
  const [industrySector, setIndustrySector] = useState('Tech Strategy');
  const [externalUrl, setExternalUrl] = useState('');
  const [crawledIntel, setCrawledIntel] = useState('');
  const [tier, setTier] = useState<UserTier>('Pro');
  
  const [xp, setXp] = useState(2500);
  const [vocation, setVocation] = useState<VocationInfo>({ type: 'Architect', level: 3, exp: 500, nextLevelExp: 3000, perks: ['System Control'] });
  const [ownedTitles, setOwnedTitles] = useState<UserTitle[]>(INITIAL_TITLES);
  const [activeTitle, setActiveTitleState] = useState<UserTitle | undefined>(INITIAL_TITLES[0]);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [events, setEvents] = useState<OfficialEvent[]>(MOCK_EVENTS);
  const [socialFrequency, setSocialFrequency] = useState(60);
  const [activityPulse, setActivityPulse] = useState<ActivityPulseNode[]>([]);
  
  const [goodwillBalance, setGoodwillBalance] = useState(10000);
  const [goodwillValue, setGoodwillValue] = useState(1500);

  const [esgScores, setEsgScores] = useState({ environmental: 85, social: 80, governance: 92 });
  const [carbonData, setCarbonData] = useState<CarbonData>({ fuelConsumption: 12000, electricityConsumption: 38000, scope1: 320, scope2: 210, scope3: 980, lastUpdated: Date.now() });
  
  const [expenses, setExpenses] = useState<FinancialEntry[]>([]);
  const [incomes, setIncomes] = useState<FinancialEntry[]>([]);
  
  const [quests, setQuests] = useState<Quest[]>([]);
  const [budget, setBudget] = useState(2000000);
  const [carbonCredits, setCarbonCredits] = useState(5000);
  const [isAiToolsUnlocked, setIsAiToolsUnlocked] = useState(true);
  const [collectedCards, setCollectedCards] = useState<string[]>(['card-legend-001']);
  const [purifiedCards, setPurifiedCards] = useState<string[]>(['card-legend-001']);
  const [cardMastery, setCardMastery] = useState<Record<string, MasteryLevel>>({});
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [crystals, setCrystals] = useState<UniversalCrystal[]>(UNIVERSAL_CORES);
  const [journal, setJournal] = useState<UserJournalEntry[]>([]);
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [universalNotes, setUniversalNotes] = useState<NoteItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [files, setFiles] = useState<AppFile[]>([]);
  const [myIntelligence, setMyIntelligence] = useState<IntelligenceItem[]>([]);
  const [lastBriefingDate, setLastBriefingDate] = useState('now');
  const [latestEvent, setLatestEvent] = useState('JAK_CORE_LIVE');
  const [customWidgets, setCustomWidgets] = useState<DashboardWidget[]>([]);
  const [myEsgWidgets, setMyEsgWidgets] = useState<DashboardWidget[]>([]);
  const [palaceWidgets, setPalaceWidgets] = useState<DashboardWidget[]>([]);
  const [intelligenceBrief, setIntelligenceBrief] = useState<any>(null);
  const [externalApiKeys, setExternalApiKeys] = useState<ExternalApiKeys>({ openai: '', straico: '' });
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);

  const level = useMemo(() => Math.floor(xp / 1000) + 1, [xp]);
  const totalScore = useMemo(() => parseFloat(((esgScores.environmental + esgScores.social + esgScores.governance) / 3).toFixed(1)), [esgScores]);

  const addJournalEntry = useCallback((title: string, impact: string, xpGain: number, type: 'milestone' | 'action' | 'insight', tags: string[]) => {
      setJournal(prev => [{ id: `j-${Date.now()}`, timestamp: Date.now(), title, impact, xpGained: xpGain, type, tags }, ...prev]);
  }, []);

  const awardXp = useCallback((amount: number) => { setXp(prev => prev + amount); setGoodwillValue(prev => prev + Math.floor(amount / 10)); }, []);
  const updateGoodwillBalance = (amount: number) => setGoodwillBalance(prev => prev + amount);
  const setActiveTitle = (id: string) => { const t = ownedTitles.find(title => title.id === id); if(t) setActiveTitleState(t); };
  const updateSocialFrequency = (delta: number) => setSocialFrequency(prev => Math.min(100, Math.max(0, prev + delta)));
  const unlockBadge = (id: string) => setBadges(prev => prev.map(b => b.id === id ? { ...b, unlockedAt: Date.now() } : b));
  const updateEventStatus = (id: string, status: OfficialEvent['status']) => setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  
  const addFinancialEntries = useCallback((entries: FinancialEntry[]) => {
    const newExpenses = entries.filter(e => e.type === 'expense');
    const newIncomes = entries.filter(e => e.type === 'income');
    setExpenses(prev => [...prev, ...newExpenses]);
    setIncomes(prev => [...prev, ...newIncomes]);
  }, []);

  const recordActivity = () => {};
  const addWebhook = (wh: any) => {};
  const deleteWebhook = (id: string) => {};
  const updateWebhookStatus = (id: string, update: any) => {};
  const upgradeTier = (t: UserTier) => setTier(t);
  const updateEsgScore = (cat: any, val: number) => setEsgScores(prev => ({ ...prev, [cat]: val }));
  const updateCarbonData = (data: any) => setCarbonData(prev => ({ ...prev, ...data }));
  const updateQuestStatus = (id: string, s: any) => {};
  const completeQuest = (id: string, r: number) => awardXp(r);
  const addAuditLog = (a: string, d: string) => {};
  const unlockCard = (id: string) => setCollectedCards(prev => [...prev, id]);
  const purifyCard = (id: string) => setPurifiedCards(prev => [...prev, id]);
  const updateCardMastery = (id: string, l: any) => {};
  const addTodo = (t: string) => {};
  const toggleTodo = (id: number) => {};
  const deleteTodo = (id: number) => {};
  const addNote = (c: string) => {};
  const updateNote = (id: string, c: string) => {};
  const deleteNote = (id: string) => {};
  const toggleBookmark = (i: any) => {};
  const addFile = (f: File, s: string) => {};
  const removeFile = (id: string) => {};
  const saveIntelligence = (i: any) => {};
  const markBriefingRead = () => {};
  const addCustomWidget = (w: any) => {};
  const removeCustomWidget = (id: string) => {};
  const addMyEsgWidget = (w: any) => {};
  const removeMyEsgWidget = (id: string) => {};
  const updateMyEsgWidgetSize = (id: string, s: any) => {};
  const addPalaceWidget = (w: any) => {};
  const removePalaceWidget = (id: string) => {};
  const checkBadges = () => [];
  const resetData = () => {};
  const unlockAiTools = () => {};
  const collectCrystalFragment = (id: string) => {};
  const restoreCrystal = (id: string) => {};
  const updateExternalApiKeys = (k: any) => {};

  return (
    <CompanyContext.Provider value={{
      userName, setUserName, userRole, setUserRole, companyName, setCompanyName, industrySector, setIndustrySector, externalUrl, setExternalUrl, crawledIntel, setCrawledIntel, tier, upgradeTier,
      xp, level, awardXp, vocation, activeTitle, ownedTitles, setActiveTitle, socialFrequency, updateSocialFrequency,
      badges, unlockBadge, events, updateEventStatus, activityPulse, recordActivity,
      goodwillBalance, updateGoodwillBalance, goodwillValue, esgScores, updateEsgScore, totalScore,
      carbonData, updateCarbonData, budget, setBudget, carbonCredits, setCarbonCredits,
      expenses, incomes, addFinancialEntries,
      quests, updateQuestStatus, completeQuest, auditLogs, addAuditLog,
      /* Fix: Replaced duplicate purifiedCards with purifyCard function to satisfy CompanyContextType */
      collectedCards, unlockCard, purifiedCards, purifyCard, cardMastery, updateCardMastery,
      todos, addTodo, toggleTodo, deleteTodo, universalNotes, addNote, updateNote, deleteNote,
      bookmarks, toggleBookmark, files, addFile, removeFile, myIntelligence, saveIntelligence,
      lastBriefingDate, markBriefingRead, latestEvent, setLatestEvent,
      customWidgets, addCustomWidget, removeCustomWidget, myEsgWidgets, addMyEsgWidget, removeMyEsgWidget, updateMyEsgWidgetSize,
      palaceWidgets, addPalaceWidget, removePalaceWidget, checkBadges, resetData, intelligenceBrief, setIntelligenceBrief,
      isAiToolsUnlocked, unlockAiTools, crystals, collectCrystalFragment, restoreCrystal, journal, addJournalEntry,
      externalApiKeys, updateExternalApiKeys, webhooks, addWebhook, deleteWebhook, updateWebhookStatus
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) throw new Error('useCompany must be used within a CompanyProvider');
  return context;
};
