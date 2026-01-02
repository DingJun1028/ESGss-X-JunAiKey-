
import { z } from 'zod';

export type Language = 'zh-TW' | 'en-US';
export type ThemeMode = 'light' | 'dark' | 'cosmic' | 'system';

export enum View {
    MY_ESG = 'my_esg',
    DASHBOARD = 'dashboard',
    BUSINESS_INTEL = 'business_intel',
    STRATEGY = 'strategy',
    REGENERATIVE = 'regenerative',
    CARBON = 'carbon',
    REPORT = 'report',
    ADAN_ZONE = 'adan_zone',
    YANG_BO = 'yang_bo',
    ACADEMY = 'academy',
    PARTNER_PORTAL = 'partner_portal',
    VAULT = 'vault',
    RESTORATION = 'restoration',
    CARD_GAME_ARENA = 'card_game_arena',
    CARD_GAME_ARENA_NEW = 'card_game_arena_new',
    USER_JOURNAL = 'user_journal',
    ABOUT_US = 'about_us',
    TECHNICAL_DOCS = 'technical_docs',
    API_ZONE = 'api_zone',
    UNIVERSAL_BACKEND = 'universal_backend',
    RESEARCH_HUB = 'research_hub',
    DIAGNOSTICS = 'diagnostics',
    TALENT = 'talent',
    INTEGRATION = 'integration',
    CULTURE = 'culture',
    FINANCE = 'finance',
    AUDIT = 'audit',
    GOODWILL = 'goodwill',
    SETTINGS = 'settings',
    HEALTH_CHECK = 'health_check',
    UNIVERSAL_TOOLS = 'universal_tools',
    UNIVERSAL_SYSTEM = 'universal_system',
    THINK_TANK = 'think_tank',
    ALUMNI_ZONE = 'alumni_zone',
    LIBRARY = 'library',
    SOUL_FORGE = 'soul_forge',
    AGENT_ARENA = 'agent_arena',
    AGENT_TRAINING = 'agent_training',
    PROXY_MARKET = 'proxy_market',
    PALACE = 'palace',
    AFFILIATE = 'affiliate',
    GLOBAL_OPS = 'global_ops',
    WORKFLOW_LAB = 'workflow_lab',
    MCP_CONFIG = 'mcp_config',
    IMPACT_PROJECTS = 'impact_projects',
    UNIVERSAL_NOTES = 'universal_notes',
    HYPERCUBE_LAB = 'hypercube_lab',
    ADMIN_PANEL = 'admin_panel',
    ECOSYSTEM_RADAR = 'ecosystem_radar',
    CARBON_WALLET = 'carbon_wallet',
    FLOWLU_INTEGRATION = 'flowlu_integration',
    SUPPLIER_CRM = 'supplier_crm',
    SUPPLIER_SURVEY = 'supplier_survey',
    AGENT_TASKS = 'agent_tasks'
}

export const TaskStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const AgentTaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    assigneeId: z.string(),
    status: TaskStatusSchema,
    progress: z.number(),
    createdAt: z.number(),
    dueDate: z.string(),
    priority: TaskPrioritySchema,
    locationId: z.string(),
    dependencies: z.array(z.string()).optional(),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;

export type DimensionID = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'A10' | 'A11' | 'A12';

export interface Course {
    id: string;
    title: string;
    thumbnail: string;
    level: string;
    category: string;
    progress: number;
}

export const CourseSchema = z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string(),
    level: z.string(),
    category: z.string(),
    progress: z.number(),
});

export const UniversalCrystalSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['Perception', 'Cognition', 'Memory', 'Expression', 'Nexus']),
    description: z.string(),
    state: z.enum(['Fragmented', 'Crystallizing', 'Restored', 'Perfected']),
    integrity: z.number(),
    fragmentsCollected: z.number(),
    fragmentsRequired: z.number(),
});
export type UniversalCrystal = z.infer<typeof UniversalCrystalSchema>;

export const UserTitleSchema = z.object({
    id: z.string(),
    text: z.string(),
    rarity: z.enum(['Common', 'Rare', 'Epic', 'Legendary']),
    bonusEffect: z.string().optional(),
});
export type UserTitle = z.infer<typeof UserTitleSchema>;

export const BadgeSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.enum(['Milestone', 'Achievement', 'Social']),
    unlockedAt: z.number().optional(),
});
export type Badge = z.infer<typeof BadgeSchema>;

export const OfficialEventSchema = z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    status: z.enum(['Upcoming', 'Participating', 'Completed']),
    xpReward: z.number(),
});
export type OfficialEvent = z.infer<typeof OfficialEventSchema>;

export interface ReportSection {
    id: string;
    title: string;
    template?: string;
    example?: string;
    griStandards?: string;
    subSections?: ReportSection[];
}

