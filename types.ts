export type Language = 'zh-TW' | 'en-US';

export enum View {
    MY_ESG = 'MY_ESG',
    DASHBOARD = 'DASHBOARD',
    BUSINESS_INTEL = 'BUSINESS_INTEL',
    STRATEGY = 'STRATEGY',
    REGENERATIVE = 'REGENERATIVE',
    CARBON = 'CARBON',
    REPORT = 'REPORT',
    INTEGRATION = 'INTEGRATION',
    ADAN_ZONE = 'ADAN_ZONE',
    YANG_BO = 'YANG_BO',
    ACADEMY = 'ACADEMY',
    DIAGNOSTICS = 'DIAGNOSTICS',
    TALENT = 'TALENT',
    CULTURE = 'CULTURE',
    FINANCE = 'FINANCE',
    AUDIT = 'AUDIT',
    GOODWILL = 'GOODWILL',
    SETTINGS = 'SETTINGS',
    UNIVERSAL_TOOLS = 'UNIVERSAL_TOOLS',
    UNIVERSAL_SYSTEM = 'UNIVERSAL_SYSTEM',
    THINK_TANK = 'THINK_TANK',
    ALUMNI_ZONE = 'ALUMNI_ZONE',
    LIBRARY = 'LIBRARY',
    SOUL_FORGE = 'SOUL_FORGE',
    AGENT_ARENA = 'AGENT_ARENA',
    AGENT_TRAINING = 'AGENT_TRAINING',
    PROXY_MARKET = 'PROXY_MARKET',
    PALACE = 'PALACE',
    RESTORATION = 'RESTORATION',
    CARD_GAME_ARENA = 'CARD_GAME_ARENA',
    USER_JOURNAL = 'USER_JOURNAL',
    PARTNER_PORTAL = 'PARTNER_PORTAL',
    ABOUT_US = 'ABOUT_US',
    API_ZONE = 'API_ZONE',
    UNIVERSAL_BACKEND = 'UNIVERSAL_BACKEND',
    RESEARCH_HUB = 'RESEARCH_HUB',
    HEALTH_CHECK = 'HEALTH_CHECK',
    VAULT = 'VAULT',
    AFFILIATE = 'AFFILIATE'
}

// Added missing dimension ID type
export type DimensionID = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'A10' | 'A11' | 'A12';

// Added missing course interface
export interface Course {
    id: string;
    title: string;
    thumbnail: string;
    level: string;
    category: string;
    progress: number;
}

// Added missing universal crystal interface
export interface UniversalCrystal {
    id: string;
    name: string;
    type: 'Perception' | 'Cognition' | 'Memory' | 'Expression' | 'Nexus';
    description: string;
    state: 'Restored' | 'Crystallizing' | 'Fragmented' | 'Perfected';
    integrity: number;
    fragmentsCollected: number;
    fragmentsRequired: number;
}

// Added missing user title interface
export interface UserTitle {
    id: string;
    text: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    bonusEffect?: string;
}

// Added missing badge interface
export interface Badge {
    id: string;
    name: string;
    description: string;
    category: 'Milestone' | 'Achievement' | 'Social';
    unlockedAt?: number;
}

// Added missing official event interface
export interface OfficialEvent {
    id: string;
    title: string;
    date: string;
    status: 'Upcoming' | 'Participating' | 'Completed';
    xpReward: number;
}

// Added missing report section interface
export interface ReportSection {
    id: string;
    title: string;
    template?: string;
    example?: string;
    griStandards: string;
    subSections?: ReportSection[];
}

// Added missing ESG card interface
export interface EsgCard {
    id: string;
    title: string;
    term: string;
    definition: string;
    description: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    attribute: string;
    collectionSet: string;
    stats: {
        defense: number;
        offense: number;
    };
    imageUrl?: string;
}

// Added missing scripture node interface
export interface ScriptureNode {
    id: string;
    code: string;
    title: string;
    en: string;
    content: string;
    category: string;
    tags: { zh: string; en: string }[];
}

// Added missing dimension protocol interface
export interface DimensionProtocol {
    id: DimensionID;
    name: string;
    description: string;
    status: 'stable' | 'unstable';
    integrity: number;
}

// Added missing unit test result interface
export interface UnitTestResult {
    id: string;
    name: string;
    module: string;
    lastRun: number;
    witnessHash: string;
    assertionLog: string[];
}

// Added missing toast type
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'reward';

