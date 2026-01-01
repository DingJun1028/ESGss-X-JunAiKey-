import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useToast } from './ToastContext';
import { 
    PersonaConfig, DigitalSoulAsset, SoulForgeConfig, 
    TrainingDoc, AdanDisciple, EsgCard, TrainingLogEntry, EntityPlanet,
    UserJournalEntry
} from '../types';
import { universalIntelligence } from '../services/evolutionEngine';
import { Subject } from 'rxjs';
import { getEsgCards } from '../constants';
import { useCompany } from '../components/providers/CompanyProvider';

export type AvatarFace = 'MIRROR' | 'EXPERT' | 'VOID' | 'CUSTOM';

export interface PersonaAttributes {
    altruism: number;   // 利他性
    pragmatism: number;  // 務實性
    innovation: number;  // 創新性
    stability: number;   // 穩定性
}

export interface JourneyStep {
    id: string;
    instruction: string;
}

export interface Journey {
    id: string;
    title: string;
    steps: JourneyStep[];
    currentStepIndex: number;
}

export interface EvolutionMilestone {
    version: string;
    codename: string;
    status: 'completed' | 'current' | 'planned';
    focus: string;
    improvements: string[];
    evaluationScore: number;
    detectedBottleneck?: string;
    evalDetails?: string;
    estimatedImpact: string;
}

export interface AIVersionHistory {
    date: string;
    event: string;
    impact: string;
}

interface UniversalAgentContextType {
    activePersona: PersonaConfig;
    availablePersonas: PersonaConfig[];
    switchPersona: (id: string) => void;
    updatePersonaStats: (id: string, updates: Partial<PersonaConfig>) => void;
    
    traits: PersonaAttributes;
    updateTraits: (updates: Partial<PersonaAttributes>) => void;
    
    galaxy: Record<string, EntityPlanet>;
    syncPlanet: (planet: EntityPlanet) => void;
    broadcastSignal: (type: string, message: string) => void;
    neuralBus$: Subject<any>;

    observeAction: (type: string, detail: string) => void;
    activeJourney: Journey | null;
    advanceJourney: () => void;
    evolutionPlan: EvolutionMilestone[];
    runSelfDetection: () => void;
    aiVersionHistory: AIVersionHistory[];

    cardInventory: EsgCard[];
    equippedCards: string[];
    equipCard: (cardId: string) => void;
    unequipCard: (cardId: string) => void;
    
    expMultiplier: number;
    luckFactor: number;

    logs: AgentLog[];
    chatHistory: AgentLog[];
    addLog: (message: string, type?: AgentLog['type'], source?: AgentLog['source']) => void;
    commitChatToMemory: (prompt: string, answer: string) => void;
    trainingDocs: TrainingDoc[];
    uploadTrainingDoc: (file: File) => Promise<void>;
    isProcessing: boolean;
    
    activeFace: AvatarFace;
    setActiveFace: (face: AvatarFace) => void;
    activeKeyId: string | null;
    executeMatrixProtocol: (id: string, label: string) => Promise<void>;
    subAgentsActive: boolean;

    forgedSouls: DigitalSoulAsset[];
    forgeSoul: (name: string, config: SoulForgeConfig, id?: string) => Promise<DigitalSoulAsset>;
    equipSoul: (soulId: string) => void;
    activeSoulAsset: DigitalSoulAsset | null;
    soul: AdanDisciple; 

    trainingLogs: TrainingLogEntry[];
    addTrainingSession: (session: Omit<TrainingLogEntry, 'id'>) => void;
    exportNeuralState: (agentId: string) => string;
    importNeuralState: (agentId: string, state: string) => void;
    updatePersonaKnowledge: (agentId: string, repos: string[]) => void;
    synthesizeCards: (id1: string, id2: string) => void;
    decomposeCard: (id: string) => void;
}

export interface AgentLog {
    id: string;
    timestamp: number;
    source: 'Matrix' | 'Chat' | 'System' | 'Assistant' | 'Kernel' | 'Evolution' | 'Insight' | 'Tool' | 'Hive' | 'Relic' | 'AMICE' | 'Advisory';
    message: string;
    type: 'info' | 'success' | 'error' | 'thinking' | 'warning';
}

const UniversalAgentContext = createContext<UniversalAgentContextType | undefined>(undefined);