export const EsgCardRaritySchema = z.enum(['Common', 'Rare', 'Epic', 'Legendary']);
export type EsgCardRarity = z.infer<typeof EsgCardRaritySchema>;

export const EsgCardAttributeSchema = z.enum(['Vision', 'Governance', 'Knowledge']);
export type EsgCardAttribute = z.infer<typeof EsgCardAttributeSchema>;

export type MasteryLevel = 'Novice' | 'Intermediate' | 'Advanced' | 'Master';

export const EsgCardTypeSchema = z.enum(['Knowledge', 'Case', 'Action', 'Event']);
export type EsgCardType = z.infer<typeof EsgCardTypeSchema>;

export const EsgCardSchema = z.object({
    id: z.string(),
    title: z.string(),
    term: z.string(),
    definition: z.string(),
    description: z.string(),
    rarity: EsgCardRaritySchema,
    attribute: EsgCardAttributeSchema,
    cardType: EsgCardTypeSchema,
    collectionSet: z.string(),
    stats: z.object({ defense: z.number(), offense: z.number() }),
    imageUrl: z.string().optional(),
});
export type EsgCard = z.infer<typeof EsgCardSchema> & { cardType: EsgCardType };

export interface ScriptureNode {
    id: string;
    code: string;
    title: string;
    en: string;
    content: string;
    category: string;
    tags: { zh: string; en: string }[];
}

export interface EvolutionLogEntry {
    id: string;
    timestamp: number;
    action: string;
    details?: string;
    type: 'OPTIMIZATION' | 'ALERT' | 'INFO';
}

export interface TrinityState {
    perception: number;
    cognition: number;
    action: number;
}

export interface OperationalKpi {
    efficiency: { hoursSaved: number; reportLatency: number; commFriction: number };
    sanctity: { ocrAccuracy: number; gapCoverage: number };
    resonance: { actionFrequency: number; autoInterventions: number };
    integrity: { apiSyncRate: number; responseDelay: number };
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
    kpis: OperationalKpi;
}

export interface QuantumNode {
    id: string;
    atom: string;
    vector: string[];
    weight: number;
    source: string;
    growth?: ComponentGrowth;
    label?: any;
}

export interface UniversalKnowledgeNode {
    id: string;
    type: 'component' | 'concept' | 'data';
    label: UniversalLabel;
    currentValue: any;
    traits: OmniEsgTrait[];
    confidence: OmniEsgConfidence;
    lastInteraction: number;
    interactionCount: number;
    memory: { history: any[]; aiInsights: any[] };
    growth: ComponentGrowth;
}

export interface DimensionProtocol {
    id: DimensionID;
    name: string;
    description: string;
    status: 'stable' | 'unstable' | 'optimizing';
    integrity: number;
}

export interface UnitTestResult {
    id: string;
    name: string;
    status: 'pass' | 'fail';
    details: string;
    timestamp: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'reward';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;
}

export type OmniEsgTrait = 'learning' | 'optimization' | 'bridging' | 'evolution' | 'seamless' | 'gap-filling';
export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain';
export type OmniEsgMode = 'card' | 'list';
export type OmniEsgConfidence = 'high' | 'medium' | 'low';
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'cyan' | 'rose' | 'slate';

export interface UniversalLabel {
    text: string;
    definition?: string;
    formula?: string;
    rationale?: string;
    id?: string; // For node registration
}

export interface LogicWitness {
    witnessHash: string;
}

export interface McpRunActionOutput {
    success: boolean;
    result: any;
    error: string | null;
}

export interface SemanticContext {
    keywords: string[];
}

export interface NeuralSignal {
    id: string;
    origin: string;
    type: 'DATA_COLLISION' | 'LOGIC_RESONANCE' | 'ENTROPY_PURGE' | 'RUNE_ACTIVATION' | 'CIRCUIT_TRIP' | 'MEMORY_COMMITTED';
    intensity: number;
    payload?: any;
    timestamp: number;
}

export interface McpServer {
    id: string;
    name: string;
    url: string;
    status: 'connected' | 'connecting' | 'failed';
    transport: 'sse' | 'streamable_http';
    auth: 'none' | 'oauth';
    latency: number;
    tools: { name: string; description: string }[];
    documentationUrl?: string;
}

export interface ComponentGrowth {
    heat: number;
    evolutionLevel: number;
    lastInteraction: number;
    circuitStatus: CircuitStatus;
}

export type CircuitStatus = 'OPEN' | 'CLOSED';

export interface FinancialEntry {
    date: string;
    amount: number;
    category: string;
    description: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: number;
    action: string;
    user: string;
    details: string;
    hash: string;
}

