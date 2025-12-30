
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { 
    UniversalKnowledgeNode, UniversalLabel, QuantumNode, 
    SemanticContext, LogicWitness, DimensionID, DimensionProtocol, UnitTestResult,
    NeuralSignal, MCPRegistryItem, TrinityState, McpServer
} from '../types';

export type { MCPRegistryItem };

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
}

class AIOSKernel {
    private static STORAGE_KEY = 'jun_aikey_v16_os';
    private knowledgeGraph = new Map<string, UniversalKnowledgeNode>();
    private quantumStore = new Map<string, QuantumNode>();
    private listeners = new Map<string, Set<(node: UniversalKnowledgeNode) => void>>();

    public dimensions$ = new BehaviorSubject<DimensionProtocol[]>(DIMENSION_REGISTRY);
    public syncRate$ = new BehaviorSubject<number>(98.4);
    public unitTests$ = new BehaviorSubject<UnitTestResult[]>([]);
    public mcpRegistry$ = new BehaviorSubject<MCPRegistryItem[]>([
        { id: 't1', name: 'AuthorityForgingEngine', type: 'tool', description: 'Generates session tokens based on vocation level.', latency: 15 },
        { id: 'r1', name: 'MemoryPalaceIndex', type: 'resource', description: 'High-speed vectorized knowledge lookup.', latency: 8 }
    ]);

    public mcpServers$ = new BehaviorSubject<McpServer[]>([
        {
            id: 'openai-direct',
            name: 'OpenAI Direct API',
            url: 'https://api.openai.com/v1',
            status: 'connected',
            transport: 'streamable_http',
            latency: 28,
            docsUrl: 'https://platform.openai.com/docs/api-reference',
            tools: [
                { name: 'chat_completions', description: 'Advanced reasoning and text generation', inputSchema: {} },
                { name: 'embeddings', description: 'Vectorize text for semantic search', inputSchema: {} },
                { name: 'image_generation', description: 'DALL-E 3 image manifestation', inputSchema: {} }
            ]
        },
        {
            id: 'agenticflow-mcp',
            name: 'AgenticFlow API',
            url: 'https://api.agenticflow.ai/v1',
            status: 'connected',
            transport: 'streamable_http',
            latency: 35,
            docsUrl: 'https://docs.agenticflow.ai',
            tools: [
                { name: 'execute_workflow', description: 'Trigger complex agentic chains', inputSchema: {} },
                { name: 'get_context', description: 'Retrieve session context', inputSchema: {} }
            ]
        },
        {
            id: 'pixelml-core',
            name: 'PixelML Core',
            url: 'https://mcp.pixelml.ai/v1',
            status: 'connected',
            transport: 'streamable_http',
            latency: 12,
            tools: [
                { name: 'text-generation', description: 'Generate high-quality ESG narratives', inputSchema: {} },
                { name: 'image-enhance', description: 'Upscale technical ESG diagrams', inputSchema: {} }
            ]
        },
        {
            id: 'github-nexus',
            name: 'GitHub Nexus',
            url: 'https://mcp.github.com/v1',
            status: 'connected',
            transport: 'streamable_http',
            latency: 45,
            docsUrl: 'https://docs.github.com/en/rest',
            tools: [
                { name: 'search_code', description: 'Search GitHub repositories for specific ESG code patterns', inputSchema: {} },
                { name: 'get_repo_contents', description: 'Retrieve documentation and data from repositories', inputSchema: {} },
                { name: 'create_issue', description: 'Automate incident reporting or task creation in GitHub', inputSchema: {} }
            ]
        }
    ]);
    
    public vitals$ = new BehaviorSubject<SystemVital>({
        evolutionStage: 16.1,
        contextLoad: 12.5,
        activeThreads: 8,
        memoryNodes: 4500,
        entropy: 0.08,
        integrityScore: 99.8,
        trinity: { perception: 95, cognition: 92, action: 88 }
    });
    
    public reflex$ = new Subject<{type: string, source: string, payload: any}>();
    public neuralPulse$ = new Subject<NeuralSignal>();

    constructor() {
        this.load();
        this.startKernelLoop();
    }