// Added missing toast interface
export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;
}

// Added missing OmniEsg types
export type OmniEsgTrait = 'learning' | 'optimization' | 'performance' | 'evolution' | 'gap-filling' | 'seamless' | 'bridging' | 'stability' | 'altruism' | 'innovation';
export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain';
export type OmniEsgMode = 'card' | 'list';
export type OmniEsgConfidence = 'high' | 'medium' | 'low';
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'slate' | 'cyan' | 'rose';

export interface UniversalLabel {
    id?: string;
    text: string;
    definition?: string;
    formula?: string;
    rationale?: string;
}

export interface LogicWitness {
    witnessHash: string;
}

// Added missing dashboard widget types
export type WidgetType = 'carbon' | 'performance' | 'tasks' | 'news';

export interface DashboardWidget {
    id: string;
    type: WidgetType;
    title: string;
    config?: any;
    gridSize?: 'small' | 'medium' | 'large' | 'full';
}

// Added missing audit log entry interface
export interface AuditLogEntry {
    id: string;
    timestamp: number;
    action: string;
    user: string;
    details: string;
    hash: string;
}

// Added missing quest interface
export interface Quest {
    id: string;
    title: string;
    desc: string;
    xp: number;
    type: 'Challenge' | 'Daily' | 'Task';
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    status: 'active' | 'verifying' | 'completed';
}

// Added missing to-do item interface
export interface ToDoItem {
    id: number;
    text: string;
    completed: boolean;
}

// Added missing note item interface
export interface NoteItem {
    id: string;
    title?: string;
    content: string;
    tags?: string[];
    timestamp: number;
}

// Added missing bookmark item interface
export interface BookmarkItem {
    id: string;
    type: 'article' | 'video' | 'news';
    title: string;
    link?: string;
}

// Added missing user tier type
export type UserTier = 'Free' | 'Pro' | 'Enterprise';

// Added missing carbon data interface
export interface CarbonData {
    fuelConsumption: number;
    electricityConsumption: number;
    scope1: number;
    scope2: number;
    scope3: number;
    lastUpdated: number;
}

// Added missing mastery level type
export type MasteryLevel = 'Novice' | 'Apprentice' | 'Master';

// Added missing app file interface
export interface AppFile {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: number;
    sourceModule: string;
}

// Added missing intelligence item interface
export interface IntelligenceItem {
    id: string;
    content: string;
    source: string;
    timestamp: number;
}

// Added missing user journal entry interface
export interface UserJournalEntry {
    id: string;
    timestamp: number;
    title: string;
    impact: string;
    xpGained: number;
    type: 'milestone' | 'action' | 'insight';
    tags: string[];
}

// Added missing external api keys interface
export interface ExternalApiKeys {
    openai?: string;
    straico?: string;
}

// Added missing vocation types
export type VocationType = 'Architect' | 'Alchemist' | 'Scribe' | 'Envoy' | 'Seeker' | 'Guardian';

export interface VocationInfo {
    type: VocationType;
    level: number;
    exp: number;
    nextLevelExp: number;
    perks: string[];
}

// Added missing activity pulse node interface
export interface ActivityPulseNode {
    date: string;
    intensity: number;
}

// Added missing webhook interfaces
export interface WebhookConfig {
    id: string;
    eventType: string;
    url: string;
    status: 'active' | 'inactive';
    secret: string;
    lastTriggered?: number;
    lastStatus?: 'success' | 'failure';
}

export interface WebhookDelivery {
    id: string;
    webhookId: string;
    timestamp: number;
    payload: any;
    responseCode: number;
    status: 'success' | 'failure';
}

// Added missing semantic context interface
export interface SemanticContext {
    keywords: string[];
}

// Added missing soul evolution feedback interface
export interface SoulEvolutionFeedback {
    suggestedPromptTweak: string;
    performanceSummary: string;
    suggestedTitle?: UserTitle;
}

// Added missing persona config interface
export interface PersonaConfig {
    id: string;
    name: string;
    title: string;
    archetype: string;
    coreTrait: string;
    primaryGoal: string;
    systemPrompt: string;
    level: number;
    exp: number;
    color: string;
    avatarUrl: string;
    attributes: {
        [key: string]: { label: string; value: number; max: number };
    };
    skills: { name: string; level: number; desc: string }[];
    ultimateArt: { name: string; description: string; unlockedAtLevel: number; effect: string };
    equippedCards?: string[];
    goodwillValue?: number;
    knowledgeRepoIds?: string[];
    usageHistory?: any[];
}

