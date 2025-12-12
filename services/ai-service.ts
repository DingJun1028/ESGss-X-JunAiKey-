
import { GoogleGenAI, Type, GenerateContentResponse, FunctionDeclaration } from "@google/genai";
import { Language, SemanticContext } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Robustness: Retry Logic ---
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0 && (error.status === 429 || error.status >= 500)) {
            console.warn(`[AI Service] Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 2); // Exponential backoff
        }
        throw error;
    }
}

// --- Image Generation ---

/**
 * Uses Gemini 3 Pro Image (Preview) for high-quality Lego art.
 */
export const generateLegoImage = async (cardTitle: string, cardDesc: string): Promise<string | null> => {
    try {
        const prompt = `Create a LEGO brick art image for the concept: "${cardTitle}" - ${cardDesc}. 
        The image should feature a central LEGO model built from colorful bricks, representing the ESG concept (Environmental, Social, or Governance).
        Style: Isometric view, 3D render, studio lighting, clean background, high detail LEGO texture.`;

        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: "1:1",
                    imageSize: "1K"
                }
            }
        }));

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Lego Gen Error", e);
        return null;
    }
};

// --- Text & Chat ---

export async function* streamChat(
    prompt: string, 
    language: Language, 
    systemInstruction?: string,
    knowledgeBase?: string[],
    tools?: FunctionDeclaration[],
    model: string = 'gemini-2.5-flash',
    thinkingBudget?: number
) {
    try {
        let finalInstruction = systemInstruction || '';

        // If Knowledge Base is present, construct RAG Logic
        if (knowledgeBase && knowledgeBase.length > 0) {
            const kbContent = knowledgeBase.join('\n\n');
            
            // Extract persona name if available in instruction
            const personaNameMatch = systemInstruction?.match(/You are (.*?)[.,]/) || systemInstruction?.match(/你是(.*?)[，。]/);
            const personaName = personaNameMatch ? personaNameMatch[1] : 'AI Assistant';

            finalInstruction = `
${systemInstruction}

[KNOWLEDGE BASE ACTIVATED]
The user has provided the following specific knowledge context. You must prioritize this information.

--- START KNOWLEDGE BASE ---
${kbContent.substring(0, 100000)} 
--- END KNOWLEDGE BASE ---

[STRICT RESPONSE RULES]
1. First, search the "KNOWLEDGE BASE" above for the answer to the user's query.
2. If the answer is found within the Knowledge Base, answer clearly using that information.
3. If the specific event or information is NOT found in the Knowledge Base:
   - You MUST explicitly state: "抱歉，知識庫中未找到關於此事件的具體資訊。" (Sorry, specific information about this event was not found in the knowledge base.)
   - THEN, proceed to offer help or answer generally based on your persona as ${personaName}.
`;
        }

        const config: any = {
            systemInstruction: finalInstruction,
        };

        if (tools && tools.length > 0) {
            config.tools = [{ functionDeclarations: tools }];
        }

        // Apply Thinking Config if budget provided (Only for supported models)
        if (thinkingBudget && (model.includes('gemini-2.5') || model.includes('gemini-3-pro'))) {
            config.thinkingConfig = { thinkingBudget };
        }

        // We wrap the *initiation* of the stream with retry, but handling stream errors mid-flight is harder
        // and usually handled by the consumer's error boundary.
        const result = await withRetry<any>(() => ai.models.generateContentStream({
            model: model,
            contents: prompt,
            config: config
        }));
        
        for await (const chunk of result) {
            yield chunk;
        }
    } catch (e) {
        console.error("Stream Chat Error", e);
        throw e;
    }
}

// --- Analysis & Insights ---

export const analyzeDataAnomaly = async (label: string, value: string | number, baseline: string, context: string, language: Language) => {
    const prompt = `Analyze this data point anomaly:
    Metric: ${label}
    Current Value: ${value}
    Baseline/Expectation: ${baseline}
    Context: ${context}
    Language: ${language}
    
    Provide a brief, 1-sentence strategic insight or root cause hypothesis.`;

    try {
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        }));
        return response.text;
    } catch (e) {
        console.error("Anomaly Analysis Failed", e);
        return; 
    }
};

export const generateLightInterpretation = async (metrics: any[], language: Language) => {
    const prompt = `Interpret the following ESG metrics into a 'Spectral Analysis' metaphor.
    Metrics: ${JSON.stringify(metrics)}
    Language: ${language}
    
    Return JSON:
    {
      "coreFrequency": string (e.g. "432Hz"),
      "spectrum": [
        { "color": "emerald"|"amber"|"purple"|"blue"|"rose", "wavelength": string, "intensity": "High"|"Medium"|"Low", "insight": string }
      ]
    }
    `;
    
    try {
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        }));
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return {
            coreFrequency: '432Hz',
            spectrum: [
                { color: 'emerald', wavelength: '520nm', intensity: 'High', insight: 'Strong environmental performance detected.' },
                { color: 'amber', wavelength: '590nm', intensity: 'Medium', insight: 'Social engagement metrics stabilizing.' },
                { color: 'purple', wavelength: '400nm', intensity: 'Low', insight: 'Governance structure requires optimization.' }
            ]
        };
    }
};

export const performLocalRAG = async (query: string, language: Language) => {
    const prompt = `Answer the following query using available knowledge. Query: ${query}`;
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    }));
    return {
        text: response.text || "No relevant information found.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

export const performWebSearch = performLocalRAG; // Alias

export const quantizeData = async (input: string, language: Language) => {
    const prompt = `Deconstruct the following text into 'Knowledge Atoms' (Concepts) for a Knowledge Graph.
    Input Text: "${input}"
    Language: ${language}
    
    Return a JSON array of objects. Each object must have:
    - id: string (unique id, e.g. "q-123")
    - atom: string (the main concept name)
    - vector: string[] (2-3 related keywords or semantic vectors)
    - weight: number (0.1 to 1.0 importance)
    - connections: string[] (empty array)
    
    Limit to 5-8 nodes.`;

    try {
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        }));
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (e) {
        console.error("Quantization Failed", e);
        return [
            { id: `q-${Date.now()}-1`, atom: 'Scope 1', vector: ['Direct', 'Fuel'], weight: 0.9, connections: [] },
            { id: `q-${Date.now()}-2`, atom: 'Scope 2', vector: ['Indirect', 'Electricity'], weight: 0.85, connections: [] },
            { id: `q-${Date.now()}-3`, atom: 'Scope 3', vector: ['Value Chain', 'Upstream'], weight: 0.7, connections: [] }
        ];
    }
};

export const inferSemanticContext = async (query: string, language: Language): Promise<SemanticContext> => {
    return {
        intent: 'exploration',
        keywords: query.split(' ').filter(w => w.length > 3),
        requiredConfidence: 0.8
    };
};

export const generateAgentDebate = async (topic: string, language: Language) => {
    const prompt = `Simulate a debate between a CSO (Chief Sustainability Officer) and a CFO (Chief Financial Officer) regarding: "${topic}".
    Return a JSON array of messages (approx 4-6 turns): [{ "role": "CSO" | "CFO", "text": "..." }].
    Ensure the debate is professional but highlights the conflict between cost and sustainability.
    Language: ${language}`;

    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    }));
    
    try {
        return JSON.parse(response.text || "[]");
    } catch {
        return [{ role: 'CSO', text: 'Analysis failed.' }];
    }
};

// --- Report Generation ---

export const generateReportChapter = async (title: string, template: string, example: string, context: any, language: Language) => {
    const prompt = `Write a sustainability report chapter titled "${title}".
    Context: ${JSON.stringify(context)}
    Template: ${template}
    Language: ${language}
    Tone: Professional, Data-driven, GRI Compliant.`;
    
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    }));
    return response.text || "";
};

export const auditReportContent = async (title: string, content: string, standards: string, language: Language) => {
    const prompt = `Audit the following report content against ${standards}.
    Title: ${title}
    Content: ${content}
    Provide a brief audit summary and list missing requirements in Markdown.`;
    
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    }));
    return response.text || "Audit complete.";
};

// --- Tools & Utilities ---

export const performMapQuery = async (query: string, language: Language) => {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find information and location details for: ${query}`,
        config: { tools: [{ googleSearch: {} }] }
    }));
    
    return {
        text: response.text || "Location details not found.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

export const predictFutureTrends = async (metric: string, history: number[], context: string, language: Language) => {
    const prompt = `Perform a predictive analysis for: ${metric}.
    Historical Data: ${JSON.stringify(history)}
    Context: ${context}
    Language: ${language}
    
    Perform a Monte Carlo simulation (conceptual).
    Return a JSON object with:
    - trend: "up" | "down" | "stable"
    - confidence: number (0-100)
    - nextValues: number[] (next 3 predicted values)
    - insight: string (brief explanation)
    `;

    try {
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        }));
        return JSON.parse(response.text || "{}");
    } catch (e) {
        console.error("Prediction Failed", e);
        return { trend: 'stable', confidence: 0, nextValues: [], insight: 'Prediction unavailable.' };
    }
};

const fileToPart = (file: File): Promise<any> => new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve({ inlineData: { data: (reader.result as string).split(',')[1], mimeType: file.type } });
    reader.readAsDataURL(file);
});

export const verifyQuestImage = async (questTitle: string, questDesc: string, file: File, language: Language) => {
    try {
        const imagePart = await fileToPart(file);
        const prompt = `Verify if this image satisfies the quest: "${questTitle}" - ${questDesc}. 
        Return strictly JSON: { "success": boolean, "reason": "string" }`;
        
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: { responseMimeType: 'application/json' }
        }));
        return JSON.parse(response.text || '{"success": false, "reason": "AI could not verify."}');
    } catch (e) {
        return { success: false, reason: "Verification error." };
    }
};

export const generateEsgQuiz = async (term: string, definition: string, language: Language) => {
    const prompt = `Create a multiple choice quiz question for the ESG term: "${term}" (${definition}).
    Return strictly JSON: { "question": "string", "options": ["string"], "correctIndex": number, "explanation": "string" }
    Language: ${language}`;
    
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    }));
    
    return JSON.parse(response.text || "{}");
};
