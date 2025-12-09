
/**
 * Defines the available views/modules within the application.
 */
export enum View {
  MY_ESG = 'MY_ESG', 
  DASHBOARD = 'DASHBOARD',
  CARD_GAME = 'CARD_GAME', // Renamed/Promoted from GAMIFICATION
  RESEARCH_HUB = 'RESEARCH_HUB', 
  ACADEMY = 'ACADEMY', 
  DIAGNOSTICS = 'DIAGNOSTICS', 
  SETTINGS = 'SETTINGS',
  STRATEGY = 'STRATEGY',
  TALENT = 'TALENT',
  CARBON = 'CARBON',
  REPORT = 'REPORT',
  INTEGRATION = 'INTEGRATION',
  CULTURE = 'CULTURE',
  FINANCE = 'FINANCE',
  AUDIT = 'AUDIT',
  GOODWILL = 'GOODWILL',
  YANG_BO = 'YANG_BO',
  BUSINESS_INTEL = 'BUSINESS_INTEL',
  HEALTH_CHECK = 'HEALTH_CHECK',
  UNIVERSAL_TOOLS = 'UNIVERSAL_TOOLS',
  FUNDRAISING = 'FUNDRAISING', // New
  ABOUT_US = 'ABOUT_US',        // New
  API_ZONE = 'API_ZONE',         // New: API Developer Portal
  UNIVERSAL_BACKEND = 'UNIVERSAL_BACKEND' // New: Universal Management Backend Zone
}

export type Language = 'zh-TW' | 'en-US';
export type UserTier = 'Free' | 'Pro' | 'Enterprise';

export interface UserProfile {
  name: string;
  role: string;
  tier: UserTier;
  avatarSeed: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'reward';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  rewardData?: { xp?: number; coins?: number; card?: EsgCard; };
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  user: string;
  details: string;
  hash: string;
  verified: boolean;
}

// --- ESG Universal Card Architecture (MECE) ---
export type ESGAttribute = 'Environmental' | 'Social' | 'Governance';
export type ESGCategory = 'Green_Ops' | 'Eco_System' | 'Human_Capital' | 'Social_Impact' | 'Foundation' | 'Partnership';
export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type MasteryLevel = 'Novice' | 'Apprentice' | 'Master';

export interface EsgCard {
  id: string;
  title: string;          // Name
  description: string;
  
  attribute: ESGAttribute;
  category: ESGCategory;
  rarity: CardRarity;
  
  // The Definition Integration (Museum Label)
  term: string;           // e.g. "SROI"
  definition: string;     // e.g. "Social Return on Investment..."
  
  imageUrl?: string;      // Optional override image
  
  stats: {
    defense: number;      // Compliance Score
    offense: number;      // Value Creation Score
  };
  
  isPurified?: boolean;   // Has passed the knowledge quiz
  collectionSet: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export interface CarbonData {
  fuelConsumption: number;
  electricityConsumption: number;
  scope1: number;
  scope2: number;
  scope3: number;
  lastUpdated: number;
}

export type QuestRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type QuestType = 'Daily' | 'Weekly' | 'Challenge';
export type QuestRequirement = 'manual' | 'image_upload';

export interface Quest {
  id: string;
  title: string;
  desc: string;
  type: QuestType;
  rarity: QuestRarity;
  xp: number;
  status: 'active' | 'verifying' | 'completed';
  requirement: QuestRequirement;
}

export interface ToDoItem {
  id: number;
  text: string;
  done: boolean;
}

export interface NoteItem {
  id: string;
  content: string;
  tags: string[];
  createdAt: number;
  source?: 'manual' | 'voice' | 'ai';
}

export interface BookmarkItem {
  id: string;
  type: 'article' | 'video' | 'news';
  title: string;
  link?: string;
  addedAt: number;
}

/**
 * Universal Agent Traits
 */
export type OmniEsgTrait = 
  | 'optimization' 
  | 'gap-filling' 
  | 'tagging'
  | 'performance'
  | 'learning'
  | 'evolution'
  | 'bridging'
  | 'seamless';

export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain';
export type OmniEsgMode = 'card' | 'list' | 'cell' | 'badge';
export type OmniEsgConfidence = 'high' | 'medium' | 'low';
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'slate';

export interface UniversalLabel {
  id?: string;
  dataType?: string;
  text: string;
  description?: string;
  definition?: string;
  formula?: string;
}

export interface UniversalKnowledgeNode {
  id: string;
  type: 'component' | 'concept' | 'metric';
  label: UniversalLabel;
  currentValue: any;
  traits: OmniEsgTrait[];
  confidence: OmniEsgConfidence;
  lastInteraction: number;
  interactionCount: number;
  memory: {
    history: any[];
    aiInsights: string[];
  };
}

export interface InteractionEvent {
  componentId: string;
  eventType: 'click' | 'hover' | 'edit' | 'ai-trigger';
  timestamp: number;
  payload?: any;
}

export interface Metric {
  id: string;
  label: string | UniversalLabel;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  color: OmniEsgColor;
  traits?: OmniEsgTrait[];
  tags?: string[];
  dataLink?: OmniEsgDataLink;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  thumbnail: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface SystemHealth {
  module: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  latency: number;
}

export interface ReportSection {
  id: string;
  title: string;
  subSections?: ReportSection[];
  template?: string;
  example?: string;
  griStandards?: string;
  guidelines?: string;
  principles?: string;
}

export type WidgetType = 'kpi_card' | 'chart_area' | 'feed_list' | 'mini_map';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  config?: any;
  gridSize?: 'small' | 'medium' | 'large' | 'full';
}
