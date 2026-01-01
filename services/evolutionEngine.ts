
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { 
    UniversalKnowledgeNode, UniversalLabel, QuantumNode, 
    SemanticContext, LogicWitness, DimensionID, DimensionProtocol, UnitTestResult,
    NeuralSignal, TrinityState, McpServer, ComponentGrowth, CircuitStatus,
    EvolutionLogEntry, OperationalKpi
} from '../types';
import { runMcpAction } from './ai-service';

export const DIMENSION_REGISTRY: DimensionProtocol[] = [
    { id: 'A1', name: 'Awakening', description: 'Initializing Neural State', status: 'stable', integrity: 100 },
    { id: 'A2', name: 'Bridging', description: 'Cross-Module Connectivity', status: 'stable', integrity: 98 },
    { id: 'A3', name: 'Cognition', description: 'Deep Reasoning Logic', status: 'stable', integrity: 95 },
    { id: 'A4', name: 'Defense', description: 'Zero-Hallucination Guardrails', status: 'stable', integrity: 100 },
    { id: 'A5', name: 'Entropy', description: 'Entropy Reduction & Optimization', status: 'stable', integrity: 92 },
    { id: 'A6', name: 'Finance', description: 'Value & Simulation', status: 'stable', integrity: 88 },
    { id: 'A7', name: 'Governance', description: 'Audit & Integrity Witnessing', status: 'stable', integrity: 96 },
    { id: 'A8', name: 'Harmony', description: 'UX & Sympathetic Resonance', status: 'stable', integrity: 94 },
    { id: 'A9', name: 'Impact', description: 'ESG Weighted Analysis', status: 'stable', integrity: 91 },
    { id: 'A10', name: 'Justice', description: 'Logic Assertion Matrix', status: 'stable', integrity: 100 },
    { id: 'A11', name: 'Knowledge', description: 'RAG & Atomic Nodes', status: 'stable', integrity: 99 },
    { id: 'A12', name: 'Light', description: 'Visual Semantic Display', status: 'stable', integrity: 97 },
];

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

const DEFAULT_MCP_SERVERS: McpServer[] = [
    {
        id: 'github-provider',
        name: 'GitHub Nexus',
        url: 'https://api.github.com',
        documentationUrl: 'https://docs.github.com/en/rest',
        status: 'connected',
        transport: 'streamable_http',
        auth: 'none',
        latency: 12,
        tools: [
            { name: 'sync_repository', description: 'Synchronize project manifesto with GitHub remote.' },
            { name: 'fetch_issues', description: 'Retrieve ESG compliance issues from repository.' }
        ]
    }
];

class AIOSKernel {
    private static STORAGE_KEY = 'jun_aikey_v16_os';
    private knowledgeGraph = new Map<string, UniversalKnowledgeNode>();
    private quantumStore = new Map<string, QuantumNode>();
    private listeners = new Map<string, Set<(node: UniversalKnowledgeNode) => void>>();

    public dimensions$ = new BehaviorSubject<DimensionProtocol[]>(DIMENSION_REGISTRY);
    public syncRate$ = new BehaviorSubject<number>(98.4);
    public unitTests$ = new BehaviorSubject<UnitTestResult[]>([]);
    public mcpServers$ = new BehaviorSubject<McpServer[]>(DEFAULT_MCP_SERVERS);
    public evolutionLogs$ = new BehaviorSubject<EvolutionLogEntry[]>([]);

    public vitals$ = new BehaviorSubject<SystemVital>({
        evolutionStage: 16.1,
        contextLoad: 12.5,
        activeThreads: 8,
        memoryNodes: 4500,
        entropy: 0.08,
        integrityScore: 99.8,
        trinity: { perception: 95, cognition: 92, action: 88 },
        synergyLevel: 0.85,
        activeCircuits: 0,
        isEvolving: false,
        kpis: {
            efficiency: { hoursSaved: 124, reportLatency: 2800, commFriction: 0.08 },
            sanctity: { ocrAccuracy: 98.4, gapCoverage: 100 },
            resonance: { actionFrequency: 42, autoInterventions: 8 },
            integrity: { apiSyncRate: 100, responseDelay: 142 }
        }
    });
    
    public reflex$ = new Subject<{type: string, source: string, payload: any}>();
    public neuralPulse$ = new Subject<NeuralSignal>();

    constructor() {
        this.load();
        this.startKernelLoop();
        this.startGrowthDecayLoop();
        this.startAutoEvolutionWatcher();
    }

    private startAutoEvolutionWatcher() {
        interval(15000).subscribe(async () => {
            const currentVitals = this.vitals$.value;
            if (currentVitals.entropy > 0.09 || Math.random() > 0.8) {
                await this.triggerAutoEvolution();
            }
        });
    }

