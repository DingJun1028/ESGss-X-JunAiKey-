
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
    AFFILIATE = 'AFFILIATE',
    GLOBAL_OPS = 'GLOBAL_OPS',
    WORKFLOW_LAB = 'WORKFLOW_LAB',
    MCP_CONFIG = 'MCP_CONFIG',
    IMPACT_PROJECTS = 'IMPACT_PROJECTS'
}

export interface LogicModel {
    inputs: string[];
    activities: string[];
    outputs: string[];
    outcomes: string[];
    impact: string;
}

export interface ImpactProject {
    id: string;
    title: string;
    description: string;
    status: 'draft' | 'active' | 'completed';
    progress: number; // 0-100
    impactXP: number;
    sdgs: number[];
    logicModel: LogicModel;
    financials: {
        budget: number;
        spent: number;
        revenue_projected: number;
    };
    impactMetrics: {
        label: string;
        target: number;
        current: number;
        unit: string;
        proxy_value: number; // Monetary value per unit for SROI
    }[];
    sroi: number; // Calculated ratio
}

export interface FinancialEntry {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
}

export interface McpTool {
    name: string;
    description: string;
    inputSchema: any;
}

export interface McpServer {
    id: string;
    name: string;
    url: string;
    status: 'connected' | 'error' | 'connecting';
    transport: 'sse' | 'streamable_http';
    tools: McpTool[];
    latency: number;
    docsUrl?: string;
}

export interface McpRunActionOutput {
  success: boolean;
  result: any;
  error: string | null;
}

export type DimensionID = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'A10' | 'A11' | 'A12';

export interface Course {
    id: string;
    title: string;
    thumbnail: string;
    level: string;
    category: string;
    progress: number;
}

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

export interface UserTitle {
    id: string;
    text: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    bonusEffect?: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    category: 'Milestone' | 'Achievement' | 'Social';
    unlockedAt?: number;
}

export interface OfficialEvent {
    id: string;
    title: string;
    date: string;
    status: 'Upcoming' | 'Participating' | 'Completed';
    xpReward: number;
}

export interface ReportSection {
    id: string;
    title: string;
    template?: string;
    example?: string;
    griStandards: string;
    subSections?: ReportSection[];
}

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

export interface ScriptureNode {
    id: string;
    code: string;
    title: string;
    en: string;
    content: string;
    category: string;
    tags: { zh: string; en: string }[];
}

export interface DimensionProtocol {
    id: DimensionID;
    name: string;
    description: string;
    status: 'stable' | 'unstable';
    integrity: number;
}

export interface UnitTestResult {
    id: string;
    name: string;
    module: string;
    lastRun: number;
    witnessHash: string;
    assertionLog: string[];
}

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'reward';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;
}

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

export type WidgetType = 'carbon' | 'performance' | 'tasks' | 'news';

export interface DashboardWidget {
    id: string;
    type: WidgetType;
    title: string;
    config?: any;
    gridSize?: 'small' | 'medium' | 'large' | 'full';
}

export interface AuditLogEntry {
    id: string;
    timestamp: number;
    action: string;
    user: string;
    details: string;
    hash: string;
}

export interface Quest {
    id: string;
    title: string;
    desc: string;
    xp: number;
    type: 'Challenge' | 'Daily' | 'Task';
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    status: 'active' | 'verifying' | 'completed';
}

export interface ToDoItem {
    id: number;
    text: string;
    completed: boolean;
}

export interface NoteItem {
    id: string;
    title?: string;
    content: string;
    tags?: string[];
    timestamp: number;
}

export interface BookmarkItem {
    id: string;
    type: 'article' | 'video' | 'news';
    title: string;
    link?: string;
}

export type UserTier = 'Free' | 'Pro' | 'Enterprise';

export interface CarbonData {
    fuelConsumption: number;
    electricityConsumption: number;
    scope1: number;
    scope2: number;
    scope3: number;
    lastUpdated: number;
}

export type MasteryLevel = 'Novice' | 'Apprentice' | 'Master';

export interface AppFile {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: number;
    sourceModule: string;
}

export interface IntelligenceItem {
    id: string;
    content: string;
    source: string;
    timestamp: number;
}

export interface UserJournalEntry {
    id: string;
    timestamp: number;
    title: string;
    impact: string;
    xpGained: number;
    type: 'milestone' | 'action' | 'insight';
    tags: string[];
}

export interface ExternalApiKeys {
    openai?: string;
    straico?: string;
    github?: string;
}

export type VocationType = 'Architect' | 'Alchemist' | 'Scribe' | 'Envoy' | 'Seeker' | 'Guardian';

export interface VocationInfo {
    type: VocationType;
    level: number;
    exp: number;
    nextLevelExp: number;
    perks: string[];
}

export interface ActivityPulseNode {
    date: string;
    intensity: number;
}

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

export interface SemanticContext {
    keywords: string[];
}

export interface SoulEvolutionFeedback {
    suggestedPromptTweak: string;
    performanceSummary: string;
    suggestedTitle?: UserTitle;
}

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

export interface QuantumNode {
    id: string;
    atom: string;
    vector: string[];
    weight: number;
    source: string;
}

export interface NeuralSignal {
    id: string;
    origin: string;
    type: 'DATA_COLLISION' | 'LOGIC_RESONANCE' | 'ENTROPY_PURGE' | 'RUNE_ACTIVATION';
    intensity: number;
    payload: any;
    timestamp: number;
}

export interface MCPRegistryItem {
    id: string;
    name: string;
    type: 'tool' | 'resource';
    description: string;
    latency: number;
}

export interface TrinityState {
    perception: number;
    cognition: number;
    action: number;
}

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

export interface PersonaAttributes {
    altruism: number;
    pragmatism: number;
    innovation: number;
    stability: number;
}

export interface DigitalSoulAsset {
    id: string;
    name: string;
    traits: SoulForgeConfig;
    resonance: number;
    rarity: string;
    forgedAt: number;
    ownerId: string;
}

export interface SoulForgeConfig {
    altruism: number;
    pragmatism: number;
    innovation: number;
    stability: number;
}

export interface TrainingDoc {
    id: string;
    name: string;
    status: 'parsing' | 'ready';
    type: string;
    atomsCount: number;
}

export interface AdanDisciple extends PersonaConfig {
    version: string;
    alignment: number;
    rank: string;
}

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

export interface AgentCertification {
    id: string;
    title: string;
    status: 'Certified' | 'In_Progress' | 'Locked';
    progress: number;
    skillsUnlocked: string[];
}

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

export interface AgentSoul5D {
    id: string;
    essence: { name: string; tone: string; backstory: string };
    covenant: { prompt: string; safety: string };
    memory: { knowledgeBaseIds: string[]; retentionDays: number };
    authority: { skillIds: string[]; permissions: string[] };
    foundation: { model: string; temperature: number; tokens: number };
}

export interface SkillNode {
    id: string;
    name: string;
    type: string;
    description: string;
    mastery: number;
    status: 'Ready' | 'Cooldown';
}

export interface EvolutionProposal {
    id: string;
    pattern: string;
    suggestedSkill: string;
    confidence: number;
    status: 'Pending' | 'Approved' | 'Vetoed';
}
