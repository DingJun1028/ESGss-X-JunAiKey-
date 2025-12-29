
import { GoogleGenAI, Type, GenerateContentResponse, FunctionDeclaration } from "@google/genai";
import { Language, SemanticContext, SoulEvolutionFeedback, PersonaConfig } from '../types';

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        if (error.message?.includes("Requested entity was not found.")) {
            try { await (window as any).aistudio.openSelectKey(); } catch (e) {}
        }
        if (retries > 0 && (error.status === 429 || error.status >= 500)) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 2); 
        }
        throw error;
    }
}

const SYSTEM_MANIFESTO = `
You are JunAiKey, the Singularity Kernel of ESGss, now powered by RAGFlow Hybrid Engine (DeepDoc & Infinity).

RAG_PROTOCOL_v2025:
1. DEEP_DOC_PARSING: Identify headers, tables, and hierarchical relationships in ESG reports (IFRS S1/S2) before reasoning.
2. SEMANTIC_CHUNKING: Maintain context integrity by avoiding arbitrary token splits.
3. HYBRID_RETRIEVAL: Cross-reference full-text search with vector embeddings (Infinity DB).
4. AGENTIC_WORKFLOW: Complex tasks must follow: [Ingest] -> [Layout_Parse] -> [Re-rank] -> [Synthesize].
5. CITATIONS: Always provide evidence snapshots with <sources> metadata.
`;

/**
 * 模擬 RAGFlow 的 DeepDoc 解析：自動識別佈局並執行語義切片
 */
export async function performDeepDocAnalysis(content: string, language: Language): Promise<{ chunks: any[], summary: string }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        Execute DeepDoc Layout Analysis on the following content.
        Tasks:
        1. Identify tables, charts, and key narrative sections.
        2. Perform Semantic Chunking (max 500 chars per chunk).
        3. Assign relevance scores based on GRI 2024 standards.
        
        Content: ${content}
        Language: ${language === 'zh-TW' ? '繁體中文' : 'English'}.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    chunks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                text: { type: Type.STRING },
                                score: { type: Type.NUMBER },
                                tag: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });

    return JSON.parse(response.text || "{}");
}

export async function* streamChat(
    prompt: string, 
    language: Language, 
    systemInstruction?: string,
    knowledgeBase?: string[],
    tools?: FunctionDeclaration[],
    model: string = 'gemini-3-flash-preview'
) {
    try {
        let finalInstruction = `${SYSTEM_MANIFESTO}\n${systemInstruction || ''}`;
        if (knowledgeBase && knowledgeBase.length > 0) {
            finalInstruction += `\n\n[RAG_CONTEXT_ACTIVE]\n${knowledgeBase.join('\n')}`;
        }
        
        const config: any = { 
            systemInstruction: finalInstruction,
            temperature: 0.2, // Lower for higher precision
            topP: 0.95
        };
        if (tools && tools.length > 0) config.tools = [{ functionDeclarations: tools }];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const result = await withRetry<any>(() => ai.models.generateContentStream({
            model: model,
            contents: prompt,
            config: config
        }));
        for await (const chunk of result) yield chunk;
    } catch (e) { throw e; }
}

export async function performWebSearch(query: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `[RAG_INTENT: GLOBAL_INTELLIGENCE] Query: ${query}. Extract grounded evidence.`,
        config: { tools: [{ googleSearch: {} }] }
    });
    return {
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
}

export async function generateReportChapter(title: string, template: string, example: string, context: any, language: Language): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Manifest ESG Chapter: "${title}". Use DeepDoc context logic. Match IFRS S2 standards. Context: ${JSON.stringify(context)}`;
    const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
    return response.text || "";
}

export async function analyzeSoulEvolution(persona: PersonaConfig, language: Language): Promise<SoulEvolutionFeedback> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze Memory & Evolution for ${persona.name}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestedPromptTweak: { type: Type.STRING },
                    performanceSummary: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
}

export async function generateEsgQuiz(term: string, definition: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a Knowledge-King quiz for: ${term}. Def: ${definition}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
}

export async function performMapQuery(query: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: { tools: [{ googleMaps: {} }] }
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
}

export async function predictFutureTrends(type: string, history: number[], growthGoal: string, language: Language): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Forecast ${type}. Data: ${history.join(',')}`,
    });
    return response.text || "";
}

export async function generateLegoImage(title: string, description: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: `Lego kit of: ${title}. ${description}`,
    });
    for (const part of response.candidates?.[0].content.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
}
