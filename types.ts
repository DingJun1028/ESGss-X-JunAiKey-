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
    IMPACT_PROJECTS = 'IMPACT_PROJECTS',
    UNIVERSAL_NOTES = 'UNIVERSAL_NOTES',
    HYPERCUBE_LAB = 'HYPERCUBE_LAB',
    AGENT_TASKS = 'AGENT_TASKS',
    ADMIN_PANEL = 'ADMIN_PANEL',
    ECOSYSTEM_RADAR = 'ECOSYSTEM_RADAR',
    CARBON_WALLET = 'CARBON_WALLET',
    FLOWLU_INTEGRATION = 'FLOWLU_INTEGRATION',
    SUPPLIER_CRM = 'SUPPLIER_CRM',
    SUPPLIER_SURVEY = 'SUPPLIER_SURVEY'
}

export interface SupplierPersona {
    id: string;
    name: string;
    taxId: string;
    trustScore: number; // 1-100
    carbonGrade: 'A' | 'B' | 'C' | 'D' | 'E';
    riskStatus: 'RED' | 'YELLOW' | 'GREEN';
    inflowStatus: 'IDLE' | 'REFining' | 'MAPPING' | 'ENGRAVED' | 'TO_FIX' | 'INVESTIGATING';
    anomalyDetected?: boolean;
    anomalyDetails?: string;
    purity?: {
        clarity: number;
        alignment: number;
        validity: number;
    };
    lastSubmission?: number;
    metrics: {
        electricity_total: number;
        renewable_percent: number;
        iso_certified: boolean;
        safety_incidents: number;
        gender_pay_ratio: number;
        ethics_signed: boolean;
    };
    flowluMapping: {
        crm_account_id: string;
        custom_fields: Record<string, any>;
    };
}

export interface CarbonAssetPackage {
    id: string;
    standard: 'VCS' | 'GOLD_STANDARD' | 'I-REC';
    volume: number;
    unit: string;
    status: 'Verified' | 'Listed' | 'Traded';
    marketValue: number;
    listingHash: string;
}

export interface BenchmarkingNode {
    id: string;
    distance: number; // 0-1, similarity
    angle: number; // circular layout
    efficiency: number;
    compliance: number;
    isTarget: boolean;
    industry: string;
}

export interface OptimizationPath {
    steps: {
        title: string;
        roi: number;
        carbonImpact: number;
        difficulty: 'LOW' | 'MED' | 'HIGH';
    }[];
    estimatedTimeWeeks: number;
    projectedSroi: number;
}

export interface OperationalKpi {
    efficiency: {
        hoursSaved: number;
        reportLatency: number; // ms
        commFriction: number; // 0-1
    };
    sanctity: {
        ocrAccuracy: number;
        gapCoverage: number;
    };
    resonance: {
        actionFrequency: number;
        autoInterventions: number;
    };
    integrity: {
        apiSyncRate: number;
        responseDelay: number; // ms
    };
}

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export interface AgentTask {
    id: string;
    title: string;
    description: string;
    assigneeId: string;
    locationId: string;
    dueDate: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: number;
    progress: number;
}

export interface EvolutionLogEntry {
    id: string;
    timestamp: number;
    action: string;
    details: string;
    type: 'OPTIMIZATION' | 'REPAIR' | 'ALTRUISM';
}

export type NoteLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface NoteItem {
    id: string;
    title?: string;
    content: string; // 原文 (RAW)
    manifestedContent?: string; // AI 格式化後的美化版
    imageUrl?: string; // 產出的圖片結果
    source?: string; // 產出來源 (如: WorkflowLab)
    tags?: string[];
    timestamp: number;
    level: NoteLevel;
    aiMetadata?: {
        summary?: string;
        actionItems?: string[];
        insights?: string[];
        pollinatedStory?: string;
    };
}

export type CircuitStatus = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface ComponentGrowth {
    heat: number;
    evolutionLevel: number;
    lastInteraction: number;
    circuitStatus: CircuitStatus;
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
    growth?: ComponentGrowth;
}

export interface UniversalLabel {
    id?: string;
    text: string;
    definition?: string;
    formula?: string;
    rationale?: string;
}

export type OmniEsgTrait = 'learning' | 'optimization' | 'performance' | 'evolution' | 'gap-filling' | 'seamless' | 'bridging' | 'stability' | 'altruism' | 'innovation';
export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain';
export type OmniEsgMode = 'card' | 'list' | 'cell' | 'badge';
export type OmniEsgConfidence = 'high' | 'medium' | 'low';
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'slate' | 'cyan' | 'rose';