    private async triggerAutoEvolution() {
        if (this.vitals$.value.isEvolving) return;

        this.vitals$.next({ ...this.vitals$.value, isEvolving: true });
        this.broadcastNeuralSignal('EvolutionEngine', 'ENTROPY_PURGE', 1.0);

        try {
            const result = await runMcpAction('perform_entropy_transmutation', {
                vitals: this.vitals$.value,
                projectData: { activeNodes: this.knowledgeGraph.size }
            }, 'zh-TW');

            if (result.success) {
                const log: EvolutionLogEntry = {
                    id: `evo-${Date.now()}`,
                    timestamp: Date.now(),
                    action: result.result.optimizationDirective.title,
                    details: result.result.originalSin,
                    type: 'OPTIMIZATION'
                };
                this.evolutionLogs$.next([log, ...this.evolutionLogs$.value].slice(0, 50));
                this.emit('EVOLUTION_COMPLETE', log);
                
                this.vitals$.next({ 
                    ...this.vitals$.value, 
                    entropy: Math.max(0.01, this.vitals$.value.entropy - 0.03),
                    integrityScore: Math.min(100, this.vitals$.value.integrityScore + 1),
                    kpis: {
                        ...this.vitals$.value.kpis,
                        resonance: { 
                            ...this.vitals$.value.kpis.resonance, 
                            autoInterventions: this.vitals$.value.kpis.resonance.autoInterventions + 1 
                        }
                    }
                });
            }
        } catch (e) {
            console.error("Evolution sequence interrupted", e);
        } finally {
            this.vitals$.next({ ...this.vitals$.value, isEvolving: false });
        }
    }

    private startGrowthDecayLoop() {
        interval(5000).subscribe(() => {
            let activeCircuits = 0;
            this.knowledgeGraph.forEach((node, id) => {
                if (node.growth) {
                    const newHeat = node.growth.heat * Math.exp(-0.05);
                    const newEvolution = node.growth.evolutionLevel + (newHeat > 10 ? 0.02 : -0.005);
                    
                    const updatedGrowth: ComponentGrowth = {
                        ...node.growth,
                        heat: parseFloat(newHeat.toFixed(4)),
                        evolutionLevel: Math.max(1, Math.min(5, newEvolution))
                    };

                    if (updatedGrowth.circuitStatus !== 'CLOSED') activeCircuits++;
                    this.agentUpdate(id, { growth: updatedGrowth });
                }
            });

            this.vitals$.next({
                ...this.vitals$.value,
                activeCircuits
            });
        });
    }

    public registerNode(id: string, label: string | UniversalLabel, initialValue: any) {
        if (!this.knowledgeGraph.has(id)) {
            const growth: ComponentGrowth = {
                heat: 0,
                evolutionLevel: 1,
                lastInteraction: Date.now(),
                circuitStatus: 'CLOSED'
            };

            this.knowledgeGraph.set(id, { 
                id, type: 'component', label: typeof label === 'string' ? { text: label } : label, 
                currentValue: initialValue, traits: ['A1'], confidence: 'high', 
                lastInteraction: Date.now(), interactionCount: 0, memory: { history: [], aiInsights: [] },
                growth
            });
        }
    }

    public recordInteraction(interaction: any) {
        const node = this.knowledgeGraph.get(interaction.componentId);
        if (node) {
            node.interactionCount++;
            node.lastInteraction = Date.now();
            node.memory.history.push(interaction);
            
            if (node.growth) {
                const heatGain = interaction.eventType === 'ai-trigger' ? 2.5 : 1.0;
                node.growth.heat += heatGain;
                node.growth.lastInteraction = Date.now();
                
                if (node.growth.heat > 50 && node.growth.circuitStatus === 'CLOSED') {
                    node.growth.circuitStatus = 'OPEN';
                    this.broadcastNeuralSignal('CircuitBreaker', 'CIRCUIT_TRIP', 1.0, { id: node.id, heat: node.growth.heat });
                    this.emit('CIRCUIT_OPEN', { node: node.id });
                }
            }

            this.notifyListeners(interaction.componentId, node);
        }
    }

    public triggerSynergy(cores: string[]) {
        const intensity = cores.length / 5;
        this.broadcastNeuralSignal('SynergyReactor', 'LOGIC_RESONANCE', intensity, { cores });
        this.vitals$.next({
            ...this.vitals$.value,
            synergyLevel: Math.min(1.0, this.vitals$.value.synergyLevel + 0.05)
        });
    }