    private startKernelLoop() {
        interval(3000).subscribe(() => {
            const currentVitals = this.vitals$.value;
            const currentDims = this.dimensions$.value;
            
            const newTrinity = {
                perception: Math.min(100, currentVitals.trinity.perception + (Math.random() - 0.4)),
                cognition: Math.min(100, currentVitals.trinity.cognition + (Math.random() - 0.4)),
                action: Math.min(100, currentVitals.trinity.action + (Math.random() - 0.4))
            };

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
                trinity: newTrinity
            });
        });
    }

    public runSystemWitness() {
        this.broadcastNeuralSignal('Kernel', 'RUNE_ACTIVATION', 1.0);
        this.reflex$.next({ type: 'WITNESS', source: 'Kernel', payload: { hash: Math.random().toString(36).substr(2, 9).toUpperCase() } });
    }

    public broadcastNeuralSignal(origin: string, type: NeuralSignal['type'], intensity: number = 0.5, payload: any = {}) {
        const signal: NeuralSignal = { id: `pulse-${Date.now()}`, origin, type, intensity, payload, timestamp: Date.now() };
        this.neuralPulse$.next(signal);
    }

    public registerNode(id: string, label: string | UniversalLabel, initialValue: any) {
        if (!this.knowledgeGraph.has(id)) {
            this.knowledgeGraph.set(id, { id, type: 'component', label: typeof label === 'string' ? { text: label } : label, currentValue: initialValue, traits: ['A1'], confidence: 'high', lastInteraction: Date.now(), interactionCount: 0, memory: { history: [], aiInsights: [] } });
        }
    }

    public agentUpdate(id: string, updates: Partial<UniversalKnowledgeNode>) {
        const node = this.knowledgeGraph.get(id);
        if (node) {
            Object.assign(node, updates);
            this.notify(id, node);
            this.save();
        }
    }

    public getNode(id: string) { return this.knowledgeGraph.get(id); }

    public subscribe(id: string, callback: (node: UniversalKnowledgeNode) => void) {
        if (!this.listeners.has(id)) this.listeners.set(id, new Set());
        this.listeners.get(id)!.add(callback);
        return () => this.listeners.get(id)?.delete(callback);
    }

    private notify(id: string, node: UniversalKnowledgeNode) {
        this.listeners.get(id)?.forEach(cb => cb(node));
    }

    public recordInteraction(interaction: { componentId: string, eventType: string, timestamp: number, payload?: any }) {
        const node = this.knowledgeGraph.get(interaction.componentId);
        if (node) {
            node.interactionCount += 1;
            node.lastInteraction = interaction.timestamp;
            this.notify(interaction.componentId, node);
            this.save();
        }
    }

    public emit(event: string, payload: any) {
        this.reflex$.next({ type: 'EVOLUTION', source: event, payload });
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

    public addMcpServer(server: Omit<McpServer, 'status' | 'latency' | 'tools'>) {
        const newServer: McpServer = {
            ...server,
            status: 'connecting',
            latency: 0,
            tools: []
        };
        this.mcpServers$.next([...this.mcpServers$.value, newServer]);
        
        // Simulate discovery
        setTimeout(() => {
            const updated = this.mcpServers$.value.map(s => s.id === server.id ? {
                ...s,
                status: 'connected',
                latency: Math.floor(Math.random() * 50) + 10,
                tools: [
                    { name: 'list_resources', description: 'Discover available context resources', inputSchema: {} },
                    { name: 'query_context', description: 'Semantic search over server context', inputSchema: {} }
                ]
            } : s);
            this.mcpServers$.next(updated as McpServer[]);
        }, 1500);
    }

    private save() {
        localStorage.setItem(AIOSKernel.STORAGE_KEY, JSON.stringify({
            nodes: Object.fromEntries(this.knowledgeGraph),
            quantum: Object.fromEntries(this.quantumStore)
        }));
    }

    private load() {
        const saved = localStorage.getItem(AIOSKernel.STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.nodes) Object.entries(parsed.nodes).forEach(([k, v]: [string, any]) => this.knowledgeGraph.set(k, v));
                if (parsed.quantum) Object.entries(parsed.quantum).forEach(([k, v]: [string, any]) => this.quantumStore.set(k, v));
            } catch (e) {}
        }
    }
}

export const universalIntelligence = new AIOSKernel();