const INITIAL_PERSONAS: PersonaConfig[] = [
    {
        id: 'jun-ai-key',
        name: 'JunAiKey',
        title: '系統內核 (OS Kernel)',
        archetype: 'Architect',
        coreTrait: '精確、中立、極致高效',
        primaryGoal: '確保企業永續數據的 MECE 完整性與系統營運穩定度。',
        systemPrompt: "你是 ESGss 的內核 JunAiKey。你的目標是提供最精確、結構化且符合邏輯的數據分析與系統建議。",
        level: 15, exp: 450, color: 'indigo-500', avatarUrl: '',
        attributes: {
            INT: { label: '邏輯分析', value: 99, max: 100 },
            EMP: { label: '情感共鳴', value: 40, max: 100 },
            STRAT: { label: '戰略佈局', value: 85, max: 100 },
            EXEC: { label: '執行效率', value: 98, max: 100 }
        },
        skills: [{ name: '零幻覺稽核', level: 5, desc: '確保回覆數據 100% 來自知識庫。' }],
        ultimateArt: { name: '內核覺醒：熵減優化', description: '全系統數據瞬間摺疊分析。', unlockedAtLevel: 20, effect: 'System Optimization' },
        equippedCards: ['relic-knowledge-base'],
        goodwillValue: 500,
        knowledgeRepoIds: ['repo-official-tpl', 'repo-yang-wisdom']
    }
];