    public runSystemWitness() {
        this.broadcastNeuralSignal('Witness', 'LOGIC_RESONANCE', 1.0);
    }

    public getNode(id: string): UniversalKnowledgeNode | undefined {
        return this.knowledgeGraph.get(id);
    }

    public getAllNodes(): UniversalKnowledgeNode[] {
        return Array.from(this.knowledgeGraph.values());
    }

    public subscribe(id: string, callback: (node: UniversalKnowledgeNode) => void) {
        if (!this.listeners.has(id)) {
            this.listeners.set(id, new Set());
        }
        this.listeners.get(id)!.add(callback);
        return () => {
            this.listeners.get(id)?.delete(callback);
        };
    }

    private notifyListeners(id: string, node: UniversalKnowledgeNode) {
        this.listeners.get(id)?.forEach(cb => cb(node));
    }

    public agentUpdate(id: string, updates: any) {
        const node = this.knowledgeGraph.get(id);
        if (node) {
            Object.assign(node, updates);
            this.notifyListeners(id, node);
        }
    }

    public emit(event: string, payload: any) {
        this.reflex$.next({ type: event, source: 'Kernel', payload });
    }

    public addMcpServer(server: Partial<McpServer>) {
        const current = this.mcpServers$.value;
        const newServer: McpServer = {
            id: server.id || `mcp-${Date.now()}`,
            name: server.name || 'Unknown Server',
            url: server.url || '',
            status: 'connected',
            transport: server.transport || 'streamable_http',
            auth: server.auth || 'none',
            tools: server.tools || [],
            latency: 12,
            ...server
        } as McpServer;
        this.mcpServers$.next([...current, newServer]);
    }

    private startKernelLoop() {
        interval(3000).subscribe(() => {
            const currentVitals = this.vitals$.value;
            const currentDims = this.dimensions$.value;
            
            const updatedDims = currentDims.map(d => ({ 
                ...d, 
                integrity: Math.max(0, Math.min(100, d.integrity + (Math.random() - 0.3))) 
            }));
            
            const avgIntegrity = updatedDims.reduce((acc, d) => acc + d.integrity, 0) / updatedDims.length;
            
            this.dimensions$.next(updatedDims);
            this.syncRate$.next(parseFloat(avgIntegrity.toFixed(1)));
            this.vitals$.next({ 
                ...currentVitals, 
                entropy: Math.max(0.01, currentVitals.entropy + (Math.random() * 0.005 - 0.002)),
                integrityScore: avgIntegrity, 
                memoryNodes: this.quantumStore.size,
                synergyLevel: Math.max(0.5, currentVitals.synergyLevel - 0.005),
                kpis: {
                    ...currentVitals.kpis,
                    integrity: {
                        ...currentVitals.kpis.integrity,
                        responseDelay: Math.max(10, 142 + (Math.random() * 20 - 10))
                    }
                }
            });
        });
    }

    public broadcastNeuralSignal(origin: string, type: NeuralSignal['type'], intensity: number = 0.5, payload: any = {}) {
        const signal: NeuralSignal = { id: `pulse-${Date.now()}`, origin, type, intensity, payload, timestamp: Date.now() };
        this.neuralPulse$.next(signal);
    }

    public injectQuantumNodes(nodes: { atom: string, vector: string[], weight?: number }[], source: string) {
        nodes.forEach((n, i) => {
            const id = `q-${source}-${i}-${Date.now()}`;
            this.quantumStore.set(id, { id, atom: n.atom, vector: n.vector, weight: n.weight || 0.5, source });
        });
        this.save();
    }

    public retrieveContextualNodes(context: SemanticContext): QuantumNode[] {
        return Array.from(this.quantumStore.values())
            .filter(n => context.keywords.some(k => k.length > 1 && n.atom.toLowerCase().includes(k.toLowerCase())))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 10);
    }

    private save() {
        localStorage.setItem(AIOSKernel.STORAGE_KEY, JSON.stringify({
            nodes: Object.fromEntries(this.knowledgeGraph),
            quantum: Object.fromEntries(this.quantumStore),
            mcp: this.mcpServers$.value
        }));
    }

    private load() {
        const saved = localStorage.getItem(AIOSKernel.STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.nodes) Object.entries(parsed.nodes).forEach(([k, v]: [string, any]) => this.knowledgeGraph.set(k, v));
                if (parsed.quantum) Object.entries(parsed.quantum).forEach(([k, v]: [string, any]) => this.quantumStore.set(k, v));
                if (parsed.mcp && parsed.mcp.length > 0) this.mcpServers$.next(parsed.mcp);
            } catch (e) {}
        }
    }
}

export const universalIntelligence = new AIOSKernel();