export interface LogicWitness {
    witnessHash: string;
}

export interface NeuralSignal {
    id: string;
    origin: string;
    type: 'DATA_COLLISION' | 'LOGIC_RESONANCE' | 'ENTROPY_PURGE' | 'RUNE_ACTIVATION' | 'CIRCUIT_TRIP' | 'EVOLUTION_UPGRADE' | 'ANOMALY_ALERT';
    intensity: number;
    payload: any;
    timestamp: number;
}

export interface SystemVital {
    evolutionStage: number;
    contextLoad: number;
    activeThreads: number;
    memoryNodes: number;
    entropy: number;
    integrityScore: number;
    trinity: TrinityState;
    synergyLevel: number;
    activeCircuits: number;
    isEvolving?: boolean;
    kpis?: OperationalKpi;
}

export interface TrinityState {
    perception: number;
    cognition: number;
    action: number;
}

export interface ImpactProject {
    id: string;
    title: string;
    description: string;
    status: 'draft' | 'active' | 'completed';
    progress: number;
    impactXP: number;
    sdgs: number[];
    logicModel: LogicModel;
    milestones: ProjectMilestone[];
    financials: {
        budget: number;
        spent: number;
        revenue_projected: number;
        roi_projected?: number;
    };
    impactMetrics: {
        label: string;
        target: number;
        current: number;
        unit: string;
        proxy_value: number;
    }[];
    sroi: number;
}

export interface LogicModel {
    inputs: string[];
    activities: string[];
    outputs: string[];
    outcomes: string[];
    impact: string;
}

export interface ProjectMilestone {
    id: string;
    title: string;
    status: 'pending' | 'verifying' | 'completed';
    xpReward: number;
    description: string;
    evidenceUrl?: string;
    verifiedHash?: string;
}

export interface McpServer {
    id: string;
    name: string;
    url: string;
    status: 'connected' | 'error' | 'connecting';
    transport: 'sse' | 'streamable_http';
    auth: 'none' | 'oauth';
    tools: any[];
    latency: number;
    documentationUrl?: string;
}

export interface McpRunActionOutput {
  success: boolean;
  result: any;
  error: string | null;
}

export interface FinancialEntry {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
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
    id: string;
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

export interface ToDoItem {
    id: number;
    text: string;
    completed: boolean;
}

export interface BookmarkItem {
    id: string;
    type: 'article' | 'video' | 'news';
    title: string;
    link?: string;
}

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

export interface VocationInfo {
    type: 'Architect' | 'Alchemist' | 'Scribe' | 'Envoy' | 'Seeker' | 'Guardian';
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
    mastery: number;
    status: 'Ready' | 'Cooldown';
    type: string;
    description: string;
}

export interface EvolutionProposal {
    id: string;
    pattern: string;
    suggestedSkill: string;
    confidence: number;
    status: 'Pending' | 'Approved' | 'Vetoed';
}

export type MasteryLevel = 'Novice' | 'Apprentice' | 'Master';

export interface DashboardWidget {
    id: string;
    type: string;
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

export type UserTier = 'Free' | 'Pro' | 'Enterprise';

export interface CarbonData {
    fuelConsumption: number;
    electricityConsumption: number;
    scope1: number;
    scope2: number;
    scope3: number;
    lastUpdated: number;
}

export interface CarbonMarketHistory {
    time: string;
    price: number;
}

export type DimensionID = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'A10' | 'A11' | 'A12';

export interface Course {
    id: string;
    title: string;
    thumbnail: string;
    level: MasteryLevel | string;
    category: string;
    progress: number;
}

export interface ReportSection {
    id: string;
    title: string;
    template?: string;
    example?: string;
    griStandards?: string;
    subSections?: ReportSection[];
}

export interface QuantumNode {
    id: string;
    atom: string;
    vector: string[];
    weight: number;
    source: string;
}

export type WidgetType = string;

export interface SoulEvolutionFeedback {
    score: number;
    feedback: string;
    suggestedTraits: Partial<SoulForgeConfig>;
}

export type VocationType = 'Architect' | 'Alchemist' | 'Scribe' | 'Envoy' | 'Seeker' | 'Guardian';

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
    status: 'ready' | 'completed';
    icon: any;
    verifiedHash?: string;
}