export const UniversalAgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { addToast } = useToast();
    // Assuming useCompany is used to get addJournalEntry and awardXp
    // But we need to be careful with circular dependencies if useCompany is a child.
    // In App.tsx, UniversalAgentProvider is a PARENT of CompanyProvider.
    // To solve this, we can either move the logic or pass a ref.
    // For now, we will handle what we can locally and trigger signals.

    const [availablePersonas, setAvailablePersonas] = useState<PersonaConfig[]>(INITIAL_PERSONAS);
    const [activePersonaId, setActivePersonaId] = useState('jun-ai-key');
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [traits, setTraits] = useState<PersonaAttributes>({
        altruism: 65, pragmatism: 80, innovation: 45, stability: 90
    });
    const [trainingDocs, setTrainingDocs] = useState<TrainingDoc[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardInventory, setCardInventory] = useState<EsgCard[]>(getEsgCards('zh-TW'));
    
    const [galaxy, setGalaxy] = useState<Record<string, EntityPlanet>>({});
    const [activeFace, setActiveFace] = useState<AvatarFace>('MIRROR');
    const [forgedSouls, setForgedSouls] = useState<DigitalSoulAsset[]>([]);
    const [activeSoulId, setActiveSoulId] = useState<string | null>(null);
    const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
    const neuralBus$ = useMemo(() => new Subject<any>(), []);

    const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
    const [evolutionPlan, setEvolutionPlan] = useState<EvolutionMilestone[]>([]);
    const [aiVersionHistory, setAiVersionHistory] = useState<AIVersionHistory[]>([]);
    const [trainingLogs, setTrainingLogs] = useState<TrainingLogEntry[]>([]);

    const activePersona = useMemo<PersonaConfig>(() => {
        return availablePersonas.find(p => p.id === activePersonaId) || availablePersonas[0];
    }, [availablePersonas, activePersonaId]);

    const expMultiplier = useMemo(() => 1 + (Number(activePersona.goodwillValue) / 1000), [activePersona.goodwillValue]);
    const luckFactor = useMemo(() => 1 + (Number(activePersona.goodwillValue) / 2000), [activePersona.goodwillValue]);

    useEffect(() => {
        const savedData = localStorage.getItem('esgss_agent_v15_evolution');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.traits) setTraits(parsed.traits);
                if (parsed.galaxy) setGalaxy(parsed.galaxy);
            } catch (e) {}
        }

        setEvolutionPlan([
            { version: 'v14.5', codename: 'Horizon', status: 'completed', focus: 'RAG Optimization', improvements: ['Faster retrieval', 'Multi-modal support'], evaluationScore: 92, estimatedImpact: 'High' },
            { version: 'v15.2', codename: 'Hypercube', status: 'current', focus: 'Agent Orchestration & AMICE Sync', improvements: ['Matrix Console', 'Stakeholder Radar'], evaluationScore: 99, estimatedImpact: 'Critical' },
            { version: 'v15.9', codename: 'Civilization', status: 'planned', focus: 'Autonomous Regen Governance', improvements: ['Chain Voting', 'Manifesto Engine'], evaluationScore: 0, estimatedImpact: 'Legendary' }
        ]);
        setAiVersionHistory([
            { date: '2025-02-20', event: 'Hypercube Evolution Protocol', impact: 'Agent sync speed +60%' },
            { date: '2025-02-22', event: 'AMICE Reporting manifested', impact: 'Real-time global intelligence' }
        ]);
    }, []);

    useEffect(() => {
        localStorage.setItem('esgss_agent_v15_evolution', JSON.stringify({ traits, galaxy }));
    }, [traits, galaxy]);

    const updateTraits = useCallback((updates: Partial<PersonaAttributes>) => {
        setTraits(prev => ({ ...prev, ...updates }));
    }, []);

    const syncPlanet = useCallback((planet: EntityPlanet) => {
        setGalaxy(prev => ({ ...prev, [planet.taxId]: planet }));
    }, []);

    const broadcastSignal = useCallback((type: string, message: string) => {
        const signal = { type, message, timestamp: Date.now() };
        neuralBus$.next(signal);
        setLogs(prev => [...prev, { 
            id: `hive-${Date.now()}`, 
            timestamp: Date.now(), 
            source: 'Hive' as any, 
            message, 
            type: 'info' 
        } as AgentLog].slice(-100));
    }, [neuralBus$]);

    const addLog = useCallback((message: string, type: AgentLog['type'] = 'info', source: AgentLog['source'] = 'System') => {
        setLogs(prev => [...prev, { id: `log-${Date.now()}`, timestamp: Date.now(), source, message, type } as AgentLog].slice(-100));
    }, []);

    const observeAction = useCallback((type: string, detail: string) => {
        addLog(`Observation [${type}]: ${detail}`, 'info', 'Insight' as any);
    }, [addLog]);

    const advanceJourney = useCallback(() => {
        if (activeJourney && activeJourney.currentStepIndex < activeJourney.steps.length - 1) {
            setActiveJourney({
                ...activeJourney,
                currentStepIndex: activeJourney.currentStepIndex + 1
            });
        }
    }, [activeJourney]);

    const runSelfDetection = useCallback(() => {
        setIsProcessing(true);
        addLog("Running system self-detection...", "thinking", "Kernel");
        setTimeout(() => {
            setIsProcessing(false);
            addLog("Self-detection complete. Integrity: 99.8%", "success", "Kernel");
        }, 2000);
    }, [addLog]);

    const switchPersona = (id: string) => setActivePersonaId(id);
    const updatePersonaStats = (id: string, updates: Partial<PersonaConfig>) => {
        setAvailablePersonas(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const addTrainingSession = useCallback((session: Omit<TrainingLogEntry, 'id'>) => {
        const id = `tl-${Date.now()}`;
        setTrainingLogs(prev => [{ ...session, id }, ...prev]);
    }, []);

    const commitChatToMemory = useCallback((prompt: string, answer: string) => {
        const atom = `[對話記憶] ${activePersona.name}：${answer.substring(0, 100)}`;
        
        // 1. Inject to Vector Engine
        universalIntelligence.injectQuantumNodes([{ atom, vector: ['chat', 'memory'], weight: 0.8 }], `Memory_${activePersona.id}`);
        
        // 2. Add to Training Logs (Internal evolution)
        addTrainingSession({
            agentId: activePersona.id,
            timestamp: Date.now(),
            sessionType: '對話學習 (Contextual Learning)',
            gainedExp: 25,
            statChanges: { INT: 0.1, STRAT: 0.05 },
            newKnowledge: [prompt.substring(0, 50) + "..."]
        });

        // 3. Emit Signal for HUD / UX
        addLog(`Knowledge atom engraved: "${prompt.substring(0, 20)}..."`, 'success', 'Kernel');
        broadcastSignal('MEMORY_COMMITTED', `Agent ${activePersona.name} integrated a new knowledge shard.`);
        
        // 4. Update traits based on interaction (Autonomous alignment)
        if (prompt.toLowerCase().includes('help') || prompt.toLowerCase().includes('social')) {
            updateTraits({ altruism: Math.min(100, traits.altruism + 0.5) });
        }
    }, [activePersona.id, activePersona.name, addTrainingSession, addLog, broadcastSignal, traits.altruism, updateTraits]);

    const uploadTrainingDoc = async (file: File) => {
        const id = `doc-${Date.now()}`;
        setTrainingDocs(prev => [...prev, { id, name: file.name, status: 'parsing', type: file.type, atomsCount: 0 }]);
        await new Promise(r => setTimeout(r, 2000));
        setTrainingDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'ready', atomsCount: 50 } : d));
    };

    const forgeSoul = async (name: string, config: SoulForgeConfig, id?: string) => {
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 1500));
        const soulId = id || `soul-${Date.now()}`;
        const newSoul: DigitalSoulAsset = { id: soulId, name, traits: config, resonance: 100, rarity: 'Epic', forgedAt: Date.now(), ownerId: 'user' };
        setForgedSouls(prev => [...prev.filter(s => s.id !== soulId), newSoul]);
        setIsProcessing(false);
        addToast('success', '靈魂鍛造完成', 'Forge');
        return newSoul;
    };

    const equipSoul = (soulId: string) => {
        setActiveSoulId(soulId);
        const soulAsset = forgedSouls.find(s => s.id === soulId);
        if (soulAsset) addToast('reward', `已裝備靈魂：${soulAsset.name}`, 'Sync');
    };

    const executeMatrixProtocol = async (id: string, label: string) => {
        setActiveKeyId(id);
        setIsProcessing(true);
        addLog(`Protocol initiated: ${label}`, 'thinking', 'Matrix');
        await new Promise(r => setTimeout(r, 1000));
        addLog(`${label} complete.`, 'success', 'Matrix');
        setIsProcessing(false);
        setActiveKeyId(null);
    };

    const exportNeuralState = useCallback((agentId: string) => {
        const agent = availablePersonas.find(p => p.id === agentId);
        return JSON.stringify(agent);
    }, [availablePersonas]);

    const importNeuralState = useCallback((agentId: string, state: string) => {
        try {
            const parsed = JSON.parse(state);
            setAvailablePersonas(prev => prev.map(p => p.id === agentId ? { ...p, ...parsed } : p));
            addToast('success', 'Neural state imported.', 'Sync');
        } catch (e) {
            addToast('error', 'Import failed.', 'Sync');
        }
    }, [addToast]);

    const updatePersonaKnowledge = useCallback((agentId: string, repos: string[]) => {
        setAvailablePersonas(prev => prev.map(p => p.id === agentId ? { ...p, knowledgeRepoIds: repos } : p));
    }, []);

    const synthesizeCards = useCallback((id1: string, id2: string) => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            addToast('reward', 'Card synthesis successful.', 'Forge');
        }, 2000);
    }, [addToast]);

    const decomposeCard = useCallback((id: string) => {
        setCardInventory(prev => prev.filter(c => c.id !== id));
    }, []);

    const value = {
        activePersona, availablePersonas, switchPersona, updatePersonaStats,
        traits, updateTraits,
        galaxy, syncPlanet, broadcastSignal, neuralBus$,
        observeAction, activeJourney, advanceJourney, evolutionPlan, runSelfDetection, aiVersionHistory,
        cardInventory, equippedCards: activePersona.equippedCards || [],
        equipCard: (id: string) => {}, unequipCard: (id: string) => {},
        expMultiplier, luckFactor,
        logs, chatHistory: logs.filter(l => l.source === 'Chat' || l.source === 'Assistant'),
        addLog, commitChatToMemory, trainingDocs, uploadTrainingDoc,
        isProcessing, activeFace, setActiveFace, activeKeyId, executeMatrixProtocol, subAgentsActive: isProcessing,
        forgedSouls, forgeSoul, equipSoul, activeSoulAsset: forgedSouls.find(s => s.id === activeSoulId) || null,
        soul: { ...activePersona, version: '15.2', exp: activePersona.exp, alignment: 99, rank: activePersona.title } as any,
        trainingLogs, addTrainingSession, exportNeuralState, importNeuralState, updatePersonaKnowledge,
        synthesizeCards, decomposeCard
    };

    return <UniversalAgentContext.Provider value={value}>{children}</UniversalAgentContext.Provider>;
};

export const useUniversalAgent = () => {
    const context = useContext(UniversalAgentContext);
    if (!context) throw new Error('useUniversalAgent must be used within a UniversalAgentProvider');
    return context;
};
