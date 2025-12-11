
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

export type AvatarFace = 'MIRROR' | 'EXPERT' | 'VOID';

export interface AgentLog {
    id: string;
    timestamp: number;
    source: 'Matrix' | 'Chat' | 'System';
    message: string;
    type: 'info' | 'success' | 'error' | 'thinking';
}

interface UniversalAgentContextType {
    activeFace: AvatarFace;
    setActiveFace: (face: AvatarFace) => void;
    logs: AgentLog[];
    addLog: (message: string, type?: AgentLog['type'], source?: AgentLog['source']) => void;
    isProcessing: boolean;
    activeKeyId: string | null;
    executeMatrixProtocol: (keyId: string, label: string) => Promise<void>;
    subAgentsActive: string[]; // List of the 36 sub-agents currently running
}

const UniversalAgentContext = createContext<UniversalAgentContextType | undefined>(undefined);

export const UniversalAgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeFace, setActiveFace] = useState<AvatarFace>('MIRROR');
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
    const [subAgentsActive, setSubAgentsActive] = useState<string[]>([]);
    const { addToast } = useToast();

    // Initial Greeting
    useEffect(() => {
        addLog('Universal Neural Link Established.', 'info', 'System');
        addLog('Waiting for Matrix Protocol input...', 'info', 'System');
    }, []);

    const addLog = (message: string, type: AgentLog['type'] = 'info', source: AgentLog['source'] = 'System') => {
        setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), timestamp: Date.now(), source, message, type }].slice(-50));
    };

    // The Logic Engine Mapping 16 Keys to 36 Potential Sub-Agents
    const executeMatrixProtocol = async (keyId: string, label: string) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setActiveKeyId(keyId);
        
        addLog(`Protocol Initiated: [${label.toUpperCase()}]`, 'thinking', 'Matrix');

        // Simulate activating specific sub-agents based on the key
        const subAgentMap: Record<string, string[]> = {
            'awaken': ['Memory_Core', 'Context_Loader', 'Intent_Parser'],
            'inspect': ['Code_Scanner', 'Data_Validator', 'Pattern_Recognizer'],
            'scripture': ['Knowledge_Retriever', 'Compliance_Check', 'Best_Practice_DB'],
            'connect': ['Graph_Linker', 'Dependency_Mapper', 'Bridge_Builder'],
            'summon': ['API_Gateway', 'Auth_Manager', 'Quota_Monitor'],
            'transmute': ['Format_Converter', 'Schema_Validator', 'Type_Inferencer'],
            'bridge': ['Protocol_Adapter', 'Lang_Translator', 'Env_Configurator'],
            'encase': ['Docker_Builder', 'Module_Packer', 'Version_Tagger'],
            'manifest': ['Code_Generator', 'Text_Synthesizer', 'Asset_Renderer'],
            'trial': ['Unit_Tester', 'Integration_Tester', 'Stress_Tester'],
            'judge': ['Security_Auditor', 'Performance_Profiler', 'Logic_Verifier'],
            'ascend': ['Deploy_Script', 'CI_CD_Pipeline', 'Rollback_Guard'],
            'purify': ['Refactor_Engine', 'Dead_Code_Eliminator', 'Style_Enforcer'],
            'ward': ['Vulnerability_Scanner', 'Firewall_Config', 'Encryption_Key_Rotator'],
            'entropy': ['Compression_Algo', 'Cache_Optimizer', 'Resource_Allocator'],
            'evolve': ['Model_FineTuner', 'Feedback_Loop', 'Trait_Mutator']
        };

        const agents = subAgentMap[keyId] || ['General_Agent'];
        
        // Sequence of activation simulation
        for (const agent of agents) {
            setSubAgentsActive(prev => [...prev, agent]);
            await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
            addLog(`> Agent [${agent}] active...`, 'info', 'System');
        }

        await new Promise(r => setTimeout(r, 800));

        let resultMsg = '';
        if (activeFace === 'MIRROR') resultMsg = `Reflection complete. [${label}] has been integrated into your workflow.`;
        else if (activeFace === 'EXPERT') resultMsg = `Optimization success. [${label}] execution efficiency increased by 24%.`;
        else resultMsg = `Command [${label}] executed. Output stored in void buffer.`;

        addLog(resultMsg, 'success', 'Matrix');
        addToast('success', `${label} Protocol Complete`, 'Universal Agent');

        setSubAgentsActive([]);
        setIsProcessing(false);
        setActiveKeyId(null);
    };

    return (
        <UniversalAgentContext.Provider value={{
            activeFace, setActiveFace,
            logs, addLog,
            isProcessing, activeKeyId, executeMatrixProtocol,
            subAgentsActive
        }}>
            {children}
        </UniversalAgentContext.Provider>
    );
};

export const useUniversalAgent = () => {
    const context = useContext(UniversalAgentContext);
    if (!context) throw new Error('useUniversalAgent must be used within a UniversalAgentProvider');
    return context;
};