export interface LifeEsgQuest {
    id: string;
    category: string;
    title: string;
    enTitle: string;
    impactDesc: string;
    xpReward: number;
    gwcReward: number;
    traitBonus: { trait: string; value: number };
    status: 'ready' | 'completed';
    icon: any;
    verifiedHash?: string;
    rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    desc?: string;
    type?: string;
}

export type UserTier = 'Free' | 'Pro' | 'Enterprise';

export interface WebhookConfig {
    id: string;
    eventType: string;
    url: string;
    status: 'active' | 'inactive';
}

export interface WebhookDelivery {
    id: string;
    webhookId: string;
    timestamp: number;
    status: number;
    response: string;
}

export interface KernelLog {
    id: string;
    timestamp: number;
    source: 'KERNEL' | 'MCP' | 'EVOLUTION' | 'BACKEND' | 'AUTH' | 'MANIFEST' | 'SYNC' | 'RAG' | 'LOGIC' | 'SEC' | 'FINANCE';
    operation: string;
    level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    metadata?: any;
}

export interface AppFile {
    id: string;
    name: string;
    size: number;
    type: string;
    category: string;
    uploadedAt: number;
    url: string;
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
    attributes: Record<string, { label: string; value: number; max: number }>;
    skills: { name: string; level: number; desc: string }[];
    ultimateArt: { name: string; description: string; unlockedAtLevel: number; effect: string };
    equippedCards: string[];
    goodwillValue: number;
    knowledgeRepoIds: string[];
}

export interface DigitalSoulAsset {
    id: string;
    name: string;
    traits: SoulForgeConfig;
    resonance: number;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
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
    status: 'parsing' | 'ready' | 'error';
    type: string;
    atomsCount: number;
}

export interface AdanDisciple {
    alignment: number;
}

export interface TrainingLogEntry {
    id: string;
    agentId: string;
    timestamp: number;
    sessionType: string;
    gainedExp: number;
    statChanges: Record<string, number>;
    newKnowledge: string[];
    isCriticalInsight?: boolean;
}

export interface EntityPlanet {
    taxId: string;
}

export interface UserJournalEntry {
    id: string;
    title: string;
    impact: string;
    xpGained: number;
    timestamp: number;
    type: 'milestone' | 'action' | 'insight';
    tags: string[];
}

export interface AgentCertification {
    id: string;
    title: string;
    status: 'Locked' | 'In_Progress' | 'Certified';
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
    type: 'Active' | 'Passive' | 'Composite';
    description: string;
    mastery: number;
    status: 'Ready' | 'Cooldown' | 'Locked';
}

export interface EvolutionProposal {
    id: string;
    pattern: string;
    suggestedSkill: string;
    confidence: number;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface CarbonMarketHistory {
    time: string;
    price: number;
}

export interface CarbonAssetPackage {
    assetId: string;
    totalValue: number;
}

export interface SupplierPersona {
    id: string;
    name: string;
    taxId: string;
    trustScore: number;
    carbonGrade: 'A' | 'B' | 'C' | 'D' | 'E';
    riskStatus: 'GREEN' | 'YELLOW' | 'RED';
    inflowStatus: 'ENGRAVED' | 'REFining' | 'TO_FIX' | 'IDLE' | 'INVESTIGATING';
    anomalyDetected?: boolean;
    anomalyDetails?: string;
    purity?: { clarity: number; alignment: number; validity: number };
    metrics: { electricity_total: number; renewable_percent: number; iso_certified: boolean; safety_incidents: number; gender_pay_ratio: number; ethics_signed: boolean };
    flowluMapping: { crm_account_id: string; custom_fields: any };
}

export interface BenchmarkingNode {
    id: string;
    distance: number;
    angle: number;
    efficiency: number;
    compliance: number;
    isTarget: boolean;
    industry: string;
}

export interface OptimizationPath {
    steps: { title: string; roi: number; difficulty: 'LOW' | 'MED' | 'HIGH' }[];
    projectedSroi: number;
}

export type NoteLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface NoteItem {
    id: string;
    title: string;
    content: string;
    timestamp: number;
    tags: string[];
    level: NoteLevel;
    aiMetadata?: { summary?: string; insights?: string[] };
    manifestedContent?: string;
    imageUrl?: string;
}

export interface ImpactProject {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'paused';
    progress: number;
    impactXP: number;
    sdgs: number[];
    logicModel: { inputs: string[]; activities: string[]; outputs: string[]; outcomes: string[]; impact: string };
    milestones: ProjectMilestone[];
    financials: { budget: number; spent: number; revenue_projected: number; roi_projected: number };
    impactMetrics: { label: string; current: number; target: number; unit: string; proxy_value: number }[];
    sroi: number;
}

export interface ProjectMilestone {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    xpReward: number;
    description: string;
    verifiedHash?: string;
}

export type VocationType = 'Architect' | 'Alchemist' | 'Scribe' | 'Envoy' | 'Seeker' | 'Guardian';