// Added missing universal knowledge node interface
export interface UniversalKnowledgeNode {
    id: string;
    type: string;
    label: UniversalLabel;
    currentValue: any;
    traits: string[];
    confidence: OmniEsgConfidence;
    lastInteraction: number;
    interactionCount: number;
    memory: {
        history: any[];
        aiInsights: any[];
    };
}

// Added missing quantum node interface
export interface QuantumNode {
    id: string;
    atom: string;
    vector: string[];
    weight: number;
    source: string;
}

// Added missing neural signal interface
export interface NeuralSignal {
    id: string;
    origin: string;
    type: 'DATA_COLLISION' | 'LOGIC_RESONANCE' | 'ENTROPY_PURGE' | 'RUNE_ACTIVATION';
    intensity: number;
    payload: any;
    timestamp: number;
}

// Added missing MCP registry item interface
export interface MCPRegistryItem {
    id: string;
    name: string;
    type: 'tool' | 'resource';
    description: string;
    latency: number;
}

// Added missing trinity state interface
export interface TrinityState {
    perception: number;
    cognition: number;
    action: number;
}

// Added missing life ESG quest types
export type LifeCategory = 'NetZero' | 'Altruism' | 'Governance' | 'Innovation';

export interface LifeEsgQuest {
    id: string;
    category: LifeCategory;
    title: string;
    enTitle: string;
    impactDesc: string;
    xpReward: number;
    gwcReward: number;
    traitBonus: { trait: string; value: number };
    status: 'ready' | 'completed' | 'locked';
    icon: any;
    verifiedHash?: string;
}

// Added missing persona attributes interface
export interface PersonaAttributes {
    altruism: number;
    pragmatism: number;
    innovation: number;
    stability: number;
}

// Added missing digital soul asset interface
export interface DigitalSoulAsset {
    id: string;
    name: string;
    traits: SoulForgeConfig;
    resonance: number;
    rarity: string;
    forgedAt: number;
    ownerId: string;
}

// Added missing soul forge config interface
export interface SoulForgeConfig {
    altruism: number;
    pragmatism: number;
    innovation: number;
    stability: number;
}

// Added missing training doc interface
export interface TrainingDoc {
    id: string;
    name: string;
    status: 'parsing' | 'ready';
    type: string;
    atomsCount: number;
}

// Added missing Adan disciple interface
export interface AdanDisciple extends PersonaConfig {
    version: string;
    alignment: number;
    rank: string;
}

// Added missing training log entry interface
export interface TrainingLogEntry {
    id: string;
    agentId: string;
    timestamp: number;
    sessionType: string;
    gainedExp: number;
    statChanges: any;
    newKnowledge: string[];
    isCriticalInsight?: boolean;
}

// Added missing entity planet interface
export interface EntityPlanet {
    taxId: string;
    name: string;
    industry: string;
    riskScore: number;
    strategy: any;
    contextDB: any;
    mmDocs: any[];
    kpiData: any[];
    auditTrail: any[];
    dataHash: string;
    lastUpdated: string;
}

// Added missing agent certification interface
export interface AgentCertification {
    id: string;
    title: string;
    status: 'Certified' | 'In_Progress' | 'Locked';
    progress: number;
    skillsUnlocked: string[];
}

// Added missing proxy product interface
export interface ProxyProduct {
    id: string;
    name: string;
    category: 'SaaS' | 'Hardware' | 'Consulting';
    tier: number;
    basePrice: string;
    commission: number;
    knowledgeTags: string[];
    pitchScript: string;
}

// Added missing agent soul 5D interface
export interface AgentSoul5D {
    id: string;
    essence: { name: string; tone: string; backstory: string };
    covenant: { prompt: string; safety: string };
    memory: { knowledgeBaseIds: string[]; retentionDays: number };
    authority: { skillIds: string[]; permissions: string[] };
    foundation: { model: string; temperature: number; tokens: number };
}

// Added missing skill node interface
export interface SkillNode {
    id: string;
    name: string;
    type: string;
    description: string;
    mastery: number;
    status: 'Ready' | 'Cooldown';
}

// Added missing evolution proposal interface
export interface EvolutionProposal {
    id: string;
    pattern: string;
    suggestedSkill: string;
    confidence: number;
    status: 'Pending' | 'Approved' | 'Vetoed';
}
